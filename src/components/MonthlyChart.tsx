import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, BarChart3 } from "lucide-react";

interface MonthlyData {
  month: string;
  value: number;
}

interface ForecastData {
  month_index: number;
  value: number;
}

export const MonthlyChart = () => {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [monthlyResponse, forecastResponse] = await Promise.all([
        fetch('/api/monthly_totals'),
        fetch('/api/forecast?months=3')
      ]);

      if (monthlyResponse.ok) {
        const monthlyData = await monthlyResponse.json();
        setData(monthlyData);
      }

      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        setForecast(forecastData.forecast || []);
      }
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  // Combine historical and forecast data for display
  const combinedData = [
    ...data.map((d, index) => ({
      month: formatMonth(d.month),
      actual: d.value,
      forecast: null,
      index: index
    })),
    ...forecast.map((f, index) => ({
      month: `Forecast ${index + 1}`,
      actual: null,
      forecast: f.value,
      index: data.length + index
    }))
  ];

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border-0 shadow-lg">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border-0 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Monthly Spending Trend</h2>
          <p className="text-sm text-muted-foreground">Historical data and forecast</p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
              className="text-xs fill-muted-foreground"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="text-xs fill-muted-foreground"
              tick={{ fontSize: 12 }}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number | null, name: string) => [
                value ? formatCurrency(value) : null,
                name === 'actual' ? 'Actual' : 'Forecast'
              ]}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="hsl(var(--finance-goal))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: 'hsl(var(--finance-goal))', strokeWidth: 2, r: 4 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {data.length > 0 && (
        <div className="flex items-center justify-center mt-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-muted-foreground">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-finance-goal rounded-full"></div>
            <span className="text-muted-foreground">Forecast</span>
          </div>
        </div>
      )}
    </Card>
  );
};