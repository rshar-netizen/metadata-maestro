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
  originalDescription: string;
  generatedDescription: string;
  matchScore: number;
  explanation: string;
  dataType: string;
}

// Business Glossary mock data - focuses on business term definitions
const glossaryMockData: FieldComparison[] = [
  {
    fieldName: "exposure_id",
    originalDescription: "Unique identifier for exposure",
    generatedDescription: "Primary key uniquely identifying each exposure record in the system",
    matchScore: 94,
    explanation: "High semantic alignment with minor phrasing differences",
    dataType: "VARCHAR"
  },
  {
    fieldName: "client_id",
    originalDescription: "Client identifier",
    generatedDescription: "Unique identifier linking to the master client record",
    matchScore: 88,
    explanation: "Good alignment, generated adds foreign key context",
    dataType: "VARCHAR"
  },
  {
    fieldName: "affiliate",
    originalDescription: "Affiliate indicator",
    generatedDescription: "Boolean flag indicating if client is an affiliate of parent organization",
    matchScore: 68,
    explanation: "Original missing data type and business logic context",
    dataType: "BOOLEAN"
  },
  {
    fieldName: "relationship_owner",
    originalDescription: "Owner of relationship",
    generatedDescription: "Primary relationship manager responsible for client engagement",
    matchScore: 71,
    explanation: "Generated adds role specificity and accountability context",
    dataType: "VARCHAR"
  },
  {
    fieldName: "mandate_status",
    originalDescription: "Status of mandate",
    generatedDescription: "Current lifecycle status of mandate (Active/Pending/Terminated/Suspended)",
    matchScore: 72,
    explanation: "Original lacks enumeration of valid status values",
    dataType: "VARCHAR"
  },
  {
    fieldName: "exposure_category",
    originalDescription: "Category of exposure",
    generatedDescription: "Classification of exposure type for risk aggregation purposes",
    matchScore: 65,
    explanation: "Missing risk management and aggregation context",
    dataType: "VARCHAR"
  },
  {
    fieldName: "asset_class",
    originalDescription: "Asset classification",
    generatedDescription: "Primary asset class categorization (Equity/Fixed Income/Alternatives/Cash)",
    matchScore: 78,
    explanation: "Generated provides enumeration of standard classifications",
    dataType: "VARCHAR"
  },
  {
    fieldName: "investment_strategy",
    originalDescription: "Investment approach",
    generatedDescription: "Defined investment strategy aligned with mandate objectives",
    matchScore: 74,
    explanation: "Original uses informal terminology vs formal strategy definition",
    dataType: "VARCHAR"
  },
  {
    fieldName: "aum_type",
    originalDescription: "AUM classification",
    generatedDescription: "Type classification of Assets Under Management (Regulatory/Discretionary/Advisory)",
    matchScore: 69,
    explanation: "Original lacks full form and enumeration",
    dataType: "VARCHAR"
  },
  {
    fieldName: "probability_weight",
    originalDescription: "Probability factor",
    generatedDescription: "Likelihood weighting (0-100%) applied to pipeline AUM projections",
    matchScore: 64,
    explanation: "Original missing scale definition and application context",
    dataType: "DECIMAL"
  }
];

// Data Dictionary mock data - focuses on technical field definitions
const dictionaryMockData: FieldComparison[] = [
  {
    fieldName: "exposure_id",
    originalDescription: "VARCHAR(36), NOT NULL, PRIMARY KEY",
    generatedDescription: "UUID primary key, 36-character string format, auto-generated on insert",
    matchScore: 92,
    explanation: "Technical specs align, generated adds UUID format detail",
    dataType: "VARCHAR(36)"
  },
  {
    fieldName: "client_id",
    originalDescription: "VARCHAR(36), NOT NULL, FK to clients",
    generatedDescription: "Foreign key reference to clients.id, enforces referential integrity",
    matchScore: 89,
    explanation: "Good alignment on FK relationship and constraints",
    dataType: "VARCHAR(36)"
  },
  {
    fieldName: "client_name",
    originalDescription: "VARCHAR(255), NOT NULL",
    generatedDescription: "Variable character field up to 255 chars, required field for client legal name",
    matchScore: 85,
    explanation: "Technical specs match, generated adds business context",
    dataType: "VARCHAR(255)"
  },
  {
    fieldName: "parent_client_id",
    originalDescription: "VARCHAR(36), NULLABLE, FK to clients",
    generatedDescription: "Self-referencing foreign key for client hierarchy, nullable for root clients",
    matchScore: 91,
    explanation: "Excellent alignment on nullability and self-reference pattern",
    dataType: "VARCHAR(36)"
  },
  {
    fieldName: "affiliate",
    originalDescription: "BOOLEAN, DEFAULT FALSE",
    generatedDescription: "Boolean flag with false default, indicates affiliate relationship status",
    matchScore: 94,
    explanation: "Perfect alignment on type and default value",
    dataType: "BOOLEAN"
  },
  {
    fieldName: "mandate_id",
    originalDescription: "VARCHAR(36), NOT NULL, FK to mandates",
    generatedDescription: "Foreign key to mandates table, required for all exposure records",
    matchScore: 88,
    explanation: "Strong alignment on FK constraint and requirement",
    dataType: "VARCHAR(36)"
  },
  {
    fieldName: "effective_start_date",
    originalDescription: "DATE, NOT NULL",
    generatedDescription: "Date field without time component, required, stores mandate effective date",
    matchScore: 82,
    explanation: "Type alignment confirmed, generated adds temporal precision note",
    dataType: "DATE"
  },
  {
    fieldName: "effective_end_date",
    originalDescription: "DATE, NULLABLE",
    generatedDescription: "Optional date field for mandate termination, NULL indicates active mandate",
    matchScore: 86,
    explanation: "Good alignment, generated clarifies NULL business meaning",
    dataType: "DATE"
  },
  {
    fieldName: "aum_usd",
    originalDescription: "DECIMAL(18,2), NOT NULL",
    generatedDescription: "18-digit decimal with 2 decimal places, stores USD-converted AUM value",
    matchScore: 93,
    explanation: "Excellent precision alignment with currency context",
    dataType: "DECIMAL(18,2)"
  },
  {
    fieldName: "currency",
    originalDescription: "CHAR(3), NOT NULL",
    generatedDescription: "3-character ISO 4217 currency code, fixed-length for standardization",
    matchScore: 87,
    explanation: "Type match confirmed, generated adds ISO standard reference",
    dataType: "CHAR(3)"
  },
  {
    fieldName: "source_system",
    originalDescription: "VARCHAR(50), NOT NULL",
    generatedDescription: "Source system identifier, max 50 chars, used for data lineage tracking",
    matchScore: 84,
    explanation: "Good alignment with lineage context added",
    dataType: "VARCHAR(50)"
  },
  {
    fieldName: "created_at",
    originalDescription: "TIMESTAMP, NOT NULL, DEFAULT NOW()",
    generatedDescription: "Auto-populated timestamp on record creation, used for audit trail",
    matchScore: 96,
    explanation: "Excellent alignment on auto-population and audit purpose",
    dataType: "TIMESTAMP"
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
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Field Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
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
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                        {row.fieldName}
                      </code>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                      {row.dataType}
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
