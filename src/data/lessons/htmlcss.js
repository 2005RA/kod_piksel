// src/data/lessons/htmlcss.js
import { parseBody, matchesSolution } from '../validateHelper.js';

export const TOTAL_LESSONS = 18;
export const MODULE1_COUNT = 9;

export const LESSON_CHIPS = { 1:1, 2:1, 3:1, 4:2, 5:3, 6:3, 7:2, 8:1, 9:2, 10:1, 11:1, 12:1, 13:1, 14:1, 15:2, 16:2, 17:1, 18:5};
export const SVG = {
  classStamp: `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');
  .stamp-hand-text { font-family: 'Caveat', cursive; }
</style>
<svg viewBox="0 0 680 300" role="img" style="width:100%;height:auto" aria-label="class bir möhür kimidir — əl ilə çəkilmiş illüstrasiya">
  <!-- knob -->
  <path d="M312,24 C314,10 366,8 368,22 C370,36 314,38 312,24 Z" fill="#8B5E34" stroke="#5a3f1f" stroke-width="1.6"/>
  <!-- neck -->
  <path d="M317,29 L363,31 L379,53 L301,55 Z" fill="#8B5E34" stroke="#5a3f1f" stroke-width="1.6"/>
  <!-- rubber block -->
  <path d="M279,55 Q339,52 401,56 Q403,72 400,89 Q340,92 280,88 Q277,72 279,55 Z" fill="#C1493B" stroke="#7a2620" stroke-width="1.6"/>
  <text x="340" y="72" text-anchor="middle" dominant-baseline="central" class="stamp-hand-text" font-size="19" fill="#fceee9">.qirmizi</text>
  <!-- inked underside -->
  <path d="M280,90 Q340,88 400,91 L399,97 Q340,99 281,96 Z" fill="#7a2620"/>

  <!-- ink trails -->
  <path d="M300,96 Q220,118 130,148" fill="none" stroke="#B23A2E" stroke-width="1.4" stroke-dasharray="1 6" stroke-linecap="round" opacity="0.65"/>
  <path d="M340,96 Q340,118 340,148" fill="none" stroke="#B23A2E" stroke-width="1.4" stroke-dasharray="1 6" stroke-linecap="round" opacity="0.65"/>
  <path d="M380,96 Q460,118 550,148" fill="none" stroke="#B23A2E" stroke-width="1.4" stroke-dasharray="1 6" stroke-linecap="round" opacity="0.65"/>

  <!-- paper 1 -->
  <g transform="rotate(-6 130 195)">
    <path d="M62,152 Q130,148 198,153 Q201,197 199,238 Q130,242 61,239 Q59,196 62,152 Z" fill="#F5EFE0" stroke="#c9bfa0" stroke-width="1.4"/>
    <path d="M110,176 Q130,158 150,176 Q132,196 110,176 Z" fill="#B23A2E" opacity="0.14"/>
    <text x="130" y="212" text-anchor="middle" dominant-baseline="central" class="stamp-hand-text" font-size="21" fill="#B23A2E">Salam!</text>
    <text x="130" y="230" text-anchor="middle" dominant-baseline="central" class="stamp-hand-text" font-size="14" fill="#8a7a5c">class="qirmizi"</text>
  </g>

  <!-- paper 2 -->
  <g transform="rotate(4 340 195)">
    <path d="M272,152 Q340,148 408,153 Q411,197 409,238 Q340,242 271,239 Q269,196 272,152 Z" fill="#F5EFE0" stroke="#c9bfa0" stroke-width="1.4"/>
    <path d="M320,176 Q340,158 360,176 Q342,196 320,176 Z" fill="#B23A2E" opacity="0.14"/>
    <text x="340" y="212" text-anchor="middle" dominant-baseline="central" class="stamp-hand-text" font-size="21" fill="#B23A2E">Necəsən?</text>
    <text x="340" y="230" text-anchor="middle" dominant-baseline="central" class="stamp-hand-text" font-size="14" fill="#8a7a5c">class="qirmizi"</text>
  </g>

  <!-- paper 3 -->
  <g transform="rotate(-4 550 195)">
    <path d="M482,152 Q550,148 618,153 Q621,197 619,238 Q550,242 481,239 Q479,196 482,152 Z" fill="#F5EFE0" stroke="#c9bfa0" stroke-width="1.4"/>
    <path d="M530,176 Q550,158 570,176 Q552,196 530,176 Z" fill="#B23A2E" opacity="0.14"/>
    <text x="550" y="212" text-anchor="middle" dominant-baseline="central" class="stamp-hand-text" font-size="21" fill="#B23A2E">Kod öyrənirəm!</text>
    <text x="550" y="230" text-anchor="middle" dominant-baseline="central" class="stamp-hand-text" font-size="14" fill="#8a7a5c">class="qirmizi"</text>
  </g>
</svg>
`,
  house: `<svg width="130" height="110" viewBox="0 0 130 110" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="82" width="110" height="20" rx="4" fill="#d4e8a0" stroke="#1a1a1a" strokeWidth="2"/>
    <rect x="25" y="52" width="80" height="32" fill="#fff9e6" stroke="#1a1a1a" strokeWidth="2.5"/>
    <polygon points="15,54 65,10 115,54" fill="#e5503f" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round"/>
    <rect x="55" y="64" width="20" height="20" rx="2" fill="#f4c84a" stroke="#1a1a1a" strokeWidth="2"/>
    <rect x="30" y="58" width="18" height="14" rx="2" fill="#c0e4ff" stroke="#1a1a1a" strokeWidth="2"/>
    <line x1="39" y1="58" x2="39" y2="72" stroke="#1a1a1a" strokeWidth="1.5"/>
    <line x1="30" y1="65" x2="48" y2="65" stroke="#1a1a1a" strokeWidth="1.5"/>
    <rect x="82" y="58" width="18" height="14" rx="2" fill="#c0e4ff" stroke="#1a1a1a" strokeWidth="2"/>
    <line x1="91" y1="58" x2="91" y2="72" stroke="#1a1a1a" strokeWidth="1.5"/>
    <line x1="82" y1="65" x2="100" y2="65" stroke="#1a1a1a" strokeWidth="1.5"/>
    <rect x="80" y="20" width="12" height="22" fill="#b0b8c8" stroke="#1a1a1a" strokeWidth="2"/>
  </svg>`,

  // ── Lesson 9 — color: same house shape, three different paint colors ──────
  // ── Lesson 9 — color: same house shape, three different paint colors ──────
  // ── Lesson 9 — color: same house shape, three different paint colors ──────
  paintHouses: `<svg width="500" height="115" viewBox="0 0 340 115" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(15,10)">
      <rect x="5" y="42" width="60" height="40" fill="#f45050" stroke="#1a1a1a" strokeWidth="2"/>
      <polygon points="0,44 35,14 70,44" fill="#a13030" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round"/>
      <text x="3" y="98" textAnchor="middle" fontSize="12" fill="#f4f4f4" fontFamily="monospace">color: red</text>
    </g>
    <g transform="translate(130,10)">
      <rect x="5" y="42" width="60" height="40" fill="#3A86FF" stroke="#1a1a1a" strokeWidth="2"/>
      <polygon points="0,44 35,14 70,44" fill="#1a4d8f" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round"/>
      <text x="3" y="98" textAnchor="middle" fontSize="12" fill="#f4f4f4" fontFamily="monospace">color: blue</text>
    </g>
    <g transform="translate(245,10)">
      <rect x="5" y="42" width="60" height="40" fill="#4cae50" stroke="#1a1a1a" strokeWidth="2"/>
      <polygon points="0,44 35,14 70,44" fill="#2d6e30" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round"/>
      <text x="3" y="98" textAnchor="middle" fontSize="12" fill="#f4f4f4" fontFamily="monospace">color: green</text>
    </g>
  </svg>`,
treasurePoster: `
<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Xəzinə səhifəsinin brauzerdə necə görünəcəyinin nümunəsi">
  <rect x="10" y="10" width="620" height="460" rx="8" fill="#ffffff" stroke="#ccc" stroke-width="2"/>
  <rect x="10" y="10" width="620" height="34" rx="8" fill="#e8e8e8" stroke="#ccc" stroke-width="2"/>
  <circle cx="30" cy="27" r="6" fill="#ff5f57"/>
  <circle cx="50" cy="27" r="6" fill="#febc2e"/>
  <circle cx="70" cy="27" r="6" fill="#28c840"/>
  <rect x="95" y="18" width="500" height="18" rx="9" fill="#fff" stroke="#ccc"/>

  <text x="40" y="90" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#111">Xəzinə Tapıldı</text>

  <text x="40" y="130" font-family="Georgia, serif" font-size="15" fill="#222">Bu xəzinəni tapan şəxsə</text>
  <text x="40" y="152" font-family="Georgia, serif" font-size="15" fill="#222"><tspan font-weight="bold">böyük mükafat</tspan> veriləcək və <tspan font-style="italic">çox məşhur</tspan> olacaq.</text>

  <circle cx="48" cy="180" r="2.5" fill="#222"/>
  <text x="60" y="185" font-family="Georgia, serif" font-size="14" fill="#222">Xəritəni tap</text>
  <circle cx="48" cy="205" r="2.5" fill="#222"/>
  <text x="60" y="210" font-family="Georgia, serif" font-size="14" fill="#222">Adanı axtar</text>
  <circle cx="48" cy="230" r="2.5" fill="#222"/>
  <text x="60" y="235" font-family="Georgia, serif" font-size="14" fill="#222">Sandığı aç</text>

  <rect x="40" y="255" width="140" height="100" fill="#f2f2f2" stroke="#999" stroke-width="1.5"/>
  <line x1="40" y1="255" x2="180" y2="355" stroke="#999" stroke-width="1"/>
  <line x1="180" y1="255" x2="40" y2="355" stroke="#999" stroke-width="1"/>
  <text x="55" y="310" font-family="Georgia, serif" font-size="11" fill="#777">xəzinə xəritəsi</text>

  <text x="40" y="390" font-family="Georgia, serif" font-size="15" fill="#1a5fb4" text-decoration="underline">Xəritəyə bax</text>
</svg>
`,
  // ── Lesson 10 — font-size: same word, three sizes ──────────────────────────
  sizeSteps: `<svg width="320" height="110" viewBox="0 0 320 110" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="40" fontFamily="sans-serif" font-size="14" fill="#f4f4f4">Kiçik</text>
    <text x="90" y="40" fontFamily="sans-serif" font-size="23" fill="#f4f4f4">Orta</text>
    <text x="190" y="40" fontFamily="sans-serif" font-size="40" fill="#f4f4f4">Böyük</text>
    <text x="10" y="100" font-size="11" fontFamily="monospace" fill="#a78bfa">14px</text>
    <text x="100" y="100" font-size="11" fontFamily="monospace" fill="#a78bfa">23px</text>
    <text x="230" y="100" font-size="11" fontFamily="monospace" fill="#a78bfa">40px</text>
  </svg>`,

  // ── Lesson 12 — box model: content / padding / border / margin layers ─────
  boxModel: `<svg width="280" height="200" viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="270" height="190" fill="#fdf0d5" stroke="#f4c84a" stroke-width="2" stroke-dasharray="6,4"/>
    <text x="140" y="20" textAnchor="middle" font-size="11" fontFamily="monospace" fill="#a87d1a">margin</text>
    <rect x="30" y="35" width="220" height="140" fill="#fff" stroke="#e5503f" stroke-width="3"/>
    <text x="140" y="50" textAnchor="middle" font-size="11" fontFamily="monospace" fill="#e5503f">border</text>
    <rect x="50" y="60" width="180" height="95" fill="#d4e8f0" stroke="#3A86FF" stroke-width="2" stroke-dasharray="4,3"/>
    <text x="140" y="78" textAnchor="middle" font-size="11" fontFamily="monospace" fill="#1a6fbf">padding</text>
    <rect x="80" y="95" width="120" height="40" fill="#a78bfa" stroke="#1a1a1a" stroke-width="2"/>
    <text x="10" y="117" textAnchor="middle" font-size="11" fontFamily="monospace" fill="#fff">content</text>
  </svg>`,

  boxModel: `
<svg viewBox="0 0 680 370" role="img" style="width:100%;height:auto" aria-label="Qutu modeli — konfet qutusu ilə padding və margin izahı">
  <defs>
    <marker id="bm-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <rect x="40" y="60" width="280" height="280" rx="16" fill="#3a3f4b" opacity="0.25" stroke="#8a8f9b" stroke-width="1" stroke-dasharray="4 4"/>
  <rect x="70" y="90" width="220" height="220" rx="14" fill="#7a5320" opacity="0.35" stroke="#d99a3d" stroke-width="1.5"/>
  <rect x="100" y="120" width="160" height="160" rx="10" fill="#0f6e56" opacity="0.35" stroke="#3fbf9a" stroke-width="1"/>
  <circle cx="180" cy="200" r="40" fill="#534ab7" stroke="#a79cf0" stroke-width="1"/>
  <text x="180" y="75" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#c7cbd4">margin</text>
  <text x="180" y="105" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#f0d3a3">border</text>
  <text x="180" y="140" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#9ee8d2">padding</text>
  <text x="180" y="200" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="500" fill="#ffffff">mətn</text>

  <rect x="400" y="90" width="200" height="200" rx="14" fill="#3a3f4b" opacity="0.25" stroke="#8a8f9b" stroke-width="1" stroke-dasharray="4 4"/>
  <rect x="420" y="110" width="160" height="160" rx="12" fill="#7a5320" opacity="0.35" stroke="#d99a3d" stroke-width="1.5"/>
  <rect x="440" y="130" width="120" height="120" rx="8" fill="#0f6e56" opacity="0.35" stroke="#3fbf9a" stroke-width="1"/>
  <circle cx="500" cy="190" r="30" fill="#534ab7" stroke="#a79cf0" stroke-width="1"/>

  <line x1="324" y1="200" x2="396" y2="200" stroke="#c7cbd4" stroke-width="1.5" marker-end="url(#bm-arrow)" marker-start="url(#bm-arrow)"/>
  <text x="360" y="182" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#c7cbd4">aralıq = margin</text>
</svg>
`,
  // ── Lesson 13 — border: a plain box gains a visible frame ──────────────────
  borderBox: `<svg width="260" height="110" viewBox="0 0 260 110" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="20" width="90" height="60" fill="#fff9e6" stroke="none"/>
    <text x="10" y="95" textAnchor="middle" font-size="11" fontFamily="monospace" fill="#888">border yoxdur</text>
    <line x1="115" y1="50" x2="150" y2="50" stroke="#888" stroke-width="2"/>
    <polygon points="150,44 150,56 160,50" fill="#888"/>
    <rect x="160" y="20" width="90" height="60" fill="#fff9e6" stroke="#e5503f" stroke-width="4"/>
    <text x="155" y="95" textAnchor="middle" font-size="11" fontFamily="monospace" fill="#e5503f">border var!</text>
  </svg>`,
  // ── Lesson 13 — text-align: same word, three positions ─────────────────
  alignBoxes: `<svg width="360" height="130" viewBox="0 0 360 130" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(10,10)">
      <rect x="0" y="0" width="100" height="70" fill="none" stroke="#4b4f58" stroke-width="2" rx="6"/>
      <text x="10" y="40" font-size="14" fill="#f4f4f4" font-family="sans-serif">Salam</text>
      <text x="50" y="100" text-anchor="middle" font-size="11" font-family="monospace" fill="#a78bfa">left</text>
    </g>
    <g transform="translate(130,10)">
      <rect x="0" y="0" width="100" height="70" fill="none" stroke="#4b4f58" stroke-width="2" rx="6"/>
      <line x1="50" y1="0" x2="50" y2="70" stroke="#4b4f58" stroke-width="1" stroke-dasharray="3 3"/>
      <text x="50" y="40" text-anchor="middle" font-size="14" fill="#f4f4f4" font-family="sans-serif">Salam</text>
      <text x="50" y="100" text-anchor="middle" font-size="11" font-family="monospace" fill="#a78bfa">center</text>
    </g>
    <g transform="translate(250,10)">
      <rect x="0" y="0" width="100" height="70" fill="none" stroke="#4b4f58" stroke-width="2" rx="6"/>
      <text x="90" y="40" text-anchor="end" font-size="14" fill="#f4f4f4" font-family="sans-serif">Salam</text>
      <text x="50" y="100" text-anchor="middle" font-size="11" font-family="monospace" fill="#a78bfa">right</text>
    </g>
  </svg>`,

  // ── Lesson 14 — background-color: same ink, three papers ───────────────
  bgSwap: `<svg width="360" height="120" viewBox="0 0 360 120" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(10,10)">
      <rect x="0" y="0" width="100" height="60" rx="10" fill="#FFE066"/>
      <text x="50" y="35" text-anchor="middle" font-size="16" fill="#1a1a1a" font-family="sans-serif" font-weight="bold">Salam</text>
      <text x="50" y="95" text-anchor="middle" font-size="11" font-family="monospace" fill="#a78bfa">yellow</text>
    </g>
    <g transform="translate(130,10)">
      <rect x="0" y="0" width="100" height="60" rx="10" fill="#3A86FF"/>
      <text x="50" y="35" text-anchor="middle" font-size="16" fill="#1a1a1a" font-family="sans-serif" font-weight="bold">Salam</text>
      <text x="50" y="95" text-anchor="middle" font-size="11" font-family="monospace" fill="#a78bfa">blue</text>
    </g>
    <g transform="translate(250,10)">
      <rect x="0" y="0" width="100" height="60" rx="10" fill="#4cae50"/>
      <text x="50" y="35" text-anchor="middle" font-size="16" fill="#1a1a1a" font-family="sans-serif" font-weight="bold">Salam</text>
      <text x="50" y="95" text-anchor="middle" font-size="11" font-family="monospace" fill="#a78bfa">green</text>
    </g>
  </svg>`,

  // ── Lesson 15 — padding alone: cushion inside one box ───────────────────
  paddingOnly: `<svg width="260" height="150" viewBox="0 0 260 150" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="15" width="220" height="120" rx="10" fill="#0f6e56" opacity="0.25" stroke="#3fbf9a" stroke-width="2"/>
    <text x="130" y="34" text-anchor="middle" font-size="12" fill="#9ee8d2" font-family="monospace">padding</text>
    <rect x="70" y="55" width="120" height="40" rx="6" fill="#a78bfa" stroke="#1a1a1a" stroke-width="2"/>
    <text x="130" y="80" text-anchor="middle" font-size="14" fill="#fff" font-family="sans-serif">mətn</text>
  </svg>`,

  // ── Lesson 16 — margin alone: gap between two boxes ─────────────────────
  marginOnly: `<svg width="320" height="140" viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="mg-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M2 1L8 5L2 9" fill="none" stroke="#c7cbd4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </marker>
    </defs>
    <rect x="15" y="30" width="100" height="70" rx="8" fill="#7a5320" opacity="0.35" stroke="#d99a3d" stroke-width="2"/>
    <text x="65" y="70" text-anchor="middle" font-size="13" fill="#fff" font-family="sans-serif">qutu 1</text>
    <rect x="205" y="30" width="100" height="70" rx="8" fill="#7a5320" opacity="0.35" stroke="#d99a3d" stroke-width="2"/>
    <text x="255" y="70" text-anchor="middle" font-size="13" fill="#fff" font-family="sans-serif">qutu 2</text>
    <line x1="118" y1="65" x2="202" y2="65" stroke="#c7cbd4" stroke-width="1.5" marker-end="url(#mg-arrow)" marker-start="url(#mg-arrow)"/>
    <text x="160" y="50" text-anchor="middle" font-size="12" fill="#c7cbd4" font-family="monospace">margin</text>
  </svg>`,
};


export const LESSONS = {
  // ── LESSON 1 — <body> ──────────────────────────────────────────────────────
  1: {
    module: 1, tag: 'HTML Əsasları', indexLabel: '1.', title: 'HTML Nədir? <body>',
    difficulty: 'ASAN', urlPath: 'ders-1',
    explanationHtml: `
      <p>Təsəvvür et ki, bir ev tikirsən. Əvvəl divarları, döşəməni, damı qoyursan, yəni, evin <span class="hl-purple">skeletini</span> qurursan. Sonra rəngləyib bəzəyirsən. İnternetdəki veb səhifələr də belə qurulur, amma "kərpic" əvəzinə <strong>HTML</strong> işlədilir.</p>
      <p>HTML brauzerin (Chrome, Safari, Edge) başa düşdüyü xüsusi bir dildir. Sən kodu yazırsan, brauzer də onu oxuyub ekranda bir səhifəyə çevirir.</p>
      
      <p>Bəs bu kodlar necə yazılır? HTML-də hər bir element <strong>"teq" (tag)</strong> adlanan xüsusi qutuların içinə qoyulur. Teqlər brauzerə <i>"bu mətni başlıq elə"</i> və ya <i>"bura şəkil qoy"</i> əmrini verir. Onlar adətən belə cütlük şəklində yazılır: <span class="code-chip">&lt;teq&gt;</span> mətn <span class="code-chip">&lt;/teq&gt;</span>.</p>
      
      <p>Hər HTML sənədinin əsas canı isə <span class="code-chip">&lt;body&gt;</span> teqidir. Veb saytda istifadəçinin gördüyü <span class="hl-yellow">hər şey</span> — yazılar, şəkillər, düymələr — məhz bu açılan və bağlanan teqlərin arasına yazılır.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">🏠 ANALOGİYA</span><span class="diagram-title">Ev və Veb Səhifə</span></div>
        <p class="diagram-text">Ev necə bir iskeletdən ibarətdirsə, veb səhifə də HTML-dən ibarətdir.</p>
        <div class="tree-wrap">
          <div class="tree-root">&lt;body&gt; — Evin içi</div>
          <div class="tree-stem"></div>
          <div class="tree-branches">
            <div class="branch"><div class="branch-line"></div><div class="tree-node"><div class="tag">Mətnlər</div><div class="desc">divar yazıları</div></div></div>
            <div class="branch"><div class="branch-line"></div><div class="tree-node"><div class="tag">Şəkillər</div><div class="desc">rəsmlər</div></div></div>
            <div class="branch"><div class="branch-line"></div><div class="tree-node"><div class="tag">Düymələr</div><div class="desc">qapılar</div></div></div>
          </div>
        </div>
      </div>
    `,
    taskHtml: `<p>Redaktorda <span class="code-chip">&lt;body&gt;</span> teqinin içinə öz adını yaz, sonra <strong>RUN</strong> düyməsinə bas.</p>`,
    starter: '<html>\n<body>\n\n</body>\n</html>',
    errorMsg: 'Body teqinin içinə bir şey yaz!',
    validate: (code) => {
      // Must have a real <body> with non-empty text content inside it
      const p = parseBody(code);
      if (!p) return false;
      return p.body.textContent.trim().length > 0;
    },
  },

  // ── LESSON 2 — <h1> ───────────────────────────────────────────────────────
  2: {
    module: 1, tag: 'HTML Əsasları', indexLabel: '2.', title: 'Böyük Başlıq &lt;h1&gt;',
    difficulty: 'ASAN', urlPath: 'ders-2',
    explanationHtml: `
      <p>Hər kitabın bir adı var, üz qabığında böyük hərflərlə yazılır. Veb səhifələrdə bu rolu <span class="hl-purple">başlıqlar</span> oynayır. HTML-də ən böyük başlıq üçün <span class="code-chip">&lt;h1&gt;</span> teqindən istifadə edirik.</p>
      <p>Hər teqin bir cütü var: açılış və bağlanış. <span class="code-chip">&lt;h1&gt;</span> açılır, mətn gəlir, sonra <span class="code-chip">&lt;/h1&gt;</span> ilə teq bağlanır. <span class="hl-red">Bağlamağı unutsan</span>, brauzer başlığın harada bitdiyini bilməyəcək.</p>
      <p>Adətən bir səhifədə yalnız <span class="hl-yellow">bir</span> <span class="code-chip">&lt;h1&gt;</span> olur. Daha kiçik alt-başlıqlar üçün <span class="code-chip">&lt;h2&gt;</span>, <span class="code-chip">&lt;h3&gt;</span> və s. istifadə olunur.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">📰 ANALOGİYA</span><span class="diagram-title">Xəbər Manşeti</span></div>
        <p class="diagram-text">Qəzetin ön səhifəsindəki ən böyük, diqqətçəkən əsas başlıq tam olaraq &lt;h1&gt; rolunu oynayır.</p>
        <pre>               &lt;h1&gt;Mən Bu Səhifənin Şahıyam!&lt;/h1&gt;\n                 ↑                            ↑          \n               açılış                    bağlanış</pre>
      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilinə <span class="code-chip">&lt;h1&gt;Salam, Dünya!&lt;/h1&gt;</span> yaz, sonra <strong>RUN</strong> et.</p>`,
    starter: '<html>\n<body>\n\n</body>\n</html>',
    errorMsg: 'body içində <h1>Salam, Dünya!</h1> yazılmalıdır — xaricdə olan teqlər sayılmır!',
    validate: (code) => {
      // 1. Əvvəlcə yazının daxilində tam və düzgün bir <h1>...</h1> teqinin olub-olmadığını Regex ilə yoxlayırıq
      // bu regex mütləq şəkildə açılış elementini və qarşısında "/" olan bağlanış teqini tələb edir.
      const hasValidH1Structure = /<h1\b[^>]*>([\s\S]*?)<\/h1>/i.test(code);
      if (!hasValidH1Structure) return false;

      // 2. Əgər struktur düzgündürsə, daxili mətni yoxlamaq üçün mövcud parser məntiqinə ötürürük
      const p = parseBody(code);
      if (!p) return false;
      
      const h1 = p.body.querySelector('h1');
      if (!h1) return false;
      
      const txt = h1.textContent.trim();
      return /^salam,\s*dünya!$/i.test(txt);
    },
  },

  // ── LESSON 3 — <p> ────────────────────────────────────────────────────────
  3: {
    module: 1, tag: 'HTML Əsasları', indexLabel: '3.', title: 'Paraqraf &lt;p&gt;',
    difficulty: 'ASAN', urlPath: 'ders-3',
   explanationHtml: `
      <p>Evin divarında sadəcə bir böyük giriş lövhəsi (başlıq) olmur. Evdəki rəflərdə kitablar, albomlar və uzun hekayələr də olur. HTML-də bu cür adi və geniş mətnlər üçün <span class="code-chip">&lt;p&gt;</span> teqindən istifadə edirik. "P" hərfi ingiliscə <span class="hl-purple">paragraph (paraqraf)</span> sözündən götürülüb.</p>
      <p><span class="code-chip">&lt;h1&gt;</span> bir səhifədə adətən <span class="hl-yellow">bir dəfə</span> (kitabın adı kimi) yazılır, amma <span class="code-chip">&lt;p&gt;</span> teqindən istədiyin qədər istifadə edə bilərsən. Hər yeni fikir və ya abzas üçün ayrı bir paraqraf açılır.</p>
      <p><span class="hl-red">Unutma:</span> Necə ki kitabı oxuyub qurtaranda qapağını bağlayırsan, hər bir <span class="code-chip">&lt;p&gt;</span> teqi də öz cütü ilə bağlanmalıdır: <span class="code-chip">&lt;/p&gt;</span>.</p>
    `,
   diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">📰 ANALOGİYA</span><span class="diagram-title">Xəbər Strukturu</span></div>
        <p class="diagram-text">&lt;h1&gt; diqqətçəkən böyük manşetdir, &lt;p&gt; isə onun altındakı adi xəbər abzasdır.</p>
        
        <pre style="line-height: 1.5;"><span style="font-size: 20px; font-weight: bold; color: #fff;">&lt;h1&gt;Marsda Həyat Tapıldı!&lt;/h1&gt;</span>  ← Əsas Başlıq (Böyük)\n<span style="font-size: 13px; color: #ccc;">&lt;p&gt;Qırmızı planetdə qəribə izlər aşkar edildi...&lt;/p&gt;</span>  ← Adi Mətn (Kiçik)\n ↑                                              ↑\nAçılış teqi                                 Bağlanış teqi</pre>
      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilinə <span class="code-chip">&lt;p&gt;</span> teqi ilə özün haqqında <strong>ən azı 3 sözlük</strong> bir cümlə yaz.</p>`,
    starter: '<html>\n<body>\n\n</body>\n</html>',
    errorMsg: 'body içində düzgün bağlanmış <p> olmalı və içində ən azı 3 söz olmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('p')) return false;
      const para = p.body.querySelector('p');
      if (!para) return false;
      return para.textContent.trim().split(/\s+/).filter(Boolean).length >= 3;
    },
  },

  // ── LESSON 4 — <strong> & <em> ───────────────────────────────────────────
  4: {
    module: 1, tag: 'HTML Əsasları', indexLabel: '4.', title: 'Qalın &amp; Maili &lt;strong&gt; &lt;em&gt;',
    difficulty: 'ASAN', urlPath: 'ders-4',
    explanationHtml: `
      <p>Kitab oxuyanda və ya qəzet vərəqləyəndə bəzi sözlərin digərlərindən daha fərqli yazıldığını görürük. HTML-də mətnin içindəki vacib sözləri önə çıxarmaq üçün iki əsas alətimiz var: <span class="code-chip">&lt;strong&gt;</span> mətni <span class="hl-purple">qalın (bold)</span> edir, <span class="code-chip">&lt;em&gt;</span> isə <i><span class="hl-purple">maili (italik)</span></i> edərək sözü vurğulayır.</p>
      <p>Bu teqlər adətən paraqrafın <span class="hl-yellow">içinə</span> yazılır. Məsələn, bir <span class="code-chip">&lt;p&gt;</span> daxilindəki bir sözü qalın etmək istəyirsənsə, həmin sözü <span class="code-chip">&lt;strong&gt;</span> qutusuna qoyursan.</p>
      <p><span class="hl-red">Unutma:</span> Bu teqlər də cütlükdür, yəni mütləq açılıb-bağlanmalıdırlar: <span class="code-chip">&lt;strong&gt;...&lt;/strong&gt;</span> və <span class="code-chip">&lt;em&gt;...&lt;/em&gt;</span>.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">📰 ANALOGİYA</span><span class="diagram-title">Mətni Vurğulamaq</span></div>
        <p class="diagram-text">&lt;strong&gt; sözü qalınlaşdırıb onun vacibliyini göstərir, &lt;em&gt; isə sözü əyərək yazıya xüsusi səs tonu (vurğu) qatır.</p>
        
        <pre style="line-height: 1.6;"><span style="font-size: 14px; color: #fff;">Bu söz <strong style="color: #FFE066; font-size: 16px;">&lt;strong&gt;vacibdir&lt;/strong&gt;</strong>.</span>  ← Qalın və diqqətçəkən\n<span style="font-size: 14px; color: #fff;">Bu söz <em style="color: #a78bfa; font-size: 15px; font-style: italic;">&lt;em&gt;xüsusidir&lt;/em&gt;</em>.</span>    ← Maili və vurğulanmış</pre>
      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilində bir <span class="code-chip">&lt;p&gt;</span> yaz, içində ən azı bir söz <span class="code-chip">&lt;strong&gt;</span> ilə, bir söz isə <span class="code-chip">&lt;em&gt;</span> ilə işarələnsin.</p>`,
    starter: '<html>\n<body>\n  <p>\n\n  </p>\n</body>\n</html>',
    errorMsg: 'p içində həm <strong>, həm də <em> olmalı və hər ikisi düzgün bağlanmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('strong') || !p.balanced('em')) return false;
      const strong = p.body.querySelector('strong');
      const em = p.body.querySelector('em');
      return !!(strong?.textContent.trim() && em?.textContent.trim());
    },
  },

  // ── LESSON 5 — <a> ───────────────────────────────────────────────────────
  5: {
    module: 1, tag: 'HTML Əsasları', indexLabel: '5.', title: 'Keçidlər &lt;a&gt;',
    difficulty: 'ORTA', urlPath: 'ders-5',
    explanationHtml: `
      <p>İnternet milyardlarla fərqli səhifənin birləşdiyi nəhəng bir rəqəmsal dünyadır. Bəs bu səhifələr arasında necə səyahət edirik? Əlbəttə ki, <span class="hl-purple">linklərin</span> köməyi ilə. HTML-də bizi bir kliklə tamamilə başqa bir səhifəyə aparan bu "sehrli qapının" adı <span class="code-chip">&lt;a&gt;</span> (Anchor - Lövbər) teqidir.</p>
      
      <p>Lakin təkcə <span class="code-chip">&lt;a&gt;</span> yazmaq kifayət etmir. Brauzer <span class="code-chip">&lt;a&gt;</span> vasitəsilə "keçid yaratmaq istədiyini" anlayır, amma <i>"hara gedəcəyini"</i> bilmir. HTML teqlərinə əlavə tənzimləmələr və ya əmrlər vermək üçün <strong>atributlardan (özəlliklərdən)</strong> istifadə olunur. Atribut teqin daxilinə yazılan xüsusi bir ipucudur.</p>
      
      <p>Bizim keçid teqinin ən vacib atributu <span class="code-chip">href</span>-dir. O, brauzerə teleportasiya olacağı dəqiq koordinatı pıçıldayır. Kod üzərində baxsaq, atribut həmişə açılış teqinin tam daxilinə, bərabərlik işarəsi və dırnaqlarla yazılır: <span class="code-chip">&lt;a href="https://google.com"&gt;Google-a get&lt;/a&gt;</span>. Burada <span class="hl-purple">https://google.com</span> href atributudur və dırnaq içində olmalıdır.</p>
      
      <p><span class="hl-red">Unutma:</span> <span class="code-chip">href</span> dırnaqlarının daxilindəki ünvan mütləq tam və real şəbəkə protokolu ilə başlamalıdır: <span class="code-chip">https://</span>.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">🌀 ANALOGİYA</span><span class="diagram-title">Teleport Stansiyası</span></div>
        <p class="diagram-text">&lt;a&gt; kliklənə bilən düymədirsə, href onun arxa fonda gizlətdiyi hədəf koordinatıdır (kosmik ünvanıdır).</p>
        
        <pre style="line-height: 1.6;">&lt;a <span style="color: #FFE066; font-weight: bold;">href="https://google.com"</span>&gt;<span style="color: #00D4AA; font-weight: bold;">Google</span>&lt;/a&gt;\n     ↑                          ↑\nArxa fondakı hədəf        Ekranda görünən\n   ünvan (href)              mavi mətn</pre>
      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilinə bir <span class="code-chip">&lt;a&gt;</span> teqi ilə istənilən real veb sayta keçid yarat.</p><ul><li><span class="code-chip">href</span> atributu dırnaq içində, <span class="code-chip">https://</span> ilə başlamalıdır</li><li>Ekranda görünən mətn ən azı 1 sözdən ibarət olsun</li></ul>`,
    starter: '<html>\n<body>\n\n</body>\n</html>',
    errorMsg: 'a teqi düzgün bağlanmalı, href="https://..." dırnaq içində olmalı və üzərində mətn olmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('a')) return false;
      if (!p.hasAttr('href')) return false;
      const a = p.body.querySelector('a[href]');
      if (!a) return false;
      const href = a.getAttribute('href') || '';
      if (!/^https?:\/\//i.test(href)) return false;
      return a.textContent.trim().length > 0;
    },
  },

  // ── LESSON 6 — <ul> <li> ─────────────────────────────────────────────────
  6: {
    module: 1, tag: 'HTML Əsasları', indexLabel: '6.', title: 'Siyahılar &lt;ul&gt; &lt;li&gt;',
    difficulty: 'ORTA', urlPath: 'ders-6',
    explanationHtml: `
      <p>Mağazaya və ya bazara gedəndə unutmamaq üçün çox vaxt bir siyahı hazırlayırıq: çörək, süd, alma... HTML-də belə maddə-maddə düzülən siyahılar yaratmaq üçün iki teq əl-ələ verib birlikdə işləyir: <span class="code-chip">&lt;ul&gt;</span> bütöv bir <span class="hl-purple">siyahı vərəqi</span> rolunu oynayır, <span class="code-chip">&lt;li&gt;</span> isə həmin vərəqdəki <span class="hl-yellow">hər bir maddədir</span>.</p>
      <p>"UL" sözü ingiliscə <i>unordered list</i> (sırasız, yəni nömrələnməmiş siyahı) ifadəsindən götürülüb. Siyahıdakı hər bir bənd öz xüsusi <span class="code-chip">&lt;li&gt;...&lt;/li&gt;</span> qutusunda yazılır və bütün bu maddələr mütləq ana vərəqin, yəni <span class="code-chip">&lt;ul&gt;</span> teqinin <span class="hl-yellow">içində</span> yerləşməlidir.</p>
      <p><span class="hl-red">Unutma:</span> <span class="code-chip">&lt;li&gt;</span> teqi təkbaşına yaşaya bilməz. O mütləq hansısa bir siyahı vərəqinin (<span class="code-chip">&lt;ul&gt;</span>) daxilində olmalıdır.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">📝 VİZUAL</span><span class="diagram-title">Siyahı Strukturu</span></div>
        <p class="diagram-text">&lt;ul&gt; ana vərəqdir, daxilindəki &lt;li&gt; teqləri isə nöqtə ilə ayrılan bəndlərdir:</p>
        
        <div style="background: #25262b; border: 1px solid #373a40; border-radius: 8px; padding: 15px; font-family: monospace; line-height: 1.6;">
          <div style="color: #868e96; margin-bottom: 10px; border-bottom: 1px dashed #373a40; padding-bottom: 8px;">💻 YAZILAN KOD:</div>
          <div style="color: #ffe066; font-size: 16px; font-weight: bold;">&lt;h1&gt;<span style="color: #fff;">Bazar Siyahısı</span>&lt;/h1&gt;</div>
          <div style="color: #ffe066; margin-top: 5px;">&lt;ul&gt;</div>
          <div style="padding-left: 20px; color: #a78bfa;">&lt;li&gt;<span style="color: #fff; font-weight: bold;">Çörək</span>&lt;/li&gt;</div>
          <div style="padding-left: 20px; color: #a78bfa;">&lt;li&gt;<span style="color: #fff; font-weight: bold;">Süd</span>&lt;/li&gt;</div>
          <div style="padding-left: 20px; color: #a78bfa;">&lt;li&gt;<span style="color: #fff; font-weight: bold;">Şokolad</span>&lt;/li&gt;</div>
          <div style="color: #ffe066;">&lt;/ul&gt;</div>
          
          <div style="color: #868e96; margin-top: 15px; margin-bottom: 5px; border-top: 1px dashed #373a40; padding-top: 12px;">🌐 BRAUZERDƏ GÖRÜNÜŞÜ:</div>
          <div style="background: #fff9e6; border-left: 4px solid #fcc419; padding: 12px 20px; border-radius: 4px; color: #212529; font-family: sans-serif;">
            <h1 style="margin: 0 0 10px 0; font-size: 20px; color: #1a1a1a; border-bottom: 2px solid #f1f3f5; padding-bottom: 5px;">Bazar Siyahısı</h1>
            <ul style="margin: 0; padding-left: 20px; list-style-type: disc;">
              <li style="margin-bottom: 4px; font-weight: 500;">Çörək</li>
              <li style="margin-bottom: 4px; font-weight: 500;">Süd</li>
              <li style="margin: 0; font-weight: 500;">Şokolad</li>
            </ul>
          </div>
        </div>
      </div>
    `,
        
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilində bir <span class="code-chip">&lt;ul&gt;</span> yarat, içində ən azı <strong>3</strong> <span class="code-chip">&lt;li&gt;</span> olsun.</p>`,
    starter: '<html>\n<body>\n\n</body>\n</html>',
    errorMsg: 'ul düzgün bağlanmalı və içində ən azı 3 li elementi olmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('ul') || !p.balanced('li')) return false;
      const ul = p.body.querySelector('ul');
      if (!ul) return false;
      return ul.querySelectorAll('li').length >= 3;
    },
  },

  // ── LESSON 7 — <img> ─────────────────────────────────────────────────────
  7: {
    module: 1, tag: 'HTML Əsasları', indexLabel: '7.', title: 'Şəkillər &lt;img&gt;',
    difficulty: 'ORTA', urlPath: 'ders-7',
    explanationHtml: `
      <p>Yalnız mətnlərdən ibarət olan bir veb səhifə çox cansıxıcı görünərdi. Saytı canlandırmaq və vizual olaraq gözəlləşdirmək üçün şəkillərdən istifadə edirik. HTML-də səhifəyə şəkil yerləşdirmək üçün <span class="code-chip">&lt;img&gt;</span> (Image) teqi işlədilir.</p>
      
      <p><span class="code-chip">&lt;img&gt;</span> teqinin çox xüsusi bir qaydası var: onun <span class="hl-yellow">bağlanış teqi yoxdur</span> (yəni &lt;/img&gt; yazılmır). Çünki onun içinə mətn qoymuruq, şəkli yükləmək üçün teqin daxilinə iki önəmli atribut əlavə edirik: <span class="code-chip">src</span> (Source - şəklin internetdəki ünvanı) və <span class="code-chip">alt</span> (Alternative text - şəkil haqqında qısa izahat).</p>
      
      <p><span class="hl-red">Niyə ALT vacibdir?</span> Əgər istifadəçinin interneti zəif olsa və şəkil yüklənməsə, brauzer boşluq qalmamaq üçün <span class="code-chip">alt</span> daxilinə yazdığın mətni göstərir. Həmçinin görmə məhdudiyyətli insanlar üçün xüsusi proqramlar bu mətni səsli oxuyur. Ona görə də bu atributu yazmaq mütləqdir!</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">📰 ANALOGİYA</span><span class="diagram-title">Qəzet Maketi</span></div>
        <p class="diagram-text">Bütün öyrəndiyimiz teqlər iyerarxiya ilə birləşəndə qəzet strukturunu formalaşdırır:</p>
        
        <div style="background: #25262b; border: 1px solid #373a40; border-radius: 8px; padding: 15px; font-family: monospace; line-height: 1.5;">
          <div style="margin-bottom: 15px; font-size: 14px;">
            <div style="color: #ffe066; font-weight: bold;">&lt;h1&gt;<span style="color: #fff;">Koder Qəzeti</span>&lt;/h1&gt;</div>
            <div style="color: #ffe066; font-weight: bold; margin-top: 4px;">&lt;h2&gt;<span style="color: #fff;">Marsda Həyat Tapıldı!</span>&lt;/h2&gt;</div>
            <div style="color: #ffe066; margin: 4px 0;">&lt;p&gt;<span style="color: #fff;">Qırmızı planetdə qəribə izlər aşkar edildi...</span>&lt;/p&gt;</div>
            <div style="color: #ffe066; font-weight: bold;">&lt;img <span style="color: #a78bfa;">src="<span style="color: #fff;">rover.jpg</span>"</span> <span style="color: #a78bfa;">alt="<span style="color: #00D4AA;">Mars robotu</span>"</span>&gt;</div>
          </div>
          
          <div style="background: #f4f1ea; border: 1px solid #c8c3bc; padding: 15px; border-radius: 4px; font-family: 'Times New Roman', Times, serif; color: #1a1a1a;">
            
            <div style="font-size: 22px; font-weight: bold; text-transform: uppercase; border-bottom: 2px solid #1a1a1a; text-align: center; margin-bottom: 12px; padding-bottom: 3px; letter-spacing: 1px;">
              Koder Qəzeti
            </div>
            
            <div style="display: flex; gap: 15px; align-items: flex-start;">
              
              <div style="flex: 1; color: #222;">
                <h2 style="margin: 0 0 6px 0; font-size: 16px; font-family: sans-serif; font-weight: bold; color: #000; line-height: 1.2;">
                  Marsda Həyat Tapıldı!
                </h2>
                <p style="margin: 0; font-size: 13px; line-height: 1.4; text-align: justify;">
                  Qırmızı planetdə qəribə izlər aşkar edildi...
                </p>
              </div>
              
              <div style="width: 120px; background: #fff; border: 1px solid #b5b0a8; padding: 5px; text-align: center; box-shadow: 1px 1px 3px rgba(0,0,0,0.05); flex-shrink: 0;">
                <div style="background: #dcd7cd; height: 70px; display: flex; align-items: center; justify-content: center; font-size: 24px; border: 1px solid #9c968d;">
                  🤖
                </div>
                <div style="font-size: 12px; font-weight: bold; color: #00876c; font-family: sans-serif; line-height: 1.2; margin-top: 5px; border-top: 1px dashed #b5b0a8; padding-top: 4px;">
                  Mars robotu
                </div>
              </div>
              
            </div>
            
          </div>
        </div>
      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilinə bir <span class="code-chip">&lt;img&gt;</span> teqi yaz.</p><ul><li><span class="code-chip">src</span> atributu dolu olmalıdır</li><li><span class="code-chip">alt</span> atributu dolu olmalıdır</li></ul>`,
    starter: '<html>\n<body>\n\n</body>\n</html>',
    errorMsg: 'img teqinin src="..." və alt="..." atributları dırnaq içində və dolu olmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.hasAttr('src') || !p.hasAttr('alt')) return false;
      const img = p.body.querySelector('img');
      if (!img) return false;
      const src = img.getAttribute('src') || '';
      const alt = img.getAttribute('alt') || '';
      return src.trim().length > 0 && alt.trim().length > 0;
    },
  },

  // ── LESSON 8 — <div> ─────────────────────────────────────────────────────
  8: {
    module: 1, tag: 'HTML Əsasları', indexLabel: '8.', title: 'Qruplaşdırma &lt;div&gt;',
    difficulty: 'ASAN', urlPath: 'ders-8',
    explanationHtml: `
      <p><span class="code-chip">&lt;div&gt;</span> özündə <span class="hl-yellow">heç bir görünüş daşımayan</span> bir qutudur. Nə qalınlaşdırır, nə rənglənir, nə ölçü dəyişir — sadəcə içindəki elementləri bir yerə yığır.</p>
      <p>Bunu bir <span class="hl-purple">çanta</span> kimi düşün. Çantanın özü heç nəyi dəyişmir, amma içinə qoyduğun əşyaləri bir yerdə saxlayır. Bir <span class="code-chip">&lt;h1&gt;</span> ilə bir <span class="code-chip">&lt;p&gt;</span>-ni birlikdə "çantaya" qoymaq istəsən, ikisini <span class="code-chip">&lt;div&gt;...&lt;/div&gt;</span> daxilinə yazırsan.</p>
      <p>Niyə lazımdır? İrəlidə CSS ilə bir neçə elementi <span class="hl-yellow">birdən</span> rəngləmək, yerini dəyişmək və ya gizlətmək istəyəndə, onları əvvəlcə bir div-ə yığırsan. Divsiz, hər elementi tək-tək idarə etməli olardın.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">🎒 ANALOGİYA</span><span class="diagram-title">Görünməz Çanta</span></div>
        <p class="diagram-text">&lt;div&gt; içindəkiləri bir yerə yığır, amma özü heç nəyi dəyişmir.</p>
        <div style="background: #25262b; border: 1px solid #373a40; border-radius: 8px; padding: 15px; font-family: monospace; line-height: 1.6;">
          <div style="color: #ffe066;">&lt;div&gt;</div>
          <div style="padding-left: 20px; color: #a78bfa;">&lt;h1&gt;<span style="color:#fff;">Salam</span>&lt;/h1&gt;</div>
          <div style="padding-left: 20px; color: #a78bfa;">&lt;p&gt;<span style="color:#fff;">Mən kod öyrənirəm</span>&lt;/p&gt;</div>
          <div style="color: #ffe066;">&lt;/div&gt;</div>
          <div style="color: #868e96; margin-top: 10px; font-family: sans-serif;">↑ h1 və p indi eyni "çantada" — bir qrup təşkil edirlər.</div>
        </div>
      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilində bir <span class="code-chip">&lt;div&gt;</span> yarat, içinə ən azı <strong>2 fərqli element</strong> (məs. <span class="code-chip">&lt;h1&gt;</span> və <span class="code-chip">&lt;p&gt;</span>) qoy.</p>`,
    starter: '<html>\n<body>\n  <div>\n\n  </div>\n</body>\n</html>',
    errorMsg: 'div düzgün bağlanmalı və içində ən azı 2 fərqli element olmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('div')) return false;
      const div = p.body.querySelector('div');
      if (!div) return false;
      const children = div.children;
      if (children.length < 2) return false;
      const tagSet = new Set(Array.from(children).map(c => c.tagName.toLowerCase()));
      return tagSet.size >= 2;
    },
  },

  // ── LESSON 9 — Combined Task (Module 1 Review) ──────────────────────────
  9: {
    module: 1, tag: 'HTML Əsasları', indexLabel: '9.', title: 'Böyük Tapşırıq: Xəzinə Elanı',
    difficulty: 'ÇƏTİN', urlPath: 'ders-9',
    explanationHtml: `
      <p>İndiyə qədər <span class="hl-purple">8 fərqli teq</span> öyrəndin. İndi hamısını birləşdirib öz <span class="hl-yellow">xəzinə elanını</span> quracaqsan — sanki bir dəniz qulduru kimi elan lövhəsi yazırsan!</p>
      <p>Aşağıdakı bütün elementlər <span class="code-chip">&lt;body&gt;</span> daxilində olmalıdır:</p>
      <ul style="margin:8px 0; padding-left:20px; line-height:1.8;">
        <li><span class="code-chip">&lt;h1&gt;</span> — elanın başlığı</li>
        <li><span class="code-chip">&lt;p&gt;</span> — izahat, içində <span class="code-chip">&lt;strong&gt;</span> və <span class="code-chip">&lt;em&gt;</span> olan ən azı bir söz</li>
        <li><span class="code-chip">&lt;a href="https://...">&lt;/a&gt;</span> — "xəritəyə bax" keçidi</li>
        <li><span class="code-chip">&lt;ul&gt;</span> — ən azı 3 <span class="code-chip">&lt;li&gt;</span> ilə tapşırıqlar/ipuçları</li>
        <li><span class="code-chip">&lt;img src="..." alt="..."></span> — bir şəkil</li>
        <li>Bunların hamısı bir <span class="code-chip">&lt;div&gt;</span> daxilində qruplaşsın</li>
      </ul>
      <p><span class="hl-red">Unutma:</span> bütün teqlər düzgün bağlanmalı, atributlar dırnaq içində olmalıdır.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">🏴‍☠️ NÜMUNƏ</span><span class="diagram-title">Xəzinə Elanının Quruluşu</span></div>
        <p class="diagram-text">Hər zona hansı teqdən düzəldiyini göstərir — amma kodu özün yazmalısan!</p>
        ${SVG.treasurePoster}
      </div>
    `,
    taskHtml: `<p>Yuxarıdakı posterdəki <strong>8 elementin hamısını</strong> istifadə edərək öz xəzinə elanını qur, sonra <strong>RUN</strong> et.</p>`,
    starter: '<html>\n<body>\n  <div>\n\n  </div>\n</body>\n</html>',
    errorMsg: 'Bütün 8 element (h1, p+strong+em, a, ul+3 li, img, div) düzgün və tam olmalıdır.',
  chests: [
    { cost: 1, hint: '<span class="code-chip">&lt;strong&gt;</span> və <span class="code-chip">&lt;em&gt;</span> teqlərini <span class="code-chip">&lt;p&gt;</span> elementi içində istifadə et.', code: null },
    { cost: 2, hint: '<span class="code-chip">&lt;img&gt;</span> teqini bağlamağa ehtiyac yoxdur.', code: null },
    { cost: 3, hint: '<span class="code-chip">&lt;div&gt;</span> teqini <span class="code-chip">&lt;img&gt;</span> elementindən sonra bağla.', code: '<img src="..." alt="..."></div>' },
  ],    
      validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;

      const balancedTags = ['div', 'h1', 'p', 'strong', 'em', 'a', 'ul', 'li'];
      for (const t of balancedTags) if (!p.balanced(t)) return false;

      const h1 = p.body.querySelector('h1');
      if (!h1 || !h1.textContent.trim()) return false;

      const para = p.body.querySelector('p');
      if (!para) return false;
      const strong = para.querySelector('strong');
      const em = para.querySelector('em');
      if (!strong?.textContent.trim() || !em?.textContent.trim()) return false;

      const a = p.body.querySelector('a[href]');
      if (!a) return false;
      const href = a.getAttribute('href') || '';
      if (!/^https?:\/\//i.test(href) || !a.textContent.trim()) return false;

      const ul = p.body.querySelector('ul');
      if (!ul || ul.querySelectorAll('li').length < 3) return false;

      const img = p.body.querySelector('img');
      if (!img) return false;
      const src = img.getAttribute('src') || '';
      const alt = img.getAttribute('alt') || '';
      if (!src.trim() || !alt.trim()) return false;

      const div = p.body.querySelector('div');
      if (!div) return false;

      return true;
    },
  },
  // ── LESSON 10 — CSS Nədir? ────────────────────────────────────────────────
  10: {
    module: 2, tag: 'CSS ilə Stil və Dizayn', indexLabel: '1.', title: 'CSS Nədir?',
    difficulty: 'ASAN', urlPath: 'ders-10',
    explanationHtml: `
      <p>Yadındadırmı, HTML ilə evin təmiz daşlardan ibarət olan <span class="hl-purple">skeletini (bünövrəsini)</span> qurmuşduq? İndi ise həmin evi <span class="hl-yellow">bəzəmək</span> vaxtıdır: divarları rəngləmək və pəncərələrin ölçüsünü təyin etmək. Bunu edən dil <strong>CSS</strong>-dir.</p>
      <p>HTML səhifədə <span class="hl-purple">nəyin var olduğunu</span> deyir (başlıq, paraqraf, şəkil), CSS isə onların brauzerdə <span class="hl-yellow">necə göründüyünü</span> müəyyən edir (rəngi, ölçüsü, yerləşməsi).</p>
      <p>CSS qaydalarını tətbiq etməyin ilkin yolu <span class="code-chip">style</span> atributudur. İstənilən teqin daxilinə <span class="code-chip">style="..."</span> yazıb, içində dizayn əmrləri qoyursan.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">🎨 ANALOGİYA</span><span class="diagram-title">Skelet və Bəzək</span></div>
        <p class="diagram-text">CSS olmadan mətn standart qara və sadə olur. Style atributu əlavə edildikdə isə görünüş tamamilə dəyişir:</p>
        
        <div style="margin-bottom: 20px;">
          <div style="font-family: monospace; font-size: 14px; margin-bottom: 8px; color: #fff; font-weight: bold; letter-spacing: 0.5px;">
            &lt;h1&gt;<span style="color: #fff;">Mənim Evim</span>&lt;/h1&gt; <span style="color: #868e96; font-size: 12px; font-family: sans-serif; font-weight: normal; margin-left: 10px;">(Stilsiz halı)</span>
          </div>
          <div style="background: #ffffff; border: 1px solid #e3e6e8; padding: 15px; border-radius: 4px;">
            <h1 style="margin: 0; font-family: sans-serif; font-size: 16px; color: #000000; font-weight: bold;">
              Mənim Evim
            </h1>
          </div>
        </div>

        <div>
          <div style="font-family: monospace; font-size: 14px; margin-bottom: 8px; color: #fff; font-weight: bold; letter-spacing: 0.5px;">
            &lt;h1 <span style="color: #a78bfa;">style="<span style="color: #ff8787;">color</span>: <span style="color: #4dadf7;">blue</span>; <span style="color: #ff8787;">font-size</span>: <span style="color: #4dadf7;">24px</span>;"</span>&gt;Mənim Evim&lt;/h1&gt; <span style="color: #00D4AA; font-size: 12px; font-family: sans-serif; font-weight: normal; margin-left: 10px;">(Dizayn edilmiş halı)</span>
          </div>
          <div style="background: #ffffff; border: 1px solid #e3e6e8; padding: 15px; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <h1 style="margin: 0; font-family: sans-serif; font-size: 24px; color: blue; font-weight: bold;">
              Mənim Evim
            </h1>
          </div>
        </div>

      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilində bir <span class="code-chip">&lt;h1&gt;</span> yaz və <span class="code-chip">style</span> atributundan istifadə edərək ona ya mətn rəngi (<span class="code-chip">color: blue;</span>), ya da şrift ölçüsü (<span class="code-chip">font-size: 24px;</span>) təyin et.</p>`,
    starter: '<html>\n<body>\n  \n</body>\n</html>',
    errorMsg: 'h1 teqinin style atributu daxilində düzgün CSS xüsusiyyəti (color və ya font-size) yazılmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('h1')) return false;
      
      const h1 = p.body.querySelector('h1');
      if (!h1) return false;
      
      const style = (h1.getAttribute('style') || '').replace(/\s/g, '').toLowerCase();
      
      // color: sözündən sonra yalnız keçərli əsas rənglərin (red, blue, green, yellow, purple) gəlməsini tələb edirik
      const hasValidColor = /color:(red|blue|green|yellow|purple)(;|$)/.test(style);
      
      // font-size: sözündən sonra rəqəm və px vahidinin gəlməsini tələb edirik
      const hasValidFontSize = /font-size:\d+px(;|$)/.test(style);
      
      return hasValidColor || hasValidFontSize;
    },
  },

  // ── LESSON 11 — color ─────────────────────────────────────────────────────
  11: {
    module: 2, tag: 'CSS ilə Stil və Dizayn', indexLabel: '2.', title: 'Rənglər color',
    difficulty: 'ASAN', urlPath: 'ders-11',
    explanationHtml: `
      <p>Evin divarlarını rəngləmək istəyirsən? CSS-də mətnin rəngini dəyişmək üçün xüsusi olaraq <span class="code-chip">color</span> xüsusiyyəti istifadə olunur.</p>
      <p>Yazılışı olduqca sadədir: <span class="code-chip">style="color: red;"</span> — bu əmr həmin teqin daxilindəki <span class="hl-yellow">mətn rəngini</span> qırmızı edir. Rənglərin adlarını ingilis dilində daxil edirik: <span class="hl-purple">red</span>, <span class="hl-purple">blue</span>, <span class="hl-purple">green</span>, <span class="hl-purple">yellow</span>, <span class="hl-purple">purple</span> və s.</p>
      <p><span class="hl-red">Vacib Qayda:</span> Xüsusiyyət adından (color) sonra mütləq <span class="code-chip">:</span> (iki nöqtə), dəyərdən (rəngin adı) sonra isə <span class="code-chip">;</span> (nöqtəli vergül) yazılmalıdır.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">🏠 ANALOGİYA</span><span class="diagram-title">Eyni Ev, Fərqli Rəng</span></div>
        <p class="diagram-text">Eyni memarlıq strukturu (HTML), sadəcə CSS vasitəsilə fərqli rəng çalarlarına boyanır:</p>
        ${SVG.paintHouses}
      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilində bir <span class="code-chip">&lt;h1&gt;</span> yaz və <span class="code-chip">style="color: ..."</span> ilə mətni <strong>qırmızı (red)</strong> et.</p>`,
    starter: '<html>\n<body>\n  <h1 style="">Mənim Başlığım</h1>\n</body>\n</html>',
    errorMsg: 'h1 düzgün bağlanmalı, style="color: red" olmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('h1')) return false;
      const h1 = p.body.querySelector('h1');
      if (!h1) return false;
      const style = (h1.getAttribute('style') || '').replace(/\s/g, '').toLowerCase();
      return /color:red/.test(style);
    },
  },
  // ── LESSON 12 — font-size ─────────────────────────────────────────────────
  12: {
    module: 2, tag: 'CSS ilə Stil və Dizayn', indexLabel: '3.', title: 'Şrift Ölçüsü font-size',
    difficulty: 'ASAN', urlPath: 'ders-12',
    explanationHtml: `
      <p>Evdəki lövhə yazıları eyni ölçüdə olmur — qapı zənginin yanındakı yazı kiçikdir, evin nömrəsi isə böyük. CSS-də mətnin ölçüsünü <span class="code-chip">font-size</span> ilə idarə edirik.</p>
      <p>Ölçünü ən çox <span class="hl-yellow">piksel (px)</span> ilə yazırıq: <span class="code-chip">style="font-size: 30px;"</span> — rəqəm nə qədər böyükdürsə, mətn bir o qədər böyük görünür.</p>
      <p><span class="hl-red">Unutma:</span> rəqəmdən sonra <span class="code-chip">px</span> yazmağı unutma — yoxsa brauzer xüsusiyyəti başa düşməyəcək.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">📏 ANALOGİYA</span><span class="diagram-title">Kiçikdən Böyüyə</span></div>
        <p class="diagram-text">Eyni söz, fərqli font-size dəyəri ilə fərqli böyüklükdə görünür.</p>
        ${SVG.sizeSteps}
      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilində bir <span class="code-chip">&lt;p&gt;</span> yaz və <span class="code-chip">style="font-size: ..."</span> ilə mətnin ölçüsünü <strong>30px-dən böyük</strong> et.</p>`,
    starter: '<html>\n<body>\n  <p style="">Salam!</p>\n</body>\n</html>',
    errorMsg: 'p düzgün bağlanmalı, style="font-size: ...px" olmalı və 30px-dən böyük olmalıdır.',
    validate: (code) => {
  const p = parseBody(code);
  if (!p) return false;
  if (!p.balanced('p')) return false;
  const para = p.body.querySelector('p');
  if (!para) return false;
  const style = (para.getAttribute('style') || '').replace(/\s/g, '').toLowerCase();
  const m = style.match(/(?:^|;)font-size:(\d+)px(;|$)/);
  return !!m && Number(m[1]) > 30;
},
  },

  // ── LESSON 13 — text-align ───────────────────────────────────────────────
  13: {
    module: 2, tag: 'CSS ilə Stil və Dizayn', indexLabel: '4.', title: 'Mərkəzləşdirmə text-align',
    difficulty: 'ASAN', urlPath: 'ders-13',
    explanationHtml: `
      <p>Bir divardakı lövhəni düşün: yazını divarın sol tərəfinə, tam ortasına, ya da sağ tərəfinə yapışdıra bilərsən. CSS-də mətnin öz qutusu içində <span class="hl-yellow">harada dayanacağını</span> təyin etmək üçün <span class="code-chip">text-align</span> xüsusiyyətindən istifadə edirik.</p>
      <p>Üç əsas dəyəri var: <span class="hl-purple">left</span> (sol — standart hal), <span class="hl-purple">center</span> (tam orta) və <span class="hl-purple">right</span> (sağ). Yazılışı: <span class="code-chip">style="text-align: center;"</span>.</p>
      <p><span class="hl-red">Unutma:</span> <span class="code-chip">text-align</span> mətni qutunun <i>içində</i> sağa-sola oynadır, qutunun özünü yerindən tərpətmir.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">🖼️ ANALOGİYA</span><span class="diagram-title">Divardakı Lövhə</span></div>
        <p class="diagram-text">Eyni söz, eyni qutu — sadəcə qutunun içində fərqli yerdə dayanır.</p>
        ${SVG.alignBoxes}
      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilində bir <span class="code-chip">&lt;h1&gt;</span> yaz və <span class="code-chip">style="text-align: center;"</span> ilə onu ortaya gətir.</p>`,
    starter: '<html>\n<body>\n  <h1 style="">Mənim Başlığım</h1>\n</body>\n</html>',
    errorMsg: 'h1 düzgün bağlanmalı, style="text-align: center" olmalıdır.',
    validate: (code) => {
  const p = parseBody(code);
  if (!p) return false;
  if (!p.balanced('h1')) return false;
  const h1 = p.body.querySelector('h1');
  if (!h1) return false;
  const style = (h1.getAttribute('style') || '').replace(/\s/g, '').toLowerCase();
  return /(?:^|;)text-align:center(;|$)/.test(style);
},
  },

  // ── LESSON 14 — background-color ────────────────────────────────────────
  14: {
    module: 2, tag: 'CSS ilə Stil və Dizayn', indexLabel: '5.', title: 'Arxa Fon Rəngi background-color',
    difficulty: 'ASAN', urlPath: 'ders-14',
    explanationHtml: `
      <p>Bir vərəqdə iki fərqli rəng var: <span class="hl-yellow">mürəkkəbin rəngi</span> (yazının özü) və <span class="hl-yellow">kağızın rəngi</span> (yazının üstündə durduğu fon). İndiyə qədər öyrəndiyimiz <span class="code-chip">color</span> mürəkkəbi rəngləyirdi. Kağızı rəngləmək üçün isə başqa bir xüsusiyyət var: <span class="code-chip">background-color</span>.</p>
      <p>Yazılışı eynidir: <span class="code-chip">style="background-color: yellow;"</span> — bu, elementin arxasına sarı "kağız" qoyur, mətnin öz rəngi isə dəyişmir.</p>
      <p><span class="hl-red">Diqqət:</span> <span class="code-chip">color</span> ilə <span class="code-chip">background-color</span>-u qarışdırma! Biri mürəkkəb, o biri kağızdır — ikisini eyni anda da işlətmək olar.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">📄 ANALOGİYA</span><span class="diagram-title">Mürəkkəb və Kağız</span></div>
        <p class="diagram-text">Eyni qara mürəkkəb, üç fərqli rəngli kağızın üstündə.</p>
        ${SVG.bgSwap}
      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilində bir <span class="code-chip">&lt;p&gt;</span> yaz və <span class="code-chip">style="background-color: ..."</span> ilə arxa fonunu <strong>sarı (yellow)</strong> et.</p>`,
    starter: '<html>\n<body>\n  <p style="">Salam!</p>\n</body>\n</html>',
    errorMsg: 'p düzgün bağlanmalı, style="background-color: yellow" olmalıdır.',
    validate: (code) => {
  const p = parseBody(code);
  if (!p) return false;
  if (!p.balanced('p')) return false;
  const para = p.body.querySelector('p');
  if (!para) return false;
  const style = (para.getAttribute('style') || '').replace(/\s/g, '').toLowerCase();
  return /(?:^|;)background-color:yellow(;|$)/.test(style);
},
  },

  // ── LESSON 15 — padding ──────────────────────────────────────────────────
  15: {
    module: 2, tag: 'CSS ilə Stil və Dizayn', indexLabel: '6.', title: 'İçəri Boşluq padding',
    difficulty: 'ORTA', urlPath: 'ders-15',
    explanationHtml: `
      <p>Bir konfeti qutuya birbaşa atsan, tərpənə-tərpənə əzilər. Ona görə qutunun içinə yumşaq pambıq qoyulur ki, konfet rahat otursun. CSS-də bu "pambıq" rolunu <span class="code-chip">padding</span> oynayır — mətnlə qutunun kənarı arasındakı <span class="hl-yellow">iç boşluqdur</span>.</p>
      <p>Yazılışı: <span class="code-chip">style="padding: 20px;"</span> — bu, mətnlə qutunun divarları arasına hər tərəfdən 20 piksel boşluq qoyur.</p>
      <p><span class="hl-red">Fərq:</span> <span class="code-chip">padding</span> qutunun içindəki boşluqdur. Qutunun özü ilə digər elementlər arasındakı boşluğun adı isə fərqlidir — onu növbəti dərsdə öyrənəcəyik.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">🍬 ANALOGİYA</span><span class="diagram-title">Qutudakı Pambıq</span></div>
        <p class="diagram-text">padding mətnlə qutunun kənarı arasındakı yumşaq boşluqdur.</p>
        ${SVG.paddingOnly}
      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilində bir <span class="code-chip">&lt;p&gt;</span> yaz və <span class="code-chip">style="padding: ..."</span> ilə ona <strong>0-dan böyük</strong> iç boşluq ver.</p>`,
    starter: '<html>\n<body>\n  <p style="">Mətnim</p>\n</body>\n</html>',
    errorMsg: 'p düzgün bağlanmalı, style="padding: Npx;" formasında və N 0-dan böyük olmalıdır.',
    validate: (code) => {
  const p = parseBody(code);
  if (!p) return false;
  if (!p.balanced('p')) return false;
  const para = p.body.querySelector('p');
  if (!para) return false;
  const style = (para.getAttribute('style') || '').replace(/\s/g, '').toLowerCase();
  const m = style.match(/(?:^|;)padding:(\d+)px(;|$)/);
  return !!m && Number(m[1]) > 0;
},
  },

  // ── LESSON 16 — margin ───────────────────────────────────────────────────
  16: {
    module: 2, tag: 'CSS ilə Stil və Dizayn', indexLabel: '7.', title: 'Çöl Boşluq margin',
    difficulty: 'ORTA', urlPath: 'ders-16',
    explanationHtml: `
      <p>Rəfdə iki qutunu yan-yana qoyanda, bir-birinə söykənməsinlər deyə aralarında bir az yer buraxırsan. CSS-də bu "aralıq" rolunu <span class="code-chip">margin</span> oynayır — qutunun <span class="hl-yellow">özü ilə ətrafındakı digər elementlər</span> arasındakı boşluqdur.</p>
      <p>Yazılışı eyni məntiqlədir: <span class="code-chip">style="margin: 20px;"</span> — bu, qutunun ətrafına hər tərəfdən 20 piksel boş yer qoyur ki, digər elementlərə yapışmasın.</p>
      <p><span class="hl-red">Yadda saxla:</span> <span class="hl-purple">padding</span> = qutunun içi, <span class="hl-purple">margin</span> = qutunun çölü. Sözü ilə "pambıq daxildə, aralıq xaricdə" kimi yadda saxlaya bilərsən.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">📦 ANALOGİYA</span><span class="diagram-title">Rəfdəki Qutular</span></div>
        <p class="diagram-text">margin iki qutu arasındakı aralıq məsafəsidir.</p>
        ${SVG.marginOnly}
      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilində bir <span class="code-chip">&lt;p&gt;</span> yaz və <span class="code-chip">style="margin: ..."</span> ilə ona <strong>0-dan böyük</strong> çöl boşluq ver.</p>`,
    starter: '<html>\n<body>\n  <p style="">Mətnim</p>\n</body>\n</html>',
    errorMsg: 'p düzgün bağlanmalı, style="margin: Npx;" formasında və N 0-dan böyük olmalıdır.',
    validate: (code) => {
  const p = parseBody(code);
  if (!p) return false;
  if (!p.balanced('p')) return false;
  const para = p.body.querySelector('p');
  if (!para) return false;
  const style = (para.getAttribute('style') || '').replace(/\s/g, '').toLowerCase();
  const m = style.match(/(?:^|;)margin:(\d+)px(;|$)/);
  return !!m && Number(m[1]) > 0;
},
  },

  // ── LESSON 17 — border ───────────────────────────────────────────────────
  17: {
    module: 2, tag: 'CSS ilə Stil və Dizayn', indexLabel: '8.', title: 'Haşiyə border',
    difficulty: 'ASAN', urlPath: 'ders-17',
    explanationHtml: `
      <p>Şəklin ətrafına çərçivə taxmaq kimi, HTML elementinin ətrafına da xətt çəkmək olar — buna <span class="code-chip">border</span> deyilir.</p>
      <p>Border üç hissədən ibarətdir, hamısı bir sətirdə yazılır: <span class="hl-yellow">qalınlıq</span> (məs. <span class="code-chip">2px</span>), <span class="hl-yellow">növ</span> (məs. <span class="code-chip">solid</span> — düz xətt), <span class="hl-yellow">rəng</span> (məs. <span class="code-chip">black</span>).</p>
      <p>Tam yazılışı: <span class="code-chip">style="border: 2px solid black;"</span> Bu stil yazının ətrafına 2 piksel qalınlıqda qara rəngli düz çərçivə əlavə edir.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">🖼️ ANALOGİYA</span><span class="diagram-title">Şəkil Çərçivəsi</span></div>
        <p class="diagram-text">border elementin ətrafına çəkilən görünən xəttdir.</p>
        ${SVG.borderBox}
      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilində bir <span class="code-chip">&lt;p&gt;</span> yaz və <span class="code-chip">style="border: ...px solid ...;"</span> ilə ona border əlavə et.</p>`,
    starter: '<html>\n<body>\n  <p style="">Mətnim</p>\n</body>\n</html>',
    errorMsg: 'p düzgün bağlanmalı, style="border: Npx solid rəng;" formasında olmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('p')) return false;
      const para = p.body.querySelector('p');
      if (!para) return false;
      const style = (para.getAttribute('style') || '').replace(/\s/g, '').toLowerCase();
      return /border:\d+pxsolid[a-z]+/.test(style);
    },
  },
  // ── LESSON 18 — Combined Task (Module 2 Review) ─────────────────────────
  18: {
    module: 2, tag: 'CSS ilə Stil və Dizayn', indexLabel: '9.', title: 'Böyük Tapşırıq: Otaq Dizaynı',
    difficulty: 'ÇƏTİN', urlPath: 'ders-18',
    explanationHtml: `
      <p>İndiyə qədər <span class="hl-purple">8 fərqli CSS xüsusiyyəti</span> öyrəndin. İndi hamısını birləşdirib öz otağını dizayn edəcəksən — divar, mebel və hər şeyi öz zövqünə uyğun rəngləyəcəksən!</p>
      <p>Aşağıdakı bütün şərtlər yerinə yetirilməlidir:</p>
      <ul style="margin:8px 0; padding-left:20px; line-height:1.8;">
        <li><span class="code-chip">&lt;div&gt;</span> daxilində bir <span class="code-chip">&lt;h1&gt;</span> və bir <span class="code-chip">&lt;p&gt;</span> olsun</li>
        <li><span class="code-chip">&lt;h1&gt;</span>: <span class="code-chip">color</span> təyin olunsun və <span class="code-chip">text-align: center;</span> olsun</li>
        <li><span class="code-chip">&lt;p&gt;</span>: <span class="code-chip">font-size</span> 20px-dən böyük olsun</li>
        <li><span class="code-chip">&lt;p&gt;</span>: <span class="code-chip">background-color</span> təyin olunsun</li>
        <li><span class="code-chip">&lt;p&gt;</span>: <span class="code-chip">padding</span> və <span class="code-chip">margin</span> 0-dan böyük olsun</li>
        <li><span class="code-chip">&lt;p&gt;</span>: <span class="code-chip">border</span> (qalınlıq + solid + rəng) olsun</li>
      </ul>
      <p><span class="hl-red">Unutma:</span> hər <span class="code-chip">style</span> daxilindəki xüsusiyyətlər <span class="code-chip">;</span> ilə ayrılmalıdır.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">🛋️ NÜMUNƏ</span><span class="diagram-title">Dizayn Edilmiş Otaq</span></div>
        <p class="diagram-text">Başlıq ortada və rəngli, mətn isə öz çərçivəsi, fonu və boşluqları ilə.</p>
        <div style="background:#25262b;border:1px solid #373a40;border-radius:8px;padding:15px;">
          <div style="background:#fff;border-radius:6px;padding:20px;">
            <h1 style="text-align:center;color:purple;font-family:sans-serif;margin:0 0 12px 0;">Mənim Otağım</h1>
            <p style="font-size:22px;background-color:yellow;padding:16px;margin:10px;border:3px solid black;font-family:sans-serif;color:#1a1a1a;">Burada rahatam!</p>
          </div>
        </div>
      </div>
    `,
    taskHtml: `<p>Yuxarıdakı nümunə kimi <strong>bütün şərtləri</strong> yerinə yetirən öz dizaynını qur, sonra <strong>RUN</strong> et.</p>`,
    starter: '<html>\n<body>\n  <div>\n    <h1 style="">Mənim Otağım</h1>\n    <p style="">Burada rahatam!</p>\n  </div>\n</body>\n</html>',
    errorMsg: 'div içində h1 (color + text-align:center) və p (font-size>20px, background-color, padding>0, margin>0, border) olmalıdır.',
    chests: [
      { cost: 1, hint: 'h1 üçün <span class="code-chip">style="color: purple; text-align: center;"</span> istifadə et.', code: null },
      { cost: 2, hint: 'p üçün <span class="code-chip">font-size</span>, <span class="code-chip">background-color</span>, <span class="code-chip">padding</span>, <span class="code-chip">margin</span> xüsusiyyətlərini nöqtəli vergüllə ayır.', code: null },
      { cost: 3, hint: 'p-nin border-u: <span class="code-chip">border: 3px solid black;</span>', code: 'border: 3px solid black;"' },
    ],
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('div') || !p.balanced('h1') || !p.balanced('p')) return false;

      const div = p.body.querySelector('div');
      if (!div) return false;

      const h1 = div.querySelector('h1');
      if (!h1) return false;
      const h1Style = (h1.getAttribute('style') || '').replace(/\s/g, '').toLowerCase();
      if (!/(?:^|;)color:[a-z]+(;|$)/.test(h1Style)) return false;
      if (!/(?:^|;)text-align:center(;|$)/.test(h1Style)) return false;

      const para = div.querySelector('p');
      if (!para) return false;
      const pStyle = (para.getAttribute('style') || '').replace(/\s/g, '').toLowerCase();

      const fontSize = pStyle.match(/(?:^|;)font-size:(\d+)px(;|$)/);
      if (!fontSize || Number(fontSize[1]) <= 20) return false;

      if (!/(?:^|;)background(-color)?:[a-z]+(;|$)/.test(pStyle)) return false;

      const padding = pStyle.match(/(?:^|;)padding:(\d+)px(;|$)/);
      if (!padding || Number(padding[1]) <= 0) return false;

      const margin = pStyle.match(/(?:^|;)margin:(\d+)px(;|$)/);
      if (!margin || Number(margin[1]) <= 0) return false;

      const borderStyle = pStyle.match(/(?:^|;)border:([a-z0-9]+)(;|$)/);
if (!borderStyle) return false;
const borderParts = pStyle.split(';').find(s => s.startsWith('border:'))?.slice(7) || '';
const hasWidth = /\d+px/.test(borderParts);
const hasSolid = /solid/.test(borderParts);
const hasColor = /black/.test(borderParts); // or a color list if you want to allow any color
if (!hasWidth || !hasSolid || !hasColor) return false;
      return true;
    },
  },
};