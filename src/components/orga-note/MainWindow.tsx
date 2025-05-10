'use client';
import type React from 'react';
import NoteEditor from './NoteEditor';
import AiSummaryDisplay from './AiSummaryDisplay';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";


interface MainWindowProps {
  noteContent: string;
  setNoteContent: (content: string) => void;
  summary: string;
  keyTopics: string;
  isSummarizing: boolean;
}

const MainWindow: React.FC<MainWindowProps> = ({
  noteContent,
  setNoteContent,
  summary,
  keyTopics,
  isSummarizing,
}) => {
  const { toast } = useToast();

  const handleSaveNote = () => {
    if (!noteContent.trim()) {
      toast({
        title: "Empty Note",
        description: "Cannot save an empty note.",
        variant: "destructive",
      });
      return;
    }
    try {
      const blob = new Blob([noteContent], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const defaultFileName = `OrgaNote-${new Date().toISOString().slice(0,10)}.txt`;
      const fileName = prompt("Enter file name (e.g., my-note.txt):", defaultFileName);
      
      if (fileName) {
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        toast({
          title: "Note Saved",
          description: `Note saved as ${fileName}.`,
        });
      }
    } catch (error) {
      console.error("Failed to save note:", error);
      toast({
        title: "Error Saving Note",
        description: "There was an issue saving your note.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-black p-2.5 border border-white h-full flex flex-col">
      <div className="border border-white my-0.5 p-1.25 text-lg font-semibold">Note Editor & Summary</div>
      <div className="border border-white my-0.5 p-1.25 flex-grow flex flex-col min-h-0">
        <NoteEditor noteContent={noteContent} setNoteContent={setNoteContent} />
        <Button 
          onClick={handleSaveNote} 
          className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90 self-start"
          aria-label="Save note"
        >
          <Save className="mr-2 h-4 w-4" /> Save Note
        </Button>
        <div className="mt-2 overflow-y-auto">
          <AiSummaryDisplay summary={summary} keyTopics={keyTopics} isLoading={isSummarizing} />
        </div>
      </div>
      {/* <div className="border border-white my-0.5 p-1.25">Calendar Full View (Placeholder)</div> */}
    </div>
  );
};

export default MainWindow;
