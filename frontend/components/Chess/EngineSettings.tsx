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
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-300">
          Engine
        </h2>

        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Stockfish
        </div>
      </div>

      <div className="space-y-5">
        <SettingSlider
          label="Skill Level"
          value={skillLevel}
          min={0}
          max={20}
          step={1}
          onChange={onSkillLevelChange}
        />

        <SettingSlider
          label="Move Time"
          value={moveTime}
          min={100}
          max={5000}
          step={100}
          suffix="ms"
          onChange={onMoveTimeChange}
        />

        <SettingSlider
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

interface SettingSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
}

function SettingSlider({
  label,
  value,
  min,
  max,
  step,
  suffix = '',
  onChange,
}: SettingSliderProps) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-zinc-400">{label}</span>
        <span className="text-sm font-medium text-zinc-100">
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
        className="h-2 w-full cursor-pointer accent-violet-500"
      />
    </label>
  );
}
