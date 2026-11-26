"use client";
import { Fragment, useEffect, useMemo, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, Check, LockKeyhole, RotateCcw, X } from "lucide-react";
import { questions } from "@/lib/questions";
import { mindmapBranches, positions, slides, tableRows, tagLabels, type Seg } from "@/lib/content";
import { Mixed } from "./mixed";
import { StudentDashboard } from "./student-dashboard";
import type { AnswerRow, AttemptRow } from "@/lib/analytics";
import { type PinStatus } from "./scenery";
import { MAP_H, MAP_W, pct, posLayout, type Box } from "@/lib/maplayout";

type Screen = "home" | "identity" | "map" | "learn" | "quiz" | "review" | "result" | "dashboard";
type Player = { id: string; nickname: string; classCode: string };

const TOTAL_POS = positions.length;
const QUIZ_POS = 5;
const ZOOM_MS = 950;
const STAGE_W = 1280;
const STAGE_H = 720;
// gambar peta menempati bagian tengah kanvas 16:9 (sisi diperluas), sehingga titik zoom perlu dikonversi
const mapOrigin = (x: number) => 7.8125 + x * 0.84375;
const boxStyle = (b: Box): CSSProperties => ({ left: `${pct.left(b)}%`, top: `${pct.top(b)}%`, width: `${pct.width(b)}%`, height: `${pct.height(b)}%` });
const ui = (l: number, t: number, w: number, h: number): CSSProperties => ({ left: `${(l / MAP_W) * 100}%`, top: `${(t / MAP_H) * 100}%`, width: `${(w / MAP_W) * 100}%`, height: `${(h / MAP_H) * 100}%` });

function Stars({ value, size = 56 }: { value: number; size?: number }) {
  const filled = Math.max(0, Math.min(5, (value / 100) * 5));
  return <div className="stars" role="img" aria-label={`${Math.round(filled * 10) / 10} dari 5 bintang`} style={{ fontSize: size }}>
    {[0, 1, 2, 3, 4].map((i) => {
      const pct = Math.round(Math.max(0, Math.min(1, filled - i)) * 100);
      return <span key={i} className="star" style={{ "--fill": `${pct}%`, animationDelay: `${i * 0.12}s` } as CSSProperties}>★</span>;
    })}
  </div>;
}

function Segs({ segs }: { segs: Seg[] }) {
  return <span className="ar big" dir="rtl">{segs.map((s, i) => <span key={i} className={s.hl ? "hl" : "base"}>{s.t}</span>)}</span>;
}

export default function Page() {
  const [screen, setScreen] = useState<Screen>("home");
  const [nickname, setNickname] = useState("");
  const [classCode, setClassCode] = useState("");
  const [player, setPlayer] = useState<Player | null>(null);
  const [position, setPosition] = useState(1);
  const [slideIndex, setSlideIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [history, setHistory] = useState<AttemptRow[]>([]);
  const [online, setOnline] = useState(false);
  const [pin, setPin] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [dashLoading, setDashLoading] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [scale, setScale] = useState(1);
  const [ready, setReady] = useState(false);
  const [portrait, setPortrait] = useState(false);

  const posQuestions = useMemo(() => questions.filter((item) => item.position === position), [position]);
  const currentQuestion = posQuestions[qIndex];
  const posSlides = slides[position] || [];
  const slide = posSlides[slideIndex];
  const accent = positions[Math.min(position, TOTAL_POS) - 1].color;

  // Kanvas tetap 1280 x 720 (16:9), diperbesar atau diperkecil agar muat di layar apa pun.
  useEffect(() => {
    const fit = () => {
      setScale(Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H));
      setPortrait(window.innerWidth < window.innerHeight && window.innerWidth < 700);
      setReady(true);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const sessionAnswers: AnswerRow[] = questions
    .filter((q) => completed.includes(q.position) && answers[q.id] !== undefined)
    .map((q) => ({ question_id: q.id, category: q.category, answer: answers[q.id] ?? "", correct: answers[q.id] === q.answer }));
  const sessionComplete = [1, 2, 3, 4, 5].every((id) => completed.includes(id));
  const attemptsAll: AttemptRow[] = sessionComplete && !saved
    ? [{ id: "sesi-ini", score: sessionAnswers.filter((a) => a.correct).length, total: questions.length, created_at: new Date().toISOString(), answers: sessionAnswers }, ...history]
    : history;

  const isUnlocked = (id: number) => id === 1 || completed.includes(id - 1);
  const scoreOf = (pos: number) => {
    const list = questions.filter((item) => item.position === pos);
    const correct = list.filter((item) => answers[item.id] === item.answer).length;
    return { correct, total: list.length, percent: list.length ? Math.round((correct / list.length) * 100) : 0 };
  };
  const answeredPositions = [1, 2, 3, 4, 5].filter((id) => completed.includes(id));
  const totalCorrect = answeredPositions.reduce((sum, id) => sum + scoreOf(id).correct, 0);
  const totalAnswered = answeredPositions.reduce((sum, id) => sum + scoreOf(id).total, 0);
  const finalScore = Math.round((totalCorrect / questions.length) * 100);
  const nextPosition = positions.find((item) => !completed.includes(item.id) && isUnlocked(item.id));
  const progress = Math.round((completed.length / TOTAL_POS) * 100);
  const starsEarned = completed.length ? Math.floor(finalScore / 20) : 0;

  const statusOf = (id: number): PinStatus => completed.includes(id) ? "done" : !isUnlocked(id) ? "locked" : nextPosition?.id === id ? "next" : "open";
  const status = Object.fromEntries(positions.map((p) => [p.id, statusOf(p.id)])) as Record<number, PinStatus>;

  // Transisi zoom: layar membesar ke arah titik yang diklik, lalu pindah layar.
  const zoomThen = (x: number, y: number, then: () => void) => {
    if (zoom) return;
    setZoom({ x, y });
    window.setTimeout(() => { then(); setZoom(null); }, ZOOM_MS);
  };


  const goOffline = (nama: string, kelas: string) => {
    setPlayer({ id: crypto.randomUUID(), nickname: nama, classCode: kelas });
    setToken(null); setHistory([]); setOnline(false); setScreen("map");
  };

  // Masuk dengan nama + kelas + PIN. Jika basis data belum tersedia, permainan tetap berjalan secara offline.
  const startPlayer = async () => {
    const nama = nickname.trim();
    const kelas = classCode.trim().toUpperCase() || "UMUM";
    if (!nama || pin.length !== 4 || loginBusy) return;
    setLoginBusy(true); setLoginError("");
    try {
      const res = await fetch("/api/players", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nickname: nama, classCode: kelas, pin }) });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.player) {
        setPlayer({ id: data.player.id, nickname: data.player.nickname, classCode: data.player.classCode });
        setToken(data.token ?? null); setHistory(data.attempts ?? []); setOnline(true); setScreen("map");
      } else if (res.status === 400 || res.status === 401) {
        setLoginError(data.error || "Nama, kelas, atau PIN belum sesuai.");
      } else goOffline(nama, kelas);
    } catch { goOffline(nama, kelas); }
    finally { setLoginBusy(false); }
  };

  const refreshHistory = async (tk: string | null = token) => {
    if (!tk) return;
    setDashLoading(true);
    try {
      const res = await fetch("/api/me", { headers: { Authorization: `Bearer ${tk}` }, cache: "no-store" });
      if (res.ok) { const data = await res.json(); setHistory(data.attempts ?? []); }
    } catch { /* riwayat tetap memakai data terakhir */ }
    finally { setDashLoading(false); }
  };

  const saveResults = async (record: Record<string, string>) => {
    if (!player || !token) { setSaved(false); return; }
    setSaving(true);
    try {
      const response = await fetch("/api/attempts", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ answers: questions.map((item) => ({ questionId: item.id, answer: record[item.id] ?? "" })) }),
      });
      setSaved(response.ok);
      if (response.ok) await refreshHistory(token);
    } catch { setSaved(false); }
    finally { setSaving(false); }
  };

  const openDashboard = () => { setScreen("dashboard"); void refreshHistory(); };
  const openMateri = (pos: number) => {
    setPosition(pos); setSlideIndex(0); setQIndex(0); setSelected("");
    setScreen(slides[pos] ? "learn" : "map");
  };

  const openPosition = (id: number) => {
    if (!isUnlocked(id)) return;
    setPosition(id); setSlideIndex(0); setQIndex(0); setSelected("");
    if (id === TOTAL_POS) {
      setCompleted((list) => (list.includes(id) ? list : [...list, id]));
      setScreen("result");
    } else if (completed.includes(id)) setScreen("review");
    else if (slides[id]) setScreen("learn");
    else setScreen("quiz");
  };
  const enterPosition = (id: number) => {
    const target = positions[id - 1];
    if (isUnlocked(id)) zoomThen(mapOrigin(target.x), target.y, () => openPosition(id));
  };

  const submitAnswer = () => {
    if (!selected || !currentQuestion) return;
    const nextAnswers = { ...answers, [currentQuestion.id]: selected };
    setAnswers(nextAnswers);
    setSelected("");
    if (qIndex < posQuestions.length - 1) { setQIndex(qIndex + 1); return; }
    setCompleted((list) => (list.includes(position) ? list : [...list, position]));
    setScreen("review");
    if (position === QUIZ_POS) void saveResults(nextAnswers);
  };

  const resetAdventure = () => {
    setPosition(1); setSlideIndex(0); setQIndex(0); setSelected(""); setAnswers({});
    setCompleted([]); setSaved(false); setScreen("map");
  };

  const predicate = finalScore >= 90 ? "Detektif Super! 🏅" : finalScore >= 75 ? "Detektif Hebat! 🎉" : finalScore >= 60 ? "Detektif Handal 👍" : "Detektif Pemula, Ayo Berlatih Lagi! 💪";
  const goHome = () => setScreen(player ? "map" : "home");
  const posCheer = (p: number) => p >= 90 ? "Luar biasa! Kamu menguasai materi ini. 🌟" : p >= 70 ? "Hebat! Sedikit lagi sempurna. 🎉" : p >= 50 ? "Lumayan! Baca alasannya, lalu coba lagi nanti. 💡" : "Tidak apa-apa. Pelajari kunci jawabannya dan kamu pasti bisa! 💪";
  const stageStyle = zoom ? ({ transformOrigin: `${zoom.x}% ${zoom.y}%` } as CSSProperties) : undefined;

  const imageScreen = screen === "home" || screen === "map";
  const topbar = (
    <header className="topbar">
      <button className="brand" onClick={goHome}><span className="brand-mark">🕵️</span><span><b>Simfii</b><small>اِسْمٌ وَفِعْلٌ</small></span></button>
      <nav><button onClick={goHome}>{player ? "Peta" : "Beranda"}</button>{player && <button onClick={openDashboard}>📊 Dashboard</button>}<a href="/guru">Ruang Guru</a></nav>
    </header>
  );
  const body = (
    <div key={screen} className={`screen-enter screen-${screen}`}>
    {screen === "home" && <section className={`home-stage ${zoom ? "zooming" : ""}`}>
      <div className="home-scene" style={stageStyle}><img className="home-img" src="/images/halaman-awal.jpg" alt="Simfii: ayo jelajahi dunia Bahasa Arab dan pahami perbedaan antara isim dan fi'il" draggable={false} /></div>
      <button className="hs hs-start" aria-label="Mulai Petualangan" onClick={() => zoomThen(70, 72, () => setScreen("identity"))} />
      <button className="hs hs-q" aria-label="Cara Bermain" onClick={() => setShowHelp(true)}>?</button>
      <button className="hs hs-help" onClick={() => setShowHelp(true)}><span className="hh-icon">📖</span><b>Cara Bermain</b><i>→</i></button>
      <a className="hs hs-guru" href="/guru">Ruang Guru</a>
    </section>}

    {screen === "identity" && <section className="center-panel">
      <div className="panel-emoji">🕵🏻‍♀️</div><span className="eyebrow">IDENTITAS DETEKTIF</span>
      <h2>Siapa nama detektif hari ini?</h2><p>Masukkan nama, kelas, dan PIN untuk membuka peta desa.</p>
      <label>Nama panggilan</label><input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Contoh: Sami01" maxLength={30} />
      <label>Kode kelas <span className="optional">(opsional)</span></label><input value={classCode} onChange={(e) => setClassCode(e.target.value)} placeholder="Contoh: VII-A" maxLength={20} />
      <label>PIN 4 angka <span className="optional">(untuk masuk kembali)</span></label><input type="password" inputMode="numeric" pattern="[0-9]*" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="Contoh: 1234" maxLength={4} onKeyDown={(e) => { if (e.key === "Enter") void startPlayer(); }} />
      {loginError && <span className="error">{loginError}</span>}
      <button className="primary full" disabled={!nickname.trim() || pin.length !== 4 || loginBusy} onClick={startPlayer}>{loginBusy ? "Memeriksa..." : <>Masuk ke Desa <ArrowRight size={18} /></>}</button>
      <small className="id-note">Nama + kelas + PIN yang sama akan membuka kembali nilai dan dashboard-mu. Ingat PIN-mu ya!</small>
      <button className="text-button" onClick={() => setScreen("home")}><ArrowLeft size={16} /> Kembali</button>
    </section>}

    {screen === "map" && <section className="map-screen">
      <div className={`map-frame ${zoom ? "zooming" : ""}`}>
        <div className="map-board photo" style={stageStyle}>
          <img className="map-photo" src="/images/peta-desa-16x9.jpg" alt="Peta desa petualangan Simfii" draggable={false} />
          <div className="map-overlay">
            <div className="mp mp-ui mp-title" style={ui(16, 20, 512, 172)}><span className="mt-icon">🏠</span><div><b>Petualangan Isim dan Fi&apos;il</b><small>Mengenal Isim dan Fi&apos;il</small></div></div>
            <div className="mp mp-ui mp-bubble" style={ui(526, 28, 482, 144)}><span className="mb-avatar">🕵️</span><p>Halo, <b>{player?.nickname || "Detektif"}</b>! Ayo jelajahi rumah-rumah dan selesaikan misi untuk belajar isim dan fi&apos;il!</p></div>
            <div className="mp mp-ui mp-progress" style={ui(1062, 36, 386, 90)}><span className="mp-star">★</span><div><b>Progres Belajar</b><div className="bar"><i style={{ width: `${progress}%` }} /></div></div><em>{completed.length}/{TOTAL_POS}</em></div>
            <button className="mp mp-ui mp-dash" style={ui(1062, 134, 386, 56)} onClick={openDashboard}>📊 Dashboard Saya</button>
            <button className="mp mp-ui mp-gear" style={ui(1450, 44, 76, 76)} onClick={() => setShowHelp(true)} aria-label="Cara Bermain">?</button>
            {positions.map((item) => {
              const L = posLayout[item.id];
              const st = status[item.id];
              const sc = completed.includes(item.id) ? scoreOf(item.id) : null;
              const go = () => enterPosition(item.id);
              return <Fragment key={item.id}>
                <button className={`mp hit ${st}`} style={{ ...boxStyle(L.hit), "--pin": item.color } as CSSProperties} disabled={st === "locked"} onClick={go} aria-label={`Pos ${item.id}: ${item.title}`}>
                  {sc && !L.drop ? <span className="pin-stars">{[0, 1, 2].map((i) => <i key={i} className={sc.percent >= [34, 67, 100][i] ? "on" : ""}>★</i>)}</span> : null}
                </button>
                {L.drop ? <button className={`mp mp-dropwrap ${st}`} style={{ left: `${(L.drop.x / MAP_W) * 100}%`, top: `${(L.drop.y / MAP_H) * 100}%`, "--pin": item.color } as CSSProperties} disabled={st === "locked"} onClick={go} tabIndex={-1} aria-hidden="true">{sc ? <span className="pin-stars">{[0, 1, 2].map((i) => <i key={i} className={sc.percent >= [34, 67, 100][i] ? "on" : ""}>★</i>)}</span> : null}<span className="pin-drop"><b>{item.id}</b></span></button> : null}
                <button className={`mp mp-pill ${st}`} style={boxStyle(L.pill)} disabled={st === "locked"} onClick={go} tabIndex={-1}>
                  <span className={`pl-icon ${st}`}>{st === "locked" ? <LockKeyhole size={16} /> : st === "done" ? <Check size={18} /> : "★"}</span>
                  <span className="pl-text"><b>{item.title}</b><span className="ar" dir="rtl">{item.arabic}</span></span>
                </button>
              </Fragment>;
            })}
            <button className="mp mp-ui mp-book" style={ui(18, 842, 388, 128)} onClick={() => setShowSummary(true)}><span className="mb-icon">📖</span><div><b>Ringkasan Materi</b><small>Ciri isim dan fi&apos;il yang sudah kamu pelajari</small></div><i>→</i></button>
            <button className="mp mp-ui mp-sign" style={ui(1268, 736, 214, 128)} onClick={() => (nextPosition ? enterPosition(nextPosition.id) : setScreen("result"))}><span>{nextPosition ? "Jalur Menuju Misi Berikutnya" : "Lihat Skor Akhir"}</span><ArrowRight size={22} /></button>
            <div className="mp mp-ui mp-chest" style={ui(1300, 878, 232, 100)}><span>🎁</span><div><b>Bintang</b><small>★ {starsEarned}/5</small></div></div>
          </div>
        </div>
      </div>
    </section>}

    {screen === "learn" && slide && <section className="content-section">
      <button className="back-link" onClick={() => setScreen("map")}><ArrowLeft size={16} /> Kembali ke peta</button>
      <div className="learning-heading"><div className="lh-icon">{positions[position - 1].icon}</div><div><span className="eyebrow accent">POS {position} · {positions[position - 1].title.toUpperCase()}</span><h2>{slide.title}</h2></div><span className="progress-label">Materi {slideIndex + 1}/{posSlides.length}</span></div>
      <div className={`slide-card ${slide.kind === "signs" && slide.tag ? slide.tag : ""}`}>
        {slide.kind === "definition" && <div className="definition">
          <div className="ar arabic-big" dir="rtl">{slide.arabic}</div>
          <p className="definition-text">{slide.text}</p>
          <div className="example-row">{slide.examples.map((ex) => <div key={ex.arabic} className={`example-chip ${ex.tag ?? ""}`}>
            {ex.tag && <em className={`tag ${ex.tag}`}>{tagLabels[ex.tag]}</em>}
            <span className="ar" dir="rtl">{ex.arabic}</span><small>{ex.meaning}</small></div>)}</div>
        </div>}
        {slide.kind === "signs" && <div>
          {slide.tag && <div className={`tag-banner ${slide.tag}`}>{tagLabels[slide.tag]}</div>}
          <p className="slide-intro">{slide.intro}</p>
          <div className="legend"><span><i className="dot red" /> Merah = tanda / ciri</span><span><i className="dot blue" /> Biru = kata aslinya</span></div>
          <div className={`sign-grid ${slide.tag ?? ""}`}>{slide.items.map((item) => <div className="sign-card" key={item.name}>
            <b>{item.name}</b><small><Mixed text={item.rule} /></small>
            <div className="sign-example"><Segs segs={item.segs} /><em>{item.meaning}</em></div>
            <div className="sign-part">Bagian merah: <span className="ar hl" dir="rtl">{item.part}</span></div>
          </div>)}</div>
        </div>}
        {slide.kind === "words" && <div>
          <p className="slide-intro">{slide.intro}</p>
          {slide.groups.map((g) => <div className={`word-group ${g.tag ?? ""}`} key={g.title}>
            <div className="wg-head"><b>{g.title}</b>{g.note && <small>{g.note}</small>}</div>
            <div className="word-grid">{g.words.map((w) => <div className="word-card" key={w.arabic}><span className="ar word-ar" dir="rtl">{w.arabic}</span><span className="word-id">{w.meaning}</span></div>)}</div>
          </div>)}
        </div>}
        {slide.kind === "mindmap" && <div className="cm">
          <div className="cm-root"><span className="ar" dir="rtl">كَلِمَةٌ</span><small>Kata dalam bahasa Arab</small></div>
          <div className="cm-split"><i /><i /></div>
          <div className="cm-cols">
            {(["isim", "fiil"] as const).map((k) => <div key={k} className={`cm-col ${k}`}>
              <div className="cm-head"><span className="ar" dir="rtl">{k === "isim" ? "الاِسْمُ" : "الْفِعْلُ"}</span><b>{k === "isim" ? "ISIM" : "FI'IL"}</b><small>{k === "isim" ? "Kata benda / nama" : "Kata kerja"}</small></div>
              <div className="cm-branches">{mindmapBranches.map((br) => <div className="cm-branch" key={br.title}><span className="cm-icon">{br.icon}</span><div><b>{br.title}</b><p><Mixed text={br[k]} /></p></div></div>)}</div>
            </div>)}
          </div>
          <div className="cm-key"><b>Kunci mengingat:</b> isim <em>tanpa waktu</em> ⏳✗ &nbsp;|&nbsp; fi&apos;il <em>punya waktu</em> ⏰✓</div>
        </div>}
        {slide.kind === "table" && <div>
          <p className="slide-intro">Gunakan tabel ini untuk mengingat perbedaan isim dan fi&apos;il.</p>
          <div className="table-scroll"><table className="diff-table"><thead><tr><th>Aspek</th><th className="isim">Isim</th><th className="fiil">Fi&apos;il</th></tr></thead>
            <tbody>{tableRows.map((row) => <tr key={row.aspect}><th><Mixed text={row.aspect} /></th><td><Mixed text={row.isim} /></td><td><Mixed text={row.fiil} /></td></tr>)}</tbody></table></div>
        </div>}
        <div className="slide-nav">
          <button className="secondary" disabled={slideIndex === 0} onClick={() => setSlideIndex(slideIndex - 1)}><ArrowLeft size={16} /> Sebelumnya</button>
          <div className="word-dots">{posSlides.map((_, i) => <span key={i} className={i <= slideIndex ? "active" : ""} />)}</div>
          <button className="primary" onClick={() => { if (slideIndex < posSlides.length - 1) setSlideIndex(slideIndex + 1); else if (completed.includes(position)) setScreen("map"); else { setQIndex(0); setSelected(""); setScreen("quiz"); } }}>{slideIndex < posSlides.length - 1 ? "Berikutnya" : completed.includes(position) ? "Selesai Membaca" : "Mulai Evaluasi"} <ArrowRight size={16} /></button>
        </div>
      </div>
    </section>}

    {screen === "quiz" && currentQuestion && <section className="quiz-wrap">
      <div className="quiz-top"><button className="back-link" onClick={() => setScreen("map")}><ArrowLeft size={16} /> Kembali ke peta</button><span className="quiz-count">POS {position} · SOAL {qIndex + 1}/{posQuestions.length}</span></div>
      <div className="progress-track"><div style={{ width: `${((qIndex + 1) / posQuestions.length) * 100}%` }} /></div>
      <div className="quiz-card">
        <span className="eyebrow light">EVALUASI POS {position}</span>
        <h2><Mixed text={currentQuestion.prompt} /></h2>
        <div className="answer-grid">{currentQuestion.options.map((option, index) => <button key={option} className={`answer-option c${index} ${selected === option ? "selected" : ""}`} onClick={() => setSelected(option)}><span>{String.fromCharCode(65 + index)}</span><i><Mixed text={option} /></i></button>)}</div>
        <button className="primary full" disabled={!selected} onClick={submitAnswer}>{qIndex === posQuestions.length - 1 ? "Selesaikan dan Lihat Kunci Jawaban" : "Jawaban Berikutnya"} <ArrowRight size={18} /></button>
      </div>
    </section>}

    {screen === "review" && (() => { const sc = scoreOf(position); return <section className="content-section review-section">
      <div className="review-hero">
        <div className="review-ring" style={{ "--p": sc.percent } as CSSProperties}><div><b>{sc.percent}</b><small>nilai</small></div></div>
        <div className="review-hero-text">
          <span className="eyebrow accent">KUNCI JAWABAN · POS {position}</span>
          <h2>{positions[position - 1].icon} {positions[position - 1].title}</h2>
          <div className="review-score"><b>{sc.correct}</b> dari {sc.total} soal benar</div>
          <Stars value={sc.percent} size={34} />
          <p>{posCheer(sc.percent)}</p>
        </div>
      </div>
      <div className="review-list">{posQuestions.map((item, index) => {
        const mine = answers[item.id] ?? "";
        const right = mine === item.answer;
        return <article key={item.id} className={`review-item ${right ? "right" : "wrong"}`} style={{ animationDelay: `${index * 0.07}s` }}>
          <div className="review-q"><span className="review-no">{index + 1}</span><b><Mixed text={item.prompt} /></b><span className="review-mark">{right ? <Check size={20} /> : <X size={20} />}</span></div>
          <div className="review-answers">
            <div className={`ans-box ${right ? "good" : "bad"}`}><small>{right ? "✅ Jawabanmu (benar)" : "❌ Jawabanmu"}</small><p>{mine ? <Mixed text={mine} /> : "(tidak dijawab)"}</p></div>
            {!right && <div className="ans-box good"><small>✅ Jawaban yang benar</small><p><Mixed text={item.answer} /></p></div>}
          </div>
          <div className="review-reason"><span className="bulb">💡</span><div><small>Alasan</small><p><Mixed text={item.reason} /></p></div></div>
        </article>;
      })}</div>
      <div className="hero-actions centered"><button className="primary" onClick={() => setScreen("map")}>{position === QUIZ_POS ? "Kembali ke Peta, Buka Aula Bintang" : "Kembali ke Peta"} <ArrowRight size={18} /></button></div>
    </section>; })()}

    {screen === "dashboard" && player && <StudentDashboard player={player} attempts={attemptsAll} partial={sessionAnswers} online={online} loading={dashLoading} onBack={() => setScreen("map")} onReplay={resetAdventure} onMateri={openMateri} />}

    {screen === "result" && <section className="result-panel">
      {finalScore >= 60 && <div className="confetti" aria-hidden="true">{Array.from({ length: 24 }).map((_, i) => <i key={i} style={{ "--i": i } as CSSProperties} />)}</div>}
      <span className="eyebrow accent">POS 6 · AULA BINTANG</span>
      <h2>Hebat, {player?.nickname || "Detektif"}!</h2>
      <Stars value={finalScore} />
      <div className="big-score">{finalScore}<small>/100</small></div>
      <div className="predicate">{predicate}</div>
      <p className="result-note">Bintang terisi sesuai nilai akhir: setiap 20 poin mengisi satu bintang penuh. Nilai akhir dihitung dari {totalCorrect} jawaban benar dari {questions.length} soal.</p>
      <div className="score-grid">{positions.slice(0, QUIZ_POS).map((item) => { const s = scoreOf(item.id); const done = completed.includes(item.id); return <div className="score-card" key={item.id} style={{ "--pin": item.color } as CSSProperties}><span>{item.icon}</span><small>POS {item.id}</small><b>{done ? `${s.correct}/${s.total}` : "-"}</b><em>{done ? `Nilai ${s.percent}` : "Belum dikerjakan"}</em></div>; })}</div>
      <div className="result-summary"><div><span>Jawaban benar</span><b>{totalCorrect} dari {questions.length}</b></div><div><span>Soal sudah dikerjakan</span><b>{totalAnswered} dari {questions.length}</b></div><div><span>Nilai akhir</span><b>{finalScore} / 100</b></div></div>
      <div className="save-status">{saving ? "Menyimpan hasil petualangan..." : saved ? "✓ Hasil berhasil disimpan." : "Nilai tampil di perangkat ini. Penyimpanan server belum berhasil atau belum dikonfigurasi."}</div>
      <div className="hero-actions centered"><button className="primary" onClick={openDashboard}>📊 Dashboard Saya</button><button className="secondary" onClick={() => setScreen("map")}>Lihat Peta Desa</button><button className="secondary" onClick={resetAdventure}><RotateCcw size={16} /> Ulangi Petualangan</button></div>
    </section>}
    </div>
  );
  const modals = (
    <>
    {showHelp && <div className="modal-back" onClick={() => setShowHelp(false)}><div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Cara bermain">
      <button className="modal-x" onClick={() => setShowHelp(false)} aria-label="Tutup"><X size={18} /></button>
      <h2>📖 Cara Bermain</h2>
      <ol className="howto">
        <li><b>Isi nama detektif.</b> Tulis nama panggilan dan kode kelas, lalu masuk ke desa.</li>
        <li><b>Kunjungi rumah bernomor.</b> Klik bangunan di peta. Pos dibuka berurutan dari 1 sampai 6.</li>
        <li><b>Pos 1 sampai 3: baca materi.</b> Pelajari isim, fi&apos;il, dan perbedaannya, lalu kerjakan soal evaluasi.</li>
        <li><b>Lihat kunci jawaban.</b> Setiap pos menampilkan jawabanmu, jawaban yang benar, dan alasannya.</li>
        <li><b>Pos 4 dan 5: uji dirimu.</b> Soal evaluasi menyeluruh, lalu soal akhir yang lebih sulit.</li>
        <li><b>Pos 6: kumpulkan bintang.</b> Lihat skor tiap pos dan nilai akhir dari 100.</li>
      </ol>
      <button className="primary full" onClick={() => setShowHelp(false)}>Siap, Ayo Mulai!</button>
    </div></div>}
    {showSummary && <div className="modal-back" onClick={() => setShowSummary(false)}><div className="modal wide" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Ringkasan materi">
      <button className="modal-x" onClick={() => setShowSummary(false)} aria-label="Tutup"><X size={18} /></button>
      <h2>📖 Ringkasan Materi</h2>
      <div className="table-scroll"><table className="diff-table"><thead><tr><th>Aspek</th><th className="isim">Isim</th><th className="fiil">Fi&apos;il</th></tr></thead>
        <tbody>{tableRows.map((row) => <tr key={row.aspect}><th><Mixed text={row.aspect} /></th><td><Mixed text={row.isim} /></td><td><Mixed text={row.fiil} /></td></tr>)}</tbody></table></div>
    </div></div>}
    </>
  );

  // Halaman awal dan peta memakai gambar 16:9: dipasang utuh di tengah layar dengan latar kabur di sisi.
  if (imageScreen) {
    const bg = screen === "home" ? "/images/halaman-awal.jpg" : "/images/peta-desa-16x9.jpg";
    return <main className="viewport" style={{ "--accent": accent, "--bg": `url(${bg})` } as CSSProperties}>
      {portrait && <div className="rotate-hint">📱 Putar HP ke mode landscape agar gambar tampil lebih besar dan jelas</div>}
      <div className="stage" style={{ transform: `translate(-50%, -50%) scale(${scale})`, visibility: ready ? "visible" : "hidden" }}>
        {body}
        {modals}
      </div>
    </main>;
  }

  // Halaman lain mengikuti lebar layar dan digulir seperti halaman web biasa.
  return <main className="page" style={{ "--accent": accent } as CSSProperties}>
    {topbar}
    {body}
    {modals}
  </main>;
}
