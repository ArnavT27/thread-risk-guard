
import { 
  BarChart2, 
  PieChart, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AnalysisResult, RiskLevel } from "@/types/analysis";

// Import Recharts components
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RechartsBarChart,
  Pie,
  Cell
} from "recharts";

interface DashboardProps {
  analysisHistory: AnalysisResult[];
}

const Dashboard = ({ analysisHistory }: DashboardProps) => {
  // If no analysis has been run yet
  if (analysisHistory.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <BarChart2 className="h-16 w-16 text-slate-300 dark:text-slate-600" />
          <h3 className="text-xl font-medium">No Analysis Data Yet</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Run your first analysis to see results and statistics here. You can analyze chat messages
            from the Message Analyzer tab.
          </p>
        </div>
      </Card>
    );
  }

  // Calculate overall stats
  const totalAnalyses = analysisHistory.length;
  const totalMessages = analysisHistory.reduce((sum, analysis) => sum + analysis.summary.totalMessages, 0);
  const totalHighRisk = analysisHistory.reduce((sum, analysis) => sum + analysis.summary.highRiskCount, 0);
  const totalMediumRisk = analysisHistory.reduce((sum, analysis) => sum + analysis.summary.mediumRiskCount, 0);
  const totalLowRisk = analysisHistory.reduce((sum, analysis) => sum + analysis.summary.lowRiskCount, 0);

  // Most recent analysis
  const mostRecent = analysisHistory[0];

  // Prepare chart data
  const pieData = [
    { name: "High Risk", value: totalHighRisk, color: "#ef4444" },
    { name: "Medium Risk", value: totalMediumRisk, color: "#f59e0b" },
    { name: "Low Risk", value: totalLowRisk, color: "#10b981" },
  ];

  // Bar data for 5 most recent analyses
  const barData = analysisHistory.slice(0, 5).reverse().map((analysis) => ({
    name: new Date(analysis.timestamp).toLocaleDateString(),
    high: analysis.summary.highRiskCount,
    medium: analysis.summary.mediumRiskCount,
    low: analysis.summary.lowRiskCount,
  }));

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case "high":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "medium":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "low":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex flex-col">
            <span className="text-sm text-slate-500 dark:text-slate-400">Total Analyses</span>
            <span className="text-3xl font-bold mt-2">{totalAnalyses}</span>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex flex-col">
            <span className="text-sm text-slate-500 dark:text-slate-400">Messages Analyzed</span>
            <span className="text-3xl font-bold mt-2">{totalMessages}</span>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex flex-col">
            <span className="text-sm text-slate-500 dark:text-slate-400">High Risk Messages</span>
            <div className="flex items-center mt-2">
              <span className="text-3xl font-bold text-red-600">{totalHighRisk}</span>
              <span className="ml-2 text-sm text-slate-500">
                ({Math.round((totalHighRisk / totalMessages) * 100) || 0}%)
              </span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex flex-col">
            <span className="text-sm text-slate-500 dark:text-slate-400">Last Analysis</span>
            <span className="text-xl font-medium mt-2 truncate">
              {new Date(mostRecent.timestamp).toLocaleString()}
            </span>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <BarChart2 className="h-5 w-5 mr-2" /> Distribution by Risk Level
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" /> Risk Trends
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="high" name="High Risk" fill="#ef4444" />
                <Bar dataKey="medium" name="Medium Risk" fill="#f59e0b" />
                <Bar dataKey="low" name="Low Risk" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Analysis History</h3>
        <div className="rounded-md border">
          <Table>
            <TableCaption>Recent analysis history</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Messages</TableHead>
                <TableHead>High Risk</TableHead>
                <TableHead>Medium Risk</TableHead>
                <TableHead>Low Risk</TableHead>
                <TableHead>Overall Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysisHistory.map((analysis) => (
                <TableRow key={analysis.id}>
                  <TableCell>{new Date(analysis.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{analysis.summary.totalMessages}</TableCell>
                  <TableCell>{analysis.summary.highRiskCount}</TableCell>
                  <TableCell>{analysis.summary.mediumRiskCount}</TableCell>
                  <TableCell>{analysis.summary.lowRiskCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getRiskIcon(analysis.summary.overallRiskLevel)}
                      <span className="ml-2 capitalize">{analysis.summary.overallRiskLevel}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
