"use client"

export function MandalaPattern({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={`opacity-10 ${className}`} fill="currentColor">
      <defs>
        <pattern id="mandala" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="5" fill="currentColor" opacity="0.3" />
          {[...Array(8)].map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="5"
              x2="50"
              y2="95"
              stroke="currentColor"
              strokeWidth="0.3"
              transform={`rotate(${i * 22.5} 50 50)`}
            />
          ))}
          {[...Array(8)].map((_, i) => (
            <ellipse
              key={`petal-${i}`}
              cx="50"
              cy="20"
              rx="8"
              ry="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.4"
              transform={`rotate(${i * 45} 50 50)`}
            />
          ))}
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#mandala)" />
    </svg>
  )
}

export function LotusIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <ellipse cx="50" cy="70" rx="30" ry="10" opacity="0.3" />
      <path d="M50 20 Q60 40 50 60 Q40 40 50 20" fill="currentColor" opacity="0.8" />
      <path d="M30 35 Q50 45 50 60 Q30 50 30 35" fill="currentColor" opacity="0.6" />
      <path d="M70 35 Q50 45 50 60 Q70 50 70 35" fill="currentColor" opacity="0.6" />
      <path d="M20 50 Q45 55 50 60 Q25 60 20 50" fill="currentColor" opacity="0.4" />
      <path d="M80 50 Q55 55 50 60 Q75 60 80 50" fill="currentColor" opacity="0.4" />
    </svg>
  )
}
