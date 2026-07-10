type GameStatusType =
  | 'playing'
  | 'check'
  | 'checkmate'
  | 'draw'
  | 'stalemate';

interface Props {
  status: GameStatusType;
  winner: 'white' | 'black' | null;
  onNewGame: () => void;
}

const statusCopy = {
  playing: {
    title: 'Game in progress',
    description: 'Keep playing.',
  },
  check: {
    title: 'Check',
    description: 'The king is under attack.',
  },
  checkmate: {
    title: 'Checkmate',
    description: 'The game is over.',
  },
  draw: {
    title: 'Draw',
    description: 'The game ended in a draw.',
  },
  stalemate: {
    title: 'Stalemate',
    description: 'No legal moves, but the king is not in check.',
  },
};

const statusTone = {
  playing: {
    frame: 'border-white/10 bg-[#0b1118]/95 shadow-black/40',
    dot: 'bg-zinc-400 shadow-zinc-400/40',
    label: 'text-zinc-500',
    title: 'text-zinc-100',
  },
  check: {
    frame:
      'border-amber-300/40 bg-amber-500/[0.13] shadow-amber-500/25',
    dot: 'bg-amber-300 shadow-amber-300/70',
    label: 'text-amber-200/80',
    title: 'text-amber-100',
  },
  checkmate: {
    frame:
      'border-red-300/45 bg-red-500/[0.16] shadow-red-500/30',
    dot: 'bg-red-300 shadow-red-300/80',
    label: 'text-red-200/80',
    title: 'text-red-100',
  },
  draw: {
    frame:
      'border-sky-300/35 bg-sky-500/[0.13] shadow-sky-500/25',
    dot: 'bg-sky-300 shadow-sky-300/70',
    label: 'text-sky-200/80',
    title: 'text-sky-100',
  },
  stalemate: {
    frame:
      'border-violet-300/40 bg-violet-500/[0.14] shadow-violet-500/25',
    dot: 'bg-violet-300 shadow-violet-300/70',
    label: 'text-violet-200/80',
    title: 'text-violet-100',
  },
};

export default function GameStatus({
  status,
  winner,
  onNewGame,
}: Props) {
  if (status === 'playing') {
    return null;
  }

  const tone = statusTone[status];

  return (
    <div
      className={[
        'fixed left-1/2 top-4 z-[120] -translate-x-1/2 rounded-2xl border px-4 py-2.5 shadow-2xl backdrop-blur-md ring-1 ring-white/10',
        tone.frame,
      ].join(' ')}
    >
      <div className="flex items-center gap-3">
        <span
          className={[
            'h-2.5 w-2.5 shrink-0 rounded-full shadow-[0_0_16px]',
            tone.dot,
          ].join(' ')}
        />

        <div>
          <div
            className={[
              'text-[10px] font-semibold uppercase tracking-widest',
              tone.label,
            ].join(' ')}
          >
            Game Status
          </div>

          <div className="flex items-center gap-2">
            <div
              className={[
                'text-sm font-semibold',
                tone.title,
              ].join(' ')}
            >
              {statusCopy[status].title}
            </div>

            <div className="text-xs text-zinc-200/80">
              {winner
                ? `${winner === 'white' ? 'White' : 'Black'} wins`
                : statusCopy[status].description}
            </div>
          </div>
        </div>

        {(status === 'checkmate' ||
          status === 'draw' ||
          status === 'stalemate') && (
          <button
            onClick={onNewGame}
            className="rounded-lg border border-white/15 bg-white/[0.1] px-3 py-1.5 text-xs font-medium text-zinc-100 transition hover:bg-white/[0.16]"
          >
            New game
          </button>
        )}
      </div>
    </div>
  );
}
