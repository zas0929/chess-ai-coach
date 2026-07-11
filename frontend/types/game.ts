import { EvaluationPoint } from '@/types/evaluation';
import { EngineSettings } from '@/types/engine';

export interface LastMove {
  from: string;
  to: string;
}

export interface GameSnapshot {
  fen: string;
  moves: string[];
  player_color: 'white' | 'black';
  evaluation: number;
  evaluation_history: EvaluationPoint[];
  last_move: LastMove | null;
  game_status:
    | 'playing'
    | 'check'
    | 'checkmate'
    | 'draw'
    | 'stalemate';
  winner: 'white' | 'black' | null;
  settings: EngineSettings;
}

export interface ActiveGame extends GameSnapshot {
  id: string;
  status: 'active' | 'completed';
  updated_at: string;
}

export interface PlayerStats {
  games_played: number;
  active_games: number;
  completed_games: number;
  wins: number;
  losses: number;
  draws: number;
  ai_requests: number;
  total_tokens: number;
  level: number;
}
