import { ReactNode } from 'react';
import LeftNav from '@/components/Chess/LeftNav';
import { EvaluationPoint } from '@/types/evaluation';

interface Props {
  children: ReactNode;
  point: null;
}

export default function AppShell({ children, point }: Props) {
  return (
    <main className="min-h-screen bg-[#0b1118] text-zinc-100">
      <div className="flex gap-5 p-4">
        <LeftNav point={point} />

        <div className="min-w-0 flex-1">
          {children}
        </div>
      </div>
    </main>
  );
}
