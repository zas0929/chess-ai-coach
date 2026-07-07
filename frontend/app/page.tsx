'use client';

import ChessBoard from '@/components/Chess/ChessBoard';
import EvaluationBar from '@/components/Chess/EvaluationBar';
import MoveHistory from '@/components/Chess/MoveHistory';
import ChessControls from '@/components/Chess/ChessControls';
import ThinkingIndicator from '@/components/Chess/ThinkingIndicator';
import { useChessGame } from '@/hooks/useChessGame';
import CapturedPieces from '@/components/Chess/CapturedPieces';
import GameStatus from '@/components/Chess/GameStatus';
import AppShell from '@/components/Chess/AppShell';
import TopGameBar from '@/components/Chess/TopGameBar';
import Panel from '@/components/Chess/Panel';
import EngineSettings from '@/components/Chess/EngineSettings';

export default function HomePage() {
  const {
    fen,
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
  } = useChessGame();

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
    <AppShell>
      <div className="grid grid-cols-[minmax(680px,1fr)_420px] gap-5">
        <section className="min-w-0">
          <TopGameBar
            playerColor={playerColor}
            onChooseSide={chooseSide}
            onFlipBoard={flipBoard}
            onNewGame={newGame}
          />

          <CapturedPieces {...bottomCaptured} />

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl">
            <ChessBoard
              position={fen}
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
            <EvaluationBar value={evaluation} />
          </Panel>

          <Panel>
            <MoveHistory moves={moves} />
          </Panel>

          <Panel>
            <ThinkingIndicator
              stats={{
                ...engineStats,
                skill_level: skillLevel,
                depth,
                move_time: moveTime,
              }}
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

          <GameStatus
            status={gameStatus}
            winner={winner}
            onNewGame={newGame}
          />

          <Panel>
            <ChessControls
              playerColor={playerColor}
              onNewGame={newGame}
              onUndo={undo}
              onFlipBoard={flipBoard}
              onChooseSide={chooseSide}
            />
          </Panel>
        </aside>
      </div>
    </AppShell>
  );
}
