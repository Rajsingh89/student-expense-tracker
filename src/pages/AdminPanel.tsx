import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, Users, Activity, TrendingUp, Calendar, 
  DollarSign, BarChart3, Clock, MapPin, Tag,
  Eye, Download, RefreshCw
} from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { useNavigate } from "react-router-dom";

interface UserData {
  name: string;
  joinDate: string;
  lastLogin: string;
}

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  location?: string;
}

export default function AdminPanel() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settings, setSettings] = useState({ currency: "INR", monthlyBudget: 50000 });
  const navigate = useNavigate();

  useEffect(() => {
    // Load user data
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }

    // Load expenses
    const storedExpenses = localStorage.getItem("expenses");
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    }

    // Load settings
    const storedSettings = localStorage.getItem("userSettings");
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  // Advanced Analytics Calculations
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const avgExpensePerDay = expenses.length > 0 ? totalExpenses / expenses.length : 0;
  
  const categoryBreakdown = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryBreakdown)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const expensesByDate = expenses.reduce((acc, exp) => {
    const date = new Date(exp.date).toDateString();
    acc[date] = (acc[date] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const highestSpendingDay = Object.entries(expensesByDate)
    .sort(([,a], [,b]) => b - a)[0];

  const recentActivity = expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const handleExportDetailedData = () => {
    const detailedData = {
      user: userData,
      settings,
      expenses,
      analytics: {
        totalExpenses,
        avgExpensePerDay,
        categoryBreakdown,
        expensesByDate,
        topCategories,
        exportTimestamp: new Date().toISOString()
      }
    };

    const blob = new Blob([JSON.stringify(detailedData, null, 2)], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin-detailed-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center">
        <Card className="w-96 bg-gradient-card border-border/50">
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              Admin panel access requires user registration
            </p>
            <Button onClick={() => navigate("/")} variant="outline">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 pb-20 lg:pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
                <p className="text-muted-foreground">Deep Analytics & User Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleExportDetailedData}>
                <Download className="w-4 h-4 mr-2" />
                Export Detailed Report
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="user">User Profile</TabsTrigger>
            <TabsTrigger value="analytics">Deep Analytics</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-food-light rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-food" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                      <p className="text-xl font-bold">{formatCurrency(totalExpenses, settings.currency)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-transport-light rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-transport" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg/Day</p>
                      <p className="text-xl font-bold">{formatCurrency(avgExpensePerDay, settings.currency)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-bills-light rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-bills" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Transactions</p>
                      <p className="text-xl font-bold">{expenses.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-housing-light rounded-lg flex items-center justify-center">
                      <Tag className="w-5 h-5 text-housing" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Categories</p>
                      <p className="text-xl font-bold">{Object.keys(categoryBreakdown).length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Categories */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Top Spending Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topCategories.map(([category, amount], index) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <span className="font-medium">{category}</span>
                      </div>
                      <span className="font-bold">{formatCurrency(amount, settings.currency)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="user" className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>User Profile Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="text-lg font-semibold">{userData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Join Date</p>
                    <p className="text-lg font-semibold">
                      {new Date(userData.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Login</p>
                    <p className="text-lg font-semibold">
                      {new Date(userData.lastLogin).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Preferred Currency</p>
                    <p className="text-lg font-semibold">{settings.currency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Budget</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(settings.monthlyBudget, settings.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Status</p>
                    <Badge className="bg-accent text-accent-foreground">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>Spending Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Highest Spending Day</p>
                    <p className="font-semibold">
                      {highestSpendingDay ? highestSpendingDay[0] : "N/A"}
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {highestSpendingDay ? formatCurrency(highestSpendingDay[1], settings.currency) : "₹0"}
                    </p>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Budget Utilization</p>
                    <p className="text-lg font-bold">
                      {((totalExpenses / settings.monthlyBudget) * 100).toFixed(1)}%
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(categoryBreakdown).map(([category, amount]) => {
                      const percentage = (amount / totalExpenses) * 100;
                      return (
                        <div key={category} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{category}</span>
                            <span>{percentage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {expense.category} • {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(expense.amount, settings.currency)}</p>
                        {expense.location && (
                          <p className="text-xs text-muted-foreground flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {expense.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}