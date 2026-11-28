export type FiilTag = "madhi" | "mudhari" | "amr";
export type Word = { arabic: string; meaning: string; tag?: FiilTag };
export type Seg = { t: string; hl?: boolean };
export type Sign = { name: string; rule: string; segs: Seg[]; part: string; meaning: string; extra?: { ar: string; id: string }[] };
export type WordGroup = { title: string; note?: string; tag?: FiilTag; words: Word[] };
export type PartWord = { ar: string; id: string };
// Satu kalimat jumlah ismiyah yang dipecah menjadi mubtada' dan khabar.
export type PartExample = { mubtada: PartWord; khabar: PartWord; meaning: string; note?: string };
export type Slide =
  | { kind: "definition"; title: string; arabic: string; text: string; examples: Word[] }
  | { kind: "recap"; title: string; intro: string; points: { head: string; text: string; examples: { ar: string; id: string }[] }[]; tip?: string }
  | { kind: "parts"; title: string; intro: string; showRoles?: boolean; items: PartExample[]; tip?: string }
  | { kind: "signs"; title: string; intro: string; items: Sign[]; tag?: FiilTag }
  | { kind: "words"; title: string; intro: string; groups: WordGroup[] }
  | { kind: "mindmap"; title: string }
  | { kind: "table"; title: string };

export type MapPosition = {
  id: number; title: string; subtitle: string; icon: string; arabic: string;
  x: number; y: number; // pusat area klik (persen terhadap peta), dipakai untuk titik zoom
  color: string;
};

export const tagLabels: Record<FiilTag, string> = {
  madhi: "Fi'il Madhi · lampau",
  mudhari: "Fi'il Mudhari' · sekarang / akan datang",
  amr: "Fi'il Amr · perintah",
};

export const isimfiilPositions: MapPosition[] = [
  { id: 1, title: "Rumah Isim", subtitle: "Definisi, ciri, dan contoh isim", icon: "🏠", arabic: "الاِسْمُ", x: 15.6, y: 34.2, color: "#f5a623" },
  { id: 2, title: "Rumah Fi'il", subtitle: "Definisi, tanda, dan contoh fi'il", icon: "🏡", arabic: "الْفِعْلُ", x: 46, y: 30.8, color: "#1e88e5" },
  { id: 3, title: "Balai Peta Konsep", subtitle: "Perbedaan isim dan fi'il", icon: "🗺️", arabic: "الْفَرْقُ", x: 82, y: 38.6, color: "#8e44ad" },
  { id: 4, title: "Kantor Detektif", subtitle: "Evaluasi seluruh materi", icon: "🔎", arabic: "التَّقْوِيمُ", x: 40.5, y: 62.5, color: "#e03a5a" },
  { id: 5, title: "Taman Tantangan", subtitle: "Soal akhir yang lebih sulit", icon: "⛲", arabic: "التَّحَدِّي", x: 68, y: 70.8, color: "#00a38c" },
  { id: 6, title: "Dermaga Bintang", subtitle: "Skor setiap pos dan nilai akhir", icon: "⛵", arabic: "النَّتِيجَةُ", x: 65.4, y: 88.4, color: "#f2b01e" },
];

export const isimfiilSlides: Record<number, Slide[]> = {
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
      kind: "signs", tag: "madhi", title: "Tanda-tanda Fi'il Madhi",
      intro: "Fi'il madhi menunjukkan pekerjaan yang sudah terjadi (lampau). Perhatikan bagian merah sebagai tandanya.",
      items: [
        { name: "1. Bertemu ta' ta'nits sakinah", rule: "Akhiran تْ menandakan pelaku perempuan (dia).", segs: [{ t: "كَتَبَ" }, { t: "تْ", hl: true }], part: "تْ", meaning: "dia (perempuan) telah menulis" },
        { name: "2. Bertemu ta' fa'il", rule: "Akhiran تُ (aku), تَ (kamu laki-laki), تِ (kamu perempuan).", segs: [{ t: "كَتَبْ" }, { t: "تُ", hl: true }], part: "تُ", meaning: "aku telah menulis" },
        { name: "3. Bertemu nun niswah", rule: "Akhiran نَ menandakan pelaku banyak perempuan (mereka).", segs: [{ t: "كَتَبْ" }, { t: "نَ", hl: true }], part: "نَ", meaning: "mereka (perempuan) telah menulis" },
        { name: "4. Didahului قَدْ", rule: "قَدْ menguatkan makna sudah terjadi.", segs: [{ t: "قَدْ", hl: true }, { t: " كَتَبَ" }], part: "قَدْ", meaning: "sungguh telah menulis" },
      ],
    },
    {
      kind: "signs", tag: "mudhari", title: "Tanda-tanda Fi'il Mudhari'",
      intro: "Fi'il mudhari' menunjukkan pekerjaan yang sedang atau akan terjadi. Perhatikan bagian merah sebagai tandanya.",
      items: [
        { name: "1. Diawali huruf mudhara'ah", rule: "Huruf أ ن ي ت di awal kata. Contoh lain: أَكْتُبُ (aku menulis), نَكْتُبُ (kami menulis), تَكْتُبُ (kamu menulis).", segs: [{ t: "يَ", hl: true }, { t: "كْتُبُ" }], part: "يَ", meaning: "dia (laki-laki) menulis" },
        { name: "2. Didahului سَ atau سَوْفَ", rule: "Menunjukkan waktu yang akan datang.", segs: [{ t: "سَ", hl: true }, { t: "يَكْتُبُ" }], part: "سَ", meaning: "akan menulis" },
        { name: "3. Didahului قَدْ", rule: "قَدْ di depan mudhari' bermakna kadang-kadang.", segs: [{ t: "قَدْ", hl: true }, { t: " يَكْتُبُ" }], part: "قَدْ", meaning: "kadang menulis" },
        { name: "4. Didahului لَمْ atau لَنْ", rule: "لَمْ berarti belum atau tidak (lampau), لَنْ berarti tidak akan.", segs: [{ t: "لَمْ", hl: true }, { t: " يَكْتُبْ" }], part: "لَمْ", meaning: "dia belum menulis" },
      ],
    },
    {
      kind: "signs", tag: "amr", title: "Tanda-tanda Fi'il Amr",
      intro: "Fi'il amr menunjukkan perintah untuk melakukan pekerjaan. Perhatikan bagian merah sebagai tandanya.",
      items: [
        { name: "1. Bermakna perintah", rule: "Meminta pekerjaan dilakukan, tanpa tanda waktu di depannya.", segs: [{ t: "اُكْتُبْ", hl: true }], part: "اُكْتُبْ", meaning: "tulislah!" },
        { name: "2. Dapat bertemu ya' mukhathabah", rule: "Akhiran ي dipakai untuk memerintah perempuan.", segs: [{ t: "اُكْتُبِ" }, { t: "ي", hl: true }], part: "ي", meaning: "tulislah (wahai perempuan)!" },
        { name: "3. Berakhiran sukun", rule: "Akhir fi'il amr untuk satu laki-laki dibaca sukun.", segs: [{ t: "اِقْرَ" }, { t: "أْ", hl: true }], part: "أْ", meaning: "bacalah!" },
        { name: "4. Dibentuk dari mudhari'", rule: "Huruf mudhara'ah dibuang dan diganti hamzah washal. Contoh: يَذْهَبُ menjadi اِذْهَبْ.", segs: [{ t: "اِ", hl: true }, { t: "ذْهَبْ" }], part: "اِ", meaning: "pergilah!" },
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

/* ============================================================
   MATERI 01: MUBTADA' DAN KHABAR (الْجُمْلَةُ الاِسْمِيَّةُ)
   Susunan pos sama dengan materi Isim dan Fi'il: 6 pos pada peta yang sama.
   Pos 1-4 = materi lalu evaluasi (5, 5, 7, 6 soal), Pos 5 = soal akhir (7 soal), Pos 6 = skor.
   ============================================================ */
export const mubtadaPositions: MapPosition[] = [
  { id: 1, title: "Rumah Ismiyah", subtitle: "Jumlah ismiyah = mubtada' + khabar", icon: "🏠", arabic: "الاِسْمِيَّةُ", x: 15.6, y: 34.2, color: "#f5a623" },
  { id: 2, title: "Warung Definisi", subtitle: "Definisi mubtada' dan khabar", icon: "🏪", arabic: "التَّعْرِيفُ", x: 46, y: 30.8, color: "#1e88e5" },
  { id: 3, title: "Pos Syarat", subtitle: "Syarat mubtada' dan khabar", icon: "👮", arabic: "الشُّرُوطُ", x: 82, y: 38.6, color: "#8e44ad" },
  { id: 4, title: "Pos Ketentuan", subtitle: "Ketentuan mubtada' dan khabar", icon: "🛖", arabic: "الْأَحْكَامُ", x: 40.5, y: 62.5, color: "#e03a5a" },
  { id: 5, title: "Jembatan Tantangan", subtitle: "Soal akhir yang lebih sulit", icon: "🌉", arabic: "التَّحَدِّي", x: 68, y: 70.8, color: "#00a38c" },
  { id: 6, title: "Sekolah Bintang", subtitle: "Skor setiap pos dan nilai akhir", icon: "🏫", arabic: "النَّتِيجَةُ", x: 65.4, y: 88.4, color: "#f2b01e" },
];

const P = (m: string, mi: string, k: string, ki: string, meaning: string, note?: string) =>
  ({ mubtada: { ar: m, id: mi }, khabar: { ar: k, id: ki }, meaning, ...(note ? { note } : {}) });
const X = (ar: string, id: string) => ({ ar, id });

export const mubtadaSlides: Record<number, Slide[]> = {
  1: [
    {
      kind: "definition", title: "Jumlah Ismiyah itu Mubtada' dan Khabar", arabic: "الْجُمْلَةُ الاِسْمِيَّةُ",
      text: "Jumlah ismiyah adalah kalimat yang diawali dengan isim. Kalimat ini tersusun dari dua bagian, yaitu mubtada' dan khabar. Jadi, setiap kali kamu melihat jumlah ismiyah, carilah dua bagian itu.",
      examples: [
        { arabic: "الْبَيْتُ كَبِيرٌ", meaning: "Rumah itu besar" },
        { arabic: "أَحْمَدُ مُجْتَهِدٌ", meaning: "Ahmad rajin" },
        { arabic: "الْكِتَابُ جَدِيدٌ", meaning: "Buku itu baru" },
        { arabic: "الْمَدْرَسَةُ وَاسِعَةٌ", meaning: "Sekolah itu luas" },
        { arabic: "الطَّالِبُ مُجْتَهِدٌ", meaning: "Siswa itu rajin" },
        { arabic: "الْمَاءُ بَارِدٌ", meaning: "Air itu dingin" },
      ],
    },
    {
      kind: "parts", title: "Mubtada' = Subjek, Khabar = Predikat", showRoles: true,
      intro: "Ingat kalimat Indonesia \"Ahmad rajin\". Ahmad adalah yang sedang dibicarakan (subjek), sedangkan rajin adalah keterangan tentang Ahmad (predikat). Dalam bahasa Arab, subjek disebut mubtada' dan predikat disebut khabar.",
      items: [
        P("أَحْمَدُ", "Ahmad", "مُجْتَهِدٌ", "rajin", "Ahmad rajin"),
        P("الْبَيْتُ", "rumah itu", "كَبِيرٌ", "besar", "Rumah itu besar"),
        P("الْكِتَابُ", "buku itu", "جَدِيدٌ", "baru", "Buku itu baru"),
        P("الْمَدْرَسَةُ", "sekolah itu", "وَاسِعَةٌ", "luas", "Sekolah itu luas"),
      ],
      tip: "Cara mudah: tanya \"siapa atau apa yang dibicarakan?\" Jawabannya mubtada'. Lalu tanya \"bagaimana dia?\" Jawabannya khabar.",
    },
    {
      kind: "parts", title: "Contoh Mubtada' dan Khabar", showRoles: true,
      intro: "Perhatikan setiap kalimat. Biru adalah mubtada' (subjek), merah muda adalah khabar (predikat).",
      items: [
        P("الْمَدْرَسَةُ", "sekolah itu", "وَاسِعَةٌ", "luas", "Sekolah itu luas"),
        P("الطَّالِبُ", "siswa itu", "مُجْتَهِدٌ", "rajin", "Siswa itu rajin"),
        P("الْمَاءُ", "air itu", "بَارِدٌ", "dingin", "Air itu dingin"),
        P("الْقَلَمُ", "pena itu", "جَدِيدٌ", "baru", "Pena itu baru"),
        P("الْبَابُ", "pintu itu", "مَفْتُوحٌ", "terbuka", "Pintu itu terbuka"),
        P("الْغُرْفَةُ", "kamar itu", "نَظِيفَةٌ", "bersih", "Kamar itu bersih"),
      ],
    },
  ],
  2: [
    {
      kind: "definition", title: "Definisi Mubtada'", arabic: "الْمُبْتَدَأُ",
      text: "Mubtada' adalah isim yang berada di awal jumlah ismiyah dan menjadi pokok pembicaraan (subjek). Kata kuncinya: letaknya di depan dan itulah yang sedang dibicarakan.",
      examples: [
        { arabic: "الْبَيْتُ", meaning: "mubtada' pada: الْبَيْتُ كَبِيرٌ" },
        { arabic: "الْكِتَابُ", meaning: "mubtada' pada: الْكِتَابُ جَدِيدٌ" },
        { arabic: "أَحْمَدُ", meaning: "mubtada' pada: أَحْمَدُ مُجْتَهِدٌ" },
        { arabic: "الْمَدْرَسَةُ", meaning: "mubtada' pada: الْمَدْرَسَةُ وَاسِعَةٌ" },
        { arabic: "الطَّالِبُ", meaning: "mubtada' pada: الطَّالِبُ مُجْتَهِدٌ" },
        { arabic: "فَاطِمَةُ", meaning: "mubtada' pada: فَاطِمَةُ نَشِيطَةٌ" },
      ],
    },
    {
      kind: "definition", title: "Definisi Khabar", arabic: "الْخَبَرُ",
      text: "Khabar adalah bagian yang menyempurnakan makna mubtada' (predikat). Ia memberi tahu keadaan atau keterangan tentang mubtada', dan letaknya setelah mubtada'.",
      examples: [
        { arabic: "كَبِيرٌ", meaning: "khabar pada: الْبَيْتُ كَبِيرٌ" },
        { arabic: "جَدِيدٌ", meaning: "khabar pada: الْكِتَابُ جَدِيدٌ" },
        { arabic: "مُجْتَهِدٌ", meaning: "khabar pada: أَحْمَدُ مُجْتَهِدٌ" },
        { arabic: "وَاسِعَةٌ", meaning: "khabar pada: الْمَدْرَسَةُ وَاسِعَةٌ" },
        { arabic: "بَارِدٌ", meaning: "khabar pada: الْمَاءُ بَارِدٌ" },
        { arabic: "نَشِيطَةٌ", meaning: "khabar pada: فَاطِمَةُ نَشِيطَةٌ" },
      ],
    },
    {
      kind: "parts", title: "Contoh Mubtada' dan Khabar", showRoles: true,
      intro: "Temukan mubtada' di depan dan khabar di belakangnya pada setiap kalimat berikut.",
      items: [
        P("الْوَلَدُ", "anak laki-laki itu", "ذَكِيٌّ", "pandai", "Anak laki-laki itu pandai"),
        P("الْبِنْتُ", "anak perempuan itu", "نَشِيطَةٌ", "giat", "Anak perempuan itu giat"),
        P("الدَّرْسُ", "pelajaran itu", "سَهْلٌ", "mudah", "Pelajaran itu mudah"),
        P("الْمَسْجِدُ", "masjid itu", "نَظِيفٌ", "bersih", "Masjid itu bersih"),
        P("الْبَابُ", "pintu itu", "مَفْتُوحٌ", "terbuka", "Pintu itu terbuka"),
        P("الْغُرْفَةُ", "kamar itu", "نَظِيفَةٌ", "bersih", "Kamar itu bersih"),
      ],
    },
  ],
  3: [
    {
      kind: "signs", title: "Syarat Mubtada'",
      intro: "Syarat utama mubtada' adalah isim ma'rifat, yaitu isim yang sudah jelas atau tertentu. Perhatikan bagian merah sebagai penandanya.",
      items: [
        { name: "1. Berupa isim", rule: "Mubtada' harus isim, bukan fi'il dan bukan huruf.", segs: [{ t: "الْبَيْتُ", hl: true }, { t: " كَبِيرٌ" }], part: "الْبَيْتُ", meaning: "rumah itu besar",
          extra: [X("الْبَابُ مَفْتُوحٌ", "pintu itu terbuka"), X("الْمَسْجِدُ نَظِيفٌ", "masjid itu bersih"), X("الدَّرْسُ سَهْلٌ", "pelajaran itu mudah")] },
        { name: "2. Ma'rifat: dimasuki ال", rule: "Isim yang diawali ال sudah tertentu, sehingga ma'rifat.", segs: [{ t: "الْ", hl: true }, { t: "قَلَمُ" }], part: "الْ", meaning: "pena itu",
          extra: [X("الْكِتَابُ جَدِيدٌ", "buku itu baru"), X("الْمَاءُ بَارِدٌ", "air itu dingin"), X("الطَّالِبُ مُجْتَهِدٌ", "siswa itu rajin")] },
        { name: "3. Ma'rifat: nama orang", rule: "Nama orang pasti tertentu, sehingga ma'rifat.", segs: [{ t: "أَحْمَدُ", hl: true }, { t: " مُجْتَهِدٌ" }], part: "أَحْمَدُ", meaning: "Ahmad rajin",
          extra: [X("فَاطِمَةُ مُجْتَهِدَةٌ", "Fatimah rajin"), X("يُوسُفُ ذَكِيٌّ", "Yusuf pandai"), X("زَيْنَبُ نَشِيطَةٌ", "Zainab giat")] },
      ],
    },
    {
      kind: "signs", title: "Syarat Khabar",
      intro: "Khabar pada umumnya berupa isim nakirah, yaitu isim yang belum tertentu dan ditandai tanwin. Perhatikan bagian merah sebagai penandanya.",
      items: [
        { name: "1. Berupa isim nakirah", rule: "Khabar tidak tertentu, sehingga bertanwin di akhirnya.", segs: [{ t: "كَبِي" }, { t: "رٌ", hl: true }], part: "رٌ", meaning: "(sesuatu yang) besar",
          extra: [X("الْقَلَمُ جَدِيدٌ", "pena itu baru"), X("الْمَدْرَسَةُ وَاسِعَةٌ", "sekolah itu luas"), X("الْبَابُ مَفْتُوحٌ", "pintu itu terbuka")] },
        { name: "2. Tidak dimasuki ال", rule: "Jika diberi ال (الْكَبِيرُ), maknanya menjadi \"yang besar\" dan tidak lagi menjadi khabar.", segs: [{ t: "كَبِيرٌ", hl: true }], part: "كَبِيرٌ", meaning: "besar (tanpa ال)",
          extra: [X("الْمَاءُ بَارِدٌ", "air itu dingin"), X("الدَّرْسُ سَهْلٌ", "pelajaran itu mudah"), X("الْمَسْجِدُ نَظِيفٌ", "masjid itu bersih")] },
        { name: "3. Letaknya setelah mubtada'", rule: "Mubtada' berada di depan, lalu khabar menyusul di belakangnya.", segs: [{ t: "الْبَيْتُ " }, { t: "كَبِيرٌ", hl: true }], part: "كَبِيرٌ", meaning: "rumah itu besar",
          extra: [X("أَحْمَدُ مُجْتَهِدٌ", "Ahmad rajin"), X("الْبِنْتُ نَشِيطَةٌ", "anak perempuan itu giat"), X("الْكِتَابُ جَدِيدٌ", "buku itu baru")] },
      ],
    },
    {
      kind: "parts", title: "Contoh Syarat Mubtada' dan Khabar", showRoles: false,
      intro: "Lihat bagaimana setiap kalimat memenuhi syarat mubtada' (ma'rifat) dan khabar (nakirah).",
      items: [
        P("الْكِتَابُ", "buku itu", "جَدِيدٌ", "baru", "Buku itu baru", "Mubtada' ma'rifat karena diawali ال. Khabar nakirah karena bertanwin."),
        P("أَحْمَدُ", "Ahmad", "مُجْتَهِدٌ", "rajin", "Ahmad rajin", "Mubtada' ma'rifat karena nama orang. Khabar nakirah karena bertanwin."),
        P("الْمَاءُ", "air itu", "بَارِدٌ", "dingin", "Air itu dingin", "Mubtada' ma'rifat karena diawali ال. Khabar nakirah karena bertanwin."),
        P("فَاطِمَةُ", "Fatimah", "نَشِيطَةٌ", "giat", "Fatimah giat", "Mubtada' ma'rifat karena nama orang. Khabar nakirah karena bertanwin."),
        P("الْبَابُ", "pintu itu", "مَفْتُوحٌ", "terbuka", "Pintu itu terbuka", "Mubtada' ma'rifat karena diawali ال. Khabar nakirah karena bertanwin."),
        P("يُوسُفُ", "Yusuf", "ذَكِيٌّ", "pandai", "Yusuf pandai", "Mubtada' ma'rifat karena nama orang. Khabar nakirah karena bertanwin."),
      ],
    },
  ],
  4: [
    {
      kind: "signs", title: "Ketentuan 1: I'rab Mubtada' dan Khabar adalah Rafa'",
      intro: "I'rab mubtada' dan khabar adalah rafa' (marfu'). Pada kata tunggal, tanda rafa' adalah huruf terakhir berharakat dhammah atau tanwin dhammah. Perhatikan bagian merah.",
      items: [
        { name: "1. Mubtada' berakhiran dhammah", rule: "Mubtada' ma'rifat dibaca dhammah (ـُ) di akhir kata.", segs: [{ t: "الْبَيْ" }, { t: "تُ", hl: true }], part: "تُ", meaning: "rumah itu",
          extra: [X("الْقَلَمُ جَدِيدٌ", "pena itu baru"), X("الْمَسْجِدُ نَظِيفٌ", "masjid itu bersih"), X("الدَّرْسُ سَهْلٌ", "pelajaran itu mudah")] },
        { name: "2. Khabar berakhiran tanwin dhammah", rule: "Khabar nakirah dibaca tanwin dhammah (ـٌ) di akhir kata.", segs: [{ t: "كَبِي" }, { t: "رٌ", hl: true }], part: "رٌ", meaning: "besar",
          extra: [X("الْبَابُ مَفْتُوحٌ", "pintu itu terbuka"), X("الْمَاءُ بَارِدٌ", "air itu dingin"), X("الطَّالِبُ مُجْتَهِدٌ", "siswa itu rajin")] },
        { name: "3. Keduanya rafa'", rule: "Dalam satu kalimat, kedua akhir kata itu sama-sama rafa'.", segs: [{ t: "الْبَيْ" }, { t: "تُ", hl: true }, { t: " كَبِي" }, { t: "رٌ", hl: true }], part: "تُ + رٌ", meaning: "rumah itu besar",
          extra: [X("الْمَدْرَسَةُ وَاسِعَةٌ", "sekolah itu luas"), X("الْوَلَدُ ذَكِيٌّ", "anak laki-laki itu pandai"), X("الْحَدِيقَةُ جَمِيلَةٌ", "taman itu indah")] },
        { name: "4. Nama orang juga rafa'", rule: "Mubtada' berupa nama orang tetap berakhiran dhammah.", segs: [{ t: "أَحْمَ" }, { t: "دُ", hl: true }, { t: " مُجْتَهِ" }, { t: "دٌ", hl: true }], part: "دُ + دٌ", meaning: "Ahmad rajin",
          extra: [X("فَاطِمَةُ نَشِيطَةٌ", "Fatimah giat"), X("يُوسُفُ ذَكِيٌّ", "Yusuf pandai"), X("زَيْنَبُ مُجْتَهِدَةٌ", "Zainab rajin")] },
      ],
    },
    {
      kind: "signs", title: "Ketentuan 2: Ketika Mubtada' Muannats",
      intro: "Khabar mengikuti jenis mubtada'. Mubtada' mudzakkar (maskulin) memakai khabar mudzakkar. Mubtada' muannats (feminin) memakai khabar muannats yang berakhiran ة.",
      items: [
        { name: "1. Mubtada' mudzakkar", rule: "Khabar juga mudzakkar, tanpa ة di akhirnya.", segs: [{ t: "الْقَلَمُ " }, { t: "جَدِيدٌ", hl: true }], part: "جَدِيدٌ", meaning: "pena itu baru",
          extra: [X("الْوَلَدُ نَشِيطٌ", "anak laki-laki itu giat"), X("الْمَسْجِدُ نَظِيفٌ", "masjid itu bersih"), X("الْبَابُ مَفْتُوحٌ", "pintu itu terbuka")] },
        { name: "2. Mubtada' muannats", rule: "Khabar ikut muannats, ditandai ة di akhirnya.", segs: [{ t: "السَّيَّارَةُ جَدِيدَ" }, { t: "ةٌ", hl: true }], part: "ةٌ", meaning: "mobil itu baru",
          extra: [X("الْمَدْرَسَةُ وَاسِعَةٌ", "sekolah itu luas"), X("الْحَدِيقَةُ جَمِيلَةٌ", "taman itu indah"), X("الْغُرْفَةُ نَظِيفَةٌ", "kamar itu bersih")] },
        { name: "3. Muannats untuk perempuan", rule: "Anak perempuan (الْبِنْتُ) adalah muannats, maka khabarnya berakhiran ة.", segs: [{ t: "الْبِنْتُ نَشِيطَ" }, { t: "ةٌ", hl: true }], part: "ةٌ", meaning: "anak perempuan itu giat",
          extra: [X("الْبِنْتُ ذَكِيَّةٌ", "anak perempuan itu pandai"), X("فَاطِمَةُ مُجْتَهِدَةٌ", "Fatimah rajin"), X("الطَّالِبَةُ نَشِيطَةٌ", "siswi itu giat")] },
      ],
    },
    {
      kind: "signs", title: "Ketentuan 3: Ketika Mubtada' Mutsanna dan Jamak",
      intro: "Khabar juga mengikuti jumlah mubtada'. Jika mubtada' mutsanna (bermakna dua), khabar mutsanna. Jika mubtada' jamak (lebih dari dua), khabar jamak. Tanda rafa'-nya berubah: alif pada mutsanna, waw pada jamak mudzakkar salim, dhammah pada jamak muannats salim.",
      items: [
        { name: "1. Mutsanna mudzakkar (dua)", rule: "Mubtada' dan khabar sama-sama berakhiran ـَانِ. Tanda rafa'-nya alif.", segs: [{ t: "الْوَلَدَ" }, { t: "انِ", hl: true }, { t: " نَشِيطَ" }, { t: "انِ", hl: true }], part: "ـَانِ", meaning: "dua anak laki-laki itu giat",
          extra: [X("الْكِتَابَانِ جَدِيدَانِ", "dua buku itu baru"), X("الطَّالِبَانِ مُجْتَهِدَانِ", "dua siswa itu rajin"), X("الْمَسْجِدَانِ نَظِيفَانِ", "dua masjid itu bersih")] },
        { name: "2. Mutsanna muannats (dua)", rule: "Khabar mutsanna muannats memakai ـَتَانِ.", segs: [{ t: "الْبِنْتَ" }, { t: "انِ", hl: true }, { t: " نَشِيطَتَ" }, { t: "انِ", hl: true }], part: "ـَانِ", meaning: "dua anak perempuan itu giat",
          extra: [X("الْمَدْرَسَتَانِ وَاسِعَتَانِ", "dua sekolah itu luas"), X("الْغُرْفَتَانِ نَظِيفَتَانِ", "dua kamar itu bersih"), X("الطَّالِبَتَانِ مُجْتَهِدَتَانِ", "dua siswi itu rajin")] },
        { name: "3. Jamak mudzakkar salim", rule: "Mubtada' dan khabar sama-sama berakhiran ـُونَ. Tanda rafa'-nya waw.", segs: [{ t: "الْمُسْلِمُ" }, { t: "ونَ", hl: true }, { t: " مُجْتَهِدُ" }, { t: "ونَ", hl: true }], part: "ـُونَ", meaning: "kaum muslimin itu rajin",
          extra: [X("الْمُعَلِّمُونَ نَشِيطُونَ", "para guru itu giat"), X("الطَّالِبُونَ مُجْتَهِدُونَ", "para siswa itu rajin"), X("الْمُدَرِّسُونَ مَاهِرُونَ", "para pengajar itu terampil")] },
        { name: "4. Jamak muannats salim", rule: "Mubtada' dan khabar sama-sama berakhiran ـَاتُ / ـَاتٌ. Tanda rafa'-nya dhammah.", segs: [{ t: "الْمُسْلِمَ" }, { t: "اتُ", hl: true }, { t: " مُجْتَهِدَ" }, { t: "اتٌ", hl: true }], part: "ـَاتُ + ـَاتٌ", meaning: "para muslimah itu rajin",
          extra: [X("الْمُعَلِّمَاتُ نَشِيطَاتٌ", "para guru perempuan itu giat"), X("الطَّالِبَاتُ مُجْتَهِدَاتٌ", "para siswi itu rajin"), X("الْمُمَرِّضَاتُ مَاهِرَاتٌ", "para perawat perempuan itu terampil")] },
      ],
    },
    {
      kind: "recap", title: "Rangkuman Pos 4: Ketentuan Mubtada' dan Khabar",
      intro: "Ingat empat ketentuan berikut setiap kali menyusun jumlah ismiyah.",
      points: [
        { head: "1. I'rab: rafa'", text: "Mubtada' dan khabar sama-sama rafa' (marfu'). Pada kata tunggal, tandanya dhammah atau tanwin dhammah.", examples: [X("الْبَيْتُ كَبِيرٌ", "rumah itu besar")] },
        { head: "2. Jenis: khabar mengikuti mubtada'", text: "Mubtada' mudzakkar memakai khabar mudzakkar. Mubtada' muannats memakai khabar muannats berakhiran ة.", examples: [X("الْقَلَمُ جَدِيدٌ", "pena itu baru"), X("الْمَدْرَسَةُ وَاسِعَةٌ", "sekolah itu luas")] },
        { head: "3. Mutsanna (dua)", text: "Mubtada' mutsanna memakai khabar mutsanna. Akhirannya ـَانِ (muannats: ـَتَانِ).", examples: [X("الْوَلَدَانِ نَشِيطَانِ", "dua anak laki-laki itu giat"), X("الْبِنْتَانِ نَشِيطَتَانِ", "dua anak perempuan itu giat")] },
        { head: "4. Jamak (lebih dari dua)", text: "Mubtada' jamak memakai khabar jamak. Jamak mudzakkar salim berakhiran ـُونَ, jamak muannats salim berakhiran ـَاتٌ.", examples: [X("الْمُسْلِمُونَ مُجْتَهِدُونَ", "kaum muslimin itu rajin"), X("الْمُسْلِمَاتُ مُجْتَهِدَاتٌ", "para muslimah itu rajin")] },
      ],
      tip: "Rumusnya: mubtada' dan khabar harus sama jenis, sama jumlah, dan sama-sama rafa'.",
    },
  ],
};

export const mubtadaSummaryRows = [
  { aspect: "Arti", a: "Subjek, yang sedang dibicarakan", b: "Predikat, keterangan tentang mubtada'" },
  { aspect: "Letak", a: "Di awal kalimat", b: "Setelah mubtada'" },
  { aspect: "Syarat", a: "Isim ma'rifat (diawali ال atau nama orang)", b: "Isim nakirah (bertanwin), tanpa ال" },
  { aspect: "I'rab", a: "Rafa': dhammah (ـُ)", b: "Rafa': tanwin dhammah (ـٌ)" },
  { aspect: "Ketentuan jenis dan jumlah", a: "Mudzakkar/muannats; mufrad, mutsanna, jamak", b: "Mengikuti mubtada' (muannats ة, mutsanna ـَانِ, jamak ـُونَ / ـَاتٌ)" },
  { aspect: "Contoh", a: "الْبَيْتُ (rumah itu)", b: "كَبِيرٌ (besar)" },
];

/* ============================================================
   DAFTAR MATERI (halaman Kumpulan Materi)
   ============================================================ */
export type MateriId = "mubtada" | "isimfiil";
export type Materi = {
  id: MateriId; no: string; arabic: string; title: string;
  adventure: string; mapSub: string; bubble: string; // teks pada peta
  positions: MapPosition[]; slides: Record<number, Slide[]>;
  summary: { title: string; head: [string, string]; rows: { aspect: string; a: string; b: string }[] };
  help: { b: string; t: string }[]; // langkah 3-5 pada jendela Cara Bermain
  sidekick: string; // keterangan tombol Ringkasan Materi
};

export const materiList: Materi[] = [
  {
    id: "isimfiil", no: "01", arabic: "الاِسْمُ وَالْفِعْلُ", title: "Isim dan Fi'il",
    adventure: "Isim dan Fi'il", mapSub: "الاِسْمُ وَالْفِعْلُ",
    bubble: "Ayo jelajahi rumah-rumah dan selesaikan misi untuk belajar isim dan fi'il!",
    positions: isimfiilPositions, slides: isimfiilSlides,
    summary: { title: "Ringkasan Isim dan Fi'il", head: ["Isim", "Fi'il"], rows: tableRows.map((r) => ({ aspect: r.aspect, a: r.isim, b: r.fiil })) },
    help: [
      { b: "Pos 1 sampai 3: baca materi.", t: "Pelajari isim, fi'il, dan perbedaannya, lalu kerjakan soal evaluasi." },
      { b: "Lihat kunci jawaban.", t: "Setiap pos menampilkan jawabanmu, jawaban yang benar, dan alasannya." },
      { b: "Pos 4 dan 5: uji dirimu.", t: "Soal evaluasi menyeluruh, lalu soal akhir yang lebih sulit." },
    ],
    sidekick: "Ciri isim dan fi'il yang sudah kamu pelajari",
  },
  {
    id: "mubtada", no: "02", arabic: "الْمُبْتَدَأُ وَالْخَبَرُ", title: "Mubtada' dan Khabar",
    adventure: "Mubtada' dan Khabar", mapSub: "الْمُبْتَدَأُ وَالْخَبَرُ",
    bubble: "Ayo selesaikan misi dan pahami susunan kalimatnya!",
    positions: mubtadaPositions, slides: mubtadaSlides,
    summary: { title: "Ringkasan Mubtada' dan Khabar", head: ["Mubtada'", "Khabar"], rows: mubtadaSummaryRows },
    help: [
      { b: "Pos 1 sampai 4: baca materi.", t: "Pelajari jumlah ismiyah, definisi, syarat, dan ketentuan mubtada' dan khabar, lalu kerjakan soal evaluasi." },
      { b: "Lihat kunci jawaban.", t: "Setiap pos menampilkan jawabanmu, jawaban yang benar, dan alasannya." },
      { b: "Pos 5: tantang dirimu.", t: "Soal akhir yang lebih sulit dari pos-pos sebelumnya." },
    ],
    sidekick: "Mubtada' dan khabar yang sudah kamu pelajari",
  },
];

export const materiById = Object.fromEntries(materiList.map((m) => [m.id, m])) as Record<MateriId, Materi>;
