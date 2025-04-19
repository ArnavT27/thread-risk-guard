
import { useState } from "react";
import { Upload, AlertTriangle, CheckCircle, Download, BarChart2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import MessageAnalyzer from "@/components/MessageAnalyzer";
import Dashboard from "@/components/Dashboard";
import FileUploader from "@/components/FileUploader";
import { RiskLevel, AnalysisResult, Message } from "@/types/analysis";

const Index = () => {
  const [inputText, setInputText] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  const { toast } = useToast();

  const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleFileContent = (content: string) => {
    setInputText(content);
    toast({
      title: "File loaded successfully",
      description: `${content.length} characters loaded for analysis`,
    });
  };

  const analyzeMessages = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text or upload a file to analyze",
        variant: "destructive",
      });
      return;
    }

    // Sanitize input - Basic implementation
    const sanitizedInput = inputText.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    
    setIsAnalyzing(true);
    
    try {
      // Mock API call - In production, this would be a real API endpoint
      // Simulate API call with setTimeout
      setTimeout(() => {
        // Create fake analysis result
        const messages = sanitizedInput.split('\n')
          .filter(line => line.trim().length > 0)
          .map((line, index) => {
            // Generate random risk level for demo
            const riskScore = Math.random();
            let riskLevel: RiskLevel = "low";
            
            if (riskScore > 0.8) {
              riskLevel = "high";
            } else if (riskScore > 0.5) {
              riskLevel = "medium";
            }

            // Generate random intent and sentiment for demo
            const intents = ["request", "demand", "inform", "question", "threaten", "manipulate"];
            const sentiments = ["neutral", "positive", "negative", "urgent", "friendly", "suspicious"];
            
            const intent = intents[Math.floor(Math.random() * intents.length)];
            const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
            
            // Flag messages containing suspicious words for demo
            const suspiciousWords = ["urgent", "password", "account", "verify", "immediately", "login", "security", "bank", "click", "link"];
            const containsSuspiciousWords = suspiciousWords.some(word => line.toLowerCase().includes(word));
            
            if (containsSuspiciousWords) {
              // Increase risk for suspicious messages
              riskLevel = Math.random() > 0.5 ? "high" : "medium";
            }
            
            return {
              id: `msg-${index}`,
              content: line,
              riskLevel,
              riskScore: riskScore.toFixed(2),
              intent,
              sentiment,
              flags: containsSuspiciousWords ? ["Potential phishing", "Contains suspicious keywords"] : [],
              timestamp: new Date().toISOString(),
            } as Message;
          });

        // Calculate overall risk
        const overallRisk = messages.reduce((sum, msg) => {
          switch (msg.riskLevel) {
            case "high": return sum + 3;
            case "medium": return sum + 2;
            case "low": return sum + 1;
            default: return sum;
          }
        }, 0) / messages.length;
        
        const result: AnalysisResult = {
          id: `analysis-${Date.now()}`,
          timestamp: new Date().toISOString(),
          messages,
          summary: {
            totalMessages: messages.length,
            highRiskCount: messages.filter(m => m.riskLevel === "high").length,
            mediumRiskCount: messages.filter(m => m.riskLevel === "medium").length,
            lowRiskCount: messages.filter(m => m.riskLevel === "low").length,
            overallRisk: overallRisk,
            overallRiskLevel: overallRisk > 2 ? "high" : overallRisk > 1.5 ? "medium" : "low",
          }
        };
        
        // Update state with results
        setResults(result);
        setAnalysisHistory(prev => [result, ...prev]);
        setIsAnalyzing(false);
        
        // Notify completion
        toast({
          title: "Analysis complete",
          description: `${messages.length} messages analyzed`,
        });
      }, 2000); // Simulate 2 second API call
      
    } catch (error) {
      setIsAnalyzing(false);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your messages. Please try again.",
        variant: "destructive",
      });
      console.error("Analysis error:", error);
    }
  };

  const exportResults = () => {
    if (!results) return;
    
    const csvContent = [
      // Header row
      ["Message", "Risk Level", "Risk Score", "Intent", "Sentiment", "Flags"].join(","),
      // Data rows
      ...results.messages.map(msg => [
        `"${msg.content.replace(/"/g, '""')}"`, // Escape quotes for CSV
        msg.riskLevel,
        msg.riskScore,
        msg.intent,
        msg.sentiment,
        `"${msg.flags.join("; ")}"`
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `social-engineering-analysis-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearInput = () => {
    setInputText("");
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-950 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              ThreadRiskGuard
            </h1>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Social Engineering Detection System
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="analyzer">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="analyzer" className="text-base py-3">
              <AlertTriangle className="h-4 w-4 mr-2" /> Message Analyzer
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="text-base py-3">
              <BarChart2 className="h-4 w-4 mr-2" /> Results Dashboard
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="analyzer">
            <Card className="p-6 shadow-md">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Input Messages</h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    Paste your chat messages or upload a file to analyze for social engineering threats
                  </p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <textarea
                          value={inputText}
                          onChange={handleTextInput}
                          placeholder="Paste chat messages here..."
                          className="w-full h-64 p-3 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button 
                          onClick={analyzeMessages} 
                          disabled={isAnalyzing || !inputText.trim()} 
                          className="flex-1"
                        >
                          {isAnalyzing ? (
                            <>
                              <span className="animate-pulse">Analyzing...</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-4 w-4 mr-2" /> Analyze Messages
                            </>
                          )}
                        </Button>
                        <Button 
                          onClick={clearInput} 
                          variant="outline" 
                          className="flex-1"
                        >
                          Clear Input
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
                      <h3 className="text-lg font-medium mb-4">Upload File</h3>
                      <FileUploader onFileContent={handleFileContent} />
                      <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                        <p>Supported file types: .txt, .json</p>
                        <p>Maximum file size: 5MB</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {isAnalyzing && (
                  <div className="mt-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Analyzing messages...</p>
                    <Progress value={33} className="h-2" />
                  </div>
                )}
                
                {results && !isAnalyzing && (
                  <MessageAnalyzer results={results} onExport={exportResults} />
                )}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="dashboard">
            <Dashboard analysisHistory={analysisHistory} />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="mt-16 py-6 border-t border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 text-center text-slate-500 dark:text-slate-400 text-sm">
          <p>ThreadRiskGuard - Social Engineering Detection System</p>
          <p className="mt-1">© {new Date().getFullYear()} • Built with security in mind</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
