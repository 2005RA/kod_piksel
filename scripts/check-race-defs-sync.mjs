// scripts/check-race-defs-sync.mjs
//
// Race content is duplicated on purpose across two files that run in two
// different JS environments (browser vs Deno), so it CAN'T be fully merged
// into one source the way lessons/challenges/levels were — see the note in
// supabase/functions/_shared/raceDefs.ts. Rewriting validate() logic
// automatically is genuinely risky (subtle DOMParser-vs-linkedom
// differences could silently change which submissions pass grading), so
// this script does NOT touch or regenerate that file.
//
// What it DOES do: read both files as plain text (no import, no code
// execution — completely safe to run anytime) and flag when the
// declarative fields (type, timeLimit, charLimit, chips) drift out of
// sync between src/data/races.js and raceDefs.ts. It won't catch a
// validate() logic change — only you can judge whether that also needs
// mirroring — but it catches the "changed chips/timeLimit in one file and
// forgot the other" mistake, which is the common one.
//
// Usage: npm run check-races

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');

const racesSrc = readFileSync(join(repoRoot, 'src/data/races.js'), 'utf8');
const raceDefsSrc = readFileSync(join(repoRoot, 'supabase/functions/_shared/raceDefs.ts'), 'utf8');

function extractField(block, pattern) {
  const m = block.match(pattern);
  return m ? m[1] : undefined;
}

function parseFields(block) {
  return {
    type: extractField(block, /type:\s*'([^']+)'/),
    timeLimit: extractField(block, /timeLimit:\s*(\d+)/),
    charLimit: extractField(block, /charLimit:\s*(\d+)/),
    chips: extractField(block, /chips:\s*(\d+)/),
  };
}

// Split src/data/races.js into one block per race, anchored on `id: N,`
function parseRacesJs(src) {
  const anchor = /id:\s*(\d+),/g;
  const hits = [...src.matchAll(anchor)];
  const races = {};
  for (let i = 0; i < hits.length; i++) {
    const id = hits[i][1];
    const start = hits[i].index;
    const end = i + 1 < hits.length ? hits[i + 1].index : src.length;
    races[id] = parseFields(src.slice(start, end));
  }
  return races;
}

// Split raceDefs.ts into one block per race, anchored on `  N: {` (object key)
function parseRaceDefsTs(src) {
  const anchor = /^\s{2}(\d+):\s*\{/gm;
  const hits = [...src.matchAll(anchor)];
  const races = {};
  for (let i = 0; i < hits.length; i++) {
    const id = hits[i][1];
    const start = hits[i].index;
    const end = i + 1 < hits.length ? hits[i + 1].index : src.length;
    races[id] = parseFields(src.slice(start, end));
  }
  return races;
}

const clientRaces = parseRacesJs(racesSrc);
const serverRaces = parseRaceDefsTs(raceDefsSrc);

const allIds = new Set([...Object.keys(clientRaces), ...Object.keys(serverRaces)]);
let driftFound = false;

for (const id of [...allIds].sort((a, b) => Number(a) - Number(b))) {
  const c = clientRaces[id];
  const s = serverRaces[id];

  if (!c) {
    console.log(`⚠ race ${id}: exists in raceDefs.ts but not in races.js (dead server entry?)`);
    driftFound = true;
    continue;
  }
  if (!s) {
    console.log(`⚠ race ${id}: exists in races.js but NOT in raceDefs.ts — this race's submissions won't be server-validated at all!`);
    driftFound = true;
    continue;
  }

  const mismatches = [];
  for (const field of ['type', 'timeLimit', 'charLimit', 'chips']) {
    if (c[field] !== s[field]) {
      mismatches.push(`${field}: races.js=${c[field] ?? '(none)'} vs raceDefs.ts=${s[field] ?? '(none)'}`);
    }
  }
  if (mismatches.length) {
    console.log(`✗ race ${id} drift:\n    ${mismatches.join('\n    ')}`);
    driftFound = true;
  } else {
    console.log(`✓ race ${id} in sync (type/timeLimit/charLimit/chips)`);
  }
}

if (driftFound) {
  console.log('\nFound drift — update raceDefs.ts (or races.js) to match, then re-run.');
  console.log('Reminder: this only checks the plain fields, not validate() logic — review that by eye if you changed it.');
  process.exit(1);
} else {
  console.log('\nAll races in sync on type/timeLimit/charLimit/chips.');
}
