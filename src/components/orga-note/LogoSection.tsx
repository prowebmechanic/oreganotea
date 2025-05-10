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
import { Settings, Sparkles, FileText, UploadCloud, LogOut, HelpCircle } from 'lucide-react';

interface LogoSectionProps {
  onSummarize: () => void;
  isSummarizing: boolean;
}

const LogoSection: React.FC<LogoSectionProps> = ({ onSummarize, isSummarizing }) => {
  return (
    <div className="bg-background p-2.5 border border-border h-full flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-primary mb-2">Oreganote</h1>
      
      <div className="flex flex-col space-y-2 w-full px-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start border-border text-foreground hover:bg-accent hover:text-accent-foreground">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-popover border-border text-popover-foreground">
            <DropdownMenuLabel>App Settings</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" /> My Account (soon)
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UploadCloud className="mr-2 h-4 w-4" /> Import/Export (soon)
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border"/>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" /> Help (soon)
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" /> Logout (soon)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={onSummarize}
          disabled={isSummarizing}
          variant="outline"
          className="w-full justify-start bg-accent text-accent-foreground hover:bg-accent/90 border-border"
          aria-label="Summarize current note with AI"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isSummarizing ? 'Summarizing...' : 'Summarize AI'}
        </Button>
      </div>
    </div>
  );
};

export default LogoSection;
