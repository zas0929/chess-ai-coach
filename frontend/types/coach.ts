export type CoachSeverity =
  | 'success'
  | 'info'
  | 'warning'
  | 'danger';

export interface CoachResponse {
  title: string;
  explanation: string;
  tip: string;
  severity: CoachSeverity;
}

export interface CoachExplainRequest {
  fen: string;
  move: string;
  bestMove?: string;
  classification?: string;
  previousValue: number | null;
  value: number;
  evalChange: number;
}

export interface CoachExplainResponse {
  explanation: string;
}
