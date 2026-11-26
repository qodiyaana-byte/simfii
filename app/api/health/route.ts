import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Halaman pengecek sementara. Hapus file ini setelah masalah selesai.
// Tidak menampilkan isi kunci, hanya hasil pemeriksaan.
export const dynamic = "force-dynamic";

function keyType(key: string): string {
  if (key.startsWith("sb_secret_")) return "secret key (benar)";
  if (key.startsWith("sb_publishable_")) return "publishable key (SALAH, harus secret/service_role)";
  try {
    const payload = JSON.parse(Buffer.from(key.split(".")[1], "base64").toString());
    if (payload.role === "service_role") return "service_role (benar)";
    if (payload.role === "anon") return "anon (SALAH, harus service_role)";
    return `role tidak dikenal: ${payload.role}`;
  } catch {
    return "bentuk kunci tidak dikenali";
  }
}

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const report: Record<string, unknown> = {
    NEXT_PUBLIC_SUPABASE_URL: url ? "ada" : "KOSONG",
    SUPABASE_SERVICE_ROLE_KEY: key ? "ada" : "KOSONG",
    SESSION_SECRET: process.env.SESSION_SECRET ? "ada" : "kosong (tidak apa-apa, memakai service key)",
    TEACHER_DASHBOARD_TOKEN: process.env.TEACHER_DASHBOARD_TOKEN ? "ada" : "KOSONG",
  };

  if (url) {
    report.bentuk_url = /^https:\/\/[a-z0-9]+\.supabase\.co$/.test(url)
      ? "benar"
      : "SALAH (harus seperti https://xxxx.supabase.co, tanpa garis miring atau tambahan di akhir)";
  }
  if (key) report.jenis_kunci = keyType(key.trim());
  if (key && key !== key.trim()) report.peringatan_kunci = "Ada spasi atau enter di awal/akhir kunci";

  if (url && key) {
    try {
      const db = createClient(url.trim(), key.trim(), { auth: { persistSession: false } });
      for (const table of ["players", "attempts", "attempt_answers"]) {
        const { error } = await db.from(table).select("*", { count: "exact", head: true });
        report[`tabel_${table}`] = error ? `ERROR: ${error.message}` : "bisa dibaca";
      }
      const { error: colError } = await db.from("players").select("pin_hash,nickname_key").limit(1);
      report.kolom_pin_hash_nickname_key = colError ? `ERROR: ${colError.message}` : "ada";
    } catch (e) {
      report.koneksi = `GAGAL: ${e instanceof Error ? e.message : String(e)}`;
    }
  }

  return NextResponse.json(report, { status: 200 });
}
