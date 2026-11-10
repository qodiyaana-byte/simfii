export type Question = {
  id: string;
  position: 1 | 2 | 3 | 4 | 5;
  category: "isim" | "fiil" | "beda" | "campuran";
  prompt: string;
  options: string[]; // urutan sesuai tampilan (A, B, C, ...)
  answer: string;
  reason: string;
};

// answerIndex = urutan pilihan yang benar (0 = A, 1 = B, 2 = C, 3 = D)
const q = (
  id: string, position: Question["position"], category: Question["category"],
  prompt: string, options: string[], answerIndex: number, reason: string
): Question => ({ id, position, category, prompt, options, answer: options[answerIndex], reason });

export const questions: Question[] = [
  // POS 1: Isim (5 soal)
  q("p1-01", 1, "isim", "Manakah pengertian isim yang tepat?",
    ["Kata yang menunjukkan pekerjaan dan terikat waktu", "Kata yang menunjukkan nama orang, benda, atau tempat dan tidak terikat waktu", "Kata yang hanya digunakan untuk memanggil"], 1,
    "Isim menunjukkan nama (orang, benda, tempat, sifat) dengan makna yang berdiri sendiri, tanpa terikat waktu. Kata yang menunjukkan pekerjaan dan terikat waktu adalah fi'il."),
  q("p1-02", 1, "isim", "Manakah kata yang termasuk isim?",
    ["كِتَابٌ", "يَكْتُبُ", "قَدْ"], 0,
    "كِتَابٌ (buku) bertanwin dan menunjukkan nama benda, sehingga termasuk isim. يَكْتُبُ adalah fi'il, sedangkan قَدْ adalah huruf."),
  q("p1-03", 1, "isim", "Apa arti kata مَدْرَسَةٌ?",
    ["Pasar", "Masjid", "Sekolah"], 2,
    "مَدْرَسَةٌ berarti sekolah. Kata ini merupakan isim karena menunjukkan nama tempat dan bertanwin."),
  q("p1-04", 1, "isim", "Kata manakah yang termasuk isim karena dimasuki alif lam (ال)?",
    ["كِتَابٌ", "يَقْرَأُ", "الْقَلَمُ"], 2,
    "الْقَلَمُ (pena itu) diawali ال, yaitu salah satu ciri isim. كِتَابٌ memang isim, tetapi cirinya tanwin, bukan alif lam. يَقْرَأُ adalah fi'il."),
  q("p1-05", 1, "isim", "Pada ungkapan فِي الْبَيْتِ, kata الْبَيْتِ termasuk isim karena ...",
    ["Didahului قَدْ", "Didahului huruf jar فِي dan dimasuki ال", "Bertemu ta' fa'il (تُ)"], 1,
    "الْبَيْتِ didahului huruf jar فِي dan memiliki ال; keduanya ciri isim. قَدْ dan ta' fa'il adalah tanda fi'il."),

  // POS 2: Fi'il (5 soal)
  q("p2-01", 2, "fiil", "Manakah pengertian fi'il yang tepat?",
    ["Kata yang menunjukkan nama benda dan tidak terikat waktu", "Kata yang selalu diawali alif lam", "Kata yang menunjukkan pekerjaan atau kejadian dan terikat waktu"], 2,
    "Fi'il menunjukkan pekerjaan atau kejadian yang berkaitan dengan waktu (lampau, sekarang/akan datang, atau perintah)."),
  q("p2-02", 2, "fiil", "Manakah kata yang termasuk fi'il?",
    ["مَاءٌ", "يَشْرَبُ", "الْبَيْتُ"], 1,
    "يَشْرَبُ berarti minum, yaitu pekerjaan. مَاءٌ (air) dan الْبَيْتُ (rumah itu) adalah isim."),
  q("p2-03", 2, "fiil", "Apa arti kata كَتَبَ?",
    ["Telah makan", "Telah menulis", "Telah membaca"], 1,
    "كَتَبَ adalah fi'il madhi (lampau) yang berarti telah menulis. Telah membaca adalah قَرَأَ, telah makan adalah أَكَلَ."),
  q("p2-04", 2, "fiil", "Pada kata كَتَبَتْ, tanda fi'il yang tampak adalah ...",
    ["Ta' ta'nits sakinah (تْ)", "Alif lam (ال)", "Tanwin"], 0,
    "Akhiran تْ pada كَتَبَتْ adalah ta' ta'nits sakinah, tanda fi'il. Alif lam dan tanwin adalah ciri isim."),
  q("p2-05", 2, "fiil", "Manakah fi'il yang berarti \"akan membaca\"?",
    ["قَرَأَ", "الْقِرَاءَةُ", "سَيَقْرَأُ"], 2,
    "Awalan سَ menunjukkan waktu yang akan datang, sehingga سَيَقْرَأُ berarti akan membaca. قَرَأَ berarti telah membaca (lampau), dan الْقِرَاءَةُ adalah isim (bacaan)."),

  // POS 3: Perbedaan isim dan fi'il (7 soal)
  q("p3-01", 3, "beda", "Apa perbedaan utama isim dan fi'il?",
    ["Isim terikat waktu, fi'il tidak terikat waktu", "Isim dan fi'il sama-sama tidak terikat waktu", "Isim tidak terikat waktu, fi'il terikat waktu"], 2,
    "Fi'il selalu menunjukkan waktu (lampau, sekarang/akan datang, perintah), sedangkan isim hanya menunjukkan nama atau sifat tanpa waktu."),
  q("p3-02", 3, "beda", "Kata berikut yang dapat bertanwin adalah ...",
    ["يَكْتُبُ", "كِتَابٌ", "ذَهَبَ"], 1,
    "Tanwin adalah ciri isim. كِتَابٌ adalah isim, sedangkan يَكْتُبُ dan ذَهَبَ adalah fi'il yang tidak menerima tanwin."),
  q("p3-03", 3, "beda", "Kata قَرَأَ termasuk ...",
    ["Fi'il", "Isim", "Huruf"], 0,
    "قَرَأَ berarti telah membaca (pekerjaan di masa lampau) dan dapat bertemu ta' ta'nits sakinah menjadi قَرَأَتْ. Jadi termasuk fi'il."),
  q("p3-04", 3, "beda", "Kata الْمَدْرَسَةُ termasuk ...",
    ["Fi'il karena menunjukkan pekerjaan", "Isim karena dimasuki ال", "Fi'il karena berharakat dhammah"], 1,
    "الْمَدْرَسَةُ (sekolah itu) menunjukkan nama tempat dan diawali ال. Alif lam adalah ciri isim."),
  q("p3-05", 3, "beda", "Manakah pasangan kata dan jenisnya yang benar?",
    ["قَلَمٌ = fi'il, يَجْلِسُ = isim", "قَلَمٌ = isim, يَجْلِسُ = fi'il", "قَلَمٌ = fi'il, يَجْلِسُ = fi'il"], 1,
    "قَلَمٌ (pena) adalah nama benda sehingga isim. يَجْلِسُ (duduk) adalah pekerjaan sehingga fi'il."),
  q("p3-06", 3, "beda", "Tanda yang hanya dimiliki oleh fi'il adalah ...",
    ["Didahului قَدْ atau سَوْفَ", "Dimasuki alif lam", "Bertanwin"], 0,
    "قَدْ dan سَوْفَ (juga سَ) hanya dapat mendahului fi'il. Alif lam dan tanwin adalah ciri isim."),
  q("p3-07", 3, "beda", "Pada kalimat سَيَذْهَبُ الطَّالِبُ إِلَى الْمَدْرَسَةِ, kata yang termasuk fi'il adalah ...",
    ["الطَّالِبُ", "سَيَذْهَبُ", "الْمَدْرَسَةِ"], 1,
    "سَيَذْهَبُ diawali سَ (tanda fi'il) dan berarti akan pergi. الطَّالِبُ dan الْمَدْرَسَةِ diawali ال sehingga isim."),

  // POS 4: Evaluasi keseluruhan (6 soal)
  q("p4-01", 4, "campuran", "Apa arti kata يَقْرَأُ dan termasuk jenis kata apa?",
    ["Buku — isim", "Membaca — isim", "Membaca — fi'il"], 2,
    "يَقْرَأُ berarti membaca dan menunjukkan pekerjaan, sehingga fi'il. Kata untuk buku adalah كِتَابٌ (isim)."),
  q("p4-02", 4, "campuran", "Manakah isim yang berarti air?",
    ["يَشْرَبُ", "مَاءٌ", "شَرِبَ"], 1,
    "مَاءٌ berarti air dan merupakan isim. يَشْرَبُ dan شَرِبَ (minum) adalah fi'il."),
  q("p4-03", 4, "campuran", "Kata ذَهَبَ termasuk fi'il karena dapat ...",
    ["Ditambah ta sukun (تْ) sehingga menjadi dzahabat (ذَهَبَتْ)", "Ditambah alif lam (ال) sehingga menjadi adz-dzahabu (الذَّهَبُ)", "Ditambah tanwin sehingga menjadi dzahabun (ذَهَبٌ)"], 0,
    "ذَهَبَ dapat bertemu ta' ta'nits sakinah (ta sukun) menjadi ذَهَبَتْ, dan itu tanda fi'il. Alif lam dan tanwin adalah ciri isim."),
  q("p4-04", 4, "campuran", "Pada ungkapan فِي الْبَيْتِ, kata yang termasuk isim adalah ...",
    ["فِي", "قَدْ", "الْبَيْتِ"], 2,
    "الْبَيْتِ (rumah itu) adalah isim. فِي adalah huruf jar, bukan isim maupun fi'il."),
  q("p4-05", 4, "campuran", "Pernyataan yang benar tentang fi'il adalah ...",
    ["Fi'il selalu bertanwin", "Fi'il menunjukkan pekerjaan dan waktu terjadinya", "Fi'il tidak pernah terikat waktu"], 1,
    "Fi'il adalah kata yang menunjukkan pekerjaan atau kejadian beserta waktunya. Fi'il tidak bertanwin dan selalu terikat waktu."),
  q("p4-06", 4, "campuran", "Pada kalimat يَكْتُبُ الطَّالِبُ الدَّرْسَ (Siswa menulis pelajaran), ada berapa isim?",
    ["1", "2", "3"], 1,
    "الطَّالِبُ dan الدَّرْسَ adalah isim karena diawali ال, jadi ada 2 isim. يَكْتُبُ adalah satu-satunya fi'il."),

  // POS 5: Soal akhir, satu tingkat lebih sulit (7 soal)
  q("p5-01", 5, "campuran", "Pada kalimat كَتَبَ الْوَلَدُ رِسَالَةً (Anak itu telah menulis surat), ada berapa isim dan fi'il?",
    ["1 isim dan 2 fi'il", "3 isim dan 0 fi'il", "2 isim dan 1 fi'il"], 2,
    "كَتَبَ adalah fi'il. الْوَلَدُ (diawali ال) dan رِسَالَةً (bertanwin) adalah isim. Jadi ada 2 isim dan 1 fi'il."),
  q("p5-02", 5, "campuran", "Pada kalimat سَوْفَ يَذْهَبُ أَبِي إِلَى السُّوقِ, manakah yang termasuk fi'il?",
    ["سَوْفَ", "السُّوقِ", "يَذْهَبُ"], 2,
    "يَذْهَبُ (akan pergi) adalah fi'il. سَوْفَ hanya tanda waktu yang akan datang, sedangkan السُّوقِ adalah isim."),
  q("p5-03", 5, "campuran", "Pada سَوْفَ يَقْرَأُ, kata سَوْفَ berfungsi sebagai ...",
    ["Tanda fi'il yang menunjukkan waktu akan datang", "Isim karena didahului huruf jar", "Fi'il madhi"], 0,
    "سَوْفَ bukan fi'il itu sendiri. Ia adalah tanda yang mendahului fi'il mudhari' dan menunjukkan waktu yang akan datang."),
  q("p5-04", 5, "campuran", "Apa arti جَلَسَتِ الْبِنْتُ فِي الْغُرْفَةِ?",
    ["Anak perempuan itu akan duduk di kamar", "Anak perempuan itu telah duduk di kamar", "Anak perempuan itu sedang tidur di kamar"], 1,
    "جَلَسَتْ adalah fi'il madhi dengan ta' ta'nits sakinah yang berarti dia (perempuan) telah duduk. Tidak ada tanda waktu yang akan datang dan tidak ada kata tidur."),
  q("p5-05", 5, "campuran", "Manakah kata yang bukan isim?",
    ["مَدْرَسَةٌ", "الطَّالِبُ", "بَيْتٌ", "يَدْرُسُ"], 3,
    "يَدْرُسُ berarti belajar dan merupakan fi'il. Tiga kata lainnya adalah isim: مَدْرَسَةٌ (bertanwin), الطَّالِبُ (diawali ال), بَيْتٌ (bertanwin)."),
  q("p5-06", 5, "campuran", "Mengapa كَاتِبٌ (penulis) termasuk isim, sedangkan كَتَبَ (telah menulis) termasuk fi'il?",
    ["كَاتِبٌ menunjukkan pekerjaan; كَتَبَ menunjukkan nama orang", "كَاتِبٌ bertanwin dan tidak menunjukkan waktu; كَتَبَ menunjukkan pekerjaan yang telah terjadi", "Keduanya fi'il karena berasal dari huruf yang sama"], 1,
    "كَاتِبٌ adalah nama pelaku dan bertanwin (ciri isim), tanpa menunjukkan waktu. كَتَبَ menunjukkan pekerjaan menulis yang sudah terjadi (ciri fi'il)."),
  q("p5-07", 5, "campuran", "Kalimat manakah yang semua katanya isim?",
    ["يَكْتُبُ الطَّالِبُ", "هٰذَا بَيْتٌ كَبِيرٌ", "سَيَذْهَبُ أَبِي"], 1,
    "هٰذَا (ini, kata tunjuk), بَيْتٌ (rumah), dan كَبِيرٌ (besar) semuanya isim. Dua kalimat lainnya mengandung fi'il: يَكْتُبُ dan سَيَذْهَبُ."),
];
