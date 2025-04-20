
export const socialEngineeringPatterns = {
  pretexting: [
    /\b(IT|tech|support|helpdesk|administrator|admin)\b.*?\b(need|require|verify|confirm)\b/i,
    /\b(password|credentials|access|verification)\b.*?\b(required|needed|expired|reset)\b/i,
    /\b(verify|confirm|authenticate|validate)\b.*?\b(identity|account|yourself)\b/i,
    /\b(system|security|network)\b.*?\b(update|maintenance|check)\b/i
  ],
  
  urgency: [
    /\b(urgent|asap|immediately|quick|hurry|emergency)\b/i,
    /\b(before|expires?|deadline)\b.*?\b(soon|today|tomorrow|minutes?|hours?)\b/i,
    /\b(time.*?running.*?out|last chance|limited time|act now|don'?t wait)\b/i,
    /\b(critical|emergency|immediate action|right now|cannot wait)\b/i
  ],
  
  authority: [
    /\b(CEO|CFO|CTO|supervisor|boss|manager)\b.*?\b(asked|requested|needs|wants|demands)\b/i,
    /\b(corporate|executive|management|board)\b.*?\b(directive|policy|requirement)\b/i,
    /\b(compliance|audit|mandatory|protocol|procedure)\b/i,
    /\b(legal|regulation|policy|requirement)\b.*?\b(violation|breach|compliance)\b/i
  ],
  
  curiosity: [
    /\b(won'?t believe|guess what|check.*?out|look.*?what|amazing|interesting)\b/i,
    /\b(discovered|found|shocking|surprising|unbelievable)\b/i,
    /\b(secret|exclusive|insider|confidential|private)\b.*?\b(info|information|news)\b/i,
    /\b(leaked|unreleased|preview|sneak.*?peek)\b/i
  ],
  
  scarcity: [
    /\b(only|just)\b.*?\b(\d+)\b.*?\b(left|remaining|available)\b/i,
    /\b(limited|exclusive|special)\b.*?\b(offer|opportunity|access|time)\b/i,
    /\b(expires?|ending|closing)\b.*?\b(soon|today|tomorrow)\b/i,
    /\b(one-time|never again|last chance|final opportunity)\b/i
  ],
  
  manipulation: [
    /\b(don'?t.*?trust|no.*?trust|trust.*?issues?)\b/i,
    /\b(thought|believed|expected)\b.*?\b(better|friend|colleague|professional)\b/i,
    /\b(disappointed|shame|guilt|regret)\b/i,
    /\b(let.*?down|counting.*?on.*?you|depending.*?on.*?you)\b/i,
    /\b(help.*?me|favor|please|need.*?you)\b.*?\b(urgent|important|critical)\b/i
  ]
};

export const suspiciousWords = [
  // Financial terms
  "payment", "transfer", "bank", "account", "crypto", "bitcoin", "wallet",
  
  // Credentials
  "password", "login", "credentials", "authentication", "verify", "validation",
  
  // Urgency
  "urgent", "immediate", "asap", "emergency", "deadline", "expires",
  
  // Security
  "security", "breach", "hack", "compromise", "suspicious", "unauthorized",
  
  // Personal info
  "ssn", "social security", "credit card", "passport", "license", "identity",
  
  // Action words
  "click", "download", "confirm", "verify", "update", "validate",
  
  // Authority
  "ceo", "manager", "supervisor", "hr", "it department", "administrator",
  
  // Rewards
  "won", "winner", "prize", "reward", "gift", "free", "congratulations",
  
  // Documents
  "invoice", "document", "attachment", "file", "report", "statement"
];

