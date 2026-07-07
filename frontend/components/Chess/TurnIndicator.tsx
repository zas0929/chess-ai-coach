interface Props {
  turn: 'w' | 'b';
}

export default function TurnIndicator({
  turn,
}: Props) {
  return (
    <div className="rounded bg-zinc-800 p-4">
      Turn:
      <strong className="ml-2">
        {turn === 'w' ? 'White' : 'Black'}
      </strong>
    </div>
  );
}
