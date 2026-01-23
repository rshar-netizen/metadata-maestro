import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "danger";
}

export const KPICard = ({ title, value, subtitle, icon: Icon, trend, variant = "default" }: KPICardProps) => {
  const variantStyles = {
    default: "border-border/50",
    success: "border-success/30 bg-success/5",
    warning: "border-warning/30 bg-warning/5",
    danger: "border-destructive/30 bg-destructive/5",
  };

  const iconStyles = {
    default: "bg-primary/20 text-primary",
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
    danger: "bg-destructive/20 text-destructive",
  };

  return (
    <div className={cn("kpi-card", variantStyles[variant])}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 rounded-lg", iconStyles[variant])}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            trend.isPositive ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
          )}>
            {trend.isPositive ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground/70">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
