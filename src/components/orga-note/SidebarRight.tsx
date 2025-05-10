import type React from 'react';
import { Button } from '@/components/ui/button';

const SidebarRight: React.FC = () => {
  const buttonStyle = "border border-white p-1.25 bg-black text-white hover:bg-gray-700 w-full text-left text-sm";
  return (
    <div className="bg-[#800000] p-2.5 border border-white h-full flex flex-col gap-1.25">
      <Button className={buttonStyle} variant="outline">Make HTML</Button>
      <Button className={buttonStyle} variant="outline">Save to Drive</Button>
      <Button className={buttonStyle} variant="outline">Toggle Editor</Button>
      <Button className={buttonStyle} variant="outline">Send & Share</Button>
    </div>
  );
};

export default SidebarRight;
