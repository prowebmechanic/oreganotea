// src/components/orga-note/MainWindow.tsx
'use client';
import React from 'react';
import NoteEditor from './NoteEditor';
import AiSummaryDisplay from './AiSummaryDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, FilePlus2 } from 'lucide-react'; 
import { saveAs } from 'file-saver';
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
  const { toast } = useToast();

  const handleSaveAsHtml = () => {
    if (!noteTitle.trim() && !noteContent.trim()) {
      toast({ title: "Cannot Create HTML", description: "Note title and content are empty. Add some content first.", variant: "destructive" });
      return;
    }
    const htmlTitle = noteTitle.trim() || "Untitled Note";
    // Basic HTML structure. For full app CSS, it would be more complex to inline or link.
    // This example inlines some basic styling.
    const htmlBodyContent = noteContent.split('\n').map(p => `<p>${p.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('\n');
    const htmlFullContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${htmlTitle.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</title>
        <style>
          /* Minimal styles from globals.css for demonstration. For full theme, link globals.css or transpile theme variables. */
          body { 
            font-family: var(--font-geist-sans, Arial, sans-serif); /* Assuming --font-geist-sans is globally available or fallback to Arial */
            margin: 20px; 
            line-height: 1.6; 
            background-color: hsl(var(--background)); /* Requires CSS variables to be defined or replaced with actual values */
            color: hsl(var(--foreground)); 
          }
          h1 { 
            color: hsl(var(--primary));  /* Requires CSS variables */
            font-size: 1.8em;
            margin-bottom: 1em;
          }
          p { 
            margin-bottom: 0.8em;
            font-size: 1em;
          }
        </style>
      </head>
      <body>
        <h1>${htmlTitle.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</h1>
        ${htmlBodyContent}
      </body>
      </html>
    `;
    const blob = new Blob([htmlFullContent], {type: 'text/html;charset=utf-8'});
    try {
        const safeFileName = htmlTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'note';
        saveAs(blob, `${safeFileName}.html`);
        toast({ title: "HTML File Saved", description: `"${safeFileName}.html" has been downloaded.` });
    } catch (error) {
        console.error("Error saving HTML file:", error);
        toast({ title: "Save HTML Failed", description: "An error occurred while trying to save the HTML file.", variant: "destructive"});
    }
  };


  return (
    <div className="bg-transparent p-2.5 h-full flex flex-col text-sm"> {/* Changed bg-background to bg-transparent */}
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
          {/* HTML Button removed as per latest request to put it in dropdown menu */}
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
