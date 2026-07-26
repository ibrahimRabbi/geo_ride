import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Wrapper from "@/lib/Wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "Geo",
  description: "ride shearing & Flight booking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} bg-[#020618]  antialiased`}>
      <body className="min-h-full flex flex-col">
        <Wrapper>
          {children}
        </Wrapper>
        
      </body>
    </html>
  );
}
