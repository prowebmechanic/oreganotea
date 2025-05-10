import type React from 'react';
import { Button } from '@/components/ui/button';

const SidebarRight: React.FC = () => {
  const buttonStyle = "border border-border p-1.25 bg-background text-foreground hover:bg-secondary hover:text-secondary-foreground w-full text-left text-sm";
  return (
    <div className="bg-background p-2.5 border border-border h-full flex flex-col gap-1.25">
      <Button className={buttonStyle} variant="outline">Make HTML</Button>
      <Button className={buttonStyle} variant="outline">Save to Drive</Button>
      <Button className={buttonStyle} variant="outline">Toggle Editor</Button>
      <Button className={buttonStyle} variant="outline">Send & Share</Button>
    </div>
  );
};

export default SidebarRight;
