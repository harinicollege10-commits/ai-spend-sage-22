import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FinanceCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export const FinanceCard = ({ 
  title, 
  value, 
  change, 
  trend = "neutral", 
  icon, 
  className,
  children 
}: FinanceCardProps) => {
  const trendColors = {
    up: "text-finance-income",
    down: "text-finance-expense", 
    neutral: "text-muted-foreground"
  };

  return (
    <Card className={cn(
      "p-6 bg-gradient-to-br from-card to-muted/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      
      <div className="space-y-2">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {change && (
          <p className={cn("text-sm font-medium", trendColors[trend])}>
            {change}
          </p>
        )}
      </div>
      
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </Card>
  );
};