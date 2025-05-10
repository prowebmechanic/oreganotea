import type React from 'react';

const FilesSection: React.FC = () => {
  return (
    <div className="bg-black p-2.5 border border-white h-full flex flex-col">
      <div className="border border-white my-0.5 p-1.25 text-lg font-semibold">Files</div>
      <div className="border border-white my-0.5 p-1.25 flex-grow">
        <p className="text-sm text-muted-foreground">Your saved files will appear here.</p>
        {/* Placeholder for file list */}
      </div>
    </div>
  );
};

export default FilesSection;
