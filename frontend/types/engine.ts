export interface EngineSettings {
  skill_level: number;
  move_time: number;
  depth: number;
}

export interface EngineMoveRequest {
  fen: string;
  settings?: EngineSettings;
}

export interface EngineEvaluateRequest {
  fen: string;
  settings?: EngineSettings;
}

export interface Evaluation {
  type: 'cp' | 'mate';
  value: number;
}

export interface EngineStats {
  time: number;
  skill_level: number;
  depth: number;
  move_time?: number;
}

export interface EngineMoveResponse {
  move: string;
  evaluation: Evaluation;
  stats?: EngineStats;
}

export interface EngineEvaluateResponse {
  evaluation: Evaluation;
  best_move?: string;
  stats?: EngineStats;
}

export interface EngineAnalyzeMoveRequest {
  fen_before: string;
  fen_after: string;
  settings?: EngineSettings;
}

export interface EngineAnalyzeMoveResponse {
  evaluation: Evaluation;
  best_move?: string;
  stats?: EngineStats;
}

export interface EngineInsightRequest {
  fen: string;
  settings?: EngineSettings;
  multipv?: number;
}

export interface EngineLine {
  move: string;
  evaluation: Evaluation;
  line: string[];
}

export interface EngineInsightResponse {
  fen: string;
  evaluation: Evaluation;
  best_move?: string | null;
  top_moves: EngineLine[];
  stats: EngineStats & {
    multipv: number;
  };
}
