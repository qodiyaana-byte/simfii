"use client";
import type { CSSProperties } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Mixed } from "./mixed";
import {
  CATEGORIES_OF, CATEGORY_LABELS, DEFAULT_KKM, MATERI_KEYS, MATERI_LABEL, POS_COLORS, POS_IDS, POS_NAMES_OF, categoryPos, categoryTallies, formatDate,
  materiOfAttempt, onlyMateri, posTallies, questionById, score100, starsOf, weakestCategory, type AnswerRow, type AttemptRow,
} from "@/lib/analytics";
import { materiById } from "@/lib/content";
import type { MateriKey } from "@/lib/questions";

type Props = {
  player: { nickname: string; classCode: string };
  attempts: AttemptRow[];            // terbaru lebih dulu
  partial: AnswerRow[];              // jawaban sesi yang belum lengkap
  online: boolean;
  loading: boolean;
  materi: MateriKey;
  onSwitch: (m: MateriKey) => void;
  backLabel?: string;
  onBack: () => void;
  onReplay: () => void;
  onMateri: (pos: number) => void;
};

function Stars({ score, size = 22 }: { score: number; size?: number }) {
  const filled = starsOf(score);
  return <span className="sd-stars" style={{ fontSize: size }}>{[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ "--fill": `${Math.round(Math.max(0, Math.min(1, filled - i)) * 100)}%` } as CSSProperties}>★</i>)}</span>;
}
const Bar = ({ value, color }: { value: number | null; color: string }) => <span className="sd-bar"><i style={{ width: `${value ?? 0}%`, background: color }} /></span>;

export function StudentDashboard({ player, attempts: allAttempts, partial, online, loading, materi, onSwitch, backLabel = "Kembali ke peta", onBack, onReplay, onMateri }: Props) {
  const attempts = allAttempts.filter((a) => materiOfAttempt(a) === materi);
  const latest = attempts[0] ?? null;
  const answers = latest ? latest.answers : onlyMateri(partial, materi);
  const posNames = POS_NAMES_OF[materi];
  const info = materiById[materi];
  const posT = posTallies(answers, materi);
  const cats = categoryTallies(answers, materi);
  const lastScore = latest ? score100(latest) : null;
  const bestScore = attempts.length ? Math.max(...attempts.map(score100)) : null;
  const doneCount = POS_IDS.filter((p) => posT[p].answered > 0).length;
  const weak = weakestCategory(answers, materi);
  const wrong = answers.filter((a) => !a.correct);
  const chart = [...attempts].slice(0, 8).reverse();
  const catKeys = CATEGORIES_OF[materi];
  const hasAny = answers.length > 0;

  return <section className="sd">
    <div className="sd-head">
      <button className="back-link" onClick={onBack}><ArrowLeft size={16} /> {backLabel}</button>
      <h2>📊 Dashboard Saya</h2>
      <div className="sd-switch" role="tablist" aria-label="Pilih materi">{MATERI_KEYS.map((m) => <button key={m} role="tab" aria-selected={m === materi} className={m === materi ? "on" : ""} onClick={() => onSwitch(m)}>{MATERI_LABEL[m]}</button>)}</div>
      {!online && <span className="sd-offline">Mode offline: nilai hanya tampil di perangkat ini</span>}
      {loading && <span className="sd-offline sd-load">Memuat riwayat...</span>}
    </div>

    <div className="sd-top">
      <div className="sd-profile"><span className="sd-avatar">🕵️</span><div><b>{player.nickname}</b><small>Kelas {player.classCode}</small></div></div>
      <div className="sd-stat s1"><small>Nilai terakhir</small><b>{lastScore ?? "-"}</b>{lastScore !== null ? <Stars score={lastScore} size={18} /> : <em>belum selesai</em>}</div>
      <div className="sd-stat s2"><small>Nilai terbaik</small><b>{bestScore ?? "-"}</b><em>{attempts.length ? `dari ${attempts.length} percobaan` : "belum ada"}</em></div>
      <div className="sd-stat s3"><small>Pos dikerjakan</small><b>{doneCount}<span>/5</span></b><em>{doneCount === 5 ? "semua selesai 🎉" : "lanjutkan di peta"}</em></div>
      <div className="sd-stat s4"><small>Target KKM</small><b>{DEFAULT_KKM}</b><em>{lastScore === null ? "ayo mulai!" : lastScore >= DEFAULT_KKM ? "tercapai ✅" : `kurang ${DEFAULT_KKM - lastScore} poin`}</em></div>
    </div>

    {!hasAny && <div className="sd-empty">Kamu belum mengerjakan soal. Kunjungi <b>{posNames[1]}</b> di peta materi {MATERI_LABEL[materi]} untuk memulai, lalu dashboard ini akan terisi dengan nilai dan sarannya.</div>}

    {hasAny && <div className="sd-grid">
      <div className="sd-col">
        <section className="sd-panel"><h3>Nilai per Pos</h3>
          {POS_IDS.map((p) => <div className="sd-row" key={p}><span><i style={{ background: POS_COLORS[p] }} />{posNames[p]}</span><Bar value={posT[p].percent} color={POS_COLORS[p]} /><b>{posT[p].percent ?? "-"}</b></div>)}
        </section>
        <section className="sd-panel"><h3>Kemampuanmu</h3>
          {catKeys.map((c) => <div className="sd-row" key={c}><span>{CATEGORY_LABELS[c]}</span><Bar value={cats[c].percent} color={cats[c].percent !== null && cats[c].percent! < DEFAULT_KKM ? "#ee5a8f" : "#2eb96e"} /><b>{cats[c].percent ?? "-"}</b></div>)}
        </section>
      </div>

      <div className="sd-col">
        <section className="sd-panel sd-advice"><h3>💡 Saran Belajar</h3>
          {weak ? <>
            <p>Bagian yang paling perlu diperkuat: <b>{CATEGORY_LABELS[weak]}</b> ({cats[weak].percent}%).</p>
            {info.slides[categoryPos(materi, weak)]
              ? <button className="primary" onClick={() => onMateri(categoryPos(materi, weak))}>Pelajari ulang di {posNames[categoryPos(materi, weak)]}</button>
              : <p className="sd-small">Baca ulang Ringkasan Materi di peta, lalu coba lagi soal {posNames[categoryPos(materi, weak)]}.</p>}
          </> : <p>Hebat! Semua kemampuanmu sudah mencapai target. Coba ulangi petualangan untuk mengejar bintang penuh ⭐.</p>}
        </section>
        <section className="sd-panel sd-wrong"><h3>Soal yang Perlu Diulang <small>({wrong.length})</small></h3>
          <div className="sd-wlist">
            {wrong.slice(0, 5).map((a) => { const q = questionById.get(a.question_id); if (!q) return null; return <div key={a.question_id}><small>Pos {q.position}</small><p><Mixed text={q.prompt.length > 80 ? q.prompt.slice(0, 78) + "…" : q.prompt} /></p><em>Jawaban benar: <Mixed text={q.answer.length > 60 ? q.answer.slice(0, 58) + "…" : q.answer} /></em></div>; })}
            {wrong.length === 0 && <p className="sd-small">Tidak ada. Semua jawabanmu benar! 🎉</p>}
            {wrong.length > 5 && <p className="sd-small">+ {wrong.length - 5} soal lainnya.</p>}
          </div>
        </section>
      </div>

      <div className="sd-col">
        <section className="sd-panel"><h3>Perkembangan Nilai</h3>
          {chart.length === 0 ? <p className="sd-small">Selesaikan Pos 1 sampai 5 agar perkembangan nilai tercatat.</p> :
            <div className="sd-chart">{chart.map((a, i) => { const s = score100(a); return <div key={a.id} className="sd-ch"><b>{s}</b><i style={{ height: `${Math.max(6, s)}%`, background: s >= DEFAULT_KKM ? "#2eb96e" : s >= 55 ? "#ffc933" : "#ee5a8f" }} /><small>#{attempts.length - (chart.length - 1 - i)}</small></div>; })}</div>}
        </section>
        <section className="sd-panel"><h3>Riwayat Percobaan</h3>
          {attempts.slice(0, 5).map((a, i) => <div className="sd-hist" key={a.id}><span>{i === 0 ? "Terakhir" : `#${attempts.length - i}`}<small>{formatDate(a.created_at)}</small></span><b>{score100(a)}</b><Stars score={score100(a)} size={14} /></div>)}
          {attempts.length === 0 && <p className="sd-small">Belum ada percobaan yang tersimpan.</p>}
        </section>
      </div>
    </div>}

    <div className="sd-foot"><button className="secondary" onClick={onReplay}><RotateCcw size={16} /> Ulangi Petualangan</button><button className="primary" onClick={onBack}>{backLabel}</button></div>
  </section>;
}
