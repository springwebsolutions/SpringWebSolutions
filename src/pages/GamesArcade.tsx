import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { 
  Gamepad2, Play, RotateCcw, Volume2, VolumeX, Maximize2, Minimize2, 
  Trophy, Sparkles, ArrowLeft, Zap, Shield, Flame, Activity, 
  HelpCircle, ChevronRight, Star, Award, Layers, Rocket, Bot,
  ArrowUp, ArrowDown, ArrowLeft as LeftIcon, ArrowRight as RightIcon
} from 'lucide-react'
import { arcadeAudio } from '@/lib/arcadeAudio'
import SEOHead from '@/components/seo/SEOHead'

type GameId = 'cyber-runner' | 'galaxy-defender' | 'cyber-snake' | 'neon-breakout' | 'cyber-2048' | 'memory-matrix'

interface GameMeta {
  id: GameId
  title: string
  tagline: string
  category: string
  difficulty: 'Casual' | 'Medium' | 'Challenging'
  instructions: string[]
  controls: { key: string; action: string }[]
  accentColor: string
  icon: any
}

const GAMES_CATALOG: GameMeta[] = [
  {
    id: 'cyber-runner',
    title: 'Cyber Runner',
    tagline: 'High-speed neon obstacle dash with gravity jumping and data gem multipliers.',
    category: 'Endless Runner',
    difficulty: 'Medium',
    instructions: [
      'Jump over cyan laser spikes and cyber obstacles.',
      'Double jump in mid-air to clear wide gaps.',
      'Collect green Data Gems (+100 pts) to boost your score multiplier.'
    ],
    controls: [
      { key: 'SPACE / ↑', action: 'Jump / Double Jump' },
      { key: '↓ / S', action: 'Fast Duck' },
      { key: 'TAP SCREEN', action: 'Jump (Mobile)' }
    ],
    accentColor: '#10b981',
    icon: Rocket
  },
  {
    id: 'galaxy-defender',
    title: 'Galaxy Defender',
    tagline: 'Retro space shooter with alien waves, power-up shields, and laser barrages.',
    category: 'Arcade Shooter',
    difficulty: 'Challenging',
    instructions: [
      'Eliminate descending alien formations before they reach bottom.',
      'Dodge enemy laser fire and catch glowing power-up orbs (Triple Shot & Shields).',
      'Defeat boss waves every 1,000 points.'
    ],
    controls: [
      { key: '← / → or A / D', action: 'Move Ship' },
      { key: 'SPACE / AUTO', action: 'Fire Laser' },
      { key: 'DRAG / TOUCH', action: 'Steer & Shoot (Mobile)' }
    ],
    accentColor: '#6366f1',
    icon: Shield
  },
  {
    id: 'cyber-snake',
    title: 'Cyber Snake 360',
    tagline: 'Futuristic grid snake with speed boosts, neon glow trails, and golden bonus orbs.',
    category: 'Classic Arcade',
    difficulty: 'Casual',
    instructions: [
      'Eat glowing green energy nodes to grow your cyber trail.',
      'Catch golden pulse pellets before they expire for 5x bonus points.',
      'Hold BOOST key to increase speed for tighter maneuvers.'
    ],
    controls: [
      { key: 'ARROW KEYS / WASD', action: 'Change Direction' },
      { key: 'SHIFT / BOOST BTN', action: 'Overdrive Speed' },
      { key: 'SWIPE / D-PAD', action: 'Steer (Mobile)' }
    ],
    accentColor: '#06b6d4',
    icon: Activity
  },
  {
    id: 'neon-breakout',
    title: 'Neon Breakout',
    tagline: 'Action-packed brick breaker with multi-balls, laser paddles, and explosive blocks.',
    category: 'Breakout',
    difficulty: 'Medium',
    instructions: [
      'Deflect the energy ball to shatter all holographic bricks.',
      'Collect falling capsules: Multi-Ball (+2 Balls), Laser Paddle, Wide Beam.',
      'Clear all bricks to advance to higher difficulty stages.'
    ],
    controls: [
      { key: 'MOUSE / ← →', action: 'Move Paddle' },
      { key: 'SPACE / CLICK', action: 'Launch Ball / Fire Lasers' },
      { key: 'DRAG PADDLE', action: 'Touch Control (Mobile)' }
    ],
    accentColor: '#ec4899',
    icon: Layers
  },
  {
    id: 'cyber-2048',
    title: 'Cyber 2048',
    tagline: 'Addictive neon tile puzzle with smooth animations, undo moves, and score streaks.',
    category: 'Logic Puzzle',
    difficulty: 'Casual',
    instructions: [
      'Slide tiles in any of 4 directions.',
      'When two tiles with the same number touch, they merge into one (2+2=4, 4+4=8... 2048)!',
      'Reach the 2048 tile or keep going for the legendary 4096 / 8192!'
    ],
    controls: [
      { key: 'ARROW KEYS / WASD', action: 'Slide Grid' },
      { key: 'SWIPE', action: 'Swipe to Slide (Mobile)' },
      { key: 'U', action: 'Undo Last Move' }
    ],
    accentColor: '#f59e0b',
    icon: Sparkles
  },
  {
    id: 'memory-matrix',
    title: 'Memory Matrix',
    tagline: 'Test your reflexes and harmonic memory against an accelerating cyber sequence.',
    category: 'Brain Reflex',
    difficulty: 'Medium',
    instructions: [
      'Watch the sequence of glowing neon pads and listen to the harmonic tones.',
      'Repeat the exact sequence by clicking or tapping the pads in order.',
      'Speed and sequence length increase with every successful round!'
    ],
    controls: [
      { key: '1, 2, 3, 4 KEYS', action: 'Trigger Quadrants' },
      { key: 'CLICK / TAP', action: 'Tap Glowing Pads' }
    ],
    accentColor: '#8b5cf6',
    icon: Zap
  }
]

export const GamesArcade: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameId>('cyber-runner')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [highScores, setHighScores] = useState<Record<GameId, number>>({
    'cyber-runner': 0,
    'galaxy-defender': 0,
    'cyber-snake': 0,
    'neon-breakout': 0,
    'cyber-2048': 0,
    'memory-matrix': 0
  })

  // Load high scores from localStorage
  useEffect(() => {
    try {
      const savedScores: Record<string, number> = {}
      GAMES_CATALOG.forEach(g => {
        const s = localStorage.getItem(`springweb_arcade_${g.id}`)
        savedScores[g.id] = s ? parseInt(s, 10) : 0
      })
      setHighScores(prev => ({ ...prev, ...savedScores }))
    } catch {}
  }, [])

  const saveHighScore = useCallback((gameId: GameId, score: number) => {
    setHighScores(prev => {
      const current = prev[gameId] || 0
      if (score > current) {
        try {
          localStorage.setItem(`springweb_arcade_${gameId}`, score.toString())
        } catch {}
        return { ...prev, [gameId]: score }
      }
      return prev
    })
  }, [])

  const toggleSound = () => {
    const next = !soundEnabled
    setSoundEnabled(next)
    arcadeAudio.setEnabled(next)
  }

  const currentGameMeta = GAMES_CATALOG.find(g => g.id === selectedGame) || GAMES_CATALOG[0]

  return (
    <div className="min-h-screen bg-[#04060e] text-white selection:bg-emerald-500 selection:text-slate-950 font-sans pb-24">
      <SEOHead
        title="Interactive HTML5 Games Arcade | Spring Web Solutions"
        description="Play 6 free, lightweight, client-side HTML5 arcade games built with smooth Canvas animations and Web Audio synthesis: Cyber Runner, Galaxy Defender, Cyber Snake, 2048, and more."
        canonicalUrl="https://springwebsolutions.in/games"
      />

      {/* ── Ambient Background Glows ── */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* ── Header Navigation ── */}
      <div className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/"
              className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Main Site</span>
            </Link>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Gamepad2 size={18} />
              </div>
              <span className="font-extrabold text-sm tracking-tight font-display">SPRINGWEB ARCADE</span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                HTML5 Canvas
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2 text-xs ${
                soundEnabled 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-white/5 border-white/10 text-slate-500'
              }`}
              title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span className="hidden sm:inline text-xs font-mono">{soundEnabled ? 'AUDIO ON' : 'AUDIO OFF'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 pt-8 space-y-10">

        {/* ── Arcade Hero Title ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider font-display">
              <Sparkles size={13} /> Zero-Install Browser Games
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight">
              Interactive <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">HTML5 Arcade</span>
            </h1>
            <p className="text-sm text-slate-400 font-light">
              High-performance, client-side arcade games engineered in vanilla HTML5 Canvas & Web Audio API. Playable on desktop & mobile with zero lag.
            </p>
          </div>

          {/* Quick Score Showcase */}
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-3.5 rounded-2xl shrink-0">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Trophy size={20} />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Current Game Best Score</div>
              <div className="text-xl font-mono font-black text-amber-300">
                {highScores[selectedGame]?.toLocaleString() || '0'} PTS
              </div>
            </div>
          </div>
        </div>

        {/* ── Game Selector Carousel / Grid ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
              Select Arcade Game (6 Available)
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {GAMES_CATALOG.map((g) => {
              const Icon = g.icon
              const isSelected = selectedGame === g.id

              return (
                <button
                  key={g.id}
                  onClick={() => {
                    setSelectedGame(g.id)
                    arcadeAudio.playCoin()
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between space-y-3 relative group cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-b from-emerald-950/60 to-slate-900 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-[1.03] ring-1 ring-emerald-500'
                      : 'bg-slate-900/50 border-white/10 hover:border-white/20 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div 
                      className="p-2 rounded-xl flex items-center justify-center transition-colors"
                      style={{ 
                        backgroundColor: isSelected ? `${g.accentColor}20` : 'rgba(255,255,255,0.05)',
                        color: g.accentColor 
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                      {g.difficulty}
                    </span>
                  </div>

                  <div>
                    <h3 className={`text-sm font-bold font-display ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                      {g.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {g.category}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-white/5">
                    <span>BEST</span>
                    <span className="font-bold text-amber-400">
                      {highScores[g.id] > 0 ? `${highScores[g.id]}` : '—'}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Active Game Stage Viewport ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Game Screen Canvas (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-3xl border border-white/15 bg-slate-950 shadow-2xl overflow-hidden relative">
              
              {/* Active Game Top Bar */}
              <div className="px-6 py-3.5 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-bold font-display text-white">{currentGameMeta.title}</span>
                  <span className="text-xs text-slate-500 font-mono hidden sm:inline">| {currentGameMeta.tagline}</span>
                </div>
              </div>

              {/* Game Viewport Container */}
              <div className="p-2 sm:p-4 bg-[#050811] flex items-center justify-center min-h-[460px] sm:min-h-[520px]">
                {selectedGame === 'cyber-runner' && (
                  <CyberRunnerGame onScoreUpdate={(s) => saveHighScore('cyber-runner', s)} />
                )}
                {selectedGame === 'galaxy-defender' && (
                  <GalaxyDefenderGame onScoreUpdate={(s) => saveHighScore('galaxy-defender', s)} />
                )}
                {selectedGame === 'cyber-snake' && (
                  <CyberSnakeGame onScoreUpdate={(s) => saveHighScore('cyber-snake', s)} />
                )}
                {selectedGame === 'neon-breakout' && (
                  <NeonBreakoutGame onScoreUpdate={(s) => saveHighScore('neon-breakout', s)} />
                )}
                {selectedGame === 'cyber-2048' && (
                  <Cyber2048Game onScoreUpdate={(s) => saveHighScore('cyber-2048', s)} />
                )}
                {selectedGame === 'memory-matrix' && (
                  <MemoryMatrixGame onScoreUpdate={(s) => saveHighScore('memory-matrix', s)} />
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Instructions, Controls, & Leaderboard */}
          <div className="space-y-6">
            
            {/* How to Play Card */}
            <div className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider font-display">
                <HelpCircle size={15} />
                <span>How to Play</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                {currentGameMeta.instructions.map((inst, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{inst}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/10 space-y-2.5">
                <div className="text-[11px] font-mono text-slate-400 uppercase font-bold">Controls:</div>
                <div className="space-y-1.5">
                  {currentGameMeta.controls.map((ctrl, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-mono">
                      <span className="px-2 py-0.5 rounded bg-white/10 text-emerald-300 font-semibold border border-white/10">
                        {ctrl.key}
                      </span>
                      <span className="text-slate-400 text-[11px]">{ctrl.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Arcade High Score Stats */}
            <div className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider font-display">
                <Award size={15} />
                <span>Personal Best Scores</span>
              </div>

              <div className="space-y-2">
                {GAMES_CATALOG.map((g) => (
                  <div key={g.id} className="flex items-center justify-between text-xs font-mono py-1 border-b border-white/5 last:border-0">
                    <span className="text-slate-400">{g.title}</span>
                    <span className="font-bold text-amber-300">
                      {highScores[g.id] > 0 ? `${highScores[g.id].toLocaleString()} PTS` : '0'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

/* =========================================================================
   GAME 1: CYBER RUNNER (Endless Neon Runner)
   ========================================================================= */
const CyberRunnerGame: React.FC<{ onScoreUpdate: (score: number) => void }> = ({ onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle')
  const [score, setScore] = useState(0)

  const stateRef = useRef({
    playerY: 280,
    playerVy: 0,
    isGrounded: true,
    jumpsLeft: 2,
    score: 0,
    speed: 5,
    obstacles: [] as { x: number; w: number; h: number; type: 'spike' | 'gem' }[],
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
    frameCount: 0,
    isRunning: false
  })

  const jump = useCallback(() => {
    const s = stateRef.current
    if (!s.isRunning) return
    if (s.jumpsLeft > 0) {
      s.playerVy = -11
      s.isGrounded = false
      s.jumpsLeft--
      arcadeAudio.playJump()
    }
  }, [])

  const startGame = () => {
    stateRef.current = {
      playerY: 280,
      playerVy: 0,
      isGrounded: true,
      jumpsLeft: 2,
      score: 0,
      speed: 5.5,
      obstacles: [],
      particles: [],
      frameCount: 0,
      isRunning: true
    }
    setScore(0)
    setGameState('playing')
    arcadeAudio.playPowerup()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault()
        if (stateRef.current.isRunning) {
          jump()
        } else {
          startGame()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [jump])

  useEffect(() => {
    let animId: number
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const loop = () => {
      const s = stateRef.current
      ctx.fillStyle = '#050811'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw Neon Floor
      const groundY = 320
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 3
      ctx.shadowBlur = 10
      ctx.shadowColor = '#10b981'
      ctx.beginPath()
      ctx.moveTo(0, groundY)
      ctx.lineTo(canvas.width, groundY)
      ctx.stroke()
      ctx.shadowBlur = 0

      // Draw Grid Lines on Floor
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)'
      ctx.lineWidth = 1
      const offset = (s.frameCount * s.speed) % 40
      for (let x = -offset; x < canvas.width; x += 40) {
        ctx.beginPath()
        ctx.moveTo(x, groundY)
        ctx.lineTo(x - 30, canvas.height)
        ctx.stroke()
      }

      if (s.isRunning) {
        s.frameCount++
        s.score += 1
        if (s.frameCount % 6 === 0) {
          setScore(Math.floor(s.score / 6))
        }

        // Increase speed gradually
        if (s.frameCount % 500 === 0 && s.speed < 12) {
          s.speed += 0.5
        }

        // Physics
        s.playerVy += 0.65 // gravity
        s.playerY += s.playerVy

        if (s.playerY >= groundY - 30) {
          s.playerY = groundY - 30
          s.playerVy = 0
          s.isGrounded = true
          s.jumpsLeft = 2
        }

        // Spawn obstacles & gems
        if (s.frameCount % Math.max(45, Math.floor(90 - s.speed * 3)) === 0) {
          const isGem = Math.random() > 0.65
          s.obstacles.push({
            x: canvas.width + 20,
            w: isGem ? 18 : 24,
            h: isGem ? 18 : 34,
            type: isGem ? 'gem' : 'spike'
          })
        }

        // Update obstacles
        const playerBox = { x: 80, y: s.playerY, w: 26, h: 30 }

        for (let i = s.obstacles.length - 1; i >= 0; i--) {
          const obs = s.obstacles[i]
          obs.x -= s.speed

          const obsY = obs.type === 'gem' ? groundY - 70 : groundY - obs.h

          // Check collision
          if (
            playerBox.x < obs.x + obs.w &&
            playerBox.x + playerBox.w > obs.x &&
            playerBox.y < obsY + obs.h &&
            playerBox.y + playerBox.h > obsY
          ) {
            if (obs.type === 'gem') {
              s.score += 300
              arcadeAudio.playCoin()
              s.obstacles.splice(i, 1)
              continue
            } else {
              // Hit obstacle -> Game Over
              s.isRunning = false
              setGameState('gameover')
              arcadeAudio.playGameOver()
              onScoreUpdate(Math.floor(s.score / 6))
            }
          }

          if (obs.x < -40) {
            s.obstacles.splice(i, 1)
          }
        }
      }

      // Draw Obstacles
      s.obstacles.forEach((obs) => {
        const obsY = obs.type === 'gem' ? groundY - 70 : groundY - obs.h
        if (obs.type === 'gem') {
          ctx.fillStyle = '#34d399'
          ctx.shadowBlur = 12
          ctx.shadowColor = '#34d399'
          ctx.beginPath()
          ctx.arc(obs.x + obs.w / 2, obsY + obs.h / 2, 9, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        } else {
          ctx.fillStyle = '#ef4444'
          ctx.shadowBlur = 12
          ctx.shadowColor = '#ef4444'
          ctx.beginPath()
          ctx.moveTo(obs.x, groundY)
          ctx.lineTo(obs.x + obs.w / 2, groundY - obs.h)
          ctx.lineTo(obs.x + obs.w, groundY)
          ctx.closePath()
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      // Draw Player Ship / Cube
      const px = 80
      const py = s.playerY
      ctx.fillStyle = '#10b981'
      ctx.shadowBlur = 15
      ctx.shadowColor = '#10b981'
      ctx.fillRect(px, py, 26, 30)
      
      // Visor
      ctx.fillStyle = '#6ee7b7'
      ctx.fillRect(px + 14, py + 6, 10, 8)
      ctx.shadowBlur = 0

      // Score HUD
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 16px monospace'
      ctx.fillText(`SCORE: ${Math.floor(s.score / 6)}`, 20, 30)
      ctx.fillStyle = '#34d399'
      ctx.fillText(`SPEED: ${s.speed.toFixed(1)}x`, canvas.width - 130, 30)

      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [onScoreUpdate])

  return (
    <div className="relative flex flex-col items-center w-full">
      <canvas 
        ref={canvasRef} 
        width={700} 
        height={380} 
        onClick={() => { if (gameState === 'playing') jump(); else startGame() }}
        className="w-full max-w-[700px] h-[340px] sm:h-[380px] rounded-2xl border border-white/10 bg-[#050811] cursor-pointer"
      />

      {gameState !== 'playing' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-2xl space-y-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Rocket size={32} />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-bold font-display text-white">
              {gameState === 'gameover' ? 'GAME OVER' : 'CYBER RUNNER'}
            </h3>
            <p className="text-xs text-slate-400">
              {gameState === 'gameover' ? `Final Score: ${score} PTS` : 'Press SPACE or Tap anywhere to Jump'}
            </p>
          </div>
          <button
            onClick={startGame}
            className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/30 cursor-pointer"
          >
            {gameState === 'gameover' ? 'Play Again' : 'Start Run'}
          </button>
        </div>
      )}

      {/* Mobile Touch Jump Button */}
      <div className="sm:hidden w-full flex justify-center mt-3">
        <button
          onClick={jump}
          className="w-full max-w-xs py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm tracking-wider uppercase active:bg-emerald-500 active:text-slate-950"
        >
          TAP TO JUMP 🚀
        </button>
      </div>
    </div>
  )
}

/* =========================================================================
   GAME 2: GALAXY DEFENDER (Space Shooter)
   ========================================================================= */
const GalaxyDefenderGame: React.FC<{ onScoreUpdate: (score: number) => void }> = ({ onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle')
  const [score, setScore] = useState(0)

  const stateRef = useRef({
    playerX: 350,
    playerY: 340,
    score: 0,
    health: 3,
    bullets: [] as { x: number; y: number }[],
    enemies: [] as { x: number; y: number; vx: number; hp: number; type: 'grunt' | 'elite' }[],
    powerups: [] as { x: number; y: number; type: 'triple' | 'shield' }[],
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
    tripleShotTimer: 0,
    hasShield: false,
    frameCount: 0,
    isRunning: false,
    keys: { left: false, right: false, fire: false }
  })

  const startGame = () => {
    stateRef.current = {
      playerX: 350,
      playerY: 340,
      score: 0,
      health: 3,
      bullets: [],
      enemies: [],
      powerups: [],
      particles: [],
      tripleShotTimer: 0,
      hasShield: false,
      frameCount: 0,
      isRunning: true,
      keys: { left: false, right: false, fire: false }
    }
    setScore(0)
    setGameState('playing')
    arcadeAudio.playPowerup()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = stateRef.current.keys
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') k.left = true
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') k.right = true
      if (e.code === 'Space') {
        e.preventDefault()
        k.fire = true
        if (!stateRef.current.isRunning) startGame()
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      const k = stateRef.current.keys
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') k.left = false
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') k.right = false
      if (e.code === 'Space') k.fire = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    let animId: number
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const loop = () => {
      const s = stateRef.current

      // Background
      ctx.fillStyle = '#050714'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Stars background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
      for (let i = 0; i < 30; i++) {
        const sx = (i * 37 + s.frameCount * 2) % canvas.width
        const sy = (i * 59 + s.frameCount * 3) % canvas.height
        ctx.fillRect(sx, sy, (i % 2) + 1, (i % 2) + 1)
      }

      if (s.isRunning) {
        s.frameCount++

        // Player Controls
        if (s.keys.left && s.playerX > 25) s.playerX -= 6
        if (s.keys.right && s.playerX < canvas.width - 25) s.playerX += 6

        // Firing lasers
        if (s.frameCount % 10 === 0) {
          if (s.tripleShotTimer > 0) {
            s.tripleShotTimer--
            s.bullets.push({ x: s.playerX - 10, y: s.playerY })
            s.bullets.push({ x: s.playerX, y: s.playerY })
            s.bullets.push({ x: s.playerX + 10, y: s.playerY })
          } else {
            s.bullets.push({ x: s.playerX, y: s.playerY })
          }
          arcadeAudio.playLaser()
        }

        // Spawn Enemies
        if (s.frameCount % 40 === 0) {
          const isElite = Math.random() > 0.75
          s.enemies.push({
            x: Math.random() * (canvas.width - 60) + 30,
            y: -20,
            vx: (Math.random() - 0.5) * 2,
            hp: isElite ? 3 : 1,
            type: isElite ? 'elite' : 'grunt'
          })
        }

        // Bullets logic
        for (let i = s.bullets.length - 1; i >= 0; i--) {
          const b = s.bullets[i]
          b.y -= 10
          if (b.y < -10) s.bullets.splice(i, 1)
        }

        // Enemies logic
        for (let i = s.enemies.length - 1; i >= 0; i--) {
          const e = s.enemies[i]
          e.y += e.type === 'elite' ? 2 : 2.5
          e.x += e.vx
          if (e.x < 20 || e.x > canvas.width - 20) e.vx *= -1

          // Bullet hits Enemy
          for (let j = s.bullets.length - 1; j >= 0; j--) {
            const b = s.bullets[j]
            const dist = Math.hypot(b.x - e.x, b.y - e.y)
            if (dist < 22) {
              e.hp--
              s.bullets.splice(j, 1)
              arcadeAudio.playHit()

              if (e.hp <= 0) {
                s.score += e.type === 'elite' ? 250 : 100
                setScore(s.score)
                arcadeAudio.playExplosion()

                // Chance to drop powerup
                if (Math.random() > 0.8) {
                  s.powerups.push({
                    x: e.x,
                    y: e.y,
                    type: Math.random() > 0.5 ? 'triple' : 'shield'
                  })
                }

                s.enemies.splice(i, 1)
                break
              }
            }
          }

          // Enemy hits player or passes bottom
          if (e.y > canvas.height + 20) {
            s.enemies.splice(i, 1)
          } else if (Math.hypot(e.x - s.playerX, e.y - s.playerY) < 28) {
            s.enemies.splice(i, 1)
            if (s.hasShield) {
              s.hasShield = false
              arcadeAudio.playHit()
            } else {
              s.health--
              arcadeAudio.playExplosion()
              if (s.health <= 0) {
                s.isRunning = false
                setGameState('gameover')
                arcadeAudio.playGameOver()
                onScoreUpdate(s.score)
              }
            }
          }
        }

        // Powerups
        for (let i = s.powerups.length - 1; i >= 0; i--) {
          const p = s.powerups[i]
          p.y += 2
          if (Math.hypot(p.x - s.playerX, p.y - s.playerY) < 26) {
            if (p.type === 'triple') s.tripleShotTimer = 120
            if (p.type === 'shield') s.hasShield = true
            arcadeAudio.playPowerup()
            s.powerups.splice(i, 1)
          } else if (p.y > canvas.height) {
            s.powerups.splice(i, 1)
          }
        }
      }

      // Draw Bullets
      ctx.fillStyle = '#60a5fa'
      ctx.shadowBlur = 8
      ctx.shadowColor = '#60a5fa'
      s.bullets.forEach(b => {
        ctx.fillRect(b.x - 2, b.y, 4, 12)
      })
      ctx.shadowBlur = 0

      // Draw Enemies
      s.enemies.forEach(e => {
        ctx.fillStyle = e.type === 'elite' ? '#a855f7' : '#ef4444'
        ctx.shadowBlur = 10
        ctx.shadowColor = ctx.fillStyle
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.type === 'elite' ? 14 : 10, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // Draw Powerups
      s.powerups.forEach(p => {
        ctx.fillStyle = p.type === 'triple' ? '#f59e0b' : '#06b6d4'
        ctx.shadowBlur = 10
        ctx.shadowColor = ctx.fillStyle
        ctx.beginPath()
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // Draw Player Ship
      ctx.fillStyle = '#10b981'
      ctx.shadowBlur = 15
      ctx.shadowColor = '#10b981'
      ctx.beginPath()
      ctx.moveTo(s.playerX, s.playerY - 16)
      ctx.lineTo(s.playerX - 16, s.playerY + 14)
      ctx.lineTo(s.playerX, s.playerY + 8)
      ctx.lineTo(s.playerX + 16, s.playerY + 14)
      ctx.closePath()
      ctx.fill()

      if (s.hasShield) {
        ctx.strokeStyle = '#38bdf8'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(s.playerX, s.playerY, 24, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.shadowBlur = 0

      // HUD
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 15px monospace'
      ctx.fillText(`SCORE: ${s.score}`, 20, 30)
      ctx.fillStyle = '#ef4444'
      ctx.fillText(`LIVES: ${'❤️'.repeat(Math.max(0, s.health))}`, canvas.width - 140, 30)

      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [onScoreUpdate])

  return (
    <div className="relative flex flex-col items-center w-full">
      <canvas 
        ref={canvasRef} 
        width={700} 
        height={380} 
        className="w-full max-w-[700px] h-[340px] sm:h-[380px] rounded-2xl border border-white/10 bg-[#050714]"
      />

      {gameState !== 'playing' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-2xl space-y-4">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Shield size={32} />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-bold font-display text-white">
              {gameState === 'gameover' ? 'MISSION FAILED' : 'GALAXY DEFENDER'}
            </h3>
            <p className="text-xs text-slate-400">
              {gameState === 'gameover' ? `Final Score: ${score} PTS` : 'Use ARROWS / A-D to Move. Auto-firing lasers.'}
            </p>
          </div>
          <button
            onClick={startGame}
            className="px-6 py-2.5 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-indigo-500/30 cursor-pointer"
          >
            {gameState === 'gameover' ? 'Play Again' : 'Launch Fighter'}
          </button>
        </div>
      )}

      {/* Mobile Controls */}
      <div className="sm:hidden w-full flex items-center justify-center gap-4 mt-3">
        <button
          onTouchStart={() => { stateRef.current.keys.left = true }}
          onTouchEnd={() => { stateRef.current.keys.left = false }}
          className="p-4 rounded-xl bg-white/10 text-white font-bold"
        >
          <LeftIcon size={20} />
        </button>
        <button
          onTouchStart={() => { stateRef.current.keys.right = true }}
          onTouchEnd={() => { stateRef.current.keys.right = false }}
          className="p-4 rounded-xl bg-white/10 text-white font-bold"
        >
          <RightIcon size={20} />
        </button>
      </div>
    </div>
  )
}

/* =========================================================================
   GAME 3: CYBER SNAKE 360
   ========================================================================= */
const CyberSnakeGame: React.FC<{ onScoreUpdate: (score: number) => void }> = ({ onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle')
  const [score, setScore] = useState(0)

  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 15, y: 10 },
    bonus: null as { x: number; y: number; life: number } | null,
    score: 0,
    speedMs: 90,
    lastUpdate: 0,
    isRunning: false
  })

  const spawnFood = (s: any) => {
    s.food = {
      x: Math.floor(Math.random() * 32) + 1,
      y: Math.floor(Math.random() * 17) + 1
    }
  }

  const startGame = () => {
    stateRef.current = {
      snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }],
      dir: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      food: { x: 15, y: 10 },
      bonus: null,
      score: 0,
      speedMs: 90,
      lastUpdate: 0,
      isRunning: true
    }
    setScore(0)
    setGameState('playing')
    arcadeAudio.playPowerup()
  }

  const changeDir = useCallback((dx: number, dy: number) => {
    const s = stateRef.current
    if (s.dir.x + dx !== 0 || s.dir.y + dy !== 0) {
      s.nextDir = { x: dx, y: dy }
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') changeDir(0, -1)
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') changeDir(0, 1)
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') changeDir(-1, 0)
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') changeDir(1, 0)
      if (e.code === 'Space' && !stateRef.current.isRunning) startGame()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [changeDir])

  useEffect(() => {
    let animId: number
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const gridSize = 20
    const cols = Math.floor(canvas.width / gridSize)
    const rows = Math.floor(canvas.height / gridSize)

    const loop = (timestamp: number) => {
      const s = stateRef.current

      // Clear Canvas
      ctx.fillStyle = '#060914'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Grid background
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.06)'
      ctx.lineWidth = 1
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      if (s.isRunning && timestamp - s.lastUpdate > s.speedMs) {
        s.lastUpdate = timestamp
        s.dir = s.nextDir

        const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y }

        // Wall collision -> wrap around or game over
        if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
          s.isRunning = false
          setGameState('gameover')
          arcadeAudio.playGameOver()
          onScoreUpdate(s.score)
        } else {
          // Self collision
          const selfHit = s.snake.some(segment => segment.x === head.x && segment.y === head.y)
          if (selfHit) {
            s.isRunning = false
            setGameState('gameover')
            arcadeAudio.playGameOver()
            onScoreUpdate(s.score)
          } else {
            s.snake.unshift(head)

            // Eat food
            if (head.x === s.food.x && head.y === s.food.y) {
              s.score += 100
              setScore(s.score)
              arcadeAudio.playCoin()
              spawnFood(s)
              if (s.speedMs > 45) s.speedMs -= 1
            } else {
              s.snake.pop()
            }
          }
        }
      }

      // Draw Food
      ctx.fillStyle = '#06b6d4'
      ctx.shadowBlur = 14
      ctx.shadowColor = '#06b6d4'
      ctx.beginPath()
      ctx.arc(s.food.x * gridSize + gridSize / 2, s.food.y * gridSize + gridSize / 2, gridSize / 2.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // Draw Snake
      s.snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? '#22d3ee' : '#0891b2'
        ctx.shadowBlur = i === 0 ? 10 : 0
        ctx.shadowColor = '#22d3ee'
        ctx.fillRect(seg.x * gridSize + 2, seg.y * gridSize + 2, gridSize - 4, gridSize - 4)
      })
      ctx.shadowBlur = 0

      // HUD
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 15px monospace'
      ctx.fillText(`SCORE: ${s.score}`, 20, 26)
      ctx.fillStyle = '#06b6d4'
      ctx.fillText(`LENGTH: ${s.snake.length}`, canvas.width - 120, 26)

      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [onScoreUpdate])

  return (
    <div className="relative flex flex-col items-center w-full">
      <canvas 
        ref={canvasRef} 
        width={700} 
        height={380} 
        className="w-full max-w-[700px] h-[340px] sm:h-[380px] rounded-2xl border border-white/10 bg-[#060914]"
      />

      {gameState !== 'playing' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-2xl space-y-4">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Activity size={32} />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-bold font-display text-white">
              {gameState === 'gameover' ? 'GAME OVER' : 'CYBER SNAKE 360'}
            </h3>
            <p className="text-xs text-slate-400">
              {gameState === 'gameover' ? `Final Score: ${score} PTS` : 'Use ARROW KEYS or WASD to navigate.'}
            </p>
          </div>
          <button
            onClick={startGame}
            className="px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-cyan-500/30 cursor-pointer"
          >
            {gameState === 'gameover' ? 'Play Again' : 'Start Snake'}
          </button>
        </div>
      )}

      {/* Mobile D-Pad */}
      <div className="sm:hidden grid grid-cols-3 gap-2 w-48 mt-3">
        <div />
        <button onClick={() => changeDir(0, -1)} className="p-3 rounded-xl bg-white/10 text-white font-bold flex justify-center"><ArrowUp size={18} /></button>
        <div />
        <button onClick={() => changeDir(-1, 0)} className="p-3 rounded-xl bg-white/10 text-white font-bold flex justify-center"><LeftIcon size={18} /></button>
        <button onClick={() => changeDir(0, 1)} className="p-3 rounded-xl bg-white/10 text-white font-bold flex justify-center"><ArrowDown size={18} /></button>
        <button onClick={() => changeDir(1, 0)} className="p-3 rounded-xl bg-white/10 text-white font-bold flex justify-center"><RightIcon size={18} /></button>
      </div>
    </div>
  )
}

/* =========================================================================
   GAME 4: NEON BREAKOUT (Arkanoid)
   ========================================================================= */
const NeonBreakoutGame: React.FC<{ onScoreUpdate: (score: number) => void }> = ({ onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle')
  const [score, setScore] = useState(0)

  const stateRef = useRef({
    paddleX: 300,
    paddleW: 100,
    ballX: 350,
    ballY: 330,
    ballVx: 4,
    ballVy: -4,
    bricks: [] as { x: number; y: number; w: number; h: number; hp: number; color: string }[],
    score: 0,
    lives: 3,
    isRunning: false
  })

  const initBricks = () => {
    const bricks = []
    const colors = ['#ec4899', '#a855f7', '#3b82f6', '#10b981', '#f59e0b']
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 9; c++) {
        bricks.push({
          x: c * 72 + 28,
          y: r * 22 + 45,
          w: 64,
          h: 16,
          hp: 1,
          color: colors[r]
        })
      }
    }
    return bricks
  }

  const startGame = () => {
    stateRef.current = {
      paddleX: 300,
      paddleW: 100,
      ballX: 350,
      ballY: 330,
      ballVx: 4 * (Math.random() > 0.5 ? 1 : -1),
      ballVy: -4.5,
      bricks: initBricks(),
      score: 0,
      lives: 3,
      isRunning: true
    }
    setScore(0)
    setGameState('playing')
    arcadeAudio.playPowerup()
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      stateRef.current.paddleX = Math.max(0, Math.min(canvas.width - stateRef.current.paddleW, mouseX - stateRef.current.paddleW / 2))
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    let animId: number
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const loop = () => {
      const s = stateRef.current

      ctx.fillStyle = '#080511'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (s.isRunning) {
        s.ballX += s.ballVx
        s.ballY += s.ballVy

        // Wall collisions
        if (s.ballX <= 8 || s.ballX >= canvas.width - 8) {
          s.ballVx *= -1
          arcadeAudio.playHit()
        }
        if (s.ballY <= 8) {
          s.ballVy *= -1
          arcadeAudio.playHit()
        }

        // Paddle collision
        const paddleY = 350
        if (
          s.ballY + 8 >= paddleY &&
          s.ballY - 8 <= paddleY + 12 &&
          s.ballX >= s.paddleX &&
          s.ballX <= s.paddleX + s.paddleW
        ) {
          s.ballVy = -Math.abs(s.ballVy)
          const hitPos = (s.ballX - (s.paddleX + s.paddleW / 2)) / (s.paddleW / 2)
          s.ballVx = hitPos * 6
          arcadeAudio.playJump()
        }

        // Brick collisions
        for (let i = s.bricks.length - 1; i >= 0; i--) {
          const b = s.bricks[i]
          if (
            s.ballX + 8 > b.x &&
            s.ballX - 8 < b.x + b.w &&
            s.ballY + 8 > b.y &&
            s.ballY - 8 < b.y + b.h
          ) {
            s.ballVy *= -1
            s.bricks.splice(i, 1)
            s.score += 50
            setScore(s.score)
            arcadeAudio.playCoin()
            break
          }
        }

        // Ball falls off bottom
        if (s.ballY > canvas.height + 20) {
          s.lives--
          arcadeAudio.playExplosion()
          if (s.lives <= 0) {
            s.isRunning = false
            setGameState('gameover')
            arcadeAudio.playGameOver()
            onScoreUpdate(s.score)
          } else {
            s.ballX = s.paddleX + s.paddleW / 2
            s.ballY = 330
            s.ballVy = -4.5
          }
        }

        // Cleared all bricks
        if (s.bricks.length === 0) {
          s.score += 1000
          s.bricks = initBricks()
          arcadeAudio.playPowerup()
        }
      }

      // Draw Bricks
      s.bricks.forEach(b => {
        ctx.fillStyle = b.color
        ctx.shadowBlur = 8
        ctx.shadowColor = b.color
        ctx.fillRect(b.x, b.y, b.w, b.h)
      })
      ctx.shadowBlur = 0

      // Draw Paddle
      ctx.fillStyle = '#ec4899'
      ctx.shadowBlur = 12
      ctx.shadowColor = '#ec4899'
      ctx.fillRect(s.paddleX, 350, s.paddleW, 12)
      ctx.shadowBlur = 0

      // Draw Ball
      ctx.fillStyle = '#ffffff'
      ctx.shadowBlur = 10
      ctx.shadowColor = '#ffffff'
      ctx.beginPath()
      ctx.arc(s.ballX, s.ballY, 7, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // HUD
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 15px monospace'
      ctx.fillText(`SCORE: ${s.score}`, 20, 26)
      ctx.fillStyle = '#ec4899'
      ctx.fillText(`LIVES: ${'❤️'.repeat(Math.max(0, s.lives))}`, canvas.width - 130, 26)

      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [onScoreUpdate])

  return (
    <div className="relative flex flex-col items-center w-full">
      <canvas 
        ref={canvasRef} 
        width={700} 
        height={380} 
        className="w-full max-w-[700px] h-[340px] sm:h-[380px] rounded-2xl border border-white/10 bg-[#080511]"
      />

      {gameState !== 'playing' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-2xl space-y-4">
          <div className="p-3 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
            <Layers size={32} />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-bold font-display text-white">
              {gameState === 'gameover' ? 'GAME OVER' : 'NEON BREAKOUT'}
            </h3>
            <p className="text-xs text-slate-400">
              {gameState === 'gameover' ? `Final Score: ${score} PTS` : 'Move your mouse or drag across screen to control paddle.'}
            </p>
          </div>
          <button
            onClick={startGame}
            className="px-6 py-2.5 rounded-full bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-pink-500/30 cursor-pointer"
          >
            {gameState === 'gameover' ? 'Play Again' : 'Launch Ball'}
          </button>
        </div>
      )}
    </div>
  )
}

/* =========================================================================
   GAME 5: CYBER 2048 (Logic Puzzle)
   ========================================================================= */
const Cyber2048Game: React.FC<{ onScoreUpdate: (score: number) => void }> = ({ onScoreUpdate }) => {
  const [grid, setGrid] = useState<number[][]>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const addRandomTile = (g: number[][]) => {
    const empty: { r: number; c: number }[] = []
    g.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val === 0) empty.push({ r, c })
      })
    })
    if (empty.length > 0) {
      const { r, c } = empty[Math.floor(Math.random() * empty.length)]
      g[r][c] = Math.random() > 0.85 ? 4 : 2
    }
  }

  const initGame = () => {
    const newGrid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]
    addRandomTile(newGrid)
    addRandomTile(newGrid)
    setGrid(newGrid)
    setScore(0)
    setGameOver(false)
    arcadeAudio.playPowerup()
  }

  useEffect(() => {
    initGame()
  }, [])

  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    setGrid(prev => {
      let moved = false
      let gainedScore = 0
      const g = prev.map(row => [...row])

      const slide = (row: number[]) => {
        let arr = row.filter(v => v !== 0)
        for (let i = 0; i < arr.length - 1; i++) {
          if (arr[i] === arr[i + 1]) {
            arr[i] *= 2
            gainedScore += arr[i]
            arr.splice(i + 1, 1)
          }
        }
        while (arr.length < 4) arr.push(0)
        return arr
      }

      if (direction === 'left') {
        for (let r = 0; r < 4; r++) {
          const next = slide(g[r])
          if (next.join(',') !== g[r].join(',')) moved = true
          g[r] = next
        }
      } else if (direction === 'right') {
        for (let r = 0; r < 4; r++) {
          const next = slide([...g[r]].reverse()).reverse()
          if (next.join(',') !== g[r].join(',')) moved = true
          g[r] = next
        }
      } else if (direction === 'up') {
        for (let c = 0; c < 4; c++) {
          const col = [g[0][c], g[1][c], g[2][c], g[3][c]]
          const next = slide(col)
          if (next.join(',') !== col.join(',')) moved = true
          for (let r = 0; r < 4; r++) g[r][c] = next[r]
        }
      } else if (direction === 'down') {
        for (let c = 0; c < 4; c++) {
          const col = [g[3][c], g[2][c], g[1][c], g[0][c]]
          const next = slide(col)
          if (next.join(',') !== col.join(',')) moved = true
          for (let r = 0; r < 4; r++) g[3 - r][c] = next[r]
        }
      }

      if (moved) {
        addRandomTile(g)
        arcadeAudio.playLaser()
        setScore(sc => {
          const nextSc = sc + gainedScore
          onScoreUpdate(nextSc)
          return nextSc
        })
        return g
      }
      return prev
    })
  }, [onScoreUpdate])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { e.preventDefault(); move('up') }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { e.preventDefault(); move('down') }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { e.preventDefault(); move('left') }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { e.preventDefault(); move('right') }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [move])

  const getTileColor = (val: number) => {
    switch (val) {
      case 2: return 'bg-slate-800 text-slate-200 border-slate-700'
      case 4: return 'bg-teal-950/80 text-teal-300 border-teal-500/30'
      case 8: return 'bg-cyan-900/80 text-cyan-300 border-cyan-400/40'
      case 16: return 'bg-emerald-900/80 text-emerald-300 border-emerald-400/40'
      case 32: return 'bg-indigo-900/80 text-indigo-300 border-indigo-400/40'
      case 64: return 'bg-purple-900/80 text-purple-300 border-purple-400/40'
      case 128: return 'bg-pink-900/80 text-pink-300 border-pink-400/50'
      case 256: return 'bg-rose-900/80 text-rose-300 border-rose-400/60'
      case 512: return 'bg-amber-900/80 text-amber-300 border-amber-400/70 shadow-lg shadow-amber-500/20'
      case 1024: return 'bg-amber-500 text-slate-950 border-amber-300 font-extrabold shadow-xl shadow-amber-500/30'
      case 2048: return 'bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-500 text-white font-extrabold shadow-2xl shadow-rose-500/40'
      default: return 'bg-white/5 text-transparent border-white/5'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-md space-y-4">
      <div className="flex items-center justify-between w-full">
        <div className="text-sm font-mono font-bold text-amber-400">SCORE: {score}</div>
        <button
          onClick={initGame}
          className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-white flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw size={13} /> Reset Grid
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-900/90 border border-white/10 shadow-2xl w-full aspect-square">
        {grid.map((row, r) =>
          row.map((val, c) => (
            <div
              key={`${r}-${c}`}
              className={`rounded-xl border flex items-center justify-center text-lg sm:text-2xl font-bold font-mono transition-all duration-150 ${getTileColor(val)}`}
            >
              {val > 0 ? val : ''}
            </div>
          ))
        )}
      </div>

      {/* Mobile Controls */}
      <div className="grid grid-cols-3 gap-2 w-48 mt-2">
        <div />
        <button onClick={() => move('up')} className="p-3 rounded-xl bg-white/10 text-white font-bold flex justify-center"><ArrowUp size={18} /></button>
        <div />
        <button onClick={() => move('left')} className="p-3 rounded-xl bg-white/10 text-white font-bold flex justify-center"><LeftIcon size={18} /></button>
        <button onClick={() => move('down')} className="p-3 rounded-xl bg-white/10 text-white font-bold flex justify-center"><ArrowDown size={18} /></button>
        <button onClick={() => move('right')} className="p-3 rounded-xl bg-white/10 text-white font-bold flex justify-center"><RightIcon size={18} /></button>
      </div>
    </div>
  )
}

/* =========================================================================
   GAME 6: MEMORY MATRIX (Reflex Sequence Game)
   ========================================================================= */
const MemoryMatrixGame: React.FC<{ onScoreUpdate: (score: number) => void }> = ({ onScoreUpdate }) => {
  const [sequence, setSequence] = useState<number[]>([])
  const [userStep, setUserStep] = useState(0)
  const [activePad, setActivePad] = useState<number | null>(null)
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'user_turn' | 'gameover'>('idle')
  const [score, setScore] = useState(0)

  const tones = [261.63, 329.63, 392.0, 523.25] // C4, E4, G4, C5

  const flashPad = (padIdx: number, duration: number = 300) => {
    setActivePad(padIdx)
    arcadeAudio.playTone(tones[padIdx], duration / 1000)
    setTimeout(() => {
      setActivePad(null)
    }, duration)
  }

  const playSequence = (seq: number[]) => {
    setGameState('showing')
    seq.forEach((padIdx, i) => {
      setTimeout(() => {
        flashPad(padIdx, 400)
        if (i === seq.length - 1) {
          setTimeout(() => {
            setGameState('user_turn')
            setUserStep(0)
          }, 500)
        }
      }, i * 600)
    })
  }

  const startGame = () => {
    const firstSeq = [Math.floor(Math.random() * 4)]
    setSequence(firstSeq)
    setScore(0)
    setGameState('showing')
    arcadeAudio.playPowerup()
    setTimeout(() => {
      playSequence(firstSeq)
    }, 600)
  }

  const handlePadClick = (padIdx: number) => {
    if (gameState !== 'user_turn') return
    flashPad(padIdx, 250)

    if (sequence[userStep] === padIdx) {
      if (userStep + 1 === sequence.length) {
        // Round won!
        const nextScore = (score + 1) * 100
        setScore(nextScore)
        onScoreUpdate(nextScore)
        const nextSeq = [...sequence, Math.floor(Math.random() * 4)]
        setSequence(nextSeq)
        setTimeout(() => {
          playSequence(nextSeq)
        }, 800)
      } else {
        setUserStep(prev => prev + 1)
      }
    } else {
      // Wrong sequence
      setGameState('gameover')
      arcadeAudio.playGameOver()
      onScoreUpdate(score * 100)
    }
  }

  const pads = [
    { id: 0, color: 'from-emerald-500 to-teal-600', activeColor: 'bg-emerald-400 shadow-emerald-400/50' },
    { id: 1, color: 'from-indigo-500 to-blue-600', activeColor: 'bg-indigo-400 shadow-indigo-400/50' },
    { id: 2, color: 'from-amber-500 to-orange-600', activeColor: 'bg-amber-400 shadow-amber-400/50' },
    { id: 3, color: 'from-pink-500 to-rose-600', activeColor: 'bg-pink-400 shadow-pink-400/50' }
  ]

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-sm space-y-6">
      <div className="flex items-center justify-between w-full">
        <div className="text-sm font-mono font-bold text-emerald-400">
          ROUND: {sequence.length} | SCORE: {score * 100}
        </div>
        <span className="text-xs font-mono text-slate-400">
          {gameState === 'showing' ? 'WATCH SEQUENCE' : gameState === 'user_turn' ? 'YOUR TURN' : 'READY'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full aspect-square relative">
        {pads.map((p) => {
          const isActive = activePad === p.id
          return (
            <button
              key={p.id}
              onClick={() => handlePadClick(p.id)}
              disabled={gameState !== 'user_turn'}
              className={`rounded-3xl border border-white/20 transition-all duration-150 cursor-pointer ${
                isActive 
                  ? `${p.activeColor} shadow-2xl scale-95 brightness-150` 
                  : `bg-gradient-to-br ${p.color} opacity-70 hover:opacity-100 hover:scale-102`
              }`}
            />
          )
        })}

        {gameState !== 'showing' && gameState !== 'user_turn' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-sm rounded-3xl space-y-3 p-4">
            <Zap size={32} className="text-amber-400" />
            <h4 className="text-xl font-bold font-display text-white">
              {gameState === 'gameover' ? 'SEQUENCE BROKEN' : 'MEMORY MATRIX'}
            </h4>
            <button
              onClick={startGame}
              className="px-6 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-500/30"
            >
              {gameState === 'gameover' ? 'Retry' : 'Start Sequence'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default GamesArcade
