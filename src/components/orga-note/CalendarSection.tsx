// src/components/orga-note/CalendarSection.tsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar } from "@/components/ui/calendar";
import type { DayContentProps } from "react-day-picker";
import { formatISO, isToday } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from '../ui/scroll-area';

interface CalendarSectionProps {
  dailyNotes: Record<string, string>;
  onSaveDailyNote: (date: Date, noteText: string) => void;
  onDeleteDailyNote: (date: Date) => void;
}

const CalendarSection: React.FC<CalendarSectionProps> = ({ dailyNotes, onSaveDailyNote, onDeleteDailyNote }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date()); 
  const [clientMounted, setClientMounted] = useState(false);
  const [currentMonthView, setCurrentMonthView] = useState<Date>(new Date()); 
  const [selectedDayNoteText, setSelectedDayNoteText] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    setClientMounted(true);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const dateISO = formatISO(selectedDate, { representation: 'date' });
      setSelectedDayNoteText(dailyNotes[dateISO] || '');
    }
  }, [selectedDate, dailyNotes]);


  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const dateISO = formatISO(date, { representation: 'date' });
      setSelectedDayNoteText(dailyNotes[dateISO] || '');
    } else {
      setSelectedDayNoteText('');
    }
  };
  
  const handleMonthChange = (month: Date) => {
    setCurrentMonthView(month);
  };

  const handleInternalSaveDailyNote = useCallback(() => {
    if (!selectedDate) {
      toast({ title: "No Date Selected", description: "Please select a date to save a note.", variant: "destructive" });
      return;
    }
    onSaveDailyNote(selectedDate, selectedDayNoteText);
    toast({ title: "Note Saved", description: `Note for ${selectedDate.toLocaleDateString()} saved.` });
  }, [selectedDate, selectedDayNoteText, onSaveDailyNote, toast]);

  const handleInternalDeleteDailyNote = useCallback(() => {
    if (!selectedDate) {
      toast({ title: "No Date Selected", description: "Please select a date to delete its note.", variant: "destructive" });
      return;
    }
    const dateISO = formatISO(selectedDate, { representation: 'date' });
    if (!dailyNotes[dateISO]) {
      toast({ title: "No Note", description: `No note to delete for ${selectedDate.toLocaleDateString()}.`});
      return;
    }
    onDeleteDailyNote(selectedDate);
    setSelectedDayNoteText(''); 
    toast({ title: "Note Deleted", description: `Note for ${selectedDate.toLocaleDateString()} deleted.` });
  }, [selectedDate, dailyNotes, onDeleteDailyNote, toast]);


  const DayContentWithNotes = (props: DayContentProps) => {
    const dateISO = formatISO(props.date, { representation: 'date' });
    const noteExists = !!dailyNotes[dateISO];
    const isCurrentDay = isToday(props.date);

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {props.date.getDate()}
        {noteExists && (
          <span className={`absolute bottom-0 right-0.5 h-1.5 w-1.5 rounded-full ${isCurrentDay && noteExists ? 'bg-destructive' : 'bg-primary'}`} />
        )}
      </div>
    );
  };
  
  const modifiers = { 
    hasNote: (day: Date) => !!dailyNotes[formatISO(day, { representation: 'date' })],
    todayWithNote: (day: Date) => isToday(day) && !!dailyNotes[formatISO(day, { representation: 'date' })]
  };

  const modifiersClassNames = {
    hasNote: 'day-with-note', 
    todayWithNote: 'day-today-with-note', 
  };


  return (
    <div className="bg-transparent p-1 h-full flex flex-col text-sm">
      {clientMounted ? (
        <>
          <style>{`
            .day-with-note { 
            }
            .day-today-with-note .rdp-day_today { 
            }
            .rdp-months {
              flex-direction: column; 
              align-items: center; 
            }
            .rdp-month {
              margin-bottom: 0.5rem; 
            }
          `}</style>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md bg-card text-foreground p-0 w-full" 
            classNames={{
              months: "flex flex-col space-y-2 justify-around items-center", 
              month: "space-y-1 p-1 border border-border rounded-md w-full max-w-xs bg-card", 
              caption: "flex justify-center pt-1 relative items-center text-primary",
              caption_label: "text-xs font-medium",
              day: "h-6 w-6 text-xs p-0 font-normal text-foreground hover:bg-accent/80 hover:text-accent-foreground relative", 
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground ring-1 ring-accent",
              head_cell: "text-muted-foreground rounded-md w-6 font-normal text-[0.7rem]",
              cell: "h-6 w-6 text-center text-xs p-0 relative", 
              nav_button: "h-5 w-5 bg-transparent p-0 opacity-75 hover:opacity-100 text-primary hover:bg-accent/20",
              nav_button_previous: "absolute left-1 top-1",
              nav_button_next: "absolute right-1 top-1",
              table: "w-full", 
              body: "", 
              row: "flex w-full mt-1 justify-center", 
            }}
            numberOfMonths={1} 
            pagedNavigation
            month={currentMonthView}
            onMonthChange={handleMonthChange}
            components={{ DayContent: DayContentWithNotes }}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
          />
          <ScrollArea className="mt-2 p-2 border border-border rounded-md flex-grow min-h-[80px] bg-card">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-primary">
                {selectedDate ? `Note for: ${selectedDate.toLocaleDateString()}` : 'Click a date to add a note'}
                {selectedDate && isToday(selectedDate) && dailyNotes[formatISO(selectedDate, { representation: 'date' })] && (
                   <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-destructive text-destructive-foreground">Reminder!</span>
                )}
              </h4>
              {selectedDate && (
                <>
                  <Textarea
                    placeholder="Add a note for this day..."
                    value={selectedDayNoteText}
                    onChange={(e) => setSelectedDayNoteText(e.target.value)}
                    className="bg-input text-foreground text-xs h-9" // Adjusted height from h-10 to h-9
                    aria-label="Daily note text area"
                  />
                  <div className="flex gap-2 mt-1">
                    <Button onClick={handleInternalSaveDailyNote} size="sm" className="text-xs h-7 px-2 bg-primary hover:bg-primary/90 text-primary-foreground">Save Note</Button>
                    {dailyNotes[formatISO(selectedDate, { representation: 'date' })] && (
                      <Button onClick={handleInternalDeleteDailyNote} variant="destructive" size="sm" className="text-xs h-7 px-2">Delete Note</Button>
                    )}
                  </div>
                </>
              )}
              {!selectedDate && (
                <p className="text-xs text-muted-foreground">Click on a day in the calendar to manage its notes.</p>
              )}
            </div>
          </ScrollArea>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading Calendar...</div>
      )}
    </div>
  );
};

export default CalendarSection;

    