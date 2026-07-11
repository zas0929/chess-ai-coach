'use client';

import {
    useEffect,
    useMemo,
    useState,
} from 'react';
import Image from 'next/image';

import { useAuth } from '@/components/Auth/AuthGate';
import CoachPanel from '@/components/Chess/CoachPanel';
import { BillingService } from '@/services/billing.service';
import { BillingStatus } from '@/types/billing';
import { EvaluationPoint } from '@/types/evaluation';
import { PlayerStats } from '@/types/game';

interface Props {
    point?: EvaluationPoint;
    stats?: PlayerStats | null;
}

export default function LeftNav({
    point,
    stats,
}: Props) {
    const { session, isConfigured, signOut } = useAuth();
    const [billingStatus, setBillingStatus] =
        useState<BillingStatus | null>(null);
    const [billingError, setBillingError] =
        useState<string | null>(null);
    const [isBillingLoading, setIsBillingLoading] = useState(false);
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

    useEffect(() => {
        if (!isConfigured || !session) {
            return;
        }

        let isCancelled = false;

        void (async () => {
            try {
                const status = await BillingService.getStatus();

                if (!isCancelled) {
                    setBillingStatus(status);
                    setBillingError(null);
                }
            } catch (error) {
                console.error(error);

                if (!isCancelled) {
                    setBillingError('Billing status unavailable');
                }
            }
        })();

        return () => {
            isCancelled = true;
        };
    }, [isConfigured, session]);

    const openBilling = async () => {
        setIsBillingLoading(true);
        setBillingError(null);

        try {
            const response = billingStatus?.is_pro
                ? await BillingService.createPortalSession()
                : await BillingService.createCheckoutSession();

            window.location.href = response.url;
        } catch (error) {
            console.error(error);
            setBillingError(
                billingStatus?.is_pro
                    ? 'Billing portal is not available yet'
                    : 'Upgrade is not available yet',
            );
        } finally {
            setIsBillingLoading(false);
        }
    };

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

            {isConfigured && session && (
                <PlanBlock
                    billingStatus={billingStatus}
                    aiRequests={stats?.ai_requests ?? 0}
                    isLoading={isBillingLoading}
                    error={billingError}
                    onOpenBilling={openBilling}
                />
            )}

            {stats && (
                <div className="mb-3 flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2 text-xs">
                    <CompactStat label="Lvl" value={stats.level} />
                    <CompactStat label="Games" value={stats.games_played} />
                    <CompactStat label="AI" value={stats.ai_requests} />

                    <div className="h-5 w-px bg-white/10" />

                    <div className="min-w-0 text-right">
                        <div className="text-[9px] uppercase tracking-[0.18em] text-zinc-500">
                            W-D-L
                        </div>
                        <div className="font-semibold text-zinc-100">
                            {stats.wins}-{stats.draws}-{stats.losses}
                        </div>
                    </div>
                </div>
            )}

            <CoachPanel point={point} />

        </aside>
    );
}

function PlanBlock({
    billingStatus,
    aiRequests,
    isLoading,
    error,
    onOpenBilling,
}: {
    billingStatus: BillingStatus | null;
    aiRequests: number;
    isLoading: boolean;
    error: string | null;
    onOpenBilling: () => void;
}) {
    const isPro = Boolean(billingStatus?.is_pro);
    const status = billingStatus?.status ?? 'free';

    return (
        <div className="mb-3 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <div className="text-[9px] uppercase tracking-[0.18em] text-zinc-500">
                        Plan
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                        <span
                            className={[
                                'h-2 w-2 rounded-full',
                                isPro
                                    ? 'bg-emerald-400'
                                    : 'bg-violet-400',
                            ].join(' ')}
                        />
                        <span className="text-sm font-semibold text-zinc-100">
                            {isPro ? 'Pro' : 'Free'}
                        </span>
                        <span className="truncate text-[11px] text-zinc-500">
                            {status}
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onOpenBilling}
                    disabled={isLoading}
                    className="shrink-0 rounded-lg border border-violet-400/30 bg-violet-400/10 px-2.5 py-1.5 text-xs font-medium text-violet-100 transition hover:bg-violet-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isLoading
                        ? 'Opening'
                        : isPro
                            ? 'Manage'
                            : 'Upgrade'}
                </button>
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
                <span>AI coach requests</span>
                <span className="font-medium text-zinc-300">
                    {isPro ? 'Unlimited' : `${aiRequests} used`}
                </span>
            </div>

            {error && (
                <div className="mt-2 text-[11px] text-yellow-200">
                    {error}
                </div>
            )}
        </div>
    );
}

function CompactStat({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <div className="min-w-0">
            <div className="truncate text-[9px] uppercase tracking-[0.18em] text-zinc-500">
                {label}
            </div>
            <div className="font-semibold text-zinc-100">
                {value}
            </div>
        </div>
    );
}
