// src/components/orga-note/LogoSection.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Sparkles, FileText, UploadCloud, LogOut, HelpCircle, FileCode, Save, Send, Download, FilePlus, Edit3, FileArchive, FileType } from 'lucide-react';

const SpiceBottleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-accent" // Changed from text-green-600 to use theme accent
  >
    <path d="M15 3h-1.5a2.5 2.5 0 0 0-5 0H7.5a1 1 0 0 0-1 1V7h11V4a1 1 0 0 0-1-1Z" />
    <path d="M7.5 7h9v11a2.5 2.5 0 0 1-2.5 2.5h-4A2.5 2.5 0 0 1 7.5 18V7Z" />
    <path d="M10 11h4" />
  </svg>
);


interface LogoSectionProps {
  onSummarize: () => void;
  isSummarizing: boolean;
  onSaveProjectAsHtml: () => void;
  onSaveNoteAsHtml: () => void; 
  onSaveProjectAsText: () => void; 
  onExportProjectAsPdf: () => void; 
  onSaveToDrive: () => void;
  isSavingToDrive: boolean;
  onSendShare: () => void;
  onRewriteNoteAI: () => void; 
  isRewritingAI: boolean; 
  onExportProjectData: () => void;
  onNewProject: () => void;
  onImportProjectData: () => void;
}

const LogoSection: React.FC<LogoSectionProps> = ({ 
  onSummarize, 
  isSummarizing,
  onSaveProjectAsHtml,
  onSaveNoteAsHtml,
  onSaveProjectAsText,
  onExportProjectAsPdf,
  onSaveToDrive,
  isSavingToDrive,
  onSendShare,
  onRewriteNoteAI,
  isRewritingAI,
  onExportProjectData,
  onNewProject,
  onImportProjectData,
}) => {
  return (
    <div className="bg-transparent p-2.5 h-auto flex flex-col items-center justify-start">
      <h1 className="text-2xl font-bold mb-2 flex items-center">
        <SpiceBottleIcon />
        <span style={{ color: 'forestgreen' }} className="ml-1">Oregano</span>
        <span style={{ color: 'forestgreen' }} className="ml-0.5">téa</span>
      </h1>
      
      <div className="flex flex-col space-y-1.5 w-full px-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground text-xs h-8 border-border">
              <Settings className="mr-2 h-3.5 w-3.5" /> App Menu
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60 bg-popover text-popover-foreground border-border">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={onSaveProjectAsHtml}>
              <FileCode className="mr-2 h-4 w-4 text-primary" /> Save Project as HTML
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSaveProjectAsText}>
              <FileText className="mr-2 h-4 w-4 text-primary" /> Save Project as Text
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportProjectAsPdf}>
              <FileType className="mr-2 h-4 w-4 text-primary" /> Save Project as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSaveNoteAsHtml}>
              <FileCode className="mr-2 h-4 w-4 text-accent" /> Save Note as HTML
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSaveToDrive} disabled={isSavingToDrive}>
              <Save className="mr-2 h-4 w-4 text-primary" /> 
              {isSavingToDrive ? 'Saving to Drive...' : 'Save Note to Drive'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSendShare}>
              <Send className="mr-2 h-4 w-4 text-primary" /> Send &amp; Share Note
            </DropdownMenuItem>
             <DropdownMenuItem onClick={onRewriteNoteAI} disabled={isRewritingAI}>
              <Edit3 className="mr-2 h-4 w-4 text-accent" />
              {isRewritingAI ? 'Rewriting...' : 'Rewrite Note (AI)'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSummarize} disabled={isSummarizing}>
              <Sparkles className="mr-2 h-4 w-4 text-accent" />
              {isSummarizing ? 'Summarizing...' : 'Summarize Note (AI)'}
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuLabel>Project Management</DropdownMenuLabel>
            <DropdownMenuItem onClick={onExportProjectData}>
              <Download className="mr-2 h-4 w-4 text-primary" /> Export Project Data (.json)
            </DropdownMenuItem>
             <DropdownMenuItem onClick={onImportProjectData}>
              <UploadCloud className="mr-2 h-4 w-4 text-primary" /> Import Project Data (.json)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onNewProject} className="text-destructive hover:!bg-destructive hover:!text-destructive-foreground">
              <FilePlus className="mr-2 h-4 w-4" /> New Project (Reset All)
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-border"/>
            <DropdownMenuLabel>Account &amp; Help</DropdownMenuLabel>
            <DropdownMenuItem disabled>
              <FileText className="mr-2 h-4 w-4" /> My Account (soon)
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <HelpCircle className="mr-2 h-4 w-4" /> Help (soon)
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <LogOut className="mr-2 h-4 w-4" /> Logout (soon)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default LogoSection;

    