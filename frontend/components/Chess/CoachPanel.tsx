import MoveBadge from '@/components/Chess/MoveBadge';
import { CoachService } from '@/services/coach.service';
import { EvaluationPoint } from '@/types/evaluation';
import { formatEval } from '@/utils/evaluationText';

interface Props {
  point?: EvaluationPoint;
}

const severityClass = {
  success: 'border-emerald-500/20 bg-emerald-500/10',
  info: 'border-sky-500/20 bg-sky-500/10',
  warning: 'border-yellow-500/20 bg-yellow-500/10',
  danger: 'border-red-500/20 bg-red-500/10',
};

export default function CoachPanel({ point }: Props) {
  if (!point || point.ply === 0) {
    return (
      <div>
        <SectionTitle />

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-400">
          Play your first move to start the analysis.
        </div>
      </div>
    );
  }

  const coach = CoachService.explain(point);

  return (
    <div>
      <SectionTitle />

      <div
        className={[
          'rounded-2xl border p-4',
          severityClass[coach.severity],
        ].join(' ')}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-500">
              Move {point.ply}
            </div>

            <div className="mt-1 text-2xl font-semibold text-white">
              {point.move}
            </div>
          </div>

          <MoveBadge
            classification={point.classification}
            small
          />
        </div>

        <div className="mt-4 text-lg font-semibold text-white">
          {coach.title}
        </div>

        <div className="mt-2 text-sm leading-6 text-zinc-300">
          {coach.explanation}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="text-xs uppercase tracking-widest text-zinc-500">
          Evaluation
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          <MiniStat
            label="Before"
            value={
              point.previousValue === null
                ? '—'
                : formatEval(point.previousValue)
            }
          />

          <MiniStat
            label="After"
            value={formatEval(point.value)}
            tone={point.value >= 0 ? 'positive' : 'negative'}
          />

          <MiniStat
            label="Change"
            value={`${point.evalChange > 0 ? '+' : ''}${point.evalChange.toFixed(2)}`}
            tone={point.evalChange >= 0 ? 'positive' : 'negative'}
          />
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
          Coach Tip
        </div>

        <div className="mt-3 text-sm leading-6 text-zinc-300">
          {coach.tip}
        </div>
      </div>

      <button className="mt-5 w-full rounded-2xl border border-violet-500/30 bg-violet-500/15 py-3 text-sm font-medium text-violet-300 transition hover:bg-violet-500/25">
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

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'positive' | 'negative';
}) {
  return (
    <div className="rounded-xl bg-white/[0.04] px-3 py-2">
      <div className="text-[11px] text-zinc-500">
        {label}
      </div>

      <div
        className={[
          'mt-1 font-medium',
          tone === 'positive'
            ? 'text-green-400'
            : tone === 'negative'
              ? 'text-red-400'
              : 'text-zinc-200',
        ].join(' ')}
      >
        {value}
      </div>
    </div>
  );
}
