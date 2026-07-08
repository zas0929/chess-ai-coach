interface Props {
  values: number[];
  currentValue: number;
  skillLevel?: number;
  depth?: number;
  time?: number;
  moveTime?: number;
  engineName?: string;
}

const CHART_WIDTH = 360;
const CHART_HEIGHT = 160;
const MAX_EVAL = 10;

function clamp(value: number) {
  return Math.max(-MAX_EVAL, Math.min(MAX_EVAL, value));
}

function formatEval(value: number) {
  if (Math.abs(value) >= 900) {
    return 'Mate';
  }

  return `${value > 0 ? '+' : ''}${value.toFixed(2)}`;
}

export default function EvaluationGraph({
  values,
  currentValue,
  skillLevel = 10,
  depth = 0,
  moveTime = 500,
  time = 0,
  engineName = 'Stockfish',
}: Props) {
  const normalizedValues =
    values.length > 0 ? values : [0];

  const points = normalizedValues.map((value, index) => {
    const x =
      normalizedValues.length === 1
        ? 0
        : (index / (normalizedValues.length - 1)) *
          CHART_WIDTH;

    const y =
      CHART_HEIGHT / 2 -
      (clamp(value) / MAX_EVAL) *
        (CHART_HEIGHT / 2);

    return { x, y, value };
  });

  const linePath = points
    .map((point, index) =>
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`,
    )
    .join(' ');

  const greenAreaPath = `
    ${linePath}
    L ${CHART_WIDTH} ${CHART_HEIGHT / 2}
    L 0 ${CHART_HEIGHT / 2}
    Z
  `;

  const lastPoint = points[points.length - 1];

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-300">
          Evaluation
        </h2>

        <div
          className={[
            'text-4xl font-semibold',
            currentValue >= 0
              ? 'text-green-400'
              : 'text-red-400',
          ].join(' ')}
        >
          {formatEval(currentValue)}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_130px] gap-5">
        <div className="relative">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="h-44 w-full overflow-visible"
          >
            <defs>
              <linearGradient
                id="greenArea"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="rgba(74,222,128,0.45)"
                />
                <stop
                  offset="100%"
                  stopColor="rgba(74,222,128,0.05)"
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
                strokeDasharray="4 6"
              />
            ))}

            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={`v-${ratio}`}
                y1={0}
                y2={CHART_HEIGHT}
                x1={ratio * CHART_WIDTH}
                x2={ratio * CHART_WIDTH}
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="4 6"
              />
            ))}

            <line
              x1={0}
              x2={CHART_WIDTH}
              y1={CHART_HEIGHT / 2}
              y2={CHART_HEIGHT / 2}
              stroke="rgba(255,255,255,0.35)"
            />

            <path
              d={greenAreaPath}
              fill="url(#greenArea)"
            />

            <path
              d={linePath}
              fill="none"
              stroke={
                currentValue >= 0
                  ? '#66d94f'
                  : '#ef4444'
              }
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r={5}
              fill="#0b1118"
              stroke="white"
              strokeWidth={3}
            />
          </svg>

          <div className="mt-2 flex justify-between text-xs text-zinc-500">
            <span>0</span>
            <span>Move number</span>
            <span>{normalizedValues.length}</span>
          </div>
        </div>

        <div className="space-y-4 border-l border-white/10 pl-5">
          <div>
            <div className="text-sm text-zinc-500">
              Advantage
            </div>
            <div className="mt-1 text-sm text-zinc-300">
              {currentValue > 0
                ? 'White is better'
                : currentValue < 0
                  ? 'Black is better'
                  : 'Equal'}
            </div>
          </div>

          <Stat label="Skill Level" value={skillLevel || '—'} />
          <Stat label="Depth" value={depth || '—'} />
          <Stat label="Move Time" value={`${moveTime || 0}ms`} />
          <Stat
            label="Time"
            value={`${time || 0}s`}
          />
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string | number;
  value: string | number;
}) {
  return (
    <div className="border-t border-white/10 pt-3">
      <div className="text-sm text-zinc-500">
        {label}
      </div>
      <div className="mt-1 text-lg text-zinc-100">
        {value}
      </div>
    </div>
  );
}
