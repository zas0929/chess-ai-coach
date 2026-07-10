'use client';

import { useMemo } from 'react';
import Image from 'next/image';

import { useAuth } from '@/components/Auth/AuthGate';
import CoachPanel from '@/components/Chess/CoachPanel';
import { EvaluationPoint } from '@/types/evaluation';

interface Props {
    point?: EvaluationPoint;
}

export default function LeftNav({
    point,
}: Props) {
    const { session, isConfigured, signOut } = useAuth();
    const email = session?.user.email ?? 'Guest mode';
    const avatarUrl =
        typeof session?.user.user_metadata.avatar_url === 'string'
            ? session.user.user_metadata.avatar_url
            : typeof session?.user.user_metadata.picture === 'string'
                ? session.user.user_metadata.picture
                : null;
    const initial = useMemo(
        () => email.trim().charAt(0).toUpperCase() || 'G',
        [email],
    );

    return (
        <aside className="w-[clamp(400px,26vw,540px)] shrink-0 border-r border-white/10 bg-[#0b1118] px-5 py-4">

            <div className="mb-5">

                <div className="text-sm tracking-[0.3em] text-zinc-500 uppercase">
                    Chess
                </div>

                <div className="mt-2 flex items-center justify-between gap-4">
                    <div className="text-2xl font-bold text-white">
                        ♔ AI Coach
                    </div>

                    <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.55)]" />
                </div>

            </div>

            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2.5 shadow-lg shadow-black/10">
                {avatarUrl ? (
                    <Image
                        src={avatarUrl}
                        alt=""
                        width={36}
                        height={36}
                        unoptimized
                        referrerPolicy="no-referrer"
                        className="h-9 w-9 shrink-0 rounded-xl border border-white/10 object-cover"
                    />
                ) : (
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-violet-300/20 bg-violet-400/15 text-sm font-semibold text-violet-100">
                        {initial}
                    </div>
                )}

                <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                        Account
                    </div>
                    <div className="truncate text-sm text-zinc-200">
                        {email}
                    </div>
                </div>

                {isConfigured && session && (
                    <button
                        type="button"
                        onClick={signOut}
                        className="shrink-0 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-medium text-zinc-400 transition hover:border-violet-300/30 hover:bg-violet-400/10 hover:text-violet-100"
                    >
                        Sign out
                    </button>
                )}
            </div>

            <CoachPanel point={point} />

        </aside>
    );
}
