import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { bearer, verifyToken } from "@/lib/auth";
import { questions, type Question } from "@/lib/questions";

type ValidatedAnswer = {
  question_id: string;
  category: Question["category"];
  answer: string;
  correct: boolean;
};

type SubmittedAnswer = { questionId?: string; answer?: string };

// Menyimpan satu percobaan lengkap (30 soal). Skor dihitung ulang di server.
export async function POST(request: Request) {
  try {
    const playerId = verifyToken(bearer(request));
    if (!playerId) return NextResponse.json({ error: "Sesi tidak valid. Silakan masuk kembali." }, { status: 401 });

    const body = await request.json();
    if (!Array.isArray(body.answers) || body.answers.length !== questions.length) {
      return NextResponse.json({ error: "Data jawaban belum lengkap. Selesaikan Pos 1 sampai 5 terlebih dahulu." }, { status: 400 });
    }

    const questionMap = new Map(questions.map((question) => [question.id, question]));
    const validated: ValidatedAnswer[] = (body.answers as SubmittedAnswer[]).map((item): ValidatedAnswer => {
      const question = questionMap.get(String(item.questionId));
      if (!question) throw new Error("Ada soal yang tidak dikenal.");
      const answer = String(item.answer ?? "");
      return { question_id: question.id, category: question.category, answer, correct: answer === question.answer };
    });

    if (new Set(validated.map((item) => item.question_id)).size !== questions.length) {
      return NextResponse.json({ error: "Ada jawaban yang terduplikasi atau belum lengkap." }, { status: 400 });
    }

    const db = supabaseAdmin();
    const { data: attempt, error: attemptError } = await db.from("attempts").insert({
      player_id: playerId,
      score: validated.filter((item) => item.correct).length,
      total: validated.length,
    }).select("id").single();
    if (attemptError) throw attemptError;

    const rows = validated.map((item) => ({ attempt_id: attempt.id, ...item }));
    const { error } = await db.from("attempt_answers").insert(rows);
    if (error) throw error;
    return NextResponse.json({ ok: true, attemptId: attempt.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Hasil belum dapat disimpan. Pastikan basis data tersedia." }, { status: 503 });
  }
}
