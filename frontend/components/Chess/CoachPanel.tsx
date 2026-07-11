'use client';

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AxiosError } from 'axios';

import MoveBadge from '@/components/Chess/MoveBadge';
import { BillingService } from '@/services/billing.service';
import { CoachService } from '@/services/coach.service';
import {
  CoachChatMessage,
  CoachExplainRequest,
  CoachExplainResponse,
  AIUsageInfo,
  QuotaInfo,
} from '@/types/coach';
import { EvaluationPoint } from '@/types/evaluation';
import { formatEval } from '@/utils/evaluationText';

interface Props {
  point?: EvaluationPoint;
}

const severityClass = {
  success: 'border-emerald-500/20 bg-emerald-500/10',
  info: 'border-sky-500/20 bg-sky-500/10',
  warning: 'border-yellow-500/20 bg-yellow-500/10',
  danger: 'border-red-500/20 bg-red-500/10',
};

export default function CoachPanel({ point }: Props) {
  const [coachBrief, setCoachBrief] =
    useState<CoachExplainResponse | null>(null);

  const [chatMessages, setChatMessages] = useState<
    CoachChatMessage[]
  >([]);

  const [draftMessage, setDraftMessage] = useState('');

  const [isExplaining, setIsExplaining] =
    useState(false);

  const [isChatting, setIsChatting] = useState(false);

  const [lastUsage, setLastUsage] =
    useState<AIUsageInfo | null>(null);

  const [quota, setQuota] = useState<QuotaInfo | null>(null);

  const [paywallMessage, setPaywallMessage] =
    useState<string | null>(null);

  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] =
    useState<string | null>(null);

  const coachContext = useMemo<
    CoachExplainRequest | null
  >(() => {
    if (!point || point.ply === 0) {
      return null;
    }

    return {
      fenBefore: point.fenBefore,
      fenAfter: point.fen,
      move: point.move,
      moveNumber: point.moveNumber,
      side: point.side,
      player: point.player,
      engine: point.engine,
      bestMove: point.bestMove,
      classification: point.classification,
      evaluationBefore: point.previousValue,
      evaluationAfter: point.value,
      evaluationChange: point.evalChange,
      opening: point.opening,
      history: point.history,
    };
  }, [point]);

  useEffect(() => {
    let isCancelled = false;

    void (async () => {
      try {
        const nextQuota = await CoachService.getQuota();

        if (!isCancelled) {
          setQuota(nextQuota);
        }
      } catch (error) {
        console.error(error);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, []);

  const quotaExhausted =
    Boolean(quota?.enforced && quota.remaining <= 0);

  if (!point || point.ply === 0) {
    return (
      <div>
        <SectionTitle />

        {quota && <QuotaPill quota={quota} />}

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-zinc-400">
          Play your first move to start the analysis.
        </div>
      </div>
    );
  }

  const coach = CoachService.explain(point);

  const startCoachChat = async () => {
    if (!coachContext) return;

    if (quotaExhausted) {
      setPaywallMessage('You used your free AI coach messages.');
      return;
    }

    setIsExplaining(true);

    try {
      const response =
        await CoachService.explainWithAI(coachContext);

      setCoachBrief(response);
      setLastUsage(response.usage ?? null);
      setQuota(response.quota ?? null);
      setPaywallMessage(null);
    } catch (error) {
      handleCoachError(error, setPaywallMessage);
    } finally {
      setIsExplaining(false);
    }
  };

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();

    if (!coachContext || !draftMessage.trim()) {
      return;
    }

    if (quotaExhausted) {
      setPaywallMessage('You used your free AI coach messages.');
      return;
    }

    const nextMessages: CoachChatMessage[] = [
      ...chatMessages,
      {
        role: 'user',
        content: draftMessage.trim(),
      },
    ];

    setChatMessages(nextMessages);
    setDraftMessage('');
    setIsChatting(true);

    try {
      const response = await CoachService.chat({
        context: coachContext,
        messages: nextMessages,
      });

      setChatMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: response.answer,
        },
      ]);
      setLastUsage(response.usage ?? null);
      setQuota(response.quota ?? null);
      setPaywallMessage(null);
    } catch (error) {
      handleCoachError(error, setPaywallMessage);
    } finally {
      setIsChatting(false);
    }
  };

  const upgrade = async () => {
    setIsUpgrading(true);
    setUpgradeError(null);

    try {
      const response =
        await BillingService.createCheckoutSession();

      window.location.href = response.url;
    } catch (error) {
      console.error(error);
      setUpgradeError(
        'Upgrade is not available yet. Check Stripe settings.',
      );
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div>
      <SectionTitle />

      {quota && <QuotaPill quota={quota} />}

      <div
        className={[
          'rounded-2xl border p-3',
          severityClass[coach.severity],
        ].join(' ')}
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-500">
              Move {point.ply}
            </div>

            <div className="mt-0.5 text-xl font-semibold text-white">
              {point.move}
            </div>
          </div>

          <MoveBadge
            classification={point.classification}
            small
          />
        </div>

        <div className="mt-3 text-base font-semibold text-white">
          {coach.title}
        </div>

        <div className="mt-1.5 text-sm leading-5 text-zinc-300">
          {coach.explanation}
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <div className="text-xs uppercase tracking-widest text-zinc-500">
          Evaluation
        </div>

        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
          <MiniStat
            label="Before"
            value={
              point.previousValue === null
                ? '—'
                : formatEval(point.previousValue)
            }
          />

          <MiniStat
            label="After"
            value={formatEval(point.value)}
            tone={point.value >= 0 ? 'positive' : 'negative'}
          />

          <MiniStat
            label="Change"
            value={`${point.evalChange > 0 ? '+' : ''}${point.evalChange.toFixed(2)}`}
            tone={point.evalChange >= 0 ? 'positive' : 'negative'}
          />
        </div>
      </div>

      {point.bestMove && (
        <div className="mt-3 rounded-2xl border border-green-500/20 bg-green-500/10 p-3">
          <div className="text-xs uppercase tracking-widest text-green-300">
            Best Move
          </div>

          <div className="mt-1.5 text-lg font-semibold text-green-300">
            {point.bestMove}
          </div>
        </div>
      )}

      <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <div className="text-xs uppercase tracking-widest text-zinc-500">
          Coach Tip
        </div>

        <div className="mt-2 text-sm leading-5 text-zinc-300">
          {coach.tip}
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-violet-300">
              Chat with Coach
            </div>

            <div className="mt-1 text-xs leading-5 text-zinc-400">
              Ask about ideas, alternatives, traps, or plans.
            </div>
          </div>

          {!coachBrief && (
            <button
              onClick={startCoachChat}
              disabled={isExplaining || quotaExhausted}
              className="inline-flex items-center gap-2 rounded-lg border border-violet-400/30 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-200 transition hover:bg-violet-400/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isExplaining && (
                <span className="h-3 w-3 animate-spin rounded-full border border-violet-200/30 border-t-violet-200" />
              )}
              {isExplaining ? 'Thinking' : 'Start'}
            </button>
          )}
        </div>

        {coachBrief && (
          <div className="mt-3 rounded-xl border border-white/10 bg-[#0b1118]/50 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-white">
                {coachBrief.title}
              </div>

              <div className="rounded-lg bg-white/10 px-2 py-1 text-[11px] text-zinc-300">
                {coachBrief.theme}
              </div>
            </div>

            <div className="mt-2 text-sm leading-5 text-zinc-300">
              {coachBrief.explanation}
            </div>

            <div className="mt-3 border-t border-white/10 pt-3 text-xs leading-5 text-zinc-400">
              {coachBrief.tip}
            </div>
          </div>
        )}

        {chatMessages.length > 0 && (
          <div className="mt-3 max-h-56 space-y-2 overflow-auto pr-1">
            {chatMessages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={[
                  'rounded-xl px-3 py-2 text-sm leading-5',
                  message.role === 'user'
                    ? 'ml-6 bg-white/10 text-zinc-100'
                    : 'mr-6 bg-[#0b1118]/60 text-zinc-300',
                ].join(' ')}
              >
                {message.content}
              </div>
            ))}

            {isChatting && <TypingBubble />}
          </div>
        )}

        {chatMessages.length === 0 && isChatting && (
          <div className="mt-3">
            <TypingBubble />
          </div>
        )}

        <form
          onSubmit={sendMessage}
          className="mt-3 flex gap-2"
        >
          <input
            value={draftMessage}
            onChange={(event) =>
              setDraftMessage(event.target.value)
            }
            disabled={quotaExhausted}
            placeholder={
              quotaExhausted
                ? 'Upgrade to keep chatting'
                : 'Ask anything...'
            }
            className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#0b1118] px-3 py-1.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-violet-400/60"
          />

          <button
            disabled={
              isChatting ||
              !draftMessage.trim() ||
              quotaExhausted
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-violet-400/30 bg-violet-400/15 px-3 py-1.5 text-sm font-medium text-violet-200 transition hover:bg-violet-400/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isChatting && (
              <span className="h-4 w-4 animate-spin rounded-full border border-violet-200/30 border-t-violet-200" />
            )}
            {isChatting ? 'Thinking' : 'Ask'}
          </button>
        </form>

        {(paywallMessage || quotaExhausted) && (
          <PaywallCallout
            message={
              paywallMessage ??
              'Free AI coach limit reached.'
            }
            isUpgrading={isUpgrading}
            error={upgradeError}
            onUpgrade={upgrade}
          />
        )}

        {(lastUsage || quota) && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
            {lastUsage && (
              <span className="rounded-lg bg-white/[0.05] px-2 py-1">
                Tokens: {lastUsage.total_tokens}
              </span>
            )}

            {quota && (
              <span className="rounded-lg bg-white/[0.05] px-2 py-1">
                {quota.enforced
                  ? `Free left: ${quota.remaining}/${quota.limit}`
                  : 'Pro: unlimited coach'}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function handleCoachError(
  error: unknown,
  setPaywallMessage: (message: string | null) => void,
) {
  if (
    error instanceof AxiosError &&
    error.response?.status === 402
  ) {
    setPaywallMessage(
      'You used your free AI coach messages.',
    );
    return;
  }

  throw error;
}

function QuotaPill({ quota }: { quota: QuotaInfo }) {
  const isPro = !quota.enforced;
  const usedLabel = isPro
    ? `${quota.used} AI requests`
    : `${quota.used}/${quota.limit} used`;
  const progress = isPro
    ? 100
    : Math.min(
      100,
      Math.max(0, (quota.used / quota.limit) * 100),
    );

  return (
    <div className="mb-3 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            AI Coach
          </div>
          <div className="mt-0.5 text-xs font-medium text-zinc-300">
            {isPro ? 'Pro plan' : 'Free plan'}
          </div>
        </div>

        <div
          className={[
            'rounded-lg px-2 py-1 text-[11px] font-medium',
            isPro
              ? 'bg-emerald-500/10 text-emerald-300'
              : quota.remaining > 0
                ? 'bg-violet-400/10 text-violet-200'
                : 'bg-yellow-500/10 text-yellow-200',
          ].join(' ')}
        >
          {isPro
            ? usedLabel
            : `${quota.remaining} left`}
        </div>
      </div>

      {!isPro && (
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-violet-400"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

function PaywallCallout({
  message,
  isUpgrading,
  error,
  onUpgrade,
}: {
  message: string;
  isUpgrading: boolean;
  error: string | null;
  onUpgrade: () => void;
}) {
  return (
    <div className="mt-3 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-3">
      <div className="text-sm font-medium text-yellow-100">
        {message}
      </div>
      <div className="mt-1 text-xs leading-5 text-yellow-100/70">
        Upgrade to continue using Chat with Coach.
      </div>

      {error && (
        <div className="mt-2 text-xs text-red-200">
          {error}
        </div>
      )}

      <button
        onClick={onUpgrade}
        disabled={isUpgrading}
        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-violet-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isUpgrading && (
          <span className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white" />
        )}
        {isUpgrading ? 'Opening checkout' : 'Upgrade'}
      </button>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="mr-6 flex items-center gap-2 rounded-xl bg-[#0b1118]/60 px-3 py-2 text-sm text-zinc-300">
      <span className="h-4 w-4 animate-spin rounded-full border border-violet-300/30 border-t-violet-300" />
      <span>Coach is thinking</span>
      <span className="flex gap-1">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-300" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-300 [animation-delay:120ms]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-300 [animation-delay:240ms]" />
      </span>
    </div>
  );
}

function SectionTitle() {
  return (
    <div className="mb-4">
      <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">
        AI Coach
      </div>

      <div className="mt-1.5 text-xl font-semibold text-white">
        Your Assistant
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'positive' | 'negative';
}) {
  return (
    <div className="rounded-lg bg-white/[0.04] px-2.5 py-2">
      <div className="text-[11px] text-zinc-500">
        {label}
      </div>

      <div
        className={[
          'mt-1 font-medium',
          tone === 'positive'
            ? 'text-green-400'
            : tone === 'negative'
              ? 'text-red-400'
              : 'text-zinc-200',
        ].join(' ')}
      >
        {value}
      </div>
    </div>
  );
}
