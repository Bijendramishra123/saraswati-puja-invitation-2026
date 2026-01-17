"use client"

import { Card, CardContent } from "@/components/ui/card"
import { LotusIcon } from "./mandala-pattern"
import type { ContentType } from "@/lib/content"

interface FooterSectionProps {
  content: ContentType
}

export function FooterSection({ content }: FooterSectionProps) {
  return (
    <section className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card
          className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-xl animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <CardContent className="p-6 sm:p-8 text-center space-y-6">
            {/* Footer note */}
            <div className="bg-secondary/50 rounded-xl p-4 sm:p-6 border border-primary/10">
              <p className="font-serif text-lg sm:text-xl text-foreground italic leading-relaxed">
                &ldquo;{content.footerNote}&rdquo;
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <LotusIcon className="w-8 h-8 text-primary" />
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            </div>

            {/* Nivedak section */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">{content.nivedak}</h3>
              <p className="font-serif text-xl sm:text-2xl text-foreground font-medium">{content.nivedakName}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
