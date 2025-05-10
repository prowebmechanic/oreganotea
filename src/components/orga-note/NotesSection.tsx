// src/components/orga-note/NotesSection.tsx
'use client';
import React, { useState, useCallback, useEffect } from 'react';
import type { Task } from '@/types/note';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, Trash2 } from 'lucide-react';

interface NotesSectionProps {
  tasks: Task[];
  onAddTask: (text: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({ tasks, onAddTask, onToggleTask, onDeleteTask }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const handleInternalAddTask = useCallback(() => {
    if (newTaskText.trim() === '') return;
    onAddTask(newTaskText.trim());
    setNewTaskText('');
  }, [newTaskText, onAddTask]);


  if (!isClient) {
    return (
      <div className="bg-transparent p-2.5 h-72 flex flex-col">
        <div className="my-0.5 p-1.25 text-base font-semibold text-primary">ToDo List</div>
        <div className="flex-grow p-1.25 text-muted-foreground">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="bg-transparent p-2.5 h-72 flex flex-col text-sm">
      <div className="my-0.5 p-1.25 text-base font-semibold text-primary">ToDo List</div>
      <div className="flex gap-1.25 my-1.25 p-1.25 border border-border bg-card">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleInternalAddTask()}
          className="bg-input text-foreground h-8 text-xs focus:ring-ring focus:border-ring"
        />
        <Button onClick={handleInternalAddTask} variant="outline" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 h-8 text-xs px-2">
          <PlusCircle className="h-3 w-3 mr-1" /> Add
        </Button>
      </div>
      <ScrollArea className="my-0.5 p-1.25 flex-grow bg-card rounded-md border border-border">
        {tasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-4 text-xs">No tasks yet. Add one above!</p>
        ) : (
          <ul className="space-y-1.5">
            {tasks.map(task => (
              <li key={task.id} className="flex items-center justify-between p-1.25 border border-border rounded-sm hover:bg-secondary/50 bg-card">
                <div className="flex items-center gap-1.5">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => onToggleTask(task.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground"
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`text-xs ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                  >
                    {task.text}
                  </label>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onDeleteTask(task.id)} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
};

export default NotesSection;
