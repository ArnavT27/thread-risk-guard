
import { AnalysisResult, RiskLevel, Message } from "@/types/analysis";
import { sanitizeInput, logSecurityEvent } from "@/utils/securityUtils";
import { determineIntent, determineSentiment } from "@/utils/messageClassification";
import { detectFlags, calculateRiskScore } from "@/utils/flagDetection";

/**
 * Generate a session ID for tracking requests
 * @returns Session ID string
 */
function generateSessionId(): string {
  let sessionId = localStorage.getItem('session_id');
  
  if (!sessionId) {
    sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    localStorage.setItem('session_id', sessionId);
  }
  
  return sessionId;
}

/**
 * Analyze chat messages for social engineering threats
 * @param input - The raw chat text to analyze
 * @returns Promise resolving to analysis results
 */
export async function analyzeChatMessages(input: string): Promise<AnalysisResult> {
  const sanitizedInput = sanitizeInput(input);
  
  logSecurityEvent({
    type: 'ANALYSIS',
    identifier: generateSessionId(),
    details: `Analyzed ${sanitizedInput.length} characters`
  });
  
  const messages = sanitizedInput.split('\n')
    .filter(line => line.trim().length > 0)
    .map((line, index) => analyzeMessage(line, index));
  
  const highRiskCount = messages.filter(m => m.riskLevel === "high").length;
  const mediumRiskCount = messages.filter(m => m.riskLevel === "medium").length;
  const lowRiskCount = messages.filter(m => m.riskLevel === "low").length;
  
  const overallRisk = messages.reduce((sum, msg) => {
    switch (msg.riskLevel) {
      case "high": return sum + 3;
      case "medium": return sum + 2;
      case "low": return sum + 1;
      default: return sum;
    }
  }, 0) / messages.length;
  
  const result: AnalysisResult = {
    id: `analysis-${Date.now()}`,
    timestamp: new Date().toISOString(),
    messages,
    summary: {
      totalMessages: messages.length,
      highRiskCount,
      mediumRiskCount,
      lowRiskCount,
      overallRisk,
      overallRiskLevel: overallRisk > 2 ? "high" : overallRisk > 1.5 ? "medium" : "low",
    }
  };
  
  return result;
}

/**
 * Analyze a single message
 * @param content - The message content
 * @param index - Message index for ID generation
 * @returns Analyzed message
 */
function analyzeMessage(content: string, index: number): Message {
  const flags = detectFlags(content);
  const riskScore = calculateRiskScore(content, flags);
  
  let riskLevel: RiskLevel = "low";
  if (riskScore > 0.7) {
    riskLevel = "high";
  } else if (riskScore > 0.4) {
    riskLevel = "medium";
  }

  const intent = determineIntent(content);
  const sentiment = determineSentiment(content);
  
  return {
    id: `msg-${index}`,
    content,
    riskLevel,
    riskScore: riskScore.toFixed(2),
    intent,
    sentiment,
    flags,
    timestamp: new Date().toISOString(),
  };
}

