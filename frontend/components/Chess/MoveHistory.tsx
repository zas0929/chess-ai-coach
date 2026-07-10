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
            className="grid grid-cols-[36px_minmax(0,1fr)_minmax(0,1fr)] gap-2 rounded-xl px-2 py-1.5 text-sm hover:bg-white/[0.05]"
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

  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg px-2 py-1">
      <span className="truncate font-medium text-zinc-100">
        {san}
      </span>

      <MoveBadge
        classification={point?.classification}
        small
      />
    </div>
  );
}
