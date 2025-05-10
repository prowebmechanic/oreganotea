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
import { Settings, Sparkles, FileText, UploadCloud, LogOut, HelpCircle, FileCode, Save, Send, Download, FilePlus } from 'lucide-react';

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
    className="text-green-600" // Oregano green
  >
    <path d="M15 3h-1.5a2.5 2.5 0 0 0-5 0H7.5a1 1 0 0 0-1 1V7h11V4a1 1 0 0 0-1-1Z" />
    <path d="M7.5 7h9v11a2.5 2.5 0 0 1-2.5 2.5h-4A2.5 2.5 0 0 1 7.5 18V7Z" />
    <path d="M10 11h4" />
  </svg>
);


interface LogoSectionProps {
  onSummarize: () => void;
  isSummarizing: boolean;
  onMakeHtml: () => void;
  onSaveToDrive: () => void;
  isSavingToDrive: boolean;
  onSendShare: () => void;
  onExportProjectData: () => void;
  onNewProject: () => void;
  onImportProjectData: () => void;
}

const LogoSection: React.FC<LogoSectionProps> = ({ 
  onSummarize, 
  isSummarizing,
  onMakeHtml,
  onSaveToDrive,
  isSavingToDrive,
  onSendShare,
  onExportProjectData,
  onNewProject,
  onImportProjectData,
}) => {
  return (
    <div className="bg-transparent p-2.5 h-auto flex flex-col items-center justify-start">
      <h1 className="text-2xl font-bold text-primary mb-2 flex items-center">
        <SpiceBottleIcon />
        <span style={{ color: 'forestgreen' }} className="ml-1">Oregano</span>
        <span className="text-primary ml-0.5">téa</span>
      </h1>
      
      <div className="flex flex-col space-y-1.5 w-full px-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground text-xs h-8">
              <Settings className="mr-2 h-3.5 w-3.5" /> Project Settings
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-popover text-popover-foreground">
            <DropdownMenuLabel>Note Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={onSummarize} disabled={isSummarizing}>
              <Sparkles className="mr-2 h-4 w-4" />
              {isSummarizing ? 'Summarizing...' : 'Summarize Note (AI)'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onMakeHtml}>
              <FileCode className="mr-2 h-4 w-4" /> Make HTML from Note
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSaveToDrive} disabled={isSavingToDrive}>
              <Save className="mr-2 h-4 w-4" /> 
              {isSavingToDrive ? 'Saving Note...' : 'Save Note to Drive'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSendShare}>
              <Send className="mr-2 h-4 w-4" /> Send &amp; Share Note
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Project Management</DropdownMenuLabel>
            <DropdownMenuItem onClick={onNewProject}>
              <FilePlus className="mr-2 h-4 w-4" /> New Project (Reset All)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportProjectData}>
              <Download className="mr-2 h-4 w-4" /> Export Project Data
            </DropdownMenuItem>
             <DropdownMenuItem onClick={onImportProjectData}>
              <UploadCloud className="mr-2 h-4 w-4" /> Import Project Data
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Account &amp; Help</DropdownMenuLabel>
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" /> My Account (soon)
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" /> Help (soon)
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" /> Logout (soon)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default LogoSection;
