import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simfii — Belajar Nahwu",
  description: "Petualangan interaktif bahasa Arab kelas VII: Mubtada' dan Khabar, serta Isim dan Fi'il, masing-masing melalui enam pos.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
