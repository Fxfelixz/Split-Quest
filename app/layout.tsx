import type { Metadata } from "next";
import {
  Newsreader,
  Cinzel,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
  Instrument_Serif,
  Press_Start_2P,
} from "next/font/google";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["600", "700", "900"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

const pressStart2P = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "SplitQuest",
  description: "หารบิลทริปแบบ RPG พร้อม Share Card อวดเพื่อน",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full antialiased">
      <body
        className={`${newsreader.variable} ${cinzel.variable} ${jakarta.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} ${pressStart2P.variable} min-h-full flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
