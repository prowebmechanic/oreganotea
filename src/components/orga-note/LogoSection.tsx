// src/components/orga-note/LogoSection.tsx
import type React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Sparkles, FileText, UploadCloud, LogOut, HelpCircle, FileCode, Save, Send } from 'lucide-react';

// Inline SVG for a spice bottle icon
const SpiceBottleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24" // Increased size for better visibility
    height="24" // Increased size for better visibility
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor" // Set to currentColor to inherit color
    strokeWidth="1.5" // Slightly thinner stroke
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-green-600 mr-0.5" // Specific green color, adjust if needed by theme
  >
    <path d="M15 3h-1.5a2.5 2.5 0 0 0-5 0H7.5a1 1 0 0 0-1 1V7h11V4a1 1 0 0 0-1-1Z" />
    <path d="M7.5 7h9v11a2.5 2.5 0 0 1-2.5 2.5h-4A2.5 2.5 0 0 1 7.5 18V7Z" />
    <path d="M10 11h4" /> {/* Optional: small detail inside bottle */}
  </svg>
);


interface LogoSectionProps {
  onSummarize: () => void;
  isSummarizing: boolean;
  onMakeHtml: () => void;
  onSaveToDrive: () => void;
  isSavingToDrive: boolean; // Added this prop
  onSendShare: () => void;
}

const LogoSection: React.FC<LogoSectionProps> = ({ 
  onSummarize, 
  isSummarizing,
  onMakeHtml,
  onSaveToDrive,
  isSavingToDrive, // Consuming the prop
  onSendShare 
}) => {
  return (
    <div className="bg-transparent p-2.5 h-auto flex flex-col items-center justify-start">
      <h1 className="text-2xl font-bold text-primary mb-2 flex items-center">
        <span style={{ color: 'forestgreen' }} className="mr-0.5">Orega</span>
        <SpiceBottleIcon /> 
        note
      </h1>
      
      <div className="flex flex-col space-y-1.5 w-full px-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground text-xs h-8">
              <Settings className="mr-2 h-3.5 w-3.5" /> Settings
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-popover text-popover-foreground">
            <DropdownMenuLabel>App Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSummarize} disabled={isSummarizing}>
              <Sparkles className="mr-2 h-4 w-4" />
              {isSummarizing ? 'Summarizing...' : 'Summarize AI'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onMakeHtml}>
              <FileCode className="mr-2 h-4 w-4" /> Make HTML
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSaveToDrive} disabled={isSavingToDrive}>
              <Save className="mr-2 h-4 w-4" /> 
              {isSavingToDrive ? 'Saving...' : 'Save to Drive'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSendShare}>
              <Send className="mr-2 h-4 w-4" /> Send &amp; Share
            </DropdownMenuItem>
            <DropdownMenuSeparator />
             <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" /> My Account (soon)
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UploadCloud className="mr-2 h-4 w-4" /> Import/Export (soon)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
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
