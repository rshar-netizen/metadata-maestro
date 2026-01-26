import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetadataComparisonTable } from "./MetadataComparisonTable";
import { BookOpen, Database, CheckCircle, AlertTriangle, Info, Clock, FileX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMetadata } from "@/contexts/MetadataContext";

interface ValidationKPI {
  label: string;
  value: string | number;
  tooltip: string;
  variant: "success" | "warning" | "danger" | "default";
}

interface ValidationTabProps {
  title: string;
  description: string;
  kpis: ValidationKPI[];
  totalFields: number;
  totalTables: number;
  avgMatchScore: number;
  tableType: "glossary" | "dictionary";
}

const getVariantColor = (variant: ValidationKPI["variant"]) => {
  switch (variant) {
    case "success":
      return "text-success";
    case "warning":
      return "text-warning";
    case "danger":
      return "text-destructive";
    default:
      return "text-primary";
  }
};

const ValidationTabContent = ({ title, description, kpis, totalFields, totalTables, avgMatchScore, tableType }: ValidationTabProps) => {
  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
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

      {/* Overall Summary Line */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/30">
        <CheckCircle className="w-4 h-4 text-primary" />
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{totalFields.toLocaleString()} fields</span> analyzed across {totalTables} tables — 
          Average match score: <span className="font-semibold text-primary">{avgMatchScore}%</span>
        </p>
      </div>

      {/* Inline KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpis.map((kpi, index) => (
          <div key={index} className="p-4 rounded-lg bg-muted/30 border border-border/30">
            <div className="flex items-center gap-2 mb-2">
              {kpi.variant === "success" && <CheckCircle className="w-4 h-4 text-success" />}
              {kpi.variant === "warning" && <AlertTriangle className="w-4 h-4 text-warning" />}
              {kpi.variant === "danger" && <AlertTriangle className="w-4 h-4 text-destructive" />}
              <span className="text-sm font-medium text-foreground">{kpi.label}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-primary cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{kpi.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className={`text-2xl font-bold ${getVariantColor(kpi.variant)}`}>{kpi.value}</p>
            <p className="text-xs text-muted-foreground">fields validated</p>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <MetadataComparisonTable type={tableType} />
    </div>
  );
};

export const MetadataValidationTabs = () => {
  const [activeTab, setActiveTab] = useState("glossary");
  const { glossaryData, dictionaryData } = useMetadata();

  // Calculate KPIs based on uploaded data
  const getGlossaryKPIs = (): ValidationKPI[] => {
    if (!glossaryData?.fields.length) {
      return [
        { label: "High Match (≥80%)", value: 0, tooltip: "Upload a business glossary to see match results.", variant: "success" },
        { label: "Medium Match (60-79%)", value: 0, tooltip: "Upload a business glossary to see match results.", variant: "warning" },
        { label: "Low Match (<60%)", value: 0, tooltip: "Upload a business glossary to see match results.", variant: "danger" }
      ];
    }
    // Simulate match distribution for uploaded data
    const total = glossaryData.fields.length;
    const high = Math.floor(total * 0.4);
    const medium = Math.floor(total * 0.5);
    const low = total - high - medium;
    return [
      { label: "High Match (≥80%)", value: high, tooltip: "Fields where the business glossary definition closely aligns with the AI-generated description.", variant: "success" },
      { label: "Medium Match (60-79%)", value: medium, tooltip: "Fields with partial alignment between glossary and generated definitions.", variant: "warning" },
      { label: "Low Match (<60%)", value: low, tooltip: "Fields with significant gaps between glossary definitions and actual data usage.", variant: "danger" }
    ];
  };

  const getDictionaryKPIs = (): ValidationKPI[] => {
    if (!dictionaryData?.fields.length) {
      return [
        { label: "High Match (≥80%)", value: 0, tooltip: "Upload a data dictionary to see match results.", variant: "success" },
        { label: "Medium Match (60-79%)", value: 0, tooltip: "Upload a data dictionary to see match results.", variant: "warning" },
        { label: "Low Match (<60%)", value: 0, tooltip: "Upload a data dictionary to see match results.", variant: "danger" }
      ];
    }
    const total = dictionaryData.fields.length;
    const high = Math.floor(total * 0.6);
    const medium = Math.floor(total * 0.3);
    const low = total - high - medium;
    return [
      { label: "High Match (≥80%)", value: high, tooltip: "Technical field definitions that accurately describe the data structure.", variant: "success" },
      { label: "Medium Match (60-79%)", value: medium, tooltip: "Fields with partial technical documentation.", variant: "warning" },
      { label: "Low Match (<60%)", value: low, tooltip: "Fields lacking adequate technical documentation.", variant: "danger" }
    ];
  };

  const glossaryKPIs = getGlossaryKPIs();
  const dictionaryKPIs = getDictionaryKPIs();

  const glossaryTotalFields = glossaryData?.fields.length || 0;
  const glossaryTotalTables = glossaryData ? new Set(glossaryData.fields.map(f => f.tableName)).size : 0;
  
  const dictionaryTotalFields = dictionaryData?.fields.length || 0;
  const dictionaryTotalTables = dictionaryData ? new Set(dictionaryData.fields.map(f => f.tableName)).size : 0;

  const EmptyState = ({ type }: { type: "glossary" | "dictionary" }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FileX className="w-12 h-12 text-muted-foreground/40 mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">
        No {type === "glossary" ? "Business Glossary" : "Data Dictionary"} Uploaded
      </h3>
      <p className="text-sm text-muted-foreground max-w-md">
        Upload a {type === "glossary" ? "business glossary" : "data dictionary"} file above to see validation results. 
        Supported formats: CSV, Excel (.xlsx, .xls)
      </p>
    </div>
  );

  return (
    <div className="card-glass rounded-xl p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/30 border border-border/30 p-1 rounded-lg mb-6">
          <TabsTrigger 
            value="glossary" 
            className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2"
          >
            <BookOpen className="w-4 h-4" />
            Business Glossary Validation
            {glossaryData && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-primary/20 rounded-full">
                {glossaryData.fields.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="dictionary" 
            className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2"
          >
            <Database className="w-4 h-4" />
            Data Dictionary Validation
            {dictionaryData && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-primary/20 rounded-full">
                {dictionaryData.fields.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="glossary" className="mt-0">
          {glossaryData ? (
            <ValidationTabContent
              title="Business Glossary Validation"
              description={`Analyzing ${glossaryData.fileName}${glossaryData.sheetCount && glossaryData.sheetCount > 1 ? ` (${glossaryData.sheetCount} sheets: ${glossaryData.sheetsProcessed?.join(', ')})` : ''}`}
              kpis={glossaryKPIs}
              totalFields={glossaryTotalFields}
              totalTables={glossaryTotalTables}
              avgMatchScore={75}
              tableType="glossary"
            />
          ) : (
            <EmptyState type="glossary" />
          )}
        </TabsContent>

        <TabsContent value="dictionary" className="mt-0">
          {dictionaryData ? (
            <ValidationTabContent
              title="Data Dictionary Validation"
              description={`Analyzing ${dictionaryData.fileName}${dictionaryData.sheetCount > 1 ? ` (${dictionaryData.sheetCount} sheets: ${dictionaryData.sheetsProcessed.join(', ')})` : ''}`}
              kpis={dictionaryKPIs}
              totalFields={dictionaryTotalFields}
              totalTables={dictionaryTotalTables}
              avgMatchScore={78}
              tableType="dictionary"
            />
          ) : (
            <EmptyState type="dictionary" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

