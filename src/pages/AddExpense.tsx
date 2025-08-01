import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, DollarSign, Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Expense } from "@/components/ExpenseCard";
import { cn } from "@/lib/utils";

const categories = [
  { value: "Food & Dining", label: "Food & Dining", color: "food" },
  { value: "Transportation", label: "Transportation", color: "transport" },
  { value: "Bills & Utilities", label: "Bills & Utilities", color: "bills" },
  { value: "Subscriptions", label: "Subscriptions", color: "subscriptions" },
  { value: "Rent & Housing", label: "Rent & Housing", color: "housing" },
  { value: "Entertainment", label: "Entertainment", color: "muted" },
  { value: "Healthcare", label: "Healthcare", color: "muted" },
  { value: "Shopping", label: "Shopping", color: "muted" },
  { value: "Other", label: "Other", color: "muted" }
];

export default function AddExpense() {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    location: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const newExpense: Expense = {
        id: Date.now().toString(),
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        date: formData.date,
        location: formData.location || undefined
      };

      // Get existing expenses from localStorage
      const existingExpenses = JSON.parse(localStorage.getItem("expenses") || "[]");
      const updatedExpenses = [newExpense, ...existingExpenses];
      
      // Save to localStorage
      localStorage.setItem("expenses", JSON.stringify(updatedExpenses));

      toast({
        title: "Success! 🎉",
        description: `Added expense: ${formData.description} - $${formData.amount}`,
      });

      // Reset form
      setFormData({
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split('T')[0],
        location: ""
      });

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.value === formData.category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 pb-20 lg:pb-6">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Add New Expense
          </h1>
          <p className="text-muted-foreground">
            Track your spending and stay on budget
          </p>
        </div>

        {/* Form */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span>Expense Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">
                  Amount <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="pl-10 text-lg font-medium h-12"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center space-x-3">
                          <div 
                            className={cn(
                              "w-3 h-3 rounded-full",
                              category.color === "food" && "bg-food",
                              category.color === "transport" && "bg-transport",
                              category.color === "bills" && "bg-bills", 
                              category.color === "subscriptions" && "bg-subscriptions",
                              category.color === "housing" && "bg-housing",
                              category.color === "muted" && "bg-muted"
                            )}
                          />
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="What did you spend money on?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[100px]"
                  required
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">
                  Date <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              {/* Location (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Location <span className="text-muted-foreground text-xs">(optional)</span>
                </Label>
                <Input
                  id="location"
                  placeholder="Where did you make this purchase?"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="h-12"
                />
              </div>

              {/* Preview */}
              {formData.amount && formData.category && formData.description && (
                <div className="bg-secondary/50 rounded-lg p-4 border border-border/50">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Preview</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {selectedCategory && (
                        <div 
                          className={cn(
                            "w-4 h-4 rounded-full",
                            selectedCategory.color === "food" && "bg-food",
                            selectedCategory.color === "transport" && "bg-transport",
                            selectedCategory.color === "bills" && "bg-bills",
                            selectedCategory.color === "subscriptions" && "bg-subscriptions", 
                            selectedCategory.color === "housing" && "bg-housing",
                            selectedCategory.color === "muted" && "bg-muted"
                          )}
                        />
                      )}
                      <div>
                        <p className="font-medium text-foreground">{formData.description}</p>
                        <p className="text-sm text-muted-foreground">{formData.category}</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-foreground">
                      ${parseFloat(formData.amount || "0").toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.location.href = "/"}
                  className="order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !formData.amount || !formData.category || !formData.description}
                  className="order-1 sm:order-2 flex-1 bg-gradient-primary hover:opacity-90 disabled:opacity-50 h-12 text-lg font-medium shadow-button hover:shadow-card-hover transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="w-5 h-5" />
                      <span>Save Expense</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}