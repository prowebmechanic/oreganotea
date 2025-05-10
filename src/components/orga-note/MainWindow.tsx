// src/components/orga-note/MainWindow.tsx
'use client';
import type React from 'react';
import NoteEditor from './NoteEditor';
import AiSummaryDisplay from './AiSummaryDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface MainWindowProps {
  noteTitle: string;
  setNoteTitle: (title: string) => void;
  noteContent: string;
  setNoteContent: (content: string) => void;
  summary: string;
  keyTopics: string;
  isSummarizing: boolean;
  onSaveCurrentNote: () => void; 
  activeNoteName?: string | null; 
}

const MainWindow: React.FC<MainWindowProps> = ({
  noteTitle,
  setNoteTitle,
  noteContent,
  setNoteContent,
  summary,
  keyTopics,
  isSummarizing,
  onSaveCurrentNote,
  activeNoteName, // This can be used to show if the note is saved with this name
}) => {
  const { toast } = useToast();

  // Title for display, prefers current input if available, otherwise activeNoteName
  const displayTitle = activeNoteName ? `(${activeNoteName})` : '(New Note)';

  return (
    <div className="bg-background p-2.5 border border-border h-full flex flex-col text-sm">
      <div className="border border-border my-0.5 p-1.25 text-base font-semibold text-foreground flex justify-between items-center">
        <span>Note Editor {displayTitle}</span>
        <div>
          <Button 
            onClick={onSaveCurrentNote} 
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-7 text-xs px-2"
            aria-label="Save note"
            title="Save Note"
          >
            <Save className="mr-1 h-3 w-3" /> Save
          </Button>
        </div>
      </div>
      <div className="my-0.5 p-1.25 border border-border">
        <Input 
          type="text"
          placeholder="Enter note title here..."
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          className="w-full bg-input border-border text-foreground text-sm h-8"
          aria-label="Note title"
        />
      </div>
      <div className="border border-border my-0.5 p-1.25 flex-grow flex flex-col min-h-0">
        <NoteEditor noteContent={noteContent} setNoteContent={setNoteContent} />
        <div className="mt-2 overflow-y-auto">
          <AiSummaryDisplay summary={summary} keyTopics={keyTopics} isLoading={isSummarizing} />
        </div>
      </div>
    </div>
  );
};

export default MainWindow;
