"use client"

import { Button } from "@/components/ui/button"
import type { Language, ContentType } from "@/lib/content"
import { HiLanguage } from "react-icons/hi2"

interface LanguageSwitcherProps {
  language: Language
  setLanguage: (lang: Language) => void
  content: ContentType
}

export function LanguageSwitcher({ language, setLanguage, content }: LanguageSwitcherProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === "hi" ? "en" : "hi")}
      className="gap-2 bg-card/80 backdrop-blur-sm border-primary/20"
    >
      <HiLanguage className="h-4 w-4" />
      <span className="hidden sm:inline">{content.language}:</span>
      <span className="font-semibold">{language === "hi" ? "EN" : "हिं"}</span>
    </Button>
  )
}
