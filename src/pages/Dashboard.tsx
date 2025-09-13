import { useState } from "react";
import { OverviewCards } from "@/components/OverviewCards";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionsList } from "@/components/TransactionsList";
import { GoalsCard } from "@/components/GoalsCard";
import { MonthlyChart } from "@/components/MonthlyChart";
import heroImage from "@/assets/finance-hero.jpg";

const Dashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTransactionAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative bg-gradient-to-r from-primary/5 via-transparent to-finance-goal/5">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-finance-goal bg-clip-text text-transparent">
                AI Finance Dashboard
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Take control of your finances with intelligent insights, automated categorization, and personalized recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Overview Cards */}
        <section aria-labelledby="overview-heading">
          <h2 id="overview-heading" className="text-2xl font-semibold mb-6 text-foreground">
            Financial Overview
          </h2>
          <OverviewCards refreshTrigger={refreshTrigger} />
        </section>

        {/* Charts and Goals Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section aria-labelledby="chart-heading" className="lg:col-span-2">
            <h2 id="chart-heading" className="text-xl font-semibold mb-4 text-foreground">
              Spending Trends & Forecast
            </h2>
            <MonthlyChart />
          </section>

          <section aria-labelledby="goals-heading">
            <h2 id="goals-heading" className="text-xl font-semibold mb-4 text-foreground">
              Savings Goals
            </h2>
            <GoalsCard />
          </section>
        </div>

        {/* Transaction Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section aria-labelledby="add-transaction-heading">
            <h2 id="add-transaction-heading" className="text-xl font-semibold mb-4 text-foreground">
              Add New Transaction
            </h2>
            <TransactionForm onTransactionAdded={handleTransactionAdded} />
          </section>

          <section aria-labelledby="transactions-heading">
            <h2 id="transactions-heading" className="text-xl font-semibold mb-4 text-foreground">
              Recent Activity
            </h2>
            <TransactionsList refreshTrigger={refreshTrigger} />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 AI Finance Dashboard. Manage your money intelligently.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;