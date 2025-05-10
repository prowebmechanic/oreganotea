import type React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, HelpCircle, LogOut } from 'lucide-react';

const Footer: React.FC = () => {
  const buttonStyle = "bg-black text-white border border-white hover:bg-gray-700 flex-1 mx-1";
  return (
    <div className="bg-black p-2.5 border border-white flex justify-around">
      <Button className={buttonStyle} variant="outline">
        <Settings className="mr-2 h-4 w-4" /> Settings
      </Button>
      <Button className={buttonStyle} variant="outline">
        <HelpCircle className="mr-2 h-4 w-4" /> Help
      </Button>
      <Button className={buttonStyle} variant="outline">
        <LogOut className="mr-2 h-4 w-4" /> Logout
      </Button>
    </div>
  );
};

export default Footer;
