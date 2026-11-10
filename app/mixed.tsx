import type { ReactNode } from "react";

const ARABIC = /([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+(?:[ \u00A0]+[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+)*)/g;

// Memisahkan teks Arab dari teks Indonesia agar urutan tampil benar (kiri ke kanan)
// dan potongan Arab-nya diberi gaya sendiri.
export function Mixed({ text }: { text: string }): ReactNode {
  const parts = text.split(ARABIC);
  return <>{parts.map((part, i) => (i % 2 === 1 ? <span key={i} className="ar" dir="rtl">{part}</span> : <span key={i}>{part}</span>))}</>;
}
