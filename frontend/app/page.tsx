'use client';

import ChessBoard from '@/components/Chess/ChessBoard';
import EvaluationBar from '@/components/Chess/EvaluationBar';
import MoveHistory from '@/components/Chess/MoveHistory';
import ChessControls from '@/components/Chess/ChessControls';
import ThinkingIndicator from '@/components/Chess/ThinkingIndicator';
import { useChessGame } from '@/hooks/useChessGame';
import CapturedPieces from '@/components/Chess/CapturedPieces';

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
  } = useChessGame();

  return (
    <main className="min-h-screen bg-[#0f1720] text-zinc-100 p-8">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">
            ♔ Chess AI Coach
          </h1>
          <p className="mt-1 text-zinc-400">
            Train. Analyze. Improve.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-[minmax(650px,760px)_1fr] gap-6">
        <section>
          
          <CapturedPieces
            pieces={material.whiteCaptured}
            advantage={
              material.advantage.side === 'black'
                ? material.advantage.value
                : 0
            }
          />

          <ChessBoard
            position={fen}
            onDrop={onDrop}
            lastMove={lastMove}
            onSquareClick={selectPiece}
            possibleMoves={possibleMoves}
            selectedSquare={selectedSquare}
            checkedKingSquare={checkedKingSquare}
            isCheckmate={isCheckmate}
          />

          <CapturedPieces
            pieces={material.blackCaptured}
            advantage={
              material.advantage.side === 'white'
                ? material.advantage.value
                : 0
            }
          />
          
        </section>

        <aside className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
            <ThinkingIndicator stats={engineStats} />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
            <EvaluationBar value={evaluation} />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
            <MoveHistory moves={moves} />
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
              <ChessControls
                onNewGame={newGame}
                onUndo={undo}
              />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
