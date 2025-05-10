// src/types/note.ts
export interface SavedNote {
  id: string;
  name: string;
  content: string;
  lastModified: number;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}
