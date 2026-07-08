import { EvaluationPoint } from '@/types/evaluation';
import { CoachResponse } from '@/types/coach';

export const CoachService = {
  explain(point: EvaluationPoint): CoachResponse {
    switch (point.classification) {
      case 'best':
        return {
          title: 'Excellent move',
          explanation:
            'You found the strongest continuation according to the engine.',
          tip:
            'Continue looking for forcing moves such as checks, captures and threats.',
          severity: 'success',
        };

      case 'excellent':
        return {
          title: 'Very strong move',
          explanation:
            'Your move keeps the initiative and maintains the evaluation.',
          tip:
            'Keep improving your piece activity.',
          severity: 'success',
        };

      case 'good':
        return {
          title: 'Good move',
          explanation:
            'A solid move. There was a slightly stronger continuation available.',
          tip:
            'Before moving, compare two or three candidate moves.',
          severity: 'info',
        };

      case 'inaccuracy':
        return {
          title: 'Inaccuracy',
          explanation:
            'The move is playable, but you missed a stronger continuation.',
          tip:
            'Slow down when the position becomes tactical.',
          severity: 'warning',
        };

      case 'mistake':
        return {
          title: 'Mistake',
          explanation:
            'This move noticeably worsened your position.',
          tip:
            'Ask yourself: "What is my opponent threatening?" before every move.',
          severity: 'danger',
        };

      case 'blunder':
        return {
          title: 'Blunder',
          explanation:
            'A serious mistake that changes the evaluation significantly.',
          tip:
            'Spend extra time checking tactical ideas before committing.',
          severity: 'danger',
        };

      default:
        return {
          title: 'Position',
          explanation: '',
          tip: '',
          severity: 'info',
        };
    }
  },
};
