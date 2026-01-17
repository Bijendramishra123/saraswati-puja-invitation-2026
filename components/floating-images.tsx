"use client"

import Image from "next/image"

export function FloatingImages() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Ganesha background - subtle, centered */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] opacity-[0.07] dark:opacity-[0.05]">
        <Image src="/images/ganesha.png" alt="Lord Ganesha" fill className="object-contain" priority />
      </div>

      {/* Peacock feather - top left with swing animation */}
      <div className="absolute top-20 left-2 w-24 h-36 md:w-32 md:h-48 animate-swing origin-top opacity-60">
        <Image src="/images/peacock-feather-1.png" alt="Peacock Feather" fill className="object-contain" />
      </div>

      {/* Peacock feather - top right with reverse swing */}
      <div className="absolute top-16 right-2 w-20 h-32 md:w-28 md:h-44 animate-swing-reverse origin-top opacity-55">
        <Image src="/images/peacock-feather-2.png" alt="Peacock Feather" fill className="object-contain" />
      </div>

      {/* Peacock feather - bottom left with sway */}
      <div className="absolute bottom-40 left-0 w-20 h-32 md:w-28 md:h-40 animate-sway opacity-50">
        <Image
          src="/images/peacock-feather-1.png"
          alt="Peacock Feather"
          fill
          className="object-contain rotate-[200deg]"
        />
      </div>

      {/* Peacock feather - bottom right with sway reverse */}
      <div className="absolute bottom-32 right-0 w-24 h-36 md:w-32 md:h-48 animate-sway-reverse opacity-45">
        <Image
          src="/images/peacock-feather-2.png"
          alt="Peacock Feather"
          fill
          className="object-contain rotate-[160deg]"
        />
      </div>

      {/* Golden sparkles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-amber-400/70 rounded-full animate-twinkle"
            style={{
              left: `${10 + i * 7}%`,
              top: `${15 + ((i * 13) % 70)}%`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
