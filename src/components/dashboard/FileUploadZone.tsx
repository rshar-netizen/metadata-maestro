import { useState, useCallback } from "react";
import { Upload, FileText, CheckCircle, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadedFile {
  name: string;
  size: string;
  status: "uploading" | "complete" | "error";
}

interface FileUploadZoneProps {
  title: string;
  description: string;
  acceptedFormats: string;
  onRegenerate?: () => void;
  showRegenerate?: boolean;
}

export const FileUploadZone = ({ 
  title, 
  description, 
  acceptedFormats,
  onRegenerate,
  showRegenerate = false 
}: FileUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const newFiles: UploadedFile[] = droppedFiles.map(file => ({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      status: "complete" as const
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newFiles: UploadedFile[] = selectedFiles.map(file => ({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        status: "complete" as const
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="card-glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {showRegenerate && files.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRegenerate}
            className="gap-2 border-primary/50 text-primary hover:bg-primary/10"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </Button>
        )}
      </div>

      <div
        className={cn("upload-zone cursor-pointer", isDragging && "active")}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById(`file-${title}`)?.click()}
      >
        <input
          id={`file-${title}`}
          type="file"
          className="hidden"
          multiple
          onChange={handleFileSelect}
        />
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 rounded-full bg-primary/10">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Drop files here or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {acceptedFormats}
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{file.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {file.status === "complete" && (
                  <CheckCircle className="w-5 h-5 text-success" />
                )}
                <button 
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-muted rounded"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
