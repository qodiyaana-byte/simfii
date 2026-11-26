-- ============================================================
-- Simfii: skema basis data (Supabase > SQL Editor > New query > paste > Run)
-- Aman dijalankan berulang kali. Cocok untuk proyek baru maupun yang sudah punya tabel lama.
-- ============================================================
create extension if not exists pgcrypto;

-- 1) Murid -----------------------------------------------------
create table if not exists public.players (
  id uuid primary key,
  nickname text not null check (char_length(nickname) <= 30),
  class_code text not null default 'UMUM' check (char_length(class_code) <= 20),
  created_at timestamptz not null default now()
);
-- kolom tambahan untuk masuk kembali memakai nama + kelas + PIN
alter table public.players add column if not exists nickname_key text;
alter table public.players add column if not exists pin_hash text;
update public.players set nickname_key = lower(nickname) where nickname_key is null;
-- satu murid = satu pasang (nama, kelas); jika ada data ganda lama, hapus dulu yang ganda
create unique index if not exists players_nickname_class_uidx on public.players (nickname_key, class_code);

-- 2) Percobaan (satu kali menyelesaikan Pos 1-5) ------------------
create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  score integer not null default 0,
  total integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists attempts_player_idx on public.attempts (player_id, created_at desc);
create index if not exists attempts_created_idx on public.attempts (created_at desc);

-- 3) Jawaban per soal ----------------------------------------
create table if not exists public.attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.attempts(id) on delete cascade,
  question_id text not null,
  category text not null,
  answer text not null,
  correct boolean not null default false
);
create index if not exists attempt_answers_attempt_idx on public.attempt_answers (attempt_id);

-- 4) Keamanan ------------------------------------------------
-- Semua akses lewat API server memakai service-role key (tidak pernah dikirim ke browser).
-- RLS diaktifkan tanpa kebijakan publik, sehingga tabel tidak bisa dibaca lewat anon key.
alter table public.players enable row level security;
alter table public.attempts enable row level security;
alter table public.attempt_answers enable row level security;
