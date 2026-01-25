import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldComparison {
  fieldName: string;
  originalDescription: string;
  generatedDescription: string;
  matchScore: number;
  explanation: string;
  dataType: string;
  completeness: number;
  consistency: number;
  uniqueness: number;
}

const mockData: FieldComparison[] = [
  {
    fieldName: "exposure_id",
    originalDescription: "Unique identifier for exposure",
    generatedDescription: "Primary key uniquely identifying each exposure record in the system",
    matchScore: 94,
    explanation: "High semantic alignment with minor phrasing differences",
    dataType: "VARCHAR",
    completeness: 100,
    consistency: 99,
    uniqueness: 100
  },
  {
    fieldName: "client_id",
    originalDescription: "Client identifier",
    generatedDescription: "Unique identifier linking to the master client record",
    matchScore: 88,
    explanation: "Good alignment, generated adds foreign key context",
    dataType: "VARCHAR",
    completeness: 100,
    consistency: 98,
    uniqueness: 85
  },
  {
    fieldName: "client_name",
    originalDescription: "Name of client",
    generatedDescription: "Legal or registered name of the client entity",
    matchScore: 82,
    explanation: "Generated specifies legal naming context",
    dataType: "VARCHAR",
    completeness: 99,
    consistency: 92,
    uniqueness: 78
  },
  {
    fieldName: "parent_client_id",
    originalDescription: "Parent client reference",
    generatedDescription: "Foreign key referencing the parent client in hierarchical structure",
    matchScore: 75,
    explanation: "Original lacks hierarchical relationship context",
    dataType: "VARCHAR",
    completeness: 72,
    consistency: 95,
    uniqueness: 45
  },
  {
    fieldName: "affiliate",
    originalDescription: "Affiliate indicator",
    generatedDescription: "Boolean flag indicating if client is an affiliate of parent organization",
    matchScore: 68,
    explanation: "Original missing data type and business logic context",
    dataType: "BOOLEAN",
    completeness: 100,
    consistency: 100,
    uniqueness: 8
  },
  {
    fieldName: "relationship_owner",
    originalDescription: "Owner of relationship",
    generatedDescription: "Primary relationship manager responsible for client engagement",
    matchScore: 71,
    explanation: "Generated adds role specificity and accountability context",
    dataType: "VARCHAR",
    completeness: 95,
    consistency: 88,
    uniqueness: 32
  },
  {
    fieldName: "mandate_id",
    originalDescription: "Mandate identifier",
    generatedDescription: "Unique identifier for investment mandate agreement",
    matchScore: 85,
    explanation: "Good alignment with investment context added",
    dataType: "VARCHAR",
    completeness: 100,
    consistency: 97,
    uniqueness: 100
  },
  {
    fieldName: "mandate_status",
    originalDescription: "Status of mandate",
    generatedDescription: "Current lifecycle status of mandate (Active/Pending/Terminated/Suspended)",
    matchScore: 72,
    explanation: "Original lacks enumeration of valid status values",
    dataType: "VARCHAR",
    completeness: 100,
    consistency: 100,
    uniqueness: 5
  },
  {
    fieldName: "exposure_category",
    originalDescription: "Category of exposure",
    generatedDescription: "Classification of exposure type for risk aggregation purposes",
    matchScore: 65,
    explanation: "Missing risk management and aggregation context",
    dataType: "VARCHAR",
    completeness: 98,
    consistency: 94,
    uniqueness: 12
  },
  {
    fieldName: "asset_class",
    originalDescription: "Asset classification",
    generatedDescription: "Primary asset class categorization (Equity/Fixed Income/Alternatives/Cash)",
    matchScore: 78,
    explanation: "Generated provides enumeration of standard classifications",
    dataType: "VARCHAR",
    completeness: 100,
    consistency: 100,
    uniqueness: 6
  },
  {
    fieldName: "investment_strategy",
    originalDescription: "Investment approach",
    generatedDescription: "Defined investment strategy aligned with mandate objectives",
    matchScore: 74,
    explanation: "Original uses informal terminology vs formal strategy definition",
    dataType: "VARCHAR",
    completeness: 97,
    consistency: 91,
    uniqueness: 18
  },
  {
    fieldName: "mandate_type",
    originalDescription: "Type of mandate",
    generatedDescription: "Classification of mandate structure (Discretionary/Advisory/Sub-Advisory)",
    matchScore: 70,
    explanation: "Original lacks enumeration and structural context",
    dataType: "VARCHAR",
    completeness: 100,
    consistency: 100,
    uniqueness: 4
  },
  {
    fieldName: "effective_start_date",
    originalDescription: "Start date",
    generatedDescription: "Date when mandate agreement becomes legally effective",
    matchScore: 62,
    explanation: "Original too generic, lacks legal/contractual context",
    dataType: "DATE",
    completeness: 100,
    consistency: 98,
    uniqueness: 67
  },
  {
    fieldName: "effective_end_date",
    originalDescription: "End date",
    generatedDescription: "Date when mandate agreement terminates or expires",
    matchScore: 60,
    explanation: "Original too generic, lacks termination context",
    dataType: "DATE",
    completeness: 45,
    consistency: 96,
    uniqueness: 52
  },
  {
    fieldName: "as_of_date",
    originalDescription: "Reporting date",
    generatedDescription: "Reference date for which exposure and AUM values are calculated",
    matchScore: 76,
    explanation: "Generated adds calculation reference context",
    dataType: "DATE",
    completeness: 100,
    consistency: 100,
    uniqueness: 89
  },
  {
    fieldName: "aum_type",
    originalDescription: "AUM classification",
    generatedDescription: "Type classification of Assets Under Management (Regulatory/Discretionary/Advisory)",
    matchScore: 69,
    explanation: "Original lacks full form and enumeration",
    dataType: "VARCHAR",
    completeness: 100,
    consistency: 100,
    uniqueness: 4
  },
  {
    fieldName: "aum_usd",
    originalDescription: "AUM in USD",
    generatedDescription: "Total Assets Under Management converted to US Dollars",
    matchScore: 91,
    explanation: "High alignment with currency conversion context",
    dataType: "DECIMAL",
    completeness: 99,
    consistency: 95,
    uniqueness: 94
  },
  {
    fieldName: "currency",
    originalDescription: "Currency code",
    generatedDescription: "ISO 4217 currency code for original denomination",
    matchScore: 83,
    explanation: "Generated adds ISO standard reference",
    dataType: "VARCHAR",
    completeness: 100,
    consistency: 100,
    uniqueness: 15
  },
  {
    fieldName: "expected_close_date",
    originalDescription: "Expected close",
    generatedDescription: "Projected date for mandate finalization or funding",
    matchScore: 58,
    explanation: "Original lacks business process context",
    dataType: "DATE",
    completeness: 68,
    consistency: 82,
    uniqueness: 71
  },
  {
    fieldName: "probability_weight",
    originalDescription: "Probability factor",
    generatedDescription: "Likelihood weighting (0-100%) applied to pipeline AUM projections",
    matchScore: 64,
    explanation: "Original missing scale definition and application context",
    dataType: "DECIMAL",
    completeness: 75,
    consistency: 88,
    uniqueness: 42
  },
  {
    fieldName: "source_system",
    originalDescription: "Source system name",
    generatedDescription: "Originating system identifier for data lineage tracking",
    matchScore: 79,
    explanation: "Generated adds data lineage context",
    dataType: "VARCHAR",
    completeness: 100,
    consistency: 100,
    uniqueness: 8
  },
  {
    fieldName: "source_record_id",
    originalDescription: "Source record ID",
    generatedDescription: "Original record identifier from source system for audit trail",
    matchScore: 86,
    explanation: "Good alignment with audit context added",
    dataType: "VARCHAR",
    completeness: 100,
    consistency: 97,
    uniqueness: 100
  },
  {
    fieldName: "source_confidence",
    originalDescription: "Data confidence level",
    generatedDescription: "Quality confidence score (High/Medium/Low) from source system validation",
    matchScore: 67,
    explanation: "Original lacks enumeration and validation context",
    dataType: "VARCHAR",
    completeness: 92,
    consistency: 85,
    uniqueness: 4
  },
  {
    fieldName: "notes",
    originalDescription: "Additional notes",
    generatedDescription: "Free-text field for supplementary information and exceptions",
    matchScore: 80,
    explanation: "Good alignment with purpose clarification",
    dataType: "TEXT",
    completeness: 35,
    consistency: 45,
    uniqueness: 88
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

export const MetadataComparisonTable = () => {
  return (
    <div className="card-glass rounded-xl overflow-hidden">
      <div className="p-6 border-b border-border/30">
        <h3 className="text-lg font-semibold text-foreground">Metadata Comparison Analysis</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Comparing original descriptions with AI-generated definitions
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/30">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Field Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Original Description</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Generated Description</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Match Score</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Completeness</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Consistency</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Uniqueness</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((row, index) => {
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
                  <td className="px-4 py-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className={cn("text-sm font-semibold", getScoreColor(row.completeness))}>
                        {row.completeness}%
                      </span>
                      <div className="score-bar w-12">
                        <div 
                          className={cn("score-fill", getScoreBg(row.completeness))}
                          style={{ width: `${row.completeness}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className={cn("text-sm font-semibold", getScoreColor(row.consistency))}>
                        {row.consistency}%
                      </span>
                      <div className="score-bar w-12">
                        <div 
                          className={cn("score-fill", getScoreBg(row.consistency))}
                          style={{ width: `${row.consistency}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className={cn("text-sm font-semibold", getScoreColor(row.uniqueness))}>
                        {row.uniqueness}%
                      </span>
                      <div className="score-bar w-12">
                        <div 
                          className={cn("score-fill", getScoreBg(row.uniqueness))}
                          style={{ width: `${row.uniqueness}%` }}
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
