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
    fieldName: "customer_id",
    originalDescription: "Unique identifier for customer",
    generatedDescription: "Primary key uniquely identifying each customer record",
    matchScore: 92,
    explanation: "High semantic alignment with minor phrasing differences",
    dataType: "INTEGER",
    completeness: 100,
    consistency: 98,
    uniqueness: 100
  },
  {
    fieldName: "account_balance",
    originalDescription: "Current balance",
    generatedDescription: "Current monetary balance in customer account in USD",
    matchScore: 78,
    explanation: "Original lacks currency specification and context",
    dataType: "DECIMAL",
    completeness: 99,
    consistency: 95,
    uniqueness: 85
  },
  {
    fieldName: "last_transaction_date",
    originalDescription: "Date of transaction",
    generatedDescription: "Timestamp of the most recent transaction activity",
    matchScore: 65,
    explanation: "Missing temporal precision (last vs general)",
    dataType: "TIMESTAMP",
    completeness: 87,
    consistency: 82,
    uniqueness: 72
  },
  {
    fieldName: "risk_score",
    originalDescription: "Risk assessment",
    generatedDescription: "Computed risk score based on portfolio volatility (0-100)",
    matchScore: 55,
    explanation: "Original lacks scale and computation methodology",
    dataType: "INTEGER",
    completeness: 100,
    consistency: 90,
    uniqueness: 45
  },
  {
    fieldName: "investor_type",
    originalDescription: "Type of investor",
    generatedDescription: "Classification of investor (Retail/Institutional/HNWI)",
    matchScore: 85,
    explanation: "Good alignment, generated adds enum values",
    dataType: "VARCHAR",
    completeness: 98,
    consistency: 100,
    uniqueness: 12
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
