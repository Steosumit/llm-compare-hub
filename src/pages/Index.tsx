import { useState } from "react";
import { Toolbar } from "@/components/Toolbar";
import { PromptCard } from "@/components/PromptCard";
import { EvaluationPanel } from "@/components/EvaluationPanel";
import { SettingsDialog } from "@/components/SettingsDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PromptCardData {
  id: string;
  prompt: string;
  patternType?: string;
}

interface Response {
  id: string;
  model: string;
  prompt: string;
  response: string;
  timestamp: Date;
  status: 'pending' | 'success' | 'error';
}

const Index = () => {
  const [promptCards, setPromptCards] = useState<PromptCardData[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const addPromptCard = (patternType?: string) => {
    const newCard: PromptCardData = {
      id: `card-${Date.now()}-${Math.random()}`,
      prompt: "",
      patternType,
    };
    setPromptCards(prev => [...prev, newCard]);
  };

  const deletePromptCard = (id: string) => {
    setPromptCards(prev => prev.filter(card => card.id !== id));
  };

  const handleSendPrompt = (cardId: string, prompt: string, model: string) => {
    const newResponse: Response = {
      id: `response-${Date.now()}-${Math.random()}`,
      model,
      prompt,
      response: "",
      timestamp: new Date(),
      status: 'pending'
    };

    setResponses(prev => [newResponse, ...prev]);

    // Simulate API call
    setTimeout(() => {
      setResponses(prev => prev.map(resp => 
        resp.id === newResponse.id 
          ? { 
              ...resp, 
              status: 'success' as const,
              response: `This is a simulated response from ${model} for the prompt: "${prompt.substring(0, 50)}..."\n\nTo enable real responses, configure your API tokens in Settings.`
            }
          : resp
      ));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-panel">
      <Toolbar 
        onAddPromptPattern={addPromptCard}
        onSettingsClick={() => setSettingsOpen(true)}
      />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Prompt Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Prompt Cards</h2>
              <Button
                onClick={() => addPromptCard()}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Card
              </Button>
            </div>

            {promptCards.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="mb-4">No prompt cards yet.</p>
                <p className="text-sm">Use the toolbar above to add prompt patterns or click "Add Card" to create a blank prompt.</p>
              </div>
            ) : (
              promptCards.map(card => (
                <PromptCard
                  key={card.id}
                  id={card.id}
                  initialPrompt={card.prompt}
                  patternType={card.patternType}
                  onDelete={deletePromptCard}
                  onSend={handleSendPrompt}
                />
              ))
            )}
          </div>

          {/* Right Panel - Evaluation */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Evaluation & Responses</h2>
            <EvaluationPanel responses={responses} />
          </div>
        </div>
      </div>

      <SettingsDialog 
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
    </div>
  );
};

export default Index;
