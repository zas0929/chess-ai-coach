'use client';

interface Props {
  value: number;
}

export default function EvaluationBar({
  value,
}: Props) {
  // Ограничиваем диапазон
  const clamped = Math.max(
    -10,
    Math.min(10, value),
  );

  // Процент белой части
  const whitePercent =
    50 + clamped * 5;

  return (
    <div className="flex flex-col items-center gap-2">

      <div className="text-sm">
        {Math.abs(value) >= 900
          ? 'Mate'
          : `${value > 0 ? '+' : ''}${value.toFixed(2)}`}
      </div>

      <div
        className="
          h-[500px]
          w-8
          bg-black
          rounded
          overflow-hidden
          border
          border-zinc-600
        "
      >
        <div
          className="
            bg-white
            transition-all
            duration-700
            ease-in-out
          "
          style={{
            height: `${whitePercent}%`,
          }}
        />
      </div>

    </div>
  );
}
