interface Props {
  onNewGame: () => void;
  onUndo: () => void;
}

export default function ChessControls({
  onNewGame,
  onUndo,
}: Props) {
  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-300">
        Controls
      </h2>

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
      </div>
    </div>
  );
}
