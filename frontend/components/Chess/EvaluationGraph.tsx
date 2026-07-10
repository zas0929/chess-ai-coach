'use client';

import { useMemo, useState } from 'react';

import { EvaluationPoint } from '@/types/evaluation';
import MoveBadge from '@/components/Chess/MoveBadge';
import {
  formatEval,
  getEvalImpactText,
  getEvalSideText,
} from '@/utils/evaluationText';

interface Props {
  values: EvaluationPoint[];
  currentValue: number;
  previousValue?: number;
  lastPoint?: EvaluationPoint;
}

const CHART_WIDTH = 260;
const CHART_HEIGHT = 80;
const MAX_EVAL = 5;

function clamp(value: number) {
  if (Math.abs(value) >= 900) {
    return value > 0 ? MAX_EVAL : -MAX_EVAL;
  }

  return Math.max(-MAX_EVAL, Math.min(MAX_EVAL, value));
}

export default function EvaluationGraph({
  values,
  currentValue,
  lastPoint,
}: Props) {
  const [hoveredIndex, setHoveredIndex] =
    useState<number | null>(null);

  const normalizedValues = useMemo(
    () =>
      values.length > 0
        ? values
        : [
            {
              ply: 0,
              fen: '',
              fenBefore: '',
              move: 'start',
              moveNumber: 0,
              side: 'white' as const,
              player: 'white' as const,
              engine: 'black' as const,
              history: [],
              value: 0,
              previousValue: null,
              evalChange: 0,
              source: 'engine' as const,
            },
          ],
    [values],
  );

  const points = useMemo(
    () =>
      normalizedValues.map((point, index) => {
      const x =
        normalizedValues.length === 1
          ? 0
          : (index / (normalizedValues.length - 1)) * CHART_WIDTH;

      const y =
        CHART_HEIGHT / 2 -
        (clamp(point.value) / MAX_EVAL) * (CHART_HEIGHT / 2);

      return { x, y, ...point, index };
    }),
    [normalizedValues],
  );

  const linePath = points
    .map((point, index) =>
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`,
    )
    .join(' ');

  const areaPath = `
    ${linePath}
    L ${CHART_WIDTH} ${CHART_HEIGHT / 2}
    L 0 ${CHART_HEIGHT / 2}
    Z
  `;

  const hoveredPoint =
    hoveredIndex !== null ? points[hoveredIndex] : null;

  const activeChartPoint =
    hoveredPoint ??
    (lastPoint
      ? points.find((point) => point.ply === lastPoint.ply)
      : null);

  const isWhiteBetter = currentValue > 0;
  const isBlackBetter = currentValue < 0;

  const handleMouseMove = (
    event: React.MouseEvent<SVGSVGElement>,
  ) => {
    const rect =
      event.currentTarget.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) / rect.width) *
      CHART_WIDTH;

    const nearestIndex = Math.round(
      (x / CHART_WIDTH) *
        (normalizedValues.length - 1),
    );

    setHoveredIndex(
      Math.max(
        0,
        Math.min(
          normalizedValues.length - 1,
          nearestIndex,
        ),
      ),
    );
  };

  return (
    <div>
      <div className="mb-2 flex items-start justify-between gap-4">
        <h2 className="pt-1 text-sm font-semibold uppercase tracking-widest text-zinc-300">
          Evaluation Graph
        </h2>

        <div className="text-right">
          <div
            className={[
              'text-3xl font-semibold leading-none',
              isWhiteBetter
                ? 'text-green-400'
                : isBlackBetter
                  ? 'text-red-400'
                  : 'text-zinc-200',
            ].join(' ')}
          >
            {formatEval(currentValue)}
          </div>

          <div className="mt-1 text-xs text-zinc-300">
            {isWhiteBetter
              ? 'White is better'
              : isBlackBetter
                ? 'Black is better'
                : 'Equal'}
          </div>
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className="h-24 w-full overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient
              id="evalGreenArea"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="rgba(74,222,128,0.42)"
              />
              <stop
                offset="100%"
                stopColor="rgba(74,222,128,0.04)"
              />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={`h-${ratio}`}
              x1={0}
              x2={CHART_WIDTH}
              y1={ratio * CHART_HEIGHT}
              y2={ratio * CHART_HEIGHT}
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="3 5"
            />
          ))}

          {[0, 0.5, 1].map((ratio) => (
            <line
              key={`v-${ratio}`}
              y1={0}
              y2={CHART_HEIGHT}
              x1={ratio * CHART_WIDTH}
              x2={ratio * CHART_WIDTH}
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="3 5"
            />
          ))}

          <line
            x1={0}
            x2={CHART_WIDTH}
            y1={CHART_HEIGHT / 2}
            y2={CHART_HEIGHT / 2}
            stroke="rgba(255,255,255,0.35)"
          />

          <path d={areaPath} fill="url(#evalGreenArea)" />

          <path
            d={linePath}
            fill="none"
            stroke={currentValue >= 0 ? '#4ade80' : '#ef4444'}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {activeChartPoint && (
            <>
              <line
                x1={activeChartPoint.x}
                x2={activeChartPoint.x}
                y1={0}
                y2={CHART_HEIGHT}
                stroke="rgba(255,255,255,0.45)"
              />

              <circle
                cx={activeChartPoint.x}
                cy={activeChartPoint.y}
                r={4}
                fill="#0b1118"
                stroke="white"
                strokeWidth={2.5}
              />
            </>
          )}
        </svg>

        {hoveredPoint && (
          <div
            className="pointer-events-none absolute top-6 z-20 w-56 rounded-2xl border border-white/10 bg-[#0b1118]/95 p-4 text-sm shadow-2xl"
            style={{
              left: `min(calc(${(hoveredPoint.x / CHART_WIDTH) * 100}% + 10px), calc(100% - 224px))`,
            }}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="font-medium text-zinc-100">
                Move {hoveredPoint.ply}. {hoveredPoint.move}
              </div>

              <div
                className={
                  hoveredPoint.value >= 0
                    ? 'font-semibold text-green-400'
                    : 'font-semibold text-red-400'
                }
              >
                {formatEval(hoveredPoint.value)}
              </div>
            </div>

            <MoveBadge
              classification={hoveredPoint.classification}
              small
            />

            <div className="mt-3 text-sm text-zinc-400">
              {hoveredPoint.evalChange > 0
                ? 'Evaluation improved.'
                : hoveredPoint.evalChange < 0
                  ? 'Evaluation dropped.'
                  : 'Evaluation stayed equal.'}
            </div>

            {hoveredPoint.bestMove && (
              <div className="mt-3 rounded-xl bg-white/[0.04] p-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Best:</span>
                  <span className="font-medium text-green-400">
                    {hoveredPoint.bestMove}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-3 text-sm text-zinc-400">
              {getEvalSideText(hoveredPoint.value)}
            </div>

            <div className="mt-1 text-xs text-zinc-500">
              {getEvalImpactText(
                hoveredPoint.previousValue,
                hoveredPoint.value,
              )}
            </div>

            <div className="mt-3 rounded-xl bg-white/[0.04] p-3 text-xs text-zinc-400">
              <div className="mt-1 flex justify-between">
                <span>Change:</span>
                <span
                  className={
                    hoveredPoint.evalChange >= 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  }
                >
                  {hoveredPoint.evalChange > 0 ? '+' : ''}
                  {hoveredPoint.evalChange.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Before:</span>
                <span>
                  {hoveredPoint.previousValue === null
                    ? '—'
                    : formatEval(hoveredPoint.previousValue)}
                </span>
              </div>

              <div className="mt-1 flex justify-between">
                <span>After:</span>
                <span
                  className={
                    hoveredPoint.value >= 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  }
                >
                  {formatEval(hoveredPoint.value)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-1 flex justify-between text-xs text-zinc-500">
          <span>0</span>
          <span>Move number</span>
          <span>{normalizedValues.length}</span>
        </div>
      </div>

      {/* {lastPoint && lastPoint.ply > 0 && (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-widest text-zinc-500">
                Last move
              </div>

              <div className="mt-1 text-lg font-semibold text-zinc-100">
                {lastPoint.ply}. {lastPoint.move}
              </div>
            </div>

            <div
              className={[
                'text-xl font-semibold',
                lastPoint.value >= 0
                  ? 'text-green-400'
                  : 'text-red-400',
              ].join(' ')}
            >
              {formatEval(lastPoint.value)}
            </div>
          </div>

          <div className="mb-3">
            <MoveBadge
              classification={lastPoint.classification}
              small
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <MiniStat
              label="Before"
              value={
                lastPoint.previousValue === null
                  ? '—'
                  : formatEval(lastPoint.previousValue)
              }
            />

            <MiniStat
              label="After"
              value={formatEval(lastPoint.value)}
              tone={
                lastPoint.value >= 0
                  ? 'positive'
                  : 'negative'
              }
            />

            <MiniStat
              label="Change"
              value={`${lastPoint.evalChange > 0 ? '+' : ''}${lastPoint.evalChange.toFixed(2)}`}
              tone={
                lastPoint.evalChange >= 0
                  ? 'positive'
                  : 'negative'
              }
            />
          </div>

          {lastPoint.bestMove && (
            <div className="mt-3 rounded-xl bg-green-500/10 px-3 py-2 text-xs">
              <span className="text-zinc-500">
                Best:
              </span>

              <span className="ml-2 font-medium text-green-300">
                {lastPoint.bestMove}
              </span>
            </div>
          )}
        </div>
      )} */}
    </div>
  );
}
