import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  category: string;
}

export const TransactionsList = ({ refreshTrigger }: { refreshTrigger?: number }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions?limit=10');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [refreshTrigger]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Income: "bg-finance-income/10 text-finance-income border-finance-income/20",
      Housing: "bg-blue-500/10 text-blue-700 border-blue-200",
      Groceries: "bg-green-500/10 text-green-700 border-green-200",
      Transport: "bg-purple-500/10 text-purple-700 border-purple-200",
      Dining: "bg-orange-500/10 text-orange-700 border-orange-200",
      Entertainment: "bg-pink-500/10 text-pink-700 border-pink-200",
      Health: "bg-red-500/10 text-red-700 border-red-200",
      Others: "bg-gray-500/10 text-gray-700 border-gray-200"
    };
    return colors[category] || colors.Others;
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border-0 shadow-lg">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border-0 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Clock className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No transactions yet</p>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    transaction.amount >= 0 ? "bg-finance-income/10" : "bg-finance-expense/10"
                  )}>
                    {transaction.amount >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-finance-income" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-finance-expense" />
                    )}
                  </div>
                  
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={getCategoryColor(transaction.category)}>
                        {transaction.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={cn(
                  "text-sm font-semibold",
                  transaction.amount >= 0 ? "text-finance-income" : "text-finance-expense"
                )}>
                  {transaction.amount >= 0 ? "+" : "-"}{formatAmount(transaction.amount)}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};