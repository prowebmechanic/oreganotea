import type React from 'react';

const CalendarSection: React.FC = () => {
  return (
    <div className="bg-black p-2.5 border border-white h-full flex flex-col">
      <div className="border border-white my-0.5 p-1.25 text-lg font-semibold">Calendar</div>
      <div className="border border-white my-0.5 p-1.25">Planning Period</div>
      <div className="border border-white my-0.5 p-1.25">Default Drag</div>
      <div className="border border-white my-0.5 p-1.25 flex-grow">Calendar Days Placeholder</div>
    </div>
  );
};

export default CalendarSection;
