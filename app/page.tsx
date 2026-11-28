"use client";
import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, Check, LockKeyhole, RotateCcw, X } from "lucide-react";
import { questionsOf } from "@/lib/questions";
import { materiById, materiList, mindmapBranches, tableRows, tagLabels, type MateriId, type Seg } from "@/lib/content";
import { Mixed } from "./mixed";
import { StudentDashboard } from "./student-dashboard";
import type { AnswerRow, AttemptRow } from "@/lib/analytics";
import { type PinStatus } from "./scenery";
import { HUB, mapLayouts, pctBox, pctRect, type Rect } from "@/lib/maplayout";

type Screen = "home" | "identity" | "materi" | "map" | "learn" | "quiz" | "review" | "result" | "dashboard";
type Player = { id: string; nickname: string; classCode: string };

const TOTAL_POS = 6;
const QUIZ_POS = 5;
const MATERI_IDS = materiList.map((m) => m.id);
const emptyBy = <T,>(v: T) => Object.fromEntries(MATERI_IDS.map((id) => [id, v])) as Record<MateriId, T>;
const ZOOM_MS = 950;
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
  const [materiId, setMateriId] = useState<MateriId>("isimfiil");
  const [completedBy, setCompletedBy] = useState<Record<MateriId, number[]>>(() => emptyBy<number[]>([]));
  const [dashFrom, setDashFrom] = useState<"map" | "materi">("map");
  const [saving, setSaving] = useState(false);
  const [savedBy, setSavedBy] = useState<Record<MateriId, boolean>>(() => emptyBy(false));
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
  const mapRef = useRef<HTMLDivElement | null>(null);

  const M = materiById[materiId];
  const positions = M.positions;
  const slides = M.slides;
  const questions = useMemo(() => questionsOf(materiId), [materiId]);
  const completed = completedBy[materiId];
  const saved = savedBy[materiId];
  const setCompleted = (fn: (list: number[]) => number[]) => setCompletedBy((prev) => ({ ...prev, [materiId]: fn(prev[materiId]) }));
  const setSaved = (v: boolean) => setSavedBy((prev) => ({ ...prev, [materiId]: v }));
  const posQuestions = useMemo(() => questions.filter((item) => item.position === position), [questions, position]);
  const currentQuestion = posQuestions[qIndex];
  const posSlides = slides[position] || [];
  const slide = posSlides[slideIndex];
  const accent = positions[Math.min(position, TOTAL_POS) - 1].color;

  // Jawaban sesi ini untuk semua materi (dashboard memilahnya per materi).
  const sessionRowsOf = (m: MateriId): AnswerRow[] => questionsOf(m)
    .filter((q) => completedBy[m].includes(q.position) && answers[q.id] !== undefined)
    .map((q) => ({ question_id: q.id, category: q.category, answer: answers[q.id] ?? "", correct: answers[q.id] === q.answer }));
  const sessionAnswers: AnswerRow[] = MATERI_IDS.flatMap(sessionRowsOf);
  const sessionAttempts: AttemptRow[] = MATERI_IDS
    .filter((m) => [1, 2, 3, 4, 5].every((id) => completedBy[m].includes(id)) && !savedBy[m])
    .map((m) => { const rows = sessionRowsOf(m); return { id: `sesi-${m}`, score: rows.filter((a) => a.correct).length, total: questionsOf(m).length, created_at: new Date().toISOString(), answers: rows }; });
  const attemptsAll: AttemptRow[] = [...sessionAttempts, ...history];

  // Setiap pindah halaman, slide materi, atau soal: langsung tampil dari bagian paling atas.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [screen, position, slideIndex, qIndex]);

  useEffect(() => {
    if (screen !== "map") return;
    const box = mapRef.current;
    const pin = box?.querySelector<HTMLElement>(".hit.next, .hit.open");
    if (box && pin) box.scrollLeft = pin.offsetLeft - box.clientWidth / 2;
  }, [screen, completed]);

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
    setToken(null); setHistory([]); setOnline(false); setScreen("materi");
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
        setToken(data.token ?? null); setHistory(data.attempts ?? []); setOnline(true); setScreen("materi");
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
        body: JSON.stringify({ materi: materiId, answers: questions.map((item) => ({ questionId: item.id, answer: record[item.id] ?? "" })) }),
      });
      setSaved(response.ok);
      if (response.ok) await refreshHistory(token);
    } catch { setSaved(false); }
    finally { setSaving(false); }
  };

  const openDashboard = (from: "map" | "materi" = "map") => { setDashFrom(from); setScreen("dashboard"); void refreshHistory(); };
  const chooseMateri = (id: MateriId) => { setMateriId(id); setPosition(1); setSlideIndex(0); setQIndex(0); setSelected(""); setScreen("map"); };
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
    const L = mapLayouts[materiId];
    const c = L.pos[id].hit;
    if (isUnlocked(id)) zoomThen((c.cx / L.w) * 100, (c.cy / L.h) * 100, () => openPosition(id));
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
    const mine = new Set(questions.map((item) => item.id));
    setPosition(1); setSlideIndex(0); setQIndex(0); setSelected("");
    setAnswers((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => !mine.has(id))));
    setCompleted(() => []); setSaved(false); setScreen("map");
  };

  const predicate = finalScore >= 90 ? "Detektif Super! 🏅" : finalScore >= 75 ? "Detektif Hebat! 🎉" : finalScore >= 60 ? "Detektif Handal 👍" : "Detektif Pemula, Ayo Berlatih Lagi! 💪";
  const goHome = () => setScreen(player ? "materi" : "home");
  const posCheer = (p: number) => p >= 90 ? "Luar biasa! Kamu menguasai materi ini. 🌟" : p >= 70 ? "Hebat! Sedikit lagi sempurna. 🎉" : p >= 50 ? "Lumayan! Baca alasannya, lalu coba lagi nanti. 💡" : "Tidak apa-apa. Pelajari kunci jawabannya dan kamu pasti bisa! 💪";
  const stageStyle = zoom ? ({ transformOrigin: `${zoom.x}% ${zoom.y}%` } as CSSProperties) : undefined;

  const imageScreen = screen === "home" || screen === "map" || screen === "materi";
  const topbar = (
    <header className="topbar">
      <button className="brand" onClick={goHome}><span className="brand-mark">🕵️</span><span><b>Simfii</b><small>اِسْمٌ وَفِعْلٌ</small></span></button>
      <nav><button className={screen === "materi" ? "on" : ""} onClick={goHome}>{player ? "📚 Kumpulan Materi" : "Beranda"}</button>{player && <button onClick={() => openDashboard("materi")}>📊 Dashboard</button>}<a href="/guru">Ruang Guru</a></nav>
    </header>
  );
  const body = (
    <div key={screen} className={`screen-enter screen-${screen}`}>
    {screen === "home" && <><section className={`home-stage ${zoom ? "zooming" : ""}`}>
      <div className="home-scene" style={stageStyle}><img className="home-img" src="/images/halaman-awal.jpg" alt="Simfii: ayo jelajahi dunia Bahasa Arab dan pahami perbedaan antara isim dan fi'il" draggable={false} /></div>
      <button className="hs hs-start" aria-label="Mulai Petualangan" onClick={() => zoomThen(70, 72, () => setScreen(player ? "materi" : "identity"))} />
      <button className="hs hs-q" aria-label="Cara Bermain" onClick={() => setShowHelp(true)}>?</button>
      <button className="hs hs-help" onClick={() => setShowHelp(true)}><span className="hh-icon">📖</span><b>Cara Bermain</b><i>→</i></button>
      <a className="hs hs-guru" href="/guru">Ruang Guru</a>
    </section><div className="home-band" aria-hidden="true" /></>}

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

    {screen === "materi" && (() => {
      const ui = (r: Rect) => pctRect(r, HUB.w, HUB.h);
      const navTo = {
        home: () => setScreen("home"), materi: () => setScreen("materi"),
        peta: () => setScreen("map"), profil: () => openDashboard("materi"),
      };
      const labels = { home: "Beranda", materi: "Materi", peta: "Peta Misi", profil: "Profil" } as const;
      return <section className="hub-screen">
        <div className="hub-board" style={{ "--k": 1536 / HUB.w } as CSSProperties}>
          <img className="hub-img" src={HUB.img} alt="Kumpulan Materi: Isim dan Fi'il, serta Mubtada' dan Khabar" draggable={false} />
          <div className="map-overlay">
            {(["home", "materi", "peta", "profil"] as const).flatMap((k) => [
              <button key={`t-${k}`} className="mp nav-hit" style={ui(HUB.nav.top[k])} aria-label={labels[k]} onClick={navTo[k]} />,
              <button key={`b-${k}`} className="mp nav-hit" style={ui(HUB.nav.bottom[k])} aria-label={labels[k]} onClick={navTo[k]} />,
            ])}
            {materiList.map((m) => {
              const c = HUB.cards[m.id];
              const done = completedBy[m.id].length;
              return <Fragment key={m.id}>
                <button className="mp nav-hit hub-card" style={ui(c.card)} aria-label={`Mulai belajar ${m.title}`} onClick={() => chooseMateri(m.id)} />
                <div className="mp hub-progress" style={ui(c.progress)} aria-label={`${done} dari ${TOTAL_POS} pos selesai`}><div className="bar"><i style={{ width: `${Math.round((done / TOTAL_POS) * 100)}%` }} /></div><small>{done}/{TOTAL_POS} pos</small></div>
              </Fragment>;
            })}
            <div className="mp hub-line" style={ui(HUB.mubtadaLine)}><span className="ar" dir="rtl">الْجُمْلَةُ الاِسْمِيَّةُ</span></div>
          </div>
        </div>
        <a className="hub-guru" href="/guru">Ruang Guru</a>
      </section>;
    })()}

    {screen === "map" && (() => {
      const L = mapLayouts[materiId];
      const ui = (r: Rect) => pctRect(r, L.w, L.h);
      const goNext = () => (nextPosition ? enterPosition(nextPosition.id) : setScreen("result"));
      const navTo = { home: () => setScreen("home"), materi: () => setScreen("materi"), peta: goNext, profil: () => openDashboard("map") };
      const labels = { home: "Beranda", materi: "Materi", peta: "Peta Misi", profil: "Profil" } as const;
      return <section className="map-screen">
      <div className={`map-frame portrait ${zoom ? "zooming" : ""}`} ref={mapRef}>
        <div className="map-board photo portrait" style={{ ...stageStyle, aspectRatio: `${L.w} / ${L.h}`, "--k": 1536 / L.w } as CSSProperties}>
          <img className="map-photo" src={L.img} alt={L.alt} draggable={false} />
          <div className="map-overlay">
            {L.title && <div className="mp mp-ui mp-title" style={ui(L.title)}><span className="mt-icon">🏠</span><div><b>{M.adventure}</b><small>{M.mapSub}</small></div></div>}
            {L.bubble && <div className="mp mp-ui mp-bubble" style={ui(L.bubble)}><span className="mb-avatar">🕵️</span><p>Halo, <b>{player?.nickname || "Detektif"}</b>! {M.bubble}</p></div>}
            {L.progress && <div className="mp mp-ui mp-progress" style={ui(L.progress)}><span className="mp-star">★</span><div><b>Progres Belajar <em>{completed.length}/{TOTAL_POS}</em></b><div className="bar"><i style={{ width: `${progress}%` }} /></div></div></div>}
            {L.chipProgress && <div className="mp mp-ui mp-progress mp-chip" style={ui(L.chipProgress)}><span className="mp-star">★</span><div><b>Progres</b><div className="bar"><i style={{ width: `${progress}%` }} /></div></div><em>{completed.length}/{TOTAL_POS}</em><button className="mp-q" onClick={() => setShowHelp(true)} aria-label="Cara Bermain">?</button></div>}
            {L.help && <button className="mp nav-hit" style={ui(L.help)} aria-label="Cara Bermain" onClick={() => setShowHelp(true)} />}
            {L.back && <button className="mp nav-hit" style={ui(L.back)} aria-label="Kembali ke Kumpulan Materi" onClick={() => setScreen("materi")} />}
            {(["home", "materi", "peta", "profil"] as const).map((k) => <button key={k} className="mp nav-hit" style={ui(L.nav[k])} aria-label={labels[k]} onClick={navTo[k]} />)}
            {positions.map((item) => {
              const PL = L.pos[item.id];
              const st = status[item.id];
              const sc = completed.includes(item.id) ? scoreOf(item.id) : null;
              const go = () => enterPosition(item.id);
              return <Fragment key={item.id}>
                <button className={`mp hit ${st}`} style={{ ...pctBox(PL.hit, L.w, L.h), "--pin": item.color } as CSSProperties} disabled={st === "locked"} onClick={go} aria-label={`Pos ${item.id}: ${item.title}`}>
                  {sc && L.mode === "pills" ? <span className="pin-stars">{[0, 1, 2].map((i) => <i key={i} className={sc.percent >= [34, 67, 100][i] ? "on" : ""}>★</i>)}</span> : null}
                </button>
                {PL.pill && <button className={`mp mp-pill ${st}`} style={pctBox(PL.pill, L.w, L.h)} disabled={st === "locked"} onClick={go} tabIndex={-1}>
                  <span className={`pl-icon ${st}`}>{st === "locked" ? <LockKeyhole size={16} /> : st === "done" ? <Check size={18} /> : "★"}</span>
                  <span className="pl-text"><b>{item.title}</b><span className="ar" dir="rtl">{item.arabic}</span></span>
                </button>}
                {PL.badge && <span className={`mp mp-badge ${st}`} style={{ left: `${(PL.badge.x / L.w) * 100}%`, top: `${(PL.badge.y / L.h) * 100}%` }} aria-hidden="true">
                  {st === "locked" ? <LockKeyhole size={16} /> : st === "done" ? <Check size={18} /> : "★"}
                </span>}
              </Fragment>;
            })}
            {L.summary && <button className="mp mp-ui mp-book" style={ui(L.summary)} onClick={() => setShowSummary(true)}><span className="mb-icon">📖</span><div><b>Ringkasan Materi</b><small>{M.sidekick}</small></div><i>→</i></button>}
            {L.chipSummary && <button className="mp mp-ui mp-book mp-chipbook" style={ui(L.chipSummary)} onClick={() => setShowSummary(true)}><span className="mb-icon">📖</span><div><b>Ringkasan Materi</b></div><i>→</i></button>}
            {L.next && <button className="mp nav-hit" style={ui(L.next)} aria-label={nextPosition ? "Lanjut ke misi berikutnya" : "Lihat skor akhir"} onClick={goNext} />}
          </div>
        </div>
      </div>
    </section>; })()}

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
            {item.extra && <div className="sign-extra"><small>Contoh lain</small>{item.extra.map((e) => <span className="xc" key={e.ar}><span className="ar" dir="rtl">{e.ar}</span><em>{e.id}</em></span>)}</div>}
          </div>)}</div>
        </div>}
        {slide.kind === "words" && <div>
          <p className="slide-intro">{slide.intro}</p>
          {slide.groups.map((g) => <div className={`word-group ${g.tag ?? ""}`} key={g.title}>
            <div className="wg-head"><b>{g.title}</b>{g.note && <small>{g.note}</small>}</div>
            <div className="word-grid">{g.words.map((w) => <div className="word-card" key={w.arabic}><span className="ar word-ar" dir="rtl">{w.arabic}</span><span className="word-id">{w.meaning}</span></div>)}</div>
          </div>)}
        </div>}
        {slide.kind === "parts" && <div>
          <p className="slide-intro">{slide.intro}</p>
          {slide.showRoles && <div className="legend"><span><i className="dot mub" /> Biru = mubtada&apos; (subjek)</span><span><i className="dot khb" /> Merah muda = khabar (predikat)</span></div>}
          <div className="parts-grid">{slide.items.map((it) => <div className="part-card" key={it.mubtada.ar + it.khabar.ar}>
            <div className="part-sentence" dir="rtl"><span className="ar pt mub">{it.mubtada.ar}</span><span className="ar pt khb">{it.khabar.ar}</span></div>
            <div className="part-roles">
              <div className="pr mub"><small>Mubtada&apos; · subjek</small><span className="ar" dir="rtl">{it.mubtada.ar}</span><em>{it.mubtada.id}</em></div>
              <div className="pr khb"><small>Khabar · predikat</small><span className="ar" dir="rtl">{it.khabar.ar}</span><em>{it.khabar.id}</em></div>
            </div>
            <div className="part-meaning">{it.meaning}</div>
            {it.note && <div className="part-note">💡 <span><Mixed text={it.note} /></span></div>}
          </div>)}</div>
          {slide.tip && <div className="part-tip"><b>💡 Kunci mengingat:</b> {slide.tip}</div>}
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

    {screen === "dashboard" && player && <StudentDashboard player={player} attempts={attemptsAll} partial={sessionAnswers} online={online} loading={dashLoading} materi={materiId} onSwitch={setMateriId} backLabel={dashFrom === "materi" ? "Kembali ke Kumpulan Materi" : "Kembali ke peta"} onBack={() => setScreen(dashFrom)} onReplay={resetAdventure} onMateri={openMateri} />}

    {screen === "result" && <section className="result-panel">
      {finalScore >= 60 && <div className="confetti" aria-hidden="true">{Array.from({ length: 24 }).map((_, i) => <i key={i} style={{ "--i": i } as CSSProperties} />)}</div>}
      <span className="eyebrow accent">{M.title.toUpperCase()} · POS 6 · AULA BINTANG</span>
      <h2>Hebat, {player?.nickname || "Detektif"}!</h2>
      <Stars value={finalScore} />
      <div className="big-score">{finalScore}<small>/100</small></div>
      <div className="predicate">{predicate}</div>
      <p className="result-note">Bintang terisi sesuai nilai akhir: setiap 20 poin mengisi satu bintang penuh. Nilai akhir dihitung dari {totalCorrect} jawaban benar dari {questions.length} soal.</p>
      <div className="score-grid">{positions.slice(0, QUIZ_POS).map((item) => { const s = scoreOf(item.id); const done = completed.includes(item.id); return <div className="score-card" key={item.id} style={{ "--pin": item.color } as CSSProperties}><span>{item.icon}</span><small>POS {item.id}</small><b>{done ? `${s.correct}/${s.total}` : "-"}</b><em>{done ? `Nilai ${s.percent}` : "Belum dikerjakan"}</em></div>; })}</div>
      <div className="result-summary"><div><span>Jawaban benar</span><b>{totalCorrect} dari {questions.length}</b></div><div><span>Soal sudah dikerjakan</span><b>{totalAnswered} dari {questions.length}</b></div><div><span>Nilai akhir</span><b>{finalScore} / 100</b></div></div>
      <div className="save-status">{saving ? "Menyimpan hasil petualangan..." : saved ? "✓ Hasil berhasil disimpan." : "Nilai tampil di perangkat ini. Penyimpanan server belum berhasil atau belum dikonfigurasi."}</div>
      <div className="hero-actions centered"><button className="primary" onClick={() => openDashboard("map")}>📊 Dashboard Saya</button><button className="secondary" onClick={() => setScreen("map")}>Lihat Peta Desa</button><button className="secondary" onClick={() => setScreen("materi")}>📚 Kumpulan Materi</button><button className="secondary" onClick={resetAdventure}><RotateCcw size={16} /> Ulangi Petualangan</button></div>
    </section>}
    </div>
  );
  const modals = (
    <>
    {showHelp && <div className="modal-back" onClick={() => setShowHelp(false)}><div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Cara bermain">
      <button className="modal-x" onClick={() => setShowHelp(false)} aria-label="Tutup"><X size={18} /></button>
      <h2>📖 Cara Bermain</h2>
      <ol className="howto">
        <li><b>Isi nama detektif.</b> Tulis nama panggilan dan kode kelas, lalu masuk ke Kumpulan Materi.</li>
        <li><b>Pilih materi, lalu kunjungi rumah bernomor.</b> Klik bangunan di peta. Pos dibuka berurutan dari 1 sampai 6.</li>
        {M.help.map((h) => <li key={h.b}><b>{h.b}</b> {h.t}</li>)}
        <li><b>Pos 6: kumpulkan bintang.</b> Lihat skor tiap pos dan nilai akhir dari 100.</li>
      </ol>
      <button className="primary full" onClick={() => setShowHelp(false)}>Siap, Ayo Mulai!</button>
    </div></div>}
    {showSummary && <div className="modal-back" onClick={() => setShowSummary(false)}><div className="modal wide" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Ringkasan materi">
      <button className="modal-x" onClick={() => setShowSummary(false)} aria-label="Tutup"><X size={18} /></button>
      <h2>📖 {M.summary.title}</h2>
      <div className="table-scroll"><table className="diff-table"><thead><tr><th>Aspek</th><th className="isim">{M.summary.head[0]}</th><th className="fiil">{M.summary.head[1]}</th></tr></thead>
        <tbody>{M.summary.rows.map((row) => <tr key={row.aspect}><th><Mixed text={row.aspect} /></th><td><Mixed text={row.a} /></td><td><Mixed text={row.b} /></td></tr>)}</tbody></table></div>
    </div></div>}
    </>
  );

  // Halaman awal dan peta memakai gambar: dibentangkan penuh selebar layar, tinggi mengikuti rasio gambar (digulir jika perlu).
  if (imageScreen) {
    return <main className="fluid" style={{ "--accent": accent } as CSSProperties}>
      {body}
      {modals}
    </main>;
  }

  // Halaman lain mengikuti lebar layar dan digulir seperti halaman web biasa.
  return <main className="page" style={{ "--accent": accent } as CSSProperties}>
    {topbar}
    {body}
    {modals}
  </main>;
}
