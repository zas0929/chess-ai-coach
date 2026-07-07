interface Props {
  stats?: {
    time?: number;
    skill_level?: number;
    depth?: number;
    move_time?: number;
  };
}

export default function ThinkingIndicator({ stats }: Props) {
  const safeStats = {
    time: stats?.time ?? 0,
    skill_level: stats?.skill_level ?? 10,
    depth: stats?.depth ?? 12,
    move_time: stats?.move_time ?? 500,
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-300">
          Engine Status
        </h2>

        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Stockfish
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
        <Stat label="Skill" value={safeStats.skill_level} />
        <Stat label="Depth" value={safeStats.depth} />
        <Stat label="Move time" value={`${safeStats.move_time}ms`} />
        <Stat label="Last response" value={`${safeStats.time}s`} />
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
      <div className="mt-1 text-xl">{value}</div>
    </div>
  );
}
