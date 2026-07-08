'use client';

import ChessBoard from '@/components/Chess/ChessBoard';
import EvaluationBar from '@/components/Chess/EvaluationBar';
import MoveHistory from '@/components/Chess/MoveHistory';
import { useChessGame } from '@/hooks/useChessGame';
import CapturedPieces from '@/components/Chess/CapturedPieces';
import GameStatus from '@/components/Chess/GameStatus';
import AppShell from '@/components/Chess/AppShell';
import TopGameBar from '@/components/Chess/TopGameBar';
import Panel from '@/components/Chess/Panel';
import EngineSettings from '@/components/Chess/EngineSettings';
import EvaluationGraph from '@/components/Chess/EvaluationGraph';
import OpeningExplorerPreview from '@/components/Chess/OpeningExplorerPreview';
import GameTimeline from '@/components/Chess/GameTimeline';
import GameNavigation from '@/components/Chess/GameNavigation';

export default function HomePage() {
  const {
    fen,
    moves,
    evaluation,
    onDrop,
    newGame,
    undo,
    lastMove,
    selectPiece,
    possibleMoves,
    selectedSquare,
    engineStats,
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
          point.source === 'player',
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
    <AppShell point={selectedCoachPoint}>
      <div className="grid grid-cols-[minmax(680px,1fr)_420px] gap-5">
        <section className="min-w-0">
          <TopGameBar
            playerColor={playerColor}
            onChooseSide={chooseSide}
            onFlipBoard={flipBoard}
            onNewGame={newGame}
            onUndo={undo}
          />

          {/* <div className="mb-4 grid grid-cols-2 gap-4">
            <OpeningExplorerPreview />
            <GameTimeline moveCount={moves.length} />
          </div> */}

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
        </section>

        <aside className="grid gap-4">
          <Panel>
            <EvaluationGraph
              values={evaluationHistory}
              currentValue={evaluation}
              lastPoint={selectedCoachPoint}
              depth={engineStats?.depth}
              time={engineStats?.time}
              moveTime={engineStats?.move_time ?? moveTime}
              skillLevel={engineStats?.skill_level ?? skillLevel}
            />
          </Panel>

          <Panel>
            <GameNavigation
              currentPly={viewPly}
              totalPly={totalPly}
              isLive={isLivePosition}
              onFirst={goToFirstMove}
              onPrev={goToPreviousMove}
              onNext={goToNextMove}
              onLast={goToLastMove}
            />
          </Panel>

          <Panel>
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
  );
}
