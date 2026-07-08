export function formatEval(value: number) {
  if (Math.abs(value) >= 900) {
    return 'Mate';
  }

  return `${value > 0 ? '+' : ''}${value.toFixed(2)}`;
}

export function getEvalSideText(value: number) {
  if (Math.abs(value) < 0.2) {
    return 'Position is equal';
  }

  return value > 0
    ? 'White is better'
    : 'Black is better';
}

export function getEvalImpactText(
  previousValue: number | null,
  currentValue: number,
) {
  if (previousValue === null) {
    return 'Initial position';
  }

  const change = currentValue - previousValue;

  if (Math.abs(change) < 0.15) {
    return 'Evaluation stayed stable';
  }

  if (change > 0) {
    return 'Position improved for White';
  }

  return 'Position improved for Black';
}
