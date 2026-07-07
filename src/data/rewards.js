// src/data/rewards.js
// Reward tiers for race-end and weekly-end payouts.
// "pixels" here means earnPixel() calls — random, mix of new/repeated.

import { PUZZLE_VERSION } from '../context/PuzzleContext';

export const RACE_END_REWARDS = [
  { minRank: 1,  maxRank: 3,        keys: 5, hourglasses: 3, pixels: 2 },
  { minRank: 4,  maxRank: 10,       keys: 3, hourglasses: 1, pixels: 2 },
  { minRank: 11, maxRank: Infinity, keys: 1, hourglasses: 0, pixels: 1 },
];

export const WEEKLY_REWARDS = [
  { minRank: 1,  maxRank: 1,        keys: 10, hourglasses: 8, pixels: 5 },
  { minRank: 2,  maxRank: 2,        keys: 8,  hourglasses: 6, pixels: 4 },
  { minRank: 3,  maxRank: 3,        keys: 5,  hourglasses: 3, pixels: 3 },
  { minRank: 4,  maxRank: 10,       keys: 3,  hourglasses: 1, pixels: 2 },
  { minRank: 11, maxRank: Infinity, keys: 1,  hourglasses: 0, pixels: 1 },
];

export function getRewardForRank(tiers, rank) {
  return tiers.find(t => rank >= t.minRank && rank <= t.maxRank) ?? null;
}

// ── PUZZLE BOARD GRAND REWARD ──────────────────────────────────────────────
// PUZZLE_ID is versioned so that bumping PUZZLE_VERSION (in PuzzleContext.jsx)
// to launch a new board also lets the completion reward be claimed again —
// otherwise addChips() would see the same taskId as already-completed and
// silently block the payout forever.
export const PUZZLE_ID = `puzzle_board_v${PUZZLE_VERSION}`;

export const PUZZLE_GRAND_REWARD = { chips: 50, keys: 50, hourglasses: 50 };