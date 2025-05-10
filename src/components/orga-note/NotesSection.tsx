// src/components/orga-note/NotesSection.tsx
'use client';
import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import type { Task } from '@/types/note';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, Trash2 } from 'lucide-react';

const TASKS_STORAGE_KEY = 'oreganoteTasks';

const NotesSection: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      if (storedTasks) {
        try {
          setTasks(JSON.parse(storedTasks));
        } catch (e) {
          console.error("Failed to parse tasks from localStorage", e);
          setTasks([]);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isClient]);

  const handleAddTask = useCallback(() => {
    if (newTaskText.trim() === '') return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    setNewTaskText('');
  }, [newTaskText]);

  const handleToggleTask = useCallback((taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  }, []);

  if (!isClient) {
    return (
      <div className="bg-transparent p-2.5 h-full flex flex-col"> {/* Changed bg-background to bg-transparent */}
        <div className="my-0.5 p-1.25 text-base font-semibold text-primary">ToDo List</div>
        <div className="flex-grow p-1.25 text-muted-foreground">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="bg-transparent p-2.5 h-full flex flex-col text-sm"> {/* Changed bg-background to bg-transparent */}
      <div className="my-0.5 p-1.25 text-base font-semibold text-primary">ToDo List</div>
      <div className="flex gap-1.25 my-1.25 p-1.25 border border-border bg-card"> {/* Added bg-card for this sub-section */}
        <Input
          type="text"
          placeholder="Add a new task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          className="bg-input text-foreground h-8 text-xs focus:ring-ring focus:border-ring"
        />
        <Button onClick={handleAddTask} variant="outline" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 h-8 text-xs px-2">
          <PlusCircle className="h-3 w-3 mr-1" /> Add
        </Button>
      </div>
      <ScrollArea className="my-0.5 p-1.25 flex-grow bg-card rounded-md border border-border"> {/* Added bg-card and border for ScrollArea */}
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
                    onCheckedChange={() => handleToggleTask(task.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground"
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`text-xs ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                  >
                    {task.text}
                  </label>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)} className="h-6 w-6 text-muted-foreground hover:text-destructive">
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
