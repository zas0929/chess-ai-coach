interface Props {
  playerColor: 'white' | 'black';
  onChooseSide: (color: 'white' | 'black' | 'random') => void;
  onFlipBoard: () => void;
  onNewGame: () => void;
}

export default function TopGameBar({
  playerColor,
  onChooseSide,
  onFlipBoard,
  onNewGame,
}: Props) {
  const buttonClass =
    'rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm transition hover:bg-white/[0.09]';

  const activeClass =
    'border-violet-400/40 bg-violet-500/25 text-white';

  return (
    <div className="mb-4 flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-4 shadow-2xl">
      <div className="flex items-center gap-3">
        <span className="text-sm text-zinc-300">
          Play as
        </span>

        <button
          onClick={() => onChooseSide('white')}
          className={[
            buttonClass,
            playerColor === 'white' ? activeClass : '',
          ].join(' ')}
        >
          ⚪ White
        </button>

        <button
          onClick={() => onChooseSide('black')}
          className={[
            buttonClass,
            playerColor === 'black' ? activeClass : '',
          ].join(' ')}
        >
          ⚫ Black
        </button>

        <button
          onClick={() => onChooseSide('random')}
          className={buttonClass}
        >
          ◌ Random
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onFlipBoard}
          className={buttonClass}
        >
          Flip Board ↻
        </button>

        <button
          onClick={onNewGame}
          className="rounded-xl bg-violet-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-400"
        >
          New Game
        </button>
      </div>
    </div>
  );
}
