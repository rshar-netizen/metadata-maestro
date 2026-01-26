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
  matchScore: number;
  explanation: string;
  dataType: string;
  sensitivity: string;
}

// Business Glossary mock data - focuses on business term definitions
const glossaryMockData: FieldComparison[] = [
  {
    fieldName: "property_id",
    tableName: "property_master",
    originalDescription: "Unique identifier for the property",
    generatedDescription: "Primary key uniquely identifying each real estate asset in the portfolio management system",
    matchScore: 94,
    explanation: "High semantic alignment with minor phrasing differences",
    dataType: "string",
    sensitivity: "Internal"
  },
  {
    fieldName: "property_name",
    tableName: "property_master",
    originalDescription: "Market-facing property name",
    generatedDescription: "Public-facing display name used for property marketing and tenant communications",
    matchScore: 88,
    explanation: "Good alignment, generated adds marketing context",
    dataType: "string",
    sensitivity: "Internal"
  },
  {
    fieldName: "property_type",
    tableName: "property_master",
    originalDescription: "Property category",
    generatedDescription: "Classification of real estate asset type (Multifamily/Office/Industrial/Retail)",
    matchScore: 72,
    explanation: "Original lacks enumeration of valid property types",
    dataType: "string",
    sensitivity: "Internal"
  },
  {
    fieldName: "occupancy_rate_pct",
    tableName: "property_master",
    originalDescription: "Occupancy %",
    generatedDescription: "Percentage of leasable space currently occupied by tenants, measured as leased sqft / total sqft",
    matchScore: 68,
    explanation: "Original missing calculation methodology context",
    dataType: "float",
    sensitivity: "Internal"
  },
  {
    fieldName: "tenant_legal_name",
    tableName: "tenant_master",
    originalDescription: "Legal tenant name",
    generatedDescription: "Registered legal entity name of the tenant organization for contractual purposes",
    matchScore: 91,
    explanation: "High alignment with legal context added",
    dataType: "string",
    sensitivity: "Internal"
  },
  {
    fieldName: "credit_rating_internal",
    tableName: "tenant_master",
    originalDescription: "Internal credit rating",
    generatedDescription: "Proprietary credit assessment score (AAA/AA/A/BBB/BB/B) based on financial analysis",
    matchScore: 65,
    explanation: "Original lacks rating scale enumeration",
    dataType: "string",
    sensitivity: "Confidential"
  },
  {
    fieldName: "lease_type",
    tableName: "lease_master",
    originalDescription: "Lease structure (e.g., NNN, Gross)",
    generatedDescription: "Classification of lease expense structure (Triple Net/Modified Gross/Full Service)",
    matchScore: 85,
    explanation: "Good alignment with lease terminology",
    dataType: "string",
    sensitivity: "Internal"
  },
  {
    fieldName: "base_rent_annual_usd",
    tableName: "lease_master",
    originalDescription: "Annual base rent amount",
    generatedDescription: "Contractual annual base rent in USD, excluding pass-throughs and escalations",
    matchScore: 78,
    explanation: "Generated adds exclusion context for financial clarity",
    dataType: "float",
    sensitivity: "Confidential"
  },
  {
    fieldName: "deal_stage",
    tableName: "deal_pipeline",
    originalDescription: "Current deal stage in workflow",
    generatedDescription: "Investment committee workflow status (Screening/Due Diligence/IC Review/Approved/Closed)",
    matchScore: 62,
    explanation: "Original lacks stage enumeration and IC context",
    dataType: "string",
    sensitivity: "Internal"
  },
  {
    fieldName: "target_irr_pct",
    tableName: "deal_pipeline",
    originalDescription: "Target internal rate of return (IRR)",
    generatedDescription: "Projected annualized return target for investment evaluation, expressed as percentage",
    matchScore: 89,
    explanation: "Strong alignment with investment terminology",
    dataType: "float",
    sensitivity: "Confidential"
  },
  {
    fieldName: "capex_type",
    tableName: "capex_project",
    originalDescription: "Type/category of capex project",
    generatedDescription: "Capital expenditure classification (HVAC/Roof/Elevator/Lobby/Parking/TI)",
    matchScore: 71,
    explanation: "Original missing project type enumeration",
    dataType: "string",
    sensitivity: "Internal"
  },
  {
    fieldName: "appraised_value_usd",
    tableName: "property_valuation",
    originalDescription: "Appraised market value",
    generatedDescription: "Third-party appraised fair market value in USD as of valuation date",
    matchScore: 92,
    explanation: "Excellent alignment with valuation terminology",
    dataType: "float",
    sensitivity: "Confidential"
  },
  {
    fieldName: "cap_rate_pct",
    tableName: "property_valuation",
    originalDescription: "Implied/market capitalization rate (%)",
    generatedDescription: "Capitalization rate derived from NOI divided by property value, expressed as percentage",
    matchScore: 86,
    explanation: "Good alignment, generated adds calculation context",
    dataType: "float",
    sensitivity: "Confidential"
  },
  {
    fieldName: "green_certification",
    tableName: "property_esg_metrics",
    originalDescription: "Green building certification level",
    generatedDescription: "Sustainability certification status (LEED Platinum/Gold/Silver/ENERGY STAR/None)",
    matchScore: 74,
    explanation: "Original lacks certification level enumeration",
    dataType: "string",
    sensitivity: "Internal"
  },
  {
    fieldName: "ghg_kgco2e_per_sqft",
    tableName: "property_esg_metrics",
    originalDescription: "GHG emissions intensity (kgCO2e per sqft)",
    generatedDescription: "Greenhouse gas emissions normalized by property area, measured in kilograms CO2 equivalent",
    matchScore: 95,
    explanation: "High alignment with ESG measurement standards",
    dataType: "float",
    sensitivity: "Internal"
  }
];

// Data Dictionary mock data - focuses on technical field definitions
const dictionaryMockData: FieldComparison[] = [
  {
    fieldName: "property_id",
    tableName: "property_master",
    originalDescription: "string, PRIMARY KEY, NOT NULL",
    generatedDescription: "VARCHAR(20) primary key, format PRP######, auto-validated on insert",
    matchScore: 92,
    explanation: "Technical specs align, generated adds format pattern",
    dataType: "string",
    sensitivity: "Internal"
  },
  {
    fieldName: "property_name",
    tableName: "property_master",
    originalDescription: "string, NOT NULL",
    generatedDescription: "VARCHAR(255), required field for property display name, indexed for search",
    matchScore: 88,
    explanation: "Good alignment, generated adds length and index info",
    dataType: "string",
    sensitivity: "Internal"
  },
  {
    fieldName: "latitude",
    tableName: "property_master",
    originalDescription: "float",
    generatedDescription: "DECIMAL(8,5) for geographic coordinate, range -90 to +90, nullable",
    matchScore: 85,
    explanation: "Generated adds precision and valid range constraints",
    dataType: "float",
    sensitivity: "Internal"
  },
  {
    fieldName: "longitude",
    tableName: "property_master",
    originalDescription: "float",
    generatedDescription: "DECIMAL(9,5) for geographic coordinate, range -180 to +180, nullable",
    matchScore: 85,
    explanation: "Generated adds precision and valid range constraints",
    dataType: "float",
    sensitivity: "Internal"
  },
  {
    fieldName: "tenant_id",
    tableName: "tenant_master",
    originalDescription: "string, PRIMARY KEY",
    generatedDescription: "VARCHAR(20), format TNT######, unique identifier with referential integrity to lease_master",
    matchScore: 91,
    explanation: "Excellent alignment on PK, generated adds FK relationship",
    dataType: "string",
    sensitivity: "Internal"
  },
  {
    fieldName: "lease_id",
    tableName: "lease_master",
    originalDescription: "string, PRIMARY KEY",
    generatedDescription: "VARCHAR(20), format LS#######, composite foreign keys to property_master and tenant_master",
    matchScore: 94,
    explanation: "Strong alignment with relationship context added",
    dataType: "string",
    sensitivity: "Internal"
  },
  {
    fieldName: "lease_start_date",
    tableName: "lease_master",
    originalDescription: "date",
    generatedDescription: "DATE, NOT NULL, must be <= lease_end_date, indexed for active lease queries",
    matchScore: 82,
    explanation: "Generated adds validation rule and indexing context",
    dataType: "date",
    sensitivity: "Internal"
  },
  {
    fieldName: "lease_end_date",
    tableName: "lease_master",
    originalDescription: "date",
    generatedDescription: "DATE, NOT NULL, must be >= lease_start_date, used for lease expiration reporting",
    matchScore: 82,
    explanation: "Generated adds validation rule and business purpose",
    dataType: "date",
    sensitivity: "Internal"
  },
  {
    fieldName: "is_active",
    tableName: "lease_master",
    originalDescription: "boolean",
    generatedDescription: "BOOLEAN, derived flag (lease_end_date >= CURRENT_DATE), indexed for filtering",
    matchScore: 78,
    explanation: "Generated clarifies derived nature and indexing",
    dataType: "boolean",
    sensitivity: "Internal"
  },
  {
    fieldName: "deal_id",
    tableName: "deal_pipeline",
    originalDescription: "string, PRIMARY KEY",
    generatedDescription: "VARCHAR(20), format DL#######, unique deal identifier with FK to property_master",
    matchScore: 93,
    explanation: "Excellent alignment with relationship context",
    dataType: "string",
    sensitivity: "Internal"
  },
  {
    fieldName: "indicative_price_usd",
    tableName: "deal_pipeline",
    originalDescription: "float",
    generatedDescription: "DECIMAL(15,2), nullable, stores indicative purchase/sale price in USD",
    matchScore: 86,
    explanation: "Generated adds precision and nullability context",
    dataType: "float",
    sensitivity: "Confidential"
  },
  {
    fieldName: "budget_usd",
    tableName: "capex_project",
    originalDescription: "float",
    generatedDescription: "DECIMAL(12,2), NOT NULL, approved capex budget amount, must be > 0",
    matchScore: 84,
    explanation: "Generated adds precision and validation constraints",
    dataType: "float",
    sensitivity: "Confidential"
  },
  {
    fieldName: "valuation_id",
    tableName: "property_valuation",
    originalDescription: "string, PRIMARY KEY",
    generatedDescription: "VARCHAR(20), format VAL#######, unique per valuation event, FK to property_master",
    matchScore: 95,
    explanation: "Excellent alignment with format and FK context",
    dataType: "string",
    sensitivity: "Internal"
  },
  {
    fieldName: "valuation_date",
    tableName: "property_valuation",
    originalDescription: "date",
    generatedDescription: "DATE, NOT NULL, effective date of appraisal, indexed for time-series queries",
    matchScore: 88,
    explanation: "Good alignment with temporal indexing context",
    dataType: "date",
    sensitivity: "Internal"
  },
  {
    fieldName: "as_of_date",
    tableName: "property_esg_metrics",
    originalDescription: "date",
    generatedDescription: "DATE, part of composite PK with property_id, quarterly snapshot reference date",
    matchScore: 90,
    explanation: "Strong alignment with composite key context",
    dataType: "date",
    sensitivity: "Internal"
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
    default:
      return "bg-muted text-muted-foreground";
  }
};

interface MetadataComparisonTableProps {
  type: "glossary" | "dictionary";
}

export const MetadataComparisonTable = ({ type }: MetadataComparisonTableProps) => {
  const data = type === "glossary" ? glossaryMockData : dictionaryMockData;
  
  const config = {
    glossary: {
      title: "Glossary Definition Analysis",
      subtitle: "Comparing business glossary terms with AI-generated semantic definitions",
      originalHeader: "Glossary Definition",
      generatedHeader: "AI-Generated Definition",
      matchTooltip: "Semantic similarity between your business glossary definition and the AI-generated business meaning. Higher scores indicate better terminology alignment."
    },
    dictionary: {
      title: "Data Dictionary Analysis",
      subtitle: "Comparing technical field specifications with AI-generated schema analysis",
      originalHeader: "Dictionary Specification",
      generatedHeader: "AI-Generated Specification",
      matchTooltip: "Technical accuracy between your data dictionary specification and the AI-generated schema analysis. Higher scores indicate better documentation coverage."
    }
  };

  const { title, subtitle, originalHeader, generatedHeader, matchTooltip } = config[type];

  return (
    <div className="card-glass rounded-xl overflow-hidden">
      <div className="p-6 border-b border-border/30">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/30">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Table</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Field Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Sensitivity</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{originalHeader}</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{generatedHeader}</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center justify-center gap-1">
                  Match Score
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-primary cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{matchTooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const ScoreIcon = getScoreIcon(row.matchScore);
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
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                      {row.dataType}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={cn("text-xs font-medium px-2 py-1 rounded", getSensitivityBadge(row.sensitivity))}>
                      {row.sensitivity}
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
                        <ScoreIcon className={cn("w-4 h-4", getScoreColor(row.matchScore))} />
                        <span className={cn("text-lg font-bold", getScoreColor(row.matchScore))}>
                          {row.matchScore}%
                        </span>
                      </div>
                      <div className="score-bar w-16">
                        <div 
                          className={cn("score-fill", getScoreBg(row.matchScore))}
                          style={{ width: `${row.matchScore}%` }}
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
};
