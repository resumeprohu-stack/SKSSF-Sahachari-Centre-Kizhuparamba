'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Lightbulb, Loader2 } from 'lucide-react';
import type { Item, SmartInsight } from '@/lib/types';
import { fetchSmartInsights } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SmartStatusProps {
  items: Item[];
}

export function SmartStatus({ items }: SmartStatusProps) {
  const [insights, setInsights] = useState<SmartInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetInsights = async () => {
    setIsLoading(true);
    setError(null);
    setInsights([]);

    const formattedItems = items.map(item => ({
        itemName: item.name,
        status: item.status,
        issuedTo: item.issuedTo,
        issueDate: item.issueDate,
        expectedReturnDate: item.expectedReturnDate,
        actualReturnDate: item.actualReturnDate,
    }));

    const result = await fetchSmartInsights({ items: formattedItems });
    
    if(result.error) {
        setError(result.error);
    } else if (result.insights) {
        setInsights(result.insights);
    }
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl font-headline">
              <Lightbulb className="h-6 w-6 text-accent" />
              Smart Status Insights
            </CardTitle>
            <CardDescription className="mt-2">
              Use AI to identify overdue items, approaching deadlines, and other potential issues.
            </CardDescription>
          </div>
          <Button onClick={handleGetInsights} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Get Smart Insights'
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
             <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {!isLoading && !error && insights.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p>Click the button to generate insights about your inventory.</p>
          </div>
        )}
        {insights.length > 0 && (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <Alert key={index}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{insight.item}: <span className='font-normal'>{insight.issue}</span></AlertTitle>
                <AlertDescription>
                  <strong>Suggestion:</strong> {insight.suggestedAction}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
        {isLoading && (
            <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Generating AI insights...</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
