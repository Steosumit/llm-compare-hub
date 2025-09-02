import { useState } from "react";
import { Toolbar } from "@/components/Toolbar";
import { PromptCard } from "@/components/PromptCard";
import { EvaluationPanel } from "@/components/EvaluationPanel";
import { SettingsDialog } from "@/components/SettingsDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Send } from "lucide-react";

interface PromptCardData {
  id: string;
  prompt: string;
  patternType?: string;
  enabled: boolean;
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
      enabled: true,
    };
    setPromptCards(prev => [...prev, newCard]);
  };

  const deletePromptCard = (id: string) => {
    setPromptCards(prev => prev.filter(card => card.id !== id));
  };

  const handleEnableToggle = (id: string, enabled: boolean) => {
    setPromptCards(prev => prev.map(card => 
      card.id === id 
        ? { ...card, enabled }
        : card
    ));
  };

  const handleSendPrompt = (cardId: string, prompt: string, model: string) => {
    // Check if the card is enabled before sending
    const card = promptCards.find(c => c.id === cardId);
    if (!card?.enabled) {
      return; // Don't send if card is disabled
    }

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

  const handleSendAllPrompts = () => {
    // Only send enabled cards with valid prompts
    const validCards = promptCards.filter(card => card.enabled && card.prompt.trim());
    
    if (validCards.length === 0) {
      return;
    }

    validCards.forEach((card, index) => {
      setTimeout(() => {
        const newResponse: Response = {
          id: `response-${Date.now()}-${Math.random()}-${index}`,
          model: 'gpt-4', // Default model for batch sending
          prompt: card.prompt,
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
                  response: `[Batch Response] This is a simulated response from GPT-4 for connected prompt: "${card.prompt.substring(0, 50)}..."\n\nTo enable real responses, configure your API tokens in Settings.`
                }
              : resp
          ));
        }, 1500 + (index * 500)); // Stagger responses
      }, index * 200); // Stagger requests
    });
  };

  return (
    <div className="min-h-screen bg-panel">
      <Toolbar
        onAddPromptPattern={addPromptCard}
        onSettingsClick={() => setSettingsOpen(true)}
      />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[80vh]">
          {/* Left Panel - Prompt Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Prompt Cards</h2>
              <div className="flex items-center gap-2">
                {promptCards.length > 1 && (
                  <Button
                    onClick={handleSendAllPrompts}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Send All
                  </Button>
                )}
                <Button
                  onClick={() => addPromptCard()}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Card
                </Button>
              </div>
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
                  enabled={card.enabled}
                  onDelete={deletePromptCard}
                  onSend={handleSendPrompt}
                  onEnableToggle={handleEnableToggle}
                />
              ))
            )}
          </div>

          {/* Right Panel - Evaluation */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Evaluation & Responses</h2>
            <Tabs defaultValue="responses" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="responses">Responses</TabsTrigger>
                <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
              </TabsList>
              <TabsContent value="responses" className="mt-4">
                <EvaluationPanel responses={responses} />
              </TabsContent>
              <TabsContent value="evaluation" className="mt-4">
                <div className="space-y-4">
                  {responses.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="mb-2">Evaluation Matrix</p>
                      <p className="text-sm">Compare and analyze responses side by side</p>
                      <p className="text-xs mt-2">Send some prompts to see evaluation options</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-lg font-medium mb-2">Evaluation Matrix</h3>
                        <p className="text-sm text-muted-foreground">Compare responses across different models and criteria</p>
                      </div>
                      
                      {/* Evaluation Matrix Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-border">
                          <thead>
                            <tr className="bg-muted/50">
                              <th className="border border-border p-3 text-left font-medium">Model</th>
                              <th className="border border-border p-3 text-left font-medium">Prompt</th>
                              <th className="border border-border p-3 text-left font-medium">Status</th>
                              <th className="border border-border p-3 text-left font-medium">Quality</th>
                              <th className="border border-border p-3 text-left font-medium">Speed</th>
                              <th className="border border-border p-3 text-left font-medium">Accuracy</th>
                              <th className="border border-border p-3 text-left font-medium">Overall</th>
                            </tr>
                          </thead>
                          <tbody>
                            {responses.map((response, index) => (
                              <tr key={response.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                                <td className="border border-border p-3">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{response.model}</span>
                                  </div>
                                </td>
                                <td className="border border-border p-3">
                                  <div className="max-w-xs">
                                    <p className="text-sm truncate" title={response.prompt}>
                                      {response.prompt.substring(0, 50)}...
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {response.timestamp.toLocaleTimeString()}
                                    </p>
                                  </div>
                                </td>
                                <td className="border border-border p-3">
                                  {response.status === 'pending' ? (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                                      Generating...
                                    </span>
                                  ) : response.status === 'success' ? (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                      ✓ Complete
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                      ✗ Error
                                    </span>
                                  )}
                                </td>
                                <td className="border border-border p-3">
                                  {response.status === 'success' ? (
                                    <div className="flex items-center gap-1">
                                      <div className="w-16 bg-muted rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{width: `${Math.floor(Math.random() * 40) + 60}%`}}></div>
                                      </div>
                                      <span className="text-xs text-muted-foreground">{Math.floor(Math.random() * 40) + 60}%</span>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">-</span>
                                  )}
                                </td>
                                <td className="border border-border p-3">
                                  {response.status === 'success' ? (
                                    <div className="flex items-center gap-1">
                                      <div className="w-16 bg-muted rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{width: `${Math.floor(Math.random() * 30) + 70}%`}}></div>
                                      </div>
                                      <span className="text-xs text-muted-foreground">{Math.floor(Math.random() * 30) + 70}%</span>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">-</span>
                                  )}
                                </td>
                                <td className="border border-border p-3">
                                  {response.status === 'success' ? (
                                    <div className="flex items-center gap-1">
                                      <div className="w-16 bg-muted rounded-full h-2">
                                        <div className="bg-purple-500 h-2 rounded-full" style={{width: `${Math.floor(Math.random() * 35) + 65}%`}}></div>
                                      </div>
                                      <span className="text-xs text-muted-foreground">{Math.floor(Math.random() * 35) + 65}%</span>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">-</span>
                                  )}
                                </td>
                                <td className="border border-border p-3">
                                  {response.status === 'success' ? (
                                    <div className="flex items-center gap-2">
                                      <div className="w-16 bg-muted rounded-full h-2">
                                        <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full" style={{width: `${Math.floor(Math.random() * 25) + 75}%`}}></div>
                                      </div>
                                      <span className="text-sm font-medium">{Math.floor(Math.random() * 25) + 75}%</span>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">-</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Summary Section */}
                      {responses.filter(r => r.status === 'success').length > 1 && (
                        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-medium mb-3">Summary Insights</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Best Overall:</span>
                              <p className="font-medium">{responses.find(r => r.status === 'success')?.model || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Fastest Response:</span>
                              <p className="font-medium">{responses.find(r => r.status === 'success')?.model || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Total Responses:</span>
                              <p className="font-medium">{responses.length}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
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
