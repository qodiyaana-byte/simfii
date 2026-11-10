"use client";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, Check, LockKeyhole, RotateCcw, X } from "lucide-react";
import { questions } from "@/lib/questions";
import { mindmapBranches, positions, slides, tableRows, tagLabels, type Seg } from "@/lib/content";
import { Mixed } from "./mixed";
import { HomeScene, MapScene, type PinStatus } from "./scenery";

type Screen = "home" | "identity" | "map" | "learn" | "quiz" | "review" | "result";
type Player = { id: string; nickname: string; classCode: string };

const TOTAL_POS = positions.length;
const QUIZ_POS = 5;
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
  const [completed, setCompleted] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const posQuestions = useMemo(() => questions.filter((item) => item.position === position), [position]);
  const currentQuestion = posQuestions[qIndex];
  const posSlides = slides[position] || [];
  const slide = posSlides[slideIndex];
  const accent = positions[Math.min(position, TOTAL_POS) - 1].color;

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

  const statusOf = (id: number): PinStatus => completed.includes(id) ? "done" : !isUnlocked(id) ? "locked" : nextPosition?.id === id ? "next" : "open";
  const status = Object.fromEntries(positions.map((p) => [p.id, statusOf(p.id)])) as Record<number, PinStatus>;

  // Transisi zoom: layar membesar ke arah titik yang diklik, lalu pindah layar.
  const zoomThen = (x: number, y: number, then: () => void) => {
    if (zoom) return;
    setZoom({ x, y });
    window.setTimeout(() => { then(); setZoom(null); }, ZOOM_MS);
  };

  useEffect(() => {
    if (screen !== "map") return;
    const box = scrollRef.current;
    const pin = box?.querySelector<HTMLElement>(".pin.next, .pin.open");
    if (box && pin) box.scrollLeft = pin.offsetLeft - box.clientWidth / 2;
  }, [screen, completed]);

  const startPlayer = async () => {
    if (!nickname.trim()) return;
    const p: Player = { id: crypto.randomUUID(), nickname: nickname.trim(), classCode: classCode.trim() || "UMUM" };
    setPlayer(p);
    setScreen("map");
    try {
      await fetch("/api/players", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
    } catch { /* Permainan tetap berjalan walau penyimpanan belum tersedia. */ }
  };

  const saveResults = async (record: Record<string, string>) => {
    if (!player) return;
    setSaving(true);
    try {
      const response = await fetch("/api/attempts", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: player.id, answers: questions.map((item) => ({ questionId: item.id, answer: record[item.id] ?? "" })) }),
      });
      setSaved(response.ok);
    } catch { setSaved(false); }
    finally { setSaving(false); }
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
    if (isUnlocked(id)) zoomThen(target.x, target.y, () => openPosition(id));
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

  return <main className="app-shell" style={{ "--accent": accent } as CSSProperties}>
    <header className="topbar">
      <button className="brand" onClick={goHome}><span className="brand-mark">🕵️</span><span><b>Detektif Arab</b><small>الاِسْمُ وَالْفِعْلُ</small></span></button>
      <nav><button onClick={goHome}>Beranda</button><a href="/guru">Ruang Guru</a></nav>
    </header>

    <div key={screen} className="screen-enter">
    {screen === "home" && <section className={`home-stage ${zoom ? "zooming" : ""}`}>
      <div className="home-scene" style={stageStyle}><HomeScene /></div>
      <div className="home-overlay">
        <span className="eyebrow light">PETUALANGAN BAHASA ARAB KELAS VII</span>
        <h1>Detektif Arab<small>Misi Isim dan Fi&apos;il</small></h1>
        <p>Jelajahi desa, kunjungi enam pos, kerjakan soal, dan kumpulkan bintang terbanyak!</p>
        <button className="primary big" onClick={() => zoomThen(50, 48, () => setScreen("identity"))}>Mulai Petualangan <ArrowRight size={20} /></button>
        <div className="hero-stats"><span><b>6</b> Pos</span><span><b>30</b> Soal</span><span><b>5</b> Bintang</span></div>
      </div>
    </section>}

    {screen === "identity" && <section className="center-panel">
      <div className="panel-emoji">🕵🏻‍♀️</div><span className="eyebrow">IDENTITAS DETEKTIF</span>
      <h2>Siapa nama detektif hari ini?</h2><p>Masukkan nama panggilan dan kode kelas untuk membuka peta desa.</p>
      <label>Nama panggilan</label><input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Contoh: Sami01" maxLength={30} />
      <label>Kode kelas <span className="optional">(opsional)</span></label><input value={classCode} onChange={(e) => setClassCode(e.target.value)} placeholder="Contoh: VII-A" maxLength={20} />
      <button className="primary full" disabled={!nickname.trim()} onClick={startPlayer}>Masuk ke Desa <ArrowRight size={18} /></button>
      <button className="text-button" onClick={() => setScreen("home")}><ArrowLeft size={16} /> Kembali</button>
    </section>}

    {screen === "map" && <section className="map-screen">
      <div className={`map-frame ${zoom ? "zooming" : ""}`}>
        <div className="hud hud-left"><span className="avatar">🕵️</span><span><b>{player?.nickname || "Detektif"}</b><small>{player?.classCode || "UMUM"}</small></span></div>
        <div className="hud hud-right"><span className="hud-star">★</span><span><b>{totalCorrect} benar</b><small>{completed.length}/{TOTAL_POS} pos · {progress}%</small></span></div>
        <div className="map-scroll" ref={scrollRef}>
          <div className="map-board" style={stageStyle}>
            <MapScene status={status} />
            {positions.map((item) => {
              const st = status[item.id];
              const s = completed.includes(item.id) ? scoreOf(item.id) : null;
              return <button key={item.id} className={`pin ${st}`} style={{ left: `${item.x}%`, top: `${item.y}%`, height: `${item.h}%`, "--pin": item.color } as CSSProperties} disabled={st === "locked"} onClick={() => enterPosition(item.id)} aria-label={`Pos ${item.id}: ${item.title}`}>
                <span className="pin-top">
                  {s ? <span className="pin-stars">{[0, 1, 2].map((i) => <i key={i} className={s.percent >= [34, 67, 100][i] ? "on" : ""}>★</i>)}</span> : null}
                  <span className="pin-badge">{st === "done" ? <Check size={16} /> : st === "locked" ? <LockKeyhole size={14} /> : item.id}</span>
                </span>
                <span className="pin-label"><small>POS {item.id}</small><b>{item.title}</b></span>
              </button>;
            })}
          </div>
        </div>
        <div className="map-bottom">
          <button className="primary" onClick={() => (nextPosition ? enterPosition(nextPosition.id) : setScreen("result"))}>{nextPosition ? <>Lanjutkan Misi: {nextPosition.title} <ArrowRight size={18} /></> : <>Lihat Skor Akhir <ArrowRight size={18} /></>}</button>
        </div>
      </div>
      <div className="map-legend"><span><i className="lg-open" /> Terbuka</span><span><i className="lg-done" /> Selesai</span><span><i className="lg-lock" /> Terkunci</span><span>Klik bangunan untuk masuk</span></div>
    </section>}

    {screen === "learn" && slide && <section className="content-section">
      <button className="back-link" onClick={() => setScreen("map")}><ArrowLeft size={16} /> Kembali ke peta</button>
      <div className="learning-heading"><div className="lh-icon">{positions[position - 1].icon}</div><div><span className="eyebrow accent">POS {position} · {positions[position - 1].title.toUpperCase()}</span><h2>{slide.title}</h2></div><span className="progress-label">Materi {slideIndex + 1}/{posSlides.length}</span></div>
      <div className="slide-card">
        {slide.kind === "definition" && <div className="definition">
          <div className="ar arabic-big" dir="rtl">{slide.arabic}</div>
          <p className="definition-text">{slide.text}</p>
          <div className="example-row">{slide.examples.map((ex) => <div key={ex.arabic} className={`example-chip ${ex.tag ?? ""}`}>
            {ex.tag && <em className={`tag ${ex.tag}`}>{tagLabels[ex.tag]}</em>}
            <span className="ar" dir="rtl">{ex.arabic}</span><small>{ex.meaning}</small></div>)}</div>
        </div>}
        {slide.kind === "signs" && <div>
          <p className="slide-intro">{slide.intro}</p>
          <div className="legend"><span><i className="dot red" /> Merah = tanda / ciri</span><span><i className="dot blue" /> Biru = kata aslinya</span></div>
          <div className="sign-grid">{slide.items.map((item) => <div className="sign-card" key={item.name}>
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
          <button className="primary" onClick={() => { if (slideIndex < posSlides.length - 1) setSlideIndex(slideIndex + 1); else { setQIndex(0); setSelected(""); setScreen("quiz"); } }}>{slideIndex < posSlides.length - 1 ? "Berikutnya" : "Mulai Evaluasi"} <ArrowRight size={16} /></button>
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
      <div className="hero-actions centered"><button className="primary" onClick={() => setScreen("map")}>Lihat Peta Desa</button><button className="secondary" onClick={resetAdventure}><RotateCcw size={16} /> Ulangi Petualangan</button></div>
    </section>}
    </div>

    <footer><b>Detektif Arab</b><span className="ar" dir="rtl">الاِسْمُ وَالْفِعْلُ</span><small>Media pembelajaran bahasa Arab • Kelas VII</small></footer>
  </main>;
}
