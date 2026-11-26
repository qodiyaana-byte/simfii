import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { bearer, verifyToken } from "@/lib/auth";
import { loadHistory } from "@/lib/history";

// Riwayat percobaan milik murid yang sedang masuk (dashboard murid).
export async function GET(request: Request) {
  try {
    const playerId = verifyToken(bearer(request));
    if (!playerId) return NextResponse.json({ error: "Sesi tidak valid. Silakan masuk kembali." }, { status: 401 });
    const db = supabaseAdmin();
    const { data: player, error } = await db.from("players").select("id,nickname,class_code").eq("id", playerId).maybeSingle();
    if (error) throw error;
    if (!player) return NextResponse.json({ error: "Murid tidak ditemukan." }, { status: 404 });
    const attempts = await loadHistory(db, playerId);
    return NextResponse.json({ ok: true, player: { id: player.id, nickname: player.nickname, classCode: player.class_code }, attempts });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Riwayat belum dapat dimuat." }, { status: 503 });
  }
}
