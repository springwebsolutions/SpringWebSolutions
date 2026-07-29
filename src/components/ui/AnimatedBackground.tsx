import React, { useMemo } from 'react'

interface AnimatedBackgroundProps {
  /** Color accent drives orb & particle colors */
  accent?: 'emerald' | 'indigo' | 'teal' | 'blue'
  /** Number of floating micro-particles (default 20) */
  particleCount?: number
  /** Show diagonal shimmer beams */
  beams?: boolean
  /** Show floating geometric outline shapes */
  geoShapes?: boolean
}

/* ── Per-accent colour maps ── */
const COLORS = {
  emerald: {
    orb1: 'rgba(16,185,129,0.22)',
    orb2: 'rgba(52,211,153,0.14)',
    orb3: 'rgba(99,102,241,0.12)',
    line: 'rgba(16,185,129,0.10)',
    linePeak: 'rgba(16,185,129,0.22)',
    particle: '#34d399',
    geo: 'rgba(16,185,129,',
    beam: 'rgba(16,185,129,0.08)',
    ringBorder: 'rgba(16,185,129,0.18)',
    aurora1: '#10b981',
    aurora2: '#6366f1',
    aurora3: '#14b8a6',
  },
  indigo: {
    orb1: 'rgba(99,102,241,0.22)',
    orb2: 'rgba(129,140,248,0.14)',
    orb3: 'rgba(16,185,129,0.10)',
    line: 'rgba(99,102,241,0.10)',
    linePeak: 'rgba(99,102,241,0.22)',
    particle: '#818cf8',
    geo: 'rgba(99,102,241,',
    beam: 'rgba(99,102,241,0.07)',
    ringBorder: 'rgba(99,102,241,0.18)',
    aurora1: '#6366f1',
    aurora2: '#10b981',
    aurora3: '#8b5cf6',
  },
  teal: {
    orb1: 'rgba(20,184,166,0.22)',
    orb2: 'rgba(45,212,191,0.14)',
    orb3: 'rgba(99,102,241,0.10)',
    line: 'rgba(20,184,166,0.10)',
    linePeak: 'rgba(20,184,166,0.22)',
    particle: '#2dd4bf',
    geo: 'rgba(20,184,166,',
    beam: 'rgba(20,184,166,0.08)',
    ringBorder: 'rgba(20,184,166,0.18)',
    aurora1: '#14b8a6',
    aurora2: '#6366f1',
    aurora3: '#10b981',
  },
  blue: {
    orb1: 'rgba(59,130,246,0.22)',
    orb2: 'rgba(96,165,250,0.14)',
    orb3: 'rgba(99,102,241,0.12)',
    line: 'rgba(59,130,246,0.10)',
    linePeak: 'rgba(59,130,246,0.22)',
    particle: '#60a5fa',
    geo: 'rgba(59,130,246,',
    beam: 'rgba(59,130,246,0.07)',
    ringBorder: 'rgba(59,130,246,0.18)',
    aurora1: '#3b82f6',
    aurora2: '#8b5cf6',
    aurora3: '#6366f1',
  },
}

interface Particle { id: number; left: string; top: string; size: string; dur: string; delay: string; opacity: string }
interface GeoShape  { id: number; left: string; top: string; size: string; dur: string; delay: string; opacity: string; type: 'square' | 'diamond' | 'circle' }
interface Beam      { id: number; top: string; dur: string; delay: string; width: string }

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  accent = 'emerald',
  particleCount = 20,
  beams = true,
  geoShapes = true,
}) => {
  const c = COLORS[accent]

  /* Stable deterministic layouts via index math (no random) */
  const particles: Particle[] = useMemo(() => Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    left:    `${(i * 47 + 3) % 96}%`,
    top:     `${(i * 61 + 8) % 88}%`,
    size:    `${2.5 + (i % 5) * 0.8}px`,
    dur:     `${8 + (i % 7)}s`,
    delay:   `-${(i * 1.7) % 12}s`,
    opacity: `${0.35 + (i % 5) * 0.12}`,
  })), [particleCount])

  const geoList: GeoShape[] = useMemo(() => {
    const types: GeoShape['type'][] = ['square', 'diamond', 'circle', 'square', 'diamond', 'circle', 'square', 'diamond']
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left:    `${(i * 83 + 5) % 90}%`,
      top:     `${(i * 71 + 12) % 85}%`,
      size:    `${14 + (i % 4) * 8}px`,
      dur:     `${8 + (i % 6) * 2}s`,
      delay:   `-${i * 1.4}s`,
      opacity: `${0.07 + (i % 3) * 0.04}`,
      type:    types[i],
    }))
  }, [])

  const beamList: Beam[] = useMemo(() => Array.from({ length: 3 }, (_, i) => ({
    id: i,
    top:   `${20 + i * 28}%`,
    dur:   `${14 + i * 4}s`,
    delay: `-${i * 5}s`,
    width: `${180 + i * 60}px`,
  })), [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">

      {/* ═══ 1. AURORA GRADIENT BACKGROUND WASH ═══
          A large animated gradient that breathes slowly — very subtle but alive */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 20% 30%, ${c.orb1} 0%, transparent 60%),
                       radial-gradient(ellipse 60% 50% at 80% 70%, ${c.orb2} 0%, transparent 55%),
                       radial-gradient(ellipse 50% 40% at 50% 0%, ${c.orb3} 0%, transparent 50%)`,
          animation: 'orbDrift3 16s ease-in-out infinite',
        }}
      />

      {/* ═══ 2. PRIMARY DRIFTING GLOW ORBS (large, blurred) ═══ */}
      <div
        className="absolute animate-orb-drift-1"
        style={{
          top: '-15%', left: '-10%',
          width: '55vw', height: '55vw',
          maxWidth: '700px', maxHeight: '700px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${c.orb1} 0%, transparent 70%)`,
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute animate-orb-drift-2"
        style={{
          bottom: '-20%', right: '-10%',
          width: '50vw', height: '50vw',
          maxWidth: '640px', maxHeight: '640px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${c.orb2} 0%, transparent 70%)`,
          filter: 'blur(90px)',
        }}
      />
      <div
        className="absolute animate-orb-drift-3"
        style={{
          top: '35%', left: '40%',
          width: '35vw', height: '35vw',
          maxWidth: '450px', maxHeight: '450px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${c.orb3} 0%, transparent 70%)`,
          filter: 'blur(110px)',
        }}
      />

      {/* ═══ 3. DOT-MATRIX GRID (pulsing) ═══ */}
      <div
        className="absolute inset-0 animate-grid-pulse"
        style={{
          backgroundImage: `radial-gradient(circle, ${c.linePeak} 1.2px, transparent 1.2px)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* ═══ 4. SUBTLE CROSSHATCH LINES ═══ */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${c.linePeak} 1px, transparent 1px),
            linear-gradient(to bottom, ${c.linePeak} 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
        }}
      />

      {/* ═══ 5. FLOATING GEOMETRIC OUTLINE SHAPES ═══ */}
      {geoShapes && geoList.map((g) => {
        const borderColor = `${c.geo}${g.opacity})`
        const sharedStyle: React.CSSProperties = {
          position: 'absolute',
          left: g.left,
          top:  g.top,
          width: g.size,
          height: g.size,
          border: `1px solid ${borderColor}`,
          pointerEvents: 'none',
          ['--geo-op' as string]: g.opacity,
          ['--geo-dur' as string]: g.dur,
          ['--geo-delay' as string]: g.delay,
        }
        if (g.type === 'circle') {
          return <div key={g.id} className="animate-geo-float" style={{ ...sharedStyle, borderRadius: '50%' }} />
        }
        if (g.type === 'diamond') {
          return <div key={g.id} className="animate-geo-float" style={{ ...sharedStyle, transform: 'rotate(45deg)' }} />
        }
        return <div key={g.id} className="animate-geo-float" style={{ ...sharedStyle, borderRadius: '4px' }} />
      })}

      {/* ═══ 6. RISING MICRO-PARTICLES ═══ */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="bg-particle-rise"
          style={{
            left: p.left,
            top:  p.top,
            width:  p.size,
            height: p.size,
            background: c.particle,
            boxShadow: `0 0 ${parseFloat(p.size) * 3}px ${c.particle}`,
            ['--dur'   as string]: p.dur,
            ['--delay' as string]: p.delay,
            ['--p-op'  as string]: p.opacity,
          } as React.CSSProperties}
        />
      ))}

      {/* ═══ 7. DIAGONAL SHIMMER BEAMS ═══ */}
      {beams && beamList.map((b) => (
        <div
          key={b.id}
          className="animate-shimmer-beam"
          style={{
            position: 'absolute',
            top: b.top,
            left: '-10%',
            width: b.width,
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${c.beam.replace('0.07', '0.00')}, ${c.beam.replace('0.07', '0.25')} 40%, ${c.beam.replace('0.07', '0.40')} 50%, ${c.beam.replace('0.07', '0.25')} 60%, transparent)`,
            ['--beam-dur'   as string]: b.dur,
            ['--beam-delay' as string]: b.delay,
          } as React.CSSProperties}
        />
      ))}

      {/* ═══ 8. CORNER SPINNING RING ORNAMENTS ═══ */}
      <div
        className="absolute animate-ring-rotate"
        style={{
          top: '-60px', right: '-60px',
          width: '220px', height: '220px',
          borderRadius: '50%',
          border: `1px solid ${c.ringBorder}`,
          boxShadow: `inset 0 0 40px ${c.orb1}, 0 0 20px ${c.orb1}`,
        }}
      />
      <div
        className="absolute"
        style={{
          bottom: '-50px', left: '-50px',
          width: '180px', height: '180px',
          borderRadius: '50%',
          border: `1px solid ${c.ringBorder}`,
          animation: 'ringRotate 40s linear infinite reverse',
          boxShadow: `inset 0 0 30px ${c.orb2}`,
        }}
      />
    </div>
  )
}

export default AnimatedBackground
