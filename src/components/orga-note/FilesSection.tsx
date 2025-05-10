// src/components/orga-note/FilesSection.tsx
'use client';
import type React from 'react';
import type { SavedNote } from '@/types/note';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FilePlus2, FileText, Trash2, Pencil } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";


interface FilesSectionProps {
  savedNotes: SavedNote[];
  onLoadNote: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
  onNewNote: () => void;
  onRenameNote: (noteId: string, newName: string) => void;
  activeNoteId: string | null;
}

const FilesSection: React.FC<FilesSectionProps> = ({
  savedNotes,
  onLoadNote,
  onDeleteNote,
  onNewNote,
  onRenameNote,
  activeNoteId,
}) => {
  const { toast } = useToast();

  const handleRename = (noteId: string) => {
    const currentNote = savedNotes.find(note => note.id === noteId);
    const newName = prompt("Enter new name for the note:", currentNote?.name);
    if (newName === null) return; // User cancelled
    if (newName.trim() !== "") {
      onRenameNote(noteId, newName.trim());
    } else {
      toast({ title: "Rename Cancelled", description: "Note name cannot be empty.", variant: "destructive" });
    }
  };

  return (
    <div className="bg-background p-2.5 border border-border h-full flex flex-col text-sm">
      <div className="flex justify-between items-center border border-border my-0.5 p-1.25">
        <span className="text-base font-semibold text-foreground">My Notes</span>
        <Button onClick={onNewNote} variant="outline" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 h-7 text-xs px-2 border-border">
          <FilePlus2 className="h-3 w-3 mr-1" /> New Note
        </Button>
      </div>
      <ScrollArea className="border border-border my-0.5 p-1.25 flex-grow">
        {savedNotes.length === 0 ? (
          <p className="text-muted-foreground text-center py-4 text-xs">No saved notes. Click "New Note" to start.</p>
        ) : (
          <ul className="space-y-1">
            {savedNotes.sort((a,b) => b.lastModified - a.lastModified).map(note => (
              <li
                key={note.id}
                className={`flex items-center justify-between p-1.5 border rounded-sm cursor-pointer hover:bg-secondary/70
                  ${note.id === activeNoteId ? 'bg-secondary border-primary ring-1 ring-primary' : 'border-border bg-card'}`}
              >
                <button
                  onClick={() => onLoadNote(note.id)}
                  className="flex items-center gap-1.5 flex-grow text-left overflow-hidden"
                  title={`Load: ${note.name}\nLast Modified: ${new Date(note.lastModified).toLocaleString()}`}
                >
                  <FileText className={`h-3 w-3 shrink-0 ${note.id === activeNoteId ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="truncate text-xs text-foreground">{note.name}</span>
                </button>
                <div className="flex items-center shrink-0">
                   <Button variant="ghost" size="icon" onClick={() => handleRename(note.id)} className="h-6 w-6 text-muted-foreground hover:text-primary">
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDeleteNote(note.id)} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
};

export default FilesSection;
