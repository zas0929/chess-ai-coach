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
  fenBefore: string;
  move: string;
  moveNumber: number;
  side: 'white' | 'black';
  player: 'white' | 'black';
  engine: 'white' | 'black';
  opening?: string;
  history: string[];
  value: number;
  previousValue: number | null;
  evalChange: number;
  bestMove?: string;
  source: EvaluationSource;
  classification?: MoveClassification;
}
