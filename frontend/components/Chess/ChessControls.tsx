interface Props {
  playerColor: 'white' | 'black';
  onNewGame: () => void;
  onUndo: () => void;
  onFlipBoard: () => void;
  onChooseSide: (color: 'white' | 'black' | 'random') => void;
}

export default function ChessControls({
  playerColor,
  onNewGame,
  onUndo,
  onFlipBoard,
  onChooseSide,
}: Props) {
  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-300">
        Controls
      </h2>

      <div className="mb-4">
        <div className="mb-2 text-sm text-zinc-400">
          Play as: <span className="text-zinc-100">{playerColor}</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onChooseSide('white')}
            className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm hover:bg-white/[0.09]"
          >
            White
          </button>

          <button
            onClick={() => onChooseSide('black')}
            className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm hover:bg-white/[0.09]"
          >
            Black
          </button>

          <button
            onClick={() => onChooseSide('random')}
            className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm hover:bg-white/[0.09]"
          >
            Random
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onNewGame}
          className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm hover:bg-white/[0.09]"
        >
          ⊕ New Game
        </button>

        <button
          onClick={onUndo}
          className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm hover:bg-white/[0.09]"
        >
          ↩ Undo Move
        </button>

        <button
          onClick={onFlipBoard}
          className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm hover:bg-white/[0.09]"
        >
          ⇄ Flip Board
        </button>
      </div>
    </div>
  );
}
