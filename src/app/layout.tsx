import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Wrapper from "@/lib/Wrapper";
import { Toaster } from "sonner";
 

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
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: '#0d1420',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#f8fafc',
              borderRadius: '16px',
            },
            className: 'font-sans text-sm shadow-2xl',
          }}
        />
      </body>
    </html>
  );
}
