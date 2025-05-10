// src/components/orga-note/MainWindow.tsx
'use client';
import type React from 'react';
import NoteEditor from './NoteEditor';
import AiSummaryDisplay from './AiSummaryDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, FilePlus2 } from 'lucide-react'; 

interface MainWindowProps {
  noteTitle: string;
  setNoteTitle: (title: string) => void;
  noteContent: string;
  setNoteContent: (content: string) => void;
  summary: string;
  keyTopics: string;
  isSummarizing: boolean;
  onSaveCurrentNote: () => void; 
  onNewNote: () => void; 
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
  onNewNote,
}) => {

  return (
    <div className="bg-background p-2.5 h-full flex flex-col text-sm">
      <div className="my-0.5 p-1.25 text-base font-semibold text-primary flex justify-between items-center">
        <span>Note Editor</span>
        <div className="flex items-center gap-1.5">
          <Button 
            onClick={onNewNote} 
            variant="outline"
            className="text-foreground hover:bg-accent hover:text-accent-foreground h-7 text-xs px-2"
            aria-label="New note"
            title="New Note"
          >
            <FilePlus2 className="mr-1 h-3 w-3" /> New
          </Button>
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
      <div className="my-0.5 p-1.25">
        <Input 
          type="text"
          placeholder="Enter note title here..."
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          className="w-full bg-input text-foreground text-sm h-8"
          aria-label="Note title"
        />
      </div>
      <div className="my-0.5 p-1.25 flex-grow flex flex-col min-h-0">
        <NoteEditor noteContent={noteContent} setNoteContent={setNoteContent} />
        <div className="mt-2 overflow-y-auto"> {/* This div will scroll if AiSummaryDisplay overflows */}
          <AiSummaryDisplay summary={summary} keyTopics={keyTopics} isLoading={isSummarizing} />
        </div>
      </div>
    </div>
  );
};

export default MainWindow;
