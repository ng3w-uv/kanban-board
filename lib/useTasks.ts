'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  status: TaskStatus;
  due_date: string | null;
  created_at: string;
}

export type GroupedTasks = Record<TaskStatus, Task[]>;

const EMPTY_COLUMNS: GroupedTasks = {
  todo: [],
  in_progress: [],
  in_review: [],
  done: [],
};

export function useTasks(user: User | null) {
  const [tasks, setTasks] = useState<GroupedTasks>(EMPTY_COLUMNS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const grouped = (data as Task[]).reduce<GroupedTasks>(
        (acc, task) => {
          acc[task.status].push(task);
          return acc;
        },
        { ...EMPTY_COLUMNS, todo: [], in_progress: [], in_review: [], done: [] },
      );

      setTasks(grouped);
      setLoading(false);
    };

    fetchTasks();
  }, [user]);

  const addTask = async (title: string, dueDate: string | null): Promise<string | null> => {
    if (!user) return 'Not signed in';

    const optimistic: Task = {
      id: crypto.randomUUID(),
      user_id: user.id,
      title,
      status: 'todo',
      due_date: dueDate,
      created_at: new Date().toISOString(),
    };

    setTasks((prev) => ({
      ...prev,
      todo: [...prev.todo, optimistic],
    }));

    const { data, error } = await supabase
      .from('tasks')
      .insert({ title, status: 'todo', user_id: user.id, due_date: dueDate })
      .select()
      .single();

    if (error) {
      // roll back
      setTasks((prev) => ({
        ...prev,
        todo: prev.todo.filter((t) => t.id !== optimistic.id),
      }));
      return error.message;
    }

    // replace optimistic with real record
    setTasks((prev) => ({
      ...prev,
      todo: prev.todo.map((t) => (t.id === optimistic.id ? (data as Task) : t)),
    }));

    return null;
  };

  const moveTask = async (taskId: string, from: TaskStatus, to: TaskStatus) => {
    setTasks((prev) => {
      const task = prev[from].find((t) => t.id === taskId);
      if (!task) return prev;
      return {
        ...prev,
        [from]: prev[from].filter((t) => t.id !== taskId),
        [to]: [...prev[to], { ...task, status: to }],
      };
    });

    await supabase.from('tasks').update({ status: to }).eq('id', taskId);
  };

  return { tasks, loading, error, addTask, moveTask };
}
