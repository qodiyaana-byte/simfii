import type { ReactNode } from "react";

type P = { x: number; y: number; s?: number };
type B = P & { wall?: string; roof?: string; door?: string };
const shadow = (rx: number) => <ellipse cx="0" cy="4" rx={rx} ry="9" fill="#0003" />;

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
export const Fence = ({ x, y, n = 4 }: { x: number; y: number; n?: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="-6" y="-22" width={n * 24 + 4} height="5" rx="2" fill="#f1e4c8" /><rect x="-6" y="-10" width={n * 24 + 4} height="5" rx="2" fill="#f1e4c8" />
    {Array.from({ length: n + 1 }).map((_, i) => <rect key={i} x={i * 24 - 5} y="-28" width="9" height="32" rx="3" fill="#e8d5a9" stroke="#0002" />)}
  </g>
);
export const Cloud = ({ x, y, s = 1 }: P) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} className="cloud"><ellipse cx="0" cy="0" rx="46" ry="18" fill="#fff" /><circle cx="-18" cy="-14" r="18" fill="#fff" /><circle cx="14" cy="-20" r="22" fill="#fff" /><ellipse cx="28" cy="2" rx="28" ry="14" fill="#fff" /></g>
);

/* ===== BANGUNAN ===== */
const win = (x: number, y: number) => (
  <g><rect x={x} y={y} width="20" height="20" rx="3" fill="#a5d8ff" stroke="#fff" strokeWidth="3" /><path d={`M${x + 10} ${y}v20M${x} ${y + 10}h20`} stroke="#fff" strokeWidth="2" /></g>
);
export const House = ({ x, y, s = 1, wall = "#fff3d6", roof = "#e8590c", door = "#845ef7", children }: B & { children?: ReactNode }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {shadow(66)}
    <rect x="-48" y="-62" width="96" height="62" rx="5" fill={wall} stroke="#0002" strokeWidth="2" />
    <rect x="22" y="-104" width="13" height="30" fill="#a0522d" />
    <polygon points="-64,-58 0,-110 64,-58" fill={roof} stroke="#0003" strokeWidth="2" />
    <polygon points="-64,-58 64,-58 58,-50 -58,-50" fill="#0002" />
    <rect x="-10" y="-38" width="20" height="38" rx="10" fill={door} /><circle cx="5" cy="-18" r="2.2" fill="#ffd43b" />
    {win(-40, -50)}{win(20, -50)}
    {children}
  </g>
);
export const Gazebo = ({ x, y, s = 1 }: P) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {shadow(70)}
    <ellipse cx="0" cy="-2" rx="62" ry="14" fill="#e9d8a6" stroke="#0002" />
    {[-46, -16, 16, 46].map((px) => <rect key={px} x={px - 4} y="-62" width="8" height="60" rx="3" fill="#fff" stroke="#0002" />)}
    <path d="M-72 -60 Q0 -92 72 -60 L60 -50 Q0 -72 -60 -50 Z" fill="#ec407a" stroke="#0003" strokeWidth="2" />
    <polygon points="-60,-62 0,-112 60,-62" fill="#f06292" stroke="#0003" strokeWidth="2" />
    <circle cx="0" cy="-116" r="6" fill="#ffd43b" />
    <ellipse cx="0" cy="-10" rx="18" ry="7" fill="#74c0fc" stroke="#fff" strokeWidth="3" /><path d="M0 -10 q-6 -18 0 -26 q6 8 0 26" fill="#a5d8ff" />
  </g>
);
export const Tower = ({ x, y, s = 1 }: P) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {shadow(52)}
    <rect x="-34" y="-120" width="68" height="120" fill="#e6d3b3" stroke="#0002" strokeWidth="2" />
    <rect x="-42" y="-132" width="84" height="16" fill="#cdb891" stroke="#0002" />
    {[-36, -18, 0, 18, 32].map((bx) => <rect key={bx} x={bx - 4} y="-144" width="10" height="14" fill="#cdb891" stroke="#0002" />)}
    <polygon points="-30,-132 0,-190 30,-132" fill="#00897b" stroke="#0003" strokeWidth="2" />
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
    <polygon points="-70,-80 0,-124 70,-80" fill="#f9a825" stroke="#0003" strokeWidth="2" />
    <polygon points="-52,-84 0,-116 52,-84" fill="#ffd54f" />
    <path d="M0 -176 l9 19 21 3 -15 15 4 21 -19 -10 -19 10 4 -21 -15 -15 21 -3z" transform="translate(0 40) scale(.9)" fill="#ffd43b" stroke="#f08c00" strokeWidth="2" />
    <rect x="-12" y="-46" width="24" height="32" rx="12" fill="#c2255c" />
  </g>
);

/* ===== BANGUNAN PETA: pos 1-6 ===== */
export function Building({ id, x, y }: { id: number; x: number; y: number }) {
  switch (id) {
    case 1: return <House x={x} y={y} wall="#e7f5ff" roof="#1e88e5" door="#ff8787" />;
    case 2: return <Gazebo x={x} y={y} />;
    case 3: return <House x={x} y={y} wall="#f3e5f5" roof="#8e44ad" door="#ffd43b"><g transform="translate(0 -122)"><circle r="19" fill="#fff" stroke="#8e44ad" strokeWidth="4" /><text y="7" textAnchor="middle" fontSize="20">🗺️</text></g></House>;
    case 4: return <House x={x} y={y} wall="#fff4e6" roof="#f57c00" door="#2b8a3e"><g transform="translate(0 -122)"><circle r="14" fill="#fff" stroke="#f57c00" strokeWidth="5" /><path d="M10 10l14 14" stroke="#f57c00" strokeWidth="6" strokeLinecap="round" /></g></House>;
    case 5: return <Tower x={x} y={y} />;
    default: return <Hall x={x} y={y} />;
  }
}

/* ===== PETA DESA ===== */
export type PinStatus = "locked" | "open" | "done" | "next";
const spots: { id: number; x: number; y: number }[] = [
  { id: 1, x: 150, y: 500 }, { id: 2, x: 300, y: 300 }, { id: 3, x: 525, y: 492 },
  { id: 4, x: 640, y: 290 }, { id: 5, x: 800, y: 470 }, { id: 6, x: 890, y: 235 },
];
const pathD = "M150 505 C210 410 240 330 300 305 S440 470 525 495 S590 300 640 295 S750 450 800 475 S870 270 890 240";

export function MapScene({ status }: { status: Record<number, PinStatus> }) {
  const top = spots.filter((s) => s.y < 400), bottom = spots.filter((s) => s.y >= 400);
  const bld = (s: { id: number; x: number; y: number }) => <g key={s.id} className={`bld ${status[s.id] === "locked" ? "bld-locked" : ""}`}><Building id={s.id} x={s.x} y={s.y} /></g>;
  return (
    <svg className="scene-svg" viewBox="0 0 1000 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9be564" /><stop offset="1" stopColor="#5fc34f" /></linearGradient>
        <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="8" cy="10" r="2.4" fill="#ffffff35" /><circle cx="28" cy="30" r="2" fill="#2b8a3e22" /></pattern>
      </defs>
      <rect width="1000" height="640" fill="url(#grass)" /><rect width="1000" height="640" fill="url(#dots)" />
      <ellipse cx="170" cy="150" rx="170" ry="90" fill="#b5ef7f" opacity=".6" /><ellipse cx="850" cy="560" rx="190" ry="100" fill="#b5ef7f" opacity=".55" />
      <ellipse cx="580" cy="90" rx="130" ry="50" fill="#7acb52" opacity=".4" />
      {/* sungai */}
      <path d="M395 -20 C330 110 450 200 410 320 S350 540 430 670" fill="none" stroke="#f1deb0" strokeWidth="96" strokeLinecap="round" />
      <path d="M395 -20 C330 110 450 200 410 320 S350 540 430 670" fill="none" stroke="#339af0" strokeWidth="74" strokeLinecap="round" />
      <path className="river-flow" d="M395 -20 C330 110 450 200 410 320 S350 540 430 670" fill="none" stroke="#74c0fc" strokeWidth="52" strokeLinecap="round" strokeDasharray="30 40" />
      <ellipse cx="90" cy="590" rx="80" ry="38" fill="#f1deb0" /><ellipse cx="90" cy="590" rx="68" ry="29" fill="#4dabf7" /><ellipse cx="72" cy="585" rx="22" ry="7" fill="#a5d8ff" />
      {/* jalan */}
      <path d={pathD} fill="none" stroke="#b98a45" strokeWidth="46" strokeLinecap="round" strokeLinejoin="round" />
      <path d={pathD} fill="none" stroke="#f3d99b" strokeWidth="34" strokeLinecap="round" strokeLinejoin="round" />
      <path d={pathD} fill="none" stroke="#fff8e1" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 22" opacity=".9" />
      {/* jembatan */}
      <g transform="translate(392 382) rotate(22)">
        <rect x="-62" y="-30" width="124" height="60" rx="6" fill="#a9743b" stroke="#6b4a24" strokeWidth="3" />
        {[-48, -32, -16, 0, 16, 32, 48].map((px) => <rect key={px} x={px - 6} y="-27" width="12" height="54" rx="2" fill="#d19a5b" stroke="#8a5a2b" />)}
        <rect x="-66" y="-36" width="132" height="8" rx="3" fill="#8a5a2b" /><rect x="-66" y="28" width="132" height="8" rx="3" fill="#8a5a2b" />
      </g>
      {/* dekorasi belakang */}
      <Tree x={60} y={170} s={1.2} /><Tree x={125} y={110} /><Pine x={215} y={110} /><Tree x={330} y={150} s={.9} /><Pine x={520} y={120} /><Tree x={575} y={70} s={.9} />
      <Pine x={720} y={140} /><Tree x={790} y={95} s={1.1} /><Pine x={965} y={110} s={1.1} /><Tree x={945} y={380} s={1.1} /><Pine x={50} y={340} s={1.1} />
      <Rock x={540} y={200} /><Flower x={250} y={210} /><Flower x={265} y={218} c="#ffd43b" /><Flower x={700} y={230} c="#ffffff" /><Flower x={715} y={238} />
      {top.map(bld)}
      <Fence x={215} y={445} n={3} /><Bush x={60} y={470} /><Mushroom x={85} y={520} /><Mushroom x={100} y={526} s={.7} />
      <Flower x={230} y={540} /><Flower x={245} y={548} c="#ffd43b" /><Flower x={600} y={420} /><Flower x={620} y={430} c="#fff" /><Bush x={690} y={400} s={.9} />
      {bottom.map(bld)}
      <Pine x={250} y={610} /><Tree x={340} y={600} s={.9} /><Tree x={600} y={600} s={1.1} /><Pine x={660} y={560} s={.9} /><Tree x={970} y={590} s={1.2} />
      <Flower x={760} y={580} /><Flower x={778} y={590} c="#ffd43b" /><Bush x={880} y={600} /><Mushroom x={530} y={600} />
      <Cloud x={160} y={60} s={.9} /><Cloud x={640} y={35} s={.8} />
    </svg>
  );
}

/* ===== LAYAR AWAL: DESA DI BUKIT ===== */
export function HomeScene() {
  const tiny = (x: number, y: number, wall: string, roof: string, s = .55) => <House x={x} y={y} s={s} wall={wall} roof={roof} door="#ff8787" />;
  return (
    <svg className="scene-svg" viewBox="0 0 1000 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#58c4ff" /><stop offset=".7" stopColor="#bdeeff" /><stop offset="1" stopColor="#eafaff" /></linearGradient>
        <radialGradient id="sun"><stop offset="0" stopColor="#fff3a8" /><stop offset="1" stopColor="#fff3a800" /></radialGradient>
      </defs>
      <rect width="1000" height="640" fill="url(#sky)" />
      <circle cx="860" cy="110" r="120" fill="url(#sun)" /><circle cx="860" cy="110" r="38" fill="#ffe066" />
      <Cloud x={190} y={110} s={1.3} /><Cloud x={560} y={70} s={1} /><Cloud x={760} y={200} s={.8} />
      <ellipse cx="250" cy="360" rx="420" ry="90" fill="#a9e58c" /><ellipse cx="800" cy="370" rx="400" ry="85" fill="#9adf7b" />
      {tiny(120, 335, "#e0f7fa", "#26a69a")}{tiny(215, 345, "#fff3e0", "#ef6c00")}{tiny(300, 330, "#fce4ec", "#c2185b", .5)}
      {tiny(660, 335, "#e8eaf6", "#5c6bc0")}{tiny(760, 345, "#fff8e1", "#e53935")}{tiny(860, 335, "#e0f2f1", "#00897b", .5)}{tiny(940, 350, "#fff3e0", "#fb8c00")}
      <House x={430} y={350} s={.75} wall="#fff0d4" roof="#d84315" door="#5c7cfa" /><House x={560} y={352} s={.7} wall="#e3f2fd" roof="#1e88e5" door="#ffa94d" />
      <ellipse cx="500" cy="470" rx="720" ry="170" fill="#7fd45c" /><ellipse cx="500" cy="560" rx="760" ry="150" fill="#6bc84a" />
      <path d="M470 372 C520 372 520 420 540 450 S640 560 760 650 L200 650 C330 560 450 500 470 440 C478 410 460 395 470 372Z" fill="#e9c27a" />
      <path d="M475 380 C520 380 515 424 535 456 S625 560 725 650 L330 650 C420 560 478 500 490 440 C497 410 478 400 475 380Z" fill="#f6dba0" />
      <Fence x={250} y={470} n={4} /><Fence x={600} y={475} n={5} />
      <Mushroom x={640} y={540} s={1.4} /><Mushroom x={672} y={548} s={1} /><Bush x={170} y={560} s={1.4} /><Bush x={880} y={540} s={1.3} />
      {/* pohon besar kiri & kanan */}
      <g><path d="M-10 640 C20 440 40 300 60 -10 L140 -10 C115 140 100 300 130 640Z" fill="#8d5a2e" /><path d="M20 640 C45 450 60 300 80 -10 L100 -10 C85 200 85 430 100 640Z" fill="#a9703c" />
        <circle cx="60" cy="40" r="110" fill="#2f9e44" /><circle cx="190" cy="10" r="100" fill="#37b24d" /><circle cx="30" cy="190" r="90" fill="#37b24d" /><circle cx="170" cy="130" r="70" fill="#51cf66" opacity=".8" /></g>
      <g><path d="M1010 -10 C960 90 930 160 880 240 L850 220 C900 140 940 70 960 -10Z" fill="#8d5a2e" /><circle cx="930" cy="20" r="110" fill="#2f9e44" /><circle cx="820" cy="-10" r="90" fill="#37b24d" /><circle cx="990" cy="130" r="80" fill="#51cf66" opacity=".85" /></g>
      {/* mawar depan */}
      {[[40, 610, "#d6336c"], [100, 625, "#e64980"], [880, 600, "#d6336c"], [940, 620, "#f06595"], [830, 630, "#e64980"]].map(([fx, fy, fc]) => (
        <g key={`${fx}-${fy}`}><Bush x={Number(fx)} y={Number(fy) + 12} s={1.6} /><circle cx={Number(fx) + 4} cy={Number(fy) - 12} r="20" fill={String(fc)} /><circle cx={Number(fx) + 4} cy={Number(fy) - 12} r="11" fill="#ffffff55" /></g>
      ))}
      <g className="petals"><ellipse cx="420" cy="560" rx="8" ry="4" fill="#ffc9de" /><ellipse cx="520" cy="520" rx="7" ry="3.5" fill="#fff" /></g>
    </svg>
  );
}
