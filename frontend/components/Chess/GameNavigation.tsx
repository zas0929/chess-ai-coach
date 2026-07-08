interface Props {
  currentPly: number;
  totalPly: number;
  isLive: boolean;
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
}

export default function GameNavigation({
  currentPly,
  totalPly,
  isLive,
  onFirst,
  onPrev,
  onNext,
  onLast,
}: Props) {
  const buttonClass =
    'rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div className="mt-3 flex items-center justify-center gap-2">
      <button
        onClick={onFirst}
        disabled={currentPly === 0}
        className={buttonClass}
      >
        ⏮
      </button>

      <button
        onClick={onPrev}
        disabled={currentPly === 0}
        className={buttonClass}
      >
        ◀
      </button>

      <div className="min-w-24 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-center text-sm text-zinc-300">
        {currentPly} / {totalPly}
        {!isLive && (
          <span className="ml-2 text-violet-300">
            review
          </span>
        )}
      </div>

      <button
        onClick={onNext}
        disabled={currentPly === totalPly}
        className={buttonClass}
      >
        ▶
      </button>

      <button
        onClick={onLast}
        disabled={currentPly === totalPly}
        className={buttonClass}
      >
        ⏭
      </button>
    </div>
  );
}
