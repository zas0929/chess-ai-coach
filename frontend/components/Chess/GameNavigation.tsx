interface Props {
  currentPly: number;
  totalPly: number;
  isLive: boolean;
  playerColor: 'white' | 'black';
  onChooseSide: (color: 'white' | 'black' | 'random') => void;
  onUndo: () => void;
  onFlipBoard: () => void;
  onNewGame: () => void | Promise<void>;
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
}

export default function GameNavigation({
  currentPly,
  totalPly,
  isLive,
  playerColor,
  onChooseSide,
  onUndo,
  onFlipBoard,
  onNewGame,
  onFirst,
  onPrev,
  onNext,
  onLast,
}: Props) {
  const buttonClass =
    'inline-flex h-7 min-w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] px-1.5 text-xs text-zinc-200 transition hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-35';

  const sideButtonClass =
    'inline-flex h-7 items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 text-xs text-zinc-300 transition hover:bg-white/[0.09]';

  const activeSideClass =
    'border-violet-400/40 bg-violet-500/20 text-white';

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <span className="mr-0.5 text-[10px] uppercase tracking-widest text-zinc-500">
            Side
          </span>

          <button
            onClick={() => onChooseSide('white')}
            title="Play as White"
            className={[
              sideButtonClass,
              playerColor === 'white' ? activeSideClass : '',
            ].join(' ')}
          >
            <span>○</span>
            <span>White</span>
          </button>

          <button
            onClick={() => onChooseSide('black')}
            title="Play as Black"
            className={[
              sideButtonClass,
              playerColor === 'black' ? activeSideClass : '',
            ].join(' ')}
          >
            <span>●</span>
            <span>Black</span>
          </button>

          <button
            onClick={() => onChooseSide('random')}
            title="Random side"
            className={sideButtonClass}
          >
            <span>◌</span>
            <span>Random</span>
          </button>
        </div>

        <button
          onClick={onNewGame}
          title="New game"
          className="inline-flex h-7 shrink-0 items-center justify-center rounded-lg bg-violet-500 px-2.5 text-xs font-medium text-white transition hover:bg-violet-400"
        >
          New game
        </button>
      </div>

      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1">
          <button
            onClick={onFirst}
            disabled={currentPly === 0}
            title="First move"
            className={buttonClass}
          >
            ⏮
          </button>

          <button
            onClick={onPrev}
            disabled={currentPly === 0}
            title="Previous move"
            className={buttonClass}
          >
            ◀
          </button>

          <div className="h-7 min-w-12 rounded-lg border border-white/10 bg-white/[0.04] px-1.5 text-center text-xs leading-7 text-zinc-300">
            {currentPly}/{totalPly}
          </div>

          <button
            onClick={onNext}
            disabled={currentPly === totalPly}
            title="Next move"
            className={buttonClass}
          >
            ▶
          </button>

          <button
            onClick={onLast}
            disabled={currentPly === totalPly}
            title="Last move"
            className={buttonClass}
          >
            ⏭
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            title="Undo move"
            className={[buttonClass, 'gap-1 px-2'].join(' ')}
          >
            <span>↩</span>
            <span>Undo</span>
          </button>

          <button
            onClick={onFlipBoard}
            title="Flip board"
            className={[buttonClass, 'gap-1 px-2'].join(' ')}
          >
            <span>↻</span>
            <span>Flip</span>
          </button>
        </div>
      </div>

      {!isLive && (
        <div className="rounded-lg border border-violet-400/20 bg-violet-400/10 px-2 py-1 text-center text-[11px] text-violet-200">
          Review mode
        </div>
      )}
    </div>
  );
}
