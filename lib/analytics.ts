import { questions, type Question } from "./questions";

export type AnswerRow = { question_id: string; category: string; answer: string; correct: boolean };
export type AttemptRow = { id: string; score: number; total: number; created_at: string; answers: AnswerRow[] };
export type Tally = { correct: number; total: number; percent: number | null };

export const POS_IDS = [1, 2, 3, 4, 5] as const;
export const POS_NAMES: Record<number, string> = {
  1: "Rumah Isim", 2: "Rumah Fi'il", 3: "Balai Peta Konsep", 4: "Kantor Detektif", 5: "Taman Tantangan",
};
export const POS_COLORS: Record<number, string> = { 1: "#f5a623", 2: "#1e88e5", 3: "#8e44ad", 4: "#e03a5a", 5: "#00a38c" };
export const CATEGORY_LABELS: Record<Question["category"], string> = {
  isim: "Mengenali isim", fiil: "Mengenali fi'il", beda: "Membedakan isim dan fi'il", campuran: "Analisis kalimat",
};
// pos yang paling cocok untuk mengulang tiap kategori
export const CATEGORY_POS: Record<Question["category"], number> = { isim: 1, fiil: 2, beda: 3, campuran: 4 };
export const DEFAULT_KKM = 75;

export const questionById = new Map(questions.map((q) => [q.id, q]));
export const posOfQuestion = (id: string): number => Number(id.slice(1, id.indexOf("-")));
export const questionsInPos = (pos: number) => questions.filter((q) => q.position === pos).length;

const pct = (correct: number, total: number): number | null => (total > 0 ? Math.round((correct / total) * 100) : null);
export const score100 = (a: { score: number; total: number }): number => Math.round((a.score / Math.max(1, a.total)) * 100);
export const starsOf = (score: number): number => Math.round((Math.max(0, Math.min(100, score)) / 20) * 10) / 10;

// Nilai per pos. "answered" menandakan berapa soal pos itu yang sudah dijawab.
export function posTallies(answers: AnswerRow[]): Record<number, Tally & { answered: number }> {
  const out: Record<number, Tally & { answered: number }> = {};
  for (const pos of POS_IDS) {
    const list = answers.filter((a) => posOfQuestion(a.question_id) === pos);
    const correct = list.filter((a) => a.correct).length;
    const total = questionsInPos(pos);
    out[pos] = { correct, total, answered: list.length, percent: list.length ? pct(correct, total) : null };
  }
  return out;
}

export function categoryTallies(answers: AnswerRow[]): Record<Question["category"], Tally> {
  const keys = Object.keys(CATEGORY_LABELS) as Question["category"][];
  const out = {} as Record<Question["category"], Tally>;
  for (const key of keys) {
    const total = questions.filter((q) => q.category === key).length;
    const list = answers.filter((a) => a.category === key);
    const correct = list.filter((a) => a.correct).length;
    out[key] = { correct, total, percent: list.length ? pct(correct, total) : null };
  }
  return out;
}

export function weakestCategory(answers: AnswerRow[], kkm = DEFAULT_KKM): Question["category"] | null {
  const tallies = categoryTallies(answers);
  const ranked = (Object.keys(tallies) as Question["category"][])
    .filter((k) => tallies[k].percent !== null)
    .sort((a, b) => (tallies[a].percent ?? 0) - (tallies[b].percent ?? 0));
  const worst = ranked[0];
  return worst && (tallies[worst].percent ?? 100) < kkm ? worst : null;
}

export const average = (values: number[]): number | null => (values.length ? Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 10) / 10 : null);

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}
