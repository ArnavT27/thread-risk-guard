
/**
 * Determine message intent
 * @param content - Message content
 * @returns Intent classification
 */
export function determineIntent(content: string): string {
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
export function determineSentiment(content: string): string {
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

