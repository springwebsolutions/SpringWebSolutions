import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { 
  Gamepad2, Play, RotateCcw, Volume2, VolumeX, Maximize2, Minimize2, 
  Trophy, Sparkles, ArrowLeft, Zap, Shield, Flame, Activity, 
  HelpCircle, ChevronRight, Star, Award, Layers, Rocket, Bot,
  ArrowUp, ArrowDown, ArrowLeft as LeftIcon, ArrowRight as RightIcon,
  Search, Grid, Compass, Disc, Cpu, CircleDot, PlayCircle
} from 'lucide-react'
import { arcadeAudio } from '@/lib/arcadeAudio'
import SEOHead from '@/components/seo/SEOHead'

type GameId = 
  | 'cyber-runner' 
  | 'galaxy-defender' 
  | 'cyber-snake' 
  | 'neon-breakout' 
  | 'cyber-2048' 
  | 'memory-matrix'
  | 'cyber-flap'
  | 'neon-blocks'
  | 'tower-stack'
  | 'cyber-pong'

type GameCategory = 'All' | 'Action & Shooters' | 'Classic Retro' | 'Puzzles & Logic' | 'Reflex & Timing'

interface GameMeta {
  id: GameId
  title: string
  tagline: string
  category: 'Action & Shooters' | 'Classic Retro' | 'Puzzles & Logic' | 'Reflex & Timing'
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
    category: 'Action & Shooters',
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
    category: 'Action & Shooters',
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
    id: 'cyber-flap',
    title: 'Cyber Flap',
    tagline: 'Precision flight through pulsating laser gates with gravity physics.',
    category: 'Reflex & Timing',
    difficulty: 'Challenging',
    instructions: [
      'Tap or press Space to flap your drone thrusters.',
      'Navigate through narrow gaps between glowing high-voltage laser gates.',
      'Earn Bronze, Silver, Gold, and Cyber Platinum medals based on streak.'
    ],
    controls: [
      { key: 'SPACE / CLICK', action: 'Flap Thruster' },
      { key: 'TAP SCREEN', action: 'Flap (Mobile)' }
    ],
    accentColor: '#eab308',
    icon: Disc
  },
  {
    id: 'tower-stack',
    title: 'Tower Stack',
    tagline: 'Precision slice stacker with perfect drop combo expansions and color cascades.',
    category: 'Reflex & Timing',
    difficulty: 'Casual',
    instructions: [
      'Time your drop as the moving floor block sweeps across the tower.',
      'Overhanging edges slice off and fall into the cyber void.',
      'Land consecutive perfect drops to trigger stack expansion combos!'
    ],
    controls: [
      { key: 'SPACE / CLICK', action: 'Place Block' },
      { key: 'TAP SCREEN', action: 'Place (Mobile)' }
    ],
    accentColor: '#ec4899',
    icon: Layers
  },
  {
    id: 'neon-blocks',
    title: 'Neon Block Drop',
    tagline: 'Classic falling tetromino matrix puzzle with rotation, ghost drop, and line clears.',
    category: 'Puzzles & Logic',
    difficulty: 'Medium',
    instructions: [
      'Position and rotate 7 classic geometric tetromino pieces.',
      'Fill complete horizontal lines to clear the matrix and earn multiplier points.',
      'Clear 4 lines at once for the ultimate Cyber Tetris bonus!'
    ],
    controls: [
      { key: '← / → or A / D', action: 'Move Piece' },
      { key: '↑ / W', action: 'Rotate' },
      { key: '↓ / SPACE', action: 'Soft / Hard Drop' }
    ],
    accentColor: '#8b5cf6',
    icon: Grid
  },
  {
    id: 'cyber-snake',
    title: 'Cyber Snake 360',
    tagline: 'Futuristic grid snake with speed boosts, neon glow trails, and golden bonus orbs.',
    category: 'Classic Retro',
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
    category: 'Classic Retro',
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
    accentColor: '#f43f5e',
    icon: Flame
  },
  {
    id: 'cyber-pong',
    title: 'Cyber Pong vs AI',
    tagline: 'High-speed table tennis rally against an adaptive neural AI opponent.',
    category: 'Classic Retro',
    difficulty: 'Medium',
    instructions: [
      'Deflect the plasma orb past the opponent AI paddle.',
      'Ball speed increases with every consecutive rally return.',
      'First to reach 7 points wins the match championship!'
    ],
    controls: [
      { key: 'MOUSE / ↑ ↓', action: 'Move Left Paddle' },
      { key: 'TOUCH DRAG', action: 'Move Paddle (Mobile)' }
    ],
    accentColor: '#3b82f6',
    icon: CircleDot
  },
  {
    id: 'cyber-2048',
    title: 'Cyber 2048',
    tagline: 'Addictive neon tile puzzle with smooth animations, undo moves, and score streaks.',
    category: 'Puzzles & Logic',
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
    category: 'Reflex & Timing',
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
    accentColor: '#14b8a6',
    icon: Zap
  }
]

export const GamesArcade: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameId>('cyber-runner')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [activeCategory, setActiveCategory] = useState<GameCategory>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [highScores, setHighScores] = useState<Record<GameId, number>>({
    'cyber-runner': 0,
    'galaxy-defender': 0,
    'cyber-snake': 0,
    'neon-breakout': 0,
    'cyber-2048': 0,
    'memory-matrix': 0,
    'cyber-flap': 0,
    'neon-blocks': 0,
    'tower-stack': 0,
    'cyber-pong': 0
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

  const filteredGames = GAMES_CATALOG.filter(g => {
    const matchesCategory = activeCategory === 'All' || g.category === activeCategory
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          g.tagline.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const categories: GameCategory[] = ['All', 'Action & Shooters', 'Classic Retro', 'Puzzles & Logic', 'Reflex & Timing']

  return (
    <div className="min-h-screen bg-[#04060e] text-white selection:bg-emerald-500 selection:text-slate-950 font-sans pb-24">
      <SEOHead
        title="Interactive HTML5 Games Arcade (10 Games) | Spring Web Solutions"
        description="Play 10 free, client-side HTML5 arcade games built with Canvas animations and Web Audio synthesis: Cyber Runner, Flap, Tetris Block Drop, Tower Stack, Galaxy Defender, Cyber Snake, 2048, and Pong."
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
              <span>Main Site</span>
            </Link>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Gamepad2 size={18} />
              </div>
              <span className="font-extrabold text-sm tracking-tight font-display">SPRINGWEB ARCADE</span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                10 HTML5 Canvas Games
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
              <Sparkles size={13} /> Zero-Install Browser Games • 100% Client Side
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight">
              Interactive <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">HTML5 Arcade</span>
            </h1>
            <p className="text-sm text-slate-400 font-light">
              High-performance client-side games engineered in vanilla HTML5 Canvas & Web Audio API. Smooth 60 FPS on desktop & mobile with zero download lag.
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

        {/* ── Filter Categories & Search Bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 10 games..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* ── Game Selector Carousel / Grid ── */}
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {filteredGames.map((g) => {
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
                      ? 'bg-gradient-to-b from-emerald-950/60 to-slate-900 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-[1.02] ring-1 ring-emerald-500'
                      : 'bg-slate-900/50 border-white/10 hover:border-white/20 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div 
                      className="p-2 rounded-xl flex items-center justify-center transition-colors"
                      style={{ 
                        backgroundColor: isSelected ? `${g.accentColor}25` : 'rgba(255,255,255,0.05)',
                        color: g.accentColor 
                      }}
                    >
                      <Icon size={18} />
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
                {selectedGame === 'cyber-flap' && (
                  <CyberFlapGame onScoreUpdate={(s) => saveHighScore('cyber-flap', s)} />
                )}
                {selectedGame === 'tower-stack' && (
                  <TowerStackGame onScoreUpdate={(s) => saveHighScore('tower-stack', s)} />
                )}
                {selectedGame === 'neon-blocks' && (
                  <NeonBlocksGame onScoreUpdate={(s) => saveHighScore('neon-blocks', s)} />
                )}
                {selectedGame === 'cyber-snake' && (
                  <CyberSnakeGame onScoreUpdate={(s) => saveHighScore('cyber-snake', s)} />
                )}
                {selectedGame === 'neon-breakout' && (
                  <NeonBreakoutGame onScoreUpdate={(s) => saveHighScore('neon-breakout', s)} />
                )}
                {selectedGame === 'cyber-pong' && (
                  <CyberPongGame onScoreUpdate={(s) => saveHighScore('cyber-pong', s)} />
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
                <span>Top High Scores</span>
              </div>

              <div className="space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar">
                {GAMES_CATALOG.map((g) => (
                  <div key={g.id} className="flex items-center justify-between text-xs font-mono py-1 border-b border-white/5 last:border-0">
                    <span className="text-slate-400 truncate max-w-[140px]">{g.title}</span>
                    <span className="font-bold text-amber-300">
                      {highScores[g.id] > 0 ? `${highScores[g.id].toLocaleString()}` : '0'}
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
   GAME 1: CYBER RUNNER
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
    speed: 5.5,
    obstacles: [] as { x: number; w: number; h: number; type: 'spike' | 'gem' }[],
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
        if (stateRef.current.isRunning) jump(); else startGame()
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

      if (s.isRunning) {
        s.frameCount++
        s.score += 1
        if (s.frameCount % 6 === 0) setScore(Math.floor(s.score / 6))
        if (s.frameCount % 500 === 0 && s.speed < 12) s.speed += 0.5

        s.playerVy += 0.65
        s.playerY += s.playerVy

        if (s.playerY >= groundY - 30) {
          s.playerY = groundY - 30
          s.playerVy = 0
          s.isGrounded = true
          s.jumpsLeft = 2
        }

        if (s.frameCount % Math.max(45, Math.floor(90 - s.speed * 3)) === 0) {
          const isGem = Math.random() > 0.65
          s.obstacles.push({
            x: canvas.width + 20,
            w: isGem ? 18 : 24,
            h: isGem ? 18 : 34,
            type: isGem ? 'gem' : 'spike'
          })
        }

        const playerBox = { x: 80, y: s.playerY, w: 26, h: 30 }

        for (let i = s.obstacles.length - 1; i >= 0; i--) {
          const obs = s.obstacles[i]
          obs.x -= s.speed
          const obsY = obs.type === 'gem' ? groundY - 70 : groundY - obs.h

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
              s.isRunning = false
              setGameState('gameover')
              arcadeAudio.playGameOver()
              onScoreUpdate(Math.floor(s.score / 6))
            }
          }
          if (obs.x < -40) s.obstacles.splice(i, 1)
        }
      }

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

      ctx.fillStyle = '#10b981'
      ctx.shadowBlur = 15
      ctx.shadowColor = '#10b981'
      ctx.fillRect(80, s.playerY, 26, 30)
      ctx.fillStyle = '#6ee7b7'
      ctx.fillRect(94, s.playerY + 6, 10, 8)
      ctx.shadowBlur = 0

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 16px monospace'
      ctx.fillText(`SCORE: ${Math.floor(s.score / 6)}`, 20, 30)

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
          <Rocket size={36} className="text-emerald-400" />
          <h3 className="text-2xl font-bold text-white font-display">
            {gameState === 'gameover' ? 'GAME OVER' : 'CYBER RUNNER'}
          </h3>
          <p className="text-xs text-slate-400">{gameState === 'gameover' ? `Score: ${score} PTS` : 'Press SPACE or Tap to Jump'}</p>
          <button onClick={startGame} className="px-6 py-2.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs uppercase cursor-pointer">
            {gameState === 'gameover' ? 'Play Again' : 'Start Run'}
          </button>
        </div>
      )}
    </div>
  )
}

/* =========================================================================
   GAME 2: CYBER FLAP (Flappy Laser Pilot)
   ========================================================================= */
const CyberFlapGame: React.FC<{ onScoreUpdate: (score: number) => void }> = ({ onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle')
  const [score, setScore] = useState(0)

  const stateRef = useRef({
    birdY: 180,
    birdVy: 0,
    pipes: [] as { x: number; topH: number; bottomY: number; passed: boolean }[],
    score: 0,
    frameCount: 0,
    isRunning: false
  })

  const flap = useCallback(() => {
    const s = stateRef.current
    if (!s.isRunning) return
    s.birdVy = -6.5
    arcadeAudio.playJump()
  }, [])

  const startGame = () => {
    stateRef.current = {
      birdY: 180,
      birdVy: 0,
      pipes: [],
      score: 0,
      frameCount: 0,
      isRunning: true
    }
    setScore(0)
    setGameState('playing')
    arcadeAudio.playPowerup()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault()
        if (stateRef.current.isRunning) flap(); else startGame()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [flap])

  useEffect(() => {
    let animId: number
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const gap = 110

    const loop = () => {
      const s = stateRef.current
      ctx.fillStyle = '#080914'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (s.isRunning) {
        s.frameCount++
        s.birdVy += 0.38
        s.birdY += s.birdVy

        // Spawn Pipes
        if (s.frameCount % 90 === 0) {
          const topH = Math.floor(Math.random() * 160) + 40
          s.pipes.push({
            x: canvas.width + 20,
            topH,
            bottomY: topH + gap,
            passed: false
          })
        }

        // Boundary hits
        if (s.birdY <= 0 || s.birdY >= canvas.height - 15) {
          s.isRunning = false
          setGameState('gameover')
          arcadeAudio.playGameOver()
          onScoreUpdate(s.score)
        }

        // Pipe collisions
        const birdX = 100
        const birdR = 14

        for (let i = s.pipes.length - 1; i >= 0; i--) {
          const p = s.pipes[i]
          p.x -= 3

          // Score check
          if (!p.passed && p.x + 40 < birdX) {
            p.passed = true
            s.score += 1
            setScore(s.score)
            arcadeAudio.playCoin()
          }

          // Hit pipe
          if (birdX + birdR > p.x && birdX - birdR < p.x + 40) {
            if (s.birdY - birdR < p.topH || s.birdY + birdR > p.bottomY) {
              s.isRunning = false
              setGameState('gameover')
              arcadeAudio.playGameOver()
              onScoreUpdate(s.score)
            }
          }

          if (p.x < -60) s.pipes.splice(i, 1)
        }
      }

      // Draw Pipes
      s.pipes.forEach(p => {
        ctx.fillStyle = '#eab308'
        ctx.shadowBlur = 10
        ctx.shadowColor = '#eab308'
        ctx.fillRect(p.x, 0, 40, p.topH)
        ctx.fillRect(p.x, p.bottomY, 40, canvas.height - p.bottomY)
        ctx.shadowBlur = 0
      })

      // Draw Cyber Drone
      ctx.fillStyle = '#38bdf8'
      ctx.shadowBlur = 15
      ctx.shadowColor = '#38bdf8'
      ctx.beginPath()
      ctx.arc(100, s.birdY, 14, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(106, s.birdY - 3, 6, 6)
      ctx.shadowBlur = 0

      // HUD
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 20px monospace'
      ctx.fillText(`${s.score}`, canvas.width / 2 - 10, 40)

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
        onClick={() => { if (gameState === 'playing') flap(); else startGame() }}
        className="w-full max-w-[700px] h-[340px] sm:h-[380px] rounded-2xl border border-white/10 bg-[#080914] cursor-pointer"
      />
      {gameState !== 'playing' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-2xl space-y-4">
          <Disc size={36} className="text-yellow-400 animate-spin" />
          <h3 className="text-2xl font-bold text-white font-display">
            {gameState === 'gameover' ? 'DRONE CRASHED' : 'CYBER FLAP'}
          </h3>
          <p className="text-xs text-slate-400">{gameState === 'gameover' ? `Score: ${score} GATES` : 'Press SPACE or Tap to Flap'}</p>
          <button onClick={startGame} className="px-6 py-2.5 rounded-full bg-yellow-500 text-slate-950 font-bold text-xs uppercase cursor-pointer">
            {gameState === 'gameover' ? 'Retry Flight' : 'Launch Drone'}
          </button>
        </div>
      )}
    </div>
  )
}

/* =========================================================================
   GAME 3: TOWER STACK (Slice Stacker)
   ========================================================================= */
const TowerStackGame: React.FC<{ onScoreUpdate: (score: number) => void }> = ({ onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle')
  const [score, setScore] = useState(0)

  const stateRef = useRef({
    stack: [] as { x: number; y: number; w: number; color: string }[],
    currentX: 100,
    currentW: 220,
    direction: 1,
    speed: 4,
    level: 0,
    score: 0,
    combo: 0,
    isRunning: false
  })

  const colors = ['#ec4899', '#f43f5e', '#fb7185', '#a855f7', '#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b']

  const placeBlock = useCallback(() => {
    const s = stateRef.current
    if (!s.isRunning) return

    const topBlock = s.stack[s.stack.length - 1]
    const diff = s.currentX - topBlock.x

    if (Math.abs(diff) <= 3) {
      // Perfect drop combo!
      s.currentX = topBlock.x
      s.combo++
      s.score += 20 * s.combo
      arcadeAudio.playCoin()
    } else if (s.currentX + s.currentW < topBlock.x || s.currentX > topBlock.x + topBlock.w) {
      // Completely missed
      s.isRunning = false
      setGameState('gameover')
      arcadeAudio.playGameOver()
      onScoreUpdate(s.score)
      return
    } else {
      // Partial slice
      s.combo = 0
      if (diff > 0) {
        s.currentW -= diff
      } else {
        s.currentW += diff
        s.currentX = topBlock.x
      }
      s.score += 10
      arcadeAudio.playHit()
    }

    setScore(s.score)
    s.stack.push({
      x: s.currentX,
      y: 320 - (s.stack.length * 18),
      w: s.currentW,
      color: colors[s.stack.length % colors.length]
    })

    s.level++
    s.speed = Math.min(9, 4 + s.level * 0.15)
    s.currentX = 50
    s.direction = 1
  }, [onScoreUpdate])

  const startGame = () => {
    stateRef.current = {
      stack: [{ x: 240, y: 320, w: 220, color: '#ec4899' }],
      currentX: 50,
      currentW: 220,
      direction: 1,
      speed: 4,
      level: 0,
      score: 0,
      combo: 0,
      isRunning: true
    }
    setScore(0)
    setGameState('playing')
    arcadeAudio.playPowerup()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        if (stateRef.current.isRunning) placeBlock(); else startGame()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [placeBlock])

  useEffect(() => {
    let animId: number
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const loop = () => {
      const s = stateRef.current
      ctx.fillStyle = '#060610'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (s.isRunning) {
        s.currentX += s.speed * s.direction
        if (s.currentX <= 40 || s.currentX + s.currentW >= canvas.width - 40) {
          s.direction *= -1
        }
      }

      // Draw Stacked Blocks
      s.stack.forEach((b) => {
        ctx.fillStyle = b.color
        ctx.shadowBlur = 8
        ctx.shadowColor = b.color
        ctx.fillRect(b.x, b.y, b.w, 16)
        ctx.shadowBlur = 0
      })

      // Draw Moving Block
      if (s.isRunning) {
        const nextY = 320 - (s.stack.length * 18)
        ctx.fillStyle = colors[s.stack.length % colors.length]
        ctx.shadowBlur = 12
        ctx.shadowColor = ctx.fillStyle
        ctx.fillRect(s.currentX, nextY, s.currentW, 16)
        ctx.shadowBlur = 0
      }

      // HUD
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 16px monospace'
      ctx.fillText(`SCORE: ${s.score}`, 20, 30)
      ctx.fillStyle = '#ec4899'
      ctx.fillText(`HEIGHT: ${s.stack.length}`, canvas.width - 120, 30)

      animId = requestAnimationFrame(loop)
    }
    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <div className="relative flex flex-col items-center w-full">
      <canvas 
        ref={canvasRef} 
        width={700} 
        height={380} 
        onClick={() => { if (gameState === 'playing') placeBlock(); else startGame() }}
        className="w-full max-w-[700px] h-[340px] sm:h-[380px] rounded-2xl border border-white/10 bg-[#060610] cursor-pointer"
      />
      {gameState !== 'playing' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-2xl space-y-4">
          <Layers size={36} className="text-pink-400" />
          <h3 className="text-2xl font-bold text-white font-display">
            {gameState === 'gameover' ? 'TOWER TOPPLED' : 'TOWER STACK'}
          </h3>
          <p className="text-xs text-slate-400">{gameState === 'gameover' ? `Score: ${score} PTS` : 'Press SPACE or Tap to Place Block'}</p>
          <button onClick={startGame} className="px-6 py-2.5 rounded-full bg-pink-500 text-white font-bold text-xs uppercase cursor-pointer">
            {gameState === 'gameover' ? 'Rebuild Tower' : 'Start Stacking'}
          </button>
        </div>
      )}
    </div>
  )
}

/* =========================================================================
   GAME 4: NEON BLOCKS (Tetris Style)
   ========================================================================= */
const NeonBlocksGame: React.FC<{ onScoreUpdate: (score: number) => void }> = ({ onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle')
  const [score, setScore] = useState(0)

  const SHAPES = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]], // J
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 0], [0, 1, 1]]  // Z
  ]
  const SHAPE_COLORS = ['#06b6d4', '#f59e0b', '#a855f7', '#f97316', '#3b82f6', '#10b981', '#ef4444']

  const stateRef = useRef({
    grid: Array(20).fill(null).map(() => Array(10).fill(0)),
    piece: { shape: [] as number[][], x: 3, y: 0, color: '#06b6d4' },
    score: 0,
    lastDrop: 0,
    dropInterval: 600,
    isRunning: false
  })

  const spawnPiece = () => {
    const idx = Math.floor(Math.random() * SHAPES.length)
    stateRef.current.piece = {
      shape: SHAPES[idx],
      x: 3,
      y: 0,
      color: SHAPE_COLORS[idx]
    }
  }

  const collide = (grid: number[][], piece: any, offX = 0, offY = 0) => {
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          const nx = piece.x + c + offX
          const ny = piece.y + r + offY
          if (nx < 0 || nx >= 10 || ny >= 20 || (ny >= 0 && grid[ny][nx])) return true
        }
      }
    }
    return false
  }

  const merge = () => {
    const s = stateRef.current
    s.piece.shape.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val) {
          const ny = s.piece.y + r
          const nx = s.piece.x + c
          if (ny >= 0 && ny < 20) s.grid[ny][nx] = s.piece.color as any
        }
      })
    })

    // Clear lines
    let lines = 0
    for (let r = 19; r >= 0; r--) {
      if (s.grid[r].every(v => v !== 0)) {
        s.grid.splice(r, 1)
        s.grid.unshift(Array(10).fill(0))
        lines++
        r++
      }
    }
    if (lines > 0) {
      s.score += lines === 4 ? 800 : lines * 100
      setScore(s.score)
      arcadeAudio.playCoin()
    }
    spawnPiece()

    if (collide(s.grid, s.piece)) {
      s.isRunning = false
      setGameState('gameover')
      arcadeAudio.playGameOver()
      onScoreUpdate(s.score)
    }
  }

  const rotate = () => {
    const s = stateRef.current
    if (!s.isRunning) return
    const prev = s.piece.shape
    const next = prev[0].map((_, i) => prev.map(row => row[i]).reverse())
    const oldShape = s.piece.shape
    s.piece.shape = next
    if (collide(s.grid, s.piece)) s.piece.shape = oldShape
    else arcadeAudio.playLaser()
  }

  const move = (dx: number) => {
    const s = stateRef.current
    if (!s.isRunning) return
    if (!collide(s.grid, s.piece, dx, 0)) s.piece.x += dx
  }

  const drop = () => {
    const s = stateRef.current
    if (!s.isRunning) return
    if (!collide(s.grid, s.piece, 0, 1)) {
      s.piece.y += 1
    } else {
      merge()
    }
  }

  const startGame = () => {
    stateRef.current = {
      grid: Array(20).fill(null).map(() => Array(10).fill(0)),
      piece: { shape: [], x: 3, y: 0, color: '#06b6d4' },
      score: 0,
      lastDrop: 0,
      dropInterval: 600,
      isRunning: true
    }
    spawnPiece()
    setScore(0)
    setGameState('playing')
    arcadeAudio.playPowerup()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') move(-1)
      if (e.key === 'ArrowRight' || e.key === 'd') move(1)
      if (e.key === 'ArrowUp' || e.key === 'w') rotate()
      if (e.key === 'ArrowDown' || e.key === 's') drop()
      if (e.code === 'Space') {
        e.preventDefault()
        if (stateRef.current.isRunning) drop(); else startGame()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    let animId: number
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const blockSize = 17

    const loop = (time: number) => {
      const s = stateRef.current
      ctx.fillStyle = '#060714'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (s.isRunning && time - s.lastDrop > s.dropInterval) {
        s.lastDrop = time
        drop()
      }

      // Draw Board Offset
      const offX = 265
      const offY = 20

      // Matrix Border
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'
      ctx.strokeRect(offX, offY, 10 * blockSize, 20 * blockSize)

      // Draw Grid
      s.grid.forEach((row, r) => {
        row.forEach((color, c) => {
          if (color) {
            ctx.fillStyle = color as any
            ctx.fillRect(offX + c * blockSize + 1, offY + r * blockSize + 1, blockSize - 2, blockSize - 2)
          }
        })
      })

      // Draw Active Piece
      if (s.isRunning) {
        s.piece.shape.forEach((row, r) => {
          row.forEach((val, c) => {
            if (val) {
              ctx.fillStyle = s.piece.color
              ctx.fillRect(offX + (s.piece.x + c) * blockSize + 1, offY + (s.piece.y + r) * blockSize + 1, blockSize - 2, blockSize - 2)
            }
          })
        })
      }

      // HUD
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 15px monospace'
      ctx.fillText(`SCORE: ${s.score}`, 40, 40)

      animId = requestAnimationFrame(loop)
    }
    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <div className="relative flex flex-col items-center w-full">
      <canvas 
        ref={canvasRef} 
        width={700} 
        height={380} 
        className="w-full max-w-[700px] h-[340px] sm:h-[380px] rounded-2xl border border-white/10 bg-[#060714]"
      />
      {gameState !== 'playing' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-2xl space-y-4">
          <Grid size={36} className="text-purple-400" />
          <h3 className="text-2xl font-bold text-white font-display">
            {gameState === 'gameover' ? 'MATRIX FULL' : 'NEON BLOCK DROP'}
          </h3>
          <p className="text-xs text-slate-400">{gameState === 'gameover' ? `Score: ${score} PTS` : 'Use ARROWS / WASD to Rotate & Drop'}</p>
          <button onClick={startGame} className="px-6 py-2.5 rounded-full bg-purple-500 text-white font-bold text-xs uppercase cursor-pointer">
            {gameState === 'gameover' ? 'Play Again' : 'Start Tetrominoes'}
          </button>
        </div>
      )}
    </div>
  )
}

/* =========================================================================
   GAME 5: CYBER PONG VS AI
   ========================================================================= */
const CyberPongGame: React.FC<{ onScoreUpdate: (score: number) => void }> = ({ onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle')
  const [score, setScore] = useState(0)

  const stateRef = useRef({
    playerY: 150,
    aiY: 150,
    ballX: 350,
    ballY: 190,
    ballVx: 5,
    ballVy: 3,
    playerScore: 0,
    aiScore: 0,
    isRunning: false
  })

  const startGame = () => {
    stateRef.current = {
      playerY: 150,
      aiY: 150,
      ballX: 350,
      ballY: 190,
      ballVx: 5 * (Math.random() > 0.5 ? 1 : -1),
      ballVy: 3,
      playerScore: 0,
      aiScore: 0,
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
      const my = e.clientY - rect.top
      stateRef.current.playerY = Math.max(10, Math.min(canvas.height - 70, my - 35))
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
      ctx.fillStyle = '#060814'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Center Line
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'
      ctx.setLineDash([6, 6])
      ctx.beginPath()
      ctx.moveTo(canvas.width / 2, 0)
      ctx.lineTo(canvas.width / 2, canvas.height)
      ctx.stroke()
      ctx.setLineDash([])

      if (s.isRunning) {
        s.ballX += s.ballVx
        s.ballY += s.ballVy

        // AI Tracking
        const aiTarget = s.ballY - 35
        s.aiY += (aiTarget - s.aiY) * 0.08

        // Wall bounce
        if (s.ballY <= 10 || s.ballY >= canvas.height - 10) {
          s.ballVy *= -1
          arcadeAudio.playHit()
        }

        // Player Paddle Hit
        if (s.ballX <= 35 && s.ballY >= s.playerY && s.ballY <= s.playerY + 70) {
          s.ballVx = Math.abs(s.ballVx) * 1.05
          s.ballVy += (s.ballY - (s.playerY + 35)) * 0.1
          arcadeAudio.playLaser()
        }

        // AI Paddle Hit
        if (s.ballX >= canvas.width - 35 && s.ballY >= s.aiY && s.ballY <= s.aiY + 70) {
          s.ballVx = -Math.abs(s.ballVx) * 1.05
          arcadeAudio.playLaser()
        }

        // Score check
        if (s.ballX < 0) {
          s.aiScore++
          arcadeAudio.playExplosion()
          s.ballX = 350
          s.ballY = 190
          s.ballVx = 5
        } else if (s.ballX > canvas.width) {
          s.playerScore++
          s.ballX = 350
          s.ballY = 190
          s.ballVx = -5
          arcadeAudio.playCoin()
        }

        if (s.playerScore >= 7 || s.aiScore >= 7) {
          s.isRunning = false
          setGameState('gameover')
          arcadeAudio.playGameOver()
          onScoreUpdate(s.playerScore * 100)
        }
      }

      // Draw Player Paddle
      ctx.fillStyle = '#3b82f6'
      ctx.shadowBlur = 10
      ctx.shadowColor = '#3b82f6'
      ctx.fillRect(20, s.playerY, 12, 70)

      // Draw AI Paddle
      ctx.fillStyle = '#ef4444'
      ctx.shadowBlur = 10
      ctx.shadowColor = '#ef4444'
      ctx.fillRect(canvas.width - 32, s.aiY, 12, 70)

      // Draw Ball
      ctx.fillStyle = '#ffffff'
      ctx.shadowBlur = 12
      ctx.shadowColor = '#ffffff'
      ctx.beginPath()
      ctx.arc(s.ballX, s.ballY, 7, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // HUD
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 24px monospace'
      ctx.fillText(`${s.playerScore}`, canvas.width / 2 - 50, 40)
      ctx.fillText(`${s.aiScore}`, canvas.width / 2 + 35, 40)

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
        className="w-full max-w-[700px] h-[340px] sm:h-[380px] rounded-2xl border border-white/10 bg-[#060814]"
      />
      {gameState !== 'playing' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-2xl space-y-4">
          <CircleDot size={36} className="text-blue-400" />
          <h3 className="text-2xl font-bold text-white font-display">
            {gameState === 'gameover' ? 'MATCH FINISHED' : 'CYBER PONG VS AI'}
          </h3>
          <p className="text-xs text-slate-400">{gameState === 'gameover' ? `Match Result` : 'Move mouse up/down to deflect plasma ball'}</p>
          <button onClick={startGame} className="px-6 py-2.5 rounded-full bg-blue-500 text-white font-bold text-xs uppercase cursor-pointer">
            {gameState === 'gameover' ? 'Rematch' : 'Serve Ball'}
          </button>
        </div>
      )}
    </div>
  )
}

/* =========================================================================
   GAME 6: GALAXY DEFENDER
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
      if (e.key === 'ArrowLeft' || e.key === 'a') k.left = true
      if (e.key === 'ArrowRight' || e.key === 'd') k.right = true
      if (e.code === 'Space') {
        e.preventDefault()
        k.fire = true
        if (!stateRef.current.isRunning) startGame()
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      const k = stateRef.current.keys
      if (e.key === 'ArrowLeft' || e.key === 'a') k.left = false
      if (e.key === 'ArrowRight' || e.key === 'd') k.right = false
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
      ctx.fillStyle = '#050714'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (s.isRunning) {
        s.frameCount++
        if (s.keys.left && s.playerX > 25) s.playerX -= 6
        if (s.keys.right && s.playerX < canvas.width - 25) s.playerX += 6

        if (s.frameCount % 10 === 0) {
          if (s.tripleShotTimer > 0) {
            s.tripleShotTimer--
            s.bullets.push({ x: s.playerX - 10, y: s.playerY }, { x: s.playerX, y: s.playerY }, { x: s.playerX + 10, y: s.playerY })
          } else {
            s.bullets.push({ x: s.playerX, y: s.playerY })
          }
          arcadeAudio.playLaser()
        }

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

        for (let i = s.bullets.length - 1; i >= 0; i--) {
          s.bullets[i].y -= 10
          if (s.bullets[i].y < -10) s.bullets.splice(i, 1)
        }

        for (let i = s.enemies.length - 1; i >= 0; i--) {
          const e = s.enemies[i]
          e.y += e.type === 'elite' ? 2 : 2.5
          e.x += e.vx
          if (e.x < 20 || e.x > canvas.width - 20) e.vx *= -1

          for (let j = s.bullets.length - 1; j >= 0; j--) {
            const b = s.bullets[j]
            if (Math.hypot(b.x - e.x, b.y - e.y) < 22) {
              e.hp--
              s.bullets.splice(j, 1)
              arcadeAudio.playHit()
              if (e.hp <= 0) {
                s.score += e.type === 'elite' ? 250 : 100
                setScore(s.score)
                arcadeAudio.playExplosion()
                if (Math.random() > 0.8) s.powerups.push({ x: e.x, y: e.y, type: Math.random() > 0.5 ? 'triple' : 'shield' })
                s.enemies.splice(i, 1)
                break
              }
            }
          }

          if (e.y > canvas.height + 20) s.enemies.splice(i, 1)
          else if (Math.hypot(e.x - s.playerX, e.y - s.playerY) < 28) {
            s.enemies.splice(i, 1)
            if (s.hasShield) { s.hasShield = false; arcadeAudio.playHit() }
            else {
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
      }

      // Draw Bullets
      ctx.fillStyle = '#60a5fa'
      s.bullets.forEach(b => ctx.fillRect(b.x - 2, b.y, 4, 12))

      // Draw Enemies
      s.enemies.forEach(e => {
        ctx.fillStyle = e.type === 'elite' ? '#a855f7' : '#ef4444'
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.type === 'elite' ? 14 : 10, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw Ship
      ctx.fillStyle = '#10b981'
      ctx.beginPath()
      ctx.moveTo(s.playerX, s.playerY - 16)
      ctx.lineTo(s.playerX - 16, s.playerY + 14)
      ctx.lineTo(s.playerX + 16, s.playerY + 14)
      ctx.fill()

      // HUD
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 15px monospace'
      ctx.fillText(`SCORE: ${s.score}`, 20, 30)

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
          <Shield size={36} className="text-indigo-400" />
          <h3 className="text-2xl font-bold text-white font-display">
            {gameState === 'gameover' ? 'MISSION FAILED' : 'GALAXY DEFENDER'}
          </h3>
          <p className="text-xs text-slate-400">{gameState === 'gameover' ? `Score: ${score} PTS` : 'ARROWS to Move, Auto-fire Lasers'}</p>
          <button onClick={startGame} className="px-6 py-2.5 rounded-full bg-indigo-500 text-white font-bold text-xs uppercase cursor-pointer">
            {gameState === 'gameover' ? 'Play Again' : 'Launch Fighter'}
          </button>
        </div>
      )}
    </div>
  )
}

/* =========================================================================
   GAME 7: CYBER SNAKE 360
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
    score: 0,
    speedMs: 90,
    lastUpdate: 0,
    isRunning: false
  })

  const startGame = () => {
    stateRef.current = {
      snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }],
      dir: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      food: { x: 15, y: 10 },
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
    if (s.dir.x + dx !== 0 || s.dir.y + dy !== 0) s.nextDir = { x: dx, y: dy }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') changeDir(0, -1)
      if (e.key === 'ArrowDown' || e.key === 's') changeDir(0, 1)
      if (e.key === 'ArrowLeft' || e.key === 'a') changeDir(-1, 0)
      if (e.key === 'ArrowRight' || e.key === 'd') changeDir(1, 0)
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
      ctx.fillStyle = '#060914'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (s.isRunning && timestamp - s.lastUpdate > s.speedMs) {
        s.lastUpdate = timestamp
        s.dir = s.nextDir

        const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y }

        if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
          s.isRunning = false
          setGameState('gameover')
          arcadeAudio.playGameOver()
          onScoreUpdate(s.score)
        } else if (s.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
          s.isRunning = false
          setGameState('gameover')
          arcadeAudio.playGameOver()
          onScoreUpdate(s.score)
        } else {
          s.snake.unshift(head)
          if (head.x === s.food.x && head.y === s.food.y) {
            s.score += 100
            setScore(s.score)
            arcadeAudio.playCoin()
            s.food = { x: Math.floor(Math.random() * (cols - 2)) + 1, y: Math.floor(Math.random() * (rows - 2)) + 1 }
          } else {
            s.snake.pop()
          }
        }
      }

      // Draw Food
      ctx.fillStyle = '#06b6d4'
      ctx.beginPath()
      ctx.arc(s.food.x * gridSize + 10, s.food.y * gridSize + 10, 7, 0, Math.PI * 2)
      ctx.fill()

      // Draw Snake
      s.snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? '#22d3ee' : '#0891b2'
        ctx.fillRect(seg.x * gridSize + 2, seg.y * gridSize + 2, gridSize - 4, gridSize - 4)
      })

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
          <Activity size={36} className="text-cyan-400" />
          <h3 className="text-2xl font-bold text-white font-display">
            {gameState === 'gameover' ? 'GAME OVER' : 'CYBER SNAKE 360'}
          </h3>
          <p className="text-xs text-slate-400">{gameState === 'gameover' ? `Score: ${score} PTS` : 'ARROWS / WASD to Steer'}</p>
          <button onClick={startGame} className="px-6 py-2.5 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs uppercase cursor-pointer">
            {gameState === 'gameover' ? 'Play Again' : 'Start Snake'}
          </button>
        </div>
      )}
    </div>
  )
}

/* =========================================================================
   GAME 8: NEON BREAKOUT
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
    bricks: [] as { x: number; y: number; w: number; h: number; color: string }[],
    score: 0,
    lives: 3,
    isRunning: false
  })

  const initBricks = () => {
    const bricks = []
    const colors = ['#f43f5e', '#a855f7', '#3b82f6', '#10b981', '#f59e0b']
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 9; c++) {
        bricks.push({ x: c * 72 + 28, y: r * 22 + 45, w: 64, h: 16, color: colors[r] })
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
      ballVx: 4,
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

        if (s.ballX <= 8 || s.ballX >= canvas.width - 8) s.ballVx *= -1
        if (s.ballY <= 8) s.ballVy *= -1

        if (s.ballY + 8 >= 350 && s.ballY - 8 <= 362 && s.ballX >= s.paddleX && s.ballX <= s.paddleX + s.paddleW) {
          s.ballVy = -Math.abs(s.ballVy)
          s.ballVx = ((s.ballX - (s.paddleX + s.paddleW / 2)) / (s.paddleW / 2)) * 6
          arcadeAudio.playJump()
        }

        for (let i = s.bricks.length - 1; i >= 0; i--) {
          const b = s.bricks[i]
          if (s.ballX + 8 > b.x && s.ballX - 8 < b.x + b.w && s.ballY + 8 > b.y && s.ballY - 8 < b.y + b.h) {
            s.ballVy *= -1
            s.bricks.splice(i, 1)
            s.score += 50
            setScore(s.score)
            arcadeAudio.playCoin()
            break
          }
        }

        if (s.ballY > canvas.height + 20) {
          s.lives--
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
      }

      s.bricks.forEach(b => {
        ctx.fillStyle = b.color
        ctx.fillRect(b.x, b.y, b.w, b.h)
      })

      ctx.fillStyle = '#f43f5e'
      ctx.fillRect(s.paddleX, 350, s.paddleW, 12)

      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(s.ballX, s.ballY, 7, 0, Math.PI * 2)
      ctx.fill()

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
          <Flame size={36} className="text-pink-400" />
          <h3 className="text-2xl font-bold text-white font-display">
            {gameState === 'gameover' ? 'GAME OVER' : 'NEON BREAKOUT'}
          </h3>
          <p className="text-xs text-slate-400">{gameState === 'gameover' ? `Score: ${score} PTS` : 'Mouse / Drag to Deflect Ball'}</p>
          <button onClick={startGame} className="px-6 py-2.5 rounded-full bg-pink-500 text-white font-bold text-xs uppercase cursor-pointer">
            {gameState === 'gameover' ? 'Play Again' : 'Launch Ball'}
          </button>
        </div>
      )}
    </div>
  )
}

/* =========================================================================
   GAME 9: CYBER 2048
   ========================================================================= */
const Cyber2048Game: React.FC<{ onScoreUpdate: (score: number) => void }> = ({ onScoreUpdate }) => {
  const [grid, setGrid] = useState<number[][]>([[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]])
  const [score, setScore] = useState(0)

  const addRandomTile = (g: number[][]) => {
    const empty: { r: number; c: number }[] = []
    g.forEach((row, r) => row.forEach((val, c) => { if (val === 0) empty.push({ r, c }) }))
    if (empty.length > 0) {
      const { r, c } = empty[Math.floor(Math.random() * empty.length)]
      g[r][c] = Math.random() > 0.85 ? 4 : 2
    }
  }

  const initGame = () => {
    const newGrid = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
    addRandomTile(newGrid)
    addRandomTile(newGrid)
    setGrid(newGrid)
    setScore(0)
    arcadeAudio.playPowerup()
  }

  useEffect(() => { initGame() }, [])

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
      if (e.key === 'ArrowUp' || e.key === 'w') { e.preventDefault(); move('up') }
      if (e.key === 'ArrowDown' || e.key === 's') { e.preventDefault(); move('down') }
      if (e.key === 'ArrowLeft' || e.key === 'a') { e.preventDefault(); move('left') }
      if (e.key === 'ArrowRight' || e.key === 'd') { e.preventDefault(); move('right') }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [move])

  const getTileColor = (val: number) => {
    switch (val) {
      case 2: return 'bg-slate-800 text-slate-200'
      case 4: return 'bg-teal-950/80 text-teal-300'
      case 8: return 'bg-cyan-900/80 text-cyan-300'
      case 16: return 'bg-emerald-900/80 text-emerald-300'
      case 32: return 'bg-indigo-900/80 text-indigo-300'
      case 64: return 'bg-purple-900/80 text-purple-300'
      case 128: return 'bg-pink-900/80 text-pink-300'
      case 256: return 'bg-rose-900/80 text-rose-300'
      case 512: return 'bg-amber-900/80 text-amber-300'
      case 1024: return 'bg-amber-500 text-slate-950 font-extrabold'
      case 2048: return 'bg-gradient-to-r from-amber-400 to-rose-500 text-white font-extrabold'
      default: return 'bg-white/5 text-transparent'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-md space-y-4">
      <div className="flex items-center justify-between w-full">
        <div className="text-sm font-mono font-bold text-amber-400">SCORE: {score}</div>
        <button onClick={initGame} className="px-3 py-1 rounded-xl bg-white/10 text-xs font-mono text-white flex items-center gap-1 cursor-pointer">
          <RotateCcw size={13} /> Reset
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-900/90 border border-white/10 shadow-2xl w-full aspect-square">
        {grid.map((row, r) =>
          row.map((val, c) => (
            <div key={`${r}-${c}`} className={`rounded-xl flex items-center justify-center text-lg sm:text-2xl font-bold font-mono ${getTileColor(val)}`}>
              {val > 0 ? val : ''}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

/* =========================================================================
   GAME 10: MEMORY MATRIX
   ========================================================================= */
const MemoryMatrixGame: React.FC<{ onScoreUpdate: (score: number) => void }> = ({ onScoreUpdate }) => {
  const [sequence, setSequence] = useState<number[]>([])
  const [userStep, setUserStep] = useState(0)
  const [activePad, setActivePad] = useState<number | null>(null)
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'user_turn' | 'gameover'>('idle')
  const [score, setScore] = useState(0)

  const tones = [261.63, 329.63, 392.0, 523.25]

  const flashPad = (padIdx: number, duration: number = 300) => {
    setActivePad(padIdx)
    arcadeAudio.playTone(tones[padIdx], duration / 1000)
    setTimeout(() => setActivePad(null), duration)
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
    setTimeout(() => playSequence(firstSeq), 600)
  }

  const handlePadClick = (padIdx: number) => {
    if (gameState !== 'user_turn') return
    flashPad(padIdx, 250)

    if (sequence[userStep] === padIdx) {
      if (userStep + 1 === sequence.length) {
        const nextScore = (score + 1) * 100
        setScore(nextScore)
        onScoreUpdate(nextScore)
        const nextSeq = [...sequence, Math.floor(Math.random() * 4)]
        setSequence(nextSeq)
        setTimeout(() => playSequence(nextSeq), 800)
      } else {
        setUserStep(prev => prev + 1)
      }
    } else {
      setGameState('gameover')
      arcadeAudio.playGameOver()
      onScoreUpdate(score * 100)
    }
  }

  const pads = [
    { id: 0, color: 'from-emerald-500 to-teal-600', activeColor: 'bg-emerald-400' },
    { id: 1, color: 'from-indigo-500 to-blue-600', activeColor: 'bg-indigo-400' },
    { id: 2, color: 'from-amber-500 to-orange-600', activeColor: 'bg-amber-400' },
    { id: 3, color: 'from-pink-500 to-rose-600', activeColor: 'bg-pink-400' }
  ]

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-sm space-y-6">
      <div className="text-sm font-mono font-bold text-emerald-400">
        ROUND: {sequence.length} | SCORE: {score * 100}
      </div>
      <div className="grid grid-cols-2 gap-4 w-full aspect-square relative">
        {pads.map((p) => (
          <button
            key={p.id}
            onClick={() => handlePadClick(p.id)}
            disabled={gameState !== 'user_turn'}
            className={`rounded-3xl border border-white/20 transition-all ${
              activePad === p.id ? `${p.activeColor} shadow-2xl scale-95` : `bg-gradient-to-br ${p.color} opacity-70 hover:opacity-100`
            }`}
          />
        ))}
        {gameState !== 'showing' && gameState !== 'user_turn' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-sm rounded-3xl space-y-3 p-4">
            <Zap size={32} className="text-amber-400" />
            <h4 className="text-xl font-bold font-display text-white">
              {gameState === 'gameover' ? 'SEQUENCE BROKEN' : 'MEMORY MATRIX'}
            </h4>
            <button onClick={startGame} className="px-6 py-2 rounded-full bg-amber-500 text-slate-950 font-bold text-xs uppercase cursor-pointer">
              {gameState === 'gameover' ? 'Retry' : 'Start Sequence'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default GamesArcade
