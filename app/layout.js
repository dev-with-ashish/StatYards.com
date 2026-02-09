import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "StatYards: Live Sports Data",
  description: "Real-time data for smart betting.",
};

import Navbar from "@/components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en-US">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased pt-16`}
        suppressHydrationWarning
      >
        <Navbar />
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          {/* Orbs will be hydrated here if needed, or static CSS in body */}
          <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px] opacity-60" />
          <div className="absolute top-[20%] right-[-200px] w-[600px] h-[600px] bg-orange-100 rounded-full blur-[100px] opacity-60" />
          <div className="absolute bottom-0 left-[10%] w-[400px] h-[400px] bg-green-100 rounded-full blur-[100px] opacity-60" />
        </div>
        {children}
      </body>
    </html>
  );
}
