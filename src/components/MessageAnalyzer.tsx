
import { 
  AlertTriangle, 
  CheckCircle, 
  Download, 
  Info, 
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { AnalysisResult, RiskLevel } from "@/types/analysis";

interface MessageAnalyzerProps {
  results: AnalysisResult;
  onExport: () => void;
}

const MessageAnalyzer = ({ results, onExport }: MessageAnalyzerProps) => {
  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case "high":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "medium":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "low":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800">
            High Risk
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800">
            Medium Risk
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
            Low Risk
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
            Unknown
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center">
          Analysis Results
          <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-2">
            ({new Date(results.timestamp).toLocaleString()})
          </span>
        </h2>
        <Button onClick={onExport} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      <Card className="p-6 bg-white dark:bg-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex flex-col items-center justify-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">Total Messages</span>
            <span className="text-3xl font-bold">{results.summary.totalMessages}</span>
          </div>
          
          <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg flex flex-col items-center justify-center">
            <span className="text-sm text-red-700 dark:text-red-400">High Risk</span>
            <span className="text-3xl font-bold text-red-700 dark:text-red-400">
              {results.summary.highRiskCount}
            </span>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg flex flex-col items-center justify-center">
            <span className="text-sm text-yellow-700 dark:text-yellow-400">Medium Risk</span>
            <span className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">
              {results.summary.mediumRiskCount}
            </span>
          </div>
          
          <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg flex flex-col items-center justify-center">
            <span className="text-sm text-green-700 dark:text-green-400">Low Risk</span>
            <span className="text-3xl font-bold text-green-700 dark:text-green-400">
              {results.summary.lowRiskCount}
            </span>
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <div>
            <span className="text-sm text-slate-500 dark:text-slate-400">Overall Risk Assessment:</span>
            <div className="flex items-center mt-1">
              {getRiskIcon(results.summary.overallRiskLevel)}
              <span className="ml-2 font-medium">
                {results.summary.overallRiskLevel === "high" 
                  ? "High risk of social engineering detected" 
                  : results.summary.overallRiskLevel === "medium" 
                    ? "Moderate risk of social engineering detected"
                    : "Low risk of social engineering detected"}
              </span>
            </div>
          </div>
          {getRiskBadge(results.summary.overallRiskLevel)}
        </div>
      </Card>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-4">Message Analysis</h3>
        <div className="rounded-md border">
          <Table>
            <TableCaption>Analyzed messages with risk assessment</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Message</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Intent</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead>Flags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.messages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell className="max-w-md break-words">{message.content}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getRiskIcon(message.riskLevel)}
                      <span className="ml-2 text-sm">{message.riskLevel} ({message.riskScore})</span>
                    </div>
                  </TableCell>
                  <TableCell>{message.intent}</TableCell>
                  <TableCell>{message.sentiment}</TableCell>
                  <TableCell>
                    {message.flags.length > 0 ? (
                      <ul className="list-disc pl-4 text-sm">
                        {message.flags.map((flag, index) => (
                          <li key={index}>{flag}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-sm text-slate-500 dark:text-slate-400">None</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default MessageAnalyzer;
