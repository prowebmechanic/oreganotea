import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface NoteEditorProps {
  noteContent: string;
  setNoteContent: (content: string) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ noteContent, setNoteContent }) => {
  return (
    <Textarea
      placeholder="Start typing your note here..."
      value={noteContent}
      onChange={(e) => setNoteContent(e.target.value)}
      className="w-full flex-grow min-h-[200px] bg-input text-foreground border-border focus:ring-ring focus:border-ring resize-none text-base"
      aria-label="Note editor"
    />
  );
};

export default NoteEditor;
