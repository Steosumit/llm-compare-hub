import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Trash2, Send, Check} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { patternTemplates, PatternType } from "@/lib/patternTemplates";

const models = [
  { value: "gpt-4", label: "GPT-4" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "gemini-2.5-flash", label: "gemini-2.5-flash" },
  { value: "claude-3", label: "Claude 3" },
];


interface PromptCardProps {
  id: string;
  initialPrompt?: string;
  patternType?: PatternType;
  enabled?: boolean;
  onDelete: (id: string) => void;
  onSend: (id: string, prompt: string, model: string) => void;
  onEnableToggle?: (id: string, enabled: boolean) => void;
}

export function PromptCard({ id, initialPrompt, patternType, enabled = true, onDelete, onSend, onEnableToggle }: PromptCardProps) {

  const [prompt, setPrompt] = useState(
    initialPrompt || (patternType ? patternTemplates[patternType] : "")
  );
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4");
  const { toast } = useToast();
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast({
        title: "Copied to clipboard",
        description: "Prompt has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy prompt to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleSend = () => {
    if (!enabled) {
      toast({
        title: "Card disabled",
        description: "Enable the card first to send the prompt.",
        variant: "destructive",
      });
      return;
    }
    
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a prompt before sending.",
        variant: "destructive",
      });
      return;
    }
    onSend(id, prompt, selectedModel);
  };

  return (
    <Card className={`mb-4 transition-all duration-200 hover:shadow-md ${
      enabled ? '' : 'opacity-50 bg-muted/30'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Select 
              value={selectedModel} 
              onValueChange={setSelectedModel}
              disabled={!enabled}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {patternType && (
              <span className={`text-xs px-2 py-1 rounded ${
                enabled 
                  ? 'bg-accent text-accent-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {String(patternType).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopy}
              disabled={!enabled}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEnableToggle?.(id, !enabled)}
              className={enabled ? "text-green-600" : "text-red-500"}
              title={enabled ? "Disable card" : "Enable card"}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="min-h-32 mb-3 resize-none"
          disabled={!enabled}
        />
        
        <Button 
          onClick={handleSend} 
          className="w-full"
          disabled={!enabled}
        >
          <Send className="h-4 w-4 mr-2" />
          Send to {models.find(m => m.value === selectedModel)?.label}
        </Button>
      </CardContent>
    </Card>
  );
}