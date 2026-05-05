import Board from './components/Board';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-neutral-900 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-neutral-900 tracking-tight">Kanban</span>
          </div>
          <span className="text-neutral-200">/</span>
          <span className="text-sm text-neutral-500">My Board</span>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-neutral-900 tracking-tight">My Board</h1>
          <p className="mt-0.5 text-sm text-neutral-400">Drag tasks between columns to update their status</p>
        </div>
        <Board />
      </main>
    </div>
  );
}
