import type React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface ExpandSectionProps {
  onSummarize: () => void;
  isSummarizing: boolean;
}

const ExpandSection: React.FC<ExpandSectionProps> = ({ onSummarize, isSummarizing }) => {
  return (
    <div className="bg-black p-2.5 border border-white h-full flex flex-col">
      <div className="border border-white my-0.5 p-1.25 text-lg font-semibold">Expand</div>
      <div className="border border-white my-0.5 p-1.25 flex-grow flex items-center justify-center">
        <Button
          onClick={onSummarize}
          disabled={isSummarizing}
          className="bg-accent text-accent-foreground hover:bg-accent/90 w-full"
          aria-label="Summarize note with AI"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isSummarizing ? 'Summarizing...' : 'Summarize with AI'}
        </Button>
      </div>
    </div>
  );
};

export default ExpandSection;
