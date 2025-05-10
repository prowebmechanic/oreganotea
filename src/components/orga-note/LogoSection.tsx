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

interface LogoSectionProps {
  onSummarize: () => void;
  isSummarizing: boolean;
  onMakeHtml: () => void;
  onSaveToDrive: () => void;
  onSendShare: () => void;
}

const LogoSection: React.FC<LogoSectionProps> = ({ 
  onSummarize, 
  isSummarizing,
  onMakeHtml,
  onSaveToDrive,
  onSendShare 
}) => {
  return (
    <div className="bg-transparent p-2.5 h-auto flex flex-col items-center justify-start"> {/* Changed bg-background to bg-transparent */}
      <h1 className="text-2xl font-bold text-primary mb-2">Oreganote</h1>
      
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
            <DropdownMenuItem onClick={onSaveToDrive}>
              <Save className="mr-2 h-4 w-4" /> Save to Drive
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
