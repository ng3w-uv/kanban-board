'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '@/lib/useTasks';

interface Props {
  task: Task;
  overlay?: boolean;
}

function formatDueDate(due: string): { label: string; overdue: boolean; today: boolean } {
  const dueDate = new Date(due);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueStart = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  const diffDays = Math.round((dueStart.getTime() - todayStart.getTime()) / 86400000);

  if (diffDays < 0) return { label: `${Math.abs(diffDays)}d overdue`, overdue: true, today: false };
  if (diffDays === 0) return { label: 'Due today', overdue: false, today: true };
  if (diffDays === 1) return { label: 'Due tomorrow', overdue: false, today: false };
  return {
    label: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    overdue: false,
    today: false,
  };
}

export default function TaskCard({ task, overlay = false }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? 'transform 200ms ease',
  };

  const due = task.due_date ? formatDueDate(task.due_date) : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={[
        'group relative bg-white rounded-xl border px-3.5 py-3 select-none',
        'cursor-grab active:cursor-grabbing',
        'transition-all duration-150',
        due?.overdue && !isDragging
          ? 'border-red-200 bg-red-50/40 shadow-[0_1px_3px_rgba(239,68,68,0.08)] hover:shadow-[0_4px_12px_rgba(239,68,68,0.12)] hover:border-red-300 hover:-translate-y-px'
          : isDragging && !overlay
          ? 'opacity-30 shadow-none border-neutral-100'
          : 'border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:border-neutral-300 hover:-translate-y-px',
        overlay ? 'shadow-[0_12px_32px_rgba(0,0,0,0.12)] rotate-[1.5deg] border-neutral-200 scale-105' : '',
      ].join(' ')}
    >
      {/* Drag handle */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
        <svg className="w-3.5 h-3.5 text-neutral-300" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="5" cy="4" r="1.2" />
          <circle cx="11" cy="4" r="1.2" />
          <circle cx="5" cy="8" r="1.2" />
          <circle cx="11" cy="8" r="1.2" />
          <circle cx="5" cy="12" r="1.2" />
          <circle cx="11" cy="12" r="1.2" />
        </svg>
      </div>

      <p className="text-[13px] font-medium text-neutral-800 leading-snug pr-5">{task.title}</p>

      {due && (
        <div className="mt-2 flex items-center gap-1">
          <svg
            className={`w-3 h-3 flex-shrink-0 ${due.overdue ? 'text-red-400' : due.today ? 'text-amber-400' : 'text-neutral-400'}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
          </svg>
          <span className={`text-[11px] font-medium tabular-nums ${due.overdue ? 'text-red-500' : due.today ? 'text-amber-500' : 'text-neutral-400'}`}>
            {due.label}
          </span>
        </div>
      )}

      {!due && (
        <p className="mt-2 text-[11px] text-neutral-400 tabular-nums">
          {new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>
      )}
    </div>
  );
}
