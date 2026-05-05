'use client';

import { useState } from 'react';

interface Props {
  onAdd: (title: string, dueDate: string | null) => Promise<string | null>;
}

export default function CreateTask({ onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError(null);
    const err = await onAdd(trimmed, dueDate || null);
    setSubmitting(false);

    if (err) {
      setError(err);
    } else {
      setTitle('');
      setDueDate('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1.5 mb-7">
      <div className="flex items-center gap-2">
        {/* Title input */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
            <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setError(null); }}
            placeholder="Add a task…"
            disabled={submitting}
            className="w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-4 py-2.5 text-[13px] text-neutral-900 placeholder:text-neutral-400 shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-900/5 disabled:opacity-50 transition-all duration-150"
          />
        </div>

        {/* Date picker */}
        <div className="relative flex-shrink-0">
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
            </svg>
          </div>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={submitting}
            min={new Date().toISOString().split('T')[0]}
            className="rounded-xl border border-neutral-200 bg-white pl-9 pr-3 py-2.5 text-[13px] text-neutral-600 shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-900/5 disabled:opacity-50 transition-all duration-150 [color-scheme:light]"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="flex-shrink-0 rounded-xl bg-neutral-900 px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.12)] hover:bg-neutral-700 active:bg-neutral-800 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
        >
          {submitting ? (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Adding
            </span>
          ) : 'Add task'}
        </button>
      </div>
      {error && <p className="text-[11px] text-red-500 pl-1">{error}</p>}
    </form>
  );
}
