import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface ToolbarProps {
  onAddPromptPattern: (pattern: string) => void;
  onSettingsClick: () => void;
}

const promptPatterns = [
  { name: "Chain of Thought", key: "cot" },
  { name: "Meta Language Generation", key: "meta" },
  { name: "Persona Pattern", key: "persona" },
  { name: "Template Pattern", key: "template" },
  { name: "Question Refinement", key: "refinement" },
  { name: "Alternative Approaches", key: "alternatives" },
];

export function Toolbar({ onAddPromptPattern, onSettingsClick }: ToolbarProps) {
  return (
    <div className="bg-toolbar border-b border-border p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold text-foreground mr-6">
            Prompt Comparison Tool
          </h1>
          
          <div className="flex flex-wrap gap-2">
            {promptPatterns.map((pattern) => (
              <Button
                key={pattern.key}
                variant="outline"
                size="sm"
                onClick={() => onAddPromptPattern(pattern.key)}
                className="text-sm"
              >
                {pattern.name}
              </Button>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onSettingsClick}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
}