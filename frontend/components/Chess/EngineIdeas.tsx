'use client';

import { useEffect, useMemo, useState } from 'react';
import { Chess } from 'chess.js';

import { EngineService } from '@/services/engine.service';
import {
  EngineInsightResponse,
  EngineSettings,
  Evaluation,
} from '@/types/engine';

interface Props {
  fen: string;
  settings: EngineSettings;
  enabled?: boolean;
}

export default function EngineIdeas({
  fen,
  settings,
  enabled = true,
}: Props) {
  const [insight, setInsight] =
    useState<EngineInsightResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const requestKey = useMemo(
    () => JSON.stringify({ fen, settings }),
    [fen, settings],
  );

  useEffect(() => {
    if (!enabled || !isOpen) {
      return;
    }

    let isCancelled = false;

    const timeoutId = window.setTimeout(() => {
      void (async () => {
        setIsLoading(true);

        try {
          const response = await EngineService.getInsight({
            fen,
            settings,
            multipv: 3,
          });

          if (!isCancelled) {
            setInsight(response);
          }
        } catch (error) {
          console.error(error);
        } finally {
          if (!isCancelled) {
            setIsLoading(false);
          }
        }
      })();
    }, 350);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [enabled, fen, isOpen, requestKey, settings]);

  return (
    <div>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 text-left"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="min-w-0">
          <span className="block text-sm font-semibold uppercase tracking-widest text-zinc-300">
            Engine Ideas
          </span>
          <span className="mt-0.5 block truncate text-[11px] text-zinc-500">
            Optional hints from Stockfish
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-2">
          {isLoading && (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border border-violet-300/30 border-t-violet-300" />
          )}
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] font-medium text-zinc-300">
            {isOpen ? 'Hide' : 'Show'}
          </span>
        </span>
      </button>

      <div
        className={[
          'grid transition-[grid-template-rows,opacity] duration-200 ease-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        ].join(' ')}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mt-2 border-t border-white/10 pt-2">
            {!insight || insight.top_moves.length === 0 ? (
              <div className="rounded-xl bg-white/[0.035] px-3 py-2 text-xs text-zinc-500">
                Calculating candidate moves...
              </div>
            ) : (
              <div className="space-y-1.5">
                {insight.top_moves.slice(0, 3).map((line, index) => {
                  const move = formatMove(fen, line.move);
                  const pv = formatPv(fen, line.line);

                  return (
                  <div
                    key={`${line.move}-${index}`}
                    className="group rounded-xl bg-white/[0.035] px-3 py-2"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="text-[10px] font-semibold text-zinc-600">
                          {index + 1}
                        </span>
                        <span className="truncate text-sm font-semibold text-zinc-100">
                          {move}
                        </span>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5">
                        <span className="text-xs font-medium text-emerald-300">
                          {formatEngineEval(line.evaluation)}
                        </span>
                        <button
                          type="button"
                          className="grid h-4 w-4 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[10px] font-semibold text-zinc-500 transition hover:border-violet-300/40 hover:text-violet-200 focus:border-violet-300/40 focus:text-violet-200 focus:outline-none"
                          aria-label={getTooltipText(
                            index,
                            move,
                            line.evaluation,
                            pv,
                            insight.stats.depth,
                          )}
                        >
                          ?
                        </button>
                      </div>
                    </div>

                    <div className="mt-1 flex min-w-0 items-center gap-1 overflow-hidden text-[11px] text-zinc-500">
                      {pv.map((move, moveIndex) => (
                        <span
                          key={`${line.move}-${move}-${moveIndex}`}
                          className="flex min-w-0 items-center gap-1"
                        >
                          {moveIndex > 0 && (
                            <span className="shrink-0 text-zinc-700">
                              →
                            </span>
                          )}
                          <span className="truncate">{move}</span>
                        </span>
                      ))}
                    </div>

                    <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-200 group-focus-within:mt-2 group-focus-within:max-h-28 group-focus-within:opacity-100 group-hover:mt-2 group-hover:max-h-28 group-hover:opacity-100">
                      <div className="rounded-lg border border-violet-300/15 bg-[#101722] px-2.5 py-2 text-[11px] leading-relaxed text-zinc-300 shadow-lg">
                        {getTooltipText(
                          index,
                          move,
                          line.evaluation,
                          pv,
                          insight.stats.depth,
                        )}
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatEngineEval(evaluation: Evaluation) {
  if (evaluation.type === 'mate') {
    return `M${evaluation.value}`;
  }

  const pawns = evaluation.value / 100;

  return `${pawns > 0 ? '+' : ''}${pawns.toFixed(2)}`;
}

function formatMove(fen: string, uciMove: string) {
  const [san] = formatLine(fen, [uciMove]);

  return san ?? uciMove;
}

function formatPv(fen: string, line: string[]) {
  return formatLine(fen, line).slice(0, 5);
}

function getTooltipText(
  index: number,
  move: string,
  evaluation: Evaluation,
  line: string[],
  depth: number,
) {
  const rank =
    index === 0
      ? 'Best candidate'
      : `Candidate #${index + 1}`;
  const pv = line.length > 0 ? line.join(' → ') : move;

  return `${rank}. Stockfish evaluates ${move} as ${formatEngineEval(evaluation)} at depth ${depth}. Main line: ${pv}.`;
}

function formatLine(fen: string, line: string[]) {
  try {
    const chess = new Chess(fen);

    return line.map((uciMove) => {
      const move = chess.move({
        from: uciMove.slice(0, 2),
        to: uciMove.slice(2, 4),
        promotion: uciMove[4],
      });

      return move.san;
    });
  } catch {
    return line;
  }
}
