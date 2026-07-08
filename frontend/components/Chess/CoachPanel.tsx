import MoveBadge from '@/components/Chess/MoveBadge';
import { CoachService } from '@/services/ coach.service';
import { EvaluationPoint } from '@/types/evaluation';

interface Props {
  point?: EvaluationPoint;
}

export default function CoachPanel({
  point,
}: Props) {
  
  if (!point || point.ply === 0) {
    return (
      <div>
        <SectionTitle />

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-zinc-400">
            Play your first move to start the analysis.
          </div>
        </div>
      </div>
    );
  }

  const coach = CoachService.explain(point)

  return (
    <div>
      <SectionTitle />

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="font-semibold text-white">
            Move {point.ply}
          </div>

          <MoveBadge
            classification={point.classification}
            small
          />
        </div>

        <div className="text-lg font-semibold text-white">
          {point.move}
        </div>

        <div className="mt-4 text-sm leading-6 text-zinc-400">
          {coach.title}
        </div>
      </div>

      {point.bestMove && (
        <div className="mt-4 rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
          <div className="text-xs uppercase tracking-widest text-green-300">
            Best Move
          </div>

          <div className="mt-2 text-xl font-semibold text-green-300">
            {point.bestMove}
          </div>
        </div>
      )}

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">

        <div className="text-xs uppercase tracking-widest text-zinc-500">
          {coach.tip}
        </div>

        <div className="mt-3 text-sm leading-6 text-zinc-300">
          {coach.explanation}
        </div>
      </div>

      <button
        className="mt-5 w-full rounded-2xl border border-violet-500/30 bg-violet-500/15 py-3 text-sm font-medium text-violet-300 transition hover:bg-violet-500/25"
      >
        ✨ Explain this move
      </button>
    </div>
  );
}

function SectionTitle() {
  return (
    <div className="mb-5">
      <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">
        AI Coach
      </div>

      <div className="mt-2 text-2xl font-semibold text-white">
        Your Assistant
      </div>
    </div>
  );
}

function buildExplanation(point: EvaluationPoint) {
  switch (point.classification) {
    case 'best':
      return 'Excellent move. You found the strongest continuation according to the engine.';

    case 'excellent':
      return 'Very strong move. You maintained your advantage.';

    case 'good':
      return 'A solid move that keeps the position comfortable.';

    case 'inaccuracy':
      return 'This move is playable, but there was a stronger continuation available.';

    case 'mistake':
      return 'This move gives away part of your advantage. Consider the suggested engine move.';

    case 'blunder':
      return 'A serious mistake that changes the evaluation significantly.';

    default:
      return 'Position analyzed.';
  }
}

function buildTip(point: EvaluationPoint) {
  if (point.classification === 'best') {
    return 'Keep looking for forcing moves like checks, captures and threats.';
  }

  if (
    point.classification === 'mistake' ||
    point.classification === 'blunder'
  ) {
    return 'Before making a move, quickly check if your opponent has any tactical responses.';
  }

  return 'Continue developing your pieces and improve coordination.';
}
