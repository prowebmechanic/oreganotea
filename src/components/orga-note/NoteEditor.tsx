import type React from 'react';
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
      className="w-full h-full min-h-[200px] bg-gray-800 text-white border-gray-700 focus:ring-accent focus:border-accent resize-none text-base"
      aria-label="Note editor"
    />
  );
};

export default NoteEditor;
