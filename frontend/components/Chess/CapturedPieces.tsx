import { CapturedPiece } from '@/utils/material';

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
    <div className="my-2 flex h-10 items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 shadow-lg">
      <div className="flex min-w-0 items-center gap-3">
        <span className="w-12 shrink-0 text-sm text-zinc-300">
          {label}
        </span>

        <div className="flex min-w-0 items-center gap-0.5 overflow-hidden text-2xl leading-none">
          {pieces.length > 0 ? (
            pieces.map((piece, index) => (
              <span
                key={`${piece}-${index}`}
                className="-mr-0.5 shrink-0"
              >
                {pieceSymbols[color][piece]}
              </span>
            ))
          ) : (
            <span className="text-sm text-zinc-600">—</span>
          )}
        </div>
      </div>

      {advantage > 0 && (
        <div className="ml-3 shrink-0 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
          +{advantage}
        </div>
      )}
    </div>
  );
}
