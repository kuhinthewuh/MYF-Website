import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700', '800'],
  subsets: ["latin"], 
  variable: "--font-poppins" 
});

export const metadata: Metadata = {
  title: "Manteca Youth Focus | Developing Tomorrow's Leaders",
  description: "Manteca Youth Focus is a youth leadership organization dedicated to developing young leaders, encouraging higher education, and serving the community.",
};

import ConditionalNav from "@/components/ConditionalNav";
import ConditionalFooter from "@/components/ConditionalFooter";
import GlobalFooter from "@/components/GlobalFooter";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${poppins.variable} font-sans bg-myf-bg text-myf-text antialiased selection:bg-myf-teal selection:text-white`}>
        <ConditionalNav />
        {children}
        <ConditionalFooter>
          <GlobalFooter />
        </ConditionalFooter>
      </body>
    </html>
  );
}
