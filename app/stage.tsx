"use client";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

export const STAGE_W = 1280;
export const STAGE_H = 720;

// Kanvas tetap 1280 x 720 (16:9) yang diperbesar atau diperkecil agar muat di layar apa pun.
export function StageFrame({ children, accent = "#1e88e5" }: { children: ReactNode; accent?: string }) {
  const [scale, setScale] = useState(1);
  const [ready, setReady] = useState(false);
  const [portrait, setPortrait] = useState(false);

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

  return <main className="viewport" style={{ "--accent": accent } as CSSProperties}>
    {portrait && <div className="rotate-hint">📱 Putar HP ke mode landscape agar tampilan 16:9 lebih jelas</div>}
    <div className="stage" style={{ transform: `translate(-50%, -50%) scale(${scale})`, visibility: ready ? "visible" : "hidden" }}>{children}</div>
  </main>;
}
