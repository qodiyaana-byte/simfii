"use client";
import { useCallback, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Mixed } from "../mixed";
import { questionsOf, type MateriKey } from "@/lib/questions";
import {
  CATEGORIES_OF, CATEGORY_LABELS, DEFAULT_KKM, MATERI_KEYS, MATERI_LABEL, POS_COLORS, POS_IDS, POS_NAMES_OF, average, categoryTallies, formatDate, formatDateTime,
  materiOfAttempt, posOfQuestion, posTallies, questionById, score100, starsOf, type AnswerRow, type AttemptRow, type Tally,
} from "@/lib/analytics";
import { makeDemoReport, type ReportRow } from "@/lib/demo";

type Tab = "ringkasan" | "siswa" | "soal";
type Student = {
  key: string; nickname: string; classCode: string; attempts: AttemptRow[];
  latest: AttemptRow; lastScore: number; bestScore: number;
  pos: Record<number, Tally & { answered: number }>; cats: Record<string, Tally>;
};
const TOKEN_KEY = "simfii-guru-token";

function MiniStars({ score, size = 16 }: { score: number; size?: number }) {
  const filled = starsOf(score);
  return <span className="td-stars" style={{ fontSize: size }} title={`${filled} dari 5 bintang`}>
    {[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ "--fill": `${Math.round(Math.max(0, Math.min(1, filled - i)) * 100)}%` } as CSSProperties}>★</i>)}
  </span>;
}
const bar = (value: number | null, color: string) => <span className="td-bar"><i style={{ width: `${value ?? 0}%`, background: color }} /></span>;
const toneOf = (v: number | null, kkm: number) => (v === null ? "none" : v >= kkm ? "good" : v >= kkm - 20 ? "mid" : "low");

function buildStudents(allRows: ReportRow[], materi: MateriKey): Student[] {
  // satu percobaan berisi soal satu materi saja; tampilkan hanya materi yang dipilih
  const rows = allRows.filter((row) => materiOfAttempt({ answers: row.attempt_answers || [] }) === materi);
  const map = new Map<string, { nickname: string; classCode: string; attempts: AttemptRow[] }>();
  for (const row of rows) {
    const p = Array.isArray(row.players) ? row.players[0] : row.players;
    const key = row.player_id || `${p?.nickname}|${p?.class_code}`;
    const entry = map.get(key) ?? { nickname: p?.nickname ?? "(tanpa nama)", classCode: p?.class_code ?? "UMUM", attempts: [] };
    entry.attempts.push({ id: row.id, score: row.score, total: row.total, created_at: row.created_at, answers: row.attempt_answers || [] });
    map.set(key, entry);
  }
  return Array.from(map, ([key, e]) => {
    const attempts = e.attempts.sort((a, b) => b.created_at.localeCompare(a.created_at));
    const latest = attempts[0];
    return {
      key, nickname: e.nickname, classCode: e.classCode, attempts, latest,
      lastScore: score100(latest), bestScore: Math.max(...attempts.map(score100)),
      pos: posTallies(latest.answers, materi), cats: categoryTallies(latest.answers, materi),
    };
  }).sort((a, b) => a.nickname.localeCompare(b.nickname, "id"));
}

function downloadCsv(students: Student[], kkm: number, materi: MateriKey) {
  const head = ["Materi", "Nama", "Kelas", "Percobaan", "Nilai Terakhir", "Nilai Terbaik", ...POS_IDS.map((p) => `Pos ${p} (%)`), "Bintang", "Status", "Terakhir Mengerjakan"];
  const lines = students.map((s) => [
    MATERI_LABEL[materi], s.nickname, s.classCode, s.attempts.length, s.lastScore, s.bestScore,
    ...POS_IDS.map((p) => s.pos[p].percent ?? ""), starsOf(s.lastScore), s.lastScore >= kkm ? "Tuntas" : "Remedial", formatDateTime(s.latest.created_at),
  ]);
  const csv = [head, ...lines].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(";")).join("\r\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `rekap-simfii-${materi}-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  URL.revokeObjectURL(url);
}

function Shell({ children }: { children: ReactNode }) {
  return <main className="page td-page" style={{ "--accent": "#1e88e5" } as CSSProperties}>{children}</main>;
}

export default function TeacherDashboard() {
  const [token, setToken] = useState("");
  const [input, setInput] = useState("");
  const [rows, setRows] = useState<ReportRow[] | null>(null);
  const [demo, setDemo] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("ringkasan");
  const [materi, setMateri] = useState<MateriKey>("isimfiil");
  const [kelas, setKelas] = useState("semua");
  const [query, setQuery] = useState("");
  const [kkm, setKkm] = useState(DEFAULT_KKM);
  const [posFilter, setPosFilter] = useState(0);
  const [detail, setDetail] = useState<Student | null>(null);
  const [detailAttempt, setDetailAttempt] = useState(0);

  const load = useCallback(async (value: string) => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/reports", { headers: { Authorization: `Bearer ${value}` }, cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Laporan belum dapat dimuat.");
      setRows(data.rows || []); setToken(value); setDemo(false);
      try { sessionStorage.setItem(TOKEN_KEY, value); } catch { /* abaikan */ }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Laporan belum dapat dimuat.");
      setRows(null); setToken("");
      try { sessionStorage.removeItem(TOKEN_KEY); } catch { /* abaikan */ }
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(TOKEN_KEY);
      if (saved) { setInput(saved); void load(saved); }
      const k = Number(localStorage.getItem("simfii-kkm"));
      if (k >= 1 && k <= 100) setKkm(k);
    } catch { /* abaikan */ }
  }, [load]);

  const changeKkm = (v: number) => {
    const n = Math.max(1, Math.min(100, Math.round(v) || DEFAULT_KKM));
    setKkm(n);
    try { localStorage.setItem("simfii-kkm", String(n)); } catch { /* abaikan */ }
  };
  const logout = () => { setRows(null); setToken(""); setDemo(false); setInput(""); try { sessionStorage.removeItem(TOKEN_KEY); } catch { /* abaikan */ } };
  const refresh = () => (demo ? setRows(makeDemoReport()) : void load(token));

  const posNames = POS_NAMES_OF[materi];
  const CATS = CATEGORIES_OF[materi];
  const all = useMemo(() => (rows ? buildStudents(rows, materi) : []), [rows, materi]);
  const classes = useMemo(() => Array.from(new Set(all.map((s) => s.classCode))).sort(), [all]);
  const students = useMemo(() => all.filter((s) => (kelas === "semua" || s.classCode === kelas) && s.nickname.toLowerCase().includes(query.trim().toLowerCase())), [all, kelas, query]);

  const stats = useMemo(() => {
    const last = students.map((s) => s.lastScore);
    const posAvg = POS_IDS.map((p) => average(students.map((s) => s.pos[p].percent).filter((v): v is number => v !== null)));
    const catAvg = CATS.map((c) => average(students.map((s) => s.cats[c].percent).filter((v): v is number => v !== null)));
    const bins = [0, 0, 0, 0, 0];
    last.forEach((v) => { bins[Math.min(4, Math.floor(v / 20))]++; });
    const q = questionsOf(materi).map((question) => {
      const answered = students.map((s) => s.latest.answers.find((a) => a.question_id === question.id)).filter((a): a is AnswerRow => !!a);
      const correct = answered.filter((a) => a.correct).length;
      const wrongCount = new Map<string, number>();
      answered.filter((a) => !a.correct).forEach((a) => wrongCount.set(a.answer, (wrongCount.get(a.answer) ?? 0) + 1));
      const top = Array.from(wrongCount).sort((a, b) => b[1] - a[1])[0];
      return { question, total: answered.length, correct, percent: answered.length ? Math.round((correct / answered.length) * 100) : null, topWrong: top?.[0] ?? "", topWrongCount: top?.[1] ?? 0 };
    });
    return {
      count: students.length,
      attempts: students.reduce((n, s) => n + s.attempts.length, 0),
      avg: average(last), max: last.length ? Math.max(...students.map((s) => s.bestScore)) : null,
      pass: last.length ? Math.round((last.filter((v) => v >= kkm).length / last.length) * 100) : null,
      posAvg, catAvg, bins, q,
    };
  }, [students, kkm, materi, CATS]);

  const remedial = useMemo(() => students.filter((s) => s.lastScore < kkm).sort((a, b) => a.lastScore - b.lastScore), [students, kkm]);
  const hardest = useMemo(() => [...stats.q].filter((x) => x.percent !== null).sort((a, b) => (a.percent ?? 0) - (b.percent ?? 0)), [stats.q]);

  /* ===== MASUK ===== */
  if (!rows) {
    return <Shell>
      <header className="topbar"><a className="brand" href="/"><span className="brand-mark">🕵️</span><span><b>Nahwu Quest</b><small>Dashboard Guru</small></span></a><nav><a href="/">Ke Aplikasi</a></nav></header>
      <div className="screen-enter"><div className="td-login">
        <div className="td-login-icon">📊</div><h1>Dashboard Guru</h1>
        <p>Masukkan token guru untuk melihat nilai, perkembangan, dan analisis soal seluruh murid.</p>
        <input type="password" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Token guru" onKeyDown={(e) => { if (e.key === "Enter" && input) void load(input); }} autoFocus />
        <button className="primary full" disabled={!input || loading} onClick={() => void load(input)}>{loading ? "Memuat..." : "Masuk"}</button>
        {error && <span className="error">{error}</span>}
        <div className="td-or"><span>atau</span></div>
        <button className="secondary full" onClick={() => { setRows(makeDemoReport()); setDemo(true); setToken("demo"); }}>👀 Lihat contoh tampilan (data contoh)</button>
        <small>Token diisi di Vercel pada variabel <code>TEACHER_DASHBOARD_TOKEN</code>.</small>
      </div></div>
    </Shell>;
  }

  /* ===== DASHBOARD ===== */
  const attemptData = detail ? detail.attempts[Math.min(detailAttempt, detail.attempts.length - 1)] : null;
  return <Shell>
    <header className="topbar td-top">
      <a className="brand" href="/"><span className="brand-mark">🕵️</span><span><b>Nahwu Quest</b><small>Dashboard Guru</small></span></a>
      <div className="td-actions">
        <label>KKM <input type="number" min={1} max={100} value={kkm} onChange={(e) => changeKkm(Number(e.target.value))} /></label>
        <button onClick={refresh} disabled={loading}>↻ Muat ulang</button>
        <a href="/">Ke Aplikasi</a><button onClick={logout}>Keluar</button>
      </div>
    </header>
    <div className="screen-enter td-body">
      {demo && <div className="td-demo">DATA CONTOH: ini hanya tampilan percobaan, bukan nilai murid sebenarnya.</div>}
      <div className="td-bar-row">
        <div className="td-tabs">{([["ringkasan", "📊 Ringkasan"], ["siswa", "👩‍🎓 Daftar Murid"], ["soal", "❓ Analisis Soal"]] as [Tab, string][]).map(([k, label]) => <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{label}</button>)}</div>
        <div className="td-filters">
          <select value={materi} onChange={(e) => { setMateri(e.target.value as MateriKey); setPosFilter(0); setDetail(null); }} aria-label="Pilih materi">{MATERI_KEYS.map((m) => <option key={m} value={m}>Materi: {MATERI_LABEL[m]}</option>)}</select>
          <select value={kelas} onChange={(e) => setKelas(e.target.value)} aria-label="Pilih kelas"><option value="semua">Semua kelas</option>{classes.map((c) => <option key={c} value={c}>{c}</option>)}</select>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama murid..." aria-label="Cari murid" />
          {tab === "siswa" && <button className="td-export" onClick={() => downloadCsv(students, kkm, materi)} disabled={!students.length}>⬇ Unduh CSV</button>}
        </div>
      </div>

      <div className="td-scroll">
        {all.length === 0 && <div className="td-empty">Belum ada murid yang menyelesaikan Pos 1 sampai 5 pada materi {MATERI_LABEL[materi]}. Nilai akan muncul di sini setelah murid menyelesaikan petualangan.</div>}

        {all.length > 0 && tab === "ringkasan" && <>
          <div className="td-cards">
            <div className="td-card"><small>Jumlah murid</small><b>{stats.count}</b><em>{stats.attempts} percobaan</em></div>
            <div className="td-card"><small>Rata-rata nilai</small><b>{stats.avg ?? "-"}</b><em>nilai terakhir tiap murid</em></div>
            <div className="td-card"><small>Nilai tertinggi</small><b>{stats.max ?? "-"}</b><em>dari seluruh percobaan</em></div>
            <div className="td-card"><small>Tuntas (≥ {kkm})</small><b>{stats.pass ?? "-"}{stats.pass !== null ? "%" : ""}</b><em>{remedial.length} murid remedial</em></div>
            <div className="td-card stars"><small>Rata-rata bintang</small><b><MiniStars score={stats.avg ?? 0} size={22} /></b><em>{stats.avg !== null ? starsOf(stats.avg).toFixed(1) : "-"} dari 5</em></div>
          </div>
          <div className="td-grid3">
            <section className="td-panel"><h3>Sebaran Nilai</h3>
              <div className="td-cols">{stats.bins.map((n, i) => <div key={i} className="td-col"><span className="td-colv">{n}</span><i style={{ height: `${Math.max(4, (n / Math.max(1, ...stats.bins)) * 100)}%`, background: ["#ee5a8f", "#f08c00", "#ffc933", "#7bd88f", "#2eb96e"][i] }} /><small>{i * 20}{i === 4 ? "–100" : `–${i * 20 + 19}`}</small></div>)}</div>
            </section>
            <section className="td-panel"><h3>Rata-rata per Pos</h3>
              {POS_IDS.map((p, i) => <div className="td-hrow" key={p}><span><i style={{ background: POS_COLORS[p] }} />{posNames[p]}</span>{bar(stats.posAvg[i], POS_COLORS[p])}<b>{stats.posAvg[i] ?? "-"}</b></div>)}
            </section>
            <section className="td-panel"><h3>Kemampuan per Materi</h3>
              {CATS.map((c, i) => <div className="td-hrow" key={c}><span>{CATEGORY_LABELS[c]}</span>{bar(stats.catAvg[i], stats.catAvg[i] !== null && stats.catAvg[i]! < kkm ? "#ee5a8f" : "#2eb96e")}<b>{stats.catAvg[i] ?? "-"}</b></div>)}
              <p className="td-note">Merah = di bawah KKM ({kkm}). Materi merah perlu dibahas ulang di kelas.</p>
            </section>
          </div>
          <div className="td-grid2">
            <section className="td-panel"><h3>Soal Paling Sulit</h3>
              {hardest.slice(0, 4).map((h) => <div className="td-hq" key={h.question.id}><b className={toneOf(h.percent, kkm)}>{h.percent}%</b><span><Mixed text={h.question.prompt.length > 90 ? h.question.prompt.slice(0, 88) + "…" : h.question.prompt} /></span><em>Pos {h.question.position}</em></div>)}
              {hardest.length === 0 && <p className="td-note">Belum ada data.</p>}
            </section>
            <section className="td-panel"><h3>Murid yang Perlu Pendampingan</h3>
              {remedial.slice(0, 5).map((s) => <div className="td-hq" key={s.key}><b className="low">{s.lastScore}</b><span>{s.nickname} <small>({s.classCode})</small></span><em>{s.attempts.length}× coba</em></div>)}
              {remedial.length === 0 && <p className="td-note">🎉 Semua murid sudah mencapai KKM.</p>}
            </section>
          </div>
        </>}

        {all.length > 0 && tab === "siswa" && <div className="td-tablewrap">
          <table className="td-table"><thead><tr><th>Nama</th><th>Kelas</th><th>Coba</th><th>Terakhir</th><th>Terbaik</th>{POS_IDS.map((p) => <th key={p} title={posNames[p]} style={{ color: POS_COLORS[p] }}>Pos {p}</th>)}<th>Bintang</th><th>Status</th><th>Tanggal</th></tr></thead>
            <tbody>{students.map((s) => <tr key={s.key} onClick={() => { setDetail(s); setDetailAttempt(0); }}>
              <td className="nm">{s.nickname}</td><td>{s.classCode}</td><td>{s.attempts.length}</td><td><b className={`pill ${toneOf(s.lastScore, kkm)}`}>{s.lastScore}</b></td><td>{s.bestScore}</td>
              {POS_IDS.map((p) => <td key={p}><span className={`tone ${toneOf(s.pos[p].percent, kkm)}`}>{s.pos[p].percent ?? "-"}</span></td>)}
              <td><MiniStars score={s.lastScore} size={14} /></td><td><span className={`badge ${s.lastScore >= kkm ? "ok" : "no"}`}>{s.lastScore >= kkm ? "Tuntas" : "Remedial"}</span></td><td>{formatDate(s.latest.created_at)}</td>
            </tr>)}</tbody></table>
          {students.length === 0 && <div className="td-empty">Tidak ada murid yang cocok dengan filter.</div>}
          <p className="td-note">Klik baris murid untuk melihat jawaban per soal. Angka Pos = persentase benar pada percobaan terakhir.</p>
        </div>}

        {all.length > 0 && tab === "soal" && <>
          <div className="td-chips">{[0, ...POS_IDS].map((p) => <button key={p} className={posFilter === p ? "on" : ""} onClick={() => setPosFilter(p)} style={p ? { "--c": POS_COLORS[p] } as CSSProperties : undefined}>{p === 0 ? "Semua pos" : `Pos ${p}`}</button>)}<span>Diurutkan dari yang paling sulit. Dihitung dari percobaan terakhir tiap murid.</span></div>
          <div className="td-tablewrap"><table className="td-table q"><thead><tr><th>No</th><th>Soal</th><th>% benar</th><th>Jawaban salah terbanyak</th><th></th></tr></thead>
            <tbody>{[...stats.q].filter((x) => !posFilter || x.question.position === posFilter).sort((a, b) => (a.percent ?? 101) - (b.percent ?? 101)).map((x) => <tr key={x.question.id}>
              <td><b style={{ color: POS_COLORS[x.question.position] }}>{x.question.id.toUpperCase()}</b></td>
              <td className="qt"><Mixed text={x.question.prompt} /></td>
              <td><span className="td-pctcell">{bar(x.percent, x.percent !== null && x.percent < kkm ? "#ee5a8f" : "#2eb96e")}<b className={toneOf(x.percent, kkm)}>{x.percent ?? "-"}{x.percent !== null ? "%" : ""}</b></span></td>
              <td className="qt">{x.topWrong ? <><Mixed text={x.topWrong} /> <small>({x.topWrongCount} murid)</small></> : <small>-</small>}</td>
              <td>{x.percent !== null && x.percent < 50 ? <span className="badge no">Bahas ulang</span> : null}</td>
            </tr>)}</tbody></table></div>
        </>}
      </div>
    </div>

    {detail && attemptData && <div className="modal-back" onClick={() => setDetail(null)}><div className="modal td-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
      <button className="modal-x" onClick={() => setDetail(null)} aria-label="Tutup">✕</button>
      <div className="td-mhead">
        <div><h2>{detail.nickname} <small>· {detail.classCode}</small></h2>
          <div className="td-mscore"><b className={`pill ${toneOf(score100(attemptData), kkm)}`}>{score100(attemptData)}</b><MiniStars score={score100(attemptData)} size={20} /><span>{attemptData.score}/{attemptData.total} benar · {formatDateTime(attemptData.created_at)}</span></div></div>
        {detail.attempts.length > 1 && <label className="td-attsel">Percobaan <select value={detailAttempt} onChange={(e) => setDetailAttempt(Number(e.target.value))}>{detail.attempts.map((a, i) => <option key={a.id} value={i}>{i === 0 ? "Terakhir · " : `#${detail.attempts.length - i} · `}{formatDateTime(a.created_at)} · nilai {score100(a)}</option>)}</select></label>}
      </div>
      <div className="td-mpos">{POS_IDS.map((p) => { const t = posTallies(attemptData.answers, materi)[p]; return <div key={p}><small style={{ color: POS_COLORS[p] }}>Pos {p}</small>{bar(t.percent, POS_COLORS[p])}<b>{t.percent ?? "-"}</b></div>; })}</div>
      <div className="td-mlist">{[...attemptData.answers].sort((a, b) => a.question_id.localeCompare(b.question_id)).map((a) => { const q = questionById.get(a.question_id); if (!q) return null; return <div key={a.question_id} className={`td-ans ${a.correct ? "ok" : "no"}`}>
        <span className="no">{a.correct ? "✓" : "✗"}</span>
        <div><small>Pos {posOfQuestion(a.question_id)} · {a.question_id.toUpperCase()}</small><p><Mixed text={q.prompt} /></p>
          <p className="your">Jawaban murid: <b><Mixed text={a.answer || "(kosong)"} /></b></p>
          {!a.correct && <><p className="right">Jawaban benar: <b><Mixed text={q.answer} /></b></p><p className="why">💡 <Mixed text={q.reason} /></p></>}</div></div>; })}</div>
    </div></div>}
  </Shell>;
}
