import { FileUploadZone } from "./FileUploadZone";
import { MetadataValidationTabs } from "./MetadataValidationTabs";
import { Target, BookOpen, Database, Clock, AlertTriangle, TrendingUp } from "lucide-react";

export const DataSourcesTab = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Metadata Accuracy KPIs Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="card-glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Overall Metadata Accuracy</span>
          </div>
          <p className="text-2xl font-bold text-foreground">76%</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="text-xs text-success">+3.2%</span>
          </div>
        </div>

        <div className="card-glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-info" />
            <span className="text-xs text-muted-foreground">Glossary Accuracy</span>
          </div>
          <p className="text-2xl font-bold text-foreground">75%</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="text-xs text-success">+2.4%</span>
          </div>
        </div>

        <div className="card-glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Data Dictionary Accuracy</span>
          </div>
          <p className="text-2xl font-bold text-foreground">78%</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="text-xs text-success">+4.1%</span>
          </div>
        </div>

        <div className="card-glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Last Scan</span>
          </div>
          <p className="text-lg font-bold text-foreground">2h ago</p>
          <p className="text-xs text-muted-foreground mt-1">auto-scheduled</p>
        </div>

        <div className="card-glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span className="text-xs text-muted-foreground">Active Alerts</span>
          </div>
          <p className="text-2xl font-bold text-warning">4</p>
          <p className="text-xs text-muted-foreground mt-1">1 critical</p>
        </div>
      </div>

      {/* Upload Section */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Upload Data Sources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FileUploadZone
            title="Business Glossary"
            description="Upload your organization's business glossary definitions"
            acceptedFormats="CSV, Excel, JSON"
            showRegenerate
            onRegenerate={() => console.log("Regenerating glossary...")}
          />
          <FileUploadZone
            title="Enterprise Data Dictionary"
            description="Upload technical data dictionary with field definitions"
            acceptedFormats="CSV, Excel, JSON, SQL DDL"
            showRegenerate
            onRegenerate={() => console.log("Regenerating dictionary...")}
          />
          <FileUploadZone
            title="Policy Documents"
            description="Upload compliance and governance policy documents"
            acceptedFormats="PDF, DOCX, TXT"
          />
          <FileUploadZone
            title="Sample Dataset"
            description="Upload sample data for validation testing"
            acceptedFormats="CSV, Parquet, JSON"
          />
        </div>
      </div>

      {/* Metadata Validation Tabs */}
      <MetadataValidationTabs />
    </div>
  );
};
