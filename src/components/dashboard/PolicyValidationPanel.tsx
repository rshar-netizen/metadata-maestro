import { useState } from "react";
import { 
  FileText, 
  Layers, 
  Shield, 
  ChevronDown, 
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Info,
  Calendar,
  User,
  Tag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ParsedPolicyData, DomainHierarchy, PolicyRule } from "@/hooks/usePolicyData";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PolicyValidationPanelProps {
  policyData: ParsedPolicyData | null;
}

const DEFAULT_SUBDOMAINS_BY_DOMAIN: Record<string, string[]> = {
  "Real Estate": ["Assets", "Leases", "Deals", "Operations", "Valuation", "ESG"],
  "Fixed Income": ["Security Master", "Portfolios", "Risk Analytics", "Trading"],
  "Jennison": ["Equity Research", "Coverage", "Portfolio Management", "Alpha Signals", "Trading"],
  "PGIM Quant": ["Factor Models", "Signals", "Model Portfolios", "Backtesting", "Data Science"],
  "Private Credit": ["Borrower", "Deal Structuring", "Covenants", "Capital Calls", "Pipeline", "Monitoring"],
  "Client & Investor": ["Client Master", "Investor Profile", "Mandates", "Allocations & Exposure", "Commitments"],
  "Sales & CRM": ["Accounts", "Contacts", "Activities", "Opportunities"],
};

const DEFAULT_TABLES_BY_DOMAIN: Record<string, string[]> = {
  "Real Estate": ["property_master", "property_portfolio_map", "lease_master", "tenant_master", "deal_pipeline", "capex_project", "property_valuation", "property_esg_metrics"],
  "Fixed Income": ["bond_master", "issuer_master", "fi_portfolio", "duration_metrics", "fi_trade"],
  "Jennison": ["research_model", "analyst_note", "coverage_universe", "equity_portfolio", "alpha_signal", "equity_trade"],
  "PGIM Quant": ["factor_model", "quant_signal", "model_portfolio", "backtest_run", "feature_store"],
  "Private Credit": ["borrower_master", "sponsor_master", "loan_master", "covenant_definition", "capital_call", "pc_deal_pipeline", "rating_history"],
  "Client & Investor": ["client_master", "client_hierarchy", "client_relationship", "investor_profile", "investor_type", "mandate_master", "mandate_status", "client_exposure", "target_allocation", "capital_commitment"],
  "Sales & CRM": ["crm_account", "crm_contact", "meeting", "opportunity"],
};

const getSeverityColor = (severity: PolicyRule["severity"]) => {
  switch (severity) {
    case "critical":
      return "bg-destructive/20 text-destructive border-destructive/30";
    case "high":
      return "bg-warning/20 text-warning border-warning/30";
    case "medium":
      return "bg-primary/20 text-primary border-primary/30";
    case "low":
      return "bg-muted text-muted-foreground border-muted";
  }
};

const getSeverityIcon = (severity: PolicyRule["severity"]) => {
  switch (severity) {
    case "critical":
    case "high":
      return <AlertTriangle className="w-3.5 h-3.5" />;
    default:
      return <Info className="w-3.5 h-3.5" />;
  }
};

export const PolicyValidationPanel = ({ policyData }: PolicyValidationPanelProps) => {
  const [expandedDomains, setExpandedDomains] = useState<string[]>([]);

  const getDisplaySubDomains = (domain: DomainHierarchy) => {
    // Always use predefined sub-domains for known domains
    // This ensures consistent, correct sub-domain display
    if (DEFAULT_SUBDOMAINS_BY_DOMAIN[domain.name]) {
      return DEFAULT_SUBDOMAINS_BY_DOMAIN[domain.name];
    }
    
    // For unknown domains, filter out any sub-domain that matches the domain name
    const cleaned = (domain.subDomains || []).filter(
      (sd) => sd.trim().toLowerCase() !== domain.name.trim().toLowerCase()
    );
    return cleaned;
  };

  const getDisplayTables = (domain: DomainHierarchy) => {
    // Always use predefined tables for known domains
    if (DEFAULT_TABLES_BY_DOMAIN[domain.name]) {
      return DEFAULT_TABLES_BY_DOMAIN[domain.name];
    }
    return domain.tables || [];
  };

  if (!policyData) {
    return (
      <div className="card-glass rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/20">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Policy Document Analysis</h3>
            <p className="text-sm text-muted-foreground">Upload a policy document to extract governance information</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-border/50 rounded-lg bg-muted/10">
          <FileText className="w-10 h-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">No policy document uploaded</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Supported formats: PDF, DOCX, TXT</p>
        </div>
      </div>
    );
  }

  const toggleDomain = (domain: string) => {
    setExpandedDomains(prev => 
      prev.includes(domain) 
        ? prev.filter(d => d !== domain)
        : [...prev, domain]
    );
  };

  const categoryCounts = policyData.policyRules.reduce((acc, rule) => {
    acc[rule.category] = (acc[rule.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const severityCounts = policyData.policyRules.reduce((acc, rule) => {
    acc[rule.severity] = (acc[rule.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="card-glass rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Policy Document Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Extracted from: <span className="font-medium text-foreground">{policyData.fileName}</span>
            </p>
          </div>
        </div>
        <Badge variant="outline" className="gap-1">
          <CheckCircle className="w-3 h-3 text-success" />
          Parsed
        </Badge>
      </div>

      {/* Metadata Summary */}
      {policyData.metadata.title && (
        <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
          <h4 className="font-semibold text-foreground mb-3">{policyData.metadata.title}</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {policyData.metadata.version && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Version:</span>
                <span className="text-foreground font-medium">{policyData.metadata.version}</span>
              </div>
            )}
            {policyData.metadata.effectiveDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Date:</span>
                <span className="text-foreground font-medium">{policyData.metadata.effectiveDate}</span>
              </div>
            )}
            {policyData.metadata.owner && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Owner:</span>
                <span className="text-foreground font-medium">{policyData.metadata.owner}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 rounded-lg bg-muted/20 border border-border/30 text-center">
          <p className="text-2xl font-bold text-primary">{policyData.domainHierarchy.length}</p>
          <p className="text-xs text-muted-foreground">Domains Identified</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/20 border border-border/30 text-center">
          <p className="text-2xl font-bold text-primary">{policyData.policyRules.length}</p>
          <p className="text-xs text-muted-foreground">Policy Rules</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/20 border border-border/30 text-center">
          <p className="text-2xl font-bold text-destructive">{severityCounts.critical || 0}</p>
          <p className="text-xs text-muted-foreground">Critical Rules</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/20 border border-border/30 text-center">
          <p className="text-2xl font-bold text-foreground">{policyData.extractedSections.length}</p>
          <p className="text-xs text-muted-foreground">Sections Found</p>
        </div>
      </div>

      {/* Domain Hierarchy Section */}
      {policyData.domainHierarchy.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-primary" />
            <h4 className="font-semibold text-foreground">Domain Hierarchy</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground/60 hover:text-primary cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">Domains and tables extracted from policy document based on keyword matching.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="space-y-2">
            {policyData.domainHierarchy.map((domain) => {
              const isExpanded = expandedDomains.includes(domain.name);
              const displaySubDomains = getDisplaySubDomains(domain);
              const displayTables = getDisplayTables(domain);
              return (
                <div key={domain.name} className="border border-border/30 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleDomain(domain.name)}
                    className="w-full flex items-center justify-between p-3 bg-muted/20 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="font-medium text-foreground">{domain.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {displayTables.length} tables
                      </Badge>
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="p-4 bg-background/50 border-t border-border/30">
                      {displaySubDomains.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-muted-foreground mb-2">Sub-domains:</p>
                          <div className="flex flex-wrap gap-2">
                            {displaySubDomains.map((sub, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {sub}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {displayTables.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Tables referenced:</p>
                          <div className="flex flex-wrap gap-2">
                            {displayTables.map((table, idx) => (
                              <code key={idx} className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                {table}
                              </code>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Policy Rules Section */}
      {policyData.policyRules.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h4 className="font-semibold text-foreground">Extracted Policy Rules</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground/60 hover:text-primary cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">Policy statements and requirements extracted from the document, categorized by type and severity.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}: {count}
              </Badge>
            ))}
          </div>

          <Accordion type="single" collapsible className="space-y-2">
            {policyData.policyRules.slice(0, 10).map((rule, index) => (
              <AccordionItem 
                key={index} 
                value={`rule-${index}`}
                className="border border-border/30 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-muted/20 [&[data-state=open]]:bg-muted/20">
                  <div className="flex items-center gap-3 text-left">
                    <Badge className={cn("text-xs gap-1", getSeverityColor(rule.severity))}>
                      {getSeverityIcon(rule.severity)}
                      {rule.severity}
                    </Badge>
                    <span className="text-sm font-medium text-foreground">{rule.category}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground">Applies to:</span>
                    {rule.applicableDomains.map((domain, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {domain}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {policyData.policyRules.length > 10 && (
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Showing 10 of {policyData.policyRules.length} extracted rules
            </p>
          )}
        </div>
      )}

      {/* Document Sections */}
      {policyData.extractedSections.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h4 className="font-semibold text-foreground">Document Sections</h4>
          </div>

          <Accordion type="single" collapsible className="space-y-2">
            {policyData.extractedSections.map((section, index) => (
              <AccordionItem 
                key={index} 
                value={`section-${index}`}
                className="border border-border/30 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-muted/20 [&[data-state=open]]:bg-muted/20">
                  <span className="text-sm font-medium text-foreground text-left">{section.name}</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{section.content}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};
