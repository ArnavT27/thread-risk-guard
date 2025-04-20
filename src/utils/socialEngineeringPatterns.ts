
export const socialEngineeringPatterns = {
  pretexting: [
    /\b(IT|tech|support|helpdesk|administrator|admin)\b.*?\b(need|require|verify|confirm)\b/i,
    /\b(password|credentials|access|verification)\b.*?\b(required|needed|expired|reset)\b/i,
    /\b(verify|confirm|authenticate|validate)\b.*?\b(identity|account|yourself)\b/i
  ],
  
  urgency: [
    /\b(urgent|asap|immediately|quick|hurry|emergency)\b/i,
    /\b(before|expires?|deadline)\b.*?\b(soon|today|tomorrow|minutes?|hours?)\b/i,
    /\b(time.*?running.*?out|last chance|limited time|act now|don'?t wait)\b/i
  ],
  
  authority: [
    /\b(CEO|CFO|CTO|supervisor|boss|manager)\b.*?\b(asked|requested|needs|wants|demands)\b/i,
    /\b(corporate|executive|management|board)\b.*?\b(directive|policy|requirement)\b/i,
    /\b(compliance|audit|mandatory|protocol|procedure)\b/i
  ],
  
  curiosity: [
    /\b(won'?t believe|guess what|check.*?out|look.*?what|amazing|interesting)\b/i,
    /\b(discovered|found|shocking|surprising|unbelievable)\b/i,
    /\b(secret|exclusive|insider|confidential|private)\b.*?\b(info|information|news)\b/i
  ],
  
  scarcity: [
    /\b(only|just)\b.*?\b(\d+)\b.*?\b(left|remaining|available)\b/i,
    /\b(limited|exclusive|special)\b.*?\b(offer|opportunity|access|time)\b/i,
    /\b(expires?|ending|closing)\b.*?\b(soon|today|tomorrow)\b/i
  ],
  
  manipulation: [
    /\b(don'?t.*?trust|no.*?trust|trust.*?issues?)\b/i,
    /\b(thought|believed|expected)\b.*?\b(better|friend|colleague|professional)\b/i,
    /\b(disappointed|shame|guilt|regret)\b/i,
    /\b(let.*?down|counting.*?on.*?you|depending.*?on.*?you)\b/i
  ]
};

export const suspiciousWords = [
  "urgent", "password", "account", "verify", "immediately", 
  "login", "security", "bank", "click", "link", "credentials",
  "validate", "confirm", "suspended", "prize", "won", "free",
  "access", "update", "information", "personal", "required",
  "lottery", "invoice", "payment", "cryptocurrency", "wallet"
];

