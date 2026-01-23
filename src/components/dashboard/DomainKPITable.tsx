import { ChevronDown, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SubDomain {
  name: string;
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
    name: "Customer Data",
    overallScore: 87,
    glossaryScore: 89,
    dictionaryScore: 85,
    status: "healthy",
    subDomains: [
      { name: "Personal Information", glossaryScore: 92, dictionaryScore: 88, fieldsCount: 24, lastUpdated: "2 hours ago", trend: 3 },
      { name: "Contact Details", glossaryScore: 85, dictionaryScore: 82, fieldsCount: 12, lastUpdated: "1 day ago", trend: -1 },
      { name: "Preferences", glossaryScore: 90, dictionaryScore: 85, fieldsCount: 18, lastUpdated: "3 hours ago", trend: 5 }
    ]
  },
  {
    name: "Portfolio Management",
    overallScore: 72,
    glossaryScore: 75,
    dictionaryScore: 69,
    status: "warning",
    subDomains: [
      { name: "Holdings", glossaryScore: 78, dictionaryScore: 72, fieldsCount: 32, lastUpdated: "5 hours ago", trend: 2 },
      { name: "Transactions", glossaryScore: 72, dictionaryScore: 65, fieldsCount: 28, lastUpdated: "12 hours ago", trend: -3 },
      { name: "Performance Metrics", glossaryScore: 75, dictionaryScore: 70, fieldsCount: 15, lastUpdated: "1 day ago", trend: 1 }
    ]
  },
  {
    name: "Risk Analytics",
    overallScore: 58,
    glossaryScore: 62,
    dictionaryScore: 54,
    status: "critical",
    subDomains: [
      { name: "Market Risk", glossaryScore: 65, dictionaryScore: 58, fieldsCount: 22, lastUpdated: "2 days ago", trend: -5 },
      { name: "Credit Risk", glossaryScore: 58, dictionaryScore: 50, fieldsCount: 18, lastUpdated: "3 days ago", trend: -2 },
      { name: "Operational Risk", glossaryScore: 63, dictionaryScore: 54, fieldsCount: 14, lastUpdated: "1 week ago", trend: 0 }
    ]
  },
  {
    name: "Compliance & Regulatory",
    overallScore: 91,
    glossaryScore: 93,
    dictionaryScore: 89,
    status: "healthy",
    subDomains: [
      { name: "KYC Data", glossaryScore: 95, dictionaryScore: 92, fieldsCount: 35, lastUpdated: "30 min ago", trend: 2 },
      { name: "AML Records", glossaryScore: 91, dictionaryScore: 88, fieldsCount: 28, lastUpdated: "2 hours ago", trend: 1 },
      { name: "Reporting", glossaryScore: 93, dictionaryScore: 87, fieldsCount: 20, lastUpdated: "4 hours ago", trend: 4 }
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
  const [expandedDomains, setExpandedDomains] = useState<string[]>(["Customer Data"]);

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
          Metadata validation scores across business domains
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
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Fields</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Trend</th>
            </tr>
          </thead>
          <tbody>
            {domains.map((domain) => {
              const isExpanded = expandedDomains.includes(domain.name);
              
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
                      <span className="text-muted-foreground">
                        {domain.subDomains.reduce((acc, sd) => acc + sd.fieldsCount, 0)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">—</td>
                  </tr>
                  
                  {isExpanded && domain.subDomains.map((subDomain) => (
                    <tr key={`${domain.name}-${subDomain.name}`} className="data-table-row">
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3 pl-10">
                        <span className="text-sm text-muted-foreground">{subDomain.name}</span>
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
