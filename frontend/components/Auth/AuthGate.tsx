'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';

import { api } from '@/lib/api';
import {
  isSupabaseConfigured,
  supabase,
} from '@/lib/supabase';

interface Props {
  children: ReactNode;
}

type AuthMode = 'login' | 'register';

export default function AuthGate({ children }: Props) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.access_token) {
      api.defaults.headers.common.Authorization =
        `Bearer ${session.access_token}`;
      return;
    }

    delete api.defaults.headers.common.Authorization;
  }, [session]);

  if (!isSupabaseConfigured) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b1118] text-zinc-100">
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-violet-300/30 border-t-violet-300" />
          Loading session
        </div>
      </main>
    );
  }

  if (!session) {
    const submit = async () => {
      if (!supabase) return;

      setMessage(null);
      setIsLoading(true);

      try {
        const result =
          mode === 'login'
            ? await supabase.auth.signInWithPassword({
                email,
                password,
              })
            : await supabase.auth.signUp({
                email,
                password,
              });

        if (result.error) {
          setMessage(result.error.message);
          return;
        }

        if (mode === 'register' && !result.data.session) {
          setMessage('Check your email to confirm registration.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b1118] px-4 text-zinc-100">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Chess AI Coach
          </div>

          <h1 className="mt-3 text-3xl font-semibold text-white">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>

          <div className="mt-6 space-y-3">
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-white/10 bg-[#0b1118] px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-violet-400/60"
            />

            <input
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Password"
              type="password"
              className="w-full rounded-xl border border-white/10 bg-[#0b1118] px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-violet-400/60"
            />
          </div>

          {message && (
            <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-200">
              {message}
            </div>
          )}

          <button
            onClick={submit}
            disabled={isLoading || !email || !password}
            className="mt-5 w-full rounded-xl bg-violet-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading
              ? 'Please wait...'
              : mode === 'login'
                ? 'Log in'
                : 'Register'}
          </button>

          <button
            onClick={() =>
              setMode((current) =>
                current === 'login' ? 'register' : 'login',
              )
            }
            className="mt-4 w-full text-sm text-zinc-400 transition hover:text-zinc-200"
          >
            {mode === 'login'
              ? 'Need an account? Register'
              : 'Already have an account? Log in'}
          </button>
        </div>
      </main>
    );
  }

  return (
    <>
      <div className="fixed right-4 top-4 z-50 flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b1118]/90 px-3 py-2 text-xs text-zinc-300 shadow-xl">
        <span>{session.user.email}</span>
        <button
          onClick={() => supabase?.auth.signOut()}
          className="text-violet-300 transition hover:text-violet-100"
        >
          Sign out
        </button>
      </div>
      {children}
    </>
  );
}
