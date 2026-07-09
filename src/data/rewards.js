// src/data/rewards.js
// Reward tiers for race-end and weekly-end payouts.
// "pixels" here means earnPixel() calls — random, mix of new/repeated.


export const RACE_END_REWARDS = [
  { minRank: 1,  maxRank: 3,        keys: 5, hourglasses: 3, pixels: 2 },
  { minRank: 4,  maxRank: 10,       keys: 3, hourglasses: 1, pixels: 1 },
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
// Amounts here are for display only (notification text, popup). The real
// payout amounts are hardcoded in the claim_puzzle_grand_reward RPC and
// gated by a server-side timestamp (profiles.last_puzzle_claim_at) instead
// of a static task id, so it can be claimed again every ~29 days per
// account without needing a code deploy — keep these two in sync if you
// ever change the reward amounts.
export const PUZZLE_GRAND_REWARD = { chips: 50, keys: 50, hourglasses: 50 };