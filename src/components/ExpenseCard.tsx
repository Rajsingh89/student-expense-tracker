import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit3, MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  location?: string;
}

interface ExpenseCardProps {
  expense: Expense;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  "Food & Dining": "food",
  "Transportation": "transport", 
  "Bills & Utilities": "bills",
  "Subscriptions": "subscriptions",
  "Rent & Housing": "housing",
  "Other": "muted"
};

export default function ExpenseCard({ expense, onEdit, onDelete }: ExpenseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const colorKey = categoryColors[expense.category] || "muted";
  const settings = JSON.parse(localStorage.getItem("userSettings") || '{"currency": "INR"}');

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 cursor-pointer",
        "hover:shadow-card-hover hover:scale-[1.02] hover:-translate-y-1",
        "bg-gradient-card border-border/50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Category Color Strip */}
      <div 
        className={cn(
          "absolute top-0 left-0 right-0 h-1 transition-all duration-300",
          colorKey === "food" && "bg-food",
          colorKey === "transport" && "bg-transport", 
          colorKey === "bills" && "bg-bills",
          colorKey === "subscriptions" && "bg-subscriptions",
          colorKey === "housing" && "bg-housing",
          colorKey === "muted" && "bg-muted",
          isHovered && "h-2"
        )}
      />

      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {expense.description}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span 
                className={cn(
                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                  colorKey === "food" && "bg-food-light text-food",
                  colorKey === "transport" && "bg-transport-light text-transport",
                  colorKey === "bills" && "bg-bills-light text-bills", 
                  colorKey === "subscriptions" && "bg-subscriptions-light text-subscriptions",
                  colorKey === "housing" && "bg-housing-light text-housing",
                  colorKey === "muted" && "bg-muted text-muted-foreground"
                )}
              >
                {expense.category}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(expense.amount, settings.currency)}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(expense.date).toLocaleDateString()}</span>
            </div>
            {expense.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span className="truncate max-w-[100px]">{expense.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div 
          className={cn(
            "flex items-center justify-end space-x-2 transition-all duration-300",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}
        >
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(expense);
              }}
              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(expense.id);
              }}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}