import { useCallback, useRef, useState } from 'react';
import { Chess, Square } from 'chess.js';

import { EngineService } from '@/services/engine.service';
import { SoundService } from '@/services/sound.service';
import { ToastService } from '@/services/toast.service';
import { getMaterialState } from '@/utils/material';
import { EvaluationPoint } from '@/types/evaluation';
import { classifyMoveByEvalDrop } from '@/utils/classifyMove';

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

  const [evaluationHistory, setEvaluationHistory] =
    useState<EvaluationPoint[]>([
      {
        ply: 0,
        fen: game.fen(),
        move: 'start',
        value: 0,
        previousValue: null,
        source: 'engine',
        evalChange: 0,
        bestMove: undefined,
      }
    ]);
  
  const getLast = <T>(items: T[]): T | undefined =>
    items[items.length - 1];

  const [gameStatus, setGameStatus] =
    useState<'playing' | 'check' | 'checkmate' | 'draw' | 'stalemate'>(
      'playing',
    );

  const [winner, setWinner] =
    useState<'white' | 'black' | null>(null);
  
  const [skillLevel, setSkillLevel] = useState(10);
  const [moveTime, setMoveTime] = useState(500);
  const [depth, setDepth] = useState(12);

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
  
  const normalizeEvaluation = (
    responseEvaluation: {
      type: 'cp' | 'mate';
      value: number;
    },
  ) => {
    if (responseEvaluation.type === 'cp') {
      return responseEvaluation.value / 100;
    }

    return responseEvaluation.value > 0 ? 999 : -999;
  };

  const appendEvaluationPoint = useCallback(
    ({
      value,
      move,
      source,
      bestMove,
    }: {
      value: number;
      move: string;
      source: 'player' | 'engine';
      bestMove?: string;
    }) => {
      setEvaluation(value);

      setEvaluationHistory((history) => {
        const previousPoint = getLast(history);
        const previousValue =
          previousPoint?.value ?? 0;

        const evalChange =
          value - previousValue;

        return [
          ...history,
          {
            ply: game.history().length,
            fen: game.fen(),
            move,
            value,
            previousValue,
            evalChange,
            bestMove,
            source,
            classification:
              classifyMoveByEvalDrop(
                previousValue,
                value,
                source,
              ),
          },
        ];
      });
    },
    [game],
  );

  const evaluateCurrentPosition = useCallback(
    async () => {
      const response = await EngineService.evaluate({
        fen: game.fen(),
        settings: {
          skill_level: skillLevel,
          move_time: moveTime,
          depth,
        },
      });

      if (response.stats) {
        setEngineStats(response.stats);
      }

      const value =
        normalizeEvaluation(response.evaluation);

      const history = game.history();
      const lastMoveSan =
        history[history.length - 1] ?? '';

      appendEvaluationPoint({
        value,
        move: lastMoveSan,
        source: 'player',
      });

      return value;
    },
    [
      game,
      skillLevel,
      moveTime,
      depth,
      appendEvaluationPoint,
    ],
  );

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

    if (game.isCheckmate()) {
      setGameStatus('checkmate');
      setWinner(game.turn() === 'w' ? 'black' : 'white');
    } else if (game.isStalemate()) {
      setGameStatus('stalemate');
      setWinner(null);
    } else if (game.isDraw()) {
      setGameStatus('draw');
      setWinner(null);
    } else if (game.isCheck()) {
      setGameStatus('check');
      setWinner(null);
    } else {
      setGameStatus('playing');
      setWinner(null);
    }
  }, [game, findKingSquare]);

  const makeEngineMove = useCallback(
    async () => {
      setThinking(true);

      try {
        const response =
          await EngineService.getBestMove({
            fen: game.fen(),
            settings: {
              skill_level: skillLevel,
              move_time: moveTime,
              depth,
            },
          });

        if (response.stats) {
          setEngineStats(response.stats);
        }

        if (!response.move) {
          return;
        }

        const aiMove = game.move(response.move);

        if (!aiMove) {
          return;
        }

        setLastMove({
          from: aiMove.from,
          to: aiMove.to,
        });

        if (game.isCheckmate()) {
          SoundService.play('checkmate');
        } else if (game.isCheck()) {
          SoundService.play('check');
        } else if (aiMove.captured) {
          SoundService.play('capture');
        } else {
          SoundService.play('move');
        }

        updateState();

        const value =
          normalizeEvaluation(response.evaluation);

        appendEvaluationPoint({
          value,
          move: aiMove.san,
          source: 'engine',
          bestMove: response.move,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setThinking(false);
      }
    },
    [
      game,
      skillLevel,
      moveTime,
      depth,
      updateState,
      appendEvaluationPoint,
    ],
  );

  const flipBoard = useCallback(() => {
  setPlayerColor((color) =>
    color === 'white' ? 'black' : 'white',
  );
}, []);

const chooseSide = useCallback(
    async (color: 'white' | 'black' | 'random') => {
      const selectedColor =
        color === 'random'
          ? Math.random() > 0.5
            ? 'white'
            : 'black'
          : color;

      game.reset();

      setPlayerColor(selectedColor);
      setEvaluation(0);
      setLastMove(null);
      setSelectedSquare(null);
      setPossibleMoves([]);

      updateState();

      if (selectedColor === 'black') {
        await makeEngineMove();
      }
    },
    [game, updateState, makeEngineMove],
  );

  const onDrop = useCallback(
  async (
    sourceSquare: Square,
    targetSquare: Square,
  ) => {
    if (thinking) {
      return false;
    }

    const playerMove = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    });

    if (!playerMove) {
      return false;
    }

    setSelectedSquare(null);
    setPossibleMoves([]);

    setLastMove({
      from: playerMove.from,
      to: playerMove.to,
    });

    if (game.isCheckmate()) {
      SoundService.play('checkmate');
    } else if (game.isCheck()) {
      SoundService.play('check');
    } else if (playerMove.captured) {
      SoundService.play('capture');
    } else {
      SoundService.play('move');
    }

    updateState();
      
    await evaluateCurrentPosition();

    if (game.isGameOver()) {
      return true;
    }

    await makeEngineMove();

    return true;
  },
  [
    game,
    thinking,
    updateState,
    makeEngineMove,
  ],
);

  const newGame = useCallback(() => {
    game.reset();

    SoundService.play('start');

    setEvaluation(0);

    updateState();

    setCheckedKingSquare(null);

    setIsCheckmate(false);

    setGameStatus('playing');

    setEvaluationHistory([
      {
        ply: 0,
        fen: game.fen(),
        move: 'start',
        value: 0,
        previousValue: null,
        source: 'engine',
        evalChange: 0,
        bestMove: undefined,
      },
    ]);

    setWinner(null);
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

    setEvaluationHistory((history) =>
      history.length > 2
        ? history.slice(0, -2)
        : [{
          ply: 0,
          fen: game.fen(),
          move: 'start',
          value: 0,
          previousValue: null,
          source: 'engine',
          evalChange: 0,
          bestMove: undefined,
        }],
    );
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
    boardOrientation,
    chooseSide,
    gameStatus,
    winner,
    skillLevel,
    moveTime,
    depth,
    setSkillLevel,
    setMoveTime,
    setDepth,
    evaluationHistory,
    evaluateCurrentPosition
  };
}
