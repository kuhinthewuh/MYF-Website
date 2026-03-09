import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = {
  title: "Manteca Youth Focus | Developing Tomorrow's Leaders",
  description: "Manteca Youth Focus is a youth leadership organization dedicated to developing young leaders, encouraging higher education, and serving the community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${sora.variable} font-sans bg-myf-bg text-myf-text antialiased selection:bg-myf-blue selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
