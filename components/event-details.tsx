"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi"
import { GiMeal } from "react-icons/gi"
import type { ContentType } from "@/lib/content"

interface EventDetailsProps {
  content: ContentType
}

export function EventDetails({ content }: EventDetailsProps) {
  const details = [
    { icon: FiCalendar, text: content.date, color: "text-primary" },
    { icon: FiClock, text: content.time, color: "text-primary" },
    { icon: GiMeal, text: content.prasad, color: "text-primary" },
    { icon: FiMapPin, text: content.venue, color: "text-primary" },
  ]

  return (
    <section id="details" className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card
          className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-xl animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-serif text-2xl sm:text-3xl text-primary flex items-center justify-center gap-3">
              <span className="text-2xl">🪔</span>
              {content.eventDetails}
              <span className="text-2xl">🪔</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {details.map((detail, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <detail.icon className={`w-6 h-6 ${detail.color}`} />
                </div>
                <p className="text-base sm:text-lg text-foreground font-medium pt-2">{detail.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
