import { useState, useEffect } from "react";
import { FinanceCard } from "./FinanceCard";
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle } from "lucide-react";

interface OverviewData {
  totalBalance: number;
  monthlySpending: number;
  monthlyIncome: number;
  savingsRate: number;
  alertsCount: number;
}

export const OverviewCards = ({ refreshTrigger }: { refreshTrigger?: number }) => {
  const [data, setData] = useState<OverviewData>({
    totalBalance: 0,
    monthlySpending: 0,
    monthlyIncome: 0,
    savingsRate: 0,
    alertsCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchOverviewData = async () => {
    try {
      const [monthlyResponse, alertsResponse] = await Promise.all([
        fetch('/api/monthly_totals'),
        fetch('/api/alerts')
      ]);

      let monthlySpending = 0;
      let monthlyIncome = 0;

      if (monthlyResponse.ok) {
        const monthlyData = await monthlyResponse.json();
        if (monthlyData.length > 0) {
          const latestMonth = monthlyData[monthlyData.length - 1];
          if (latestMonth.value < 0) {
            monthlySpending = Math.abs(latestMonth.value);
          } else {
            monthlyIncome = latestMonth.value;
          }
        }
      }

      let alertsCount = 0;
      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json();
        alertsCount = alertsData.alerts?.length || 0;
      }

      const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlySpending) / monthlyIncome) * 100 : 0;

      setData({
        totalBalance: monthlyIncome - monthlySpending,
        monthlySpending,
        monthlyIncome,
        savingsRate,
        alertsCount
      });
    } catch (error) {
      console.error('Failed to fetch overview data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, [refreshTrigger]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-muted rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <FinanceCard
        title="Net Balance"
        value={formatCurrency(data.totalBalance)}
        change={data.totalBalance >= 0 ? "Positive balance" : "Negative balance"}
        trend={data.totalBalance >= 0 ? "up" : "down"}
        icon={<DollarSign className="w-5 h-5" />}
      />

      <FinanceCard
        title="Monthly Income"
        value={formatCurrency(data.monthlyIncome)}
        change="This month"
        trend="up"
        icon={<TrendingUp className="w-5 h-5" />}
      />

      <FinanceCard
        title="Monthly Spending"
        value={formatCurrency(data.monthlySpending)}
        change="This month"
        trend="down"
        icon={<TrendingDown className="w-5 h-5" />}
      />

      <FinanceCard
        title="Savings Rate"
        value={formatPercentage(data.savingsRate)}
        change={data.savingsRate >= 20 ? "Great job!" : data.savingsRate >= 10 ? "Good progress" : "Needs improvement"}
        trend={data.savingsRate >= 20 ? "up" : data.savingsRate >= 10 ? "neutral" : "down"}
        icon={<AlertTriangle className="w-5 h-5" />}
      />
    </div>
  );
};