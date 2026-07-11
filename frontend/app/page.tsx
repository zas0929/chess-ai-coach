'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import AuthGate from '@/components/Auth/AuthGate';
import { useAuth } from '@/components/Auth/AuthGate';
import ChessBoard from '@/components/Chess/ChessBoard';
import MoveHistory from '@/components/Chess/MoveHistory';
import { useChessGame } from '@/hooks/useChessGame';
import CapturedPieces from '@/components/Chess/CapturedPieces';
import GameStatus from '@/components/Chess/GameStatus';
import AppShell from '@/components/Chess/AppShell';
import Panel from '@/components/Chess/Panel';
import EngineSettings from '@/components/Chess/EngineSettings';
import EngineIdeas from '@/components/Chess/EngineIdeas';
import EvaluationGraph from '@/components/Chess/EvaluationGraph';
import GameNavigation from '@/components/Chess/GameNavigation';
import OpeningExplorerPreview from '@/components/Chess/OpeningExplorerPreview';
import GameTimeline from '@/components/Chess/GameTimeline';
import { GameService } from '@/services/game.service';
import { PlayerStats } from '@/types/game';
import { detectOpening } from '@/utils/opening';

export default function HomePage() {
  return (
    <AuthGate>
      <ChessApp />
    </AuthGate>
  );
}

function ChessApp() {
  const { session, isConfigured } = useAuth();
  const userId = session?.user.id;
  const [playerStats, setPlayerStats] =
    useState<PlayerStats | null>(null);
  const [gameStorageReady, setGameStorageReady] =
    useState(!isConfigured);
  const saveAsNewGameRef = useRef(false);
  const lastSavedSnapshotRef = useRef('');

  const {
    moves,
    evaluation,
    thinking,
    onDrop,
    newGame,
    undo,
    lastMove,
    selectPiece,
    possibleMoves,
    selectedSquare,
    material,
    checkedKingSquare,
    isCheckmate,
    playerColor,
    boardOrientation,
    flipBoard,
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
    displayedFen,
    viewPly,
    totalPly,
    isLivePosition,
    goToFirstMove,
    goToPreviousMove,
    goToNextMove,
    goToLastMove,
    getGameSnapshot,
    restoreGame,
  } = useChessGame();

  useEffect(() => {
    if (!isConfigured || !userId) {
      return;
    }

    let isCancelled = false;

    void (async () => {
      setGameStorageReady(false);

      try {
        const [activeGame, stats] = await Promise.all([
          GameService.getActiveGame(),
          GameService.getStats(),
        ]);

        if (isCancelled) {
          return;
        }

        if (activeGame) {
          restoreGame(activeGame);
          lastSavedSnapshotRef.current =
            JSON.stringify(activeGame);
        }

        setPlayerStats(stats);
      } catch (error) {
        console.error(error);
      } finally {
        if (!isCancelled) {
          setGameStorageReady(true);
        }
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [isConfigured, restoreGame, userId]);

  useEffect(() => {
    if (
      !isConfigured ||
      !userId ||
      !gameStorageReady ||
      thinking ||
      !isLivePosition
    ) {
      return;
    }

    const snapshot = getGameSnapshot();
    const snapshotSignature = JSON.stringify(snapshot);

    if (snapshotSignature === lastSavedSnapshotRef.current) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void (async () => {
        try {
          const savedGame = saveAsNewGameRef.current
            ? await GameService.startNewGame(snapshot)
            : await GameService.saveActiveGame(snapshot);

          saveAsNewGameRef.current = false;
          lastSavedSnapshotRef.current = JSON.stringify(savedGame);

          setPlayerStats(await GameService.getStats());
        } catch (error) {
          console.error(error);
        }
      })();
    }, 600);

    return () => window.clearTimeout(timeoutId);
  }, [
    depth,
    evaluation,
    evaluationHistory,
    gameStatus,
    gameStorageReady,
    getGameSnapshot,
    isConfigured,
    isLivePosition,
    lastMove,
    moveTime,
    moves,
    playerColor,
    skillLevel,
    thinking,
    userId,
    winner,
  ]);

  const handleNewGame = async () => {
    saveAsNewGameRef.current = true;
    await newGame();
  };

  const handleChooseSide = async (
    color: 'white' | 'black' | 'random',
  ) => {
    saveAsNewGameRef.current = true;
    await chooseSide(color);
  };

  const selectedCoachPoint =
    [...evaluationHistory]
      .reverse()
      .find(
        (point) =>
          point.ply <= viewPly &&
          point.source === 'player' &&
          point.side === playerColor,
      );

  const currentOpening =
    detectOpening(moves) ??
    selectedCoachPoint?.opening ??
    [...evaluationHistory]
      .reverse()
      .find((point) => point.opening)?.opening;

  const engineSettings = useMemo(
    () => ({
      skill_level: skillLevel,
      move_time: moveTime,
      depth,
    }),
    [depth, moveTime, skillLevel],
  );
  
  const topCaptured =
    boardOrientation === 'white'
      ? {
          label: 'Black',
          color: 'white' as const,
          pieces: material.blackCaptured,
          advantage:
            material.advantage.side === 'white'
              ? material.advantage.value
              : 0,
        }
      : {
          label: 'White',
          color: 'black' as const,
          pieces: material.whiteCaptured,
          advantage:
            material.advantage.side === 'black'
              ? material.advantage.value
              : 0,
        };

  const bottomCaptured =
    boardOrientation === 'white'
      ? {
          label: 'White',
          color: 'black' as const,
          pieces: material.whiteCaptured,
          advantage:
            material.advantage.side === 'black'
              ? material.advantage.value
              : 0,
        }
      : {
          label: 'Black',
          color: 'white' as const,
          pieces: material.blackCaptured,
          advantage:
            material.advantage.side === 'white'
              ? material.advantage.value
              : 0,
        };

  return (
      <AppShell point={selectedCoachPoint} stats={playerStats}>
      <GameStatus
        status={gameStatus}
        winner={winner}
        onNewGame={handleNewGame}
      />

      <div className="grid grid-cols-[minmax(520px,1fr)_420px] gap-5">
        <section className="flex min-w-0 justify-center">
          <div
            className="w-full"
            style={{
              maxWidth: 'min(760px, calc(100vh - 210px))',
            }}
          >
            <div className="mb-2 grid grid-cols-2 gap-2">
              <OpeningExplorerPreview
                opening={currentOpening}
                moveCount={moves.length}
              />
              <GameTimeline moveCount={moves.length} />
            </div>

            <CapturedPieces {...bottomCaptured} />

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl">
              <ChessBoard
                position={displayedFen}
                boardOrientation={boardOrientation}
                onDrop={onDrop}
                lastMove={lastMove}
                onSquareClick={selectPiece}
                possibleMoves={possibleMoves}
                selectedSquare={selectedSquare}
                checkedKingSquare={checkedKingSquare}
                isCheckmate={isCheckmate}
              />
            </div>

            <CapturedPieces {...topCaptured} />
          </div>
        </section>

        <aside className="grid content-start gap-2">
          <Panel className="relative z-30">
            <EvaluationGraph
              values={evaluationHistory}
              currentValue={evaluation}
              lastPoint={selectedCoachPoint}
            />
          </Panel>

          <Panel density="compact">
            <GameNavigation
              currentPly={viewPly}
              totalPly={totalPly}
              isLive={isLivePosition}
              playerColor={playerColor}
              onChooseSide={handleChooseSide}
              onUndo={undo}
              onFlipBoard={flipBoard}
              onNewGame={handleNewGame}
              onFirst={goToFirstMove}
              onPrev={goToPreviousMove}
              onNext={goToNextMove}
              onLast={goToLastMove}
            />
          </Panel>

          <Panel density="compact">
            <EngineSettings
              skillLevel={skillLevel}
              moveTime={moveTime}
              depth={depth}
              onSkillLevelChange={setSkillLevel}
              onMoveTimeChange={setMoveTime}
              onDepthChange={setDepth}
            />
          </Panel>

          <Panel density="compact">
            <EngineIdeas
              fen={displayedFen}
              settings={engineSettings}
              enabled={!thinking}
            />
          </Panel>

          <MoveHistory
            moves={moves}
            evaluationHistory={evaluationHistory}
          />

        </aside>
      </div>
      </AppShell>
  );
}
