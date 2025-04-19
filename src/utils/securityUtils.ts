/**
 * Security utility functions for ThreadRiskGuard application
 */

// Rate limiting implementation
interface RateLimitTracker {
  count: number;
  lastReset: number;
}

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const MAX_CALLS_PER_WINDOW = 5; // Maximum 5 analysis requests per minute
const rateLimitStorage = new Map<string, RateLimitTracker>();

/**
 * Sanitize input text to prevent XSS attacks
 * @param input - The input text to sanitize
 * @returns Sanitized text
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";
  
  // Strip HTML tags
  const withoutTags = input.replace(/<[^>]*>?/gm, "");
  
  // Strip potential script content
  const withoutScripts = withoutTags.replace(/javascript:/gi, "");
  
  // Strip potential dangerous attributes
  const withoutDangerousAttrs = withoutScripts.replace(/on\w+=/gi, "");
  
  return withoutDangerousAttrs;
}

/**
 * Sanitize filename
 * @param filename - The filename to sanitize
 * @returns Sanitized filename
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return "";
  
  // Remove path traversal attempts and invalid characters
  return filename
    .replace(/\.\.\//g, "")
    .replace(/[/\\?%*:|"<>]/g, "-")
    .trim();
}

/**
 * Validate file type
 * @param file - The file to validate
 * @param allowedTypes - Array of allowed MIME types
 * @param maxSize - Maximum file size in bytes
 * @returns Boolean indicating if file is valid
 */
export function validateFile(
  file: File, 
  allowedTypes: string[], 
  maxSize: number
): { valid: boolean; message?: string } {
  // Check file size
  if (file.size > maxSize) {
    return { 
      valid: false, 
      message: `File too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB.` 
    };
  }
  
  // Check file type
  const fileType = file.type.toLowerCase();
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (
    !allowedTypes.includes(fileType) && 
    !allowedTypes.some(type => type.endsWith(extension || ""))
  ) {
    return { 
      valid: false, 
      message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` 
    };
  }
  
  return { valid: true };
}

/**
 * Check if request is rate limited
 * @param identifier - Unique identifier for the request source (e.g., session ID)
 * @returns Boolean indicating if request should be rate limited
 */
export function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const tracker = rateLimitStorage.get(identifier) || { count: 0, lastReset: now };
  
  // Reset counter if window has passed
  if (now - tracker.lastReset > RATE_LIMIT_WINDOW) {
    tracker.count = 1;
    tracker.lastReset = now;
    rateLimitStorage.set(identifier, tracker);
    return false;
  }
  
  // Increment counter
  tracker.count++;
  rateLimitStorage.set(identifier, tracker);
  
  // Check if over limit
  return tracker.count > MAX_CALLS_PER_WINDOW;
}

/**
 * Log security event
 * @param event - Event to log
 */
export function logSecurityEvent(event: {
  type: 'RATE_LIMIT' | 'INVALID_FILE' | 'SUSPICIOUS_INPUT' | 'ANALYSIS';
  identifier: string;
  details?: string;
}): void {
  // In a real application, this would log to a secure storage or monitoring service
  const timestamp = new Date().toISOString();
  const anonymizedId = hashIdentifier(event.identifier);
  
  console.log(`[SECURITY] ${timestamp} | ${event.type} | ID: ${anonymizedId} | ${event.details || ''}`);
  
  // In production, you would store this in localStorage or send to a server
  const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
  securityLogs.push({
    timestamp,
    type: event.type,
    anonymizedId,
    details: event.details
  });
  
  // Keep only the last 100 logs
  if (securityLogs.length > 100) {
    securityLogs.shift();
  }
  
  localStorage.setItem('security_logs', JSON.stringify(securityLogs));
}

/**
 * Hash an identifier for anonymization
 * @param identifier - The identifier to hash
 * @returns Hashed identifier
 */
function hashIdentifier(identifier: string): string {
  // Simple hash function for demo purposes
  // In production, use a proper cryptographic hash
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    const char = identifier.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}
