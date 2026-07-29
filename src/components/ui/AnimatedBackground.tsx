import React, { useMemo } from 'react'

interface AnimatedBackgroundProps {
  /** Color accent: 'emerald' | 'indigo' | 'teal' | 'blue' */
  accent?: 'emerald' | 'indigo' | 'teal' | 'blue'
  /** Show a slow horizontal scan-line sweep */
  scanLine?: boolean
  /** Number of floating particles to render (default 18) */
  particleCount?: number
  /** Show dot-matrix grid overlay */
  grid?: boolean
}

const ACCENT_COLORS: Record<string, { orb1: string; orb2: string; orb3: string; dot: string; particle: string }> = {
  emerald: {
    orb1:     'bg-emerald-500/10',
    orb2:     'bg-emerald-600/8',
    orb3:     'bg-indigo-500/8',
    dot:      'bg-emerald-400',
    particle: 'bg-emerald-400',
  },
  indigo: {
    orb1:     'bg-indigo-500/10',
    orb2:     'bg-indigo-600/8',
    orb3:     'bg-emerald-500/8',
    dot:      'bg-indigo-400',
    particle: 'bg-indigo-400',
  },
  teal: {
    orb1:     'bg-teal-500/10',
    orb2:     'bg-teal-400/8',
    orb3:     'bg-emerald-500/8',
    dot:      'bg-teal-400',
    particle: 'bg-teal-400',
  },
  blue: {
    orb1:     'bg-blue-500/10',
    orb2:     'bg-blue-400/8',
    orb3:     'bg-indigo-500/8',
    dot:      'bg-blue-400',
    particle: 'bg-blue-400',
  },
}

interface Particle {
  id: number
  left: string
  top: string
  size: string
  dur: string
  delay: string
  dx: string
  dy: string
  opacity: string
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  accent = 'emerald',
  scanLine = false,
  particleCount = 18,
  grid = true,
}) => {
  const colors = ACCENT_COLORS[accent]

  const particles: Particle[] = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      left: `${(i * 37 + 5) % 95}%`,
      top:  `${(i * 53 + 10) % 90}%`,
      size: `${2 + (i % 4)}px`,
      dur:  `${7 + (i % 8)}s`,
      delay: `${-(i * 1.3)}s`,
      dx:   `${(i % 3 === 0 ? 1 : -1) * (20 + (i % 40))}px`,
      dy:   `${-(40 + (i % 60))}px`,
      opacity: `${0.15 + (i % 4) * 0.08}`,
    }))
  }, [particleCount])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">

      {/* ── Ambient drift orbs ── */}
      <div
        className={`absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full ${colors.orb1} filter blur-[120px] animate-orb-drift-1`}
      />
      <div
        className={`absolute -bottom-40 -right-24 w-[500px] h-[500px] rounded-full ${colors.orb2} filter blur-[100px] animate-orb-drift-2`}
      />
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full ${colors.orb3} filter blur-[130px] animate-orb-drift-3`}
      />

      {/* ── Dot-matrix grid overlay ── */}
      {grid && (
        <div
          className="absolute inset-0 animate-grid-shimmer"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      )}

      {/* ── Floating particles ── */}
      {particles.map((p) => (
        <div
          key={p.id}
          className={`bg-particle ${colors.particle}`}
          style={{
            left: p.left,
            top:  p.top,
            width:  p.size,
            height: p.size,
            opacity: parseFloat(p.opacity),
            '--dur':   p.dur,
            '--delay': p.delay,
            '--dx':    p.dx,
            '--dy':    p.dy,
          } as React.CSSProperties}
        />
      ))}

      {/* ── Optional scan-line ── */}
      {scanLine && (
        <div
          className="absolute left-0 right-0 h-px animate-scan-line"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(16,185,129,0.25) 30%, rgba(16,185,129,0.6) 50%, rgba(16,185,129,0.25) 70%, transparent)`,
          }}
        />
      )}
    </div>
  )
}

export default AnimatedBackground
