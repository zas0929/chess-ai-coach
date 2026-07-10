'use client';

import { useEffect, useRef } from 'react';

import { EvaluationPoint } from '@/types/evaluation';
import MoveBadge from '@/components/Chess/MoveBadge';

interface Props {
  moves: string[];
  evaluationHistory: EvaluationPoint[];
}

export default function MoveHistory({
  moves,
  evaluationHistory,
}: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const movePoints = evaluationHistory.filter(
    (point) => point.ply > 0,
  );

  const getPointByPly = (ply: number) =>
    movePoints.find((point) => point.ply === ply);

  const rows = [];

  for (let i = 0; i < moves.length; i += 2) {
    rows.push({
      number: i / 2 + 1,
      white: {
        san: moves[i],
        point: getPointByPly(i + 1),
      },
      black: {
        san: moves[i + 1] ?? '',
        point: getPointByPly(i + 2),
      },
    });
  }

  useEffect(() => {
    const scrollNode = scrollRef.current;

    if (!scrollNode) {
      return;
    }

    scrollNode.scrollTo({
      top: scrollNode.scrollHeight,
      behavior: 'smooth',
    });
  }, [moves.length]);

  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-300">
            Moves
          </h2>
          <div className="mt-1 text-xs text-zinc-500">
            {moves.length} plies · {rows.length} moves
          </div>
        </div>

        <div className="text-xs text-zinc-500">
          White / Black
        </div>
      </div>

      <div className="mb-1 grid grid-cols-[32px_minmax(0,1fr)_minmax(0,1fr)] gap-2 px-2 text-[10px] uppercase tracking-widest text-zinc-600">
        <span className="text-center">#</span>
        <span>White</span>
        <span>Black</span>
      </div>

      <div
        ref={scrollRef}
        className="max-h-[360px] space-y-1 overflow-auto pr-2"
      >
        {rows.map((row) => (
          <div
            key={row.number}
            className="grid grid-cols-[32px_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2 rounded-xl px-2 py-1 text-sm hover:bg-white/[0.05]"
          >
            <span className="flex h-8 items-center justify-center text-xs tabular-nums text-zinc-500">
              {row.number}.
            </span>

            <MoveCell
              san={row.white.san}
              point={row.white.point}
              side="white"
            />

            <MoveCell
              san={row.black.san}
              point={row.black.point}
              side="black"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function MoveCell({
  san,
  point,
  side,
}: {
  san: string;
  point?: EvaluationPoint;
  side: 'white' | 'black';
}) {
  if (!san) {
    return <span />;
  }

  return (
    <div className="grid min-h-8 min-w-0 grid-cols-[76px_minmax(96px,1fr)] items-center gap-2 rounded-lg px-2 py-1">
      <span className="flex min-w-0 items-center gap-1.5">
        <span
          className={[
            'w-4 shrink-0 text-center text-base leading-none',
            side === 'white' ? 'text-zinc-100' : 'text-zinc-500',
          ].join(' ')}
        >
          {getMovePieceIcon(san)}
        </span>
        <span className="truncate font-medium tabular-nums text-zinc-100">
          {san}
        </span>
      </span>

      <span className="flex min-w-0 justify-start">
        <MoveBadge
          classification={point?.classification}
          small
        />
      </span>
    </div>
  );
}

function getMovePieceIcon(san: string) {
  const normalized = san.replace(/[+#?!]+$/g, '');

  if (normalized.startsWith('O-O')) {
    return '♚';
  }

  const piece = normalized[0];

  const icons = {
    K: '♚',
    Q: '♛',
    R: '♜',
    B: '♝',
    N: '♞',
    P: '♟',
  };

  if (
    piece === 'K' ||
    piece === 'Q' ||
    piece === 'R' ||
    piece === 'B' ||
    piece === 'N'
  ) {
    return icons[piece];
  }

  return icons.P;
}
