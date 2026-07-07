// src/lib/week.js
//
// Single source of truth for "what week is it" (Monday 00:00 -> Sunday 24:00,
// local time). Used by both the leaderboard display and the weekly reward
// claim, so they always agree on the exact same window.

/** Local midnight, Monday of the week containing `d`. */
export function startOfWeek(d = new Date()) {
  const date = new Date(d);
  const day = date.getDay(); // 0 = Sun ... 6 = Sat
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

/** Local midnight, the Monday *after* the week containing `d` (exclusive upper bound). */
export function endOfWeek(d = new Date()) {
  const end = startOfWeek(d);
  end.setDate(end.getDate() + 7);
  return end;
}

/** ISO string for Sunday 23:59:59.999 local — the visible countdown target. */
export function getWeekEndISO(d = new Date()) {
  const end = endOfWeek(d);
  end.setMilliseconds(end.getMilliseconds() - 1);
  return end.toISOString();
}