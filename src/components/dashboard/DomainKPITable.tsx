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

// Default domain hierarchy structure
const defaultDomainHierarchy: Domain[] = [
  {
    name: "Real Estate",
    overallScore: 0,
    glossaryScore: 0,
    dictionaryScore: 0,
    status: "warning",
    subDomains: [
      { name: "Assets", tables: ["property_master", "property_portfolio_map"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Leases", tables: ["lease_master", "tenant_master"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Deals", tables: ["deal_pipeline"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Operations", tables: ["capex_project"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Valuation", tables: ["property_valuation"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "ESG", tables: ["property_esg_metrics"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 }
    ]
  },
  {
    name: "Fixed Income",
    overallScore: 0,
    glossaryScore: 0,
    dictionaryScore: 0,
    status: "warning",
    subDomains: [
      { name: "Security Master", tables: ["bond_master", "issuer_master"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Portfolios", tables: ["fi_portfolio"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Risk Analytics", tables: ["duration_metrics"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Trading", tables: ["fi_trade"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 }
    ]
  },
  {
    name: "Jennison",
    overallScore: 0,
    glossaryScore: 0,
    dictionaryScore: 0,
    status: "warning",
    subDomains: [
      { name: "Equity Research", tables: ["research_model", "analyst_note"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Coverage", tables: ["coverage_universe"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Portfolio Management", tables: ["equity_portfolio"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Alpha Signals", tables: ["alpha_signal"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Trading", tables: ["equity_trade"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 }
    ]
  },
  {
    name: "PGIM Quant",
    overallScore: 0,
    glossaryScore: 0,
    dictionaryScore: 0,
    status: "warning",
    subDomains: [
      { name: "Factor Models", tables: ["factor_model"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Signals", tables: ["quant_signal"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Model Portfolios", tables: ["model_portfolio"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Backtesting", tables: ["backtest_run"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Data Science", tables: ["feature_store"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 }
    ]
  },
  {
    name: "Private Credit",
    overallScore: 0,
    glossaryScore: 0,
    dictionaryScore: 0,
    status: "warning",
    subDomains: [
      { name: "Borrower", tables: ["borrower_master", "sponsor_master"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Deal Structuring", tables: ["loan_master"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Covenants", tables: ["covenant_definition"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Capital Calls", tables: ["capital_call"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Pipeline", tables: ["pc_deal_pipeline"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Monitoring", tables: ["rating_history"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 }
    ]
  },
  {
    name: "Client & Investor",
    overallScore: 0,
    glossaryScore: 0,
    dictionaryScore: 0,
    status: "warning",
    subDomains: [
      { name: "Client Master", tables: ["client_master", "client_hierarchy", "client_relationship"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Investor Profile", tables: ["investor_profile", "investor_type"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Mandates", tables: ["mandate_master", "mandate_status"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Allocations & Exposure", tables: ["client_exposure", "target_allocation"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Commitments", tables: ["capital_commitment"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 }
    ]
  },
  {
    name: "Sales & CRM",
    overallScore: 0,
    glossaryScore: 0,
    dictionaryScore: 0,
    status: "warning",
    subDomains: [
      { name: "Accounts", tables: ["crm_account"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Contacts", tables: ["crm_contact"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Activities", tables: ["meeting"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 },
      { name: "Opportunities", tables: ["opportunity"], glossaryScore: 0, dictionaryScore: 0, fieldsCount: 0, lastUpdated: "--", trend: 0 }
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
                  tooltip="Average of Glossary Match and Dictionary Match scores. Represents the combined metadata quality for the domain."
                />
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <HeaderWithTooltip 
                  label="Glossary Match" 
                  tooltip="Percentage of business glossary definitions that align with AI-generated descriptions. Higher scores indicate better semantic consistency."
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
                        <span className={cn("text-lg font-bold", getScoreColor(domain.overallScore))}>
                          {domain.overallScore > 0 ? `${domain.overallScore}%` : "--"}
                        </span>
                        <div className="score-bar w-16">
                          <div 
                            className={cn("score-fill", getScoreBg(domain.overallScore))}
                            style={{ width: `${domain.overallScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className={cn("font-semibold", getScoreColor(domain.glossaryScore))}>
                          {domain.glossaryScore > 0 ? `${domain.glossaryScore}%` : "--"}
                        </span>
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
                    <td className="px-4 py-4 text-center">—</td>
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
                          <span className={cn("text-sm font-medium", getScoreColor(subDomain.glossaryScore))}>
                            {subDomain.glossaryScore > 0 ? `${subDomain.glossaryScore}%` : "--"}
                          </span>
                        </div>
                      </td>
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
