
import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FileUploaderProps {
  onFileContent: (content: string) => void;
}

const FileUploader = ({ onFileContent }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_FILE_TYPES = [
    "text/plain", 
    "application/json", 
    ".txt", 
    ".json"
  ];

  const sanitizeFileName = (name: string) => {
    // Basic filename sanitization
    return name.replace(/[^\w\s.-]/g, '').trim();
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive",
      });
      return false;
    }
    
    // Check file type
    const fileType = file.type.toLowerCase();
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (
      !ALLOWED_FILE_TYPES.includes(fileType) && 
      !ALLOWED_FILE_TYPES.includes(`.${extension}`)
    ) {
      toast({
        title: "Invalid file type",
        description: "Only .txt and .json files are supported",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleFileRead = (file: File) => {
    if (!validateFile(file)) return;
    
    const sanitizedName = sanitizeFileName(file.name);
    setFileName(sanitizedName);
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        
        // Basic content validation and sanitization
        if (content.length === 0) {
          toast({
            title: "Empty file",
            description: "The file appears to be empty",
            variant: "destructive",
          });
          return;
        }
        
        if (content.length > 1000000) { // ~1MB of text
          toast({
            title: "File too large",
            description: "The file content exceeds the maximum size limit",
            variant: "destructive",
          });
          return;
        }
        
        // Pass the content to the parent component
        onFileContent(content);
      } catch (error) {
        console.error("Error reading file:", error);
        toast({
          title: "Error reading file",
          description: "There was a problem reading the file content",
          variant: "destructive",
        });
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "There was a problem reading the file",
        variant: "destructive",
      });
    };
    
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileRead(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileRead(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200 ease-in-out
          ${isDragging 
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" 
            : "border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500"}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept=".txt,.json,text/plain,application/json"
          className="hidden"
        />
        
        <Upload className="h-10 w-10 mx-auto mb-3 text-slate-400" />
        
        {fileName ? (
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">File selected:</p>
            <p className="font-medium text-slate-700 dark:text-slate-300">{fileName}</p>
          </div>
        ) : (
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-300">
              Drop your file here or click to browse
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Upload chat log files (.txt, .json)
            </p>
          </div>
        )}
      </div>
      
      {fileName && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            setFileName(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
          className="mt-2"
        >
          Clear file
        </Button>
      )}
    </div>
  );
};

export default FileUploader;
