import { EvaluationPoint, MoveClassification } from '@/types/evaluation';
import MoveBadge from '@/components/Chess/MoveBadge';

interface Props {
  moves: string[];
  evaluationHistory: EvaluationPoint[];
}

const classificationMeta: Record<
  MoveClassification,
  {
    label: string;
    dotClass: string;
  }
> = {
  best: {
    label: 'Best',
    dotClass: 'bg-cyan-400',
  },
  excellent: {
    label: 'Excellent',
    dotClass: 'bg-emerald-400',
  },
  good: {
    label: 'Good',
    dotClass: 'bg-green-500',
  },
  inaccuracy: {
    label: 'Inaccuracy',
    dotClass: 'bg-yellow-400',
  },
  mistake: {
    label: 'Mistake',
    dotClass: 'bg-orange-400',
  },
  blunder: {
    label: 'Blunder',
    dotClass: 'bg-red-500',
  },
};

export default function MoveHistory({
  moves,
  evaluationHistory,
}: Props) {
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

  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-300">
        Moves
      </h2>

      <div className="max-h-[360px] space-y-1 overflow-auto pr-2">
        {rows.map((row) => (
          <div
            key={row.number}
            className="grid grid-cols-[36px_1fr_1fr] gap-2 rounded-xl px-2 py-1.5 text-sm hover:bg-white/[0.05]"
          >
            <span className="text-zinc-500">
              {row.number}.
            </span>

            <MoveCell
              san={row.white.san}
              point={row.white.point}
            />

            <MoveCell
              san={row.black.san}
              point={row.black.point}
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
}: {
  san: string;
  point?: EvaluationPoint;
}) {
  if (!san) {
    return <span />;
  }

  const classification = point?.classification;
  const meta = classification
    ? classificationMeta[classification]
    : null;

  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg px-2 py-1">
      <MoveBadge
          classification={point?.classification}
          small
      />

      <span className="truncate font-medium text-zinc-100">
        {san}
      </span>

      {meta && (
        <span className="hidden truncate text-xs text-zinc-500 2xl:inline">
          {meta.label}
        </span>
      )}
    </div>
  );
}
