interface Props {
  value: number;
}

export default function Evaluation({
  value,
}: Props) {
  return (
    <div className="rounded bg-zinc-800 p-4 text-white">
      Evaluation: {value.toFixed(2)}
    </div>
  );
}
