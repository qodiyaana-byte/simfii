# Simfii: Media Belajar Nahwu

Media pembelajaran bahasa Arab kelas VII. Setelah masuk, murid memilih materi di halaman **Kumpulan Materi**, lalu menjelajahi enam pos petualangan pada peta desa. Materi yang tersedia: **Mubtada' dan Khabar** (الْجُمْلَةُ الاِسْمِيَّةُ) dan **Isim dan Fi'il**.

## Kumpulan Materi

Halaman ini tampil setelah murid masuk. Tampilannya memakai gambar `public/images/kumpulan-materi.jpg`; tombol, menu atas dan bawah, serta progres pos digambar di atasnya (letaknya di `HUB` pada `lib/maplayout.ts`). Baris di bawah judul kartu Mubtada' diganti dengan الْجُمْلَةُ الاِسْمِيَّةُ. Materi 01 adalah Isim dan Fi'il, Materi 02 adalah Mubtada' dan Khabar. Untuk menambah materi baru: tambahkan posisi, slide, dan soal (id soal diawali satu huruf unik), daftarkan di `materiList` (`lib/content.ts`), lalu tambahkan tata letak peta di `lib/maplayout.ts`.

Peta tiap materi memakai gambar sendiri: `peta-isimfiil.jpg` (label nama digambar ulang di atas gambar) dan `peta-mubtada.jpg` (label bawaan gambar dipakai: Rumah Siswa, Warung, Pos Satpam, Pos Ronda, Jembatan, Sekolah; status kunci/selesai tampil pada bintang label).

## Materi 01: Mubtada' dan Khabar

Susunan pos sama persis dengan materi Isim dan Fi'il (peta, tata letak, evaluasi, dan skor sama).

| Pos | Isi | Soal |
| --- | --- | --- |
| 1. Rumah Siswa | Jumlah ismiyah = mubtada' + khabar; mubtada' sebagai subjek dan khabar sebagai predikat; contoh | 5 |
| 2. Warung | Definisi mubtada'; definisi khabar; contoh | 5 |
| 3. Pos Satpam | Syarat mubtada' (isim ma'rifat); syarat khabar; contoh | 7 |
| 4. Pos Ronda | Mubtada' dan khabar marfu'; khabar sesuai jenis mubtada'; contoh | 6 |
| 5. Jembatan | Soal akhir, satu tingkat lebih sulit | 7 |
| 6. Sekolah | Skor tiap pos, nilai akhir /100, dan bintang | - |

Nilai tiap materi dihitung terpisah (30 soal per materi). Soal Mubtada' memakai id `m1-01` dst., soal Isim dan Fi'il memakai `p1-01` dst.

## Materi 02: Isim dan Fi'il

| Pos | Isi | Soal |
| --- | --- | --- |
| 1. Rumah Isim | Definisi isim, ciri-ciri, contoh mufradat beserta arti, lalu evaluasi | 5 |
| 2. Rumah Fi'il | Definisi fi'il, tanda fi'il madhi, tanda fi'il mudhari', tanda fi'il amr (masing-masing satu halaman), mufradat per jenis fi'il, lalu evaluasi | 5 |
| 3. Balai Peta Konsep | Peta konsep perbedaan isim dan fi'il, tabel perbedaan, lalu evaluasi | 7 |
| 4. Kantor Detektif | Evaluasi keseluruhan materi | 6 |
| 5. Taman Tantangan | Soal akhir, satu tingkat lebih sulit dari Pos 4 | 7 |
| 6. Dermaga Bintang | Skor tiap pos, nilai akhir /100, dan bintang | - |

Seluruh halaman, termasuk halaman awal dan peta, dibentangkan penuh mengikuti lebar layar tanpa sisi kosong. Tinggi mengikuti rasio gambar sehingga halaman digulir ke bawah jika perlu. Di layar yang sangat sempit (HP posisi berdiri), peta dan halaman awal bisa digeser ke samping agar tulisannya tetap terbaca. Halaman awal memakai gambar `public/images/halaman-awal.jpg` (karakter detektif, judul Simfii, tombol Mulai Petualangan) dengan papan Cara Bermain. Peta memakai gambar `public/images/peta-desa.jpg` sebagai latar. Pos 1 sampai 4 adalah rumah, Pos 5 taman dengan air mancur, dan Pos 6 dermaga perahu. Tata letak label ada di `lib/maplayout.ts`. Setiap pos bisa diklik, dengan transisi zoom saat masuk. Tidak ada fitur audio.
Setelah setiap evaluasi tampil kunci jawaban: jawaban siswa, jawaban yang benar, dan alasannya.
Nilai akhir = jawaban benar dari 30 soal dibagi 30 dikali 100. Setiap 20 poin mengisi satu bintang (5 bintang = 100).
Teks soal dan alasan ada di `lib/questions.ts`; materi, peta konsep, dan tabel ada di `lib/content.ts`.

Catatan: file `page.tsx`, `content.ts`, `questions.ts`, `globals.css`, dan sejenisnya yang berada di akar proyek adalah salinan lama dan tidak dipakai aplikasi. Yang dipakai ada di folder `app/` dan `lib/`.

## Dashboard

- **Dashboard Murid** (di dalam aplikasi, tombol "📊 Dashboard Saya" di peta dan di layar skor, serta "📊 Dashboard" di bilah atas; pilih materi lewat tombol di bagian atas): nilai terakhir dan terbaik, nilai per pos, kemampuan per materi, saran belajar, soal yang perlu diulang, perkembangan, dan riwayat percobaan.
- **Dashboard Guru** (`/guru`, butuh token; pilih materi lewat menu "Materi"): ringkasan kelas, daftar murid dengan nilai per pos dan status tuntas/remedial (KKM bisa diubah), detail jawaban per murid, analisis soal tersulit beserta jawaban salah terbanyak, dan unduh rekap CSV. Tombol "Lihat contoh tampilan" menampilkan data contoh tanpa database.
- Murid masuk dengan **nama panggilan + kode kelas + PIN 4 angka**. Pasangan yang sama akan membuka kembali riwayatnya. Tanpa database, aplikasi tetap berjalan dalam mode offline (nilai tidak tersimpan).

## Database (Supabase)

1. Buat akun di supabase.com, lalu **New project** (pilih region Singapore). Catat password database.
2. Buka **SQL Editor > New query**, tempel seluruh isi `supabase/schema.sql`, klik **Run**. Aman dijalankan berulang kali.
3. Buka **Project Settings > API**. Salin **Project URL**, **anon public key**, dan **service_role key**.
4. Di Vercel: **Settings > Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (rahasia, jangan dibagikan atau ditulis di kode)
   - `TEACHER_DASHBOARD_TOKEN` (kata sandi dashboard guru, buat yang panjang)
   - `SESSION_SECRET` (opsional, string acak panjang)
5. **Redeploy** proyek di Vercel.
6. Uji: daftar sebagai murid, selesaikan Pos 1 sampai 5, lalu cek tabel `attempts` di **Table Editor** Supabase dan buka `/guru`.

Catatan: proyek Supabase gratis akan dijeda jika tidak dipakai sekitar seminggu; aktifkan kembali dari dashboard Supabase.

## Cara deploy (GitHub lalu Vercel)

1. Ekstrak zip. Upload ISI folder ke GitHub lewat Add file > Upload files, sehingga `package.json`, `app`, `lib`, dan `public` berada langsung di akar repo (bukan di dalam subfolder).
2. Di Vercel, import repo tersebut. Framework akan terdeteksi sebagai Next.js.
3. Isi Environment Variables dan jalankan skema database sesuai bagian "Database (Supabase)" di atas.

Tanpa Supabase, permainan tetap berjalan dan nilai tampil di perangkat siswa, tetapi hasil tidak tersimpan ke Ruang Guru (`/guru`).

## Lokal

```bash
npm install
cp .env.example .env.local
npm run dev
```

Gunakan Node.js 20.9 atau lebih baru.
