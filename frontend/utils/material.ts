import { Chess, PieceSymbol } from 'chess.js';

export type CapturedPiece = PieceSymbol;

export interface MaterialState {
  whiteCaptured: CapturedPiece[];
  blackCaptured: CapturedPiece[];
  whiteCapturedValue: number;
  blackCapturedValue: number;
  advantage: {
    side: 'white' | 'black' | null;
    value: number;
  };
}

const initialCounts: Record<PieceSymbol, number> = {
  p: 8,
  n: 2,
  b: 2,
  r: 2,
  q: 1,
  k: 1,
};

const pieceValues: Record<PieceSymbol, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

const pieceOrder: PieceSymbol[] = ['q', 'r', 'b', 'n', 'p'];

export function getMaterialState(game: Chess): MaterialState {
  const board = game.board();

  const current = {
    white: { ...initialCounts },
    black: { ...initialCounts },
  };

  for (const row of board) {
    for (const piece of row) {
      if (!piece) continue;

      const color = piece.color === 'w' ? 'white' : 'black';
      current[color][piece.type] -= 1;
    }
  }

  const whiteCaptured: CapturedPiece[] = [];
  const blackCaptured: CapturedPiece[] = [];

  for (const piece of pieceOrder) {
    for (let i = 0; i < current.white[piece]; i++) {
      whiteCaptured.push(piece);
    }

    for (let i = 0; i < current.black[piece]; i++) {
      blackCaptured.push(piece);
    }
  }

  const whiteCapturedValue = whiteCaptured.reduce(
    (sum, piece) => sum + pieceValues[piece],
    0,
  );

  const blackCapturedValue = blackCaptured.reduce(
    (sum, piece) => sum + pieceValues[piece],
    0,
  );

  const diff = whiteCapturedValue - blackCapturedValue;

  return {
    whiteCaptured,
    blackCaptured,
    whiteCapturedValue,
    blackCapturedValue,
    advantage: {
      side: diff > 0 ? 'black' : diff < 0 ? 'white' : null,
      value: Math.abs(diff),
    },
  };
}
