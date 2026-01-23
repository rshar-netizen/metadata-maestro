import { AlertTriangle, AlertCircle, Info, Bell, Clock, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  description: string;
  domain: string;
  timestamp: string;
  assignee?: string;
  acknowledged: boolean;
}

const alerts: Alert[] = [
  {
    id: "1",
    type: "critical",
    title: "PII Compliance Risk Detected",
    description: "SSN field in Customer dataset lacks proper masking policy",
    domain: "Customer Data",
    timestamp: "2 min ago",
    assignee: "Sarah Chen",
    acknowledged: false
  },
  {
    id: "2",
    type: "warning",
    title: "Metadata Match Score Below Threshold",
    description: "Risk metrics domain showing <60% match score average",
    domain: "Risk Analytics",
    timestamp: "15 min ago",
    acknowledged: false
  },
  {
    id: "3",
    type: "warning",
    title: "Data Dictionary Update Required",
    description: "12 new fields detected without definitions in Portfolio domain",
    domain: "Portfolio Management",
    timestamp: "1 hour ago",
    assignee: "Mike Johnson",
    acknowledged: true
  },
  {
    id: "4",
    type: "info",
    title: "Scheduled Validation Complete",
    description: "Weekly metadata validation completed with 94% success rate",
    domain: "All Domains",
    timestamp: "3 hours ago",
    acknowledged: true
  }
];

const getAlertStyles = (type: Alert["type"]) => {
  switch (type) {
    case "critical":
      return {
        bg: "bg-destructive/10 border-destructive/30",
        icon: AlertCircle,
        iconColor: "text-destructive",
        badge: "bg-destructive/20 text-destructive"
      };
    case "warning":
      return {
        bg: "bg-warning/10 border-warning/30",
        icon: AlertTriangle,
        iconColor: "text-warning",
        badge: "bg-warning/20 text-warning"
      };
    case "info":
      return {
        bg: "bg-info/10 border-info/30",
        icon: Info,
        iconColor: "text-info",
        badge: "bg-info/20 text-info"
      };
  }
};

export const AlertsPanel = () => {
  return (
    <div className="card-glass rounded-xl">
      <div className="p-6 border-b border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-warning/20">
            <Bell className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Active Alerts</h3>
            <p className="text-sm text-muted-foreground">
              {alerts.filter(a => !a.acknowledged).length} unacknowledged alerts
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          View All
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="divide-y divide-border/30">
        {alerts.map((alert) => {
          const styles = getAlertStyles(alert.type);
          const Icon = styles.icon;
          
          return (
            <div 
              key={alert.id}
              className={cn(
                "p-4 transition-colors hover:bg-muted/20",
                !alert.acknowledged && "bg-muted/10"
              )}
            >
              <div className="flex gap-4">
                <div className={cn("p-2 rounded-lg h-fit", styles.bg)}>
                  <Icon className={cn("w-5 h-5", styles.iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-foreground">
                          {alert.title}
                        </h4>
                        {!alert.acknowledged && (
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                    <span className={cn("alert-badge flex-shrink-0", styles.badge)}>
                      {alert.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.timestamp}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-muted/50">
                      {alert.domain}
                    </span>
                    {alert.assignee && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {alert.assignee}
                      </span>
                    )}
                  </div>
                  {!alert.acknowledged && (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Acknowledge
                      </Button>
                      <Button size="sm" className="h-7 text-xs bg-primary text-primary-foreground">
                        Assign & Resolve
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
