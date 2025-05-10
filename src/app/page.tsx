// src/app/page.tsx
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import LogoSection from '@/components/orga-note/LogoSection';
import CalendarSection from '@/components/orga-note/CalendarSection';
import MainWindow from '@/components/orga-note/MainWindow';
import NotesSection from '@/components/orga-note/NotesSection';
import ProjectFilesSection from '@/components/orga-note/ProjectFilesSection';
import LinksSection from '@/components/orga-note/LinksSection';

import { summarizeNote, type SummarizeNoteInput } from '@/ai/flows/summarize-note';
import { useToast } from "@/hooks/use-toast";
import type { SavedNote } from '@/types/note';
import { getSavedNotes, saveNotes as saveNotesToStorage } from '@/lib/localStorage';

export default function OreganotePage() {
  const [noteTitle, setNoteTitle] = useState<string>('');
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
        // Optionally load the first note or a default state
        // handleLoadNote(notesFromStorage[0].id); 
      } else {
        setNoteTitle('Untitled Note'); 
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
    if (!noteTitle.trim()) {
       toast({
        title: "Title Required",
        description: "Note title cannot be blank.",
        variant: "destructive",
      });
      return;
    }
    if (!noteContent.trim() && !activeNoteId) { 
      toast({
        title: "Empty Note",
        description: "Cannot save an empty new note without content. Add some content first.",
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
      noteToSave = { ...existingNote, name: noteTitle.trim(), content: noteContent, lastModified: Date.now() };
      setSavedNotes(prev => prev.map(n => n.id === activeNoteId ? noteToSave : n));
      toast({ title: "Note Updated", description: `"${noteToSave.name}" has been updated.` });
    } else {
      const newId = Date.now().toString();
      noteToSave = { id: newId, name: noteTitle.trim(), content: noteContent, lastModified: Date.now() };
      setSavedNotes(prev => [noteToSave, ...prev]);
      setActiveNoteId(newId); 
      toast({ title: "Note Saved", description: `"${noteToSave.name}" has been saved.` });
    }
  }, [activeNoteId, noteTitle, noteContent, savedNotes, toast]);

  const handleLoadNote = useCallback((noteId: string) => {
    const noteToLoad = savedNotes.find(n => n.id === noteId);
    if (noteToLoad) {
      setNoteTitle(noteToLoad.name);
      setNoteContent(noteToLoad.content);
      setActiveNoteId(noteId);
      setSummary(''); 
      setKeyTopics(''); 
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
      setNoteTitle('Untitled Note');
      setNoteContent('');
      setSummary('');
      setKeyTopics('');
    }
    toast({ title: "Note Deleted", description: `"${noteToDelete?.name || 'Note'}" has been deleted.` });
  }, [activeNoteId, savedNotes, toast]);

  const handleNewNote = useCallback(() => {
    setActiveNoteId(null);
    setNoteTitle('Untitled Note'); 
    setNoteContent('');
    setSummary('');
    setKeyTopics('');
    toast({ title: "New Note Ready", description: "Editor cleared for a new note." });
  }, [toast]);

  const handleRenameNote = useCallback((noteId: string, newName: string) => {
    if(!newName.trim()){
      toast({ title: "Rename Cancelled", description: "Note name cannot be empty.", variant: "destructive" });
      return;
    }
    setSavedNotes(prev => prev.map(n => n.id === noteId ? {...n, name: newName.trim(), lastModified: Date.now()} : n));
    if(activeNoteId === noteId) {
      setNoteTitle(newName.trim()); 
    }
    toast({ title: "Note Renamed", description: `Note renamed to "${newName.trim()}".` });
  }, [toast, activeNoteId]);

  const handleMakeHtml = () => toast({ title: "Make HTML", description: "Functionality to convert note to HTML coming soon!" });
  const handleSaveToDrive = () => toast({ title: "Save to Drive", description: "Functionality to save to Google Drive coming soon!" });
  const handleSendShare = () => toast({ title: "Send & Share", description: "Functionality to send or share note coming soon!" });
  const handleUploadFile = () => toast({ title: "Upload File", description: "File upload functionality coming soon!" });


  return (
    <div 
      className="h-screen w-screen grid 
                 grid-cols-[250px_1fr_300px] 
                 grid-rows-[auto_1fr_auto] 
                 gap-0.5 bg-background text-foreground overflow-hidden"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      {/* Row 1: Logo, Editor Title part of MainWindow, Calendar */}
      <div className="col-start-1 row-start-1">
        <LogoSection 
          onSummarize={handleSummarize} 
          isSummarizing={isSummarizing}
          onMakeHtml={handleMakeHtml}
          onSaveToDrive={handleSaveToDrive}
          onSendShare={handleSendShare}
        />
      </div>
      
      <div className="col-start-2 row-start-1 row-span-2 flex flex-col min-h-0">
        <MainWindow
          noteTitle={noteTitle}
          setNoteTitle={setNoteTitle}
          noteContent={noteContent}
          setNoteContent={setNoteContent}
          summary={summary}
          keyTopics={keyTopics}
          isSummarizing={isSummarizing}
          onSaveCurrentNote={handleSaveCurrentNote}
          onNewNote={handleNewNote}
        />
      </div>
      
      <div className="col-start-3 row-start-1 flex flex-col min-h-0">
        <CalendarSection />
      </div>
      
      {/* Row 2: Project Files, Editor Content part of MainWindow, ToDo List */}
      <div className="col-start-1 row-start-2 flex flex-col min-h-0">
         <ProjectFilesSection 
            savedNotes={savedNotes} 
            onLoadNote={handleLoadNote}
            onDeleteNote={handleDeleteNote}
            onRenameNote={handleRenameNote}
            activeNoteId={activeNoteId}
            onUploadFile={handleUploadFile}
          />
      </div>
       <div className="col-start-3 row-start-2 flex flex-col min-h-0">
        <NotesSection />
      </div>
      
      {/* Row 3: Links Section */}
      <div className="col-start-1 col-span-3 row-start-3">
        <LinksSection />
      </div>
    </div>
  );
}
