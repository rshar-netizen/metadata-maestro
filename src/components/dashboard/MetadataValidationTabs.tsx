import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetadataComparisonTable } from "./MetadataComparisonTable";
import { BookOpen, Database, CheckCircle, AlertTriangle, Info, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const glossaryKPIs: ValidationKPI[] = [
    {
      label: "High Match (≥80%)",
      value: 423,
      tooltip: "Fields where the business glossary definition closely aligns with the AI-generated description. These fields have clear, well-documented business meaning.",
      variant: "success"
    },
    {
      label: "Medium Match (60-79%)",
      value: 156,
      tooltip: "Fields with partial alignment between glossary and generated definitions. Review recommended to clarify terminology or add missing context.",
      variant: "warning"
    },
    {
      label: "Low Match (<60%)",
      value: 44,
      tooltip: "Fields with significant gaps between glossary definitions and actual data usage. May indicate outdated glossary entries or undefined business terms.",
      variant: "danger"
    }
  ];

  const dictionaryKPIs: ValidationKPI[] = [
    {
      label: "High Match (≥80%)",
      value: 512,
      tooltip: "Technical field definitions that accurately describe the data structure, type, and constraints. These fields have comprehensive technical documentation.",
      variant: "success"
    },
    {
      label: "Medium Match (60-79%)",
      value: 198,
      tooltip: "Fields with partial technical documentation. May be missing data type details, constraints, or relationship information.",
      variant: "warning"
    },
    {
      label: "Low Match (<60%)",
      value: 62,
      tooltip: "Fields lacking adequate technical documentation. Requires updates to include proper data types, nullability, and relationship context.",
      variant: "danger"
    }
  ];

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
          </TabsTrigger>
          <TabsTrigger 
            value="dictionary" 
            className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2"
          >
            <Database className="w-4 h-4" />
            Data Dictionary Validation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="glossary" className="mt-0">
          <ValidationTabContent
            title="Business Glossary Validation"
            description="Compare business terms and definitions with AI-generated semantic analysis"
            kpis={glossaryKPIs}
            totalFields={623}
            totalTables={78}
            avgMatchScore={76.8}
            tableType="glossary"
          />
        </TabsContent>

        <TabsContent value="dictionary" className="mt-0">
          <ValidationTabContent
            title="Data Dictionary Validation"
            description="Compare technical field definitions with AI-generated schema analysis"
            kpis={dictionaryKPIs}
            totalFields={772}
            totalTables={98}
            avgMatchScore={81.2}
            tableType="dictionary"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
