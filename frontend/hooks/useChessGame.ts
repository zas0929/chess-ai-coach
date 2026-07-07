import { useCallback, useRef, useState } from 'react';
import { Chess, Square } from 'chess.js';

import { EngineService } from '@/services/engine.service';
import { SoundService } from '@/services/sound.service';
import { ToastService } from '@/services/toast.service';
import { getMaterialState } from '@/utils/material';

export function useChessGame() {
  // Один экземпляр игры на весь жизненный цикл компонента
  const gameRef = useRef(new Chess());

  const game = gameRef.current;

  const [fen, setFen] = useState(game.fen());

  const [moves, setMoves] = useState<string[]>([]);

  const [evaluation, setEvaluation] = useState(0);

  const [thinking, setThinking] = useState(false);

  const [lastMove, setLastMove] = useState<{
    from: string;
    to: string;
  } | null>(null);

  const [selectedSquare, setSelectedSquare] =
    useState<Square | null>(null);

  const [possibleMoves, setPossibleMoves] =
    useState<Square[]>([]);

  const [turn, setTurn] = useState(game.turn());

  const [engineStats, setEngineStats] = useState({
    time: 0,
    skill_level: 10,
  });

  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
  
  const [material, setMaterial] = useState(() =>
    getMaterialState(game),
  );

  const [checkedKingSquare, setCheckedKingSquare] =
    useState<string | null>(null);

  const [isCheckmate, setIsCheckmate] =
    useState(false);
  const boardOrientation = playerColor;

  const flipBoard = () => {
    setPlayerColor(color =>
        color === 'white'
            ? 'black'
            : 'white'
    );
  };

  const findKingSquare = useCallback(() => {
  const turn = game.turn();
  const board = game.board();

  for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
    for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
      const piece = board[rankIndex][fileIndex];

      if (
        piece &&
        piece.type === 'k' &&
        piece.color === turn
      ) {
        const file = String.fromCharCode(97 + fileIndex);
        const rank = 8 - rankIndex;

        return `${file}${rank}`;
      }
    }
  }

  return null;
}, [game]);

  const selectPiece = useCallback(
  (square: Square) => {
    const moves = game.moves({
      square,
      verbose: true,
    });

    setSelectedSquare(square);

    setPossibleMoves(
      moves.map((move) => move.to),
    );
  },
  [game],
  );

  const updateState = useCallback(() => {
    setFen(game.fen());

    setMoves([...game.history()]);

    setTurn(game.turn());

    setMaterial(getMaterialState(game));

    if (game.isCheck()) {
      setCheckedKingSquare(findKingSquare());
    } else {
      setCheckedKingSquare(null);
    }

    setIsCheckmate(game.isCheckmate());
  }, [game, findKingSquare]);

  const onDrop = useCallback(
    async (
      sourceSquare: Square,
      targetSquare: Square,
    ) => {
      if (thinking) {
        return false;
      }

      if (game.inCheck()) {
        SoundService.play('check');
      }

      const playerMove = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      });

      if (!playerMove) {
        return false;
      }

      if (!playerMove) {
          return false;
      }

      // Уже после изменения позиции
      if (game.isCheckmate()) {
        SoundService.play('checkmate');
        ToastService.success('Checkmate!');
      }

      if (game.isDraw()) {
        ToastService.info('Draw!');
      }

      if (game.isStalemate()) {
        ToastService.info('Stalemate!');
      }

      if (game.isCheck()) {
        ToastService.info('Check!');
      }

      setSelectedSquare(null);

      setPossibleMoves([]);

      setLastMove({
        from: playerMove.from,
        to: playerMove.to,
      });

      if (playerMove.captured) {
        SoundService.play('capture');
      } else {
        SoundService.play('move');
      }

      updateState();

      setThinking(true);

      try {
        const response =
          await EngineService.getBestMove({
            fen: game.fen(),
          });
        
        if (response.stats) {
          setEngineStats(response.stats);
        }

        if (!response.move) {
          setThinking(false);
          return true;
        }

        const aiMove = game.move(response.move);

        if (aiMove) {
          setLastMove({
            from: aiMove.from,
            to: aiMove.to,
          });

          updateState();

          // Уже после изменения позиции
          if (game.isCheckmate()) {
            SoundService.play('checkmate');
            ToastService.success('Checkmate!');
          }

          if (game.isDraw()) {
              ToastService.info('Draw!');
          }

          if (game.isStalemate()) {
              ToastService.info('Stalemate!');
          }

          if (game.isCheck()) {
              ToastService.info('Check!');
          }

        }

        setSelectedSquare(null);

        setPossibleMoves([]);

        if (aiMove.captured) {
          SoundService.play('capture');
        } else {
          SoundService.play('move');
        }

        if (game.inCheck()) {
          SoundService.play('check');
        }

        if (response.evaluation.type === 'cp') {
          setEvaluation(
            response.evaluation.value / 100,
          );
        }

        if (response.evaluation.type === 'mate') {
          setEvaluation(
            response.evaluation.value > 0
              ? 999
              : -999,
          );
        }

        return true;
      } catch (err) {
        console.error(err);

        return false;
      } finally {
        setThinking(false);
      }
    },
    [game, thinking, updateState],
  );

  const newGame = useCallback(() => {
    game.reset();

    SoundService.play('start');

    setEvaluation(0);

    updateState();

    setCheckedKingSquare(null);

    setIsCheckmate(false);
  }, [game, updateState]);

  const undo = useCallback(() => {
    if (game.history().length === 0) {
      return;
    }
    SoundService.play('undo');

    game.undo();

    if (game.history().length > 0) {
      game.undo();
    }

    updateState();
  }, [game, updateState]);

  return {
    fen,
    moves,
    evaluation,
    thinking,
    onDrop,
    newGame,
    undo,
    lastMove,
    turn,
    selectPiece,
    selectedSquare,
    possibleMoves,
    engineStats,
    playerColor,
    flipBoard,
    material,
    checkedKingSquare,
    isCheckmate,
  };
}
