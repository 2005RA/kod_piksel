// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

const SHADOW_DOMAIN = 'users.kodpiksel.internal';
const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

function shadowEmail(username) {
  return `${username.trim().toLowerCase()}@${SHADOW_DOMAIN}`;
}

async function callFunction(name, body, accessToken) {
  const res = await fetch(`${FUNCTIONS_URL}/${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Pass the caller's own session token when we have one, so the
      // function can identify *who* is calling it (e.g. change-username).
      // Falls back to the anon key for pre-login calls like register/reset.
      Authorization: `Bearer ${accessToken || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Sorğu uğursuz oldu.');
  return data;
}

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // NOTE: profiles.age / completed_tasks / puzzle_state are no longer
  // selectable directly by the authenticated role (they're private —
  // other users can only see username/avatar/level/chips for leaderboards).
  // get_own_profile() is a SECURITY DEFINER RPC that returns the caller's
  // own full row via auth.uid(), bypassing that column restriction the
  // same way the reward RPCs bypass RLS.
  const fetchProfile = useCallback(async (_userId) => {
    const { data, error } = await supabase.rpc('get_own_profile');
    if (!error) setProfile(data);
  }, []);

  // ── Strip OAuth token fragment from the URL ──
  // After a Google OAuth redirect, Supabase reads the session out of the
  // `#access_token=...` URL fragment but never removes it — the token
  // then sits in the address bar and browser history indefinitely.
  const stripAuthHashFromUrl = useCallback(() => {
    if (window.location.hash && window.location.hash.includes('access_token')) {
      window.history.replaceState({}, '', window.location.pathname + window.location.search);
    }
  }, []);

  // ── Boot: restore session ──
  // NOTE: previously this ran a manual getSession() call *and* a separate
  // onAuthStateChange subscription side by side. In supabase-js v2,
  // onAuthStateChange already fires immediately with the current session
  // (an "INITIAL_SESSION" event) — so the two were racing to call
  // setUser/fetchProfile/setLoading independently. Combined with React
  // StrictMode double-invoking this effect on mount in dev (without
  // cancelling the first invocation's in-flight promises), this could let
  // `loading` flip to false for a moment while `user` was transiently null,
  // which made RewardContext's identity-change effect think a fresh login
  // had happened and reset local reward state to zero before the real
  // profile reload could land. Using only the one subscription, plus a
  // `cancelled` guard for the StrictMode double-invoke case, removes the race.
  useEffect(() => {
    let cancelled = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).then(() => {
          if (!cancelled) stripAuthHashFromUrl();
        });
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [fetchProfile, stripAuthHashFromUrl]);

  // ── Register with username + password + 5 security answers ──
  async function registerWithUsername({ username, password, age, avatarEmoji, answers }) {
    await callFunction('register', { username, password, age, avatarEmoji, answers });
    const { data, error } = await supabase.auth.signInWithPassword({
      email: shadowEmail(username),
      password,
    });
    if (error) throw error;
    return data;
  }

  // ── Login with username + password ──
  async function loginWithUsername({ username, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: shadowEmail(username),
      password,
    });
    if (error) throw new Error('İstifadəçi adı və ya şifrə yanlışdır.');
    return data;
  }

  // ── Login with Google ──
  async function loginWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
  }

  // ── Forgot password (3-step) ──
  async function requestPasswordReset(username) {
    return callFunction('request-reset', { username }); // → { questions: [{questionId, text}, ...] }
  }
  async function verifyResetAnswers(username, answers) {
    return callFunction('verify-answers', { username, answers }); // → { token }
  }
  async function resetPassword(token, newPassword) {
    return callFunction('reset-password', { token, newPassword });
  }

  // ── Change password while logged in ──
  async function changePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  }

  // ── Logout ──
  async function logout() {
    await supabase.auth.signOut();
  }

  // ── Update profile ──
  // NOTE: username is intentionally excluded here. It has to stay in sync
  // with the Supabase auth account's shadow email, so it's only ever
  // changed through changeUsername() / the change-username edge function.
  async function updateProfile(fields) {
    if (!user) return;
    const { username, ...safeFields } = fields;
    // Can't chain .select() here anymore — the default `select=*` PostgREST
    // does after a write would try to return age/completed_tasks/puzzle_state,
    // which the authenticated role no longer has column-level SELECT on.
    // Re-fetch via the RPC instead, which bypasses that restriction for the
    // owner's own row.
    const { error } = await supabase
      .from('profiles')
      .update(safeFields)
      .eq('id', user.id);
    if (!error) await fetchProfile(user.id);
    return { error };
  }

  // ── Change username (validates + checks uniqueness + updates auth email) ──
  async function changeUsername(newUsername) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Giriş tələb olunur.');

    const result = await callFunction(
      'change-username',
      { username: newUsername },
      session.access_token
    );

    if (result.profile) {
      setProfile(result.profile);
    } else {
      await fetchProfile(session.user.id);
    }
    return result;
  }

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      registerWithUsername, loginWithUsername, loginWithGoogle, logout, updateProfile, fetchProfile,
      requestPasswordReset, verifyResetAnswers, resetPassword, changePassword, changeUsername,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}