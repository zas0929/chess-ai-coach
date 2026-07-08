'use client';

import { useMemo, useState } from 'react';

import { EvaluationPoint } from '@/types/evaluation';
import MoveBadge from '@/components/Chess/MoveBadge';
interface Props {
  values: EvaluationPoint[];
  currentValue: number;
  depth?: number;
  time?: number;
  moveTime?: number;
  skillLevel?: number;
  previousValue?: number;
}

const CHART_WIDTH = 260;
const CHART_HEIGHT = 120;
const MAX_EVAL = 5;

function clamp(value: number) {
  if (Math.abs(value) >= 900) {
    return value > 0 ? MAX_EVAL : -MAX_EVAL;
  }

  return Math.max(-MAX_EVAL, Math.min(MAX_EVAL, value));
}

function formatEval(value: number) {
  if (Math.abs(value) >= 900) {
    return 'Mate';
  }

  return `${value > 0 ? '+' : ''}${value.toFixed(2)}`;
}

function classifyMove(value: number) {
  const abs = Math.abs(value);

  if (abs >= 3) return 'Critical';
  if (abs >= 1.5) return 'Advantage';
  if (abs >= 0.5) return 'Slight edge';

  return 'Equal';
}

function formatClassification(
  classification?: string,
) {
  if (!classification) return 'Position';

  return classification
    .replace('-', ' ')
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}

export default function EvaluationGraph({
  values,
  currentValue,
  depth = 0,
  time = 0,
  moveTime = 0,
  skillLevel = 0,
  previousValue = null,
}: Props) {
  const [hoveredIndex, setHoveredIndex] =
    useState<number | null>(null);

  const normalizedValues =
    values.length > 0
      ? values
      : [{ ply: 0, fen: '', move: 'start', value: 0, source: 'engine' as const }];

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

  const lastPoint = points[points.length - 1];

  const hoveredPoint =
    hoveredIndex !== null ? points[hoveredIndex] : null;

  const activePoint = hoveredPoint ?? lastPoint;

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
      <div className="mb-3 flex items-start justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-300">
          Evaluation Graph
        </h2>

        <div
          className={[
            'text-4xl font-semibold leading-none',
            isWhiteBetter
              ? 'text-green-400'
              : isBlackBetter
                ? 'text-red-400'
                : 'text-zinc-200',
          ].join(' ')}
        >
          {formatEval(currentValue)}
        </div>
      </div>

      <div className="mb-4 text-right text-sm text-zinc-300">
        {isWhiteBetter
          ? 'White is better'
          : isBlackBetter
            ? 'Black is better'
            : 'Equal'}
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className="h-36 w-full overflow-visible"
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

          {activePoint && (
            <>
              <line
                x1={activePoint.x}
                x2={activePoint.x}
                y1={0}
                y2={CHART_HEIGHT}
                stroke="rgba(255,255,255,0.45)"
              />

              <circle
                cx={activePoint.x}
                cy={activePoint.y}
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
              {hoveredPoint.value > 0
                ? 'White is better'
                : hoveredPoint.value < 0
                  ? 'Black is better'
                  : 'Position is equal'}
            </div>

            <div className="mt-3 rounded-xl bg-white/[0.04] p-3 text-xs text-zinc-400">
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

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
        <Stat label="Skill Level" value={skillLevel || '—'} />
        <Stat label="Depth" value={depth || '—'} />
        <Stat
          label="Move Time"
          value={moveTime ? `${moveTime}ms` : '—'}
        />
        <Stat label="Time" value={`${time || 0}s`} />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <div className="text-sm text-zinc-500">{label}</div>
      <div className="mt-1 text-lg text-zinc-100">{value}</div>
    </div>
  );
}
