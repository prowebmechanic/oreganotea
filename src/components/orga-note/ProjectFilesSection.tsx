// src/components/orga-note/ProjectFilesSection.tsx
'use client';
import type React from 'react';
import type { SavedNote } from '@/types/note';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FileText, Eye, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ProjectFilesSectionProps {
  savedNotes: SavedNote[];
  onLoadNote: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
  onRenameNote: (noteId: string, newName: string) => void; // Kept for type consistency, but UI trigger removed
  activeNoteId: string | null;
  onUploadFile: () => void;
}

const ProjectFilesSection: React.FC<ProjectFilesSectionProps> = ({ 
  savedNotes, 
  onLoadNote,
  onDeleteNote,
  // onRenameNote, // Rename functionality trigger removed
  activeNoteId,
  onUploadFile
}) => {
  const { toast } = useToast();
  
  return (
    <div className="bg-background p-2.5 border-x border-b border-border h-full flex flex-col text-sm">
      <div className="my-0.5 p-1.25 flex justify-between items-center"> {/* Removed border here */}
        <span className="text-lg font-semibold text-primary">Project Files</span>
        <Button onClick={onUploadFile} variant="outline" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 h-7 text-xs px-2 border-border">
          <PlusCircle className="h-3 w-3 mr-1" /> Upload
        </Button>
      </div>
      <ScrollArea className="my-0.5 p-1.25 flex-grow"> {/* Removed border here, ScrollArea handles its own look */}
        {savedNotes.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No saved notes to display here yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2"> 
            {savedNotes.sort((a,b) => b.lastModified - a.lastModified).map(note => (
              <Card 
                key={note.id} 
                className={`bg-card border hover:shadow-lg transition-shadow flex flex-col ${note.id === activeNoteId ? 'border-primary ring-1 ring-primary' : 'border-border'}`}
                data-ai-hint="document paper"
              >
                <CardHeader className="p-2 flex flex-row items-center justify-between">
                  <div onClick={() => onLoadNote(note.id)} className="cursor-pointer flex-grow overflow-hidden">
                    <CardTitle className="text-sm text-primary flex items-center">
                      <FileText className="mr-1.5 h-4 w-4 shrink-0" />
                      <span className="truncate" title={note.name}>{note.name}</span>
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-0.5">
                      Mod: {new Date(note.lastModified).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center shrink-0 ml-1 space-x-0.5">
                     <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onLoadNote(note.id);}} className="h-6 w-6 text-muted-foreground hover:text-primary" title="View Note">
                      <Eye className="h-3 w-3" />
                    </Button>
                    {/* Pencil (Rename) button removed as per request */}
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id);}} className="h-6 w-6 text-muted-foreground hover:text-destructive" title="Delete Note">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-2 pt-0 flex-grow cursor-pointer" onClick={() => onLoadNote(note.id)}>
                  <p className="text-xs text-foreground line-clamp-3 h-10 overflow-hidden"> 
                    {note.content || "No content preview."}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ProjectFilesSection;
