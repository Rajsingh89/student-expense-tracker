import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, Plus, Calendar, DollarSign } from "lucide-react";
import ExpenseCard, { Expense } from "@/components/ExpenseCard";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "All Categories",
  "Food & Dining",
  "Transportation", 
  "Bills & Utilities",
  "Subscriptions",
  "Rent & Housing",
  "Entertainment",
  "Healthcare",
  "Shopping",
  "Other"
];

const sortOptions = [
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "amount-desc", label: "Highest Amount" },
  { value: "amount-asc", label: "Lowest Amount" },
  { value: "category", label: "Category A-Z" }
];

export default function Transactions() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("date-desc");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const { toast } = useToast();

  useEffect(() => {
    // Load expenses from localStorage
    const stored = localStorage.getItem("expenses");
    if (stored) {
      const parsedExpenses = JSON.parse(stored);
      setExpenses(parsedExpenses);
      setFilteredExpenses(parsedExpenses);
    }
  }, []);

  useEffect(() => {
    let filtered = [...expenses];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (expense.location && expense.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(expense => expense.category === selectedCategory);
    }

    // Filter by date range
    if (dateRange.start) {
      filtered = filtered.filter(expense => 
        new Date(expense.date) >= new Date(dateRange.start)
      );
    }
    if (dateRange.end) {
      filtered = filtered.filter(expense => 
        new Date(expense.date) <= new Date(dateRange.end)
      );
    }

    // Sort expenses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "amount-desc":
          return b.amount - a.amount;
        case "amount-asc":
          return a.amount - b.amount;
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    setFilteredExpenses(filtered);
  }, [expenses, searchTerm, selectedCategory, sortBy, dateRange]);

  const handleDeleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
    
    toast({
      title: "Expense Deleted",
      description: "The expense has been removed successfully.",
    });
  };

  const handleExport = () => {
    const csvContent = [
      ["Date", "Description", "Category", "Amount", "Location"],
      ...filteredExpenses.map(expense => [
        expense.date,
        expense.description,
        expense.category,
        expense.amount.toString(),
        expense.location || ""
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Your expenses have been exported to CSV.",
    });
  };

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 pb-20 lg:pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Transaction History
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and review all your expenses
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline"
              onClick={handleExport}
              disabled={filteredExpenses.length === 0}
              className="hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button 
              onClick={() => window.location.href = "/add-expense"}
              className="bg-gradient-primary hover:opacity-90 shadow-button hover:shadow-card-hover transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>

        {/* Summary Card */}
        <Card className="mb-8 bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-foreground">
                  ${totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold text-foreground">
                  {filteredExpenses.length}
                </p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground">Average</p>
                <p className="text-2xl font-bold text-foreground">
                  ${filteredExpenses.length > 0 ? (totalAmount / filteredExpenses.length).toFixed(2) : "0.00"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-8 bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-primary" />
              <span>Filters & Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <div className="flex space-x-2">
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="text-xs"
                  />
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedCategory !== "All Categories" || dateRange.start || dateRange.end) && (
              <div className="mt-4 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All Categories");
                    setDateRange({ start: "", end: "" });
                    setSortBy("date-desc");
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expenses List */}
        {filteredExpenses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onDelete={handleDeleteExpense}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {expenses.length === 0 ? "No expenses yet" : "No matching expenses"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {expenses.length === 0 
                  ? "Start tracking your expenses to see them here" 
                  : "Try adjusting your filters to find what you're looking for"}
              </p>
              <Button 
                onClick={() => window.location.href = "/add-expense"}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}