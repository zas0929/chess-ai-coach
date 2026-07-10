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
          value={skillLevel}
          min={0}
          max={20}
          step={1}
          onChange={onSkillLevelChange}
        />

        <CompactSetting
          label="Time"
          value={moveTime}
          min={100}
          max={5000}
          step={100}
          suffix="ms"
          onChange={onMoveTimeChange}
        />

        <CompactSetting
          label="Depth"
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
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
}

function CompactSetting({
  label,
  value,
  min,
  max,
  step,
  suffix = '',
  onChange,
}: CompactSettingProps) {
  return (
    <label className="min-w-0 rounded-lg bg-white/[0.035] px-2 py-0.5">
      <div className="mb-0.5 flex items-center justify-between gap-2">
        <span className="truncate text-[11px] text-zinc-500">
          {label}
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
