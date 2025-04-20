
import { socialEngineeringPatterns, suspiciousWords } from './socialEngineeringPatterns';

export function detectFlags(content: string): string[] {
  const flags: string[] = [];
  
  // Check for social engineering patterns
  for (const [technique, patterns] of Object.entries(socialEngineeringPatterns)) {
    const matchedPatterns = patterns.filter(pattern => pattern.test(content));
    if (matchedPatterns.length > 0) {
      switch (technique) {
        case 'pretexting':
          flags.push("⚠️ Potential pretexting attempt (impersonating trusted role)");
          break;
        case 'urgency':
          flags.push("⚡ Creates artificial time pressure");
          break;
        case 'authority':
          flags.push("👔 Appeals to authority or hierarchical pressure");
          break;
        case 'curiosity':
          flags.push("🎣 Exploits curiosity or clickbait tactics");
          break;
        case 'scarcity':
          flags.push("⌛ Uses scarcity or FOMO tactics");
          break;
        case 'manipulation':
          flags.push("🎭 Emotional manipulation (guilt/shame/trust)");
          break;
      }
    }
  }

  // URL checks
  if (content.includes("http://") || content.includes("https://")) {
    flags.push("Contains URL");
    if (content.includes("http://")) {
      flags.push("Uses insecure HTTP protocol");
    }
    if (content.match(/bit\.ly|tinyurl|goo\.gl|t\.co/i)) {
      flags.push("Uses URL shortener (potentially hiding malicious link)");
    }
  }

  // Email checks
  if (content.includes("@") && content.match(/\S+@\S+\.\S+/)) {
    flags.push("Contains email address");
    if (content.match(/\.(ru|cn|tk|top|xyz|pw)\b/i)) {
      flags.push("Contains email from suspicious domain");
    }
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

