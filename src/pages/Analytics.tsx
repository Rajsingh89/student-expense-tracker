import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, TooltipProps } from "recharts";
import { TrendingUp, DollarSign, Calendar, Target } from "lucide-react";
import { Expense } from "@/components/ExpenseCard";

const COLORS = {
  "Food & Dining": "hsl(150, 56%, 35%)",
  "Transportation": "hsl(205, 91%, 52%)",
  "Bills & Utilities": "hsl(13, 83%, 43%)",
  "Subscriptions": "hsl(13, 84%, 34%)",
  "Rent & Housing": "hsl(162, 34%, 52%)",
  "Other": "hsl(215, 16%, 47%)"
};

export default function Analytics() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [timeRange, setTimeRange] = useState<"month" | "quarter" | "year">("month");

  useEffect(() => {
    const stored = localStorage.getItem("expenses");
    if (stored) {
      setExpenses(JSON.parse(stored));
    }
  }, []);

  // Calculate category totals
  const categoryData = expenses.reduce((acc, expense) => {
    const category = expense.category;
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([category, amount]) => ({
    name: category,
    value: amount,
    color: COLORS[category as keyof typeof COLORS] || COLORS.Other
  }));

  // Monthly spending trend
  const monthlyData = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const trendData = Object.entries(monthlyData)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([month, amount]) => ({ month, amount }));

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const avgTransaction = expenses.length > 0 ? totalSpent / expenses.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 pb-20 lg:pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Analytics & Insights
          </h1>
          <p className="text-muted-foreground">
            Understand your spending patterns and make informed decisions
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              title: "Total Spent",
              value: `$${totalSpent.toFixed(2)}`,
              icon: DollarSign,
              color: "food"
            },
            {
              title: "Transactions",
              value: expenses.length.toString(),
              icon: Calendar,
              color: "transport"
            },
            {
              title: "Average per Transaction",
              value: `$${avgTransaction.toFixed(2)}`,
              icon: TrendingUp,
              color: "bills"
            },
            {
              title: "Categories",
              value: Object.keys(categoryData).length.toString(),
              icon: Target,
              color: "housing"
            }
          ].map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title} className="bg-gradient-card border-border/50 hover:shadow-card-hover transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.title}</p>
                      <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-${metric.color}-light text-${metric.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Spending by Category */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Category breakdown */}
                  <div className="space-y-2">
                    {pieData.map((category) => (
                      <div key={category.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          <span>{category.name}</span>
                        </div>
                        <span className="font-medium">${category.value.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Spending Trend */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Spending Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="hsl(150, 56%, 35%)" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(150, 56%, 35%)", strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Daily Average */}
        <Card className="mt-8 bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={pieData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
                  <Bar dataKey="value" fill="hsl(150, 56%, 35%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}