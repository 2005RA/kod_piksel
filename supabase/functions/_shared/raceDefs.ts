// supabase/functions/_shared/raceDefs.ts
//
// Server-side mirror of src/data/validateHelper.js's parseBody() and each
// race's validate() from src/data/races.js. This is what makes race
// submissions actually re-checked instead of trusted from the client.
//
// ⚠️ KEEP IN SYNC: if you edit a race's validate() logic, timeLimit,
// charLimit, or chips in src/data/races.js, mirror the change here too.
// This is the tradeoff of not having race content in the database — it's a
// small, bounded set (8 races) so duplication is manageable, but it WILL
// drift if only one side gets updated.

import { DOMParser } from 'npm:linkedom@0.16.11';

export function parseBody(code: string) {
  const bodyOpens = (code.match(/<body[\s>]/gi) || []).length;
  const bodyCloses = (code.match(/<\/body>/gi) || []).length;
  if (bodyOpens !== 1 || bodyCloses !== 1) return null;

  const openMatch = code.match(/<body[^>]*>/i);
  const closeMatch = code.match(/<\/body>/i);
  if (!openMatch || !closeMatch) return null;

  const openIdx = openMatch.index!;
  const openEnd = openIdx + openMatch[0].length;
  const closeIdx = code.indexOf(closeMatch[0], openEnd);
  if (closeIdx === -1) return null;

  const before = code.slice(0, openIdx);
  const after = code.slice(closeIdx + closeMatch[0].length);

  const beforeOk = /^(\s|<!DOCTYPE[^>]*>|<\/?html[^>]*>|<head[^>]*>[\s\S]*?<\/head>)*$/i.test(before);
  const afterOk = /^(\s|<\/html[^>]*>)*$/i.test(after);
  if (!beforeOk || !afterOk) return null;

  const TAG_OR_COMMENT_RE =
    /<!--[\s\S]*?-->|<\/?[a-zA-Z][a-zA-Z0-9]*((\s+[a-zA-Z-]+(=("[^"]*"|'[^']*'))?)*\s*)\/?>/g;
  const tagTokens = [...code.matchAll(TAG_OR_COMMENT_RE)];
  let strippedSrc = code;
  for (let i = tagTokens.length - 1; i >= 0; i--) {
    const m = tagTokens[i];
    strippedSrc = strippedSrc.slice(0, m.index!) + strippedSrc.slice(m.index! + m[0].length);
  }
  if (/[<>]/.test(strippedSrc)) return null;

  const doc = new DOMParser().parseFromString(code, 'text/html');
  const body = doc.body;
  const src = code;

  const hasStrayBracket = (tagName: string) => new RegExp(`<<${tagName}[\\s>]`, 'i').test(src);
  const closed = (tagName: string) =>
    new RegExp(`<${tagName}[\\s>]`, 'i').test(src) &&
    new RegExp(`<\\/${tagName}>`, 'i').test(src) &&
    !hasStrayBracket(tagName);

  return { body, closed, src };
}

export function computeCharCount(code: string) {
  return code.replace(/\s/g, '').length;
}

export interface RaceDef {
  type: string;
  timeLimit?: number;
  charLimit?: number;
  chips: number;
  validate: (code: string) => boolean;
}

// Mirrors src/data/races.js, id-for-id.
export const RACE_DEFS: Record<number, RaceDef> = {
  1: {
    type: 'timed', timeLimit: 180, chips: 10,
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      const h1 = p.body.querySelector('h1');
      const para = p.body.querySelector('p');
      const ul = p.body.querySelector('ul');
      if (!h1?.textContent?.trim() || !para?.textContent?.trim() || !ul) return false;
      return ul.querySelectorAll('li').length >= 3;
    },
  },
  2: {
    type: 'speed', timeLimit: 300, chips: 15,
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      const h2 = p.body.querySelector('h2');
      return h2 ? /^salam\s+python$/i.test(h2.textContent!.trim()) : false;
    },
  },
  3: {
    type: 'timed', timeLimit: 240, chips: 20,
    validate: () => false, // finished showcase race in the client too
  },
  4: {
    type: 'golf', charLimit: 60, chips: 12,
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      const heading = p.body.querySelector('h1,h2,h3,h4,h5,h6');
      return heading ? /^salam!$/i.test(heading.textContent!.trim()) : false;
    },
  },
  5: {
    type: 'bughunt', timeLimit: 240, chips: 18,
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      const h1 = p.body.querySelector('h1');
      const closedH1 = p.closed('h1') && !!h1 && h1.textContent!.trim().length > 0;
      const hasImg = !!p.body.querySelector('img');
      const noImge = !/<imge/i.test(code);
      const a = p.body.querySelector('a');
      const fixedHref = !!a && /^https?:\/\//i.test(a.getAttribute('href') || '');
      return closedH1 && hasImg && noImge && fixedHref;
    },
  },
  6: {
    type: 'blind', timeLimit: 300, chips: 20,
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      const h1 = p.body.querySelector('h1');
      const para = p.body.querySelector('p');
      const a = p.body.querySelector('a[href]');
      return !!(h1?.textContent?.trim() && para?.textContent?.trim() && a);
    },
  },
  7: {
    type: 'reverse', timeLimit: 360, chips: 22,
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      const h1 = p.body.querySelector('h1');
      const para = p.body.querySelector('p');
      const ul = p.body.querySelector('ul');
      if (!h1?.textContent?.trim() || !para?.textContent?.trim() || !ul) return false;
      return ul.querySelectorAll('li').length >= 3;
    },
  },
  8: {
    type: 'speed', timeLimit: 300, chips: 30,
    validate: () => false, // finished showcase race in the client too
  },
};