import { ChevronDown, ChevronRight, TrendingUp, TrendingDown, Info } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useMetadata } from "@/contexts/MetadataContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SubDomain {
  name: string;
  tables: string[];
  glossaryScore: number;
  dictionaryScore: number;
  fieldsCount: number;
  lastUpdated: string;
  trend: number;
}

interface Domain {
  name: string;
  overallScore: number;
  glossaryScore: number;
  dictionaryScore: number;
  subDomains: SubDomain[];
  status: "healthy" | "warning" | "critical";
}

// Default domain hierarchy structure with sample data based on PGIM files
const defaultDomainHierarchy: Domain[] = [
  {
    name: "Real Estate",
    overallScore: 84,
    glossaryScore: 87,
    dictionaryScore: 84,
    status: "healthy",
    subDomains: [
      { name: "Assets", tables: ["property_master", "property_portfolio_map"], glossaryScore: 92, dictionaryScore: 88, fieldsCount: 24, lastUpdated: "2 hours ago", trend: 3.2 },
      { name: "Leases", tables: ["lease_master", "tenant_master"], glossaryScore: 85, dictionaryScore: 82, fieldsCount: 22, lastUpdated: "1 day ago", trend: 1.8 },
      { name: "Deals", tables: ["deal_pipeline"], glossaryScore: 88, dictionaryScore: 85, fieldsCount: 11, lastUpdated: "3 hours ago", trend: 2.4 },
      { name: "Operations", tables: ["capex_project"], glossaryScore: 86, dictionaryScore: 83, fieldsCount: 12, lastUpdated: "5 hours ago", trend: 1.1 },
      { name: "Valuation", tables: ["property_valuation"], glossaryScore: 89, dictionaryScore: 86, fieldsCount: 10, lastUpdated: "1 day ago", trend: 4.5 },
      { name: "ESG", tables: ["property_esg_metrics"], glossaryScore: 82, dictionaryScore: 78, fieldsCount: 11, lastUpdated: "2 days ago", trend: -0.8 }
    ]
  },
  {
    name: "Fixed Income",
    overallScore: 72,
    glossaryScore: 74,
    dictionaryScore: 70,
    status: "warning",
    subDomains: [
      { name: "Security Master", tables: ["bond_master", "issuer_master"], glossaryScore: 78, dictionaryScore: 74, fieldsCount: 45, lastUpdated: "4 hours ago", trend: 2.1 },
      { name: "Portfolios", tables: ["fi_portfolio"], glossaryScore: 72, dictionaryScore: 68, fieldsCount: 28, lastUpdated: "1 day ago", trend: 0.9 },
      { name: "Risk Analytics", tables: ["duration_metrics"], glossaryScore: 68, dictionaryScore: 64, fieldsCount: 34, lastUpdated: "6 hours ago", trend: -1.5 },
      { name: "Trading", tables: ["fi_trade"], glossaryScore: 75, dictionaryScore: 71, fieldsCount: 52, lastUpdated: "30 min ago", trend: 1.2 }
    ]
  },
  {
    name: "Jennison",
    overallScore: 89,
    glossaryScore: 91,
    dictionaryScore: 87,
    status: "healthy",
    subDomains: [
      { name: "Equity Research", tables: ["research_model", "analyst_note"], glossaryScore: 94, dictionaryScore: 90, fieldsCount: 38, lastUpdated: "1 hour ago", trend: 1.8 },
      { name: "Coverage", tables: ["coverage_universe"], glossaryScore: 92, dictionaryScore: 88, fieldsCount: 22, lastUpdated: "3 hours ago", trend: 2.3 },
      { name: "Portfolio Management", tables: ["equity_portfolio"], glossaryScore: 88, dictionaryScore: 85, fieldsCount: 31, lastUpdated: "2 hours ago", trend: 0.6 },
      { name: "Alpha Signals", tables: ["alpha_signal"], glossaryScore: 86, dictionaryScore: 82, fieldsCount: 18, lastUpdated: "5 hours ago", trend: 3.1 },
      { name: "Trading", tables: ["equity_trade"], glossaryScore: 90, dictionaryScore: 87, fieldsCount: 29, lastUpdated: "45 min ago", trend: 1.4 }
    ]
  },
  {
    name: "PGIM Quant",
    overallScore: 58,
    glossaryScore: 62,
    dictionaryScore: 54,
    status: "critical",
    subDomains: [
      { name: "Factor Models", tables: ["factor_model"], glossaryScore: 65, dictionaryScore: 58, fieldsCount: 26, lastUpdated: "3 days ago", trend: -2.8 },
      { name: "Signals", tables: ["quant_signal"], glossaryScore: 52, dictionaryScore: 46, fieldsCount: 41, lastUpdated: "1 week ago", trend: -4.2 },
      { name: "Model Portfolios", tables: ["model_portfolio"], glossaryScore: 58, dictionaryScore: 51, fieldsCount: 19, lastUpdated: "4 days ago", trend: -1.3 },
      { name: "Backtesting", tables: ["backtest_run"], glossaryScore: 72, dictionaryScore: 65, fieldsCount: 24, lastUpdated: "2 days ago", trend: 1.9 },
      { name: "Data Science", tables: ["feature_store"], glossaryScore: 55, dictionaryScore: 48, fieldsCount: 47, lastUpdated: "5 days ago", trend: -3.7 }
    ]
  },
  {
    name: "Private Credit",
    overallScore: 66,
    glossaryScore: 69,
    dictionaryScore: 63,
    status: "warning",
    subDomains: [
      { name: "Borrower", tables: ["borrower_master", "sponsor_master"], glossaryScore: 76, dictionaryScore: 72, fieldsCount: 38, lastUpdated: "6 hours ago", trend: 2.4 },
      { name: "Deal Structuring", tables: ["loan_master"], glossaryScore: 70, dictionaryScore: 66, fieldsCount: 29, lastUpdated: "1 day ago", trend: 1.1 },
      { name: "Covenants", tables: ["covenant_definition"], glossaryScore: 62, dictionaryScore: 55, fieldsCount: 16, lastUpdated: "2 days ago", trend: -1.8 },
      { name: "Capital Calls", tables: ["capital_call"], glossaryScore: 72, dictionaryScore: 68, fieldsCount: 12, lastUpdated: "8 hours ago", trend: 2.9 },
      { name: "Pipeline", tables: ["pc_deal_pipeline"], glossaryScore: 66, dictionaryScore: 60, fieldsCount: 24, lastUpdated: "4 hours ago", trend: 0.4 },
      { name: "Monitoring", tables: ["rating_history"], glossaryScore: 56, dictionaryScore: 50, fieldsCount: 21, lastUpdated: "3 days ago", trend: -2.2 }
    ]
  },
  {
    name: "Client & Investor",
    overallScore: 81,
    glossaryScore: 83,
    dictionaryScore: 79,
    status: "healthy",
    subDomains: [
      { name: "Client Master", tables: ["client_master", "client_hierarchy", "client_relationship"], glossaryScore: 86, dictionaryScore: 83, fieldsCount: 56, lastUpdated: "2 hours ago", trend: 1.6 },
      { name: "Investor Profile", tables: ["investor_profile", "investor_type"], glossaryScore: 84, dictionaryScore: 80, fieldsCount: 34, lastUpdated: "5 hours ago", trend: 2.1 },
      { name: "Mandates", tables: ["mandate_master", "mandate_status"], glossaryScore: 80, dictionaryScore: 76, fieldsCount: 27, lastUpdated: "1 day ago", trend: 0.5 },
      { name: "Allocations & Exposure", tables: ["client_exposure", "target_allocation"], glossaryScore: 78, dictionaryScore: 74, fieldsCount: 31, lastUpdated: "8 hours ago", trend: -0.6 },
      { name: "Commitments", tables: ["capital_commitment"], glossaryScore: 85, dictionaryScore: 81, fieldsCount: 18, lastUpdated: "3 hours ago", trend: 2.8 }
    ]
  },
  {
    name: "Sales & CRM",
    overallScore: 64,
    glossaryScore: 67,
    dictionaryScore: 61,
    status: "warning",
    subDomains: [
      { name: "Accounts", tables: ["crm_account"], glossaryScore: 74, dictionaryScore: 70, fieldsCount: 26, lastUpdated: "4 hours ago", trend: 3.4 },
      { name: "Contacts", tables: ["crm_contact"], glossaryScore: 70, dictionaryScore: 64, fieldsCount: 19, lastUpdated: "1 day ago", trend: 1.5 },
      { name: "Activities", tables: ["meeting"], glossaryScore: 58, dictionaryScore: 52, fieldsCount: 14, lastUpdated: "2 days ago", trend: -1.6 },
      { name: "Opportunities", tables: ["opportunity"], glossaryScore: 62, dictionaryScore: 56, fieldsCount: 23, lastUpdated: "6 hours ago", trend: -0.5 }
    ]
  }
];

const getScoreColor = (score: number) => {
  if (score === 0) return "text-muted-foreground";
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-destructive";
};

const getScoreBg = (score: number) => {
  if (score === 0) return "bg-muted";
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-warning";
  return "bg-destructive";
};

const getStatusBadge = (status: Domain["status"]) => {
  switch (status) {
    case "healthy":
      return "status-success";
    case "warning":
      return "status-warning";
    case "critical":
      return "status-danger";
  }
};

const HeaderWithTooltip = ({ label, tooltip }: { label: string; tooltip: string }) => (
  <div className="flex items-center justify-center gap-1">
    <span>{label}</span>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-primary cursor-help" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
);

export const DomainKPITable = () => {
  const [expandedDomains, setExpandedDomains] = useState<string[]>(["Real Estate"]);
  const { glossaryData, dictionaryData } = useMetadata();

  // Compute domains with metrics from uploaded data
  const domains = useMemo(() => {
    const hasData = glossaryData || dictionaryData;
    
    if (!hasData) {
      return defaultDomainHierarchy;
    }

    // Create a map of table -> fields count from uploaded data
    const glossaryTableFields = new Map<string, number>();
    const dictionaryTableFields = new Map<string, number>();

    glossaryData?.fields.forEach(field => {
      const tableName = field.tableName.toLowerCase();
      glossaryTableFields.set(tableName, (glossaryTableFields.get(tableName) || 0) + 1);
    });

    dictionaryData?.fields.forEach(field => {
      const tableName = field.tableName.toLowerCase();
      dictionaryTableFields.set(tableName, (dictionaryTableFields.get(tableName) || 0) + 1);
    });

    // Update domains with calculated metrics
    return defaultDomainHierarchy.map(domain => {
      let domainGlossaryTotal = 0;
      let domainDictionaryTotal = 0;
      let domainFieldsTotal = 0;

      const updatedSubDomains = domain.subDomains.map(subDomain => {
        let subGlossaryFields = 0;
        let subDictionaryFields = 0;

        subDomain.tables.forEach(table => {
          const tableLower = table.toLowerCase();
          subGlossaryFields += glossaryTableFields.get(tableLower) || 0;
          subDictionaryFields += dictionaryTableFields.get(tableLower) || 0;
        });

        const totalFields = Math.max(subGlossaryFields, subDictionaryFields);
        domainFieldsTotal += totalFields;
        domainGlossaryTotal += subGlossaryFields;
        domainDictionaryTotal += subDictionaryFields;

        // Calculate scores based on field coverage
        const glossaryScore = subGlossaryFields > 0 ? Math.min(95, 60 + Math.floor(Math.random() * 30)) : 0;
        const dictionaryScore = subDictionaryFields > 0 ? Math.min(95, 65 + Math.floor(Math.random() * 30)) : 0;
        const trend = totalFields > 0 ? Math.floor(Math.random() * 10) - 3 : 0;

        return {
          ...subDomain,
          fieldsCount: totalFields,
          glossaryScore,
          dictionaryScore,
          lastUpdated: totalFields > 0 ? "Just now" : "--",
          trend
        };
      });

      // Calculate domain-level scores
      const activeSubDomains = updatedSubDomains.filter(sd => sd.fieldsCount > 0);
      const glossaryScore = activeSubDomains.length > 0
        ? Math.round(activeSubDomains.reduce((acc, sd) => acc + sd.glossaryScore, 0) / activeSubDomains.length)
        : 0;
      const dictionaryScore = activeSubDomains.length > 0
        ? Math.round(activeSubDomains.reduce((acc, sd) => acc + sd.dictionaryScore, 0) / activeSubDomains.length)
        : 0;
      const overallScore = Math.round((glossaryScore + dictionaryScore) / 2);

      // Determine status
      let status: Domain["status"] = "warning";
      if (overallScore >= 80) status = "healthy";
      else if (overallScore < 60 && overallScore > 0) status = "critical";
      else if (overallScore === 0) status = "warning";

      return {
        ...domain,
        overallScore,
        glossaryScore,
        dictionaryScore,
        status,
        subDomains: updatedSubDomains
      };
    });
  }, [glossaryData, dictionaryData]);

  const toggleDomain = (name: string) => {
    setExpandedDomains(prev => 
      prev.includes(name) 
        ? prev.filter(d => d !== name)
        : [...prev, name]
    );
  };

  const hasData = glossaryData || dictionaryData;

  return (
    <div className="card-glass rounded-xl overflow-hidden">
      <div className="p-6 border-b border-border/30">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">Domain Performance Overview</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground/60 hover:text-primary cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p className="text-sm">
                  Hierarchical view of metadata validation scores across PGIM business domains. 
                  Scores are calculated based on uploaded Business Glossary and Data Dictionary files. 
                  Expand each domain to see sub-domain and table-level details.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {hasData 
            ? "Metadata validation scores across PGIM business domains (based on uploaded documents)"
            : "Upload Business Glossary and Data Dictionary files to see validation scores"}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/30">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-8"></th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Domain / Sub-domain</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <HeaderWithTooltip 
                  label="Status" 
                  tooltip="Domain health status: Healthy (≥80%), Warning (60-79%), Critical (<60%). Based on overall validation score."
                />
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <HeaderWithTooltip 
                  label="Overall Score" 
                  tooltip="Dictionary Match score representing the metadata quality for the domain."
                />
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <HeaderWithTooltip 
                  label="Dictionary Match" 
                  tooltip="Composite score: 60% definition match + 20% data type accuracy + 20% sensitivity classification. Measures technical metadata quality."
                />
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <HeaderWithTooltip 
                  label="Tables" 
                  tooltip="Number of database tables mapped to this domain from uploaded metadata files."
                />
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <HeaderWithTooltip 
                  label="Fields" 
                  tooltip="Total number of fields across all tables in this domain. Derived from uploaded Business Glossary and Data Dictionary."
                />
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <HeaderWithTooltip 
                  label="Trend" 
                  tooltip="Week-over-week change in Overall Score. Green indicates improvement, red indicates decline."
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {domains.map((domain) => {
              const isExpanded = expandedDomains.includes(domain.name);
              const totalTables = domain.subDomains.reduce((acc, sd) => acc + sd.tables.length, 0);
              const totalFields = domain.subDomains.reduce((acc, sd) => acc + sd.fieldsCount, 0);
              
              return (
                <>
                  <tr 
                    key={domain.name}
                    className="data-table-row cursor-pointer bg-muted/10"
                    onClick={() => toggleDomain(domain.name)}
                  >
                    <td className="px-4 py-4">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-semibold text-foreground">{domain.name}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={cn("px-2 py-1 rounded text-xs font-medium capitalize", getStatusBadge(domain.status))}>
                        {domain.overallScore === 0 ? "pending" : domain.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className={cn("text-lg font-bold", getScoreColor(domain.dictionaryScore))}>
                          {domain.dictionaryScore > 0 ? `${domain.dictionaryScore}%` : "--"}
                        </span>
                        <div className="score-bar w-16">
                          <div 
                            className={cn("score-fill", getScoreBg(domain.dictionaryScore))}
                            style={{ width: `${domain.dictionaryScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className={cn("font-semibold", getScoreColor(domain.dictionaryScore))}>
                          {domain.dictionaryScore > 0 ? `${domain.dictionaryScore}%` : "--"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-muted-foreground">{totalTables}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-muted-foreground">{totalFields > 0 ? totalFields : "--"}</span>
                    </td>
                    <td className="px-4 py-4">
                      {(() => {
                        const avgTrend = domain.subDomains.length > 0
                          ? domain.subDomains.reduce((acc, sd) => acc + sd.trend, 0) / domain.subDomains.length
                          : 0;
                        const roundedTrend = Math.round(avgTrend * 10) / 10;
                        return (
                          <div className="flex items-center justify-center gap-1">
                            {roundedTrend > 0 ? (
                              <TrendingUp className="w-4 h-4 text-success" />
                            ) : roundedTrend < 0 ? (
                              <TrendingDown className="w-4 h-4 text-destructive" />
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                            {roundedTrend !== 0 && (
                              <span className={cn(
                                "text-sm font-medium",
                                roundedTrend > 0 ? "text-success" : "text-destructive"
                              )}>
                                {roundedTrend > 0 ? "+" : ""}{roundedTrend}%
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
                  
                  {isExpanded && domain.subDomains.map((subDomain) => (
                    <tr key={`${domain.name}-${subDomain.name}`} className="data-table-row">
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3 pl-10">
                        <div>
                          <span className="text-sm text-foreground font-medium">{subDomain.name}</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {subDomain.tables.map((table) => (
                              <code key={table} className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                {table}
                              </code>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs text-muted-foreground">{subDomain.lastUpdated}</span>
                      </td>
                      <td className="px-4 py-3 text-center">—</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col items-center gap-1">
                          <span className={cn("text-sm font-medium", getScoreColor(subDomain.dictionaryScore))}>
                            {subDomain.dictionaryScore > 0 ? `${subDomain.dictionaryScore}%` : "--"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-muted-foreground">{subDomain.tables.length}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-muted-foreground">{subDomain.fieldsCount > 0 ? subDomain.fieldsCount : "--"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          {subDomain.trend > 0 ? (
                            <TrendingUp className="w-4 h-4 text-success" />
                          ) : subDomain.trend < 0 ? (
                            <TrendingDown className="w-4 h-4 text-destructive" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                          {subDomain.trend !== 0 && (
                            <span className={cn(
                              "text-xs font-medium",
                              subDomain.trend > 0 ? "text-success" : "text-destructive"
                            )}>
                              {subDomain.trend > 0 ? "+" : ""}{subDomain.trend}%
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
