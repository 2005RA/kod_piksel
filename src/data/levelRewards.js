// src/data/levelRewards.js
//
// Reward given the moment a player reaches each level. Pulled out of
// RewardContext.jsx into its own plain-JS file so it can also be read by
// scripts/sync-task-rewards.mjs (a plain Node script, no React/JSX) to keep
// the server-side task_rewards registry in sync automatically instead of by
// hand. If you add a new level tier, this is the only file you need to
// edit — then run `npm run sync-rewards`.
export const LEVEL_REWARDS = {
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
  12: { keys: 11, chips: 0, hourglasses: 7, stickers: 3, label: 'Səviyyə 12' },
  13: { keys: 11, chips: 0, hourglasses: 7, stickers: 3, label: 'Səviyyə 13' },
  14: { keys: 12, chips: 0, hourglasses: 8, stickers: 3, label: 'Səviyyə 14' },
  15: { keys: 12, chips: 0, hourglasses: 8, stickers: 3, label: 'Səviyyə 15' },
  16: { keys: 13, chips: 0, hourglasses: 9, stickers: 3, label: 'Səviyyə 16' },
};