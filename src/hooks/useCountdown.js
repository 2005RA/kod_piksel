// src/hooks/useCountdown.js
import { useEffect, useRef, useState } from 'react';
import { getWeekEndISO } from '../lib/week';

export function useCountdown(targetDate, onExpire) {
  const target      = targetDate ? new Date(targetDate).getTime() : null;
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const [label, setLabel] = useState(() => formatRemaining(target));

  useEffect(() => {
    if (!target) return;
    const id = setInterval(() => {
      const next = formatRemaining(target);
      setLabel(next);
      if (next === null) {
        clearInterval(id);
        onExpireRef.current?.();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [target]);
    return label;

}

function formatRemaining(target) {
  if (!target) return null;
  const diff = Math.max(0, target - Date.now());
  if (diff <= 0) return null;

  const days  = Math.floor(diff / 864e5);
  const hours = Math.floor((diff % 864e5) / 36e5);
  const mins  = Math.floor((diff % 36e5) / 6e4);
  const secs  = Math.floor((diff % 6e4) / 1000);

  if (days > 0)  return `${days}g ${hours}s`;
  if (hours > 0) return `${hours}s ${mins}d`;
  return `${mins}d ${secs}s`;
}

// Re-exported so existing imports (`import { getWeekEnd } from '../hooks/useCountdown'`)
// keep working. Source of truth now lives in ../lib/week so the leaderboard
// display and the weekly reward claim can't drift apart again.
export function getWeekEnd() {
  return getWeekEndISO();
}