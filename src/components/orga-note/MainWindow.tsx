// src/components/orga-note/MainWindow.tsx
'use client';
import type React from 'react';
import NoteEditor from './NoteEditor';
import AiSummaryDisplay from './AiSummaryDisplay';
import { Button } from '@/components/ui/button';
import { Save, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface MainWindowProps {
  noteContent: string;
  setNoteContent: (content: string) => void;
  summary: string;
  keyTopics: string;
  isSummarizing: boolean;
  onSaveCurrentNote: () => void; // Changed from specific save logic
  activeNoteName?: string | null; // To display current note name if available
}

const MainWindow: React.FC<MainWindowProps> = ({
  noteContent,
  setNoteContent,
  summary,
  keyTopics,
  isSummarizing,
  onSaveCurrentNote,
  activeNoteName,
}) => {
  const { toast } = useToast();

  const handleDownloadNote = () => {
     if (!noteContent.trim()) {
      toast({
        title: "Empty Note",
        description: "Cannot download an empty note.",
        variant: "destructive",
      });
      return;
    }
    try {
      const blob = new Blob([noteContent], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const defaultFileName = activeNoteName || `OrgaNote-${new Date().toISOString().slice(0,10)}.txt`;
      // Use a simpler default if activeNoteName is complex or has invalid characters for a filename
      const safeDefaultFileName = defaultFileName.replace(/[<>:"/\\|?*]+/g, '_') || `note.txt`;
      const fileName = prompt("Enter file name for download (e.g., my-note.txt):", safeDefaultFileName);
      
      if (fileName) {
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        toast({
          title: "Note Downloaded",
          description: `Note downloaded as ${fileName}.`,
        });
      }
    } catch (error) {
      console.error("Failed to download note:", error);
      toast({
        title: "Error Downloading Note",
        description: "There was an issue downloading your note.",
        variant: "destructive",
      });
    }
  };


  return (
    <div className="bg-black p-2.5 border border border-white h-full flex flex-col text-sm">
      <div className="border border-white my-0.5 p-1.25 text-base font-semibold flex justify-between items-center">
        <span>Note Editor {activeNoteName ? `(${activeNoteName})` : ''}</span>
        <div>
          <Button 
            onClick={onSaveCurrentNote} 
            className="bg-accent text-accent-foreground hover:bg-accent/90 h-7 text-xs px-2 mr-1"
            aria-label="Save note to local storage"
            title="Save to Local Storage"
          >
            <Save className="mr-1 h-3 w-3" /> Save
          </Button>
          <Button 
            onClick={handleDownloadNote} 
            variant="outline"
            className="bg-gray-600 text-white hover:bg-gray-500 h-7 text-xs px-2"
            aria-label="Download note as .txt file"
            title="Download as .txt"
          >
            <Download className="mr-1 h-3 w-3" /> Download
          </Button>
        </div>
      </div>
      <div className="border border-white my-0.5 p-1.25 flex-grow flex flex-col min-h-0">
        <NoteEditor noteContent={noteContent} setNoteContent={setNoteContent} />
        <div className="mt-2 overflow-y-auto">
          <AiSummaryDisplay summary={summary} keyTopics={keyTopics} isLoading={isSummarizing} />
        </div>
      </div>
    </div>
  );
};

export default MainWindow;
