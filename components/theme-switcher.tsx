"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FiSun, FiMoon } from "react-icons/fi"
import { HiSparkles } from "react-icons/hi2"
import type { ContentType } from "@/lib/content"

type Theme = "light" | "dark" | "festive"

interface ThemeSwitcherProps {
  theme: Theme
  setTheme: (theme: Theme) => void
  content: ContentType
}

export function ThemeSwitcher({ theme, setTheme, content }: ThemeSwitcherProps) {
  const getIcon = () => {
    switch (theme) {
      case "dark":
        return <FiMoon className="h-4 w-4" />
      case "festive":
        return <HiSparkles className="h-4 w-4" />
      default:
        return <FiSun className="h-4 w-4" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-card/80 backdrop-blur-sm border-primary/20">
          {getIcon()}
          <span className="hidden sm:inline">{content.theme}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card">
        <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2 cursor-pointer">
          <FiSun className="h-4 w-4" />
          {content.light}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2 cursor-pointer">
          <FiMoon className="h-4 w-4" />
          {content.dark}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("festive")} className="gap-2 cursor-pointer">
          <HiSparkles className="h-4 w-4" />
          {content.festive}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
