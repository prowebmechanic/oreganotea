// src/lib/localStorage.ts
'use client';

import type { SavedNote } from '@/types/note';

const NOTES_STORAGE_KEY = 'orgaNotes';
const DAILY_CALENDAR_NOTES_STORAGE_KEY = 'oreganoteDailyCalendarNotes';

export function getSavedNotes(): SavedNote[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const notesJson = window.localStorage.getItem(NOTES_STORAGE_KEY);
    return notesJson ? JSON.parse(notesJson) : [];
  } catch (error) {
    console.error('Error loading notes from localStorage:', error);
    return [];
  }
}

export function saveNotes(notes: SavedNote[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes to localStorage:', error);
  }
}

export function getDailyCalendarNotes(): Record<string, string> {
  if (typeof window === 'undefined') {
    return {};
  }
  try {
    const notesJson = window.localStorage.getItem(DAILY_CALENDAR_NOTES_STORAGE_KEY);
    return notesJson ? JSON.parse(notesJson) : {};
  } catch (error) {
    console.error('Error loading daily calendar notes from localStorage:', error);
    return {};
  }
}

export function saveDailyCalendarNotes(notes: Record<string, string>): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(DAILY_CALENDAR_NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving daily calendar notes to localStorage:', error);
  }
}
