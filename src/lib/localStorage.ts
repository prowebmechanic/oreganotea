// src/lib/localStorage.ts
'use client';

import type { LinkItem, SavedNote, Task } from '@/types/note';

export const NOTES_STORAGE_KEY = 'orgaNotes';
export const DAILY_CALENDAR_NOTES_STORAGE_KEY = 'oreganoteDailyCalendarNotes';
export const TASKS_STORAGE_KEY = 'oreganoteTasks';
export const LINKS_STORAGE_KEY = 'oreganoteLinks';

// Saved Notes (Project Files)
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

// Daily Calendar Notes
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

// Tasks (ToDo List)
export function getTasks(): Task[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const tasksJson = window.localStorage.getItem(TASKS_STORAGE_KEY);
    return tasksJson ? JSON.parse(tasksJson) : [];
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
}

// Links (Quick Links)
export function getLinks(): LinkItem[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const linksJson = window.localStorage.getItem(LINKS_STORAGE_KEY);
    return linksJson ? JSON.parse(linksJson) : [];
  } catch (error) {
    console.error('Error loading links from localStorage:', error);
    return [];
  }
}

export function saveLinks(links: LinkItem[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(links));
  } catch (error) {
    console.error('Error saving links to localStorage:', error);
  }
}

// Clear all Oreganote data
export function clearAllOreganoteData(): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.removeItem(NOTES_STORAGE_KEY);
    window.localStorage.removeItem(DAILY_CALENDAR_NOTES_STORAGE_KEY);
    window.localStorage.removeItem(TASKS_STORAGE_KEY);
    window.localStorage.removeItem(LINKS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing all Oreganote data from localStorage:', error);
  }
}
