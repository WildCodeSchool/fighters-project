import Link from "next/link";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nerko_One } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nerkoOne = Nerko_One({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nerko-one",
});

export const metadata: Metadata = {
  title: "Application de Combats",
  description: "Gérez vos combats de fighters et visualisez les résultats.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nerkoOne.variable}`}
      >
        <div
          id="global-combats-link-container"
          style={{
            position: "fixed",
            top: "1rem",
            right: "1rem",
            zIndex: 1000,
          }}
        >
          <Link href="/combats" className="table-scrores">
            Scores
          </Link>
        </div>
        {children}
      </body>
    </html>
  );
}
