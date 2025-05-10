import type React from 'react';

const UploadSection: React.FC = () => {
  return (
    <div className="bg-background p-2.5 border border-border h-full flex flex-col">
      <div className="border border-border my-0.5 p-1.25 text-lg font-semibold text-foreground">Upload</div>
      <div className="border border-border my-0.5 p-1.25 flex-grow text-muted-foreground">
        {/* Content for uploads will go here, e.g., a file drop zone or button */}
        Upload functionality coming soon.
      </div>
    </div>
  );
};

export default UploadSection;
