// src/components/orga-note/ProjectFilesSection.tsx
'use client';
import type React from 'react';
import type { SavedNote } from '@/types/note';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'; 
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Eye, PlusCircle, Trash2 } from 'lucide-react'; 

interface ProjectFilesSectionProps {
  savedNotes: SavedNote[];
  onLoadNote: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
  onRenameNote: (noteId: string, newName: string) => void; 
  activeNoteId: string | null;
  onUploadFile: () => void;
}

const ProjectFilesSection: React.FC<ProjectFilesSectionProps> = ({ 
  savedNotes, 
  onLoadNote,
  onDeleteNote,
  // onRenameNote, // Rename functionality UI trigger removed
  activeNoteId,
  onUploadFile
}) => {
  
  return (
    <div className="bg-transparent p-2.5 h-full flex flex-col text-sm"> 
      <div className="my-0.5 p-1.25 flex justify-between items-center">
        <span className="text-lg font-semibold text-primary">Project Files</span>
        <Button onClick={onUploadFile} variant="outline" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 h-7 text-xs px-2">
          <PlusCircle className="h-3 w-3 mr-1" /> Upload
        </Button>
      </div>
      <ScrollArea className="my-0.5 p-1.25 flex-grow">
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
                <CardHeader className="p-2 cursor-pointer" onClick={() => onLoadNote(note.id)}>
                  <CardTitle className="text-base font-semibold text-primary"> 
                    <span className="flex-1 min-w-0 truncate block" title={note.name}> 
                      {note.name}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 flex-grow cursor-pointer" onClick={() => onLoadNote(note.id)}>
                  <p className="text-xs text-foreground line-clamp-3 h-10 overflow-hidden"> 
                    {note.content || "No content preview."}
                  </p>
                </CardContent>
                <CardFooter className="p-2 pt-1 flex justify-end items-center space-x-1 border-t border-border/50 mt-auto">
                   <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onLoadNote(note.id);}} className="h-7 w-7 text-muted-foreground hover:text-primary" title="View Note">
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id);}} className="h-7 w-7 text-muted-foreground hover:text-destructive" title="Delete Note">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ProjectFilesSection;
