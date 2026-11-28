export type FiilTag = "madhi" | "mudhari" | "amr";
export type Word = { arabic: string; meaning: string; tag?: FiilTag };
export type Seg = { t: string; hl?: boolean };
export type Sign = { name: string; rule: string; segs: Seg[]; part: string; meaning: string };
export type WordGroup = { title: string; note?: string; tag?: FiilTag; words: Word[] };
export type PartWord = { ar: string; id: string };
// Satu kalimat jumlah ismiyah yang dipecah menjadi mubtada' dan khabar.
export type PartExample = { mubtada: PartWord; khabar: PartWord; meaning: string; note?: string };
export type Slide =
  | { kind: "definition"; title: string; arabic: string; text: string; examples: Word[] }
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
  { id: 1, title: "Rumah Ismiyah", subtitle: "Jumlah ismiyah = mubtada' + khabar", icon: "🏠", arabic: "الْجُمْلَةُ الاِسْمِيَّةُ", x: 15.6, y: 34.2, color: "#f5a623" },
  { id: 2, title: "Rumah Definisi", subtitle: "Definisi mubtada' dan khabar", icon: "🏡", arabic: "التَّعْرِيفُ", x: 46, y: 30.8, color: "#1e88e5" },
  { id: 3, title: "Balai Syarat", subtitle: "Syarat mubtada' dan khabar", icon: "📜", arabic: "الشُّرُوطُ", x: 82, y: 38.6, color: "#8e44ad" },
  { id: 4, title: "Kantor Implikasi", subtitle: "Marfu' dan kesesuaian jenis", icon: "🔎", arabic: "الْحُكْمُ", x: 40.5, y: 62.5, color: "#e03a5a" },
  { id: 5, title: "Taman Tantangan", subtitle: "Soal akhir yang lebih sulit", icon: "⛲", arabic: "التَّحَدِّي", x: 68, y: 70.8, color: "#00a38c" },
  { id: 6, title: "Dermaga Bintang", subtitle: "Skor setiap pos dan nilai akhir", icon: "⛵", arabic: "النَّتِيجَةُ", x: 65.4, y: 88.4, color: "#f2b01e" },
];

export const mubtadaSlides: Record<number, Slide[]> = {
  1: [
    {
      kind: "definition", title: "Jumlah Ismiyah itu Mubtada' dan Khabar", arabic: "الْجُمْلَةُ الاِسْمِيَّةُ",
      text: "Jumlah ismiyah adalah kalimat yang diawali dengan isim. Kalimat ini tersusun dari dua bagian, yaitu mubtada' dan khabar. Jadi, setiap kali kamu melihat jumlah ismiyah, carilah dua bagian itu.",
      examples: [
        { arabic: "الْبَيْتُ كَبِيرٌ", meaning: "Rumah itu besar" },
        { arabic: "أَحْمَدُ مُجْتَهِدٌ", meaning: "Ahmad rajin" },
        { arabic: "الْكِتَابُ جَدِيدٌ", meaning: "Buku itu baru" },
      ],
    },
    {
      kind: "parts", title: "Mubtada' = Subjek, Khabar = Predikat", showRoles: true,
      intro: "Ingat kalimat Indonesia \"Ahmad rajin\". Ahmad adalah yang sedang dibicarakan (subjek), sedangkan rajin adalah keterangan tentang Ahmad (predikat). Dalam bahasa Arab, subjek disebut mubtada' dan predikat disebut khabar.",
      items: [
        { mubtada: { ar: "أَحْمَدُ", id: "Ahmad" }, khabar: { ar: "مُجْتَهِدٌ", id: "rajin" }, meaning: "Ahmad rajin" },
        { mubtada: { ar: "الْبَيْتُ", id: "rumah itu" }, khabar: { ar: "كَبِيرٌ", id: "besar" }, meaning: "Rumah itu besar" },
      ],
      tip: "Cara mudah: tanya \"siapa atau apa yang dibicarakan?\" Jawabannya mubtada'. Lalu tanya \"bagaimana dia?\" Jawabannya khabar.",
    },
    {
      kind: "parts", title: "Contoh Mubtada' dan Khabar", showRoles: true,
      intro: "Perhatikan setiap kalimat. Biru adalah mubtada' (subjek), merah muda adalah khabar (predikat).",
      items: [
        { mubtada: { ar: "الْمَدْرَسَةُ", id: "sekolah itu" }, khabar: { ar: "وَاسِعَةٌ", id: "luas" }, meaning: "Sekolah itu luas" },
        { mubtada: { ar: "الطَّالِبُ", id: "siswa itu" }, khabar: { ar: "مُجْتَهِدٌ", id: "rajin" }, meaning: "Siswa itu rajin" },
        { mubtada: { ar: "الْمَاءُ", id: "air itu" }, khabar: { ar: "بَارِدٌ", id: "dingin" }, meaning: "Air itu dingin" },
        { mubtada: { ar: "الْقَلَمُ", id: "pena itu" }, khabar: { ar: "جَدِيدٌ", id: "baru" }, meaning: "Pena itu baru" },
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
      ],
    },
    {
      kind: "definition", title: "Definisi Khabar", arabic: "الْخَبَرُ",
      text: "Khabar adalah bagian yang menyempurnakan makna mubtada' (predikat). Ia memberi tahu keadaan atau keterangan tentang mubtada', dan letaknya setelah mubtada'.",
      examples: [
        { arabic: "كَبِيرٌ", meaning: "khabar pada: الْبَيْتُ كَبِيرٌ" },
        { arabic: "جَدِيدٌ", meaning: "khabar pada: الْكِتَابُ جَدِيدٌ" },
        { arabic: "مُجْتَهِدٌ", meaning: "khabar pada: أَحْمَدُ مُجْتَهِدٌ" },
      ],
    },
    {
      kind: "parts", title: "Contoh Mubtada' dan Khabar", showRoles: true,
      intro: "Temukan mubtada' di depan dan khabar di belakangnya pada setiap kalimat berikut.",
      items: [
        { mubtada: { ar: "الْوَلَدُ", id: "anak laki-laki itu" }, khabar: { ar: "ذَكِيٌّ", id: "pandai" }, meaning: "Anak laki-laki itu pandai" },
        { mubtada: { ar: "الْبِنْتُ", id: "anak perempuan itu" }, khabar: { ar: "نَشِيطَةٌ", id: "giat" }, meaning: "Anak perempuan itu giat" },
        { mubtada: { ar: "الدَّرْسُ", id: "pelajaran itu" }, khabar: { ar: "سَهْلٌ", id: "mudah" }, meaning: "Pelajaran itu mudah" },
        { mubtada: { ar: "الْمَسْجِدُ", id: "masjid itu" }, khabar: { ar: "نَظِيفٌ", id: "bersih" }, meaning: "Masjid itu bersih" },
      ],
    },
  ],
  3: [
    {
      kind: "signs", title: "Syarat Mubtada'",
      intro: "Syarat utama mubtada' adalah isim ma'rifat, yaitu isim yang sudah jelas atau tertentu. Perhatikan bagian merah sebagai penandanya.",
      items: [
        { name: "1. Berupa isim", rule: "Mubtada' harus isim, bukan fi'il dan bukan huruf.", segs: [{ t: "الْبَيْتُ", hl: true }, { t: " كَبِيرٌ" }], part: "الْبَيْتُ", meaning: "rumah itu besar" },
        { name: "2. Ma'rifat: dimasuki ال", rule: "Isim yang diawali ال sudah tertentu, sehingga ma'rifat.", segs: [{ t: "الْ", hl: true }, { t: "قَلَمُ" }], part: "الْ", meaning: "pena itu" },
        { name: "3. Ma'rifat: nama orang", rule: "Nama orang pasti tertentu, sehingga ma'rifat.", segs: [{ t: "أَحْمَدُ", hl: true }, { t: " مُجْتَهِدٌ" }], part: "أَحْمَدُ", meaning: "Ahmad rajin" },
        { name: "4. Ma'rifat: kata tunjuk", rule: "Kata tunjuk seperti هٰذَا (ini) dan هٰذِهِ (ini, perempuan) juga ma'rifat.", segs: [{ t: "هٰذَا", hl: true }, { t: " قَلَمٌ" }], part: "هٰذَا", meaning: "ini pena" },
      ],
    },
    {
      kind: "signs", title: "Syarat Khabar",
      intro: "Khabar pada umumnya berupa isim nakirah, yaitu isim yang belum tertentu dan ditandai tanwin. Perhatikan bagian merah sebagai penandanya.",
      items: [
        { name: "1. Berupa isim nakirah", rule: "Khabar tidak tertentu, sehingga bertanwin di akhirnya.", segs: [{ t: "كَبِي" }, { t: "رٌ", hl: true }], part: "رٌ", meaning: "(sesuatu yang) besar" },
        { name: "2. Tidak dimasuki ال", rule: "Jika diberi ال (الْكَبِيرُ), maknanya menjadi \"yang besar\" dan tidak lagi menjadi khabar.", segs: [{ t: "كَبِيرٌ", hl: true }], part: "كَبِيرٌ", meaning: "besar (tanpa ال)" },
        { name: "3. Letaknya setelah mubtada'", rule: "Mubtada' berada di depan, lalu khabar menyusul di belakangnya.", segs: [{ t: "الْبَيْتُ " }, { t: "كَبِيرٌ", hl: true }], part: "كَبِيرٌ", meaning: "rumah itu besar" },
      ],
    },
    {
      kind: "parts", title: "Contoh Syarat Mubtada' dan Khabar", showRoles: false,
      intro: "Lihat bagaimana setiap kalimat memenuhi syarat mubtada' (ma'rifat) dan khabar (nakirah).",
      items: [
        { mubtada: { ar: "الْكِتَابُ", id: "buku itu" }, khabar: { ar: "جَدِيدٌ", id: "baru" }, meaning: "Buku itu baru", note: "Mubtada' ma'rifat karena diawali ال. Khabar nakirah karena bertanwin." },
        { mubtada: { ar: "أَحْمَدُ", id: "Ahmad" }, khabar: { ar: "مُجْتَهِدٌ", id: "rajin" }, meaning: "Ahmad rajin", note: "Mubtada' ma'rifat karena nama orang. Khabar nakirah karena bertanwin." },
        { mubtada: { ar: "هٰذَا", id: "ini" }, khabar: { ar: "قَلَمٌ", id: "pena" }, meaning: "Ini pena", note: "Mubtada' ma'rifat karena kata tunjuk. Khabar nakirah karena bertanwin." },
      ],
    },
  ],
  4: [
    {
      kind: "signs", title: "Implikasi 1: Mubtada' dan Khabar Marfu'",
      intro: "Karena menjadi pokok kalimat, mubtada' dan khabar sama-sama marfu'. Marfu' artinya huruf terakhirnya berharakat dhammah atau tanwin dhammah. Perhatikan bagian merah.",
      items: [
        { name: "1. Mubtada' berakhiran dhammah", rule: "Mubtada' ma'rifat dibaca dhammah (ـُ) di akhir kata.", segs: [{ t: "الْبَيْ" }, { t: "تُ", hl: true }], part: "تُ", meaning: "rumah itu" },
        { name: "2. Khabar berakhiran tanwin dhammah", rule: "Khabar nakirah dibaca tanwin dhammah (ـٌ) di akhir kata.", segs: [{ t: "كَبِي" }, { t: "رٌ", hl: true }], part: "رٌ", meaning: "besar" },
        { name: "3. Keduanya marfu'", rule: "Dalam satu kalimat, kedua akhir kata itu sama-sama marfu'.", segs: [{ t: "الْبَيْ" }, { t: "تُ", hl: true }, { t: " كَبِي" }, { t: "رٌ", hl: true }], part: "تُ + رٌ", meaning: "rumah itu besar" },
        { name: "4. Nama orang juga marfu'", rule: "Mubtada' berupa nama orang tetap berakhiran dhammah.", segs: [{ t: "أَحْمَ" }, { t: "دُ", hl: true }, { t: " مُجْتَهِ" }, { t: "دٌ", hl: true }], part: "دُ + دٌ", meaning: "Ahmad rajin" },
      ],
    },
    {
      kind: "signs", title: "Implikasi 2: Khabar Sesuai Jenis Mubtada'",
      intro: "Khabar mengikuti jenis mubtada'. Mubtada' mudzakkar (maskulin) memakai khabar mudzakkar. Mubtada' muannats (feminin) memakai khabar muannats yang berakhiran ة.",
      items: [
        { name: "1. Mubtada' mudzakkar", rule: "Khabar juga mudzakkar, tanpa ة di akhirnya.", segs: [{ t: "الْقَلَمُ " }, { t: "جَدِيدٌ", hl: true }], part: "جَدِيدٌ", meaning: "pena itu baru" },
        { name: "2. Mubtada' muannats", rule: "Khabar ikut muannats, ditandai ة di akhirnya.", segs: [{ t: "السَّيَّارَةُ جَدِيدَ" }, { t: "ةٌ", hl: true }], part: "ةٌ", meaning: "mobil itu baru" },
        { name: "3. Muannats untuk perempuan", rule: "Anak perempuan (الْبِنْتُ) adalah muannats, maka khabarnya berakhiran ة.", segs: [{ t: "الْبِنْتُ نَشِيطَ" }, { t: "ةٌ", hl: true }], part: "ةٌ", meaning: "anak perempuan itu giat" },
      ],
    },
    {
      kind: "parts", title: "Contoh Lengkap: Marfu' dan Sesuai Jenis", showRoles: false,
      intro: "Setiap kalimat berikut memiliki mubtada' dan khabar yang marfu' serta sama jenisnya.",
      items: [
        { mubtada: { ar: "الْوَلَدُ", id: "anak laki-laki itu" }, khabar: { ar: "نَشِيطٌ", id: "giat" }, meaning: "Anak laki-laki itu giat", note: "Keduanya marfu'. Mudzakkar dengan mudzakkar." },
        { mubtada: { ar: "الْبِنْتُ", id: "anak perempuan itu" }, khabar: { ar: "نَشِيطَةٌ", id: "giat" }, meaning: "Anak perempuan itu giat", note: "Keduanya marfu'. Muannats dengan muannats (ة)." },
        { mubtada: { ar: "الْمَسْجِدُ", id: "masjid itu" }, khabar: { ar: "نَظِيفٌ", id: "bersih" }, meaning: "Masjid itu bersih", note: "Keduanya marfu'. Mudzakkar dengan mudzakkar." },
        { mubtada: { ar: "الْحَدِيقَةُ", id: "taman itu" }, khabar: { ar: "جَمِيلَةٌ", id: "indah" }, meaning: "Taman itu indah", note: "Keduanya marfu'. Muannats dengan muannats (ة)." },
      ],
    },
  ],
};

export const mubtadaSummaryRows = [
  { aspect: "Arti", a: "Subjek, yang sedang dibicarakan", b: "Predikat, keterangan tentang mubtada'" },
  { aspect: "Letak", a: "Di awal kalimat", b: "Setelah mubtada'" },
  { aspect: "Syarat", a: "Isim ma'rifat (ال, nama orang, kata tunjuk)", b: "Isim nakirah (bertanwin), tanpa ال" },
  { aspect: "Harakat akhir", a: "Marfu': dhammah (ـُ)", b: "Marfu': tanwin dhammah (ـٌ)" },
  { aspect: "Kesesuaian jenis", a: "Mudzakkar atau muannats", b: "Mengikuti mubtada' (muannats berakhiran ة)" },
  { aspect: "Contoh", a: "الْبَيْتُ (rumah itu)", b: "كَبِيرٌ (besar)" },
];

/* ============================================================
   DAFTAR MATERI (halaman Kumpulan Materi)
   ============================================================ */
export type MateriId = "mubtada" | "isimfiil";
export type MateriTheme = "green" | "blue" | "purple" | "mint";
export type Materi = {
  id: MateriId; no: string; theme: MateriTheme; img: string;
  arabic: string; title: string; line: string; lineArabic?: boolean; // baris di bawah judul
  adventure: string; mapSub: string; bubble: string; // teks pada peta
  positions: MapPosition[]; slides: Record<number, Slide[]>;
  summary: { title: string; head: [string, string]; rows: { aspect: string; a: string; b: string }[] };
  help: { b: string; t: string }[]; // langkah 3-5 pada jendela Cara Bermain
  sidekick: string; // keterangan tombol Ringkasan Materi
};

export const materiList: Materi[] = [
  {
    id: "mubtada", no: "01", theme: "green", img: "/images/materi/m-mubtada.jpg",
    arabic: "مُبْتَدَأٌ وَخَبَرٌ", title: "Mubtada' dan Khabar", line: "الْجُمْلَةُ الاِسْمِيَّةُ", lineArabic: true,
    adventure: "Petualangan Mubtada' dan Khabar", mapSub: "Mengenal jumlah ismiyah",
    bubble: "Ayo jelajahi rumah-rumah dan selesaikan misi untuk belajar mubtada' dan khabar!",
    positions: mubtadaPositions, slides: mubtadaSlides,
    summary: { title: "Ringkasan Mubtada' dan Khabar", head: ["Mubtada'", "Khabar"], rows: mubtadaSummaryRows },
    help: [
      { b: "Pos 1 sampai 4: baca materi.", t: "Pelajari jumlah ismiyah, definisi, syarat, dan implikasi mubtada' dan khabar, lalu kerjakan soal evaluasi." },
      { b: "Lihat kunci jawaban.", t: "Setiap pos menampilkan jawabanmu, jawaban yang benar, dan alasannya." },
      { b: "Pos 5: tantang dirimu.", t: "Soal akhir yang lebih sulit dari pos-pos sebelumnya." },
    ],
    sidekick: "Mubtada' dan khabar yang sudah kamu pelajari",
  },
  {
    id: "isimfiil", no: "02", theme: "blue", img: "/images/materi/m-isimfiil.jpg",
    arabic: "إِسْمٌ وَفِعْلٌ", title: "Isim dan Fi'il", line: "Membedakan kata benda dan kata kerja.",
    adventure: "Petualangan Isim dan Fi'il", mapSub: "Mengenal Isim dan Fi'il",
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
];

// Kartu pada halaman Kumpulan Materi yang belum tersedia (tampil sebagai "Segera Hadir").
export const comingSoon = [
  { no: "03", theme: "purple" as MateriTheme, img: "/images/materi/m-nat.jpg", arabic: "النَّعْتُ والْمَنْعُوتُ", title: "Na't dan Man'ut", line: "Mengenal kata sifat dan yang disifati." },
  { no: "04", theme: "mint" as MateriTheme, img: "/images/materi/m-mudhaf.jpg", arabic: "المُضَافُ وَالمُضَافُ إِلَيْهِ", title: "Mudhaf dan Mudhaf Ilaih", line: "Mengenal hubungan kepemilikan." },
];

export const materiById = Object.fromEntries(materiList.map((m) => [m.id, m])) as Record<MateriId, Materi>;
