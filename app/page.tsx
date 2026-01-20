"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
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
import { Shield, Sparkles, Star, Music, BookOpen, Palette, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type Theme = "light" | "dark" | "festive"

export default function SaraswatiPujaInvitation() {
  const router = useRouter()
  const [theme, setTheme] = useState<Theme>("light")
  const [language, setLanguage] = useState<Language>("hi")
  const [mounted, setMounted] = useState(false)
  const [showScrollHint, setShowScrollHint] = useState(true)
  const [activeSection, setActiveSection] = useState("hero")
  const [scrollProgress, setScrollProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const eventRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      setShowScrollHint(false)
    }, 4000)

    // Custom scroll progress calculation
    const handleScroll = () => {
      const sections = [
        { id: "hero", ref: heroRef },
        { id: "event", ref: eventRef },
        { id: "footer", ref: footerRef },
        { id: "contact", ref: contactRef }
      ]

      // Calculate scroll progress
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0
      setScrollProgress(progress)

      // Active section detection
      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial call

    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    // Remove all theme classes first
    document.documentElement.classList.remove("dark", "festive")
    // Add the current theme class if not light
    if (theme !== "light") {
      document.documentElement.classList.add(theme)
    }
  }, [theme])

  const handleAdminClick = () => {
    router.push("/admin")
  }

  const handleScrollToSection = (section: string) => {
    // Type-safe way to handle refs
    const refs = {
      hero: heroRef,
      event: eventRef,
      footer: footerRef,
      contact: contactRef
    } as const

    const ref = refs[section as keyof typeof refs]
    if (ref?.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })
    }
  }

  const currentContent = content[language]

  if (!mounted) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden" ref={containerRef}>
      {/* Animated Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        
        {/* Animated floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full"
              initial={{
                x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
                y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 0,
                opacity: 0
              }}
              animate={{
                y: [null, -30],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Mandala patterns with animation */}
        <motion.div
          className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] opacity-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          <MandalaPattern className="w-full h-full text-primary" />
        </motion.div>

        <motion.div
          className="absolute bottom-0 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] opacity-10"
          animate={{ rotate: -360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          <MandalaPattern className="w-full h-full text-primary" />
        </motion.div>
      </div>

      {/* Floating decorative elements */}
      <FloatingImages />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-lg"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Title */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
              onClick={() => handleScrollToSection("hero")}
            >
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-lg sm:text-xl">🪷</span>
                </div>
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <div>
                <h1 className="font-serif text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {language === "hi" ? "सरस्वती पूजा" : "Saraswati Puja"}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {language === "hi" ? "ज्ञान की देवी" : "Goddess of Knowledge"}
                </p>
              </div>
            </motion.div>

            {/* Desktop Navigation Menu */}
            <div className="hidden md:flex items-center gap-6">
              {["hero", "event", "footer", "contact"].map((section) => (
                <motion.button
                  key={section}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleScrollToSection(section)}
                  className={`relative px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeSection === section
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                  }`}
                >
                  {section === "hero" && (language === "hi" ? "मुख्य" : "Home")}
                  {section === "event" && (language === "hi" ? "कार्यक्रम" : "Event")}
                  {section === "footer" && (language === "hi" ? "योगदान" : "Contribute")}
                  {section === "contact" && (language === "hi" ? "संपर्क" : "Contact")}
                  {activeSection === section && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-full -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <LanguageSwitcher language={language} setLanguage={setLanguage} content={currentContent} />
              <ThemeSwitcher theme={theme} setTheme={setTheme} content={currentContent} />
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdminClick}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-primary to-purple-600 text-white text-xs sm:text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
                title={language === "hi" ? "एडमिन लॉगिन" : "Admin Login"}
              >
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span>{language === "hi" ? "एडमिन" : "Admin"}</span>
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div className="md:hidden mt-3 flex items-center justify-center gap-3 overflow-x-auto pb-2">
            {["hero", "event", "footer", "contact"].map((section) => (
              <button
                key={section}
                onClick={() => handleScrollToSection(section)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeSection === section
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                }`}
              >
                {section === "hero" && (language === "hi" ? "मुख्य" : "Home")}
                {section === "event" && (language === "hi" ? "कार्यक्रम" : "Event")}
                {section === "footer" && (language === "hi" ? "योगदान" : "Contribute")}
                {section === "contact" && (language === "hi" ? "संपर्क" : "Contact")}
              </button>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500"
          style={{ width: `${scrollProgress * 100}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress * 100}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Scroll Hint */}
      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
                {language === "hi" ? "नीचे स्क्रॉल करें" : "Scroll down"}
              </span>
              <ChevronDown className="w-5 h-5 text-primary animate-bounce" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.div
          ref={heroRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroSection content={currentContent} />
        </motion.div>

        {/* Decorative separator */}
        <div className="relative py-8 overflow-hidden">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center">
            <div className="bg-background px-6 py-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center shadow-lg"
              >
                <Star className="w-6 h-6 text-white" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <motion.div
          ref={eventRef}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <EventDetails content={currentContent} />
        </motion.div>

        {/* Icons Section */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, label: language === "hi" ? "ज्ञान" : "Knowledge", color: "text-blue-500" },
              { icon: Music, label: language === "hi" ? "संगीत" : "Music", color: "text-purple-500" },
              { icon: Palette, label: language === "hi" ? "कला" : "Art", color: "text-pink-500" },
              { icon: Star, label: language === "hi" ? "आशीर्वाद" : "Blessings", color: "text-yellow-500" }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className={`p-3 rounded-full ${item.color} bg-opacity-10`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <span className="font-medium">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer Section */}
        <motion.div
          ref={footerRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <FooterSection content={currentContent} />
        </motion.div>

        {/* Contact Section */}
        <motion.div
          ref={contactRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <ContactSection content={currentContent} />
        </motion.div>

        {/* Share Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <ShareButtons content={currentContent} language={language} />
        </motion.div>
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {scrollProgress > 0.3 && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleScrollToSection("hero")}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300"
          >
            <ChevronDown className="w-5 h-5 rotate-180" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Footer copyright */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-8 text-center relative z-10 bg-gradient-to-t from-background via-background/80 to-transparent"
      >
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm text-muted-foreground mb-2">
            © 2026 {language === "hi" ? "छात्र समिति" : "Student Committee"} •{" "}
            {language === "hi" ? "सर्वाधिकार सुरक्षित" : "All Rights Reserved"}
          </p>
          <p className="text-xs text-muted-foreground/70">
            {language === "hi" 
              ? "ज्ञानं परमं ध्येयम् - ज्ञान सर्वोच्च लक्ष्य है"
              : "Jnanam Paramam Dhyeyam - Knowledge is the supreme goal"}
          </p>
        </div>
      </motion.footer>
    </main>
  )
}