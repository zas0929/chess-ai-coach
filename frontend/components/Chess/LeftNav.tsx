import CoachPanel from '@/components/Chess/CoachPanel';
import { EvaluationPoint } from '@/types/evaluation';

interface Props {
    point?: EvaluationPoint;
}

export default function LeftNav({
    point,
}: Props) {

    return (
        <aside className="w-[clamp(400px,26vw,540px)] shrink-0 border-r border-white/10 bg-[#0b1118] px-5 py-4">

            <div className="mb-6">

                <div className="text-sm tracking-[0.3em] text-zinc-500 uppercase">
                    Chess
                </div>

                <div className="mt-2 text-2xl font-bold text-white">
                    ♔ AI Coach
                </div>

            </div>

            <CoachPanel point={point} />

        </aside>
    );
}
