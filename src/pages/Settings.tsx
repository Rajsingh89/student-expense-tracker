import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Settings as SettingsIcon, User, Bell, Database, Download, Trash2, Save, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface UserSettings {
  monthlyBudget: number;
  currency: string;
  notifications: boolean;
  darkMode: boolean;
  defaultCategory: string;
}

const currencies = [
  { value: "INR", label: "INR (₹)" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "CAD", label: "CAD ($)" },
  { value: "AUD", label: "AUD ($)" }
];

const categories = [
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

export default function Settings() {
  const [settings, setSettings] = useState<UserSettings>({
    monthlyBudget: 2000,
    currency: "INR",
    notifications: true,
    darkMode: false,
    defaultCategory: "Other"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load settings from localStorage
    const stored = localStorage.getItem("userSettings");
    if (stored) {
      setSettings(JSON.parse(stored));
    }
    
    // Load user data
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      localStorage.setItem("userSettings", JSON.stringify(settings));
      
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    const expenses = JSON.parse(localStorage.getItem("expenses") || "[]");
    const data = {
      expenses,
      settings,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expense-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Your data has been exported successfully.",
    });
  };

  const handleClearAllData = () => {
    localStorage.removeItem("expenses");
    localStorage.removeItem("userSettings");
    
    toast({
      title: "Data Cleared",
      description: "All your data has been cleared. You'll be redirected to start fresh.",
    });

    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  const expenseCount = JSON.parse(localStorage.getItem("expenses") || "[]").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 pb-20 lg:pb-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Customize your expense tracking experience
          </p>
        </div>

        <div className="space-y-8">
          {/* Budget Settings */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-primary" />
                <span>Budget & Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="budget">Monthly Budget</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      {settings.currency === "INR" ? "₹" : "$"}
                    </span>
                    <Input
                      id="budget"
                      type="number"
                      value={settings.monthlyBudget}
                      onChange={(e) => setSettings({ ...settings, monthlyBudget: parseFloat(e.target.value) || 0 })}
                      className="pl-8"
                      placeholder="2000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={settings.currency} 
                    onValueChange={(value) => setSettings({ ...settings, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultCategory">Default Category</Label>
                  <Select 
                    value={settings.defaultCategory} 
                    onValueChange={(value) => setSettings({ ...settings, defaultCategory: value })}
                  >
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
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-primary" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Budget Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when you're close to your budget limit
                  </p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-primary" />
                <span>Data Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-secondary/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Current Data</p>
                    <p className="text-sm text-muted-foreground">
                      {expenseCount} expense{expenseCount !== 1 ? 's' : ''} tracked
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  className="justify-start h-auto p-4 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Download className="w-5 h-5" />
                    <div className="text-left">
                      <p className="font-medium">Export Data</p>
                      <p className="text-xs text-muted-foreground">
                        Download your data as JSON
                      </p>
                    </div>
                  </div>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start h-auto p-4 hover:bg-destructive hover:text-destructive-foreground transition-colors border-destructive/30"
                    >
                      <div className="flex items-center space-x-3">
                        <Trash2 className="w-5 h-5" />
                        <div className="text-left">
                          <p className="font-medium">Clear All Data</p>
                          <p className="text-xs text-muted-foreground">
                            Remove all expenses and settings
                          </p>
                        </div>
                      </div>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear All Data?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all your expenses and settings. This action cannot be undone.
                        Make sure to export your data first if you want to keep a backup.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleClearAllData}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Yes, Clear All Data
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>

          {/* Admin Panel Section */}
          {userData && (
            <Card className="bg-gradient-card border-border/50 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Admin Panel</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">Deep Analytics & User Management</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Access advanced analytics, detailed user insights, and comprehensive data management tools.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          Advanced Reports
                        </span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          User Activity
                        </span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          Deep Insights
                        </span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          Data Export
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => navigate("/admin")}
                    className="w-full bg-gradient-primary hover:opacity-90 shadow-button hover:shadow-card-hover transition-all duration-300"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Open Admin Panel
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-secondary/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{userData.name}</p>
                    <p className="text-sm text-muted-foreground">Admin User</p>
                  </div>
                  <div className="text-center p-3 bg-secondary/50 rounded-lg">
                    <p className="text-2xl font-bold text-accent">
                      {new Date(userData.joinDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSaveSettings}
              disabled={isLoading}
              className="bg-gradient-primary hover:opacity-90 shadow-button hover:shadow-card-hover transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}