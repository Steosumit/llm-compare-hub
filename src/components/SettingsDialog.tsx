import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});
  const [tokens, setTokens] = useState({
    openai: localStorage.getItem('openai_token') || '',
    gemini: localStorage.getItem('gemini_token') || '',
    claude: localStorage.getItem('claude_token') || '',
  });
  const { toast } = useToast();

  const toggleTokenVisibility = (provider: string) => {
    setShowTokens(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleTokenChange = (provider: string, value: string) => {
    setTokens(prev => ({ ...prev, [provider]: value }));
  };

  const handleSave = () => {
    // Save tokens to localStorage
    Object.entries(tokens).forEach(([provider, token]) => {
      if (token) {
        localStorage.setItem(`${provider}_token`, token);
      } else {
        localStorage.removeItem(`${provider}_token`);
      }
    });

    toast({
      title: "Settings saved",
      description: "Your API tokens have been saved locally.",
    });

    onOpenChange(false);
  };

  const providers = [
    { key: 'openai', name: 'OpenAI', placeholder: 'sk-...' },
    { key: 'gemini', name: 'Google Gemini', placeholder: 'AI...' },
    { key: 'claude', name: 'Anthropic Claude', placeholder: 'sk-ant-...' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">API Tokens</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure your API tokens to enable model comparisons. Tokens are stored locally in your browser.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {providers.map((provider) => (
                <div key={provider.key} className="space-y-2">
                  <Label htmlFor={provider.key}>{provider.name} API Token</Label>
                  <div className="relative">
                    <Input
                      id={provider.key}
                      type={showTokens[provider.key] ? "text" : "password"}
                      placeholder={provider.placeholder}
                      value={tokens[provider.key as keyof typeof tokens]}
                      onChange={(e) => handleTokenChange(provider.key, e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => toggleTokenVisibility(provider.key)}
                    >
                      {showTokens[provider.key] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
              <p className="text-sm text-muted-foreground">
                Optional: Add your information for context in prompts.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" placeholder="e.g., Prompt Engineer" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company/Organization</Label>
                <Input id="company" placeholder="Your company" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}