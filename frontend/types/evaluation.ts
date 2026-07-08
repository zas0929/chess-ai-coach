export type EvaluationSource = 'player' | 'engine';

export type MoveClassification =
  | 'best'
  | 'excellent'
  | 'good'
  | 'inaccuracy'
  | 'mistake'
  | 'blunder';

export interface EvaluationPoint {
  ply: number;
  fen: string;
  move: string;
  value: number;
  previousValue: number | null;
  evalChange: number;
  bestMove?: string;
  source: EvaluationSource;
  classification?: MoveClassification;
}
