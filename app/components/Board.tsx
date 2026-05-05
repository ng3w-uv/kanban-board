'use client';

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useState } from 'react';
import { useUser } from '@/lib/useUser';
import { useTasks } from '@/lib/useTasks';
import type { Task, TaskStatus } from '@/lib/useTasks';
import Column from './Column';
import CreateTask from './CreateTask';
import TaskCard from './TaskCard';
import BoardSkeleton from './BoardSkeleton';

const COLUMNS: TaskStatus[] = ['todo', 'in_progress', 'in_review', 'done'];

export default function Board() {
  const { user, loading: authLoading } = useUser();
  const { tasks, loading, error, addTask, moveTask } = useTasks(user);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [query, setQuery] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  if (authLoading || loading) {
    return <BoardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center max-w-xs">
          <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-[13px] font-semibold text-neutral-700">Could not load tasks</p>
          <p className="mt-1 text-[11px] text-neutral-400 leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  const totalTasks = COLUMNS.reduce((sum, s) => sum + tasks[s].length, 0);

  const needle = query.trim().toLowerCase();
  const filteredTasks = needle
    ? Object.fromEntries(
        COLUMNS.map((s) => [s, tasks[s].filter((t) => t.title.toLowerCase().includes(needle))])
      ) as typeof tasks
    : tasks;

  const hasResults = COLUMNS.some((s) => filteredTasks[s].length > 0);

  const findTaskStatus = (taskId: string): TaskStatus | undefined =>
    COLUMNS.find((status) => tasks[status].some((t) => t.id === taskId));

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id as string;
    const status = findTaskStatus(taskId);
    if (status) {
      setActiveTask(tasks[status].find((t) => t.id === taskId) ?? null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    const from = findTaskStatus(taskId);
    const to: TaskStatus | undefined = COLUMNS.includes(overId as TaskStatus)
      ? (overId as TaskStatus)
      : findTaskStatus(overId);

    if (!from || !to || from === to) return;
    moveTask(taskId, from, to);
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <CreateTask onAdd={addTask} />

      {/* Search */}
      <div className="relative mb-5">
        <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
          <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks…"
          className="w-full max-w-xs rounded-xl border border-neutral-200 bg-white pl-9 pr-4 py-2 text-[13px] text-neutral-900 placeholder:text-neutral-400 shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-900/5 transition-all duration-150"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {totalTasks === 0 && (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200/60 flex items-center justify-center mb-3">
            <svg className="w-4.5 h-4.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-[13px] font-semibold text-neutral-600">No tasks yet</p>
          <p className="mt-1 text-[12px] text-neutral-400">Create your first task using the input above</p>
        </div>
      )}
      {needle && !hasResults && (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200/60 flex items-center justify-center mb-3">
            <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p className="text-[13px] font-semibold text-neutral-600">No tasks found</p>
          <p className="mt-1 text-[12px] text-neutral-400">No tasks match &ldquo;{query.trim()}&rdquo;</p>
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((status) => (
          <Column key={status} status={status} tasks={filteredTasks[status]} />
        ))}
      </div>
      <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
        {activeTask ? <TaskCard task={activeTask} overlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
