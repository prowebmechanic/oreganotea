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

const TASKS_STORAGE_KEY = 'orgaNoteTasks';

const NotesSection: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
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
      <div className="bg-black p-2.5 border border-white h-full flex flex-col">
        <div className="border border-white my-0.5 p-1.25 text-base font-semibold">ToDo List</div>
        <div className="flex-grow p-1.25 text-muted-foreground">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="bg-black p-2.5 border border-white h-full flex flex-col text-sm">
      <div className="border border-white my-0.5 p-1.25 text-base font-semibold">ToDo List</div>
      <div className="flex gap-1.25 my-1.25 p-1.25 border border-white">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          className="bg-gray-800 text-white border-gray-700 h-8 text-xs"
        />
        <Button onClick={handleAddTask} variant="outline" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 h-8 text-xs px-2">
          <PlusCircle className="h-3 w-3 mr-1" /> Add
        </Button>
      </div>
      <ScrollArea className="border border-white my-0.5 p-1.25 flex-grow">
        {tasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-4 text-xs">No tasks yet. Add one above!</p>
        ) : (
          <ul className="space-y-1.5">
            {tasks.map(task => (
              <li key={task.id} className="flex items-center justify-between p-1.25 border border-gray-700 rounded-sm hover:bg-gray-800/50">
                <div className="flex items-center gap-1.5">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => handleToggleTask(task.id)}
                    className="border-gray-600 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`text-xs ${task.completed ? 'line-through text-muted-foreground' : 'text-white'}`}
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
