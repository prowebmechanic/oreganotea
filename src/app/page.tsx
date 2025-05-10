// src/app/page.tsx
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import LogoSection from '@/components/orga-note/LogoSection';
import CalendarSection from '@/components/orga-note/CalendarSection';
import MainWindow from '@/components/orga-note/MainWindow';
import NotesSection from '@/components/orga-note/NotesSection';
import ProjectFilesSection from '@/components/orga-note/ProjectFilesSection';
import LinksSection from '@/components/orga-note/LinksSection';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


import { summarizeNote, type SummarizeNoteInput } from '@/ai/flows/summarize-note';
import { saveToDrive, type SaveToDriveInput } from '@/ai/flows/save-to-drive';
import { useToast } from "@/hooks/use-toast";
import type { SavedNote, Task, LinkItem } from '@/types/note';
import { 
  getSavedNotes, saveNotes as saveNotesToStorage,
  getDailyCalendarNotes, saveDailyCalendarNotes,
  getTasks, saveTasks,
  getLinks, saveLinks,
  clearAllOreganoteData
} from '@/lib/localStorage';
import { saveAs } from 'file-saver';
import { formatISO } from 'date-fns';

export default function OreganotePage() {
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [keyTopics, setKeyTopics] = useState<string>('');
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [isSavingToDrive, setIsSavingToDrive] = useState<boolean>(false);
  
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  
  // Lifted states
  const [dailyNotes, setDailyNotes] = useState<Record<string, string>>({});
  const [tasks, setTasks] = useState<Task[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);

  const [isClient, setIsClient] = useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      setSavedNotes(getSavedNotes());
      setDailyNotes(getDailyCalendarNotes());
      setTasks(getTasks());
      setLinks(getLinks());

      const notesFromStorage = getSavedNotes();
      if (notesFromStorage.length > 0) {
        // Optionally load the first note or a default state
        // handleLoadNote(notesFromStorage[0].id); 
      } else {
        setNoteTitle('Untitled Note'); 
      }
    }
  }, []);

  // Effects to save lifted states to localStorage
  useEffect(() => { if (isClient) saveNotesToStorage(savedNotes); }, [savedNotes, isClient]);
  useEffect(() => { if (isClient) saveDailyCalendarNotes(dailyNotes); }, [dailyNotes, isClient]);
  useEffect(() => { if (isClient) saveTasks(tasks); }, [tasks, isClient]);
  useEffect(() => { if (isClient) saveLinks(links); }, [links, isClient]);


  const handleSummarize = useCallback(async () => {
    if (!noteContent.trim()) {
      toast({ title: "Empty Note", description: "Cannot summarize an empty note.", variant: "destructive" });
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
      toast({ title: "Summarization Complete", description: "Note has been summarized successfully." });
    } catch (error) {
      console.error('Error summarizing note:', error);
      toast({ title: "Summarization Failed", description: "An error occurred while summarizing the note.", variant: "destructive" });
      setSummary('Error: Could not generate summary.');
      setKeyTopics('Error');
    } finally {
      setIsSummarizing(false);
    }
  }, [noteContent, toast]);

  const handleSaveCurrentNote = useCallback(() => {
    if (!noteTitle.trim()) {
       toast({ title: "Title Required", description: "Note title cannot be blank.", variant: "destructive" });
      return;
    }
    if (!noteContent.trim() && !activeNoteId) { 
      toast({ title: "Empty Note", description: "Cannot save an empty new note without content. Add some content first.", variant: "destructive" });
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

  const handleNewEditorNote = useCallback(() => { // Renamed from handleNewNote
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
  
  const handleMakeHtml = useCallback(() => {
    if (!noteTitle.trim() && !noteContent.trim()) {
      toast({ title: "Cannot Create HTML", description: "Note title and content are empty. Add some content first.", variant: "destructive" });
      return;
    }
    const htmlTitle = noteTitle.trim() || "Untitled Note";
    const htmlBodyContent = noteContent.split('\n').map(p => `<p>${p.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('\n');
    const htmlFullContent = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${htmlTitle.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</title><style>body { font-family: var(--font-geist-sans, Arial, sans-serif); margin: 20px; line-height: 1.6; background-color: hsl(var(--background)); color: hsl(var(--foreground));} h1 { color: hsl(var(--primary)); font-size: 1.8em; margin-bottom: 1em;} p { margin-bottom: 0.8em; font-size: 1em;}</style></head><body><h1>${htmlTitle.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</h1>${htmlBodyContent}</body></html>`;
    const blob = new Blob([htmlFullContent], { type: 'text/html;charset=utf-8' });
    try {
      const safeFileName = htmlTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'note';
      saveAs(blob, `${safeFileName}.html`);
      toast({ title: "HTML File Saved", description: `"${safeFileName}.html" has been downloaded.` });
    } catch (error) {
      console.error("Error saving HTML file:", error);
      toast({ title: "Save HTML Failed", description: "An error occurred while trying to save the HTML file.", variant: "destructive" });
    }
  }, [noteTitle, noteContent, toast]);
  
  const handleSaveToDrive = useCallback(async () => {
    if (!noteTitle.trim() && !noteContent.trim()) {
      toast({ title: "Empty Note", description: "Cannot save an empty note to Drive. Add a title or content.", variant: "destructive" });
      return;
    }
    setIsSavingToDrive(true);
    try {
      const placeholderAccessToken = 'YOUR_GOOGLE_OAUTH_ACCESS_TOKEN'; 
      if (placeholderAccessToken === 'YOUR_GOOGLE_OAUTH_ACCESS_TOKEN') {
         toast({ title: "Authentication Required", description: "Google Drive integration requires authentication. Please implement OAuth2 flow.", variant: "destructive", duration: 7000 });
        setIsSavingToDrive(false);
        return; 
      }
      const input: SaveToDriveInput = { noteTitle: noteTitle || 'Untitled Oreganote', noteContent, accessToken: placeholderAccessToken };
      const result = await saveToDrive(input);
      toast({ title: "Saved to Google Drive", description: `Note "${result.fileName}" saved. File ID: ${result.fileId}. ${result.webViewLink ? `View: ${result.webViewLink}` : ''}`, duration: 7000, action: result.webViewLink ? (<a href={result.webViewLink} target="_blank" rel="noopener noreferrer" className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">Open in Drive</a>) : undefined });
    } catch (error: any) {
      console.error('Error saving note to Google Drive:', error);
      toast({ title: "Save to Drive Failed", description: error.message || "An error occurred while saving the note to Google Drive.", variant: "destructive", duration: 7000 });
    } finally {
      setIsSavingToDrive(false);
    }
  }, [noteTitle, noteContent, toast]);

  // Handlers for lifted state (Daily Notes)
  const handleSaveDailyNote = useCallback((date: Date, noteText: string) => {
    const dateISO = formatISO(date, { representation: 'date' });
    setDailyNotes(prev => ({ ...prev, [dateISO]: noteText }));
  }, []);

  const handleDeleteDailyNote = useCallback((date: Date) => {
    const dateISO = formatISO(date, { representation: 'date' });
    setDailyNotes(prev => {
      const newNotes = { ...prev };
      delete newNotes[dateISO];
      return newNotes;
    });
  }, []);

  // Handlers for lifted state (Tasks)
  const handleAddTask = useCallback((text: string) => {
    const newTask: Task = { id: Date.now().toString(), text, completed: false };
    setTasks(prev => [newTask, ...prev]);
  }, []);

  const handleToggleTask = useCallback((taskId: string) => {
    setTasks(prev => prev.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task));
  }, []);

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  // Handlers for lifted state (Links)
  const handleSaveLink = useCallback((name: string, url: string, id?: string) => {
    if (id) {
      setLinks(prev => prev.map(link => link.id === id ? { ...link, name, url } : link));
    } else {
      const newLink: LinkItem = { id: Date.now().toString(), name, url };
      setLinks(prev => [newLink, ...prev]);
    }
  }, []);

  const handleDeleteLink = useCallback((linkId: string) => {
    setLinks(prev => prev.filter(link => link.id !== linkId));
  }, []);

  // Export Project Data
  const handleExportProjectData = useCallback(() => {
    const projectData = {
      version: "1.0.0",
      createdAt: new Date().toISOString(),
      savedNotes,
      dailyCalendarNotes: dailyNotes,
      tasks,
      links,
    };
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json;charset=utf-8' });
    try {
      saveAs(blob, 'oreganote-project-data.json');
      toast({ title: "Project Data Exported", description: "All project data has been saved to 'oreganote-project-data.json'." });
    } catch (error) {
      console.error("Error exporting project data:", error);
      toast({ title: "Export Failed", description: "An error occurred while exporting project data.", variant: "destructive" });
    }
  }, [savedNotes, dailyNotes, tasks, links, toast]);
  
  const handleImportProjectData = useCallback(() => {
    toast({ title: "Import Project Data", description: "Functionality to import project data coming soon!" });
  }, [toast]);

  // New Project
  const handleNewProjectConfirm = useCallback(() => {
    // Reset all states
    setNoteTitle('Untitled Note');
    setNoteContent('');
    setSummary('');
    setKeyTopics('');
    setActiveNoteId(null);
    setSavedNotes([]);
    setDailyNotes({});
    setTasks([]);
    setLinks([]);

    // Clear localStorage
    clearAllOreganoteData();
    
    setShowNewProjectDialog(false);
    toast({ title: "New Project Created", description: "All data has been reset to a blank slate." });
  }, [toast]);


  const handleSendShare = () => toast({ title: "Send & Share", description: "Functionality to send or share note coming soon!" });
  const handleUploadFile = () => toast({ title: "Upload File", description: "File upload functionality coming soon!" });


  return (
    <div 
      className="h-screen w-screen grid 
                 grid-cols-[250px_1fr_300px] 
                 grid-rows-[auto_1fr_auto_auto] 
                 gap-0.5 bg-background text-foreground overflow-hidden"
      style={{ fontFamily: 'var(--font-geist-sans), Arial, sans-serif' }}
    >
      {/* Column 1: Logo, Calendar */}
      <div className="col-start-1 row-start-1 bg-secondary">
        <LogoSection 
          onSummarize={handleSummarize} 
          isSummarizing={isSummarizing}
          onMakeHtml={handleMakeHtml}
          onSaveToDrive={isSavingToDrive ? () => {} : handleSaveToDrive}
          isSavingToDrive={isSavingToDrive}
          onSendShare={handleSendShare}
          onExportProjectData={handleExportProjectData}
          onImportProjectData={handleImportProjectData}
          onNewProject={() => setShowNewProjectDialog(true)}
        />
      </div>
      <div className="col-start-1 row-start-2 row-span-2 flex flex-col min-h-0 bg-light-blue">
        <CalendarSection 
          dailyNotes={dailyNotes}
          onSaveDailyNote={handleSaveDailyNote}
          onDeleteDailyNote={handleDeleteDailyNote}
        />
      </div>
      
      {/* Column 2: Main Note Editor Window */}
      <div className="col-start-2 row-start-1 row-span-3 flex flex-col min-h-0 bg-secondary">
        <MainWindow
          noteTitle={noteTitle}
          setNoteTitle={setNoteTitle}
          noteContent={noteContent}
          setNoteContent={setNoteContent}
          summary={summary}
          keyTopics={keyTopics}
          isSummarizing={isSummarizing}
          onSaveCurrentNote={handleSaveCurrentNote}
          onNewNote={handleNewEditorNote} 
        />
      </div>
      
      {/* Column 3: Project Files (top), ToDo (bottom) */}
      <div className="col-start-3 row-start-1 row-span-3 flex flex-col min-h-0 bg-light-blue">
         <ProjectFilesSection 
            savedNotes={savedNotes} 
            onLoadNote={handleLoadNote}
            onDeleteNote={handleDeleteNote}
            onRenameNote={handleRenameNote} 
            activeNoteId={activeNoteId}
            onUploadFile={handleUploadFile}
          />
      </div>
      <div className="col-start-3 row-start-4 flex flex-col min-h-0 bg-light-blue">
        <NotesSection 
          tasks={tasks}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
        /> 
      </div>
      
      {/* Bottom Row: Links Section - Spanning C1 and C2 */}
      <div className="col-start-1 col-span-2 row-start-4 bg-secondary"> 
        <LinksSection 
          links={links}
          onSaveLink={handleSaveLink}
          onDeleteLink={handleDeleteLink}
        />
      </div>

      {/* New Project Confirmation Dialog */}
      <AlertDialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will erase all current project data (notes, calendar entries, tasks, links) and start a new blank project. 
              This cannot be undone. Make sure you have saved or exported your current project data if you wish to keep it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowNewProjectDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleNewProjectConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Yes, Create New Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
