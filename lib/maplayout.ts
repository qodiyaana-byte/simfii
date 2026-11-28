// Tata letak halaman berbasis gambar. Semua angka dalam piksel gambar aslinya;
// halaman mengubahnya menjadi persen agar tetap pas di semua ukuran layar.
import type { MateriId } from "./content";

export type Box = { cx: number; cy: number; w: number; h: number };
export type Rect = [number, number, number, number]; // [kiri, atas, lebar, tinggi]

export type PosLayout = {
  hit: Box;          // area klik pada bangunan
  pill?: Box;        // label nama yang menutupi tulisan bawaan gambar (hanya peta Isim dan Fi'il)
  badge?: { x: number; y: number }; // titik bintang pada label bawaan gambar (hanya peta Mubtada')
};

export type NavRects = { home: Rect; materi: Rect; peta: Rect; profil: Rect };

export type MapLayout = {
  w: number; h: number; img: string; alt: string;
  mode: "pills" | "badges";
  pos: Record<number, PosLayout>;
  // elemen yang digambar ulang di atas tulisan bawaan gambar
  title?: Rect; bubble?: Rect; progress?: Rect; summary?: Rect;
  // area klik transparan di atas tombol bawaan gambar
  help?: Rect; next?: Rect; back?: Rect; nav: NavRects;
  // chip tambahan (peta yang gambarnya tidak punya tempat bawaan)
  chipProgress?: Rect; chipSummary?: Rect;
};

const box = (x: number, y: number, w: number, h: number): Box => ({ cx: x + w / 2, cy: y + h / 2, w, h });

/* Peta Isim dan Fi'il: /images/peta-isimfiil.jpg (1024 x 1536) */
const isimfiil: MapLayout = {
  w: 1024, h: 1536, img: "/images/peta-isimfiil.jpg", alt: "Peta desa petualangan Isim dan Fi'il", mode: "pills",
  pos: {
    1: { hit: box(15, 245, 250, 165), pill: box(55, 403, 215, 78) },
    2: { hit: box(365, 270, 240, 155), pill: box(395, 428, 225, 74) },
    3: { hit: box(700, 380, 300, 170), pill: box(728, 550, 262, 76) },
    4: { hit: box(195, 585, 385, 140), pill: box(250, 724, 250, 76) },
    5: { hit: box(385, 820, 265, 195), pill: box(395, 1016, 240, 76) },
    6: { hit: box(570, 1085, 435, 130), pill: box(688, 1214, 268, 82) },
  },
  title: [12, 14, 402, 156], bubble: [424, 16, 338, 140], progress: [774, 22, 176, 108],
  summary: [8, 1266, 330, 130],
  help: [954, 26, 66, 70], next: [828, 1298, 194, 124],
  nav: { home: [70, 1440, 215, 80], materi: [315, 1440, 200, 80], peta: [535, 1440, 195, 80], profil: [750, 1440, 195, 80] },
};

/* Peta Mubtada' dan Khabar: /images/peta-mubtada.jpg (1154 x 1363) */
const mubtada: MapLayout = {
  w: 1154, h: 1363, img: "/images/peta-mubtada.jpg", alt: "Peta misi Mubtada' dan Khabar", mode: "badges",
  pos: {
    1: { hit: box(10, 232, 262, 178), badge: { x: 138, y: 224 } },
    2: { hit: box(155, 462, 240, 212), badge: { x: 272, y: 456 } },
    3: { hit: box(590, 468, 215, 226), badge: { x: 711, y: 462 } },
    4: { hit: box(392, 718, 280, 218), badge: { x: 524, y: 712 } },
    5: { hit: box(678, 952, 238, 205), badge: { x: 803, y: 948 } },
    6: { hit: box(845, 175, 309, 255), badge: { x: 1023, y: 346 } },
  },
  back: [1052, 18, 82, 82],
  nav: { home: [452, 24, 138, 62], materi: [594, 24, 138, 62], peta: [736, 24, 146, 62], profil: [894, 24, 142, 62] },
  chipProgress: [884, 104, 258, 52], chipSummary: [30, 1172, 400, 62],
};

/* Halaman Kumpulan Materi: /images/kumpulan-materi.jpg (1024 x 1536) */
export const HUB = {
  w: 1024, h: 1536, img: "/images/kumpulan-materi.jpg",
  cards: {
    isimfiil: { card: [35, 528, 955, 255] as Rect, button: [720, 598, 254, 98] as Rect, progress: [724, 716, 248, 40] as Rect },
    mubtada: { card: [35, 822, 955, 255] as Rect, button: [720, 893, 254, 98] as Rect, progress: [724, 1010, 248, 40] as Rect },
  } as Record<MateriId, { card: Rect; button: Rect; progress: Rect }>,
  // menutup baris keterangan bawaan kartu Mubtada' agar diganti الْجُمْلَةُ الاِسْمِيَّةُ
  mubtadaLine: [366, 986, 340, 64] as Rect,
  nav: {
    top: { home: [440, 24, 112, 76] as Rect, materi: [565, 24, 120, 76] as Rect, peta: [700, 24, 125, 76] as Rect, profil: [855, 24, 115, 76] as Rect },
    bottom: { home: [60, 1452, 175, 72] as Rect, materi: [310, 1452, 160, 72] as Rect, peta: [570, 1452, 165, 72] as Rect, profil: [815, 1452, 150, 72] as Rect },
  },
};

export const mapLayouts: Record<MateriId, MapLayout> = { isimfiil, mubtada };

// Persen terhadap gambar; dipakai untuk ukuran dan letak elemen.
export const pctBox = (b: Box, w: number, h: number) => ({
  left: `${((b.cx - b.w / 2) / w) * 100}%`, top: `${((b.cy - b.h / 2) / h) * 100}%`,
  width: `${(b.w / w) * 100}%`, height: `${(b.h / h) * 100}%`,
});
export const pctRect = (r: Rect, w: number, h: number) => ({
  left: `${(r[0] / w) * 100}%`, top: `${(r[1] / h) * 100}%`, width: `${(r[2] / w) * 100}%`, height: `${(r[3] / h) * 100}%`,
});
