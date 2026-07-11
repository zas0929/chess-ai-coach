import { api } from '@/lib/api';
import {
  ActiveGame,
  GameSnapshot,
  PlayerStats,
} from '@/types/game';

export const GameService = {
  async getActiveGame(): Promise<ActiveGame | null> {
    return (
      await api.get<ActiveGame | null>('/games/active')
    ).data;
  },

  async saveActiveGame(
    snapshot: GameSnapshot,
  ): Promise<ActiveGame> {
    return (
      await api.put<ActiveGame>('/games/active', snapshot)
    ).data;
  },

  async startNewGame(
    snapshot: GameSnapshot,
  ): Promise<ActiveGame> {
    return (
      await api.post<ActiveGame>('/games/new', snapshot)
    ).data;
  },

  async getStats(): Promise<PlayerStats> {
    return (
      await api.get<PlayerStats>('/games/stats')
    ).data;
  },
};
