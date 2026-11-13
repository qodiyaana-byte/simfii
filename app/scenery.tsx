import type { ReactNode } from "react";

type P = { x: number; y: number; s?: number };
const shadow = (rx: number) => <ellipse cx="0" cy="4" rx={rx} ry="9" fill="#0003" />;

/* ===== DEKORASI ===== */
export const Tree = ({ x, y, s = 1 }: P) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {shadow(30)}
    <rect x="-6" y="-34" width="12" height="38" rx="3" fill="#8a5a2b" />
    <circle cx="0" cy="-58" r="28" fill="#2f9e44" /><circle cx="-19" cy="-44" r="20" fill="#37b24d" />
    <circle cx="19" cy="-44" r="20" fill="#37b24d" /><circle cx="-7" cy="-68" r="11" fill="#8ce99a" opacity=".75" />
  </g>
);
export const Pine = ({ x, y, s = 1 }: P) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {shadow(22)}<rect x="-5" y="-18" width="10" height="22" fill="#7b4f28" />
    <polygon points="-28,-14 0,-62 28,-14" fill="#2b8a3e" /><polygon points="-22,-44 0,-86 22,-44" fill="#37b24d" /><polygon points="-15,-72 0,-106 15,-72" fill="#51cf66" />
  </g>
);
export const Bush = ({ x, y, s = 1 }: P) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><circle cx="-12" cy="-10" r="14" fill="#2f9e44" /><circle cx="8" cy="-12" r="16" fill="#40c057" /><circle cx="22" cy="-6" r="11" fill="#37b24d" /></g>
);
export const Flower = ({ x, y, c = "#ff6b9d" }: { x: number; y: number; c?: string }) => (
  <g transform={`translate(${x} ${y})`}><rect x="-1" y="-2" width="2" height="12" fill="#2f9e44" />
    {[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 5} cy={-6 + Math.sin((a * Math.PI) / 180) * 5} r="3.4" fill={c} />)}
    <circle cx="0" cy="-6" r="2.6" fill="#ffd43b" /></g>
);
export const Mushroom = ({ x, y, s = 1 }: P) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><rect x="-4" y="-10" width="8" height="12" rx="3" fill="#fff4e6" />
    <path d="M-14 -10 Q0 -32 14 -10 Z" fill="#e03131" /><circle cx="-4" cy="-18" r="2.4" fill="#fff" /><circle cx="5" cy="-15" r="2" fill="#fff" /></g>
);
export const Rock = ({ x, y, s = 1 }: P) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><ellipse cx="0" cy="0" rx="20" ry="12" fill="#adb5bd" /><ellipse cx="-4" cy="-4" rx="12" ry="6" fill="#ced4da" /></g>
);
export const Fence = ({ x, y, n = 4, c = "#e8d5a9" }: { x: number; y: number; n?: number; c?: string }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="-6" y="-22" width={n * 24 + 4} height="5" rx="2" fill={c} /><rect x="-6" y="-10" width={n * 24 + 4} height="5" rx="2" fill={c} />
    {Array.from({ length: n + 1 }).map((_, i) => <rect key={i} x={i * 24 - 5} y="-28" width="9" height="32" rx="3" fill={c} stroke="#0002" />)}
  </g>
);
export const Cloud = ({ x, y, s = 1 }: P) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><ellipse cx="0" cy="0" rx="46" ry="18" fill="#fff" /><circle cx="-18" cy="-14" r="18" fill="#fff" /><circle cx="14" cy="-20" r="22" fill="#fff" /><ellipse cx="28" cy="2" rx="28" ry="14" fill="#fff" /></g>
);
export const Chicken = ({ x, y, s = 1 }: P) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>{shadow(16)}
    <ellipse cx="0" cy="-14" rx="15" ry="12" fill="#fff" stroke="#0002" /><circle cx="11" cy="-27" r="8" fill="#fff" stroke="#0002" />
    <path d="M8 -36 q3 -7 6 0 q3 -6 5 1z" fill="#e03131" /><polygon points="18,-27 25,-25 18,-22" fill="#f59f00" /><circle cx="13" cy="-28" r="1.6" fill="#222" />
    <path d="M-14 -18 q-9 -4 -7 -14 q8 4 9 12z" fill="#f1f3f5" stroke="#0002" /><path d="M-3 -2v6M5 -2v6" stroke="#f59f00" strokeWidth="2.4" strokeLinecap="round" /></g>
);
export const Pond = ({ x, y, s = 1 }: P) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="0" cy="0" rx="98" ry="38" fill="#e9d8a6" /><ellipse cx="0" cy="0" rx="86" ry="30" fill="#4dabf7" /><ellipse cx="-14" cy="4" rx="46" ry="12" fill="#74c0fc" />
    <rect x="-8" y="-24" width="16" height="22" rx="4" fill="#ced4da" /><ellipse cx="0" cy="-24" rx="16" ry="6" fill="#e9ecef" />
    <path d="M0 -26 q-16 -28 -26 -8 M0 -26 q16 -28 26 -8 M0 -26 v-22" stroke="#d0ebff" strokeWidth="4" fill="none" strokeLinecap="round" />
    <Flower x={-72} y={-14} c="#ffd43b" /><Flower x={70} y={-12} />
  </g>
);

/* ===== BANGUNAN ===== */
type B = P & { wall?: string; roof?: string; roofDark?: string; door?: string; children?: ReactNode };
const win = (x: number, y: number, shutter: string) => (
  <g>
    <rect x={x - 7} y={y} width="6" height="22" rx="2" fill={shutter} /><rect x={x + 22} y={y} width="6" height="22" rx="2" fill={shutter} />
    <rect x={x} y={y} width="21" height="22" rx="3" fill="#a5d8ff" stroke="#fff" strokeWidth="3" /><path d={`M${x + 10.5} ${y}v22M${x} ${y + 11}h21`} stroke="#fff" strokeWidth="2" />
    <rect x={x - 3} y={y + 22} width="27" height="7" rx="2" fill="#8a5a2b" /><circle cx={x + 3} cy={y + 22} r="3" fill="#ff6b9d" /><circle cx={x + 11} cy={y + 21} r="3" fill="#ffd43b" /><circle cx={x + 19} cy={y + 22} r="3" fill="#ff8787" />
  </g>
);
export const House = ({ x, y, s = 1, wall = "#fbe9c6", roof = "#d9483b", roofDark = "#a8302b", door = "#8b5a2b", children }: B) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {shadow(72)}
    <rect x="-54" y="-64" width="108" height="64" rx="4" fill={wall} stroke="#0002" strokeWidth="2" />
    <rect x="-54" y="-12" width="108" height="12" rx="2" fill="#b79f78" opacity=".55" />
    <rect x="26" y="-108" width="14" height="32" fill="#a0522d" /><rect x="23" y="-112" width="20" height="7" rx="2" fill="#8a4222" />
    <polygon points="-72,-58 0,-118 72,-58" fill={roof} stroke="#0003" strokeWidth="2" />
    <polygon points="-72,-58 72,-58 66,-47 -66,-47" fill={roofDark} />
    <path d="M-54 -70 L54 -70 M-40 -82 L40 -82 M-26 -94 L26 -94 M-12 -106 L12 -106" stroke="#00000022" strokeWidth="2" />
    <rect x="-11" y="-40" width="22" height="40" rx="11" fill={door} stroke="#0003" /><circle cx="5" cy="-18" r="2.2" fill="#ffd43b" />
    <rect x="-16" y="-3" width="32" height="5" rx="2" fill="#cfc4a8" />
    {win(-44, -52, roofDark)}{win(24, -52, roofDark)}
    {children}
  </g>
);
export const Tower = ({ x, y, s = 1 }: P) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {shadow(52)}
    <rect x="-34" y="-120" width="68" height="120" fill="#ead9bb" stroke="#0002" strokeWidth="2" />
    <rect x="-42" y="-132" width="84" height="16" fill="#cdb891" stroke="#0002" />
    {[-36, -18, 0, 18, 32].map((bx) => <rect key={bx} x={bx - 4} y="-144" width="10" height="14" fill="#cdb891" stroke="#0002" />)}
    <polygon points="-30,-132 0,-190 30,-132" fill="#00a38c" stroke="#0003" strokeWidth="2" />
    <rect x="-1.5" y="-228" width="3" height="40" fill="#6b4c2a" /><polygon points="1.5,-228 28,-218 1.5,-208" fill="#ff5252" />
    <circle cx="0" cy="-92" r="14" fill="#fff" stroke="#0003" strokeWidth="3" /><path d="M0 -92v-9M0 -92l7 4" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M-8 -52 a8 8 0 0 1 16 0v14h-16z" fill="#4dabf7" stroke="#fff" strokeWidth="2" />
    <rect x="-13" y="-34" width="26" height="34" rx="13" fill="#7b4f28" />
  </g>
);
export const Hall = ({ x, y, s = 1 }: P) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {shadow(84)}
    <rect x="-72" y="-6" width="144" height="10" rx="3" fill="#dee2e6" /><rect x="-64" y="-14" width="128" height="10" rx="3" fill="#e9ecef" />
    <rect x="-58" y="-80" width="116" height="66" fill="#fff8e1" stroke="#0002" strokeWidth="2" />
    {[-46, -16, 16, 46].map((cx) => <rect key={cx} x={cx - 5} y="-78" width="10" height="64" fill="#fff" stroke="#0002" />)}
    <polygon points="-70,-80 0,-124 70,-80" fill="#f2b01e" stroke="#0003" strokeWidth="2" />
    <polygon points="-52,-84 0,-116 52,-84" fill="#ffd54f" />
    <path d="M0 -118 l5 11 12 2 -9 8 2 12 -10 -6 -10 6 2 -12 -9 -8 12 -2z" fill="#fff3a8" stroke="#e08a00" strokeWidth="2" transform="translate(0 6)" />
    <rect x="-12" y="-46" width="24" height="32" rx="12" fill="#c2255c" />
  </g>
);

/* ===== BANGUNAN PETA: pos 1-6 ===== */
export function Building({ id, x, y }: { id: number; x: number; y: number }) {
  switch (id) {
    case 1: return <House x={x} y={y} roof="#d9483b" roofDark="#a8302b" />;
    case 2: return <House x={x} y={y} wall="#f5ead2" roof="#2f6fba" roofDark="#1f4f8a" door="#7b4f28" />;
    case 3: return <House x={x} y={y} wall="#f1ecd6" roof="#3b8c4f" roofDark="#27663a"><g transform="translate(0 -128)"><circle r="19" fill="#fff" stroke="#8e44ad" strokeWidth="4" /><text y="7" textAnchor="middle" fontSize="20">🗺️</text></g></House>;
    case 4: return <House x={x} y={y} wall="#f3e8d8" roof="#7b4fb0" roofDark="#573582"><g transform="translate(0 -128)"><circle r="14" fill="#fff" stroke="#e03a5a" strokeWidth="5" /><path d="M10 10l14 14" stroke="#e03a5a" strokeWidth="6" strokeLinecap="round" /></g></House>;
    case 5: return <Tower x={x} y={y} />;
    default: return <Hall x={x} y={y} />;
  }
}

/* ===== PETA DESA (1000 x 700) ===== */
export type PinStatus = "locked" | "open" | "done" | "next";
const spots = [
  { id: 1, x: 170, y: 500 }, { id: 2, x: 320, y: 320 }, { id: 3, x: 520, y: 510 },
  { id: 4, x: 660, y: 310 }, { id: 5, x: 800, y: 490 }, { id: 6, x: 905, y: 330 },
];
const pathD = "M170 505 C225 420 260 345 320 325 S450 490 520 512 S600 335 660 315 S745 470 800 492 S880 345 905 335";
const riverD = "M395 100 C330 200 450 270 410 360 S350 610 430 740";

export function MapScene({ status }: { status: Record<number, PinStatus> }) {
  const top = spots.filter((s) => s.y < 420), bottom = spots.filter((s) => s.y >= 420);
  const bld = (s: { id: number; x: number; y: number }) => <g key={s.id} className={`bld ${status[s.id] === "locked" ? "bld-locked" : ""}`}><Building id={s.id} x={s.x} y={s.y} /></g>;
  return (
    <svg className="scene-svg" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="mgrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a6e86a" /><stop offset="1" stopColor="#5fc34f" /></linearGradient>
        <linearGradient id="msky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6fcbff" /><stop offset="1" stopColor="#d6f3ff" /></linearGradient>
        <pattern id="mdots" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="8" cy="10" r="2.4" fill="#ffffff35" /><circle cx="28" cy="30" r="2" fill="#2b8a3e22" /></pattern>
      </defs>
      <rect width="1000" height="700" fill="url(#mgrass)" /><rect width="1000" height="700" fill="url(#mdots)" />
      <ellipse cx="170" cy="250" rx="180" ry="90" fill="#b9f07f" opacity=".55" /><ellipse cx="860" cy="600" rx="190" ry="100" fill="#b9f07f" opacity=".5" />
      {/* sungai */}
      <path d={riverD} fill="none" stroke="#f1deb0" strokeWidth="96" strokeLinecap="round" />
      <path d={riverD} fill="none" stroke="#339af0" strokeWidth="74" strokeLinecap="round" />
      <path className="river-flow" d={riverD} fill="none" stroke="#74c0fc" strokeWidth="52" strokeLinecap="round" strokeDasharray="30 40" />
      {/* cakrawala: langit dan pegunungan */}
      <rect width="1000" height="130" fill="url(#msky)" />
      <polygon points="0,130 0,70 90,20 170,78 250,36 340,100 420,50 520,110 620,40 720,96 810,30 900,84 1000,50 1000,130" fill="#8fb1d6" />
      <polygon points="0,130 0,96 110,56 200,104 300,70 400,118 520,84 640,120 760,70 880,112 1000,86 1000,130" fill="#6f98c4" />
      <polygon points="90,20 74,40 90,34 104,42" fill="#fff" opacity=".9" /><polygon points="810,30 794,52 810,44 826,54" fill="#fff" opacity=".9" />
      <path d="M0 150 Q120 118 250 140 T500 130 T760 142 T1000 126 V170 H0Z" fill="#7fd45c" />
      <Cloud x={520} y={40} s={.7} /><Cloud x={900} y={30} s={.6} />
      {/* jalan */}
      <path d={pathD} fill="none" stroke="#b98a45" strokeWidth="46" strokeLinecap="round" strokeLinejoin="round" />
      <path d={pathD} fill="none" stroke="#f3d99b" strokeWidth="34" strokeLinecap="round" strokeLinejoin="round" />
      <path d={pathD} fill="none" stroke="#fff8e1" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 22" opacity=".9" />
      {/* jembatan */}
      <g transform="translate(405 402) rotate(22)">
        <rect x="-62" y="-30" width="124" height="60" rx="6" fill="#a9743b" stroke="#6b4a24" strokeWidth="3" />
        {[-48, -32, -16, 0, 16, 32, 48].map((px) => <rect key={px} x={px - 6} y="-27" width="12" height="54" rx="2" fill="#d19a5b" stroke="#8a5a2b" />)}
        <rect x="-66" y="-36" width="132" height="8" rx="3" fill="#8a5a2b" /><rect x="-66" y="28" width="132" height="8" rx="3" fill="#8a5a2b" />
      </g>
      {/* dekorasi belakang */}
      <Tree x={45} y={250} s={1.2} /><Pine x={110} y={215} /><Tree x={230} y={215} s={.9} /><Pine x={345} y={225} s={.9} /><Tree x={555} y={210} s={1} /><Pine x={610} y={185} />
      <Tree x={760} y={205} s={1.1} /><Pine x={820} y={180} s={.9} /><Pine x={968} y={210} s={1.1} /><Tree x={965} y={440} s={1.1} /><Pine x={45} y={400} s={1.1} />
      <Rock x={560} y={290} /><Flower x={240} y={400} /><Flower x={255} y={408} c="#ffd43b" /><Flower x={735} y={300} c="#ffffff" /><Flower x={750} y={308} />
      {top.map(bld)}
      <Fence x={225} y={552} n={2} /><Bush x={60} y={520} /><Mushroom x={72} y={548} /><Mushroom x={86} y={554} s={.7} /><Chicken x={300} y={552} s={.9} />
      <Flower x={270} y={445} /><Flower x={286} y={453} c="#ffd43b" /><Flower x={620} y={440} /><Flower x={640} y={450} c="#fff" /><Bush x={700} y={440} s={.9} />
      {bottom.map(bld)}
      <Pond x={600} y={640} s={.85} />
      <Pine x={955} y={560} s={.9} /><Tree x={925} y={600} s={.9} /><Bush x={700} y={560} s={.9} /><Flower x={745} y={600} /><Flower x={760} y={608} c="#ffd43b" /><Mushroom x={470} y={600} />
    </svg>
  );
}

/* ===== HALAMAN AWAL: KARAKTER DETEKTIF + RUMAH (1000 x 600) ===== */
function Detective() {
  const coat = "#c99a5b", coatD = "#a97b3f";
  return (
    <g className="char" transform="translate(18 150) scale(1.07)">
      <ellipse cx="150" cy="418" rx="130" ry="14" fill="#0002" />
      <rect x="30" y="200" width="70" height="150" rx="26" fill="#7b4f28" stroke="#4e3015" strokeWidth="4" />
      <rect x="95" y="378" width="42" height="42" rx="8" fill="#6b4a2f" /><rect x="163" y="378" width="42" height="42" rx="8" fill="#6b4a2f" />
      <path d="M62 214 Q150 190 238 214 L260 384 L40 384 Z" fill={coat} stroke="#5b3a1e" strokeWidth="4" />
      <polygon points="128,204 172,204 150,312" fill="#fffaf0" /><polygon points="128,204 150,312 110,236" fill={coatD} /><polygon points="172,204 150,312 190,236" fill={coatD} />
      <rect x="44" y="330" width="212" height="20" fill="#5b3a1e" /><rect x="139" y="327" width="24" height="26" rx="4" fill="#e9b949" stroke="#5b3a1e" strokeWidth="3" />
      <circle cx="150" cy="262" r="5" fill="#5b3a1e" /><circle cx="150" cy="290" r="5" fill="#5b3a1e" />
      <path d="M96 212 L118 372" stroke="#5b3a1e" strokeWidth="14" strokeLinecap="round" />
      <path d="M72 236 Q40 290 82 330" fill="none" stroke={coat} strokeWidth="32" strokeLinecap="round" /><circle cx="86" cy="332" r="17" fill="#ffd8b5" stroke="#5b3a1e" strokeWidth="3" />
      <path d="M232 232 L272 176" stroke={coat} strokeWidth="34" strokeLinecap="round" />
      <circle cx="318" cy="102" r="44" fill="#cfeeff" opacity=".92" stroke="#6b4423" strokeWidth="10" /><path d="M296 82 q12 -14 30 -10" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M290 136 L270 168" stroke="#6b4423" strokeWidth="12" strokeLinecap="round" /><circle cx="270" cy="172" r="19" fill="#ffd8b5" stroke="#5b3a1e" strokeWidth="3" />
      <rect x="132" y="176" width="36" height="34" rx="12" fill="#ffd8b5" />
      <circle cx="150" cy="128" r="80" fill="#ffd8b5" stroke="#5b3a1e" strokeWidth="4" /><circle cx="70" cy="136" r="14" fill="#ffd8b5" stroke="#5b3a1e" strokeWidth="3" /><circle cx="230" cy="136" r="14" fill="#ffd8b5" stroke="#5b3a1e" strokeWidth="3" />
      <path d="M76 120 Q100 154 128 132 Q150 156 172 132 Q200 154 226 120 L226 104 Q150 92 76 104 Z" fill="#4a2b1a" />
      <path d="M60 112 C58 36 108 12 160 12 C216 12 246 58 242 112 Z" fill="#d6a65f" stroke="#5b3a1e" strokeWidth="4" />
      <path d="M90 22 L70 112 M130 14 L112 112 M170 12 L160 112 M210 24 L206 112" stroke="#9c6a2b" strokeWidth="3" opacity=".55" /><path d="M64 70 H240 M62 92 H242" stroke="#9c6a2b" strokeWidth="3" opacity=".45" />
      <path d="M46 112 Q150 90 254 112 L248 130 Q150 112 52 130 Z" fill="#b97f3d" stroke="#5b3a1e" strokeWidth="4" /><circle cx="152" cy="14" r="8" fill="#b97f3d" stroke="#5b3a1e" strokeWidth="3" />
      <ellipse cx="118" cy="168" rx="14" ry="18" fill="#4a2b1a" /><ellipse cx="184" cy="168" rx="14" ry="18" fill="#4a2b1a" />
      <circle cx="123" cy="160" r="5" fill="#fff" /><circle cx="189" cy="160" r="5" fill="#fff" /><circle cx="113" cy="176" r="2.6" fill="#fff" /><circle cx="179" cy="176" r="2.6" fill="#fff" />
      <path d="M98 148 Q118 140 136 146 M166 146 Q184 140 204 148" stroke="#4a2b1a" strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="96" cy="192" r="11" fill="#ff9a9a" opacity=".5" /><circle cx="206" cy="192" r="11" fill="#ff9a9a" opacity=".5" />
      <path d="M128 198 Q151 228 174 198 Z" fill="#7a2e2e" stroke="#4a2b1a" strokeWidth="3" strokeLinejoin="round" /><ellipse cx="151" cy="215" rx="11" ry="6" fill="#ff8a9a" />
      <path d="M146 184 q5 4 10 0" stroke="#c98b6a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
}
function BigHouse({ x, y, s = 1 }: P) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {shadow(130)}
      <rect x="-110" y="-120" width="220" height="120" fill="#f7ead0" stroke="#0002" strokeWidth="3" />
      <polygon points="-130,-114 0,-210 130,-114" fill="#e8873a" stroke="#0003" strokeWidth="3" /><polygon points="-130,-114 130,-114 122,-98 -122,-98" fill="#c96a24" />
      <path d="M-60 -116 L0 -180 L60 -116" fill="none" stroke="#00000022" strokeWidth="3" />
      <path d="M-18 -140 a18 22 0 0 1 36 0v30h-36z" fill="#7bbcd8" stroke="#fff" strokeWidth="4" /><path d="M0 -162v52" stroke="#fff" strokeWidth="3" />
      {[-84, 54].map((wx) => <g key={wx}><path d={`M${wx} -34 v-32 a15 18 0 0 1 30 0 v32z`} fill="#7bbcd8" stroke="#fff" strokeWidth="4" /><path d={`M${wx + 15} -34 v-50 M${wx} -58 h30`} stroke="#fff" strokeWidth="2.5" /></g>)}
      <path d="M-30 0 v-62 a30 34 0 0 1 60 0 v62z" fill="#8b5a2b" stroke="#5b3a1e" strokeWidth="4" /><path d="M0 -92 V0" stroke="#5b3a1e" strokeWidth="3" /><circle cx="-8" cy="-34" r="3" fill="#ffd43b" /><circle cx="8" cy="-34" r="3" fill="#ffd43b" />
      <rect x="-48" y="-4" width="96" height="8" fill="#d9d2c0" /><rect x="-58" y="4" width="116" height="8" fill="#cfc7b2" />
    </g>
  );
}
export function StartScene() {
  return (
    <svg className="scene-svg" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="ssky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bfe9fb" /><stop offset="1" stopColor="#f3fbf4" /></linearGradient>
      </defs>
      <rect width="1000" height="600" fill="url(#ssky)" />
      <Cloud x={250} y={80} s={1.2} /><Cloud x={640} y={60} s={.9} /><Cloud x={900} y={120} s={.8} />
      <ellipse cx="500" cy="330" rx="560" ry="110" fill="#bfe3a4" /><ellipse cx="500" cy="400" rx="620" ry="130" fill="#a9d98a" />
      {[[120, 300], [210, 280], [330, 310], [560, 295], [700, 300], [930, 290]].map(([tx, ty]) => <g key={`${tx}${ty}`}><rect x={tx - 5} y={ty - 20} width="10" height="40" fill="#8d6a3e" /><circle cx={tx} cy={ty - 38} r="36" fill="#7cc36b" /><circle cx={tx - 20} cy={ty - 22} r="22" fill="#8fd47c" /></g>)}
      <ellipse cx="560" cy="540" rx="420" ry="120" fill="#f3dfb2" /><ellipse cx="560" cy="560" rx="360" ry="90" fill="#f8e9c4" />
      <BigHouse x={880} y={470} s={1.15} />
      <Fence x={650} y={500} n={4} c="#d9b98a" /><Fence x={940} y={600} n={2} c="#c99c64" />
      <Bush x={780} y={560} s={1.6} /><Bush x={600} y={585} s={1.5} /><Bush x={940} y={540} s={1.3} /><Bush x={420} y={575} s={1.7} />
      <g><path d="M-10 -10 L330 -10 C300 40 230 60 170 40 C100 80 30 70 -10 120Z" fill="#6eb45e" /><circle cx="60" cy="20" r="80" fill="#7cc36b" /><circle cx="210" cy="-10" r="70" fill="#8fd47c" /><path d="M-10 0 C60 60 110 40 190 30" stroke="#8a5a2b" strokeWidth="14" fill="none" strokeLinecap="round" /></g>
      <Detective />
      <Bush x={40} y={600} s={2.2} /><Bush x={170} y={612} s={2} />
      <Flower x={470} y={590} /><Flower x={490} y={598} c="#ffd43b" />
    </svg>
  );
}
