import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar, Target } from "lucide-react";
import ExpenseCard, { Expense } from "@/components/ExpenseCard";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";
import WelcomeForm from "@/components/WelcomeForm";

// Mock data for demonstration
const mockExpenses: Expense[] = [
  {
    id: "1",
    amount: 25.50,
    category: "Food & Dining",
    description: "Lunch at Cafe Milano",
    date: new Date().toISOString(),
    location: "Downtown"
  },
  {
    id: "2", 
    amount: 45.00,
    category: "Transportation",
    description: "Uber ride to airport",
    date: new Date(Date.now() - 86400000).toISOString(),
    location: "Airport"
  },
  {
    id: "3",
    amount: 120.00,
    category: "Bills & Utilities",
    description: "Monthly internet bill",
    date: new Date(Date.now() - 172800000).toISOString()
  }
];

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [monthlyBudget] = useState(50000);
  const [settings, setSettings] = useState({ currency: "INR", monthlyBudget: 50000 });
  const [showWelcomeForm, setShowWelcomeForm] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Check if user exists
    const userData = localStorage.getItem("userData");
    if (!userData) {
      setShowWelcomeForm(true);
    } else {
      const parsedUser = JSON.parse(userData);
      setUserName(parsedUser.name);
      // Update last login
      const updatedUser = { ...parsedUser, lastLogin: new Date().toISOString() };
      localStorage.setItem("userData", JSON.stringify(updatedUser));
    }

    // Load from localStorage or use mock data
    const stored = localStorage.getItem("expenses");
    if (stored) {
      setExpenses(JSON.parse(stored));
    } else {
      setExpenses(mockExpenses);
      localStorage.setItem("expenses", JSON.stringify(mockExpenses));
    }
    
    // Load settings
    const storedSettings = localStorage.getItem("userSettings");
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      setSettings(parsedSettings);
    }
  }, []);

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTotal = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && 
               expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    setTotalSpent(monthlyTotal);
  }, [expenses]);

  const budgetUsed = (totalSpent / settings.monthlyBudget) * 100;
  const recentExpenses = expenses.slice(0, 3);

  const handleWelcomeFormClose = (name: string) => {
    setUserName(name);
    setShowWelcomeForm(false);
  };

  const stats = [
    {
      title: "Total Spent This Month",
      value: formatCurrency(totalSpent, settings.currency),
      icon: DollarSign,
      trend: totalSpent > settings.monthlyBudget * 0.8 ? "up" : "down",
      color: "food"
    },
    {
      title: "Monthly Budget",
      value: formatCurrency(settings.monthlyBudget, settings.currency),
      icon: Target,
      trend: "neutral",
      color: "transport"
    },
    {
      title: "Budget Remaining",
      value: formatCurrency(settings.monthlyBudget - totalSpent, settings.currency),
      icon: TrendingUp,
      trend: settings.monthlyBudget - totalSpent > 0 ? "down" : "up",
      color: "housing"
    },
    {
      title: "Transactions",
      value: expenses.length.toString(),
      icon: Calendar,
      trend: "neutral",
      color: "bills"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 pb-20 lg:pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {userName ? `नमस्ते, ${userName}! 👋` : 'Welcome back! 👋'}
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's your spending overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          
          <Button 
            size="lg"
            className="bg-gradient-primary hover:opacity-90 shadow-button hover:shadow-card-hover transition-all duration-300 hover:scale-105"
            onClick={() => window.location.href = "/add-expense"}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Expense
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.title}
                className={cn(
                  "group hover:shadow-card-hover transition-all duration-300 hover:scale-105 bg-gradient-card border-border/50",
                  "cursor-pointer"
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                    <div 
                      className={cn(
                        "p-3 rounded-lg transition-colors duration-300",
                        stat.color === "food" && "bg-food-light text-food group-hover:bg-food group-hover:text-white",
                        stat.color === "transport" && "bg-transport-light text-transport group-hover:bg-transport group-hover:text-white",
                        stat.color === "housing" && "bg-housing-light text-housing group-hover:bg-housing group-hover:text-white",
                        stat.color === "bills" && "bg-bills-light text-bills group-hover:bg-bills group-hover:text-white"
                      )}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Budget Progress */}
        <Card className="mb-8 bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary" />
              <span>Monthly Budget Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {formatCurrency(totalSpent, settings.currency)} of {formatCurrency(settings.monthlyBudget, settings.currency)}
                </span>
                <span className={cn(
                  "font-medium",
                  budgetUsed > 90 ? "text-destructive" : 
                  budgetUsed > 75 ? "text-orange-500" : "text-primary"
                )}>
                  {budgetUsed.toFixed(1)}%
                </span>
              </div>
              <div className="relative w-full bg-secondary rounded-full h-3 overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-500 rounded-full",
                    budgetUsed > 90 ? "bg-destructive" :
                    budgetUsed > 75 ? "bg-orange-500" : "bg-gradient-primary"
                  )}
                  style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                />
              </div>
              {budgetUsed > 90 && (
                <p className="text-sm text-destructive font-medium">
                  ⚠️ You're close to exceeding your monthly budget!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Expenses</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = "/transactions"}
              className="hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {recentExpenses.length > 0 ? (
              <div className="space-y-4">
                {recentExpenses.map((expense) => (
                  <ExpenseCard key={expense.id} expense={expense} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No expenses yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start tracking your expenses to see insights here
                </p>
                <Button 
                  onClick={() => window.location.href = "/add-expense"}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Expense
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Welcome Form */}
      <WelcomeForm 
        isOpen={showWelcomeForm} 
        onClose={handleWelcomeFormClose}
      />
    </div>
  );
}