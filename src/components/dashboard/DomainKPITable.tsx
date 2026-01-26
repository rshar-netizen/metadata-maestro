import { ChevronDown, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

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

const domains: Domain[] = [
  {
    name: "Real Estate",
    overallScore: 85,
    glossaryScore: 82,
    dictionaryScore: 88,
    status: "healthy",
    subDomains: [
      { name: "Assets", tables: ["property_master", "property_portfolio_map"], glossaryScore: 88, dictionaryScore: 92, fieldsCount: 24, lastUpdated: "2 hours ago", trend: 3 },
      { name: "Leases", tables: ["lease_master", "tenant_master"], glossaryScore: 82, dictionaryScore: 86, fieldsCount: 22, lastUpdated: "4 hours ago", trend: 2 },
      { name: "Deals", tables: ["deal_pipeline"], glossaryScore: 75, dictionaryScore: 84, fieldsCount: 11, lastUpdated: "1 day ago", trend: -1 },
      { name: "Operations", tables: ["capex_project"], glossaryScore: 80, dictionaryScore: 88, fieldsCount: 12, lastUpdated: "6 hours ago", trend: 4 },
      { name: "Valuation", tables: ["property_valuation"], glossaryScore: 86, dictionaryScore: 90, fieldsCount: 10, lastUpdated: "3 hours ago", trend: 2 },
      { name: "ESG", tables: ["property_esg_metrics"], glossaryScore: 84, dictionaryScore: 89, fieldsCount: 11, lastUpdated: "1 hour ago", trend: 5 }
    ]
  },
  {
    name: "Fixed Income",
    overallScore: 78,
    glossaryScore: 76,
    dictionaryScore: 80,
    status: "warning",
    subDomains: [
      { name: "Security Master", tables: ["bond_master", "issuer_master"], glossaryScore: 78, dictionaryScore: 82, fieldsCount: 28, lastUpdated: "5 hours ago", trend: 2 },
      { name: "Portfolios", tables: ["fi_portfolio"], glossaryScore: 74, dictionaryScore: 78, fieldsCount: 15, lastUpdated: "8 hours ago", trend: 1 },
      { name: "Risk Analytics", tables: ["duration_metrics"], glossaryScore: 72, dictionaryScore: 76, fieldsCount: 18, lastUpdated: "12 hours ago", trend: -2 },
      { name: "Trading", tables: ["fi_trade"], glossaryScore: 80, dictionaryScore: 84, fieldsCount: 20, lastUpdated: "2 hours ago", trend: 3 }
    ]
  },
  {
    name: "Jennison",
    overallScore: 72,
    glossaryScore: 70,
    dictionaryScore: 74,
    status: "warning",
    subDomains: [
      { name: "Equity Research", tables: ["research_model", "analyst_note"], glossaryScore: 68, dictionaryScore: 72, fieldsCount: 22, lastUpdated: "1 day ago", trend: -3 },
      { name: "Coverage", tables: ["coverage_universe"], glossaryScore: 72, dictionaryScore: 76, fieldsCount: 14, lastUpdated: "6 hours ago", trend: 1 },
      { name: "Portfolio Management", tables: ["equity_portfolio"], glossaryScore: 70, dictionaryScore: 74, fieldsCount: 16, lastUpdated: "4 hours ago", trend: 2 },
      { name: "Alpha Signals", tables: ["alpha_signal"], glossaryScore: 65, dictionaryScore: 70, fieldsCount: 12, lastUpdated: "2 days ago", trend: -2 },
      { name: "Trading", tables: ["equity_trade"], glossaryScore: 75, dictionaryScore: 78, fieldsCount: 18, lastUpdated: "3 hours ago", trend: 4 }
    ]
  },
  {
    name: "PGIM Quant",
    overallScore: 68,
    glossaryScore: 65,
    dictionaryScore: 71,
    status: "warning",
    subDomains: [
      { name: "Factor Models", tables: ["factor_model"], glossaryScore: 62, dictionaryScore: 68, fieldsCount: 20, lastUpdated: "2 days ago", trend: -1 },
      { name: "Signals", tables: ["quant_signal"], glossaryScore: 64, dictionaryScore: 70, fieldsCount: 15, lastUpdated: "1 day ago", trend: 2 },
      { name: "Model Portfolios", tables: ["model_portfolio"], glossaryScore: 68, dictionaryScore: 74, fieldsCount: 12, lastUpdated: "8 hours ago", trend: 3 },
      { name: "Backtesting", tables: ["backtest_run"], glossaryScore: 66, dictionaryScore: 72, fieldsCount: 18, lastUpdated: "12 hours ago", trend: 1 },
      { name: "Data Science", tables: ["feature_store"], glossaryScore: 65, dictionaryScore: 71, fieldsCount: 25, lastUpdated: "6 hours ago", trend: 4 }
    ]
  },
  {
    name: "Private Credit",
    overallScore: 58,
    glossaryScore: 55,
    dictionaryScore: 61,
    status: "critical",
    subDomains: [
      { name: "Borrower", tables: ["borrower_master", "sponsor_master"], glossaryScore: 52, dictionaryScore: 58, fieldsCount: 24, lastUpdated: "3 days ago", trend: -4 },
      { name: "Deal Structuring", tables: ["loan_master"], glossaryScore: 56, dictionaryScore: 62, fieldsCount: 22, lastUpdated: "2 days ago", trend: -2 },
      { name: "Covenants", tables: ["covenant_definition"], glossaryScore: 48, dictionaryScore: 55, fieldsCount: 18, lastUpdated: "1 week ago", trend: -5 },
      { name: "Capital Calls", tables: ["capital_call"], glossaryScore: 60, dictionaryScore: 65, fieldsCount: 12, lastUpdated: "1 day ago", trend: 1 },
      { name: "Pipeline", tables: ["pc_deal_pipeline"], glossaryScore: 58, dictionaryScore: 64, fieldsCount: 15, lastUpdated: "4 hours ago", trend: 2 },
      { name: "Monitoring", tables: ["rating_history"], glossaryScore: 56, dictionaryScore: 62, fieldsCount: 10, lastUpdated: "2 days ago", trend: 0 }
    ]
  },
  {
    name: "Client & Investor",
    overallScore: 91,
    glossaryScore: 93,
    dictionaryScore: 89,
    status: "healthy",
    subDomains: [
      { name: "Client Master", tables: ["client_master", "client_hierarchy", "client_relationship"], glossaryScore: 95, dictionaryScore: 92, fieldsCount: 35, lastUpdated: "30 min ago", trend: 2 },
      { name: "Investor Profile", tables: ["investor_profile", "investor_type"], glossaryScore: 92, dictionaryScore: 88, fieldsCount: 22, lastUpdated: "2 hours ago", trend: 1 },
      { name: "Mandates", tables: ["mandate_master", "mandate_status"], glossaryScore: 94, dictionaryScore: 90, fieldsCount: 18, lastUpdated: "1 hour ago", trend: 3 },
      { name: "Allocations & Exposure", tables: ["client_exposure", "target_allocation"], glossaryScore: 90, dictionaryScore: 86, fieldsCount: 20, lastUpdated: "4 hours ago", trend: 2 },
      { name: "Commitments", tables: ["capital_commitment"], glossaryScore: 92, dictionaryScore: 88, fieldsCount: 12, lastUpdated: "3 hours ago", trend: 4 }
    ]
  },
  {
    name: "Sales & CRM",
    overallScore: 82,
    glossaryScore: 84,
    dictionaryScore: 80,
    status: "healthy",
    subDomains: [
      { name: "Accounts", tables: ["crm_account"], glossaryScore: 86, dictionaryScore: 82, fieldsCount: 18, lastUpdated: "2 hours ago", trend: 2 },
      { name: "Contacts", tables: ["crm_contact"], glossaryScore: 84, dictionaryScore: 80, fieldsCount: 15, lastUpdated: "3 hours ago", trend: 1 },
      { name: "Activities", tables: ["meeting"], glossaryScore: 82, dictionaryScore: 78, fieldsCount: 12, lastUpdated: "1 hour ago", trend: 3 },
      { name: "Opportunities", tables: ["opportunity"], glossaryScore: 84, dictionaryScore: 80, fieldsCount: 16, lastUpdated: "4 hours ago", trend: 2 }
    ]
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

export const DomainKPITable = () => {
  const [expandedDomains, setExpandedDomains] = useState<string[]>(["Real Estate"]);

  const toggleDomain = (name: string) => {
    setExpandedDomains(prev => 
      prev.includes(name) 
        ? prev.filter(d => d !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="card-glass rounded-xl overflow-hidden">
      <div className="p-6 border-b border-border/30">
        <h3 className="text-lg font-semibold text-foreground">Domain Performance Overview</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Metadata validation scores across PGIM business domains
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/30">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-8"></th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Domain / Sub-domain</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Overall Score</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Glossary Match</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Dictionary Match</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Tables</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Fields</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Trend</th>
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
                        {domain.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className={cn("text-lg font-bold", getScoreColor(domain.overallScore))}>
                          {domain.overallScore}%
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
                          {domain.glossaryScore}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className={cn("font-semibold", getScoreColor(domain.dictionaryScore))}>
                          {domain.dictionaryScore}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-muted-foreground">{totalTables}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-muted-foreground">{totalFields}</span>
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
                            {subDomain.glossaryScore}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col items-center gap-1">
                          <span className={cn("text-sm font-medium", getScoreColor(subDomain.dictionaryScore))}>
                            {subDomain.dictionaryScore}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-muted-foreground">{subDomain.tables.length}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-muted-foreground">{subDomain.fieldsCount}</span>
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
