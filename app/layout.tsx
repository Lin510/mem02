import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Matematică pentru copii | Clasa 0-2",
  description: "Aplicație simplă și distractivă cu tabele colorate, teste fulger și calculator interactiv. Copilul tău exersează matematica în ritmul lui!",
  openGraph: {
    title: "Matematică pentru copii | Clasa 0-2",
    description: "Aplicație simplă și distractivă cu tabele colorate, teste fulger și calculator interactiv. Copilul tău exersează matematica în ritmul lui!",
    url: "https://mem02.vercel.app",
    siteName: "Matematică pentru copii",
    locale: "ro_RO",
    type: "website",
    images: ["/og-image.svg", "/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Matematică pentru copii | Clasa 0-2",
    description: "Aplicație simplă și distractivă pentru învățarea matematicii",
  },
};

// Force static generation for the entire app segment so pages are built as
// static HTML and hydrate on the client (SPA-like behavior).
export const dynamic = "force-static";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
