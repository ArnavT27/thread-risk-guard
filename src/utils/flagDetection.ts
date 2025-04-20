
import { socialEngineeringPatterns, suspiciousWords } from './socialEngineeringPatterns';

export function detectFlags(content: string): string[] {
  const flags: string[] = [];
  
  // Check for social engineering patterns
  for (const [technique, patterns] of Object.entries(socialEngineeringPatterns)) {
    const matchedPatterns = patterns.filter(pattern => pattern.test(content));
    if (matchedPatterns.length > 0) {
      switch (technique) {
        case 'pretexting':
          flags.push("🎭 Impersonating IT/Support Staff");
          flags.push("⚠️ Requesting Sensitive Information");
          flags.push("👤 False Identity Claims");
          break;
        case 'urgency':
          flags.push("⚡ Artificial Time Pressure");
          flags.push("⏰ Urgent Action Required");
          flags.push("🚨 Emergency-Based Manipulation");
          break;
        case 'authority':
          flags.push("👔 Authority Figure Impersonation");
          flags.push("📋 False Management Directives");
          flags.push("💼 Corporate Authority Abuse");
          break;
        case 'curiosity':
          flags.push("🎣 Clickbait Tactics");
          flags.push("🔍 Exploiting Natural Curiosity");
          flags.push("🎯 Targeted Interest Manipulation");
          break;
        case 'scarcity':
          flags.push("⌛ Time-Limited Offer");
          flags.push("📊 Limited Availability Claims");
          flags.push("💫 FOMO Manipulation");
          break;
        case 'manipulation':
          flags.push("💔 Emotional Manipulation");
          flags.push("🤝 Trust Exploitation");
          flags.push("😔 Guilt/Shame Tactics");
          break;
      }
    }
  }

  // URL checks with more specific flags
  if (content.includes("http://") || content.includes("https://")) {
    flags.push("🔗 Contains External URL");
    
    if (content.includes("http://")) {
      flags.push("⚠️ Insecure HTTP Protocol");
    }
    
    if (content.match(/bit\.ly|tinyurl|goo\.gl|t\.co/i)) {
      flags.push("🔗 Suspicious URL Shortener");
      flags.push("🕵️ Hidden Destination URL");
    }
    
    if (content.match(/login|signin|account|verify|password/i)) {
      flags.push("🎣 Potential Phishing URL");
    }
  }

  // Email checks with more detailed flags
  if (content.includes("@") && content.match(/\S+@\S+\.\S+/)) {
    flags.push("📧 Contains Email Address");
    
    if (content.match(/\.(ru|cn|tk|top|xyz|pw)\b/i)) {
      flags.push("⚠️ Suspicious Email Domain");
      flags.push("🌍 High-Risk Country TLD");
    }
    
    if (content.match(/support|help|admin|security|verify/i)) {
      flags.push("👤 Suspicious Sender Role");
    }
  }

  // Financial manipulation checks
  if (content.match(/money|payment|transfer|crypto|bitcoin|wallet|bank/i)) {
    flags.push("💰 Financial Manipulation");
    flags.push("🏦 Banking/Payment Related");
  }

  // Personal information requests
  if (content.match(/ssn|social security|credit card|cvv|passport|license/i)) {
    flags.push("🔒 Personal Info Request");
    flags.push("🚫 Sensitive Data Risk");
  }

  // Attachment or download flags
  if (content.match(/download|attach|file|document|invoice|report/i)) {
    flags.push("📎 Contains Attachment Reference");
    flags.push("📁 File Download Request");
  }

  return flags;
}

export function calculateRiskScore(content: string, flags: string[]): number {
  const foundSuspiciousWords = suspiciousWords.filter(word => 
    content.toLowerCase().includes(word)
  );

  let riskScore = Math.min((flags.length * 0.15) + (foundSuspiciousWords.length * 0.1), 0.95);
  
  if (flags.some(f => f.includes("pretexting")) && flags.some(f => f.includes("urgency"))) {
    riskScore += 0.2; // Pretexting + Urgency is a dangerous combination
  }
  
  if (flags.some(f => f.includes("authority")) && flags.some(f => f.includes("manipulation"))) {
    riskScore += 0.15; // Authority + Emotional manipulation is concerning
  }

  return Math.min(riskScore, 1); // Cap at 1.0
}

