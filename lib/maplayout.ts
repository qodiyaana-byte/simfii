// Tata letak halaman berbasis gambar. Semua angka dalam piksel gambar aslinya;
// halaman mengubahnya menjadi persen agar tetap pas di semua ukuran layar.
import type { MateriId } from "./content";

export type Box = { cx: number; cy: number; w: number; h: number };
export type Rect = [number, number, number, number]; // [kiri, atas, lebar, tinggi]

export type PosLayout = {
  hit: Box;          // area klik pada bangunan
  pill?: Box;        // label nama yang menutupi tulisan bawaan gambar (hanya peta Isim dan Fi'il)
  badge?: { x: number; y: number }; // titik ikon pada label bawaan gambar (peta Mubtada')
  label?: Box;       // label bawaan gambar yang diredupkan saat pos terkunci (peta Mubtada')
};

export type NavRects = { home: Rect; materi: Rect; peta: Rect; profil: Rect };

export type MapLayout = {
  w: number; h: number; img: string; alt: string;
  mode: "pills" | "badges";
  pos: Record<number, PosLayout>;
  // elemen yang digambar ulang di atas tulisan bawaan gambar
  plate?: boolean; // judul materi memakai papan kayu terang (menimpa papan bawaan gambar)
  title?: Rect; bubble?: Rect; progress?: Rect; summary?: Rect;
  // area klik transparan di atas tombol bawaan gambar
  help?: Rect; next?: Rect; back?: Rect; nav: NavRects;
  // chip tambahan (peta yang gambarnya tidak punya tempat bawaan)
  chipProgress?: Rect; chipSummary?: Rect;
  backChip?: Rect; // tombol teks "Kumpulan Materi" (peta yang tidak punya tombol kembali bawaan)
};

const box = (x: number, y: number, w: number, h: number): Box => ({ cx: x + w / 2, cy: y + h / 2, w, h });

/* Peta Isim dan Fi'il: /images/peta-isimfiil.jpg (1042 x 1536; tepi gambar asli dipangkas 50 px kiri dan 54 px kanan) */
const isimfiil: MapLayout = {
  w: 1042, h: 1536, img: "/images/peta-isimfiil.jpg", alt: "Peta desa petualangan Isim dan Fi'il", mode: "pills",
  pos: {
    1: { hit: box(25, 245, 260, 165), pill: box(65, 402, 215, 78) },
    2: { hit: box(360, 265, 255, 165), pill: box(405, 427, 225, 76) },
    3: { hit: box(720, 380, 300, 170), pill: box(742, 548, 248, 78) },
    4: { hit: box(205, 585, 330, 145), pill: box(260, 723, 250, 78) },
    5: { hit: box(395, 830, 275, 190), pill: box(402, 1014, 240, 78) },
    6: { hit: box(590, 1090, 425, 135), pill: box(698, 1212, 268, 82) },
  },
  title: [20, 16, 408, 158], bubble: [430, 14, 346, 130], progress: [784, 22, 176, 108],
  summary: [18, 1266, 330, 130],
  help: [962, 26, 66, 68], backChip: [772, 136, 250, 48], next: [838, 1296, 196, 124],
  nav: { home: [90, 1436, 215, 82], materi: [322, 1436, 205, 82], peta: [540, 1436, 205, 82], profil: [765, 1436, 200, 82] },
};

/* Peta Mubtada' dan Khabar: /images/peta-mubtada.jpg (1305 x 1206). Judul, label pos, dan tombol Kumpulan Materi memakai tulisan bawaan gambar. */
const mubtada: MapLayout = {
  w: 1305, h: 1206, img: "/images/peta-mubtada.jpg", alt: "Peta petualangan Mubtada' dan Khabar", mode: "badges",
  pos: {
    1: { hit: box(50, 215, 265, 255), badge: { x: 127, y: 431 }, label: box(88, 398, 217, 68) },
    2: { hit: box(335, 360, 225, 215), badge: { x: 390, y: 543 }, label: box(348, 515, 197, 57) },
    3: { hit: box(305, 590, 325, 215), badge: { x: 405, y: 770 }, label: box(364, 742, 188, 58) },
    4: { hit: box(595, 730, 295, 200), badge: { x: 695, y: 862 }, label: box(655, 833, 193, 55) },
    5: { hit: box(800, 440, 240, 245), badge: { x: 850, y: 653 }, label: box(812, 625, 228, 58) },
    6: { hit: box(1000, 225, 290, 280), badge: { x: 1088, y: 466 }, label: box(1050, 433, 198, 67) },
  },
  bubble: [504, 12, 462, 132], progress: [981, 20, 226, 114], summary: [18, 934, 388, 124],
  help: [1220, 24, 72, 72], back: [992, 142, 296, 64], next: [1026, 920, 268, 134],
  nav: { home: [90, 1098, 285, 84], materi: [398, 1098, 250, 84], peta: [665, 1098, 275, 84], profil: [968, 1098, 265, 84] },
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
  // papan sapaan di kiri atas (menimpa tulisan bawaan gambar)
  welcome: [172, 22, 218, 94] as Rect,
  // judul Arab pada kartu (menimpa tulisan bawaan gambar)
  titles: { isimfiil: [366, 543, 300, 90] as Rect, mubtada: [366, 840, 300, 90] as Rect } as Record<MateriId, Rect>,
  // tulisan Arab pada ilustrasi buku dan papan tulis (menimpa tulisan bawaan gambar)
  art: {
    isimfiil: { rect: [158, 596, 118, 122] as Rect, rot: -9, bg: "linear-gradient(135deg,#2c84de,#1f7ad6)" },
    mubtada: { rect: [128, 900, 120, 128] as Rect, rot: -3, bg: "linear-gradient(135deg,#2b3a4d,#2a3f52)" },
  } as Record<MateriId, { rect: Rect; rot: number; bg: string }>,
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
