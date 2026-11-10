export type FiilTag = "madhi" | "mudhari" | "amr";
export type Word = { arabic: string; meaning: string; tag?: FiilTag };
export type Seg = { t: string; hl?: boolean };
export type Sign = { name: string; rule: string; segs: Seg[]; part: string; meaning: string };
export type WordGroup = { title: string; note?: string; tag?: FiilTag; words: Word[] };
export type Slide =
  | { kind: "definition"; title: string; arabic: string; text: string; examples: Word[] }
  | { kind: "signs"; title: string; intro: string; items: Sign[] }
  | { kind: "words"; title: string; intro: string; groups: WordGroup[] }
  | { kind: "mindmap"; title: string }
  | { kind: "table"; title: string };

export type MapPosition = {
  id: number; title: string; subtitle: string; icon: string;
  x: number; y: number; h: number; // pusat dan tinggi area klik (persen terhadap peta)
  color: string;
};

export const tagLabels: Record<FiilTag, string> = {
  madhi: "Fi'il Madhi · lampau",
  mudhari: "Fi'il Mudhari' · sekarang / akan datang",
  amr: "Fi'il Amr · perintah",
};

export const positions: MapPosition[] = [
  { id: 1, title: "Rumah Isim", subtitle: "Definisi, ciri, dan contoh isim", icon: "🏠", x: 15, y: 67.3, h: 25.3, color: "#1e88e5" },
  { id: 2, title: "Taman Fi'il", subtitle: "Definisi, tanda, dan contoh fi'il", icon: "⛲", x: 30, y: 35.6, h: 26.3, color: "#e91e63" },
  { id: 3, title: "Balai Peta Konsep", subtitle: "Perbedaan isim dan fi'il", icon: "🗺️", x: 52.5, y: 60.9, h: 33, color: "#8e44ad" },
  { id: 4, title: "Kantor Detektif", subtitle: "Evaluasi seluruh materi", icon: "🔎", x: 64, y: 31.2, h: 32, color: "#f57c00" },
  { id: 5, title: "Menara Tantangan", subtitle: "Soal akhir yang lebih sulit", icon: "🏰", x: 80, y: 53.9, h: 42.8, color: "#00897b" },
  { id: 6, title: "Aula Bintang", subtitle: "Skor setiap pos dan nilai akhir", icon: "🏆", x: 89, y: 25.1, h: 27, color: "#f9a825" },
];

export const slides: Record<number, Slide[]> = {
  1: [
    {
      kind: "definition", title: "Pengertian Isim", arabic: "الاِسْمُ",
      text: "Isim adalah kata yang menunjukkan nama orang, hewan, benda, tempat, atau sifat. Maknanya berdiri sendiri dan tidak terikat dengan waktu.",
      examples: [
        { arabic: "أَحْمَدُ", meaning: "Ahmad (nama orang)" },
        { arabic: "بَيْتٌ", meaning: "rumah (tempat)" },
        { arabic: "قَلَمٌ", meaning: "pena (benda)" },
      ],
    },
    {
      kind: "signs", title: "Ciri-ciri Isim", intro: "Perhatikan bagian berwarna merah. Itulah ciri yang membuat kata tersebut dikenali sebagai isim.",
      items: [
        { name: "1. Dimasuki alif lam (ال)", rule: "Awal kata diberi ال.", segs: [{ t: "الْ", hl: true }, { t: "كِتَابُ" }], part: "الْ", meaning: "buku itu" },
        { name: "2. Bertanwin", rule: "Akhir kata berharakat dua.", segs: [{ t: "كِتَا" }, { t: "بٌ", hl: true }], part: "بٌ", meaning: "sebuah buku" },
        { name: "3. Didahului huruf jar", rule: "Huruf jar: مِنْ, إِلَى, فِي, عَلَى, عَنْ.", segs: [{ t: "فِي", hl: true }, { t: " الْبَيْتِ" }], part: "فِي", meaning: "di dalam rumah" },
        { name: "4. Dimasuki huruf nida", rule: "Huruf nida يَا dipakai untuk memanggil.", segs: [{ t: "يَا", hl: true }, { t: " طَالِبُ" }], part: "يَا", meaning: "wahai siswa" },
      ],
    },
    {
      kind: "words", title: "Contoh Mufradat Isim", intro: "Pelajari kosakata isim berikut beserta artinya.",
      groups: [{
        title: "Mufradat Isim", words: [
          { arabic: "بَيْتٌ", meaning: "Rumah" }, { arabic: "كِتَابٌ", meaning: "Buku" },
          { arabic: "قَلَمٌ", meaning: "Pena" }, { arabic: "مَدْرَسَةٌ", meaning: "Sekolah" },
          { arabic: "مَاءٌ", meaning: "Air" }, { arabic: "أُمٌّ", meaning: "Ibu" },
          { arabic: "أَبٌ", meaning: "Ayah" }, { arabic: "طَالِبٌ", meaning: "Siswa laki-laki" },
        ],
      }],
    },
  ],
  2: [
    {
      kind: "definition", title: "Pengertian Fi'il", arabic: "الْفِعْلُ",
      text: "Fi'il adalah kata yang menunjukkan pekerjaan atau kejadian dan terikat dengan waktu. Berdasarkan waktunya, fi'il terbagi menjadi tiga: madhi, mudhari', dan amr.",
      examples: [
        { arabic: "كَتَبَ", meaning: "telah menulis", tag: "madhi" },
        { arabic: "يَكْتُبُ", meaning: "menulis (sedang / akan)", tag: "mudhari" },
        { arabic: "اُكْتُبْ", meaning: "tulislah!", tag: "amr" },
      ],
    },
    {
      kind: "signs", title: "Tanda-tanda Fi'il", intro: "Perhatikan bagian berwarna merah. Itulah tanda yang membuat kata tersebut dikenali sebagai fi'il.",
      items: [
        { name: "1. Didahului قَدْ", rule: "قَدْ berada sebelum fi'il.", segs: [{ t: "قَدْ", hl: true }, { t: " كَتَبَ" }], part: "قَدْ", meaning: "sungguh telah menulis" },
        { name: "2. Didahului سَ atau سَوْفَ", rule: "Menunjukkan waktu yang akan datang.", segs: [{ t: "سَ", hl: true }, { t: "يَكْتُبُ" }], part: "سَ", meaning: "akan menulis" },
        { name: "3. Bertemu ta' ta'nits sakinah", rule: "Akhiran تْ menandakan pelaku perempuan.", segs: [{ t: "كَتَبَ" }, { t: "تْ", hl: true }], part: "تْ", meaning: "dia (perempuan) telah menulis" },
        { name: "4. Bertemu ta' fa'il", rule: "Akhiran تُ menandakan pelaku orang pertama.", segs: [{ t: "كَتَبْ" }, { t: "تُ", hl: true }], part: "تُ", meaning: "aku telah menulis" },
      ],
    },
    {
      kind: "words", title: "Contoh Mufradat Fi'il", intro: "Mufradat fi'il dikelompokkan berdasarkan macamnya.",
      groups: [
        { title: "Fi'il Madhi", tag: "madhi", note: "Pekerjaan yang sudah terjadi (lampau)", words: [
          { arabic: "كَتَبَ", meaning: "Telah menulis" }, { arabic: "قَرَأَ", meaning: "Telah membaca" },
          { arabic: "أَكَلَ", meaning: "Telah makan" }, { arabic: "شَرِبَ", meaning: "Telah minum" },
          { arabic: "ذَهَبَ", meaning: "Telah pergi" },
        ] },
        { title: "Fi'il Mudhari'", tag: "mudhari", note: "Pekerjaan yang sedang atau akan terjadi", words: [
          { arabic: "يَكْتُبُ", meaning: "Menulis" }, { arabic: "يَقْرَأُ", meaning: "Membaca" },
          { arabic: "يَأْكُلُ", meaning: "Makan" }, { arabic: "يَشْرَبُ", meaning: "Minum" },
          { arabic: "يَذْهَبُ", meaning: "Pergi" },
        ] },
        { title: "Fi'il Amr", tag: "amr", note: "Perintah untuk melakukan pekerjaan", words: [
          { arabic: "اُكْتُبْ", meaning: "Tulislah!" }, { arabic: "اِقْرَأْ", meaning: "Bacalah!" },
          { arabic: "كُلْ", meaning: "Makanlah!" }, { arabic: "اِشْرَبْ", meaning: "Minumlah!" },
          { arabic: "اِذْهَبْ", meaning: "Pergilah!" },
        ] },
      ],
    },
  ],
  3: [
    { kind: "mindmap", title: "Peta Konsep: Isim dan Fi'il" },
    { kind: "table", title: "Tabel Perbedaan Isim dan Fi'il" },
  ],
};

export const mindmapBranches = [
  { icon: "📖", title: "Pengertian", isim: "Nama orang, benda, tempat, atau sifat", fiil: "Pekerjaan atau kejadian" },
  { icon: "⏰", title: "Waktu", isim: "Tidak terikat waktu", fiil: "Terikat waktu: lampau, sekarang, akan datang" },
  { icon: "🔖", title: "Tanda / ciri", isim: "ال, tanwin, huruf jar, يَا", fiil: "قَدْ, سَ / سَوْفَ, تْ, تُ" },
  { icon: "✏️", title: "Contoh", isim: "بَيْتٌ (rumah)", fiil: "كَتَبَ (telah menulis)" },
];

export const tableRows = [
  { aspect: "Pengertian", isim: "Kata yang menunjukkan nama orang, benda, tempat, atau sifat", fiil: "Kata yang menunjukkan pekerjaan atau kejadian" },
  { aspect: "Waktu", isim: "Tidak terikat waktu", fiil: "Terikat waktu (lampau, sekarang/akan datang, perintah)" },
  { aspect: "Dimasuki alif lam (ال)", isim: "Bisa ✓", fiil: "Tidak bisa ✗" },
  { aspect: "Bertanwin", isim: "Bisa ✓", fiil: "Tidak bisa ✗" },
  { aspect: "Didahului huruf jar", isim: "Bisa ✓", fiil: "Tidak bisa ✗" },
  { aspect: "Didahului قَدْ atau سَ / سَوْفَ", isim: "Tidak bisa ✗", fiil: "Bisa ✓" },
  { aspect: "Bertemu تْ atau تُ", isim: "Tidak bisa ✗", fiil: "Bisa ✓" },
  { aspect: "Contoh", isim: "بَيْتٌ (rumah), الْكِتَابُ (buku itu), طَالِبٌ (siswa)", fiil: "كَتَبَ (telah menulis), يَقْرَأُ (membaca), سَيَذْهَبُ (akan pergi)" },
];
