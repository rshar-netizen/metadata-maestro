import { FileUploadZone } from "./FileUploadZone";
import { MetadataValidationTabs } from "./MetadataValidationTabs";
import { Database, Table, Layers, FolderTree } from "lucide-react";

export const DataSourcesTab = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Data Assets Summary */}
      <div className="card-glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Data Assets</h2>
            <p className="text-sm text-muted-foreground">Inventory of discovered assets across all connected sources</p>
          </div>
          <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded">Last synced: 2 hours ago</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/20 border border-border/30">
            <div className="p-2 rounded-lg bg-primary/20">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">8</p>
              <p className="text-xs text-muted-foreground">Databases</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/20 border border-border/30">
            <div className="p-2 rounded-lg bg-info/20">
              <Layers className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">24</p>
              <p className="text-xs text-muted-foreground">Schemas</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/20 border border-border/30">
            <div className="p-2 rounded-lg bg-success/20">
              <Table className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">156</p>
              <p className="text-xs text-muted-foreground">Tables</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/20 border border-border/30">
            <div className="p-2 rounded-lg bg-warning/20">
              <FolderTree className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">3,892</p>
              <p className="text-xs text-muted-foreground">Columns</p>
            </div>
          </div>
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
