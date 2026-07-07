import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { addNotifGlobal } from './NotifContext';
import { flyReward } from '../components/RewardFly';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { RACES } from '../data/races';
import { RACE_END_REWARDS, WEEKLY_REWARDS, getRewardForRank, PUZZLE_ID, PUZZLE_GRAND_REWARD } from '../data/rewards';
import { loadGuestProgress, saveGuestProgress, clearGuestProgress } from '../utils/guestProgress';
import { startOfWeek } from '../lib/week';

const RewardContext = createContext(null);
const MAX_LEVEL = 100;
const GUEST_LOCK_LEVEL = 3;

// Hand-tuned deltas for early levels (irregular by design).
// From level 12 onward, deltas follow a formula (see deltaForLevel).
const LEVEL_DELTAS = {
  2: 10, 3: 10, 4: 25, 5: 15, 6: 15,
  7: 20, 8: 20, 9: 20, 10: 15, 11: 20,
};

function deltaForLevel(level) {
  if (LEVEL_DELTAS[level] !== undefined) return LEVEL_DELTAS[level];
  // level >= 12: delta starts at 30, +10 every 4 levels (12-15:30, 16-19:40, 20-23:50, ...)
  const block = Math.floor((level - 12) / 4);
  return 30 + 10 * block;
}

// Precompute total chips required to REACH each level, 1..MAX_LEVEL.
function buildLevelThresholds(maxLevel) {
  const thresholds = { 1: 0 };
  let total = 0;
  for (let lvl = 2; lvl <= maxLevel; lvl++) {
    total += deltaForLevel(lvl);
    thresholds[lvl] = total;
  }
  return thresholds;
}

const LEVEL_THRESHOLDS = buildLevelThresholds(MAX_LEVEL);

function getThreshold(level) {
  if (level < 2) return Infinity;
  return LEVEL_THRESHOLDS[level] ?? Infinity;
}

function calcLevel(totalChips) {
  let level = 1;
  while (level < MAX_LEVEL && totalChips >= getThreshold(level + 1)) {
    level++;
  }
  return level;
}

const LEVEL_REWARDS = {
  2:  { keys: 1,  chips: 0, hourglasses: 0, stickers: 0, label: 'Səviyyə 2'  },
  3:  { keys: 1,  chips: 0, hourglasses: 1, stickers: 0, label: 'Səviyyə 3'  },
  4:  { keys: 2,  chips: 0, hourglasses: 1, stickers: 1, label: 'Səviyyə 4'  },
  5:  { keys: 2,  chips: 0, hourglasses: 2, stickers: 1, label: 'Səviyyə 5'  },
  6:  { keys: 3,  chips: 0, hourglasses: 2, stickers: 1, label: 'Səviyyə 6'  },
  7:  { keys: 3,  chips: 0, hourglasses: 3, stickers: 2, label: 'Səviyyə 7'  },
  8:  { keys: 7,  chips: 0, hourglasses: 5, stickers: 3, label: 'Səviyyə 8'  },
  9:  { keys: 8,  chips: 0, hourglasses: 5, stickers: 3, label: 'Səviyyə 9'  },
  10: { keys: 9,  chips: 0, hourglasses: 6, stickers: 3, label: 'Səviyyə 10' },
  11: { keys: 10, chips: 0, hourglasses: 6, stickers: 3, label: 'Səviyyə 11' },
  12: { keys: 11,  chips: 0, hourglasses: 7, stickers: 3, label: 'Səviyyə 12' },
  13: { keys: 11,  chips: 0, hourglasses: 7, stickers: 3, label: 'Səviyyə 13' },
  14: { keys: 12,  chips: 0, hourglasses: 8, stickers: 3, label: 'Səviyyə 14' },
  15: { keys: 12,  chips: 0, hourglasses: 8, stickers: 3, label: 'Səviyyə 15' },
  16: { keys: 13,  chips: 0, hourglasses: 9, stickers: 3, label: 'Səviyyə 16' },
};

// ── REWARD POPUP ─────────────────────────────────────────────────────────────
function RewardPopup({ data, onClose }) {
  if (!data) return null;
  const { rank, tier, label } = data;

  const parts = [];
  if (tier.chips       > 0) parts.push(`${tier.chips} 🖥️`);
  if (tier.keys        > 0) parts.push(`${tier.keys} 🗝️`);
  if (tier.hourglasses > 0) parts.push(`${tier.hourglasses} ⏳`);
  if (tier.pixels      > 0) parts.push(`${tier.pixels} 🧩`);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'var(--bg-card, #0f1f35)',
        border: '2px solid var(--accent, #00d4aa)',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '360px',
        width: '90%',
        textAlign: 'center',
        color: 'var(--text, #e0e0e0)',
        boxShadow: '0 0 40px rgba(0,212,170,0.3)',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          {label} Bitdi!
        </div>
        {rank != null && (
          <div style={{ fontSize: '1rem', color: 'var(--accent, #00d4aa)', marginBottom: '1rem' }}>
            Sən #{rank} yerdə bitirdin
          </div>
        )}
        {parts.length > 0 && (
          <div style={{
            background: 'rgba(0,212,170,0.1)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '1.1rem',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            {parts.map((p, i) => <span key={i}>{p}</span>)}
          </div>
        )}
        <button
          onClick={onClose}
          style={{
            background: 'var(--accent, #00d4aa)',
            color: '#0a0f1e',
            border: 'none',
            borderRadius: '8px',
            padding: '0.6rem 2rem',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Əla! 🎉
        </button>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export function RewardProvider({ children }) {
  const { user, profile, updateProfile, loading: authLoading } = useAuth();
  const [rewards, setRewards] = useState({
    key: 0, chip: 0, hourglass: 0, level: 1,
  });
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const levelUpFiredRef = useRef(new Set());
  const pendingTasksRef = useRef(new Set());
  const [loaded, setLoaded] = useState(false);
  const claimsCheckedRef = useRef(false);
  const mergedGuestRef = useRef(false);

  const [popup, setPopup] = useState(null);
  const prevUserIdRef = useRef(undefined); // undefined = not yet initialized

  // Guards the PERSIST effects below against writing stale (pre-reset)
  // reward values during the render pass where identity just changed.
  // Refs update synchronously (unlike state), so setting this here is
  // guaranteed to be visible to the PERSIST effects that run right after
  // this one in the same commit — closing the race where the guest-persist
  // effect would otherwise fire with `loaded` still true and the OLD
  // rewards, writing the logged-out user's numbers into localStorage as
  // "guest progress" right before the LOAD effect reads them back.
  const skipPersistRef = useRef(false);

  // ── RESET: when the logged-in identity changes (login, logout, or
  // switching accounts), wipe local reward state so stale data doesn't
  // leak between users/guest. This must run BEFORE the LOAD effect below
  // so that effect re-fires with a clean slate. ──
  useEffect(() => {
    if (authLoading) return;
    const currentUserId = user?.id ?? null;

    if (prevUserIdRef.current === undefined) {
      prevUserIdRef.current = currentUserId; // first mount, let LOAD effect handle it
      return;
    }
    if (prevUserIdRef.current === currentUserId) return;

    prevUserIdRef.current = currentUserId;
    skipPersistRef.current = true;
    setLoaded(false);
    setRewards({ key: 0, chip: 0, hourglass: 0, level: 1 });
    setCompletedTasks(new Set());
    levelUpFiredRef.current = new Set();
    pendingTasksRef.current = new Set();
    claimsCheckedRef.current = false;
    mergedGuestRef.current = false;
    setPopup(null);
  }, [user, authLoading]);

  // ── LOAD: from Supabase profile (logged in) or localStorage (guest) ──
  useEffect(() => {
    if (loaded || authLoading) return;

    if (profile) {
      setRewards({
        key:       profile.keys        ?? 0,
        chip:      profile.chips       ?? 0,
        hourglass: profile.hourglasses ?? 0,
        level:     profile.level       ?? 1,
      });
      setCompletedTasks(new Set(profile.completed_tasks ?? []));
      setLoaded(true);
    } else if (!user) {
      const guest = loadGuestProgress();
      if (guest) {
        setRewards({ ...guest.rewards, level: calcLevel(guest.rewards.chip) });
        setCompletedTasks(new Set(guest.completedTasks));
      }
      setLoaded(true);
    }
  }, [profile, user, authLoading, loaded]);

  // ── PERSIST: localStorage for guests ──
  useEffect(() => {
    if (!loaded || user) return;
    if (skipPersistRef.current) { skipPersistRef.current = false; return; }
    saveGuestProgress({ rewards, completedTasks: [...completedTasks] });
  }, [rewards, completedTasks, loaded, user]);

  useEffect(() => {
  if (!user || !profile || mergedGuestRef.current) return;
  mergedGuestRef.current = true;

  const guest = loadGuestProgress();
  const hasGuestProgress = guest && (guest.rewards.chip > 0 || guest.completedTasks.length > 0);
  if (!hasGuestProgress) { setLoaded(true); return; }

  (async () => {
    try {
      const { data, error } = await supabase.rpc('merge_guest_progress', {
        p_delta_chips: guest.rewards.chip,
        p_delta_keys: guest.rewards.key,
        p_delta_hourglasses: guest.rewards.hourglass,
        p_task_ids: guest.completedTasks,
      });
      if (error) throw error;
      const merged = Array.isArray(data) ? data[0] : data;
      setRewards({ key: merged.keys, chip: merged.chips, hourglass: merged.hourglasses, level: merged.level });
      setCompletedTasks(new Set(merged.completed_tasks ?? []));
      if (guest.rewards.chip > 0) window.dispatchEvent(new CustomEvent('chips-updated'));
      clearGuestProgress();
    } catch (e) {
      console.error('guest merge failed:', e);
      // localStorage guest progress is left intact — nothing is lost, and
      // this will just retry next time `profile` becomes available again.
    } finally {
      setLoaded(true);
    }
  })();
}, [user, profile]);

  function addReward(type, amount = 1) {
    setRewards(prev => ({ ...prev, [type]: prev[type] + amount }));
  }

  function triggerLevelUp(newLevel) {
  const config = LEVEL_REWARDS[newLevel];
  if (!config) return;

  setRewards(prev => ({
    ...prev,
    key: prev.key + (config.keys || 0),
    chip: prev.chip + (config.chips || 0),
    hourglass: prev.hourglass + (config.hourglasses || 0),
  }));
  if (user) {
    // NOTE: supabase.rpc(...) returns a lazy PostgrestFilterBuilder, which
    // implements .then() but NOT .catch() — chaining .catch() directly on
    // it throws a synchronous TypeError ("...catch is not a function")
    // before the request is even sent. Use .then(onFulfilled, onRejected)
    // instead so the request actually fires and errors are still caught.
    supabase.rpc('claim_task_reward', {
      p_delta_chips: config.chips || 0,
      p_delta_keys: config.keys || 0,
      p_delta_hourglasses: config.hourglasses || 0,
      p_task_id: `levelup-${newLevel}`,
      p_source: 'levelup',
    }).then(({ error }) => {
      if (error) console.error('claim_task_reward failed:', error);
    });
  }

    const delay = (ms, fn) => setTimeout(fn, ms);
    flyReward({ type: 'level' });
    if (config.keys        > 0) delay(200, () => flyReward({ type: 'key'       }));
    if (config.chips       > 0) delay(350, () => flyReward({ type: 'chip'      }));
    if (config.hourglasses > 0) delay(500, () => flyReward({ type: 'hourglass' }));
    if (config.stickers    > 0) delay(650, () => flyReward({ type: 'sticker'   }));

    const parts = [];
    if (config.keys        > 0) parts.push(`${config.keys} 🗝️`);
    if (config.chips       > 0) parts.push(`${config.chips} 🖥️`);
    if (config.hourglasses > 0) parts.push(`${config.hourglasses} ⏳`);
    if (config.stickers    > 0) parts.push(`${config.stickers} 🗒️`);
    const rewardText = parts.length > 0 ? ` Qazandın: ${parts.join(', ')}.` : '';

    addNotifGlobal({ msg: `⭐ ${config.label}-yə çatdın!${rewardText}`, type: 'levelup' });
  }

 

  function addChips(taskId, amount = 1, source = 'task') {
    // completedTasks (React state) can be stale if addChips fires twice
    // before a re-render (double click, duplicate event dispatch, etc).
    // pendingTasksRef updates synchronously so it closes that race window.
    if (completedTasks.has(taskId) || pendingTasksRef.current.has(taskId)) return false;
    pendingTasksRef.current.add(taskId);
    setCompletedTasks(prev => new Set(prev).add(taskId));

    setRewards(prev => {
      const newChip  = prev.chip + amount;
      const newLevel = calcLevel(newChip);
      if (newLevel > prev.level && !levelUpFiredRef.current.has(newLevel)) {
        levelUpFiredRef.current.add(newLevel);
        setTimeout(() => triggerLevelUp(newLevel), 0);
      }
      return { ...prev, chip: newChip, level: newLevel };
    });

    if (user) {
      // Source of truth lives server-side: claim_task_reward is
      // idempotent on p_task_id (see _credit_reward), updates chips/level,
      // appends the task id to completed_tasks, and inserts the chip_events
      // row itself — so no separate persist step is needed here.
      //
      // NOTE: supabase.rpc(...) returns a lazy PostgrestFilterBuilder, which
      // implements .then() but NOT .catch() — chaining .catch() directly on
      // it throws a synchronous TypeError ("...catch is not a function")
      // before the request is even sent, which was silently killing every
      // reward write. Use .then(onFulfilled) and check `error` instead.
      supabase.rpc('claim_task_reward', {
        p_delta_chips: amount,
        p_task_id: taskId,
        p_source: source,
      }).then(({ error }) => {
        if (error) console.error('claim_task_reward failed:', error);
      });
    }

    window.dispatchEvent(new CustomEvent('chips-updated'));
    return true;
  }

  // ── PERSISTED KEY/HOURGLASS REWARDS (non-chip) ───────────
  // addReward() only touches local React state — nothing is written to
  // Supabase, so anything routed through it alone (pixel-bubble payouts,
  // the puzzle grand-reward's key/hourglass bonus) shows up in the UI but
  // evaporates on refresh. This wraps the same local update with a
  // claim_task_reward call so the balance actually persists. Unlike
  // addChips, this isn't a "did this task once" claim — bubbles and
  // bonuses can be claimed repeatedly — so callers must pass a taskId
  // that's unique per claim (e.g. including a random id) purely so the
  // server-side idempotency check never treats two different claims as
  // duplicates of each other.
  function claimNonChipReward(deltas, taskId, source = 'other') {
    const { keys = 0, hourglasses = 0 } = deltas;
    if (keys === 0 && hourglasses === 0) return;

    if (keys)        addReward('key', keys);
    if (hourglasses) addReward('hourglass', hourglasses);

    if (user) {
      supabase.rpc('claim_task_reward', {
        p_delta_keys: keys,
        p_delta_hourglasses: hourglasses,
        p_task_id: taskId,
        p_source: source,
      }).then(({ error }) => {
        if (error) console.error('claim_task_reward failed:', error);
      });
    }
  }

  // Called by PixelPuzzle when a player redeems a bubble for keys/hourglasses.
  // One RPC call per claim carrying both deltas, tagged with a unique task
  // id generated by the caller so repeated claims aren't deduped against
  // each other.
  function claimBubbleRewards(rewardsArr, taskId) {
    const keys        = rewardsArr.filter(r => r.type === 'key').reduce((s, r) => s + r.amount, 0);
    const hourglasses  = rewardsArr.filter(r => r.type === 'hourglass').reduce((s, r) => s + r.amount, 0);
    claimNonChipReward({ keys, hourglasses }, taskId, 'puzzle_bubble');
  }

  // ── PUZZLE GRAND REWARD ──────────────────────────────────
  // Fired once when the pixel board is fully revealed (see PuzzleContext).
  // The chip portion MUST go through addChips (not a bare addReward), since
  // that's what writes a chip_events row — without it these chips would
  // inflate the player's total but never show up on the weekly leaderboard.
  function grantPuzzleComplete() {
    const { chips, keys, hourglasses } = PUZZLE_GRAND_REWARD;

    const chipsAwarded = addChips(PUZZLE_ID, chips, 'puzzle');
    if (!chipsAwarded) return; // already granted for this board — do nothing

    if (chips > 0) flyReward({ type: 'chip' });
    if (keys > 0) {
      claimNonChipReward({ keys }, `${PUZZLE_ID}-bonus-key`, 'puzzle');
      flyReward({ type: 'key' });
    }
    if (hourglasses > 0) {
      setTimeout(() => {
        claimNonChipReward({ hourglasses }, `${PUZZLE_ID}-bonus-hourglass`, 'puzzle');
        flyReward({ type: 'hourglass' });
      }, 200);
    }

    const parts = [];
    if (chips       > 0) parts.push(`${chips}🖥️`);
    if (keys        > 0) parts.push(`${keys}🗝️`);
    if (hourglasses > 0) parts.push(`${hourglasses}⏳`);

    addNotifGlobal({ msg: `🧩 Piksel lövhəni tamamladın! Böyük mükafat: ${parts.join(', ')} 🎉`, type: 'levelup' });
    setPopup({
      rank: null,
      tier: { chips, keys, hourglasses, pixels: 0 },
      label: 'Piksel Lövhəsi',
    });
  }

  useEffect(() => {
    if (!loaded) return;
    window.addEventListener('puzzle-complete', grantPuzzleComplete);
    return () => window.removeEventListener('puzzle-complete', grantPuzzleComplete);
  }, [loaded, completedTasks]);

  function nextLevelAt(currentLevel) {
    if (currentLevel >= MAX_LEVEL) return null;
    return getThreshold(currentLevel + 1);
  }

  function rewardSummary(tier) {
    const parts = [];
    if (tier.keys        > 0) parts.push(`${tier.keys}🗝️`);
    if (tier.hourglasses > 0) parts.push(`${tier.hourglasses}⏳`);
    if (tier.pixels      > 0) parts.push(`${tier.pixels}🧩`);
    return parts.join(', ');
  }

  function grantTierVisuals(tier, msg) {
    if (!tier) return;
    if (tier.hourglasses > 0) {
      setTimeout(() => {
        addReward('hourglass', tier.hourglasses);
        flyReward({ type: 'hourglass' });
      }, 200);
    }
    addNotifGlobal({ msg, type: 'levelup' });
    if (tier.pixels > 0) {
      for (let i = 0; i < tier.pixels; i++) {
        setTimeout(() => window.dispatchEvent(new CustomEvent('earn-pixel')), 400 + i * 150);
      }
    }
  }

  // ── CHECK-ON-LOAD: race-end rewards ──────────────────────
  // Uses endsAt as the unique key for each race run — no version needed.
  // If endsAt has passed and user completed the race but hasn't claimed, grant now.
async function checkRaceRewards() {
  if (!user) return;
  const now = new Date();
  const endedRaces = RACES.filter(r => r.endsAt && new Date(r.endsAt) <= now);

  for (const race of endedRaces) {
    const endsAtISO = new Date(race.endsAt).toISOString();
    const sortCol = race.type === 'golf' ? 'char_count' : 'time_taken';

    const { data, error } = await supabase.rpc('claim_race_reward', {
      p_race_id: race.id, p_ends_at: endsAtISO, p_sort_col: sortCol,
    });
    if (error) continue; // not eligible yet / no result / already claimed
    const row = data?.[0];
    if (!row) continue; // RPC no-op: already claimed earlier

    const pixels = getRewardForRank(RACE_END_REWARDS, row.rank)?.pixels ?? 0;
    const tier = { keys: row.keys_awarded, hourglasses: row.hourglasses_awarded, pixels, chips: 0 };

    // local-only visual bump — the RPC already persisted the real credit
    setRewards(prev => ({ ...prev, key: prev.key + tier.keys, hourglass: prev.hourglass + tier.hourglasses }));
    grantTierVisuals(tier, `🏁 "${race.title}" bitdi! Sən #${row.rank} yerdə bitirdin. Mükafatın: ${rewardSummary(tier)} 🎉`);
    setPopup({ rank: row.rank, tier, label: `"${race.title}" Yarışı` });
  }
}

  async function checkWeeklyRewards() {
  if (!user) return;
  const currentWeekStart = startOfWeek(new Date());
  const lastWeekStart = new Date(currentWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  // Pass the full instant (timestamptz), not a sliced date string. The old
  // code did `lastWeekStartDate.toISOString().slice(0, 10)`, which converts
  // a LOCAL midnight into its UTC calendar date — for timezones ahead of UTC
  // (e.g. Baku, UTC+4) that silently rolls back to the previous day, then
  // Postgres re-interpreted that date as UTC midnight, shifting the whole
  // reward week hours earlier than the real local Mon 00:00 -> Sun 24:00
  // window. toISOString() on the full Date has no such ambiguity.
  const { data, error } = await supabase.rpc('claim_weekly_reward', {
    p_week_start: lastWeekStart.toISOString(),
  });
  if (error) return;
  const row = data?.[0];
  if (!row) return;

  const pixels = getRewardForRank(WEEKLY_REWARDS, row.rank)?.pixels ?? 0;
  const tier = { keys: row.keys_awarded, hourglasses: row.hourglasses_awarded, pixels, chips: 0 };

  setRewards(prev => ({ ...prev, key: prev.key + tier.keys, hourglass: prev.hourglass + tier.hourglasses }));
  grantTierVisuals(tier, `📅 Bu həftəki sıralama bağlandı! Sən #${row.rank} yerdə bitirdin. Mükafatın: ${rewardSummary(tier)} 🎉`);
  setPopup({ rank: row.rank, tier, label: 'Həftəlik Sıralama' });

  // The global leaderboard filters by "this week" — once last week's reward
  // is claimed, kick it to refetch so it visibly empties for the new week.
  window.dispatchEvent(new CustomEvent('chips-updated'));
}

  useEffect(() => {
    if (!loaded || claimsCheckedRef.current || !user) return;
    claimsCheckedRef.current = true;
    checkRaceRewards();
    checkWeeklyRewards();
  }, [loaded, user]);

  return (
    <RewardContext.Provider value={{
      rewards, completedTasks, addReward, addChips, claimBubbleRewards, nextLevelAt, MAX_LEVEL, LEVEL_REWARDS, checkWeeklyRewards, checkRaceRewards,
      isGuest: !user,
      guestLocked: !user && rewards.level >= GUEST_LOCK_LEVEL,
    }}>
      {children}
      <RewardPopup data={popup} onClose={() => setPopup(null)} />
    </RewardContext.Provider>
  );
}

export function useRewards() {
  return useContext(RewardContext);
}