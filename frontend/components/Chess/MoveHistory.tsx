interface Props {
  moves: string[];
}

export default function MoveHistory({ moves }: Props) {
  const rows = [];

  for (let i = 0; i < moves.length; i += 2) {
    rows.push({
      number: i / 2 + 1,
      white: moves[i],
      black: moves[i + 1] ?? '',
    });
  }

  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-300">
        Moves
      </h2>

      <div className="max-h-[420px] space-y-1 overflow-auto pr-2">
        {rows.map((row) => (
          <div
            key={row.number}
            className="grid grid-cols-[40px_1fr_1fr] rounded-lg px-2 py-1.5 text-sm hover:bg-white/[0.05]"
          >
            <span className="text-zinc-500">{row.number}.</span>
            <span>{row.white}</span>
            <span>{row.black}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
