import { CapturedPiece } from '@/utils/chess/material';

interface Props {
  label: string;
  color: 'white' | 'black';
  pieces: CapturedPiece[];
  advantage?: number;
}

const pieceSymbols: Record<
  'white' | 'black',
  Record<CapturedPiece, string>
> = {
  white: {
    p: '♙',
    n: '♘',
    b: '♗',
    r: '♖',
    q: '♕',
    k: '♔',
  },
  black: {
    p: '♟',
    n: '♞',
    b: '♝',
    r: '♜',
    q: '♛',
    k: '♚',
  },
};

export default function CapturedPieces({
  label,
  color,
  pieces,
  advantage = 0,
}: Props) {
  return (
    <div className="mb-3 flex min-h-14 items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 shadow-xl">
      <div className="flex items-center gap-5">
        <span className="w-12 text-sm text-zinc-300">
          {label}
        </span>

        <div className="flex items-center gap-1 text-3xl leading-none">
          {pieces.length > 0 ? (
            pieces.map((piece, index) => (
              <span key={`${piece}-${index}`}>
                {pieceSymbols[color][piece]}
              </span>
            ))
          ) : (
            <span className="text-sm text-zinc-600">—</span>
          )}
        </div>
      </div>

      {advantage > 0 && (
        <div className="rounded-lg bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300">
          +{advantage}
        </div>
      )}
    </div>
  );
}
