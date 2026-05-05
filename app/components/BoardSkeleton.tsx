const CARD_COUNTS = [2, 3, 1, 2];
const CARD_WIDTHS = [
  ['w-3/4', 'w-full'],
  ['w-full', 'w-4/5', 'w-2/3'],
  ['w-3/5'],
  ['w-4/5', 'w-full'],
];

function SkeletonCard({ width }: { width: string }) {
  return (
    <div className="bg-white rounded-xl border border-neutral-100 px-3.5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className={`h-2.5 bg-neutral-100 rounded-full animate-pulse ${width}`} />
      <div className="mt-2.5 h-2 w-10 bg-neutral-100 rounded-full animate-pulse" />
    </div>
  );
}

const DOTS = ['bg-neutral-300', 'bg-blue-200', 'bg-amber-200', 'bg-emerald-200'];
const LABELS = ['w-10', 'w-16', 'w-14', 'w-8'];

export default function BoardSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {Array.from({ length: 4 }).map((_, col) => (
        <div key={col} className="flex flex-col min-w-[272px] w-full max-w-[272px]">
          <div className="flex items-center gap-2 mb-3 px-0.5">
            <div className={`w-2 h-2 rounded-full ${DOTS[col]} animate-pulse`} />
            <div className={`h-3 ${LABELS[col]} bg-neutral-200 rounded-full animate-pulse`} />
            <div className="ml-auto h-4 w-5 bg-neutral-100 rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col gap-2 bg-neutral-100/50 rounded-2xl p-2 min-h-[160px]">
            {Array.from({ length: CARD_COUNTS[col] }).map((_, card) => (
              <SkeletonCard key={card} width={CARD_WIDTHS[col][card] ?? 'w-3/4'} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
