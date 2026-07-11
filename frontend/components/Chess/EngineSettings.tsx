interface Props {
  skillLevel: number;
  moveTime: number;
  depth: number;
  onSkillLevelChange: (value: number) => void;
  onMoveTimeChange: (value: number) => void;
  onDepthChange: (value: number) => void;
}

export default function EngineSettings({
  skillLevel,
  moveTime,
  depth,
  onSkillLevelChange,
  onMoveTimeChange,
  onDepthChange,
}: Props) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-300">
          Engine
        </h2>

        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Stockfish
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1">
        <CompactSetting
          label="Skill"
          hint="Lower is easier; higher plays stronger."
          tooltipAlign="left"
          value={skillLevel}
          min={0}
          max={20}
          step={1}
          onChange={onSkillLevelChange}
        />

        <CompactSetting
          label="Time"
          hint="Lower is faster; higher is more accurate."
          tooltipAlign="center"
          value={moveTime}
          min={100}
          max={5000}
          step={100}
          suffix="ms"
          onChange={onMoveTimeChange}
        />

        <CompactSetting
          label="Depth"
          hint="Higher sees deeper tactics, but costs time."
          tooltipAlign="right"
          value={depth}
          min={1}
          max={25}
          step={1}
          onChange={onDepthChange}
        />
      </div>

    </div>
  );
}

interface CompactSettingProps {
  label: string;
  hint: string;
  tooltipAlign: 'left' | 'center' | 'right';
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
}

function CompactSetting({
  label,
  hint,
  tooltipAlign,
  value,
  min,
  max,
  step,
  suffix = '',
  onChange,
}: CompactSettingProps) {
  const tooltipPosition =
    tooltipAlign === 'left'
      ? 'left-0'
      : tooltipAlign === 'right'
        ? 'right-0'
        : 'left-1/2 -translate-x-1/2';

  return (
    <label className="min-w-0 rounded-lg bg-white/[0.035] px-2 py-0.5">
      <div className="mb-0.5 flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1">
          <span className="truncate text-[11px] text-zinc-500">
            {label}
          </span>
          <span
            tabIndex={0}
            aria-label={`${label}: ${hint}`}
            className="group/help relative grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full border border-white/10 text-[9px] font-semibold text-zinc-500 outline-none transition hover:border-violet-300/30 hover:text-violet-200 focus:border-violet-300/40 focus:text-violet-100"
          >
            ?
            <span
              role="tooltip"
              className={[
                'pointer-events-none absolute bottom-[calc(100%+8px)] z-[140] hidden w-44 rounded-xl border border-violet-300/20 bg-[#111821] px-3 py-2 text-left text-xs font-normal leading-snug text-zinc-300 shadow-2xl shadow-black/40 group-hover/help:block group-focus/help:block',
                tooltipPosition,
              ].join(' ')}
            >
              {hint}
            </span>
          </span>
        </span>
        <span className="shrink-0 text-[11px] font-medium text-zinc-100">
          {value}
          {suffix}
        </span>
      </div>

      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-0.5 w-full cursor-pointer accent-violet-500"
      />
    </label>
  );
}
