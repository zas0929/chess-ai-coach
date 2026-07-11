import { ReactNode } from 'react';
import LeftNav from '@/components/Chess/LeftNav';
import { EvaluationPoint } from '@/types/evaluation';
import { PlayerStats } from '@/types/game';

interface Props {
  children: ReactNode;
  point?: EvaluationPoint;
  stats?: PlayerStats | null;
}

export default function AppShell({ children, point, stats }: Props) {
  return (
    <main className="min-h-screen bg-[#0b1118] text-zinc-100">
      <div className="flex gap-5 p-4">
        <LeftNav point={point} stats={stats} />

        <div className="min-w-0 flex-1">
          {children}
        </div>
      </div>
    </main>
  );
}
