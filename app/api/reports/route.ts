import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// Laporan untuk dashboard guru. Dilindungi TEACHER_DASHBOARD_TOKEN.
export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!process.env.TEACHER_DASHBOARD_TOKEN || token !== process.env.TEACHER_DASHBOARD_TOKEN) {
    return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 401 });
  }
  try {
    const db = supabaseAdmin();
    const rows: unknown[] = [];
    const pageSize = 500;
    for (let page = 0; page < 10; page++) {
      const { data, error } = await db.from("attempts")
        .select("id,player_id,score,total,created_at,players(id,nickname,class_code),attempt_answers(question_id,category,answer,correct)")
        .order("created_at", { ascending: false })
        .range(page * pageSize, page * pageSize + pageSize - 1);
      if (error) throw error;
      rows.push(...(data || []));
      if (!data || data.length < pageSize) break;
    }
    const { count } = await db.from("players").select("id", { count: "exact", head: true });
    return NextResponse.json({ rows, players: count ?? null });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Laporan belum dapat dimuat." }, { status: 503 });
  }
}
