// src/app/page.tsx
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import LogoSection from '@/components/orga-note/LogoSection';
import FilesSection from '@/components/orga-note/FilesSection';
import CalendarSection from '@/components/orga-note/CalendarSection';
import MainWindow from '@/components/orga-note/MainWindow';
import NotesSection from '@/components/orga-note/NotesSection';
import ExpandSection from '@/components/orga-note/ExpandSection';
// AppFilesSection and TraySection are removed
import SidebarRight from '@/components/orga-note/SidebarRight';
import Footer from '@/components/orga-note/Footer';
import UploadSection from '@/components/orga-note/UploadSection';


import { summarizeNote, type SummarizeNoteInput } from '@/ai/flows/summarize-note';
import { useToast } from "@/hooks/use-toast";
import type { SavedNote } from '@/types/note';
import { getSavedNotes, saveNotes as saveNotesToStorage } from '@/lib/localStorage';

export default function OrgaNotePage() {
  const [noteContent, setNoteContent] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [keyTopics, setKeyTopics] = useState<string>('');
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const notesFromStorage = getSavedNotes();
      setSavedNotes(notesFromStorage);
      if (notesFromStorage.length > 0) {
        // Optionally load the most recent note or leave blank
        // handleLoadNote(notesFromStorage[0].id); 
      }
    }
  }, []);

  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      saveNotesToStorage(savedNotes);
    }
  }, [savedNotes, isClient]);

  const handleSummarize = useCallback(async () => {
    if (!noteContent.trim()) {
      toast({
        title: "Empty Note",
        description: "Cannot summarize an empty note.",
        variant: "destructive",
      });
      return;
    }
    setIsSummarizing(true);
    setSummary('');
    setKeyTopics('');
    try {
      const input: SummarizeNoteInput = { noteContent };
      const result = await summarizeNote(input);
      setSummary(result.summary);
      setKeyTopics(result.keyTopics);
      toast({
        title: "Summarization Complete",
        description: "Note has been summarized successfully.",
      });
    } catch (error) {
      console.error('Error summarizing note:', error);
      toast({
        title: "Summarization Failed",
        description: "An error occurred while summarizing the note.",
        variant: "destructive",
      });
      setSummary('Error: Could not generate summary.');
      setKeyTopics('Error');
    } finally {
      setIsSummarizing(false);
    }
  }, [noteContent, toast]);

  const handleSaveCurrentNote = useCallback(() => {
    if (!noteContent.trim() && !activeNoteId) { // Don't save completely empty new notes
      toast({
        title: "Empty Note",
        description: "Cannot save an empty new note. Add some content first.",
        variant: "destructive",
      });
      return;
    }

    let noteToSave: SavedNote;
    if (activeNoteId) {
      const existingNote = savedNotes.find(n => n.id === activeNoteId);
      if (!existingNote) {
        toast({ title: "Error", description: "Could not find active note to save.", variant: "destructive" });
        return;
      }
      noteToSave = { ...existingNote, content: noteContent, lastModified: Date.now() };
      setSavedNotes(prev => prev.map(n => n.id === activeNoteId ? noteToSave : n));
      toast({ title: "Note Updated", description: `"${noteToSave.name}" has been updated.` });
    } else {
      const noteName = prompt("Enter a name for your new note:", `Note ${new Date().toLocaleDateString()}`);
      if (!noteName || noteName.trim() === "") {
        toast({ title: "Save Cancelled", description: "Note name cannot be empty.", variant: "destructive" });
        return;
      }
      const newId = Date.now().toString();
      noteToSave = { id: newId, name: noteName.trim(), content: noteContent, lastModified: Date.now() };
      setSavedNotes(prev => [noteToSave, ...prev]);
      setActiveNoteId(newId);
      toast({ title: "Note Saved", description: `"${noteToSave.name}" has been saved.` });
    }
  }, [activeNoteId, noteContent, savedNotes, toast]);

  const handleLoadNote = useCallback((noteId: string) => {
    const noteToLoad = savedNotes.find(n => n.id === noteId);
    if (noteToLoad) {
      setNoteContent(noteToLoad.content);
      setActiveNoteId(noteId);
      setSummary(''); // Clear previous summary
      setKeyTopics(''); // Clear previous key topics
      toast({ title: "Note Loaded", description: `"${noteToLoad.name}" is now active.` });
    } else {
      toast({ title: "Error", description: "Could not load the selected note.", variant: "destructive" });
    }
  }, [savedNotes, toast]);

  const handleDeleteNote = useCallback((noteId: string) => {
    if (!confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
      return;
    }
    const noteToDelete = savedNotes.find(n => n.id === noteId);
    setSavedNotes(prev => prev.filter(n => n.id !== noteId));
    if (activeNoteId === noteId) {
      setActiveNoteId(null);
      setNoteContent('');
      setSummary('');
      setKeyTopics('');
    }
    toast({ title: "Note Deleted", description: `"${noteToDelete?.name || 'Note'}" has been deleted.` });
  }, [activeNoteId, savedNotes, toast]);

  const handleNewNote = useCallback(() => {
    setActiveNoteId(null);
    setNoteContent('');
    setSummary('');
    setKeyTopics('');
    toast({ title: "New Note Ready", description: "Editor cleared for a new note." });
  }, [toast]);

  const handleRenameNote = useCallback((noteId: string, newName: string) => {
    setSavedNotes(prev => prev.map(n => n.id === noteId ? {...n, name: newName, lastModified: Date.now()} : n));
    toast({ title: "Note Renamed", description: `Note renamed to "${newName}".` });
  }, [toast]);

  const activeNoteName = activeNoteId ? savedNotes.find(n => n.id === activeNoteId)?.name : null;

  return (
    <div 
      className="h-screen w-screen grid 
                 grid-cols-[1fr_3fr_1fr_0.5fr] 
                 grid-rows-[auto_auto_1fr_1fr_1fr_auto] 
                 gap-0.5 bg-black text-white font-['Arial',_sans-serif] overflow-hidden"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      {/* Row 1 */}
      <div className="col-start-1 row-start-1"><LogoSection /></div>
      <div className="col-start-2 row-start-1"><CalendarSection /></div>
      <div className="col-start-3 row-start-1"><NotesSection /></div> {/* ToDo List */}
      <div className="col-start-4 row-start-1"><UploadSection /></div>


      {/* Row 2 */}
      <div className="col-start-1 row-start-2 row-span-4 min-h-0">
        <FilesSection
          savedNotes={savedNotes}
          onLoadNote={handleLoadNote}
          onDeleteNote={handleDeleteNote}
          onNewNote={handleNewNote}
          onRenameNote={handleRenameNote}
          activeNoteId={activeNoteId}
        />
      </div>
      <div className="col-start-2 row-start-2 row-span-4 min-h-0">
        <MainWindow
          noteContent={noteContent}
          setNoteContent={setNoteContent}
          summary={summary}
          keyTopics={keyTopics}
          isSummarizing={isSummarizing}
          onSaveCurrentNote={handleSaveCurrentNote}
          activeNoteName={activeNoteName}
        />
      </div>
      <div className="col-start-3 row-start-2"><ExpandSection onSummarize={handleSummarize} isSummarizing={isSummarizing} /></div>
      <div className="col-start-4 row-start-2 row-span-4 min-h-0"><SidebarRight /></div>
      
      {/* Row 3: AppFilesSection removed, this cell in col 3 is now empty */}
      {/* Row 4: TraySection removed, this cell in col 3 is now empty */}
      
      {/* Row 6 / Footer */}
      <div className="col-start-1 col-span-4 row-start-6"><Footer /></div>
    </div>
  );
}
