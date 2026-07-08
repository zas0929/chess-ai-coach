import { api } from '@/lib/api';
import {
  EngineEvaluateRequest,
  EngineEvaluateResponse,
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

  async evaluate(
    request: EngineEvaluateRequest,
  ): Promise<EngineEvaluateResponse> {
    return (
      await api.post<EngineEvaluateResponse>(
        '/engine/evaluate',
        request,
      )
    ).data;
  },
};
