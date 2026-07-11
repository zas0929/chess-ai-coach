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

            <AccountSummary
                avatarUrl={avatarUrl}
                billingStatus={billingStatus}
                billingError={billingError}
                email={email}
                initial={initial}
                isAuthReady={isConfigured && Boolean(session)}
                isBillingLoading={isBillingLoading}
                stats={stats}
                onOpenBilling={openBilling}
                onSignOut={signOut}
            />

            <CoachPanel point={point} />

        </aside>
    );
}

function AccountSummary({
    avatarUrl,
    billingStatus,
    billingError,
    email,
    initial,
    isAuthReady,
    isBillingLoading,
    stats,
    onOpenBilling,
    onSignOut,
}: {
    avatarUrl: string | null;
    billingStatus: BillingStatus | null;
    billingError: string | null;
    email: string;
    initial: string;
    isAuthReady: boolean;
    isBillingLoading: boolean;
    stats?: PlayerStats | null;
    onOpenBilling: () => void;
    onSignOut: () => void;
}) {
    const isPro = Boolean(billingStatus?.is_pro);
    const status = billingStatus?.status ?? 'free';

    return (
        <div className="mb-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3 shadow-lg shadow-black/10">
            <div className="flex items-center gap-3">
                {avatarUrl ? (
                    <Image
                        src={avatarUrl}
                        alt=""
                        width={38}
                        height={38}
                        unoptimized
                        referrerPolicy="no-referrer"
                        className="h-[38px] w-[38px] shrink-0 rounded-xl border border-white/10 object-cover"
                    />
                ) : (
                    <div className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-xl border border-violet-300/20 bg-violet-400/15 text-sm font-semibold text-violet-100">
                        {initial}
                    </div>
                )}

                <div className="min-w-0 flex-1">
                    <div className="text-[9px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                        Account
                    </div>
                    <div className="truncate text-sm font-medium text-zinc-100">
                        {email}
                    </div>
                </div>

                {isAuthReady && (
                    <button
                        type="button"
                        onClick={onSignOut}
                        className="shrink-0 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-medium text-zinc-400 transition hover:border-violet-300/30 hover:bg-violet-400/10 hover:text-violet-100"
                    >
                        Sign out
                    </button>
                )}
            </div>

            <div className="my-3 h-px bg-white/10" />

            <div className="grid gap-2">
                {isAuthReady && (
                    <div className="rounded-xl border border-white/5 bg-white/[0.035] px-3 py-2">
                        <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                                <div className="text-[9px] uppercase tracking-[0.18em] text-zinc-500">
                                    Plan
                                </div>
                                <div className="mt-1 flex items-center gap-2">
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
                                disabled={isBillingLoading}
                                className="shrink-0 rounded-lg border border-violet-400/30 bg-violet-400/10 px-2.5 py-1.5 text-xs font-medium text-violet-100 transition hover:bg-violet-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isBillingLoading
                                    ? 'Opening'
                                    : isPro
                                        ? 'Manage'
                                        : 'Upgrade'}
                            </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-zinc-500">
                            <span>AI requests</span>
                            <span className="font-medium text-zinc-300">
                                {isPro
                                    ? 'Unlimited'
                                    : `${stats?.ai_requests ?? 0} used`}
                            </span>
                        </div>
                    </div>
                )}

                {stats && (
                    <div className="grid grid-cols-4 gap-2">
                        <MetricChip
                            label="Level"
                            value={stats.level}
                            tone="violet"
                        />
                        <MetricChip
                            label="Games"
                            value={stats.games_played}
                            tone="sky"
                        />
                        <MetricChip
                            label="AI"
                            value={stats.ai_requests}
                            tone="emerald"
                        />
                        <MetricChip
                            label="Record"
                            value={`${stats.wins}/${stats.draws}/${stats.losses}`}
                            tone="amber"
                        />
                    </div>
                )}

                {!isAuthReady && !stats && (
                    <div className="col-span-2 rounded-xl bg-white/[0.035] px-3 py-2 text-xs text-zinc-500">
                        Sign in to sync progress and unlock billing.
                    </div>
                )}
            </div>

            {billingError && (
                <div className="mt-2 text-[11px] text-yellow-200">
                    {billingError}
                </div>
            )}
        </div>
    );
}

function MetricChip({
    label,
    value,
    tone,
}: {
    label: string;
    value: number | string;
    tone: 'violet' | 'sky' | 'emerald' | 'amber';
}) {
    const toneClass = {
        violet: 'border-violet-400/15 bg-violet-400/10 text-violet-100',
        sky: 'border-sky-400/15 bg-sky-400/10 text-sky-100',
        emerald: 'border-emerald-400/15 bg-emerald-400/10 text-emerald-100',
        amber: 'border-amber-400/15 bg-amber-400/10 text-amber-100',
    }[tone];

    return (
        <div
            className={[
                'min-w-0 rounded-lg border px-2.5 py-2',
                toneClass,
            ].join(' ')}
        >
            <div className="truncate text-[9px] uppercase tracking-[0.14em] opacity-55">
                {label}
            </div>
            <div className="mt-0.5 truncate text-sm font-semibold">
                {value}
            </div>
        </div>
    );
}
