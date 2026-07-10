'use client';

import AuthGate from '@/components/Auth/AuthGate';
import ChessBoard from '@/components/Chess/ChessBoard';
import MoveHistory from '@/components/Chess/MoveHistory';
import { useChessGame } from '@/hooks/useChessGame';
import CapturedPieces from '@/components/Chess/CapturedPieces';
import GameStatus from '@/components/Chess/GameStatus';
import AppShell from '@/components/Chess/AppShell';
import Panel from '@/components/Chess/Panel';
import EngineSettings from '@/components/Chess/EngineSettings';
import EvaluationGraph from '@/components/Chess/EvaluationGraph';
import GameNavigation from '@/components/Chess/GameNavigation';
import OpeningExplorerPreview from '@/components/Chess/OpeningExplorerPreview';
import GameTimeline from '@/components/Chess/GameTimeline';
import { detectOpening } from '@/utils/opening';

export default function HomePage() {
  const {
    moves,
    evaluation,
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
  } = useChessGame();

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
    selectedCoachPoint?.opening ??
    [...evaluationHistory]
      .reverse()
      .find((point) => point.opening)?.opening ??
    detectOpening(moves);
  
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
    <AuthGate>
      <AppShell point={selectedCoachPoint}>
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
              onChooseSide={chooseSide}
              onUndo={undo}
              onFlipBoard={flipBoard}
              onNewGame={newGame}
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

          <MoveHistory
            moves={moves}
            evaluationHistory={evaluationHistory}
          />

          <GameStatus
            status={gameStatus}
            winner={winner}
            onNewGame={newGame}
          />

        </aside>
      </div>
      </AppShell>
    </AuthGate>
  );
}
