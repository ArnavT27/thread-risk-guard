
/**
 * Local data storage service for ThreadRiskGuard
 * 
 * This service handles local storage of analysis results and security logs.
 * In a production environment, this would typically use a backend database.
 */

import { AnalysisResult } from "@/types/analysis";

const ANALYSIS_HISTORY_KEY = 'thread_risk_guard_history';
const SECURITY_LOGS_KEY = 'thread_risk_guard_security_logs';
const MAX_HISTORY_ITEMS = 50;
const MAX_LOG_ITEMS = 100;

interface SecurityLog {
  timestamp: string;
  type: string;
  anonymizedId: string;
  details?: string;
}

/**
 * Save an analysis result to local storage
 * @param result Analysis result to save
 */
export function saveAnalysisResult(result: AnalysisResult): void {
  try {
    // Get existing history
    const history = getAnalysisHistory();
    
    // Add new result to the beginning
    history.unshift(result);
    
    // Limit the number of items
    if (history.length > MAX_HISTORY_ITEMS) {
      history.pop();
    }
    
    // Save back to storage
    localStorage.setItem(ANALYSIS_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving analysis result:', error);
  }
}

/**
 * Get analysis history from local storage
 * @returns Array of analysis results
 */
export function getAnalysisHistory(): AnalysisResult[] {
  try {
    const savedHistory = localStorage.getItem(ANALYSIS_HISTORY_KEY);
    return savedHistory ? JSON.parse(savedHistory) : [];
  } catch (error) {
    console.error('Error getting analysis history:', error);
    return [];
  }
}

/**
 * Clear analysis history from local storage
 */
export function clearAnalysisHistory(): void {
  try {
    localStorage.removeItem(ANALYSIS_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing analysis history:', error);
  }
}

/**
 * Save a security log entry
 * @param log Security log entry to save
 */
export function saveSecurityLog(log: SecurityLog): void {
  try {
    // Get existing logs
    const logs = getSecurityLogs();
    
    // Add new log to the beginning
    logs.unshift(log);
    
    // Limit the number of items
    if (logs.length > MAX_LOG_ITEMS) {
      logs.pop();
    }
    
    // Save back to storage
    localStorage.setItem(SECURITY_LOGS_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Error saving security log:', error);
  }
}

/**
 * Get security logs from local storage
 * @returns Array of security logs
 */
export function getSecurityLogs(): SecurityLog[] {
  try {
    const savedLogs = localStorage.getItem(SECURITY_LOGS_KEY);
    return savedLogs ? JSON.parse(savedLogs) : [];
  } catch (error) {
    console.error('Error getting security logs:', error);
    return [];
  }
}

/**
 * Clear security logs from local storage
 */
export function clearSecurityLogs(): void {
  try {
    localStorage.removeItem(SECURITY_LOGS_KEY);
  } catch (error) {
    console.error('Error clearing security logs:', error);
  }
}
