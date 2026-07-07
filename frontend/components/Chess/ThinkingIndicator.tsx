interface Props {
  stats?: {
    time: number;
    skill_level: number;
  };
}

export default function ThinkingIndicator({ stats }: Props) {
  const safeStats = stats ?? {
    time: 0,
    skill_level: 10,
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-300">
          Engine
        </h2>

        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Stockfish
        </div>
      </div>

      <div className="mb-6">
        <div className="text-sm text-zinc-500">Status</div>
        <div className="mt-1 text-2xl font-medium">Thinking...</div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
        <div>
          <div className="text-sm text-zinc-500">Skill</div>
          <div className="mt-1 text-xl">{safeStats.skill_level}</div>
        </div>

        <div>
          <div className="text-sm text-zinc-500">Time</div>
          <div className="mt-1 text-xl">{safeStats.time}s</div>
        </div>
      </div>
    </div>
  );
}
