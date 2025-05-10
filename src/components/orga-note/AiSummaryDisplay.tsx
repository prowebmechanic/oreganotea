import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface AiSummaryDisplayProps {
  summary: string;
  keyTopics: string;
  isLoading: boolean;
}

const AiSummaryDisplay: React.FC<AiSummaryDisplayProps> = ({ summary, keyTopics, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700 mt-4">
        <CardHeader>
          <CardTitle className="text-accent">AI Summary</CardTitle>
        </CardHeader>
        <CardContent className="text-white space-y-4">
          <div>
            <h4 className="font-semibold mb-1">Summary:</h4>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </div>
          <div>
            <h4 className="font-semibold mb-1">Key Topics:</h4>
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summary && !keyTopics) {
    return null; // Don't display if no summary and not loading
  }

  return (
    <Card className="bg-gray-800 border-gray-700 mt-4">
      <CardHeader>
        <CardTitle className="text-accent">AI Summary</CardTitle>
      </CardHeader>
      <CardContent className="text-white space-y-2">
        {summary && (
          <div>
            <h4 className="font-semibold mb-1">Summary:</h4>
            <p className="text-sm whitespace-pre-wrap">{summary}</p>
          </div>
        )}
        {keyTopics && (
          <div>
            <h4 className="font-semibold mb-1">Key Topics:</h4>
            <p className="text-sm">{keyTopics}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AiSummaryDisplay;
