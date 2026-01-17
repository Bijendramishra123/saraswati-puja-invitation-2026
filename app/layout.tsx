import type React from "react"
import type { Metadata, Viewport } from "next"
import { Noto_Sans, Noto_Serif_Devanagari } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const notoSans = Noto_Sans({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans",
})

const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif-devanagari",
})

export const metadata: Metadata = {
  title: "सरस्वती पूजा उत्सव निमंत्रण | Saraswati Puja Invitation",
  description:
    "Join us for the auspicious celebration of Saraswati Puja - the festival honoring the goddess of knowledge, wisdom, and arts.",
  generator: "v0.app",
  keywords: ["Saraswati Puja", "सरस्वती पूजा", "Indian Festival", "Invitation"],
}

export const viewport: Viewport = {
  themeColor: "#FF9933",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="hi" className="scroll-smooth">
      <body className={`${notoSans.variable} ${notoSerifDevanagari.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
