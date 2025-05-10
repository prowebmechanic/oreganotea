// src/components/orga-note/CalendarSection.tsx
'use client';
import type React from 'react';
import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";

const CalendarSection: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [clientMounted, setClientMounted] = useState(false);

  useEffect(() => {
    setClientMounted(true);
    setDate(new Date()); // Initialize with current date only on client
  }, []);

  return (
    <div className="bg-black p-2.5 border border-white h-full flex flex-col text-sm">
      <div className="border border-white my-0.5 p-1.25 text-base font-semibold">Calendar</div>
      <div className="border border-white my-0.5 p-1.25">Planning Period</div>
      <div className="border border-white my-0.5 p-1.25">Default Drag</div>
      <div className="border border-white my-0.5 p-1.25 flex-grow flex items-center justify-center">
        {clientMounted ? (
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border border-gray-700 bg-gray-800 text-white p-0 [&_button]:text-xs [&_button]:h-7 [&_button]:w-7 [&_caption_label]:text-xs"
            month={date} // Ensure calendar displays current month
            onMonthChange={setDate} // Allow month navigation
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading Calendar...</div>
        )}
      </div>
    </div>
  );
};

export default CalendarSection;
