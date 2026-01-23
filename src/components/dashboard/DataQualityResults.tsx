import { useState } from "react";
import { 
  AlertTriangle, 
  ShieldAlert, 
  Code, 
  FileWarning, 
  Send, 
  Filter,
  ChevronDown,
  User,
  Clock,
  Sparkles,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AnomalyType = "logic_error" | "standardization" | "pii_risk" | "format_issue" | "outlier" | "missing_data";

interface Anomaly {
  id: string;
  fieldName: string;
  tableName: string;
  type: AnomalyType;
  severity: "high" | "medium" | "low";
  description: string;
  llmExplanation: string;
  affectedRecords: number;
  sampleValues: string[];
  recommendation: string;
  status: "open" | "acknowledged" | "resolved";
  assignee?: string;
  detectedAt: string;
}

const anomalies: Anomaly[] = [
  {
    id: "1",
    fieldName: "social_security_number",
    tableName: "customer_pii",
    type: "pii_risk",
    severity: "high",
    description: "Unmasked SSN values detected in production dataset",
    llmExplanation: "The LLM analysis detected 1,247 records containing unmasked Social Security Numbers in plain text format. This violates GDPR Article 32 and SOC 2 Type II requirements for data protection. The field should implement dynamic masking or tokenization.",
    affectedRecords: 1247,
    sampleValues: ["***-**-1234", "***-**-5678", "***-**-9012"],
    recommendation: "Implement column-level encryption or dynamic data masking. Consider tokenization for non-production environments.",
    status: "open",
    detectedAt: "10 min ago"
  },
  {
    id: "2",
    fieldName: "transaction_amount",
    tableName: "portfolio_transactions",
    type: "logic_error",
    severity: "high",
    description: "Negative values in transaction_amount field for 'BUY' orders",
    llmExplanation: "Business logic violation detected: 342 BUY transactions have negative amount values. According to the data dictionary, BUY orders must have positive amounts while SELL orders should be negative. This inconsistency suggests an ETL transformation error.",
    affectedRecords: 342,
    sampleValues: ["-5000.00", "-12500.50", "-750.00"],
    recommendation: "Review ETL pipeline for sign conversion logic. Validate against source system to determine correct transformation.",
    status: "open",
    assignee: "Data Engineering",
    detectedAt: "1 hour ago"
  },
  {
    id: "3",
    fieldName: "country_code",
    tableName: "customer_address",
    type: "standardization",
    severity: "medium",
    description: "Mixed format country codes (ISO-2 vs ISO-3 vs full names)",
    llmExplanation: "Standardization inconsistency found: The country_code field contains mixed formats - 45% use ISO 3166-1 alpha-2 (US, GB), 30% use alpha-3 (USA, GBR), and 25% use full country names. The business glossary specifies ISO 3166-1 alpha-2 as the standard.",
    affectedRecords: 8934,
    sampleValues: ["US", "USA", "United States", "GB", "GBR"],
    recommendation: "Create a standardization mapping table and implement ETL transformation to normalize all values to ISO 3166-1 alpha-2.",
    status: "acknowledged",
    assignee: "Sarah Chen",
    detectedAt: "3 hours ago"
  },
  {
    id: "4",
    fieldName: "phone_number",
    tableName: "customer_contact",
    type: "format_issue",
    severity: "medium",
    description: "Phone numbers with inconsistent formatting patterns",
    llmExplanation: "Format validation failed for 2,156 records. Detected patterns include: +1 (xxx) xxx-xxxx, xxx-xxx-xxxx, xxxxxxxxxx, and international formats without proper E.164 standardization. This affects downstream integrations with communication services.",
    affectedRecords: 2156,
    sampleValues: ["+1 (555) 123-4567", "555-123-4567", "5551234567"],
    recommendation: "Implement E.164 format standardization at ingestion. Add validation rules to reject non-conforming inputs.",
    status: "acknowledged",
    detectedAt: "5 hours ago"
  },
  {
    id: "5",
    fieldName: "risk_score",
    tableName: "portfolio_analytics",
    type: "outlier",
    severity: "low",
    description: "Outlier values exceeding defined range (0-100)",
    llmExplanation: "Statistical outlier detection found 23 records with risk_score values outside the documented 0-100 range. Values include 150, 200, and -25. This may indicate calculation errors or missing boundary validation in the scoring algorithm.",
    affectedRecords: 23,
    sampleValues: ["150", "200", "-25", "105"],
    recommendation: "Add CHECK constraint to database column. Review scoring algorithm for boundary conditions.",
    status: "resolved",
    assignee: "Mike Johnson",
    detectedAt: "1 day ago"
  },
  {
    id: "6",
    fieldName: "date_of_birth",
    tableName: "customer_pii",
    type: "missing_data",
    severity: "medium",
    description: "Null values in mandatory date_of_birth field",
    llmExplanation: "Data completeness issue: 567 customer records have NULL date_of_birth values. This field is marked as mandatory in the data dictionary and is required for KYC compliance and age verification processes.",
    affectedRecords: 567,
    sampleValues: ["NULL", "NULL", "NULL"],
    recommendation: "Implement NOT NULL constraint after data remediation. Set up data quality alerts for future NULL insertions.",
    status: "open",
    detectedAt: "2 days ago"
  }
];

const getTypeIcon = (type: AnomalyType) => {
  switch (type) {
    case "pii_risk": return ShieldAlert;
    case "logic_error": return Code;
    case "standardization": return FileWarning;
    case "format_issue": return FileWarning;
    case "outlier": return AlertTriangle;
    case "missing_data": return AlertTriangle;
    default: return AlertTriangle;
  }
};

const getTypeLabel = (type: AnomalyType) => {
  switch (type) {
    case "pii_risk": return "PII Compliance Risk";
    case "logic_error": return "Logic Error";
    case "standardization": return "Standardization Error";
    case "format_issue": return "Format Issue";
    case "outlier": return "Outlier Detected";
    case "missing_data": return "Missing Data";
  }
};

const getSeverityStyles = (severity: Anomaly["severity"]) => {
  switch (severity) {
    case "high": return "status-danger";
    case "medium": return "status-warning";
    case "low": return "status-info";
  }
};

const getStatusStyles = (status: Anomaly["status"]) => {
  switch (status) {
    case "open": return "bg-destructive/20 text-destructive border-destructive/30";
    case "acknowledged": return "bg-warning/20 text-warning border-warning/30";
    case "resolved": return "bg-success/20 text-success border-success/30";
  }
};

export const DataQualityResults = () => {
  const [expandedAnomalies, setExpandedAnomalies] = useState<string[]>(["1"]);
  const [filter, setFilter] = useState<"all" | AnomalyType>("all");

  const toggleAnomaly = (id: string) => {
    setExpandedAnomalies(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const filteredAnomalies = filter === "all" 
    ? anomalies 
    : anomalies.filter(a => a.type === filter);

  const handlePushAlert = (anomaly: Anomaly) => {
    console.log("Pushing alert for:", anomaly.id);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-glass rounded-xl p-4 border-l-4 border-l-destructive">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-destructive" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {anomalies.filter(a => a.type === "pii_risk").length}
              </p>
              <p className="text-sm text-muted-foreground">PII Risks</p>
            </div>
          </div>
        </div>
        <div className="card-glass rounded-xl p-4 border-l-4 border-l-warning">
          <div className="flex items-center gap-3">
            <Code className="w-8 h-8 text-warning" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {anomalies.filter(a => a.type === "logic_error").length}
              </p>
              <p className="text-sm text-muted-foreground">Logic Errors</p>
            </div>
          </div>
        </div>
        <div className="card-glass rounded-xl p-4 border-l-4 border-l-info">
          <div className="flex items-center gap-3">
            <FileWarning className="w-8 h-8 text-info" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {anomalies.filter(a => a.type === "standardization" || a.type === "format_issue").length}
              </p>
              <p className="text-sm text-muted-foreground">Standardization Issues</p>
            </div>
          </div>
        </div>
        <div className="card-glass rounded-xl p-4 border-l-4 border-l-success">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-success" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {anomalies.filter(a => a.status === "resolved").length}
              </p>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </div>
          </div>
        </div>
      </div>

      {/* LLM Analysis Header */}
      <div className="card-glass rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">AI-Powered Quality Analysis</h3>
            <p className="text-xs text-muted-foreground">
              LLM validation completed • Last run: 10 minutes ago • {anomalies.length} anomalies detected
            </p>
          </div>
          <Button size="sm" className="gap-2 bg-primary text-primary-foreground">
            <Sparkles className="w-4 h-4" />
            Re-run Analysis
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Button 
          variant={filter === "all" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("all")}
          className={filter === "all" ? "bg-primary text-primary-foreground" : ""}
        >
          All ({anomalies.length})
        </Button>
        <Button 
          variant={filter === "pii_risk" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("pii_risk")}
          className={filter === "pii_risk" ? "bg-destructive text-destructive-foreground" : ""}
        >
          PII Risk
        </Button>
        <Button 
          variant={filter === "logic_error" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("logic_error")}
          className={filter === "logic_error" ? "bg-warning text-warning-foreground" : ""}
        >
          Logic Error
        </Button>
        <Button 
          variant={filter === "standardization" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("standardization")}
        >
          Standardization
        </Button>
      </div>

      {/* Anomaly List */}
      <div className="space-y-4">
        {filteredAnomalies.map((anomaly) => {
          const isExpanded = expandedAnomalies.includes(anomaly.id);
          const Icon = getTypeIcon(anomaly.type);

          return (
            <div key={anomaly.id} className="card-glass rounded-xl overflow-hidden">
              <div 
                className="p-4 cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => toggleAnomaly(anomaly.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-2 rounded-lg",
                    anomaly.severity === "high" ? "bg-destructive/20" : 
                    anomaly.severity === "medium" ? "bg-warning/20" : "bg-info/20"
                  )}>
                    <Icon className={cn(
                      "w-5 h-5",
                      anomaly.severity === "high" ? "text-destructive" : 
                      anomaly.severity === "medium" ? "text-warning" : "text-info"
                    )} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {anomaly.fieldName}
                          </code>
                          <span className="text-xs text-muted-foreground">
                            in {anomaly.tableName}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{anomaly.description}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={cn("px-2 py-1 rounded text-xs font-medium", getSeverityStyles(anomaly.severity))}>
                          {anomaly.severity}
                        </span>
                        <span className={cn("px-2 py-1 rounded text-xs font-medium border", getStatusStyles(anomaly.status))}>
                          {anomaly.status}
                        </span>
                        <ChevronDown className={cn(
                          "w-4 h-4 text-muted-foreground transition-transform",
                          isExpanded && "rotate-180"
                        )} />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {anomaly.detectedAt}
                      </span>
                      <span>{anomaly.affectedRecords.toLocaleString()} records affected</span>
                      <span className="px-2 py-0.5 rounded bg-muted/50">{getTypeLabel(anomaly.type)}</span>
                      {anomaly.assignee && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {anomaly.assignee}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border/30 pt-4 space-y-4 animate-fade-in">
                  <div className="bg-muted/20 rounded-lg p-4">
                    <div className="flex items-start gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                      <span className="text-sm font-medium text-primary">LLM Analysis</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {anomaly.llmExplanation}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        Sample Values
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {anomaly.sampleValues.map((value, i) => (
                          <code key={i} className="text-xs bg-muted px-2 py-1 rounded font-mono">
                            {value}
                          </code>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        Recommendation
                      </h4>
                      <p className="text-sm text-foreground">{anomaly.recommendation}</p>
                    </div>
                  </div>

                  {anomaly.status !== "resolved" && (
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="gap-2"
                        onClick={() => handlePushAlert(anomaly)}
                      >
                        <Send className="w-4 h-4" />
                        Push Alert
                      </Button>
                      <Button size="sm" variant="outline">
                        Assign Owner
                      </Button>
                      {anomaly.status === "open" && (
                        <Button size="sm" variant="outline">
                          Acknowledge
                        </Button>
                      )}
                      <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90 gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Mark Resolved
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
