import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FieldComparison {
  fieldName: string;
  tableName: string;
  originalDescription: string;
  generatedDescription: string;
  descriptionMatchScore: number;
  explanation: string;
  originalDataType: string;
  generatedDataType: string;
  typeMatch: boolean;
  originalSensitivity: string;
  generatedSensitivity: string;
  sensitivityMatch: boolean;
}

const calculateOverallScore = (row: FieldComparison): number => {
  // Description match is 60%, type match is 20%, sensitivity match is 20%
  const typeScore = row.typeMatch ? 100 : 0;
  const sensitivityScore = row.sensitivityMatch ? 100 : 0;
  return Math.round(row.descriptionMatchScore * 0.6 + typeScore * 0.2 + sensitivityScore * 0.2);
};

// Business Glossary mock data - focuses on business term definitions
const glossaryMockData: FieldComparison[] = [
  {
    fieldName: "property_id",
    tableName: "property_master",
    originalDescription: "Unique identifier for the property",
    generatedDescription: "Primary key uniquely identifying each real estate asset in the portfolio management system",
    descriptionMatchScore: 94,
    explanation: "High semantic alignment with minor phrasing differences",
    originalDataType: "string",
    generatedDataType: "string",
    typeMatch: true,
    originalSensitivity: "Internal",
    generatedSensitivity: "Internal",
    sensitivityMatch: true
  },
  {
    fieldName: "property_name",
    tableName: "property_master",
    originalDescription: "Market-facing property name",
    generatedDescription: "Public-facing display name used for property marketing and tenant communications",
    descriptionMatchScore: 88,
    explanation: "Good alignment, generated adds marketing context",
    originalDataType: "string",
    generatedDataType: "string",
    typeMatch: true,
    originalSensitivity: "Internal",
    generatedSensitivity: "Public",
    sensitivityMatch: false
  },
  {
    fieldName: "property_type",
    tableName: "property_master",
    originalDescription: "Property category",
    generatedDescription: "Classification of real estate asset type (Multifamily/Office/Industrial/Retail)",
    descriptionMatchScore: 72,
    explanation: "Original lacks enumeration of valid property types",
    originalDataType: "string",
    generatedDataType: "enum",
    typeMatch: false,
    originalSensitivity: "Internal",
    generatedSensitivity: "Internal",
    sensitivityMatch: true
  },
  {
    fieldName: "occupancy_rate_pct",
    tableName: "property_master",
    originalDescription: "Occupancy %",
    generatedDescription: "Percentage of leasable space currently occupied by tenants, measured as leased sqft / total sqft",
    descriptionMatchScore: 68,
    explanation: "Original missing calculation methodology context",
    originalDataType: "float",
    generatedDataType: "float",
    typeMatch: true,
    originalSensitivity: "Internal",
    generatedSensitivity: "Confidential",
    sensitivityMatch: false
  },
  {
    fieldName: "tenant_legal_name",
    tableName: "tenant_master",
    originalDescription: "Legal tenant name",
    generatedDescription: "Registered legal entity name of the tenant organization for contractual purposes",
    descriptionMatchScore: 91,
    explanation: "High alignment with legal context added",
    originalDataType: "string",
    generatedDataType: "string",
    typeMatch: true,
    originalSensitivity: "Internal",
    generatedSensitivity: "Internal",
    sensitivityMatch: true
  },
  {
    fieldName: "credit_rating_internal",
    tableName: "tenant_master",
    originalDescription: "Internal credit rating",
    generatedDescription: "Proprietary credit assessment score (AAA/AA/A/BBB/BB/B) based on financial analysis",
    descriptionMatchScore: 65,
    explanation: "Original lacks rating scale enumeration",
    originalDataType: "string",
    generatedDataType: "enum",
    typeMatch: false,
    originalSensitivity: "Confidential",
    generatedSensitivity: "Confidential",
    sensitivityMatch: true
  },
  {
    fieldName: "lease_type",
    tableName: "lease_master",
    originalDescription: "Lease structure (e.g., NNN, Gross)",
    generatedDescription: "Classification of lease expense structure (Triple Net/Modified Gross/Full Service)",
    descriptionMatchScore: 85,
    explanation: "Good alignment with lease terminology",
    originalDataType: "string",
    generatedDataType: "string",
    typeMatch: true,
    originalSensitivity: "Internal",
    generatedSensitivity: "Internal",
    sensitivityMatch: true
  },
  {
    fieldName: "base_rent_annual_usd",
    tableName: "lease_master",
    originalDescription: "Annual base rent amount",
    generatedDescription: "Contractual annual base rent in USD, excluding pass-throughs and escalations",
    descriptionMatchScore: 78,
    explanation: "Generated adds exclusion context for financial clarity",
    originalDataType: "float",
    generatedDataType: "decimal",
    typeMatch: false,
    originalSensitivity: "Confidential",
    generatedSensitivity: "Confidential",
    sensitivityMatch: true
  },
  {
    fieldName: "deal_stage",
    tableName: "deal_pipeline",
    originalDescription: "Current deal stage in workflow",
    generatedDescription: "Investment committee workflow status (Screening/Due Diligence/IC Review/Approved/Closed)",
    descriptionMatchScore: 62,
    explanation: "Original lacks stage enumeration and IC context",
    originalDataType: "string",
    generatedDataType: "enum",
    typeMatch: false,
    originalSensitivity: "Internal",
    generatedSensitivity: "Confidential",
    sensitivityMatch: false
  },
  {
    fieldName: "target_irr_pct",
    tableName: "deal_pipeline",
    originalDescription: "Target internal rate of return (IRR)",
    generatedDescription: "Projected annualized return target for investment evaluation, expressed as percentage",
    descriptionMatchScore: 89,
    explanation: "Strong alignment with investment terminology",
    originalDataType: "float",
    generatedDataType: "float",
    typeMatch: true,
    originalSensitivity: "Confidential",
    generatedSensitivity: "Confidential",
    sensitivityMatch: true
  },
  {
    fieldName: "capex_type",
    tableName: "capex_project",
    originalDescription: "Type/category of capex project",
    generatedDescription: "Capital expenditure classification (HVAC/Roof/Elevator/Lobby/Parking/TI)",
    descriptionMatchScore: 71,
    explanation: "Original missing project type enumeration",
    originalDataType: "string",
    generatedDataType: "enum",
    typeMatch: false,
    originalSensitivity: "Internal",
    generatedSensitivity: "Internal",
    sensitivityMatch: true
  },
  {
    fieldName: "appraised_value_usd",
    tableName: "property_valuation",
    originalDescription: "Appraised market value",
    generatedDescription: "Third-party appraised fair market value in USD as of valuation date",
    descriptionMatchScore: 92,
    explanation: "Excellent alignment with valuation terminology",
    originalDataType: "float",
    generatedDataType: "decimal",
    typeMatch: false,
    originalSensitivity: "Confidential",
    generatedSensitivity: "Confidential",
    sensitivityMatch: true
  },
  {
    fieldName: "cap_rate_pct",
    tableName: "property_valuation",
    originalDescription: "Implied/market capitalization rate (%)",
    generatedDescription: "Capitalization rate derived from NOI divided by property value, expressed as percentage",
    descriptionMatchScore: 86,
    explanation: "Good alignment, generated adds calculation context",
    originalDataType: "float",
    generatedDataType: "float",
    typeMatch: true,
    originalSensitivity: "Confidential",
    generatedSensitivity: "Confidential",
    sensitivityMatch: true
  },
  {
    fieldName: "green_certification",
    tableName: "property_esg_metrics",
    originalDescription: "Green building certification level",
    generatedDescription: "Sustainability certification status (LEED Platinum/Gold/Silver/ENERGY STAR/None)",
    descriptionMatchScore: 74,
    explanation: "Original lacks certification level enumeration",
    originalDataType: "string",
    generatedDataType: "enum",
    typeMatch: false,
    originalSensitivity: "Internal",
    generatedSensitivity: "Public",
    sensitivityMatch: false
  },
  {
    fieldName: "ghg_kgco2e_per_sqft",
    tableName: "property_esg_metrics",
    originalDescription: "GHG emissions intensity (kgCO2e per sqft)",
    generatedDescription: "Greenhouse gas emissions normalized by property area, measured in kilograms CO2 equivalent",
    descriptionMatchScore: 95,
    explanation: "High alignment with ESG measurement standards",
    originalDataType: "float",
    generatedDataType: "float",
    typeMatch: true,
    originalSensitivity: "Internal",
    generatedSensitivity: "Internal",
    sensitivityMatch: true
  }
];

// Data Dictionary mock data - focuses on technical field definitions
const dictionaryMockData: FieldComparison[] = [
  {
    fieldName: "property_id",
    tableName: "property_master",
    originalDescription: "string, PRIMARY KEY, NOT NULL",
    generatedDescription: "VARCHAR(20) primary key, format PRP######, auto-validated on insert",
    descriptionMatchScore: 92,
    explanation: "Technical specs align, generated adds format pattern",
    originalDataType: "string",
    generatedDataType: "VARCHAR(20)",
    typeMatch: true,
    originalSensitivity: "Internal",
    generatedSensitivity: "Internal",
    sensitivityMatch: true
  },
  {
    fieldName: "property_name",
    tableName: "property_master",
    originalDescription: "string, NOT NULL",
    generatedDescription: "VARCHAR(255), required field for property display name, indexed for search",
    descriptionMatchScore: 88,
    explanation: "Good alignment, generated adds length and index info",
    originalDataType: "string",
    generatedDataType: "VARCHAR(255)",
    typeMatch: true,
    originalSensitivity: "Internal",
    generatedSensitivity: "Internal",
    sensitivityMatch: true
  },
  {
    fieldName: "latitude",
    tableName: "property_master",
    originalDescription: "float",
    generatedDescription: "DECIMAL(8,5) for geographic coordinate, range -90 to +90, nullable",
    descriptionMatchScore: 85,
    explanation: "Generated adds precision and valid range constraints",
    originalDataType: "float",
    generatedDataType: "DECIMAL(8,5)",
    typeMatch: false,
    originalSensitivity: "Internal",
    generatedSensitivity: "Internal",
    sensitivityMatch: true
  },
  {
    fieldName: "longitude",
    tableName: "property_master",
    originalDescription: "float",
    generatedDescription: "DECIMAL(9,5) for geographic coordinate, range -180 to +180, nullable",
    descriptionMatchScore: 85,
    explanation: "Generated adds precision and valid range constraints",
    originalDataType: "float",
    generatedDataType: "DECIMAL(9,5)",
    typeMatch: false,
    originalSensitivity: "Internal",
    generatedSensitivity: "Internal",
    sensitivityMatch: true
  },
  {
    fieldName: "tenant_id",
    tableName: "tenant_master",
    originalDescription: "string, PRIMARY KEY",
    generatedDescription: "VARCHAR(20), format TNT######, unique identifier with referential integrity to lease_master",
    descriptionMatchScore: 91,
    explanation: "Excellent alignment on PK, generated adds FK relationship",
    originalDataType: "string",
    generatedDataType: "VARCHAR(20)",
    typeMatch: true,
    originalSensitivity: "Internal",
    generatedSensitivity: "Internal",
    sensitivityMatch: true
  },
  {
    fieldName: "lease_id",
    tableName: "lease_master",
    originalDescription: "string, PRIMARY KEY",
    generatedDescription: "VARCHAR(20), format LS#######, composite foreign keys to property_master and tenant_master",
    descriptionMatchScore: 94,
    explanation: "Strong alignment with relationship context added",
    originalDataType: "string",
    generatedDataType: "VARCHAR(20)",
    typeMatch: true,
    originalSensitivity: "Internal",
    generatedSensitivity: "Internal",
    sensitivityMatch: true
  },
  {
    fieldName: "lease_start_date",
    tableName: "lease_master",
    originalDescription: "date",
    generatedDescription: "DATE, NOT NULL, must be <= lease_end_date, indexed for active lease queries",
    descriptionMatchScore: 82,
    explanation: "Generated adds validation rule and indexing context",
    originalDataType: "date",
    generatedDataType: "DATE",
    typeMatch: true,
    originalSensitivity: "Internal",
    generatedSensitivity: "Internal",
    sensitivityMatch: true
  },
  {
    fieldName: "lease_end_date",
    tableName: "lease_master",
    originalDescription: "date",
    generatedDescription: "DATE, NOT NULL, must be >= lease_start_date, used for lease expiration reporting",
    descriptionMatchScore: 82,
    explanation: "Generated adds validation rule and business purpose",
    originalDataType: "date",
    generatedDataType: "DATE",
    typeMatch: true,
    originalSensitivity: "Internal",
    generatedSensitivity: "Internal",
    sensitivityMatch: true
  },
  {
    fieldName: "is_active",
    tableName: "lease_master",
    originalDescription: "boolean",
    generatedDescription: "BOOLEAN, derived flag (lease_end_date >= CURRENT_DATE), indexed for filtering",
    descriptionMatchScore: 78,
    explanation: "Generated clarifies derived nature and indexing",
    originalDataType: "boolean",
    generatedDataType: "BOOLEAN",
    typeMatch: true,
    originalSensitivity: "Internal",
    generatedSensitivity: "Internal",
    sensitivityMatch: true
  },
  {
    fieldName: "deal_id",
    tableName: "deal_pipeline",
    originalDescription: "string, PRIMARY KEY",
    generatedDescription: "VARCHAR(20), format DL#######, unique deal identifier with FK to property_master",
    descriptionMatchScore: 93,
    explanation: "Excellent alignment with relationship context",
    originalDataType: "string",
    generatedDataType: "VARCHAR(20)",
    typeMatch: true,
    originalSensitivity: "Internal",
    generatedSensitivity: "Internal",
    sensitivityMatch: true
  },
  {
    fieldName: "indicative_price_usd",
    tableName: "deal_pipeline",
    originalDescription: "float",
    generatedDescription: "DECIMAL(15,2), nullable, stores indicative purchase/sale price in USD",
    descriptionMatchScore: 86,
    explanation: "Generated adds precision and nullability context",
    originalDataType: "float",
    generatedDataType: "DECIMAL(15,2)",
    typeMatch: false,
    originalSensitivity: "Confidential",
    generatedSensitivity: "Confidential",
    sensitivityMatch: true
  },
  {
    fieldName: "budget_usd",
    tableName: "capex_project",
    originalDescription: "float",
    generatedDescription: "DECIMAL(12,2), NOT NULL, approved capex budget amount, must be > 0",
    descriptionMatchScore: 84,
    explanation: "Generated adds precision and validation constraints",
    originalDataType: "float",
    generatedDataType: "DECIMAL(12,2)",
    typeMatch: false,
    originalSensitivity: "Confidential",
    generatedSensitivity: "Confidential",
    sensitivityMatch: true
  },
  {
    fieldName: "valuation_id",
    tableName: "property_valuation",
    originalDescription: "string, PRIMARY KEY",
    generatedDescription: "VARCHAR(20), format VAL#######, unique per valuation event, FK to property_master",
    descriptionMatchScore: 95,
    explanation: "Excellent alignment with format and FK context",
    originalDataType: "string",
    generatedDataType: "VARCHAR(20)",
    typeMatch: true,
    originalSensitivity: "Internal",
    generatedSensitivity: "Internal",
    sensitivityMatch: true
  },
  {
    fieldName: "valuation_date",
    tableName: "property_valuation",
    originalDescription: "date",
    generatedDescription: "DATE, NOT NULL, effective date of appraisal, indexed for time-series queries",
    descriptionMatchScore: 88,
    explanation: "Good alignment with temporal indexing context",
    originalDataType: "date",
    generatedDataType: "DATE",
    typeMatch: true,
    originalSensitivity: "Internal",
    generatedSensitivity: "Internal",
    sensitivityMatch: true
  },
  {
    fieldName: "as_of_date",
    tableName: "property_esg_metrics",
    originalDescription: "date",
    generatedDescription: "DATE, part of composite PK with property_id, quarterly snapshot reference date",
    descriptionMatchScore: 90,
    explanation: "Strong alignment with composite key context",
    originalDataType: "date",
    generatedDataType: "DATE",
    typeMatch: true,
    originalSensitivity: "Internal",
    generatedSensitivity: "Internal",
    sensitivityMatch: true
  }
];

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-destructive";
};

const getScoreBg = (score: number) => {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-warning";
  return "bg-destructive";
};

const getScoreIcon = (score: number) => {
  if (score >= 80) return CheckCircle;
  if (score >= 60) return AlertTriangle;
  return XCircle;
};

const getSensitivityBadge = (sensitivity: string) => {
  switch (sensitivity) {
    case "PII":
      return "bg-destructive/20 text-destructive";
    case "Confidential":
      return "bg-warning/20 text-warning";
    case "Public":
      return "bg-info/20 text-info";
    default:
      return "bg-muted text-muted-foreground";
  }
};

interface MetadataComparisonTableProps {
  type: "glossary" | "dictionary";
}

export const MetadataComparisonTable = ({ type }: MetadataComparisonTableProps) => {
  const data = type === "glossary" ? glossaryMockData : dictionaryMockData;

  if (type === "glossary") {
    return (
      <div className="card-glass rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border/30">
          <h3 className="text-lg font-semibold text-foreground">Business Glossary Validation</h3>
          <p className="text-sm text-muted-foreground mt-1">Field names from business glossary compared with AI-generated definitions</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Field Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Table</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Glossary Definition</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">AI-Generated Definition</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <div className="flex items-center justify-center gap-1">
                    Match Score
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-primary cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Semantic similarity between glossary definition and AI-generated definition</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => {
                const score = row.descriptionMatchScore;
                const ScoreIcon = getScoreIcon(score);
                return (
                  <tr key={index} className="data-table-row">
                    <td className="px-4 py-4">
                      <code className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                        {row.fieldName}
                      </code>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-medium text-info bg-info/10 px-2 py-1 rounded">
                        {row.tableName}
                      </span>
                    </td>
                    <td className="px-4 py-4 max-w-xs">
                      <p className="text-sm text-foreground">{row.originalDescription}</p>
                    </td>
                    <td className="px-4 py-4 max-w-xs">
                      <p className="text-sm text-foreground">{row.generatedDescription}</p>
                      <div className="flex items-start gap-1 mt-2">
                        <Info className="w-3 h-3 text-info mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">{row.explanation}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                          <ScoreIcon className={cn("w-4 h-4", getScoreColor(score))} />
                          <span className={cn("text-lg font-bold", getScoreColor(score))}>
                            {score}%
                          </span>
                        </div>
                        <div className="score-bar w-16">
                          <div 
                            className={cn("score-fill", getScoreBg(score))}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Data Dictionary view
  return (
    <div className="card-glass rounded-xl overflow-hidden">
      <div className="p-6 border-b border-border/30">
        <h3 className="text-lg font-semibold text-foreground">Data Dictionary Analysis</h3>
        <p className="text-sm text-muted-foreground mt-1">Comparing technical field specifications with AI-generated schema analysis</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/30">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Table</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Field Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  Type
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-primary cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Compares original data type vs. AI-detected type. Green = match, Red = mismatch.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  Sensitivity
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-primary cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Compares original sensitivity classification vs. AI-detected. Green = match, Red = mismatch.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Dictionary Specification</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">AI-Generated Specification</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center justify-center gap-1">
                  Match Score
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-primary cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Composite score: Definition match (60%), Type match (20%), Sensitivity match (20%). Reflects overall technical documentation accuracy.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const overallScore = calculateOverallScore(row);
              const ScoreIcon = getScoreIcon(overallScore);
              return (
                <tr key={index} className="data-table-row">
                  <td className="px-4 py-4">
                    <span className="text-xs font-medium text-info bg-info/10 px-2 py-1 rounded">
                      {row.tableName}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <code className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                      {row.fieldName}
                    </code>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                        {row.originalDataType}
                      </span>
                      <span className={cn(
                        "text-xs font-medium px-2 py-1 rounded",
                        row.typeMatch 
                          ? "text-success bg-success/10" 
                          : "text-destructive bg-destructive/10"
                      )}>
                        {row.generatedDataType}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={cn("text-xs font-medium px-2 py-1 rounded", getSensitivityBadge(row.originalSensitivity))}>
                        {row.originalSensitivity}
                      </span>
                      <span className={cn(
                        "text-xs font-medium px-2 py-1 rounded",
                        row.sensitivityMatch 
                          ? "text-success bg-success/10" 
                          : "text-destructive bg-destructive/10"
                      )}>
                        {row.generatedSensitivity}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 max-w-xs">
                    <p className="text-sm text-foreground">{row.originalDescription}</p>
                  </td>
                  <td className="px-4 py-4 max-w-xs">
                    <p className="text-sm text-foreground">{row.generatedDescription}</p>
                    <div className="flex items-start gap-1 mt-2">
                      <Info className="w-3 h-3 text-info mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">{row.explanation}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <ScoreIcon className={cn("w-4 h-4", getScoreColor(overallScore))} />
                        <span className={cn("text-lg font-bold", getScoreColor(overallScore))}>
                          {overallScore}%
                        </span>
                      </div>
                      <div className="score-bar w-16">
                        <div 
                          className={cn("score-fill", getScoreBg(overallScore))}
                          style={{ width: `${overallScore}%` }}
                        />
                      </div>
                      <div className="flex gap-1 text-[10px]">
                        <span className={row.typeMatch ? "text-success" : "text-destructive"}>T</span>
                        <span className="text-muted-foreground">|</span>
                        <span className={row.sensitivityMatch ? "text-success" : "text-destructive"}>S</span>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
