import { questionsOf, type MateriKey } from "./questions";
import type { AnswerRow } from "./analytics";

export type ReportRow = {
  id: string; player_id: string; score: number; total: number; created_at: string;
  players: { id: string; nickname: string; class_code: string } | { id: string; nickname: string; class_code: string }[] | null;
  attempt_answers: AnswerRow[];
};

// Data contoh agar guru dapat melihat tampilan dashboard sebelum basis data terisi.
export function makeDemoReport(): ReportRow[] {
  let seed = 20261124;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
  const names = ["Aisyah", "Budi", "Citra", "Dimas", "Eka", "Farhan", "Gina", "Hafiz", "Indah", "Joko", "Kirana", "Lutfi", "Maya", "Naufal", "Olivia", "Putra", "Qori", "Rani", "Salsa", "Tegar", "Umar", "Vina", "Wahyu", "Zahra"];
  const rows: ReportRow[] = [];
  names.forEach((nickname, i) => {
    const player = { id: `demo-${i}`, nickname, class_code: i % 2 === 0 ? "VII-A" : "VII-B" };
    const skill = 0.45 + rnd() * 0.5;
    const tries = 1 + Math.floor(rnd() * 3);
    // semua murid contoh mengerjakan Isim dan Fi'il; sebagian juga mengerjakan Mubtada' dan Khabar
    const materiList: MateriKey[] = rnd() < 0.6 ? ["isimfiil", "mubtada"] : ["isimfiil"];
    for (const materi of materiList) for (let t = 0; t < tries; t++) {
      const questions = questionsOf(materi);
      const boost = t * 0.07;
      const answers: AnswerRow[] = questions.map((q) => {
        const hard = q.position === 5 ? -0.12 : q.category === "fiil" || q.category === "syarat" ? -0.06 : q.id === "p3-05" || q.id === "p5-06" || q.id === "m3-05" || q.id === "m5-05" ? -0.2 : 0;
        const correct = rnd() < Math.min(0.98, skill + boost + hard);
        const wrong = q.options.filter((o) => o !== q.answer);
        return { question_id: q.id, category: q.category, answer: correct ? q.answer : wrong[Math.floor(rnd() * wrong.length)], correct };
      });
      const date = new Date(Date.UTC(2026, 10, 10 + Math.floor(rnd() * 12) + t, 1 + Math.floor(rnd() * 8), Math.floor(rnd() * 60)));
      rows.push({ id: `demo-${i}-${materi}-${t}`, player_id: player.id, score: answers.filter((a) => a.correct).length, total: answers.length, created_at: date.toISOString(), players: player, attempt_answers: answers });
    }
  });
  return rows.sort((a, b) => b.created_at.localeCompare(a.created_at));
}
