import { api } from '@/lib/api';
import {
  EngineMoveRequest,
  EngineMoveResponse,
} from '@/types/engine';

export const EngineService = {
  async getBestMove(
    request: EngineMoveRequest,
  ): Promise<EngineMoveResponse> {
    return (
      await api.post<EngineMoveResponse>(
        '/engine/move',
        request,
      )
    ).data;
  },
};
