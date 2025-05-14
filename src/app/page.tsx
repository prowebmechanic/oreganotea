// src/app/page.tsx
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import LogoSection from '@/components/orga-note/LogoSection';
import CalendarSection from '@/components/orga-note/CalendarSection';
import MainWindow from '@/components/orga-note/MainWindow';
import NotesSection from '@/components/orga-note/NotesSection';
import ProjectFilesSection from '@/components/orga-note/ProjectFilesSection';
import LinksSection from '@/components/orga-note/LinksSection';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';


import { summarizeNote, type SummarizeNoteInput } from '@/ai/flows/summarize-note';
import { saveToDrive, type SaveToDriveInput } from '@/ai/flows/save-to-drive';
import { rewriteNote, type RewriteNoteInput } from '@/ai/flows/rewrite-note'; 
import { useToast } from "@/hooks/use-toast";
// import html2pdf from 'html2pdf.js'; // Removed static import, will use dynamic import
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
  const [isRewritingAI, setIsRewritingAI] = useState<boolean>(false);
  
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  
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
        // handleLoadNote(notesFromStorage[0].id); 
      } else {
        // setNoteTitle(''); 
      }
    }
  }, []);

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

  const handleRewriteNoteAI = useCallback(async () => {
    if (!noteContent.trim()) {
      toast({ title: "Empty Note", description: "Cannot rewrite an empty note.", variant: "destructive" });
      return;
    }
    setIsRewritingAI(true);
    try {
      const input: RewriteNoteInput = { noteContent }; 
      const result = await rewriteNote(input);
      setNoteContent(result.rewrittenContent); 
      toast({ title: "Rewrite Complete", description: "Note has been rewritten." });
    } catch (error: any) {
      console.error('Error rewriting note:', error);
      toast({ title: "Rewrite Failed", description: error.message || "An error occurred while rewriting the note.", variant: "destructive" });
    } finally {
      setIsRewritingAI(false);
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
      setNoteTitle(''); 
      setNoteContent('');
      setSummary('');
      setKeyTopics('');
    }
    toast({ title: "Note Deleted", description: `"${noteToDelete?.name || 'Note'}" has been deleted.` });
  }, [activeNoteId, savedNotes, toast]);

  const handleNewEditorNote = useCallback(() => { 
    setActiveNoteId(null);
    setNoteTitle(''); 
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
  
  const handleSaveProjectAsHtml = useCallback(() => {
    if (savedNotes.length === 0 && Object.keys(dailyNotes).length === 0 && tasks.length === 0 && links.length === 0) {
      toast({ title: "No Data to Export", description: "There is no data to export to HTML.", variant: "destructive" });
      return;
    }
  
    let allContent = '';
  
    if (savedNotes.length > 0) {
      allContent += '<h1>Project Notes</h1>';
      savedNotes.forEach(note => {
        allContent += `<article><h2>${note.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</h2>`;
        allContent += note.content.split('\n').map(p => `<p>${p.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('\n');
        allContent += '</article><hr>';
      });
    }
  
    const dailyNoteKeys = Object.keys(dailyNotes).sort();
    if (dailyNoteKeys.length > 0) {
      allContent += '<h1>Daily Calendar Notes</h1><section>';
      dailyNoteKeys.forEach(date => {
        allContent += `<div><h3>${date}</h3>`;
        allContent += dailyNotes[date].split('\n').map(p => `<p>${p.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('\n');
        allContent += '</div>';
      });
      allContent += '</section><hr>';
    }
  
    if (tasks.length > 0) {
      allContent += '<h1>ToDo List</h1><ul>';
      tasks.forEach(task => {
        allContent += `<li${task.completed ? ' style="text-decoration: line-through; color: #888;"' : ''}>${task.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</li>`;
      });
      allContent += '</ul><hr>';
    }
  
    if (links.length > 0) {
      allContent += '<h1>Quick Links</h1><ul>';
      links.forEach(link => {
        allContent += `<li><a href="${link.url.replace(/"/g, '&quot;')}" target="_blank">${link.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</a></li>`;
      });
      allContent += '</ul>';
    }
  
    const htmlFullContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Oreganotéa Project Export</title>
        <style>
          body { font-family: var(--font-geist-sans, Arial, sans-serif); margin: 20px; line-height: 1.6; background-color: hsl(var(--background, 0 0% 100%)); color: hsl(var(--foreground, 0 0% 0%)); } 
          h1 { font-size: 1.8em; margin-top: 1em; margin-bottom: 0.5em; color: hsl(var(--primary, 221 83% 53%)); }
          h2 { font-size: 1.4em; margin-bottom: 0.3em; color: hsl(var(--primary, 221 83% 53%)); }
          h3 { font-size: 1.1em; margin-bottom: 0.2em; color: hsl(var(--primary, 221 83% 53%)); }
          p { margin-bottom: 0.8em; font-size: 1em; }
          hr { margin: 2em 0; border: 0; border-top: 1px solid hsl(var(--border, 0 0% 13%)); } 
          ul { list-style-type: disc; margin-left: 20px; }
          article, section > div { margin-bottom: 1em; padding: 0.5em; border: 1px solid hsl(var(--border, 0 0% 13%)); border-radius: var(--radius, 0.5rem); } 
        </style>
      </head>
      <body>
        <header><h1>Oreganotéa Project Export - ${new Date().toLocaleDateString()}</h1></header>
        <main>${allContent}</main>
      </body>
      </html>`;
    const blob = new Blob([htmlFullContent], { type: 'text/html;charset=utf-8' });
    try {
      saveAs(blob, 'oreganotea-project-export.html');
      toast({ title: "HTML Export Complete", description: "Project data exported to 'oreganotea-project-export.html'." });
    } catch (error) {
      console.error("Error saving HTML file:", error);
      toast({ title: "Save HTML Failed", description: "An error occurred while trying to save the HTML file.", variant: "destructive" });
    }
  }, [savedNotes, dailyNotes, tasks, links, toast]);

  const handleSaveCurrentNoteAsHtml = useCallback(() => {
    if (!noteTitle.trim() && !noteContent.trim()) {
      toast({ title: "Cannot Create HTML", description: "Note title and content are empty. Add some content first.", variant: "destructive" });
      return;
    }
    const htmlTitle = noteTitle.trim() || "Untitled Note";
    const htmlBodyContent = noteContent.split('\n').map(p => `<p>${p.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('\n');
    const htmlFullContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${htmlTitle.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</title>
        <style>
          body { font-family: var(--font-geist-sans, Arial, sans-serif); margin: 20px; line-height: 1.6; background-color: hsl(var(--background)); color: hsl(var(--foreground)); }
          h1 { color: hsl(var(--primary)); font-size: 1.8em; margin-bottom: 1em; }
          p { margin-bottom: 0.8em; font-size: 1em; }
        </style>
      </head>
      <body>
        <h1>${htmlTitle.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</h1>
        ${htmlBodyContent}
      </body>
      </html>
    `;
    const blob = new Blob([htmlFullContent], { type: 'text/html;charset=utf-8' });
    try {
        const safeFileName = htmlTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'note';
        saveAs(blob, `${safeFileName}.html`);
        toast({ title: "Note HTML Saved", description: `"${safeFileName}.html" has been downloaded.` });
    } catch (error) {
        console.error("Error saving note HTML file:", error);
        toast({ title: "Save Note HTML Failed", description: "An error occurred while trying to save the note HTML file.", variant: "destructive"});
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
      const input: SaveToDriveInput = { noteTitle: noteTitle || 'Untitled Oreganotéa Note', noteContent, accessToken: placeholderAccessToken };
      const result = await saveToDrive(input);
      toast({ title: "Saved to Google Drive", description: `Note "${result.fileName}" saved. File ID: ${result.fileId}. ${result.webViewLink ? `View: ${result.webViewLink}` : ''}`, duration: 7000, action: result.webViewLink ? (<a href={result.webViewLink} target="_blank" rel="noopener noreferrer" className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">Open in Drive</a>) : undefined });
    } catch (error: any) {
      console.error('Error saving note to Google Drive:', error);
      toast({ title: "Save to Drive Failed", description: error.message || "An error occurred while saving the note to Google Drive.", variant: "destructive", duration: 7000 });
    } finally {
      setIsSavingToDrive(false);
    }
  }, [noteTitle, noteContent, toast]);

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

  const handleExportProjectData = useCallback(() => {
    const projectData = {
      version: "1.0.0",
      createdAt: new Date().toISOString(),
      appName: "Oreganotéa",
      savedNotes,
      dailyCalendarNotes: dailyNotes,
      tasks,
      links,
    };
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json;charset=utf-8' });
    try {
      saveAs(blob, 'oreganotea-project-data.json');
      toast({ title: "Project Data Exported", description: "All project data has been saved to 'oreganotea-project-data.json'." });
    } catch (error) {
      console.error("Error exporting project data:", error);
      toast({ title: "Export Failed", description: "An error occurred while exporting project data.", variant: "destructive" });
    }
  }, [savedNotes, dailyNotes, tasks, links, toast]);
  
  const handleImportProjectData = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const fileContent = await file.text();
          const importedData = JSON.parse(fileContent);

          if (importedData.appName !== "Oreganotéa" || !importedData.savedNotes || !importedData.dailyCalendarNotes || !importedData.tasks || !importedData.links) {
            throw new Error("Invalid project data file format.");
          }
          
          if (!confirm("Importing this file will overwrite current project data. Are you sure?")) {
            return;
          }

          setSavedNotes(importedData.savedNotes || []);
          setDailyNotes(importedData.dailyCalendarNotes || {});
          setTasks(importedData.tasks || []);
          setLinks(importedData.links || []);
          setActiveNoteId(null);
          setNoteTitle(''); 
          setNoteContent('');
          setSummary('');
          setKeyTopics('');

          toast({ title: "Project Data Imported", description: "Project data has been successfully imported." });
        } catch (error: any) {
          console.error("Error importing project data:", error);
          toast({ title: "Import Failed", description: `Error: ${error.message || "Could not parse or load the project file."}`, variant: "destructive" });
        }
      }
    };
    input.click();
  }, [toast]);

  const handleSaveProjectAsText = useCallback(() => {
    if (savedNotes.length === 0 && Object.keys(dailyNotes).length === 0 && tasks.length === 0 && links.length === 0) {
      toast({ title: "No Data to Export", description: "There is no data to export as text.", variant: "destructive" });
      return;
    }

    let textContent = `Oreganotéa Project Export - ${new Date().toLocaleString()}\n\n`;

    if (savedNotes.length > 0) {
      textContent += '### PROJECT NOTES ###\n\n';
      savedNotes.forEach(note => {
        textContent += `Title: ${note.name}\nContent:\n${note.content}\n---\n\n`;
      });
    }

    const dailyNoteKeys = Object.keys(dailyNotes).sort();
    if (dailyNoteKeys.length > 0) {
      textContent += '### DAILY CALENDAR NOTES ###\n\n';
      dailyNoteKeys.forEach(date => {
        textContent += `Date: ${date}\nNote:\n${dailyNotes[date]}\n---\n\n`;
      });
    }

    if (tasks.length > 0) {
      textContent += '### TODO LIST ###\n\n';
      tasks.forEach(task => {
        textContent += `[${task.completed ? 'x' : ' '}] ${task.text}\n`;
      });
      textContent += '\n---\n\n';
    }

    if (links.length > 0) {
      textContent += '### QUICK LINKS ###\n\n';
      links.forEach(link => {
        textContent += `${link.name}: ${link.url}\n`;
      });
    }

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    try {
      saveAs(blob, 'oreganotea-project-export.txt');
      toast({ title: "Text Export Complete", description: "Project data exported to 'oreganotea-project-export.txt'." });
    } catch (error) {
      console.error("Error saving text file:", error);
      toast({ title: "Save Text Failed", description: "An error occurred while trying to save the text file.", variant: "destructive" });
    }
  }, [savedNotes, dailyNotes, tasks, links, toast]);

  const handleExportProjectAsPdf = useCallback(async () => {
    if (typeof window === 'undefined') {
        toast({ title: "Environment Error", description: "PDF export can only be done in the browser.", variant: "destructive" });
        return;
    }
    if (savedNotes.length === 0 && Object.keys(dailyNotes).length === 0 && tasks.length === 0 && links.length === 0) {
      toast({ title: "No Data to Export", description: "There is no data to export as PDF.", variant: "destructive" });
      return;
    }
  
    let allContent = '';
  
    if (savedNotes.length > 0) {
      allContent += '<h1>Project Notes</h1>';
      savedNotes.forEach(note => {
        allContent += `<article><h2>${note.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</h2>`;
        allContent += note.content.split('\n').map(p => `<p>${p.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('\n');
        allContent += '</article>';
      });
    }
  
    const dailyNoteKeys = Object.keys(dailyNotes).sort();
    if (dailyNoteKeys.length > 0) {
      allContent += '<h1>Daily Calendar Notes</h1><section class="calendar-notes-section">';
      dailyNoteKeys.forEach(date => {
        allContent += `<div class="calendar-note-item"><h3>${date}</h3>`;
        allContent += dailyNotes[date].split('\n').map(p => `<p>${p.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('\n');
        allContent += '</div>';
      });
      allContent += '</section>';
    }
  
    if (tasks.length > 0) {
      allContent += '<h1>ToDo List</h1><ul class="todo-list">';
      tasks.forEach(task => {
        allContent += `<li${task.completed ? ' class="completed"' : ''}>${task.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</li>`;
      });
      allContent += '</ul>';
    }
  
    if (links.length > 0) {
      allContent += '<h1>Quick Links</h1><ul class="quick-links-list">';
      links.forEach(link => {
        allContent += `<li><a href="${link.url.replace(/"/g, '&quot;')}" target="_blank">${link.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</a></li>`;
      });
      allContent += '</ul>';
    }
  
    const pdfContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Oreganotéa Project Export</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.5; color: #000; background-color: #fff; } 
          h1 { font-size: 20px; margin-top: 15px; margin-bottom: 8px; color: hsl(var(--primary-pdf, 221 83% 53%)); border-bottom: 1px solid #eee; padding-bottom: 4px;} 
          h2 { font-size: 16px; margin-bottom: 5px; color: hsl(var(--primary-pdf, 221 83% 53%)); } 
          h3 { font-size: 14px; margin-bottom: 3px; color: #333; }
          p { margin-bottom: 8px; font-size: 12px; white-space: pre-wrap; }
          hr { margin: 25px 0; border: 0; border-top: 1px solid #ccc; }
          ul { list-style-type: disc; margin-left: 20px; padding-left: 0; font-size: 12px; }
          li { margin-bottom: 4px; }
          li.completed { text-decoration: line-through; color: #888; }
          a { color: hsl(var(--accent-pdf, 30 100% 50%)); text-decoration: none; } 
          a:hover { text-decoration: underline; }
          article, .calendar-notes-section, .todo-list, .quick-links-list { margin-bottom: 20px; }
          article, .calendar-note-item { padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-bottom:10px; background-color: #f9f9f9;}
          .calendar-notes-section { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
          header { text-align: center; margin-bottom: 20px; }
          /* Define HSL variables for PDF if they are different from the main theme or for fallback */
          :root {
            --primary-pdf: 221 83% 53%; /* Default Dark Blue */
            --accent-pdf: 30 100% 50%; /* Default Orange */
          }
        </style>
      </head>
      <body>
        <header><h1>Oreganotéa Project Export - ${new Date().toLocaleDateString()}</h1></header>
        <main>${allContent}</main>
      </body>
      </html>`;
  
    const element = document.createElement('div');
    element.innerHTML = pdfContent;

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      html2pdf()
        .from(element)
        .set({
          margin: [10, 10, 10, 10], 
          filename: 'oreganotea-project-export.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .save()
        .then(() => toast({ title: "PDF Export Complete", description: "Project data exported to 'oreganotea-project-export.pdf'." }))
        .catch((error: any) => toast({ title: "PDF Export Failed", description: `An error occurred: ${error.message}`, variant: "destructive" }));
    } catch (error: any) {
        toast({ title: "PDF Export Failed", description: `Could not load PDF generation library: ${error.message}`, variant: "destructive" });
    }
  }, [savedNotes, dailyNotes, tasks, links, toast]);

  const handleNewProjectConfirm = useCallback(() => {
    setNoteTitle(''); 
    setNoteContent('');
    setSummary('');
    setKeyTopics('');
    setActiveNoteId(null);
    setSavedNotes([]);
    setDailyNotes({});
    setTasks([]);
    setLinks([]);

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
      <div className="col-start-1 row-start-1 bg-secondary section-border">
        <LogoSection 
          onSummarize={handleSummarize} 
          isSummarizing={isSummarizing}
          onSaveProjectAsHtml={handleSaveProjectAsHtml}
          onSaveNoteAsHtml={handleSaveCurrentNoteAsHtml}
          onSaveProjectAsText={handleSaveProjectAsText}
          onExportProjectAsPdf={handleExportProjectAsPdf}
          onSaveToDrive={isSavingToDrive ? () => {} : handleSaveToDrive}
          isSavingToDrive={isSavingToDrive}
          onSendShare={handleSendShare}
          onRewriteNoteAI={handleRewriteNoteAI}
          isRewritingAI={isRewritingAI}
          onExportProjectData={handleExportProjectData}
          onImportProjectData={handleImportProjectData}
          onNewProject={() => setShowNewProjectDialog(true)}
        />
      </div>
      <div className="col-start-1 row-start-2 row-span-2 flex flex-col min-h-0 bg-light-blue-bg section-border">
        <CalendarSection 
          dailyNotes={dailyNotes}
          onSaveDailyNote={handleSaveDailyNote}
          onDeleteDailyNote={handleDeleteDailyNote}
        />
      </div>
      
      <div className="col-start-2 row-start-1 row-span-3 flex flex-col min-h-0 bg-secondary section-border">
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
      
      <div className="col-start-3 row-start-1 row-span-3 flex flex-col min-h-0 bg-light-blue-bg section-border">
         <ProjectFilesSection 
            savedNotes={savedNotes} 
            onLoadNote={handleLoadNote}
            onDeleteNote={handleDeleteNote}
            onRenameNote={handleRenameNote} 
            activeNoteId={activeNoteId}
            onUploadFile={handleUploadFile}
          />
      </div>
      <div className="col-start-3 row-start-4 flex flex-col min-h-0 bg-light-blue-bg section-border">
        <NotesSection 
          tasks={tasks}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
        /> 
      </div>
      
      <div className="col-start-1 col-span-2 row-start-4 bg-secondary section-border"> 
        <LinksSection 
          links={links}
          onSaveLink={handleSaveLink}
          onDeleteLink={handleDeleteLink}
        />
      </div>

      <AlertDialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <AlertDialogContent className="bg-card border-border text-card-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Project?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
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
