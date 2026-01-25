import { FileUploadZone } from "./FileUploadZone";
import { MetadataComparisonTable } from "./MetadataComparisonTable";
import { KPICard } from "./KPICard";
import { FileText, Database, Shield, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DataSourcesTab = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Glossary Terms"
          value="1,247"
          subtitle="Across 12 domains"
          icon={FileText}
          trend={{ value: 5.2, isPositive: true }}
        />
        <KPICard
          title="Dictionary Fields"
          value="3,892"
          subtitle="156 tables mapped"
          icon={Database}
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Policy Documents"
          value="28"
          subtitle="Last updated 2 days ago"
          icon={Shield}
        />
      </div>

      {/* Upload Section */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Upload Data Sources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Comparison Actions */}
      <div className="card-glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Metadata Validation</h3>
            <p className="text-sm text-muted-foreground">
              Compare and analyze metadata across your data sources
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Clock className="w-4 h-4" />
              Schedule Validation
            </Button>
            <Button className="gap-2 bg-primary text-primary-foreground glow-primary">
              <CheckCircle className="w-4 h-4" />
              Run Comparison
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-foreground">High Match (≥80%)</span>
            </div>
            <p className="text-2xl font-bold text-success">847</p>
            <p className="text-xs text-muted-foreground">fields validated</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium text-foreground">Medium Match (60-79%)</span>
            </div>
            <p className="text-2xl font-bold text-warning">312</p>
            <p className="text-xs text-muted-foreground">fields need review</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium text-foreground">Low Match (&lt;60%)</span>
            </div>
            <p className="text-2xl font-bold text-destructive">88</p>
            <p className="text-xs text-muted-foreground">fields require attention</p>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <MetadataComparisonTable />
    </div>
  );
};
