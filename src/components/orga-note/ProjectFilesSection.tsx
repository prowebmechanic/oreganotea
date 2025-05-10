// src/components/orga-note/ProjectFilesSection.tsx
'use client';
import type React from 'react';
import type { SavedNote } from '@/types/note';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FileText, Eye } from 'lucide-react';

interface ProjectFilesSectionProps {
  savedNotes: SavedNote[];
  onLoadNote: (noteId: string) => void;
}

const ProjectFilesSection: React.FC<ProjectFilesSectionProps> = ({ savedNotes, onLoadNote }) => {
  return (
    <div className="bg-background p-2.5 border border-border h-full flex flex-col text-sm">
      <div className="border border-border my-0.5 p-1.25 text-lg font-semibold text-foreground">Project Files</div>
      <ScrollArea className="border border-border my-0.5 p-1.25 flex-grow">
        {savedNotes.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No saved notes to display here yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {savedNotes.sort((a,b) => b.lastModified - a.lastModified).map(note => (
              <Card 
                key={note.id} 
                className="bg-card border-border hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onLoadNote(note.id)}
                data-ai-hint="document paper"
              >
                <CardHeader className="p-3">
                  <CardTitle className="text-base text-primary flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    <span className="truncate" title={note.name}>{note.name}</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Last Modified: {new Date(note.lastModified).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-xs text-foreground line-clamp-3 h-12 overflow-hidden">
                    {note.content || "No content preview."}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 w-full text-xs h-7 border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                    onClick={(e) => { e.stopPropagation(); onLoadNote(note.id); }}
                  >
                    <Eye className="mr-1 h-3 w-3" /> View Note
                  </Button>
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
