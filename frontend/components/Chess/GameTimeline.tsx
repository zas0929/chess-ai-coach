interface Props {
  moveCount: number;
}

export default function GameTimeline({ moveCount }: Props) {
  const moveNumber = Math.max(1, Math.ceil(moveCount / 2));
  const phase =
    moveCount < 12
      ? 'Opening'
      : moveCount < 35
        ? 'Middlegame'
        : 'Endgame';

  const progress = Math.min(100, Math.max(5, (moveCount / 50) * 100));

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-1.5 shadow-lg">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <h2 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-300">
          Game Timeline
        </h2>

        <div className="text-[10px] text-zinc-500">
          Move {moveNumber}
        </div>
      </div>

      <div className="relative mb-1 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="absolute left-0 top-0 h-full w-[28%] bg-green-400" />
        <div className="absolute left-[28%] top-0 h-full w-[42%] bg-yellow-400" />
        <div className="absolute left-[70%] top-0 h-full w-[30%] bg-zinc-500" />

        <div
          className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-white bg-violet-500 shadow-lg"
          style={{ left: `calc(${progress}% - 5px)` }}
        />
      </div>

      <div className="grid grid-cols-3 text-center text-[10px] leading-4 text-zinc-500">
        <span className={phase === 'Opening' ? 'text-zinc-100' : ''}>
          Opening
        </span>
        <span className={phase === 'Middlegame' ? 'text-zinc-100' : ''}>
          Middlegame
        </span>
        <span className={phase === 'Endgame' ? 'text-zinc-100' : ''}>
          Endgame
        </span>
      </div>
    </div>
  );
}
