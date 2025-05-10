'use client';

import React, { useState, useCallback } from 'react';
import LogoSection from '@/components/orga-note/LogoSection';
import FilesSection from '@/components/orga-note/FilesSection';
import CalendarSection from '@/components/orga-note/CalendarSection';
import MainWindow from '@/components/orga-note/MainWindow';
import NotesSection from '@/components/orga-note/NotesSection';
import ExpandSection from '@/components/orga-note/ExpandSection';
import AppFilesSection from '@/components/orga-note/AppFilesSection';
import TraySection from '@/components/orga-note/TraySection';
import UploadSection from '@/components/orga-note/UploadSection';
import SidebarRight from '@/components/orga-note/SidebarRight';
import Footer from '@/components/orga-note/Footer';

import { summarizeNote, type SummarizeNoteInput } from '@/ai/flows/summarize-note';
import { useToast } from "@/hooks/use-toast";

export default function OrgaNotePage() {
  const [noteContent, setNoteContent] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [keyTopics, setKeyTopics] = useState<string>('');
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const { toast } = useToast();

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

  return (
    <div 
      className="h-screen w-screen grid 
                 grid-cols-[1fr_3fr_1fr_0.5fr] 
                 grid-rows-[auto_auto_1fr_1fr_1fr_auto] 
                 gap-0.5 bg-black text-white font-['Arial',_sans-serif] overflow-hidden"
      style={{ fontFamily: 'Arial, sans-serif' }} // Ensure Arial is applied
    >
      {/* Row 1 */}
      <div className="col-start-1 row-start-1"><LogoSection /></div>
      <div className="col-start-2 row-start-1"><CalendarSection /></div>
      <div className="col-start-3 row-start-1"><NotesSection /></div>
      <div className="col-start-4 row-start-1"><UploadSection /></div>

      {/* Row 2 */}
      <div className="col-start-1 row-start-2 row-span-4 min-h-0"><FilesSection /></div>
      <div className="col-start-2 row-start-2 row-span-4 min-h-0">
        <MainWindow
          noteContent={noteContent}
          setNoteContent={setNoteContent}
          summary={summary}
          keyTopics={keyTopics}
          isSummarizing={isSummarizing}
        />
      </div>
      <div className="col-start-3 row-start-2"><ExpandSection onSummarize={handleSummarize} isSummarizing={isSummarizing} /></div>
      <div className="col-start-4 row-start-2 row-span-4 min-h-0"><SidebarRight /></div>
      
      {/* Row 3 */}
      <div className="col-start-3 row-start-3"><AppFilesSection /></div>
      
      {/* Row 4 */}
      <div className="col-start-3 row-start-4"><TraySection /></div>

      {/* Row 5 (empty in col 3 based on original CSS row spans) */}
      {/* Row 6 / Footer */}
      <div className="col-start-1 col-span-4 row-start-6"><Footer /></div>
    </div>
  );
}
