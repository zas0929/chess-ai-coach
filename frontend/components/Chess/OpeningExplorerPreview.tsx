interface Props {
  opening?: string;
  moveCount: number;
}

const openingStats: Record<
  string,
  {
    played: string;
    white: number;
    draw: number;
    black: number;
  }
> = {
  'Italian Game': {
    played: '1.2M',
    white: 54,
    draw: 27,
    black: 19,
  },
  'Ruy Lopez': {
    played: '2.4M',
    white: 52,
    draw: 31,
    black: 17,
  },
  'Sicilian Defense': {
    played: '3.1M',
    white: 49,
    draw: 24,
    black: 27,
  },
  'French Defense': {
    played: '940K',
    white: 48,
    draw: 29,
    black: 23,
  },
  'Caro-Kann Defense': {
    played: '820K',
    white: 47,
    draw: 33,
    black: 20,
  },
  "Queen's Gambit": {
    played: '1.8M',
    white: 55,
    draw: 28,
    black: 17,
  },
  'Reti Opening': {
    played: '760K',
    white: 53,
    draw: 30,
    black: 17,
  },
  'Van Geet Opening': {
    played: '120K',
    white: 51,
    draw: 26,
    black: 23,
  },
  "King's Fianchetto Opening": {
    played: '180K',
    white: 50,
    draw: 31,
    black: 19,
  },
  'Nimzowitsch-Larsen Attack': {
    played: '210K',
    white: 52,
    draw: 27,
    black: 21,
  },
};

export default function OpeningExplorerPreview({
  opening,
  moveCount,
}: Props) {
  const stats = opening ? openingStats[opening] : undefined;
  const hasMoves = moveCount > 0;
  const metaLabel = stats
    ? `Games: ${stats.played}`
    : hasMoves
      ? 'Mini book'
      : 'Waiting';

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 shadow-lg">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-300">
          Opening Explorer
        </h2>

        <div className="shrink-0 text-[11px] text-zinc-500">
          {metaLabel}
        </div>
      </div>

      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-zinc-100">
          {opening ??
            (hasMoves
              ? 'Book line pending'
              : 'Play first moves')}
        </div>
      </div>

      <div className="mt-1.5 grid grid-cols-3 gap-2 text-[11px]">
        <OpeningStat
          label="White"
          value={stats?.white}
          tone="green"
        />
        <OpeningStat
          label="Draw"
          value={stats?.draw}
          tone="neutral"
        />
        <OpeningStat
          label="Black"
          value={stats?.black}
          tone="red"
        />
      </div>
    </div>
  );
}

function OpeningStat({
  label,
  value,
  tone,
}: {
  label: string;
  value?: number;
  tone: 'green' | 'red' | 'neutral';
}) {
  const hasValue = typeof value === 'number';
  const barColor =
    !hasValue
      ? 'bg-white/20'
      : tone === 'green'
      ? 'bg-green-400'
      : tone === 'red'
        ? 'bg-red-400'
        : 'bg-zinc-500';

  return (
    <div>
      <div className="mb-0.5 flex items-center justify-between">
        <span className="text-zinc-400">{label}</span>
        <span
          className={[
            tone === 'green'
              ? 'text-green-400'
              : tone === 'red'
                ? 'text-red-400'
                : 'text-zinc-300',
            hasValue ? '' : 'text-zinc-600',
          ].join(' ')}
        >
          {hasValue ? `${value}%` : '—'}
        </span>
      </div>

      <div className="h-1 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: hasValue ? `${value}%` : '100%' }}
        />
      </div>
    </div>
  );
}
