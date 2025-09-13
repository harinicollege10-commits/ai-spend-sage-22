import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Goal {
  id: number;
  name: string;
  target: number;
  saved: number;
}

export const GoalsCard = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newGoal, setNewGoal] = useState({ name: "", target: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals');
      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      }
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const addGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target) return;

    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newGoal.name,
          target: parseFloat(newGoal.target)
        })
      });

      if (response.ok) {
        toast({
          title: "Goal added",
          description: "Your savings goal has been created successfully.",
        });
        setNewGoal({ name: "", target: "" });
        setShowAddForm(false);
        fetchGoals();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border-0 shadow-lg">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-2 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border-0 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-finance-goal/10 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-finance-goal" />
          </div>
          <h2 className="text-lg font-semibold">Savings Goals</h2>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-finance-goal border-finance-goal/20 hover:bg-finance-goal/10"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {showAddForm && (
        <form onSubmit={addGoal} className="mb-4 p-4 bg-background/50 rounded-lg space-y-3">
          <Input
            placeholder="Goal name (e.g., Emergency Fund)"
            value={newGoal.name}
            onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          <Input
            type="number"
            step="0.01"
            placeholder="Target amount"
            value={newGoal.target}
            onChange={(e) => setNewGoal(prev => ({ ...prev, target: e.target.value }))}
            required
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="bg-finance-goal hover:bg-finance-goal/90">
              Add Goal
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
            <p>No goals set yet</p>
            <p className="text-sm">Create your first savings goal!</p>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = (goal.saved / goal.target) * 100;
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm">{goal.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="w-3 h-3" />
                    {Math.round(progress)}%
                  </div>
                </div>
                
                <Progress value={progress} className="h-2 bg-muted" />
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(goal.saved)}</span>
                  <span>{formatCurrency(goal.target)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};