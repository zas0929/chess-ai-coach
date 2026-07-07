import { api } from '@/lib/api';

export const EngineService = {
  async getBestMove(data: {
    fen: string;
  }) {
    const response = await api.post(
      '/engine/move',
      data,
    );

    return response.data;
  },
};
