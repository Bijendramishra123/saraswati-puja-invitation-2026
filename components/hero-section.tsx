"use client"

import Image from "next/image"
import { MandalaPattern, LotusIcon } from "./mandala-pattern"
import type { ContentType } from "@/lib/content"

interface HeroSectionProps {
  content: ContentType
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 py-12">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <MandalaPattern className="absolute -top-20 -left-20 w-96 h-96 text-primary animate-rotate-slow" />
        <MandalaPattern className="absolute -bottom-20 -right-20 w-96 h-96 text-primary animate-rotate-slow" />
        <MandalaPattern className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] text-primary/50" />
      </div>

      {/* Main invitation card */}
      <div className="relative z-10 max-w-2xl w-full">
        <div className="bg-card/90 backdrop-blur-md rounded-2xl shadow-2xl border border-primary/20 overflow-hidden animate-fade-in-up animate-pulse-glow">
          {/* Top decorative border */}
          <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />

          <div className="p-6 sm:p-10 text-center space-y-6">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto animate-divine-glow">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-gold/30 to-primary/30 rounded-full blur-2xl animate-pulse" />
              <Image
                src="/images/saraswati.png"
                alt="Maa Saraswati"
                fill
                className="object-contain drop-shadow-2xl animate-float-gentle"
                priority
              />
            </div>

            {/* Lotus decoration */}
            <div className="flex justify-center">
              <LotusIcon className="w-12 h-12 text-primary animate-pulse" />
            </div>

            {/* Title */}
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-relaxed">
              {content.title}
            </h1>

            {/* Shloka */}
            <div className="bg-secondary/50 rounded-xl p-4 sm:p-6 border border-primary/10">
              <p className="font-serif text-sm sm:text-base md:text-lg text-foreground/90 italic whitespace-pre-line leading-relaxed">
                {content.shloka}
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <span className="text-primary text-2xl">✦</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            </div>

            {/* Greeting */}
            <div className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-foreground">{content.greeting}</h2>
              <p className="text-lg text-primary font-medium">{content.namaste}</p>
            </div>

            {/* Main message */}
            <p className="text-base sm:text-lg text-foreground/85 leading-relaxed max-w-xl mx-auto">
              {content.mainMessage}
            </p>

            {/* Decorative lotus row */}
            <div className="flex justify-center gap-2 py-2">
              {[...Array(5)].map((_, i) => (
                <LotusIcon key={i} className="w-6 h-6 text-primary/60" />
              ))}
            </div>
          </div>

          {/* Bottom decorative border */}
          <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
        </div>
      </div>
    </section>
  )
}
