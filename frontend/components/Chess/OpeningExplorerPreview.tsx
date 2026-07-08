export default function OpeningExplorerPreview() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-300">
        Opening Explorer
      </h2>

      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm text-zinc-100">
            Italian Game: Giuoco Piano
          </div>

          <div className="mt-1 text-xs text-zinc-500">
            Moves: 1. e4 e5 2. Nf3 Nc6 3. Bc4
          </div>
        </div>

        <div className="text-sm text-zinc-400">
          Played: <span className="text-zinc-100">1.2M</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <OpeningStat label="White" value={54} tone="green" />
        <OpeningStat label="Draw" value={27} tone="neutral" />
        <OpeningStat label="Black" value={19} tone="red" />
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
  value: number;
  tone: 'green' | 'red' | 'neutral';
}) {
  const barColor =
    tone === 'green'
      ? 'bg-green-400'
      : tone === 'red'
        ? 'bg-red-400'
        : 'bg-zinc-500';

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-zinc-400">{label}</span>
        <span
          className={
            tone === 'green'
              ? 'text-green-400'
              : tone === 'red'
                ? 'text-red-400'
                : 'text-zinc-300'
          }
        >
          {value}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
