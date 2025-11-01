import { Button } from "@/components/ui/button";
import { Settings, Copy, CheckCircle2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PatternType, patternNames } from "@/lib/patternTemplates";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ToolbarProps {
  onAddPromptPattern: (pattern: PatternType) => void;
  onSettingsClick: () => void;
  sessionId?: string;
}

export function Toolbar({ onAddPromptPattern, onSettingsClick, sessionId }: ToolbarProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopySessionId = async () => {
    if (sessionId) {
      try {
        await navigator.clipboard.writeText(sessionId);
        setCopied(true);
        toast({
          title: "Session ID Copied",
          description: "Session ID has been copied to clipboard.",
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast({
          title: "Failed to copy",
          description: "Could not copy session ID to clipboard.",
          variant: "destructive",
        });
      }
    }
  };

  // Group patterns by category
  const patternGroups = {
    "Basic Patterns": ["cot", "meta", "persona", "template", "refinement", "alternatives"] as PatternType[],
    "Requirements": ["requirementsSimulator", "specificationDisambiguation"] as PatternType[],
    "System Design": ["apiGenerator", "apiSimulator", "fewShotCodeExampleGeneration", "dslCreation", "architecturalPossibilities", "changeRequestSimulation"] as PatternType[],
    "Code Quality": ["codeClustering", "intermediateAbstraction", "principledCode", "hiddenAssumptions"] as PatternType[],
    "Refactoring": ["pseudoCodeRefactoring", "dataGuidedRefactoring"] as PatternType[],
  };

  return (
    <div className="bg-toolbar border-b border-border p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold text-foreground mr-6">
            Prompt Comparison Tool
          </h1>
          
          <div className="flex flex-wrap gap-2">
            {/* Quick access to basic patterns */}
            {patternGroups["Basic Patterns"].map((key) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                onClick={() => onAddPromptPattern(key)}
                className="text-sm"
              >
                {patternNames[key]}
              </Button>
            ))}

            {/* Dropdown for advanced patterns */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-sm">
                  Developer Patterns <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {Object.entries(patternGroups).slice(1).map(([category, patterns]) => (
                  <div key={category}>
                    <DropdownMenuLabel>{category}</DropdownMenuLabel>
                    {patterns.map((key) => (
                      <DropdownMenuItem
                        key={key}
                        onClick={() => onAddPromptPattern(key)}
                      >
                        {patternNames[key]}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSettingsClick}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          
          {sessionId && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-md border border-border">
              <span className="text-xs text-muted-foreground font-medium">Session:</span>
              <code className="text-xs font-mono bg-background px-2 py-0.5 rounded border border-border">
                {sessionId.substring(0, 8)}...{sessionId.substring(sessionId.length - 4)}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopySessionId}
                className="h-6 w-6 p-0 hover:bg-accent"
                title="Copy full session ID"
              >
                {copied ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}