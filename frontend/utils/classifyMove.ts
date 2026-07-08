import { MoveClassification } from '@/types/evaluation';

export function classifyMoveByEvalDrop(
  previousValue: number,
  currentValue: number,
  source: 'player' | 'engine',
): MoveClassification {
  const evalDrop =
    source === 'player'
      ? previousValue - currentValue
      : currentValue - previousValue;

  if (evalDrop <= 0.1) {
    return 'best';
  }

  if (evalDrop <= 0.3) {
    return 'excellent';
  }

  if (evalDrop <= 0.7) {
    return 'good';
  }

  if (evalDrop <= 1.5) {
    return 'inaccuracy';
  }

  if (evalDrop <= 3) {
    return 'mistake';
  }

  return 'blunder';
}
