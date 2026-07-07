export interface EngineMoveRequest {
  fen: string;
}

export interface Evaluation {
  type: 'cp' | 'mate';
  value: number;
}

export interface EngineMoveResponse {
  move: string;
  evaluation: Evaluation;
}

export interface MoveHistoryItem {
  san: string;
  color: 'w' | 'b';
}
