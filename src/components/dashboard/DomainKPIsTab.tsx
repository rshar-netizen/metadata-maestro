import { KPICard } from "./KPICard";
import { DomainKPITable } from "./DomainKPITable";
import { AlertsPanel } from "./AlertsPanel";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  AlertTriangle,
  Layers,
  Database
} from "lucide-react";

export const DomainKPIsTab = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Overall KPIs */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Overall Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICard
            title="Overall Score"
            value="78%"
            subtitle="Across all domains"
            icon={BarChart3}
            variant="warning"
            trend={{ value: 4.2, isPositive: true }}
          />
          <KPICard
            title="Glossary Coverage"
            value="82%"
            subtitle="1,247 / 1,521 terms"
            icon={Target}
            trend={{ value: 2.1, isPositive: true }}
          />
          <KPICard
            title="Dictionary Coverage"
            value="74%"
            subtitle="3,892 / 5,260 fields"
            icon={Database}
            trend={{ value: 5.3, isPositive: true }}
          />
          <KPICard
            title="Active Domains"
            value="12"
            subtitle="4 need attention"
            icon={Layers}
          />
          <KPICard
            title="Improvement Rate"
            value="+3.2%"
            subtitle="vs last week"
            icon={TrendingUp}
            variant="success"
          />
          <KPICard
            title="Active Alerts"
            value="7"
            subtitle="2 critical"
            icon={AlertTriangle}
            variant="danger"
          />
        </div>
      </div>

      {/* Domain Performance Table */}
      <DomainKPITable />

      {/* Alerts Panel */}
      <AlertsPanel />
    </div>
  );
};
