import React, { useRef, useState } from 'react'

interface TiltSpotlightCardProps {
  children: React.ReactNode
  className?: string
  spotlightColor?: string
  maxTilt?: number
  scale?: number
}

export const TiltSpotlightCard: React.FC<TiltSpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(16, 185, 129, 0.15)',
  maxTilt = 7,
  scale = 1.01
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transformStyle, setTransformStyle] = useState('')
  const [spotlightPos, setSpotlightPos] = useState({ x: -1000, y: -1000, opacity: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calculate tilt angles (-maxTilt to +maxTilt)
    const rotateX = ((y - centerY) / centerY) * -maxTilt
    const rotateY = ((x - centerX) / centerX) * maxTilt

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`)
    setSpotlightPos({ x, y, opacity: 1 })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
    setSpotlightPos(prev => ({ ...prev, opacity: 0 }))
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
      }}
      className={`relative group will-change-transform ${className}`}
    >
      {/* ── Dynamic Radial Spotlight Beam (Strictly Clipped to Rounded Card Boundary) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] z-20">
        <div
          className="absolute -inset-px transition-opacity duration-300 rounded-[inherit]"
          style={{
            opacity: spotlightPos.opacity,
            background: `radial-gradient(400px circle at ${spotlightPos.x}px ${spotlightPos.y}px, ${spotlightColor}, transparent 70%)`
          }}
          aria-hidden="true"
        />

        {/* ── Subtle Border Shimmer ── */}
        <div
          className="absolute -inset-px transition-opacity duration-300 rounded-[inherit] border border-emerald-500/20 dark:border-emerald-500/20 light:border-emerald-500/40"
          style={{
            opacity: isHovered ? 1 : 0
          }}
          aria-hidden="true"
        />
      </div>

      {/* Card Content - Unclipped so badges and decorative headers display completely */}
      <div className="relative z-30 h-full">
        {children}
      </div>
    </div>
  )
}

export default TiltSpotlightCard
