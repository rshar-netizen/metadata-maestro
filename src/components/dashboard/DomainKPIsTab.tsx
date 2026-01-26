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
            value="76%"
            subtitle="Across all domains"
            icon={BarChart3}
            variant="warning"
            trend={{ value: 3.8, isPositive: true }}
          />
          <KPICard
            title="Glossary Coverage"
            value="75%"
            subtitle="Across 7 domains"
            icon={Target}
            trend={{ value: 2.4, isPositive: true }}
          />
          <KPICard
            title="Dictionary Coverage"
            value="78%"
            subtitle="44 tables mapped"
            icon={Database}
            trend={{ value: 4.1, isPositive: true }}
          />
          <KPICard
            title="Active Domains"
            value="7"
            subtitle="3 need attention"
            icon={Layers}
          />
          <KPICard
            title="Improvement Rate"
            value="+2.8%"
            subtitle="vs last week"
            icon={TrendingUp}
            variant="success"
          />
          <KPICard
            title="Active Alerts"
            value="5"
            subtitle="1 critical"
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
