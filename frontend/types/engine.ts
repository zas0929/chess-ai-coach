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
  stats?: EngineStats;
}
