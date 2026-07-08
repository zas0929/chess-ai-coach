import CoachPanel from '@/components/Chess/CoachPanel';
import { EvaluationPoint } from '@/types/evaluation';

interface Props {
    point?: EvaluationPoint;
}

export default function LeftNav({
    point,
}: Props) {

    return (
        <aside className="w-[320px] border-r border-white/10 bg-[#0b1118] p-6">

            <div className="mb-8">

                <div className="text-sm tracking-[0.3em] text-zinc-500 uppercase">
                    Chess
                </div>

                <div className="mt-2 text-3xl font-bold text-white">
                    ♔ AI Coach
                </div>

            </div>

            <CoachPanel point={point} />

        </aside>
    );
}
