const navItems = [
  { label: 'Game', icon: '♟' },
  { label: 'Engine', icon: '⚙' },
  { label: 'Analysis', icon: '⌕' },
  { label: 'Coach', icon: '💬' },
  { label: 'Openings', icon: '□' },
  { label: 'Settings', icon: '⚙' },
];

export default function LeftNav() {
  return (
    <aside className="hidden h-[calc(100vh-32px)] w-60 shrink-0 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl xl:flex xl:flex-col">
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/20 text-2xl">
            ♔
          </div>

          <div>
            <div className="text-xl font-semibold leading-tight">
              Chess
            </div>
            <div className="text-xl font-semibold leading-tight text-violet-300">
              AI Coach
            </div>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item, index) => (
          <button
            key={item.label}
            className={[
              'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition',
              index === 0
                ? 'bg-violet-500/25 text-white ring-1 ring-violet-400/20'
                : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white',
            ].join(' ')}
          >
            <span className="w-5 text-center text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <button className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-200">
          <span>☾ Dark</span>
          <span className="text-zinc-500">⌄</span>
        </button>

        <div className="border-t border-white/10 pt-4 text-sm text-zinc-500">
          <div>Stockfish</div>
          <div>v1.0.0</div>
        </div>
      </div>
    </aside>
  );
}
