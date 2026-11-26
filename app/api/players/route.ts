import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase-server";
import { hashPin, signToken } from "@/lib/auth";
import { loadHistory } from "@/lib/history";

// Masuk atau mendaftar: nama panggilan + kode kelas + PIN 4 angka.
// Jika nama dan kelas sudah ada, PIN harus cocok. Jika belum ada, murid baru dibuat.
export async function POST(request: Request) {
  let body: { nickname?: unknown; classCode?: unknown; pin?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 }); }

  const nickname = String(body.nickname ?? "").trim().slice(0, 30);
  const classCode = String(body.classCode ?? "").trim().toUpperCase().slice(0, 20) || "UMUM";
  const pin = String(body.pin ?? "").trim();
  if (!nickname) return NextResponse.json({ error: "Nama panggilan wajib diisi." }, { status: 400 });
  if (!/^\d{4}$/.test(pin)) return NextResponse.json({ error: "PIN harus 4 angka." }, { status: 400 });

  try {
    const db = supabaseAdmin();
    const key = nickname.toLowerCase();
    const { data: existing, error: findError } = await db
      .from("players").select("id,nickname,class_code,pin_hash")
      .eq("nickname_key", key).eq("class_code", classCode).maybeSingle();
    if (findError) throw findError;

    let playerId: string;
    let displayName = nickname;
    if (existing) {
      playerId = existing.id as string;
      displayName = existing.nickname as string;
      if (existing.pin_hash) {
        if (existing.pin_hash !== hashPin(pin, playerId)) {
          return NextResponse.json({ error: "PIN tidak cocok untuk nama dan kelas ini. Coba lagi, atau pakai nama panggilan lain." }, { status: 401 });
        }
      } else {
        const { error } = await db.from("players").update({ pin_hash: hashPin(pin, playerId) }).eq("id", playerId);
        if (error) throw error;
      }
    } else {
      playerId = randomUUID();
      const { error } = await db.from("players").insert({
        id: playerId, nickname, nickname_key: key, class_code: classCode, pin_hash: hashPin(pin, playerId),
      });
      if (error) throw error;
    }

    const attempts = await loadHistory(db, playerId);
    return NextResponse.json({
      ok: true,
      isNew: !existing,
      player: { id: playerId, nickname: displayName, classCode },
      token: signToken(playerId),
      attempts,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Basis data belum tersedia. Periksa konfigurasi Supabase." }, { status: 503 });
  }
}
