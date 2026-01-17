"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { content, type Language } from "@/lib/content"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { LanguageSwitcher } from "@/components/language-switcher"
import { HeroSection } from "@/components/hero-section"
import { EventDetails } from "@/components/event-details"
import { FooterSection } from "@/components/footer-section"
import { ContactSection } from "@/components/contact-section"
import { ShareButtons } from "@/components/share-buttons"
import { MandalaPattern } from "@/components/mandala-pattern"
import { FloatingImages } from "@/components/floating-images"
import { Shield } from "lucide-react"

type Theme = "light" | "dark" | "festive"

export default function SaraswatiPujaInvitation() {
  const [theme, setTheme] = useState<Theme>("light")
  const [language, setLanguage] = useState<Language>("hi")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Remove all theme classes first
    document.documentElement.classList.remove("dark", "festive")
    // Add the current theme class if not light
    if (theme !== "light") {
      document.documentElement.classList.add(theme)
    }
  }, [theme])

  const currentContent = content[language]

  if (!mounted) {
    return null
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <FloatingImages />

      {/* Fixed background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
        <MandalaPattern className="absolute top-0 right-0 w-[500px] h-[500px] text-primary/5 translate-x-1/4 -translate-y-1/4" />
        <MandalaPattern className="absolute bottom-0 left-0 w-[500px] h-[500px] text-primary/5 -translate-x-1/4 translate-y-1/4" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪷</span>
            <span className="font-serif text-lg font-semibold text-primary hidden sm:inline">
              {language === "hi" ? "सरस्वती पूजा" : "Saraswati Puja"}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher language={language} setLanguage={setLanguage} content={currentContent} />
            <ThemeSwitcher theme={theme} setTheme={setTheme} content={currentContent} />
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors"
              title={language === "hi" ? "एडमिन लॉगिन" : "Admin Login"}
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">{language === "hi" ? "एडमिन" : "Admin"}</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10">
        <HeroSection content={currentContent} />
        <EventDetails content={currentContent} />
        <FooterSection content={currentContent} />
        <ContactSection content={currentContent} />
        <ShareButtons content={currentContent} language={language} />
      </div>

      {/* Footer copyright */}
      <footer className="py-6 text-center text-sm text-muted-foreground relative z-10">
        <p>
          © 2026 {language === "hi" ? "छात्र समिति" : "Student Committee"} •{" "}
          {language === "hi" ? "सर्वाधिकार सुरक्षित" : "All Rights Reserved"}
        </p>
      </footer>
    </main>
  )
}
