
import { AnalysisResult, RiskLevel, Message } from "@/types/analysis";
import { sanitizeInput, logSecurityEvent } from "@/utils/securityUtils";

// This is a mock service that would typically communicate with a backend API
// In a production application, this would make API calls to a server

/**
 * Analyze chat messages for social engineering threats
 * @param input - The raw chat text to analyze
 * @returns Promise resolving to analysis results
 */
export async function analyzeChatMessages(input: string): Promise<AnalysisResult> {
  // Sanitize input
  const sanitizedInput = sanitizeInput(input);
  
  // Log analysis event (anonymized)
  logSecurityEvent({
    type: 'ANALYSIS',
    identifier: generateSessionId(),
    details: `Analyzed ${sanitizedInput.length} characters`
  });
  
  // In a real application, this would call an API with the AI model
  // For demo purposes, we'll simulate the analysis result
  
  // Split input into individual messages
  const messages = sanitizedInput.split('\n')
    .filter(line => line.trim().length > 0)
    .map((line, index) => analyzeMessage(line, index));
  
  // Calculate summary stats
  const highRiskCount = messages.filter(m => m.riskLevel === "high").length;
  const mediumRiskCount = messages.filter(m => m.riskLevel === "medium").length;
  const lowRiskCount = messages.filter(m => m.riskLevel === "low").length;
  
  // Calculate overall risk
  const overallRisk = messages.reduce((sum, msg) => {
    switch (msg.riskLevel) {
      case "high": return sum + 3;
      case "medium": return sum + 2;
      case "low": return sum + 1;
      default: return sum;
    }
  }, 0) / messages.length;
  
  // Create analysis result
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
  // This is where we would use AI model results
  // For the demo, we'll use keyword-based analysis
  
  // Check for common phishing/social engineering keywords
  const suspiciousWords = [
    "urgent", "password", "account", "verify", "immediately", 
    "login", "security", "bank", "click", "link", "credentials",
    "validate", "confirm", "suspended", "prize", "won", "free",
    "access", "update", "information", "personal", "required",
    "lottery", "invoice", "payment", "cryptocurrency", "wallet"
  ];
  
  // Check if message contains suspicious words
  const foundSuspiciousWords = suspiciousWords.filter(word => 
    content.toLowerCase().includes(word)
  );
  
  // Calculate initial risk score based on suspicious words
  let riskScore = Math.min(foundSuspiciousWords.length * 0.2, 0.9);
  
  // Add randomness for demonstration
  riskScore += Math.random() * 0.1;
  
  // Determine risk level
  let riskLevel: RiskLevel = "low";
  if (riskScore > 0.8) {
    riskLevel = "high";
  } else if (riskScore > 0.5) {
    riskLevel = "medium";
  }
  
  // Determine flags
  const flags: string[] = [];
  if (foundSuspiciousWords.length > 0) {
    flags.push(`Contains suspicious keywords: ${foundSuspiciousWords.join(', ')}`);
  }
  
  if (content.includes("http://") || content.includes("https://")) {
    flags.push("Contains URL");
    // Increase risk for URL if already suspicious
    if (riskScore > 0.3) {
      riskScore += 0.1;
      if (riskScore > 1) riskScore = 1;
      if (riskScore > 0.8) riskLevel = "high";
    }
  }
  
  if (content.includes("@") && content.match(/\S+@\S+\.\S+/)) {
    flags.push("Contains email address");
  }
  
  // Generate intent and sentiment
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

/**
 * Determine message intent
 * @param content - Message content
 * @returns Intent classification
 */
function determineIntent(content: string): string {
  const content_lower = content.toLowerCase();
  
  if (content_lower.includes("?")) {
    return "question";
  }
  
  if (content_lower.includes("please") || content_lower.includes("could you") || content_lower.includes("can you")) {
    return "request";
  }
  
  if (content_lower.includes("must") || content_lower.includes("immediately") || content_lower.includes("urgent")) {
    return "demand";
  }
  
  if (content_lower.includes("warn") || content_lower.includes("alert") || content_lower.includes("attention")) {
    return "warning";
  }
  
  return "inform";
}

/**
 * Determine message sentiment
 * @param content - Message content
 * @returns Sentiment classification
 */
function determineSentiment(content: string): string {
  const content_lower = content.toLowerCase();
  
  const positive_words = ["thanks", "good", "great", "awesome", "appreciate", "happy"];
  const negative_words = ["bad", "wrong", "sorry", "issue", "problem", "trouble"];
  const urgent_words = ["urgent", "immediately", "asap", "emergency", "critical"];
  
  if (urgent_words.some(word => content_lower.includes(word))) {
    return "urgent";
  }
  
  if (positive_words.some(word => content_lower.includes(word))) {
    return "positive";
  }
  
  if (negative_words.some(word => content_lower.includes(word))) {
    return "negative";
  }
  
  return "neutral";
}

/**
 * Generate a session ID for tracking requests
 * @returns Session ID string
 */
function generateSessionId(): string {
  // Get existing session ID or create a new one
  let sessionId = localStorage.getItem('session_id');
  
  if (!sessionId) {
    sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    localStorage.setItem('session_id', sessionId);
  }
  
  return sessionId;
}
