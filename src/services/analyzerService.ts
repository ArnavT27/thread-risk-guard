import { AnalysisResult, RiskLevel, Message } from "@/types/analysis";
import { sanitizeInput, logSecurityEvent } from "@/utils/securityUtils";

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
  const suspiciousWords = [
    "urgent", "password", "account", "verify", "immediately", 
    "login", "security", "bank", "click", "link", "credentials",
    "validate", "confirm", "suspended", "prize", "won", "free",
    "access", "update", "information", "personal", "required",
    "lottery", "invoice", "payment", "cryptocurrency", "wallet"
  ];
  
  const foundSuspiciousWords = suspiciousWords.filter(word => 
    content.toLowerCase().includes(word)
  );
  
  let riskScore = Math.min(foundSuspiciousWords.length * 0.2, 0.9);
  
  riskScore += Math.random() * 0.1;
  
  let riskLevel: RiskLevel = "low";
  if (riskScore > 0.8) {
    riskLevel = "high";
  } else if (riskScore > 0.5) {
    riskLevel = "medium";
  }
  
  const flags: string[] = [];
  const contentLower = content.toLowerCase();
  
  if (foundSuspiciousWords.length > 0) {
    flags.push(`Contains suspicious keywords: ${foundSuspiciousWords.join(', ')}`);
  }

  if (content.includes("http://") || content.includes("https://")) {
    flags.push("Contains URL");
    if (content.includes("http://")) {
      flags.push("Uses insecure HTTP protocol");
    }
    if (content.match(/bit\.ly|tinyurl|goo\.gl|t\.co/i)) {
      flags.push("Uses URL shortener (potentially hiding malicious link)");
    }
  }

  if (content.includes("@") && content.match(/\S+@\S+\.\S+/)) {
    flags.push("Contains email address");
    if (content.match(/\.(ru|cn|tk|top|xyz|pw)\b/i)) {
      flags.push("Contains email from suspicious domain");
    }
  }

  const urgencyPatterns = [
    /urgent|asap|immediately|quick|hurry|emergency/i,
    /before it( is|'s) too late/i,
    /last chance|deadline|expires?( soon| today| tomorrow)?/i
  ];
  
  if (urgencyPatterns.some(pattern => pattern.test(content))) {
    flags.push("Creates artificial time pressure");
  }

  const authorityPatterns = [
    /\b(ceo|cfo|manager|supervisor|admin|administrator|support|helpdesk)\b/i,
    /\b(IT|tech|technical|system|security) (team|department|staff)\b/i
  ];
  
  if (authorityPatterns.some(pattern => pattern.test(content))) {
    flags.push("Potential authority impersonation");
  }

  const financialPatterns = [
    /\b(money|payment|transfer|account|bank|credit|debit|wire)\b/i,
    /\b(bitcoin|crypto|wallet|eth|btc)\b/i,
    /\b(reward|prize|won|winner|claim|cash)\b/i
  ];
  
  if (financialPatterns.some(pattern => pattern.test(content))) {
    flags.push("Contains financial manipulation");
  }

  const personalInfoPatterns = [
    /\b(ssn|social security|passport|license|id number)\b/i,
    /\b(username|password|credentials|login|verify)\b/i,
    /\b(date of birth|address|phone|credit card)\b/i
  ];
  
  if (personalInfoPatterns.some(pattern => pattern.test(content))) {
    flags.push("Requests sensitive personal information");
  }

  const emotionalPatterns = [
    /\b(help|support|trouble|worried|concerned)\b/i,
    /\b(friend|family|loved one|dear|honey)\b/i,
    /\b(sorry|apologize|regret|unfortunate)\b/i
  ];
  
  if (emotionalPatterns.some(pattern => pattern.test(content))) {
    flags.push("Potential emotional manipulation");
  }

  riskScore = Math.min(riskScore + (flags.length * 0.1), 1);
  
  if (riskScore > 0.8) {
    riskLevel = "high";
  } else if (riskScore > 0.5) {
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
  let sessionId = localStorage.getItem('session_id');
  
  if (!sessionId) {
    sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    localStorage.setItem('session_id', sessionId);
  }
  
  return sessionId;
}
