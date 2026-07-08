import { MoveClassification } from '@/types/evaluation';

interface Props {
  classification?: MoveClassification;
  small?: boolean;
}

const meta = {
  best: {
    label: 'Best',
    dot: 'bg-emerald-400',
    text: 'text-emerald-300',
    bg: 'bg-emerald-500/12',
    border: 'border-emerald-500/20',
  },

  excellent: {
    label: 'Excellent',
    dot: 'bg-cyan-400',
    text: 'text-cyan-300',
    bg: 'bg-cyan-500/12',
    border: 'border-cyan-500/20',
  },

  good: {
    label: 'Good',
    dot: 'bg-sky-400',
    text: 'text-sky-300',
    bg: 'bg-sky-500/12',
    border: 'border-sky-500/20',
  },

  inaccuracy: {
    label: 'Inaccuracy',
    dot: 'bg-yellow-400',
    text: 'text-yellow-300',
    bg: 'bg-yellow-500/12',
    border: 'border-yellow-500/20',
  },

  mistake: {
    label: 'Mistake',
    dot: 'bg-orange-400',
    text: 'text-orange-300',
    bg: 'bg-orange-500/12',
    border: 'border-orange-500/20',
  },

  blunder: {
    label: 'Blunder',
    dot: 'bg-red-500',
    text: 'text-red-300',
    bg: 'bg-red-500/12',
    border: 'border-red-500/20',
  },
} satisfies Record<
  MoveClassification,
  {
    label: string;
    dot: string;
    text: string;
    bg: string;
    border: string;
  }
>;

export default function MoveBadge({
  classification,
  small,
}: Props) {
  if (!classification) {
    return null;
  }

  const style = meta[classification];

  return (
    <div
      className={[
        'inline-flex items-center rounded-lg border px-3 font-medium',
        style.bg,
        style.border,
        style.text,
        small
          ? 'gap-1 py-1 text-xs'
          : 'gap-2 py-1.5 text-sm',
      ].join(' ')}
    >
      <span
        className={[
          'rounded-full',
          style.dot,
          small ? 'h-1.5 w-1.5' : 'h-2 w-2',
        ].join(' ')}
      />

      {style.label}
    </div>
  );
}
