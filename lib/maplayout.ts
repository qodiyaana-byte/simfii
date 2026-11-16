// Tata letak peta berbasis gambar /images/peta-desa.jpg (1536 x 1024 piksel).
// Semua angka dalam piksel gambar; halaman mengubahnya menjadi persen agar tetap pas di semua ukuran layar.
export const MAP_W = 1536;
export const MAP_H = 1024;

export type Box = { cx: number; cy: number; w: number; h: number };
export type PosLayout = {
  hit: Box;          // area klik pada rumah atau landmark
  pill: Box;         // label nama (menutupi tulisan bawaan gambar)
  drop?: { x: number; y: number }; // titik ujung bawah penanda bernomor yang perlu digambar (rumah 1-4 sudah punya penanda pada gambar)
};

export const posLayout: Record<number, PosLayout> = {
  1: { hit: { cx: 240, cy: 350, w: 310, h: 300 }, pill: { cx: 270, cy: 485, w: 272, h: 88 } },
  2: { hit: { cx: 707, cy: 315, w: 260, h: 250 }, pill: { cx: 727, cy: 445, w: 262, h: 84 } },
  3: { hit: { cx: 1260, cy: 395, w: 350, h: 280 }, pill: { cx: 1237, cy: 530, w: 292, h: 84 } },
  4: { hit: { cx: 622, cy: 640, w: 275, h: 250 }, pill: { cx: 642, cy: 775, w: 292, h: 88 } },
  5: { hit: { cx: 1045, cy: 735, w: 320, h: 170 }, pill: { cx: 1090, cy: 815, w: 280, h: 84 }, drop: { x: 1045, y: 700 } },
  6: { hit: { cx: 1005, cy: 930, w: 170, h: 110 }, pill: { cx: 1157, cy: 945, w: 268, h: 84 }, drop: { x: 900, y: 905 } },
};

export const pct = {
  left: (b: Box) => ((b.cx - b.w / 2) / MAP_W) * 100,
  top: (b: Box) => ((b.cy - b.h / 2) / MAP_H) * 100,
  width: (b: Box) => (b.w / MAP_W) * 100,
  height: (b: Box) => (b.h / MAP_H) * 100,
  cx: (b: Box) => (b.cx / MAP_W) * 100,
  cy: (b: Box) => (b.cy / MAP_H) * 100,
};
