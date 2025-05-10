// src/components/orga-note/CalendarSection.tsx
'use client';
import type React from 'react';
import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";

const CalendarSection: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [clientMounted, setClientMounted] = useState(false);
  const [currentMonthView, setCurrentMonthView] = useState<Date>(new Date());


  useEffect(() => {
    setClientMounted(true);
    // Initialize with current date only on client
    // The selected date will be set on click, default view is current month.
  }, []);
  
  // Handler for navigating months in the multi-month calendar view
  const handleMonthChange = (month: Date) => {
    setCurrentMonthView(month);
  };


  return (
    <div className="bg-background p-1 border border-border h-full flex flex-col text-sm">
      {clientMounted ? (
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md bg-background text-foreground p-0 w-full"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-1 sm:space-x-1 sm:space-y-0 justify-around",
            month: "space-y-1 p-1 border border-border rounded-md", // Add border to individual months
            caption_label: "text-xs font-medium text-primary", // Make month/year stand out
            day: "h-6 w-6 text-xs p-0 font-normal text-foreground hover:bg-accent/80 hover:text-accent-foreground",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground ring-1 ring-accent",
            head_cell: "text-muted-foreground rounded-md w-6 font-normal text-[0.7rem]",
            cell: "h-6 w-6 text-center text-xs p-0 relative",
            nav_button: "h-5 w-5 bg-transparent p-0 opacity-75 hover:opacity-100 text-primary hover:bg-accent/20",
            nav_button_previous: "absolute left-1 top-1",
            nav_button_next: "absolute right-1 top-1",
          }}
          numberOfMonths={6}
          pagedNavigation // Allows navigating 6 months at a time
          month={currentMonthView}
          onMonthChange={handleMonthChange} // Use this to control the view across multiple months
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading Calendar...</div>
      )}
    </div>
  );
};

export default CalendarSection;
