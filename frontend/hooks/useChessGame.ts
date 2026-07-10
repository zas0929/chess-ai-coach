import { useCallback, useState } from 'react';
import { Chess, Square } from 'chess.js';

import { EngineService } from '@/services/engine.service';
import { SoundService } from '@/services/sound.service';
import { getMaterialState } from '@/utils/material';
import { EvaluationPoint } from '@/types/evaluation';
import { classifyMoveByEvalDrop } from '@/utils/classifyMove';
import { EngineStats } from '@/types/engine';

export function useChessGame() {
  // Один экземпляр игры на весь жизненный цикл компонента
  const [game] = useState(() => new Chess());

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

  const [engineStats, setEngineStats] = useState<EngineStats>({
    time: 0,
    skill_level: 10,
    depth: 12,
    move_time: 500,
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

  const [viewPly, setViewPly] = useState(0);

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

  const getFenAtPly = useCallback(
    (ply: number) => {
      const replayGame = new Chess();
      const history = game.history();

      history.slice(0, ply).forEach((move) => {
        replayGame.move(move);
      });

      return replayGame.fen();
    },
    [game],
  );

  const totalPly = moves.length;

  const isLivePosition = viewPly === totalPly;

  const displayedFen = isLivePosition
    ? fen
    : getFenAtPly(viewPly);
  
  const goToFirstMove = useCallback(() => {
    setViewPly(0);
  }, []);

  const goToPreviousMove = useCallback(() => {
    setViewPly((ply) => Math.max(0, ply - 1));
  }, []);

  const goToNextMove = useCallback(() => {
    setViewPly((ply) =>
      Math.min(game.history().length, ply + 1),
    );
  }, [game]);

  const goToLastMove = useCallback(() => {
    setViewPly(game.history().length);
  }, [game]);

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

  const analyzePlayerMove = useCallback(
    async (fenBefore: string, fenAfter: string) => {
      const response = await EngineService.analyzeMove({
        fen_before: fenBefore,
        fen_after: fenAfter,
        settings: {
          skill_level: skillLevel,
          move_time: moveTime,
          depth,
        },
      });

      if (response.stats) {
        setEngineStats(response.stats);
      }

      const value = normalizeEvaluation(response.evaluation);

      const history = game.history();
      const lastMoveSan = history[history.length - 1] ?? '';

      appendEvaluationPoint({
        value,
        move: lastMoveSan,
        source: 'player',
        bestMove: response.best_move,
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

    setViewPly(game.history().length);
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
    (
      sourceSquare: Square,
      targetSquare: Square,
      ) => {
      if (!isLivePosition) {
        return false;
      }

      if (thinking) {
        return false;
      }

      const fenBeforePlayerMove = game.fen();

      const playerMove = (() => {
        try {
          return game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q',
          });
        } catch {
          return null;
        }
      })();

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

      const fenAfterPlayerMove = game.fen();

      setThinking(true);

      void (async () => {
        try {
          await analyzePlayerMove(
            fenBeforePlayerMove,
            fenAfterPlayerMove,
          );

          if (game.isGameOver()) {
            return;
          }

          await makeEngineMove();
        } catch (error) {
          console.error(error);
        } finally {
          setThinking(false);
        }
      })();

      return true;
    },
  [
    game,
    thinking,
    isLivePosition,
    updateState,
    analyzePlayerMove,
    makeEngineMove,
  ],
  );
  
  const selectPiece = useCallback(
    (square: Square) => {
        if (thinking || !isLivePosition) {
          return;
        }

        const piece = game.get(square);

        if (!piece) {
          if (selectedSquare) {
            const moved = onDrop(selectedSquare, square);

            if (moved) {
              setSelectedSquare(null);
              setPossibleMoves([]);
            }

            return;
          }

          setSelectedSquare(null);
          setPossibleMoves([]);
          return;
        }

        if (piece.color === game.turn()) {
          const moves = game.moves({
            square,
            verbose: true,
          });

          setSelectedSquare(square);

          setPossibleMoves(
            moves.map((move) => move.to as Square),
          );

          return;
        }

        if (selectedSquare) {
          const moved = onDrop(selectedSquare, square);

          if (moved) {
            setSelectedSquare(null);
            setPossibleMoves([]);
          }

          return;
        }
        setSelectedSquare(null);
        setPossibleMoves([]);
      },
    [
      game,
      thinking,
      isLivePosition,
      selectedSquare,
      onDrop,
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
    analyzePlayerMove,
    displayedFen,
    viewPly,
    totalPly,
    isLivePosition,
    goToFirstMove,
    goToPreviousMove,
    goToNextMove,
    goToLastMove,
  };
}
