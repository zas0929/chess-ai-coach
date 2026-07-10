'use client';

import { Chessboard } from 'react-chessboard';
import { Square } from 'chess.js';

interface Props {
  position: string;

  onDrop: (
    sourceSquare: Square,
    targetSquare: Square,
  ) => boolean;

  onSquareClick: (square: Square) => void;

  possibleMoves: Square[];

  selectedSquare: Square | null;

  lastMove: {
    from: string;
    to: string;
  } | null;

  checkedKingSquare: string | null;

  boardOrientation: 'white' | 'black';

  isCheckmate: boolean;
}

export default function ChessBoard({
  boardOrientation,
  position,
  onDrop,
  onSquareClick,
  possibleMoves,
  selectedSquare,
  lastMove,
  checkedKingSquare,
  isCheckmate,
}: Props) {
  const customSquareStyles = {
    ...(checkedKingSquare
    ? {
        [checkedKingSquare]: {
          background:
            isCheckmate
              ? 'radial-gradient(circle, rgba(239,68,68,0.95) 0%, rgba(127,29,29,0.85) 65%)'
              : 'radial-gradient(circle, rgba(248,113,113,0.85) 0%, rgba(153,27,27,0.75) 65%)',
          boxShadow:
            isCheckmate
              ? 'inset 0 0 0 4px rgba(255,255,255,0.18), 0 0 22px rgba(239,68,68,0.75)'
              : 'inset 0 0 0 3px rgba(255,255,255,0.12), 0 0 18px rgba(248,113,113,0.55)',
        },
      }
    : {}),
    ...(lastMove
      ? {
          [lastMove.from]: {
            backgroundColor:
              'rgba(255,255,0,0.4)',
          },
          [lastMove.to]: {
            backgroundColor:
              'rgba(255,255,0,0.4)',
          },
        }
      : {}),

    ...(selectedSquare
      ? {
          [selectedSquare]: {
            backgroundColor:
              'rgba(0,150,255,0.5)',
          },
        }
      : {}),

    ...Object.fromEntries(
      possibleMoves.map((square) => [
        square,
        {
          backgroundColor:
            'rgba(0,255,0,0.35)',
        },
      ]),
    ),
  };

  return (
    <Chessboard
      boardOrientation={boardOrientation}
      position={position}
      onPieceDrop={onDrop}
      onSquareClick={onSquareClick}
      customSquareStyles={customSquareStyles}
      boardWidth={650}
    />
  );
}
