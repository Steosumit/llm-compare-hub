import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Response {
  id: string;
  model: string;
  prompt: string;
  response: string;
  timestamp: Date;
  status: 'pending' | 'success' | 'error';
}

interface EvaluationPanelProps {
  responses: Response[];
}

export function EvaluationPanel({ responses }: EvaluationPanelProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-success text-white';
      case 'error': return 'bg-destructive text-destructive-foreground';
      case 'pending': return 'bg-warning text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      {/* Evaluation Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Evaluation Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="font-medium">Model</div>
            <div className="font-medium">Status</div>
            <div className="font-medium">Response Time</div>
            <div className="font-medium">Quality Score</div>
            
            {responses.map((response) => (
              <div key={response.id} className="contents">
                <div className="py-2">{response.model}</div>
                <div className="py-2">
                  <Badge className={getStatusColor(response.status)}>
                    {response.status}
                  </Badge>
                </div>
                <div className="py-2 text-muted-foreground">
                  {response.status === 'success' ? '1.2s' : '-'}
                </div>
                <div className="py-2 text-muted-foreground">
                  {response.status === 'success' ? 'TBD' : '-'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Responses */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-lg">Responses</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <div className="p-6 space-y-4">
              {responses.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No responses yet. Send a prompt to get started.
                </div>
              ) : (
                responses.map((response) => (
                  <div key={response.id} className="border-b border-border pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{response.model}</Badge>
                        <Badge className={getStatusColor(response.status)}>
                          {response.status}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {response.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      <strong>Prompt:</strong> {response.prompt}
                    </div>
                    
                    {response.status === 'success' && (
                      <div className="text-sm bg-muted/50 rounded p-3">
                        {response.response}
                      </div>
                    )}
                    
                    {response.status === 'error' && (
                      <div className="text-sm text-destructive bg-destructive/10 rounded p-3">
                        Error: Failed to get response from {response.model}
                      </div>
                    )}
                    
                    {response.status === 'pending' && (
                      <div className="text-sm text-muted-foreground bg-muted/50 rounded p-3">
                        Waiting for response...
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}