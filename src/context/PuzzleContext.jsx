import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { flyReward } from '../components/RewardFly';
import { useAuth } from './AuthContext';
import { useCountdown } from '../hooks/useCountdown';
// ── 5×5 PIXEL ART BOARD ──────────────────────────────────────────────────────
// Each cell: { color: '#hex' } — the target picture.
// Change colors here to make a different pixel art. Currently: a small rocket 🚀
// Row-major order, top-left to bottom-right.
// Make sure everything above this line is completely closed off!

export const BOARD_TARGET = [
  // Row 1: Top loop of the key head
  { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#0D1B2A' }, { color: '#0D1B2A' },
  // Row 2: Hollow center of key head
  { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#0D1B2A' },
  // Row 3: Bottom loop of key head
  { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#0D1B2A' }, { color: '#0D1B2A' },
  // Row 4: Key shaft starts
  { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' },
  // Row 5: Key shaft / first tooth
  { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#0D1B2A' },
  // Row 6: Key shaft gap
  { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' },
  // Row 7: Second key tooth
  { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#0D1B2A' },
  // Row 8: Key tip
  { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }
];
// ─────────────────────────────────────────────────────────────────────────────

// ── BUBBLE REWARDS ────────────────────────────────────────────────────────────
export const BUBBLES = [
  {
    id:      'small',
    label:   '10 Piksel Balonu',
    cost:    10,
    emoji:   '🫧',
    rewards: [
      { type: 'key',  amount: 5 },
      { type: 'hourglass', amount: 3  },
    ],
    color:   '#00D4AA',
  },
  {
    id:      'medium',
    label:   '20 Piksel Balonu',
    cost:    20,
    emoji:   '🫧',
    rewards: [
      { type: 'key',       amount: 8  },
      { type: 'hourglass', amount: 5 },
    ],
    color:   '#a78bfa',
  },
  {
    id:      'large',
    label:   '30 Piksel Balonu',
    cost:    30,
    emoji:   '🫧',
    rewards: [
      { type: 'key',       amount: 10  },
      { type: 'hourglass', amount: 8  },
    ],
    color:   '#F4A600',
  },
];
// ─────────────────────────────────────────────────────────────────────────────

const PuzzleContext = createContext(null);
const PUZZLE_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// ── BUMP THIS to launch a new board design/reward cycle ──
// Changing this number resets everyone's board + restarts the 30-day
// countdown, the next time their profile loads. Leaving it alone means
// nothing resets except the normal 30-day expiry.
export const PUZZLE_VERSION = 2;

export function PuzzleProvider({ children }) {
  const { profile, updateProfile } = useAuth();
  const [revealed,  setRevealed]  = useState(new Set());
  const [repeated,  setRepeated]  = useState(0);
  const [hasNewPixel, setHasNewPixel] = useState(false);
  const [puzzleStartedAt, setPuzzleStartedAt] = useState(null);
  const loadedRef = useRef(false);
  const completeFiredRef = useRef(false);

  const deadline = puzzleStartedAt ? puzzleStartedAt + PUZZLE_DURATION_MS : null;

  function handlePuzzleExpire() {
    if (revealed.size < 64) {
      setRevealed(new Set());
      setRepeated(0);
      setPuzzleStartedAt(Date.now());
      completeFiredRef.current = false;
    }
  }

  const countdownLabel = useCountdown(deadline, handlePuzzleExpire);

  useEffect(() => {
    if (profile && !loadedRef.current) {
      const saved = profile.puzzle_state ?? { revealed: [], repeated: 0 };
      const savedVersion = saved.version ?? PUZZLE_VERSION;

      if (savedVersion !== PUZZLE_VERSION) {
        // Version bumped in code since this user last loaded — fresh board, fresh timer.
        setRevealed(new Set());
        setRepeated(0);
        setPuzzleStartedAt(Date.now());
        completeFiredRef.current = false;
      } else {
        setRevealed(new Set(saved.revealed ?? []));
        setRepeated(saved.repeated ?? 0);
        setPuzzleStartedAt(saved.startedAt ?? Date.now());
      }
      loadedRef.current = true;
    }
  }, [profile]);

  useEffect(() => {
    if (!loadedRef.current) return;
    // repeated_pixels used to be written here as a separate top-level column,
    // but it's one of the columns protect_profile_reward_columns guards —
    // any client-side write to it (even alongside other fields in the same
    // UPDATE) makes the trigger throw and roll back the ENTIRE statement,
    // silently killing the puzzle_state write too whenever `repeated`
    // changed since the last save. `repeated` already lives inside
    // puzzle_state (not trigger-protected), so it's dropped here entirely —
    // see ProfilePage.jsx, which now reads it from puzzle_state instead.
    updateProfile({
      puzzle_state: {
        revealed: Array.from(revealed),
        repeated,
        startedAt: puzzleStartedAt,
        version: PUZZLE_VERSION,
      },
    });
  }, [revealed, repeated, puzzleStartedAt]);

  // ── Fire completion event once when board fills up ──
  useEffect(() => {
    if (!loadedRef.current) return;
    if (revealed.size >= 64 && !completeFiredRef.current) {
      completeFiredRef.current = true;
      window.dispatchEvent(new CustomEvent('puzzle-complete'));
    }
  }, [revealed]);

  const earnPixel = useCallback(({ fromEl, x, y } = {}) => {
    setRevealed(prev => {
      const totalPieces = 64;
      let pick;

      const unrevealedPieces = [];
      for (let i = 0; i < totalPieces; i++) {
        if (!prev.has(i)) unrevealedPieces.push(i);
      }

      if (unrevealedPieces.length > 0 && Math.random() < 0.60) {
        const randomUnrevealedIndex = Math.floor(Math.random() * unrevealedPieces.length);
        pick = unrevealedPieces[randomUnrevealedIndex];
      } else {
        pick = Math.floor(Math.random() * totalPieces);
      }

      if (prev.has(pick)) {
        setRepeated(r => r + 1);
        setHasNewPixel(true);
        flyReward({ type: 'pixel', fromEl, x, y });
        return prev;
      }

      const next = new Set(prev);
      next.add(pick);
      setHasNewPixel(true);
      flyReward({ type: 'pixel', fromEl, x, y });
      return next;
    });
  }, []);

  // Listen for 'earn-pixel' events dispatched by RewardContext when a
  // race-end or weekly-end reward includes pixels. Decouples PuzzleContext
  // from RewardContext (no circular import needed).
  useEffect(() => {
    function handler() { earnPixel(); }
    window.addEventListener('earn-pixel', handler);
    return () => window.removeEventListener('earn-pixel', handler);
  }, [earnPixel]);

  const claimBubble = useCallback((bubbleId, claimBubbleRewards) => {
    const bubble = BUBBLES.find(b => b.id === bubbleId);
    if (!bubble) return false;
    if (repeated < bubble.cost) return false;

    setRepeated(r => r - bubble.cost);
    // One RPC call for the whole claim, tagged with a claim-unique task id
    // (bubbles are redeemable repeatedly, so this isn't a "did this once"
    // task — the id just keeps the server-side idempotency check from
    // treating two different claims as duplicates of each other).
    claimBubbleRewards(bubble.rewards, `bubble-${bubbleId}-${crypto.randomUUID()}`);
    return true;
  }, [repeated]);

  const clearNewPixel = useCallback(() => setHasNewPixel(false), []);

  return (
    <PuzzleContext.Provider value={{
      revealed, repeated, hasNewPixel,
      earnPixel, claimBubble, clearNewPixel,
      boardTarget: BOARD_TARGET,
      bubbles:     BUBBLES,
      countdownLabel, deadline,
    }}>
      {children}
    </PuzzleContext.Provider>
  );
}
export function usePuzzle() {
  return useContext(PuzzleContext);
}