// src/components/orga-note/CalendarSection.tsx
'use client';
import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Calendar } from "@/components/ui/calendar";
import type { DayContentProps } from "react-day-picker";
import { formatISO, parseISO, isToday } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { getDailyCalendarNotes, saveDailyCalendarNotes } from '@/lib/localStorage';
import { ScrollArea } from '../ui/scroll-area';


const CalendarSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [clientMounted, setClientMounted] = useState(false);
  // Default to May 1st of the current year
  const [currentMonthView, setCurrentMonthView] = useState<Date>(new Date(new Date().getFullYear(), 4, 1));
  const [dailyNotes, setDailyNotes] = useState<Record<string, string>>({});
  const [selectedDayNoteText, setSelectedDayNoteText] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    setClientMounted(true);
    if (typeof window !== 'undefined') {
      const loadedNotes = getDailyCalendarNotes();
      setDailyNotes(loadedNotes);
    }
  }, []);

  useEffect(() => {
    if (clientMounted && typeof window !== 'undefined') {
      saveDailyCalendarNotes(dailyNotes);
    }
  }, [dailyNotes, clientMounted]);

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

  const handleSaveDailyNote = useCallback(() => {
    if (!selectedDate) {
      toast({ title: "No Date Selected", description: "Please select a date to save a note.", variant: "destructive" });
      return;
    }
    const dateISO = formatISO(selectedDate, { representation: 'date' });
    setDailyNotes(prev => ({ ...prev, [dateISO]: selectedDayNoteText }));
    toast({ title: "Note Saved", description: `Note for ${selectedDate.toLocaleDateString()} saved.` });
  }, [selectedDate, selectedDayNoteText, toast]);

  const handleDeleteDailyNote = useCallback(() => {
    if (!selectedDate) {
      toast({ title: "No Date Selected", description: "Please select a date to delete its note.", variant: "destructive" });
      return;
    }
    const dateISO = formatISO(selectedDate, { representation: 'date' });
    if (!dailyNotes[dateISO]) {
      toast({ title: "No Note", description: `No note to delete for ${selectedDate.toLocaleDateString()}.`});
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [dateISO]: _, ...rest } = dailyNotes;
    setDailyNotes(rest);
    setSelectedDayNoteText('');
    toast({ title: "Note Deleted", description: `Note for ${selectedDate.toLocaleDateString()} deleted.` });
  }, [selectedDate, dailyNotes, toast]);


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
    hasNote: 'day-with-note', // Custom class for non-today notes
    todayWithNote: 'day-today-with-note', // Custom class if today has a note
    // day_today will be applied by default by react-day-picker for styling today
  };


  return (
    <div className="bg-background p-1 border border-border h-full flex flex-col text-sm">
      {clientMounted ? (
        <>
          <style>{`
            .day-with-note { /* Style for days with notes, not today */
              /* You can add specific styles here if DayContent isn't enough, e.g. a border */
            }
            .day-today-with-note .rdp-day_today { /* If today also has a note */
              /* Example: make today's highlight even stronger or a different color */
              /* background-color: hsl(var(--destructive)) !important; */
              /* color: hsl(var(--destructive-foreground)) !important; */
            }
          `}</style>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md bg-background text-foreground p-0 w-full"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-1 sm:space-x-1 sm:space-y-0 justify-around",
              month: "space-y-1 p-1 border border-border rounded-md flex-grow flex flex-col",
              caption: "flex justify-center pt-1 relative items-center text-primary",
              caption_label: "text-xs font-medium",
              day: "h-6 w-6 text-xs p-0 font-normal text-foreground hover:bg-accent/80 hover:text-accent-foreground relative", // Added relative for dot positioning
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground ring-1 ring-accent",
              head_cell: "text-muted-foreground rounded-md w-6 font-normal text-[0.7rem]",
              cell: "h-6 w-6 text-center text-xs p-0 relative", // Ensure cell is relative for absolute positioning of dot
              nav_button: "h-5 w-5 bg-transparent p-0 opacity-75 hover:opacity-100 text-primary hover:bg-accent/20",
              nav_button_previous: "absolute left-1 top-1",
              nav_button_next: "absolute right-1 top-1",
              table: "w-full", 
              body: "", 
              row: "flex w-full mt-1", 
            }}
            numberOfMonths={2}
            pagedNavigation
            month={currentMonthView}
            onMonthChange={handleMonthChange}
            components={{ DayContent: DayContentWithNotes }}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
          />
          {selectedDate && (
            <ScrollArea className="mt-2 p-2 border border-border rounded-md flex-grow min-h-[100px]">
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-primary">
                  Note for: {selectedDate.toLocaleDateString()}
                  {isToday(selectedDate) && dailyNotes[formatISO(selectedDate, { representation: 'date' })] && (
                     <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-destructive text-destructive-foreground">Reminder!</span>
                  )}
                </h4>
                <Textarea
                  placeholder="Add a note for this day..."
                  value={selectedDayNoteText}
                  onChange={(e) => setSelectedDayNoteText(e.target.value)}
                  className="bg-input text-foreground border-border text-xs h-16"
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveDailyNote} size="sm" className="text-xs h-7 px-2 bg-primary hover:bg-primary/90 text-primary-foreground">Save Note</Button>
                  {dailyNotes[formatISO(selectedDate, { representation: 'date' })] && (
                    <Button onClick={handleDeleteDailyNote} variant="destructive" size="sm" className="text-xs h-7 px-2">Delete Note</Button>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading Calendar...</div>
      )}
    </div>
  );
};

export default CalendarSection;
