import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Trash2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PromptCardProps {
  id: string;
  initialPrompt?: string;
  patternType?: string;
  onDelete: (id: string) => void;
  onSend: (id: string, prompt: string, model: string) => void;
}

const models = [
  { value: "gpt-4", label: "GPT-4" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "gemini-pro", label: "Gemini Pro" },
  { value: "claude-3", label: "Claude 3" },
];

const patternTemplates = {
  cot: "Think step by step to solve this problem:\n\n",
  meta: "Please generate a prompt that would help me:\n\n",
  persona: "You are a [ROLE]. Your task is to:\n\n",
  template: "Given [INPUT], please [ACTION] and provide [OUTPUT]:\n\n",
  refinement: "Help me refine this question to get better results:\n\n",
  alternatives: "Provide 3 different approaches to:\n\n",
};

export function PromptCard({ id, initialPrompt, patternType, onDelete, onSend }: PromptCardProps) {
  const [prompt, setPrompt] = useState(
    initialPrompt || (patternType ? patternTemplates[patternType as keyof typeof patternTemplates] : "")
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
    <Card className="mb-4 transition-shadow duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
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
              <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                {patternType.toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
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
        />
        
        <Button onClick={handleSend} className="w-full">
          <Send className="h-4 w-4 mr-2" />
          Send to {models.find(m => m.value === selectedModel)?.label}
        </Button>
      </CardContent>
    </Card>
  );
}