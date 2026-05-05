'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, TaskStatus } from '@/lib/useTasks';
import TaskCard from './TaskCard';

const COLUMN_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done',
};

const COLUMN_DOT: Record<TaskStatus, string> = {
  todo: 'bg-neutral-400',
  in_progress: 'bg-blue-400',
  in_review: 'bg-amber-400',
  done: 'bg-emerald-400',
};

const COLUMN_COUNT_PILL: Record<TaskStatus, string> = {
  todo: 'bg-neutral-100 text-neutral-500',
  in_progress: 'bg-blue-50 text-blue-500',
  in_review: 'bg-amber-50 text-amber-600',
  done: 'bg-emerald-50 text-emerald-600',
};

interface Props {
  status: TaskStatus;
  tasks: Task[];
}

export default function Column({ status, tasks }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex flex-col min-w-[272px] w-full max-w-[272px]">
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 px-0.5">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${COLUMN_DOT[status]}`} />
        <span className="text-[13px] font-semibold text-neutral-700 tracking-[-0.01em]">
          {COLUMN_LABELS[status]}
        </span>
        <span className={`ml-auto text-[11px] font-semibold rounded-full px-2 py-0.5 tabular-nums ${COLUMN_COUNT_PILL[status]}`}>
          {tasks.length}
        </span>
      </div>

      {/* Drop zone */}
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={[
            'flex flex-col gap-2 rounded-2xl p-2 min-h-[160px] transition-colors duration-150',
            isOver
              ? 'bg-neutral-100/80 ring-1 ring-neutral-200'
              : 'bg-neutral-100/50',
          ].join(' ')}
        >
          {tasks.length === 0 ? (
            <div className={[
              'flex flex-col items-center justify-center gap-1.5 h-full min-h-[120px] rounded-xl border-2 border-dashed transition-colors duration-150',
              isOver ? 'border-neutral-300' : 'border-neutral-200/70',
            ].join(' ')}>
              <p className="text-[11px] font-medium text-neutral-300 select-none">Drop here</p>
            </div>
          ) : (
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </div>
      </SortableContext>
    </div>
  );
}
