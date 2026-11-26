// Mengambil riwayat percobaan seorang murid beserta jawabannya.
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function loadHistory(db: any, playerId: string) {
  const { data, error } = await db
    .from("attempts")
    .select("id,score,total,created_at,attempt_answers(question_id,category,answer,correct)")
    .eq("player_id", playerId)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw error;
  return ((data as any[]) || []).map((row) => ({
    id: row.id as string,
    score: row.score as number,
    total: row.total as number,
    created_at: row.created_at as string,
    answers: (row.attempt_answers || []) as { question_id: string; category: string; answer: string; correct: boolean }[],
  }));
}
