import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WelcomeFormProps {
  isOpen: boolean;
  onClose: (userName: string) => void;
}

export default function WelcomeForm({ isOpen, onClose }: WelcomeFormProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "कृपया अपना नाम डालें",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simulate loading
    setTimeout(() => {
      const userData = {
        name: name.trim(),
        joinDate: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      localStorage.setItem("userData", JSON.stringify(userData));
      
      toast({
        title: "Welcome! 🎉",
        description: `आपका स्वागत है ${name}! अब आप expense tracking शुरू कर सकते हैं।`,
      });
      
      setIsLoading(false);
      onClose(name);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md bg-gradient-card border-border/50">{/* removed hideCloseButton */}
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Smart Expense Tracker में आपका स्वागत है! 
          </DialogTitle>
          <p className="text-muted-foreground mt-2">
            शुरू करने के लिए कृपया अपना नाम बताएं
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              आपका नाम
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="अपना नाम डालें"
                className="pl-10"
                disabled={isLoading}
                autoFocus
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-primary hover:opacity-90 shadow-button hover:shadow-card-hover transition-all duration-300"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Setting up...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>शुरू करें</span>
              </div>
            )}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p className="text-xs text-muted-foreground">
            आपका डेटा आपके device पर safe रखा जाएगा
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}