import { useState, useCallback } from "react";

export interface DomainHierarchy {
  name: string;
  subDomains: string[];
  tables: string[];
  description?: string;
}

export interface PolicyRule {
  name: string;
  description: string;
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  applicableDomains: string[];
}

export interface ParsedPolicyData {
  fileName: string;
  fileType: string;
  domainHierarchy: DomainHierarchy[];
  policyRules: PolicyRule[];
  metadata: {
    title?: string;
    version?: string;
    effectiveDate?: string;
    owner?: string;
    lastReviewed?: string;
  };
  rawContent: string;
  extractedSections: {
    name: string;
    content: string;
  }[];
}

// Domain keywords for extraction
const DOMAIN_KEYWORDS = [
  { domain: "Real Estate", keywords: ["real estate", "property", "lease", "tenant", "capex", "valuation", "esg", "assets"] },
  { domain: "Fixed Income", keywords: ["fixed income", "bond", "issuer", "duration", "yield", "credit", "fi_"] },
  { domain: "Jennison", keywords: ["jennison", "equity research", "coverage", "alpha", "analyst"] },
  { domain: "PGIM Quant", keywords: ["quant", "factor", "model", "backtest", "signal", "feature store"] },
  { domain: "Private Credit", keywords: ["private credit", "borrower", "sponsor", "loan", "covenant", "capital call"] },
  { domain: "Client & Investor", keywords: ["client", "investor", "mandate", "exposure", "commitment", "allocation"] },
  { domain: "Sales & CRM", keywords: ["sales", "crm", "account", "contact", "opportunity", "meeting", "pipeline"] }
];

// Policy category keywords
const POLICY_CATEGORIES = [
  { category: "Data Classification", keywords: ["classification", "sensitivity", "confidential", "pii", "restricted", "internal", "public"] },
  { category: "Data Retention", keywords: ["retention", "archive", "delete", "purge", "lifecycle", "expiration"] },
  { category: "Access Control", keywords: ["access", "permission", "role", "authorization", "rbac", "privilege"] },
  { category: "Data Quality", keywords: ["quality", "completeness", "accuracy", "consistency", "validation", "integrity"] },
  { category: "Compliance", keywords: ["compliance", "regulatory", "gdpr", "ccpa", "sox", "audit", "governance"] },
  { category: "Data Lineage", keywords: ["lineage", "provenance", "source", "transformation", "origin", "traceability"] }
];

export const usePolicyData = () => {
  const [policyData, setPolicyData] = useState<ParsedPolicyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const extractDomainHierarchy = (content: string): DomainHierarchy[] => {
    const domains: DomainHierarchy[] = [];
    const contentLower = content.toLowerCase();

    DOMAIN_KEYWORDS.forEach(({ domain, keywords }) => {
      const foundKeywords = keywords.filter(kw => contentLower.includes(kw));
      if (foundKeywords.length > 0) {
        // Extract potential sub-domains and tables
        const subDomains: string[] = [];
        const tables: string[] = [];
        
        // Look for table-like patterns (word_word format)
        const tablePattern = /\b([a-z]+_[a-z_]+)\b/gi;
        const tableMatches = content.match(tablePattern) || [];
        tableMatches.forEach(match => {
          if (foundKeywords.some(kw => match.toLowerCase().includes(kw.split(' ')[0]))) {
            if (!tables.includes(match.toLowerCase())) {
              tables.push(match.toLowerCase());
            }
          }
        });

        // Look for capitalized sub-domain names near domain keywords
        const subDomainPattern = new RegExp(`(${keywords.join('|')})\\s*[-:]?\\s*([A-Z][a-zA-Z\\s]+)`, 'gi');
        const subMatches = content.matchAll(subDomainPattern);
        for (const match of subMatches) {
          const subDomain = match[2]?.trim();
          if (subDomain && subDomain.length < 50 && !subDomains.includes(subDomain)) {
            subDomains.push(subDomain);
          }
        }

        domains.push({
          name: domain,
          subDomains: subDomains.slice(0, 6),
          tables: tables.slice(0, 10),
          description: `Domain identified from ${foundKeywords.length} keyword matches`
        });
      }
    });

    return domains;
  };

  const extractPolicyRules = (content: string): PolicyRule[] => {
    const rules: PolicyRule[] = [];
    const contentLower = content.toLowerCase();

    // Look for policy-like statements
    const policyPatterns = [
      /(?:policy|rule|requirement|standard|guideline)[:\s]+([^.]+\.)/gi,
      /(?:must|shall|should|required to)[:\s]+([^.]+\.)/gi,
      /(?:all\s+\w+\s+data)[:\s]+([^.]+\.)/gi
    ];

    policyPatterns.forEach(pattern => {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        const statement = match[1]?.trim();
        if (statement && statement.length > 20 && statement.length < 300) {
          // Determine category
          let category = "General";
          POLICY_CATEGORIES.forEach(({ category: cat, keywords }) => {
            if (keywords.some(kw => statement.toLowerCase().includes(kw))) {
              category = cat;
            }
          });

          // Determine severity
          let severity: PolicyRule["severity"] = "medium";
          if (/critical|mandatory|must|immediately/i.test(statement)) {
            severity = "critical";
          } else if (/high|priority|important|required/i.test(statement)) {
            severity = "high";
          } else if (/low|optional|may|consider/i.test(statement)) {
            severity = "low";
          }

          // Find applicable domains
          const applicableDomains: string[] = [];
          DOMAIN_KEYWORDS.forEach(({ domain, keywords }) => {
            if (keywords.some(kw => statement.toLowerCase().includes(kw))) {
              applicableDomains.push(domain);
            }
          });

          if (!rules.some(r => r.description === statement)) {
            rules.push({
              name: `Policy Rule ${rules.length + 1}`,
              description: statement,
              category,
              severity,
              applicableDomains: applicableDomains.length > 0 ? applicableDomains : ["All Domains"]
            });
          }
        }
      }
    });

    return rules.slice(0, 20); // Limit to 20 rules
  };

  const extractMetadata = (content: string) => {
    const metadata: ParsedPolicyData["metadata"] = {};

    // Extract title (usually first meaningful line)
    const titleMatch = content.match(/^#?\s*([A-Z][^\n]{10,100})/m);
    if (titleMatch) {
      metadata.title = titleMatch[1].trim();
    }

    // Extract version
    const versionMatch = content.match(/version[:\s]+([0-9.]+)/i);
    if (versionMatch) {
      metadata.version = versionMatch[1];
    }

    // Extract date
    const dateMatch = content.match(/(?:effective|date|updated|reviewed)[:\s]+(\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\w+\s+\d{1,2},?\s+\d{4})/i);
    if (dateMatch) {
      metadata.effectiveDate = dateMatch[1];
    }

    // Extract owner
    const ownerMatch = content.match(/(?:owner|author|maintained by|contact)[:\s]+([A-Za-z\s]+(?:Team|Department|Office)?)/i);
    if (ownerMatch) {
      metadata.owner = ownerMatch[1].trim();
    }

    return metadata;
  };

  const extractSections = (content: string): { name: string; content: string }[] => {
    const sections: { name: string; content: string }[] = [];
    
    // Look for section headers (numbered or markdown style)
    const sectionPattern = /(?:^|\n)(?:#{1,3}\s*|\d+\.?\s+)?([A-Z][A-Za-z\s&]+)(?:\n|:)/gm;
    const matches = Array.from(content.matchAll(sectionPattern));
    
    matches.forEach((match, index) => {
      const sectionName = match[1].trim();
      if (sectionName.length > 3 && sectionName.length < 60) {
        const startIndex = match.index! + match[0].length;
        const endIndex = matches[index + 1]?.index || content.length;
        const sectionContent = content.slice(startIndex, endIndex).trim();
        
        if (sectionContent.length > 20) {
          sections.push({
            name: sectionName,
            content: sectionContent.slice(0, 500) + (sectionContent.length > 500 ? "..." : "")
          });
        }
      }
    });

    return sections.slice(0, 10);
  };

  const parsePolicyFile = useCallback(async (file: File): Promise<ParsedPolicyData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          
          console.log("Parsing policy file:", file.name);
          console.log("Content length:", content.length);

          const domainHierarchy = extractDomainHierarchy(content);
          const policyRules = extractPolicyRules(content);
          const metadata = extractMetadata(content);
          const extractedSections = extractSections(content);

          console.log("Extracted domains:", domainHierarchy.length);
          console.log("Extracted rules:", policyRules.length);
          console.log("Extracted sections:", extractedSections.length);

          const parsedData: ParsedPolicyData = {
            fileName: file.name,
            fileType: file.name.split('.').pop()?.toUpperCase() || "UNKNOWN",
            domainHierarchy,
            policyRules,
            metadata,
            rawContent: content,
            extractedSections
          };

          resolve(parsedData);
        } catch (error) {
          console.error("Error parsing policy file:", error);
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  }, []);

  const handlePolicyUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      const parsed = await parsePolicyFile(file);
      setPolicyData(parsed);
      return parsed;
    } catch (error) {
      console.error("Error parsing policy file:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [parsePolicyFile]);

  const clearPolicyData = useCallback(() => {
    setPolicyData(null);
  }, []);

  return {
    policyData,
    isLoading,
    handlePolicyUpload,
    clearPolicyData,
  };
};
