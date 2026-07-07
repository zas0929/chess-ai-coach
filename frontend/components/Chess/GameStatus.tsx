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

export default function GameStatus({
  status,
  winner,
  onNewGame,
}: Props) {
  if (status === 'playing') {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-zinc-300">
        Game Status
      </h2>

      <div className="text-2xl font-semibold">
        {statusCopy[status].title}
      </div>

      <p className="mt-2 text-sm text-zinc-400">
        {winner
          ? `${winner === 'white' ? 'White' : 'Black'} wins.`
          : statusCopy[status].description}
      </p>

      {(status === 'checkmate' ||
        status === 'draw' ||
        status === 'stalemate') && (
        <button
          onClick={onNewGame}
          className="mt-4 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm hover:bg-white/[0.09]"
        >
          Start new game
        </button>
      )}
    </div>
  );
}
