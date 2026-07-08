import { MoveClassification } from '@/types/evaluation';

interface Props {
  classification?: MoveClassification;
  small?: boolean;
}

const meta = {
  best: ['Best', 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20', 'bg-emerald-400'],
  excellent: ['Excellent', 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20', 'bg-cyan-400'],
  good: ['Good', 'bg-sky-500/15 text-sky-300 border-sky-500/20', 'bg-sky-400'],
  inaccuracy: ['Inaccuracy', 'bg-yellow-500/15 text-yellow-300 border-yellow-500/20', 'bg-yellow-400'],
  mistake: ['Mistake', 'bg-orange-500/15 text-orange-300 border-orange-500/20', 'bg-orange-400'],
  blunder: ['Blunder', 'bg-red-500/15 text-red-300 border-red-500/20', 'bg-red-500'],
} as const;

export default function MoveBadge({ classification, small }: Props) {
  if (!classification) return null;

  const [label, classes, dot] = meta[classification];

  return (
    <span
      className={[
        'inline-flex items-center rounded-lg border font-medium',
        small ? 'gap-1 px-2 py-1 text-xs' : 'gap-2 px-3 py-1.5 text-sm',
        classes,
      ].join(' ')}
    >
      <span className={['rounded-full', small ? 'h-1.5 w-1.5' : 'h-2 w-2', dot].join(' ')} />
      {label}
    </span>
  );
}
