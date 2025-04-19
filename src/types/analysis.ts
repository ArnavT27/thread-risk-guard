
export type RiskLevel = "low" | "medium" | "high";

export interface Message {
  id: string;
  content: string;
  riskLevel: RiskLevel;
  riskScore: string;
  intent: string;
  sentiment: string;
  flags: string[];
  timestamp: string;
}

export interface AnalysisSummary {
  totalMessages: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  overallRisk: number;
  overallRiskLevel: RiskLevel;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  messages: Message[];
  summary: AnalysisSummary;
}
