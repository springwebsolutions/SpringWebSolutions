import React, { useState, useEffect } from 'react'
import {
  DollarSign, CheckCircle2, XCircle, AlertTriangle, Calculator,
  Sparkles, Trophy, HelpCircle, ArrowRight, ShieldCheck, Flame,
  Server, Database, Activity, RefreshCw, Layers, Cpu, Lock, Check,
  BookOpen, Code2, Play, RotateCcw
} from 'lucide-react'

// ─── 1. INTERACTIVE REMOTE COMPENSATION & SECTION 44ADA TAX CALCULATOR ────────
export const RemoteCompensationCalculator: React.FC = () => {
  const [monthlyUsd, setMonthlyUsd] = useState(5500)
  const exchangeRate = 86.5 // USD to INR exchange rate

  const annualUsd = monthlyUsd * 12
  const annualInr = annualUsd * exchangeRate

  // Section 44ADA: 50% presumptive business expenses deducted automatically
  const presumptiveTaxableIncome = annualInr * 0.5
  const section44adaTax = presumptiveTaxableIncome > 1500000 
    ? (presumptiveTaxableIncome - 1500000) * 0.30 + 150000 
    : presumptiveTaxableIncome * 0.15
  const section44adaInHand = annualInr - section44adaTax

  // Traditional Salaried employee with same gross
  const taxableSalaried = Math.max(0, annualInr - 75000)
  const salariedTax = taxableSalaried > 1500000 
    ? (taxableSalaried - 1500000) * 0.30 + 150000 
    : taxableSalaried * 0.20
  const salariedInHand = annualInr - salariedTax

  const taxSaved = salariedTax - section44adaTax

  return (
    <div className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0a0f1d] via-[#060913] to-[#04060c] border border-emerald-500/30 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider font-mono">
            <Calculator size={13} />
            <span>Interactive Tool: Global Contractor Net Calculator</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-display mt-2">
            Remote USD Income vs. Section 44ADA Tax Arbitrage
          </h3>
          <p className="text-xs text-slate-400 font-light mt-1">
            Slide your target remote monthly retainer to see real in-hand cash flow in Tier-2/3 India.
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[11px] text-slate-500 font-mono block">USD/INR Peg</span>
          <span className="text-sm font-bold text-emerald-400 font-mono">₹{exchangeRate} / $1 USD</span>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="space-y-3 bg-white/[0.02] p-5 rounded-2xl border border-white/5">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-semibold text-slate-200">
            Target Monthly US/EU Retainer:
          </label>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            ${monthlyUsd.toLocaleString()} / mo
          </span>
        </div>
        <input
          type="range"
          min={2000}
          max={15000}
          step={250}
          value={monthlyUsd}
          onChange={(e) => setMonthlyUsd(Number(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
        />
        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
          <span>$2,000 (~₹1.7L/mo)</span>
          <span>$7,500 (~₹6.5L/mo)</span>
          <span>$15,000 (~₹13L/mo)</span>
        </div>
      </div>

      {/* Results Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-[#03060f] border border-white/10 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Gross Annual CTC</span>
          <span className="text-xl sm:text-2xl font-black text-white font-mono block">
            ₹{(annualInr / 100000).toFixed(2)} Lakhs
          </span>
          <span className="text-[11px] text-slate-500 font-mono">(${annualUsd.toLocaleString()} USD / yr)</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Sec 44ADA Net In-Hand</span>
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-mono">50% Legal Shield</span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-emerald-300 font-mono block">
            ₹{(section44adaInHand / 100000).toFixed(2)} Lakhs
          </span>
          <span className="text-[11px] text-emerald-400/80 font-mono block">
            ~₹{(section44adaInHand / 1200000).toFixed(2)} L/month pure post-tax
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#03060f] border border-white/10 space-y-1">
          <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider block">Tax Saved vs Metro Salaried</span>
          <span className="text-xl sm:text-2xl font-black text-teal-300 font-mono block">
            +₹{(taxSaved / 100000).toFixed(2)} Lakhs
          </span>
          <span className="text-[11px] text-slate-500 font-mono">Extra cash left in your bank</span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-300 leading-relaxed">
        <strong className="text-emerald-400">The Udumalpet / Tier-2 Advantage:</strong> Earning $5,500/mo in Bangalore or Gurgaon typically leaves only ~₹1.8L after 30% TDS, ₹65,000 apartment rent, and metro living costs. Earning that same $5,500 in Udumalpet or Coimbatore under Section 44ADA yields ₹3.7L+ net savings every single month—enabling you to purchase land and achieve financial independence 10 years faster.
      </div>
    </div>
  )
}

// ─── 2. BYTEBYTEGO-STYLE SYSTEM DESIGN NAPKIN MATH CALCULATOR ─────────────────
export const SystemDesignNapkinCalculator: React.FC = () => {
  const [dau, setDau] = useState(5) // in Millions
  const [reqPerUser, setReqPerUser] = useState(40)
  const [readRatio, setReadRatio] = useState(10) // 10:1 Read to Write
  const [payloadKb, setPayloadKb] = useState(10) // Average payload KB

  // Calculations
  const totalDailyRequests = dau * 1000000 * reqPerUser
  const avgQps = Math.round(totalDailyRequests / 86400)
  const peakQps = avgQps * 3 // 3x multiplier for peak hours

  const writeQps = Math.round(avgQps / (readRatio + 1))
  const readQps = avgQps - writeQps

  const dailyIngestedGb = (totalDailyRequests * (1 / (readRatio + 1)) * payloadKb) / (1024 * 1024)
  const fiveYearStorageTb = (dailyIngestedGb * 365 * 5 * 3) / 1024 // 3x replication factor

  // 20% Pareto Rule for In-Memory Caching (Redis)
  const dailyReadVolumeGb = (totalDailyRequests * (readRatio / (readRatio + 1)) * payloadKb) / (1024 * 1024)
  const cacheRamGb = Math.round(dailyReadVolumeGb * 0.2)

  // Network Bandwidth in Mbps
  const networkMbps = Math.round((avgQps * payloadKb * 8) / 1024)

  // Architecture Tier recommendation
  const getArchTier = () => {
    if (peakQps < 1500) {
      return {
        tier: 'Tier 1: Single Robust Node',
        spec: 'PostgreSQL (16GB RAM) + Next.js App Cluster',
        cost: '~$80 - $200 / mo',
        badge: 'Low Complexity'
      }
    }
    if (peakQps < 10000) {
      return {
        tier: 'Tier 2: Read-Replicas & Caching',
        spec: 'Primary Postgres + 2 Read Replicas + Redis Cluster + Cloudflare CDN',
        cost: '~$450 - $1,200 / mo',
        badge: 'Intermediate'
      }
    }
    return {
      tier: 'Tier 3: Distributed Sharding & Event Streaming',
      spec: 'Database Sharding (Citus/Vitess) + Kafka Event Bus + Multi-region Redis',
      cost: '~$2,500 - $8,000+ / mo',
      badge: 'High Concurrency'
    }
  }

  const arch = getArchTier()

  return (
    <div className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#060c1c] via-[#040813] to-[#02050b] border border-cyan-500/30 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider font-mono">
            <Cpu size={13} />
            <span>ByteByteGo Interactive: Napkin Math Capacity Planner</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-display mt-2">
            System Design Sizing: From QPS to Storage & RAM
          </h3>
          <p className="text-xs text-slate-400 font-light mt-1">
            Simulate system scale to calculate backend IOPS, Redis memory buffers, and multi-year disk volume.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono shrink-0">
          Peak Multiplier: 3x
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-5 rounded-2xl border border-white/5">
        
        {/* Slider 1: DAU */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-slate-200">
            <span>Daily Active Users (DAU):</span>
            <span className="font-mono font-bold text-cyan-400">{dau} Million Users</span>
          </div>
          <input
            type="range"
            min={1}
            max={50}
            step={1}
            value={dau}
            onChange={(e) => setDau(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>1M</span>
            <span>25M</span>
            <span>50M</span>
          </div>
        </div>

        {/* Slider 2: Requests per user */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-slate-200">
            <span>Requests / User / Day:</span>
            <span className="font-mono font-bold text-cyan-400">{reqPerUser} requests</span>
          </div>
          <input
            type="range"
            min={10}
            max={200}
            step={10}
            value={reqPerUser}
            onChange={(e) => setReqPerUser(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>10 reqs</span>
            <span>100 reqs</span>
            <span>200 reqs</span>
          </div>
        </div>

        {/* Slider 3: Read to Write Ratio */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-slate-200">
            <span>Read-to-Write Ratio:</span>
            <span className="font-mono font-bold text-cyan-400">{readRatio}:1 ({(100 / (readRatio + 1)).toFixed(0)}% Writes)</span>
          </div>
          <input
            type="range"
            min={1}
            max={50}
            step={1}
            value={readRatio}
            onChange={(e) => setReadRatio(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>1:1 (Equal)</span>
            <span>10:1 (Typical API)</span>
            <span>50:1 (Read-Heavy)</span>
          </div>
        </div>

        {/* Slider 4: Payload Size */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-slate-200">
            <span>Avg Request Payload:</span>
            <span className="font-mono font-bold text-cyan-400">{payloadKb} KB</span>
          </div>
          <input
            type="range"
            min={1}
            max={100}
            step={5}
            value={payloadKb}
            onChange={(e) => setPayloadKb(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>1 KB (JSON)</span>
            <span>50 KB</span>
            <span>100 KB (Payload)</span>
          </div>
        </div>

      </div>

      {/* Napkin Math Output Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#020713] border border-white/10 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Peak QPS</span>
          <span className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">
            {peakQps.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 font-mono block">Avg: {avgQps.toLocaleString()} QPS</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#020713] border border-white/10 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Redis Cache RAM</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            {cacheRamGb} GB
          </span>
          <span className="text-[10px] text-slate-500 font-mono block">20% Pareto buffer</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#020713] border border-white/10 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">5-Year Storage</span>
          <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
            {fiveYearStorageTb.toFixed(1)} TB
          </span>
          <span className="text-[10px] text-slate-500 font-mono block">With 3x replica factor</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#020713] border border-white/10 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Egress Bandwidth</span>
          <span className="text-xl sm:text-2xl font-black text-purple-300 font-mono">
            {networkMbps > 1000 ? `${(networkMbps / 1000).toFixed(2)} Gbps` : `${networkMbps} Mbps`}
          </span>
          <span className="text-[10px] text-slate-500 font-mono block">Continuous throughput</span>
        </div>
      </div>

      {/* Recommended Architecture Box */}
      <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-cyan-500 text-slate-950">
              {arch.badge}
            </span>
            <span className="text-sm font-bold text-white font-display">{arch.tier}</span>
          </div>
          <p className="text-xs text-slate-300 font-mono">{arch.spec}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[11px] text-slate-500 block">Est. Infrastructure Cost</span>
          <span className="text-sm font-bold text-emerald-400 font-mono">{arch.cost}</span>
        </div>
      </div>
    </div>
  )
}

// ─── 3. INTERACTIVE TOKEN BUCKET RATE LIMITER SIMULATOR ───────────────────────
export const InteractiveTokenBucketSimulator: React.FC = () => {
  const [capacity, setCapacity] = useState(20)
  const [refillRate, setRefillRate] = useState(5) // tokens per sec
  const [tokens, setTokens] = useState(20)
  const [incomingRate, setIncomingRate] = useState(8) // requests per sec
  const [acceptedCount, setAcceptedCount] = useState(0)
  const [droppedCount, setDroppedCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  // Simulation tick
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      // 1. Refill tokens
      setTokens(prev => Math.min(capacity, prev + (refillRate * 0.2)))

      // 2. Consume incoming requests
      const incomingThisTick = incomingRate * 0.2
      setTokens(prev => {
        if (prev >= incomingThisTick) {
          setAcceptedCount(c => c + Math.round(incomingThisTick))
          return prev - incomingThisTick
        } else {
          const accepted = Math.floor(prev)
          const dropped = Math.round(incomingThisTick - accepted)
          setAcceptedCount(c => c + accepted)
          setDroppedCount(d => d + Math.max(1, dropped))
          return 0
        }
      })
    }, 200)

    return () => clearInterval(interval)
  }, [isRunning, capacity, refillRate, incomingRate])

  const handleReset = () => {
    setIsRunning(false)
    setTokens(capacity)
    setAcceptedCount(0)
    setDroppedCount(0)
  }

  const fillPercentage = Math.min(100, Math.max(0, (tokens / capacity) * 100))

  return (
    <div className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#140b08] via-[#0d0705] to-[#04060c] border border-amber-500/30 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider font-mono">
            <Activity size={13} />
            <span>Interactive Simulator: Token Bucket Rate Limiter</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-display mt-2">
            Simulate Traffic Bursts & HTTP 429 Drops
          </h3>
          <p className="text-xs text-slate-400 font-light mt-1">
            See why Redis Token Bucket algorithms protect payment gateways and high-concurrency APIs from crashing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isRunning 
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' 
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
            }`}
          >
            <Play size={14} className={isRunning ? 'fill-slate-950' : ''} />
            <span>{isRunning ? 'Pause Traffic' : 'Start Simulation'}</span>
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-colors"
            title="Reset Counters"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Visual Token Tank Display */}
      <div className="p-6 rounded-2xl bg-[#050302] border border-white/10 space-y-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Current Bucket Fill:</span>
          <span className="text-amber-400 font-bold">{tokens.toFixed(1)} / {capacity} Tokens ({fillPercentage.toFixed(0)}%)</span>
        </div>

        {/* Visual Progress Bar simulating Token Level */}
        <div className="w-full h-8 bg-slate-900 rounded-xl overflow-hidden border border-white/10 relative">
          <div
            className="h-full transition-all duration-200 bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-400"
            style={{ width: `${fillPercentage}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[11px] font-mono font-bold text-white tracking-widest drop-shadow-md">
            {tokens < 3 ? 'BUCKET EXHAUSTED (DROPPING)' : 'AVAILABLE TOKEN BUFFER'}
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              <span>Accepted 200 OK:</span>
            </span>
            <span className="text-lg font-black text-emerald-400 font-mono">{acceptedCount}</span>
          </div>

          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
            <span className="text-xs font-mono text-rose-300 flex items-center gap-1.5">
              <XCircle size={14} />
              <span>Dropped 429 Too Many:</span>
            </span>
            <span className="text-lg font-black text-rose-400 font-mono">{droppedCount}</span>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white/[0.02] p-5 rounded-2xl border border-white/5">
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-slate-200">
            <span>Bucket Capacity:</span>
            <span className="font-mono font-bold text-amber-400">{capacity} tokens</span>
          </div>
          <input
            type="range"
            min={10}
            max={50}
            step={5}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <span className="text-[10px] text-slate-500 block">Max allowed burst volume</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-slate-200">
            <span>Refill Rate:</span>
            <span className="font-mono font-bold text-emerald-400">+{refillRate} tokens/sec</span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={refillRate}
            onChange={(e) => setRefillRate(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <span className="text-[10px] text-slate-500 block">Tokens added back per second</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-slate-200">
            <span>Incoming Traffic Burst:</span>
            <span className="font-mono font-bold text-rose-400">{incomingRate} req/sec</span>
          </div>
          <input
            type="range"
            min={1}
            max={35}
            step={1}
            value={incomingRate}
            onChange={(e) => setIncomingRate(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <span className="text-[10px] text-slate-500 block">Simulated incoming user requests</span>
        </div>

      </div>

      <div className="text-xs text-slate-400 font-mono bg-white/[0.02] p-4 rounded-xl border border-white/5 leading-relaxed">
        <strong className="text-amber-400">Production Takeaway:</strong> Notice how increasing the traffic burst beyond the refill rate empties the bucket in seconds. In production Redis architecture, this check is executed in a single atomic <code className="text-emerald-300">EVAL</code> Lua script to avoid race conditions across distributed microservices.
      </div>
    </div>
  )
}

// ─── 4. JUNIOR VS STAFF ARCHITECT CODE DIFF EXPLORER ──────────────────────────
export const ArchitectCodeDiffViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'concurrency' | 'database' | 'resilience' | 'ai'>('concurrency')

  const codeData = {
    concurrency: {
      title: 'Handling 10,000 Concurrent Webhook Requests',
      juniorTitle: 'Junior / Tutorial Approach (Unbounded Memory Crash)',
      juniorCode: `// ❌ JUNIOR: Fires all promises simultaneously without backpressure
app.post('/api/webhook-batch', async (req, res) => {
  const orders = req.body.orders; // 10,000 items
  
  // CRASH: Node.js event loop runs out of memory (OOM)
  // Database connection pool immediately throws ECONNREFUSED
  const results = await Promise.all(
    orders.map(order => processPayment(order))
  );
  
  res.json({ success: true, count: results.length });
});`,
      seniorTitle: 'Staff Architect Approach (BullMQ + Worker Pool + Backpressure)',
      seniorCode: `// ✅ STAFF ARCHITECT: Durable queue + Concurrency Pool + Rate Limited
import { Queue } from 'bullmq';

const paymentQueue = new Queue('payments', { connection: redisClient });

app.post('/api/webhook-batch', async (req, res) => {
  const { orders } = orderBatchSchema.parse(req.body);
  
  // Fast 202 Accepted: Ingest to Redis within 8ms
  await paymentQueue.addBulk(
    orders.map(o => ({ name: 'process-order', data: o, opts: { attempts: 3, backoff: { type: 'exponential', delay: 1000 } } }))
  );
  
  // Workers scale independently with concurrency: 25
  res.status(202).json({ status: 'queued', batchSize: orders.length });
});`
    },
    database: {
      title: 'Preventing Double-Spending During Flash Sales',
      juniorTitle: 'Junior Approach (Race Condition Double-Spend Vulnerability)',
      juniorCode: `// ❌ JUNIOR: Read-then-write race condition
async function buyProduct(userId, productId) {
  const product = await db.products.findUnique({ where: { id: productId } });
  
  if (product.stock > 0) {
    // RACE: 50 requests reach here simultaneously before stock decreases!
    // Result: 50 orders sold for 1 remaining item!
    await db.orders.create({ data: { userId, productId } });
    await db.products.update({ where: { id: productId }, data: { stock: product.stock - 1 } });
    return { success: true };
  }
  throw new Error("Out of stock");
}`,
      seniorTitle: 'Staff Architect Approach (Atomic Conditional Decrement & Row Lock)',
      seniorCode: `// ✅ STAFF ARCHITECT: Single atomic SQL statement with WHERE stock > 0
async function buyProduct(userId, productId) {
  return await prisma.$transaction(async (tx) => {
    // Atomic test-and-set: Decrement ONLY if stock > 0 at that exact millisecond
    const updated = await tx.$executeRaw\`
      UPDATE "Product" 
      SET stock = stock - 1, updated_at = NOW()
      WHERE id = \${productId} AND stock > 0
    \`;

    if (updated === 0) {
      throw new OutOfStockError("Item sold out during checkout lock");
    }

    return await tx.order.create({ data: { userId, productId, status: 'CONFIRMED' } });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead });
}`
    },
    database_n1: {
      title: 'Optimizing N+1 Database Loops',
      juniorTitle: 'Junior Approach (400 Database Queries for 1 Page)',
      juniorCode: `// ❌ JUNIOR: Fires a separate SQL query inside every loop iteration
const users = await db.users.findMany(); // 1 query
for (const user of users) {
  // N queries! 100 users = 101 round trips to PostgreSQL!
  user.posts = await db.posts.findMany({ where: { authorId: user.id } });
}`,
      seniorTitle: 'Staff Architect Approach (Dataloader Batching / SQL JOIN)',
      seniorCode: `// ✅ STAFF ARCHITECT: Single query using SQL JOIN or CTE
const usersWithPosts = await db.users.findMany({
  include: {
    posts: {
      select: { id: true, title: true, createdAt: true },
      take: 5
    }
  }
}); // Exactly 1 optimized SQL query executed!`
    },
    resilience: {
      title: '3rd-Party API Failure (Stripe/Payment Gateway Down)',
      juniorTitle: 'Junior Approach (Uncaught Hanging Thread / Cascading Failure)',
      juniorCode: `// ❌ JUNIOR: Hangs forever when third-party provider experiences downtime
async function chargeCustomer(customerId, amount) {
  // No timeout! If Stripe takes 60 seconds to answer,
  // all web server threads block until the entire application crashes.
  const response = await fetch('https://api.stripe.com/v1/charges', {
    method: 'POST',
    body: JSON.stringify({ customerId, amount })
  });
  return await response.json();
}`,
      seniorTitle: 'Staff Architect Approach (AbortController Timeout + Circuit Breaker)',
      seniorCode: `// ✅ STAFF ARCHITECT: 2.5s Timeout + Exponential Backoff with Jitter
async function chargeCustomerWithBreaker(customerId, amount) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500); // 2.5s strict SLA

  try {
    return await circuitBreaker.fire(async () => {
      const res = await fetch('https://api.stripe.com/v1/charges', {
        signal: controller.signal,
        headers: { 'Idempotency-Key': generateUUID() } // Prevent duplicate charges
      });
      return await res.json();
    });
  } finally {
    clearTimeout(timeout);
  }
}`
    },
    ai: {
      title: 'Production LLM Guardrails & Hallucination Defense',
      juniorTitle: 'Junior Approach (Raw Unvalidated String Output)',
      juniorCode: `// ❌ JUNIOR: Assumes LLM will always return valid JSON
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Give me user JSON data' }]
});

// CRASH: When LLM outputs "Sure, here is your JSON: '''json..."
// JSON.parse throws SyntaxError in production!
const data = JSON.parse(response.choices[0].message.content);`,
      seniorTitle: 'Staff Architect Approach (Structured Outputs + Zod Schema Fallback)',
      seniorCode: `// ✅ STAFF ARCHITECT: Guaranteed JSON Schema Enforcement + Fallback Model
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

const UserResponseSchema = z.object({
  userId: z.string().uuid(),
  tier: z.enum(['FREE', 'PRO', 'ENTERPRISE']),
  confidenceScore: z.number().min(0).max(1)
});

const completion = await openai.beta.chat.completions.parse({
  model: 'gpt-4o-2024-08-06',
  response_format: zodResponseFormat(UserResponseSchema, 'user_analysis'),
  max_tokens: 500,
  temperature: 0.1 // Deterministic low entropy for production
});

// 100% type-safe parsed payload guaranteed by OpenAI grammar engine
const validatedData = completion.choices[0].message.parsed;`
    }
  }

  const active = codeData[activeTab]

  return (
    <div className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#080d1a] via-[#050812] to-[#030509] border border-indigo-500/30 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider font-mono">
            <Code2 size={13} />
            <span>Interactive Code Inspector: Junior vs. Staff Architect</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-display mt-2">
            Production Code Invariants: What Makes Code Staff-Grade?
          </h3>
          <p className="text-xs text-slate-400 font-light mt-1">
            Compare fragile tutorial-style code with resilient, high-concurrency production implementations.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'concurrency', label: '1. Concurrency (10k RPS)' },
          { id: 'database', label: '2. Race Conditions' },
          { id: 'resilience', label: '3. API Circuit Breaker' },
          { id: 'ai', label: '4. Production LLM Guardrail' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <h4 className="text-sm font-bold text-slate-200 font-display flex items-center gap-2">
        <Sparkles size={14} className="text-indigo-400" />
        <span>Scenario: {active.title}</span>
      </h4>

      {/* Code Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Junior Box */}
        <div className="rounded-2xl border border-rose-500/30 bg-[#070304] overflow-hidden flex flex-col justify-between">
          <div className="px-4 py-2.5 bg-rose-500/10 border-b border-rose-500/20 flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-rose-400 flex items-center gap-1.5">
              <XCircle size={13} />
              <span>{active.juniorTitle}</span>
            </span>
            <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono">Tutorial Hell</span>
          </div>
          <pre className="p-4 text-xs font-mono text-rose-200/90 leading-relaxed overflow-x-auto flex-grow bg-black/40">
            <code>{active.juniorCode}</code>
          </pre>
        </div>

        {/* Staff Architect Box */}
        <div className="rounded-2xl border border-emerald-500/40 bg-[#020704] overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="px-4 py-2.5 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={13} />
              <span>{active.seniorTitle}</span>
            </span>
            <span className="text-[10px] bg-emerald-500 text-slate-950 font-extrabold px-2 py-0.5 rounded font-mono">Top 1% Tier</span>
          </div>
          <pre className="p-4 text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto flex-grow bg-black/40">
            <code>{active.seniorCode}</code>
          </pre>
        </div>

      </div>
    </div>
  )
}

// ─── 5. INTERACTIVE FLASHCARD STUDY DECK (ByteByteGo & Interview Style) ───────
export const InteractiveFlashcardsDeck: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [masteredCount, setMasteredCount] = useState(0)

  const cards = [
    {
      category: 'Distributed Systems',
      question: 'What is Split-Brain in a distributed cluster and how is it prevented?',
      answer: 'Split-Brain occurs when network partitioning divides a cluster into two isolated sub-clusters, each believing the other is dead and electing its own leader, resulting in concurrent divergent data writes. It is prevented by enforcing Quorum consensus (Q = N/2 + 1) with odd node counts (e.g. Raft/Paxos).'
    },
    {
      category: 'Database Internals',
      question: 'Why does PostgreSQL use a Write-Ahead Log (WAL) before updating disk pages?',
      answer: 'Disk writes to random B-tree pages are slow. WAL appends transaction changes sequentially to an append-only log file on disk first (O(1) sequential I/O). Once the WAL entry is flushed (fsync), the transaction is guaranteed ACID durable even if power cuts immediately.'
    },
    {
      category: 'High Concurrency',
      question: 'What is the "Thundering Herd" cache problem and what are the two production solutions?',
      answer: 'When a popular cached key (e.g., flash sale inventory) expires, thousands of concurrent requests miss the cache simultaneously and slam the database. Solutions: 1) Mutex locking (only 1 thread regenerates cache, others wait); 2) Probabilistic early expiration (XFetch algorithm recalculates cache before hard TTL).'
    },
    {
      category: 'AI Engineering',
      question: 'Why is Chunk Overlap critical in RAG vector retrieval pipelines?',
      answer: 'Splitting text into discrete chunks (e.g., 500 tokens) risks cutting crucial sentences in half right at the boundary. Chunk Overlap (e.g., 50-100 tokens) ensures semantic continuity is preserved across chunks so embeddings capture complete thoughts.'
    },
    {
      category: 'DevOps & SRE',
      question: 'What is the mathematical difference between P95 and P99 latency?',
      answer: 'P95 latency is the threshold under which 95% of requests complete. P99 measures the slowest 1% tail latency. Because a single web page often triggers 40+ microservice queries, a 1% failure or delay rate (P99) affects over 33% of end users!'
    }
  ]

  const current = cards[currentIndex]

  const handleNext = (mastered: boolean) => {
    if (mastered) setMasteredCount(c => c + 1)
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % cards.length)
  }

  return (
    <div className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0b0c16] to-[#04060c] border border-purple-500/30 shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <span className="text-[11px] font-mono text-purple-400 font-bold uppercase tracking-wider block">
            Technical Interview Trainer
          </span>
          <h3 className="text-xl font-bold text-white font-display mt-1">
            System Design & Architecture Flashcards
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-purple-300">
            Card {currentIndex + 1} of {cards.length}
          </span>
          <div className="text-[11px] text-slate-500 font-mono">Mastered: {masteredCount}</div>
        </div>
      </div>

      {/* Flip Card Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="min-h-[200px] p-8 rounded-2xl bg-[#030408] border border-white/10 hover:border-purple-500/40 transition-all cursor-pointer flex flex-col justify-between shadow-inner relative group"
      >
        <div className="flex items-center justify-between text-xs">
          <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-[10px] font-bold uppercase">
            {current.category}
          </span>
          <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1 group-hover:text-purple-400 transition-colors">
            <RefreshCw size={12} />
            <span>Click card to {isFlipped ? 'see question' : 'reveal answer'}</span>
          </span>
        </div>

        <div className="py-6 text-center">
          {!isFlipped ? (
            <div className="space-y-2">
              <span className="text-xs text-slate-500 uppercase tracking-widest font-mono">Question</span>
              <p className="text-base sm:text-lg font-bold text-white leading-relaxed font-display">
                {current.question}
              </p>
            </div>
          ) : (
            <div className="space-y-2 animate-fade-in">
              <span className="text-xs text-emerald-400 uppercase tracking-widest font-mono font-bold">Senior Architect Answer</span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans font-light">
                {current.answer}
              </p>
            </div>
          )}
        </div>

        <div className="text-[10px] text-slate-600 text-center font-mono">
          Tap anywhere to flip card
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={() => handleNext(false)}
          className="w-1/2 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
        >
          Review Later
        </button>
        <button
          onClick={() => handleNext(true)}
          className="w-1/2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/20 cursor-pointer"
        >
          I Knew This (+1 Mastered)
        </button>
      </div>
    </div>
  )
}

// ─── 6. INTERACTIVE READINESS DIAGNOSTIC CHECKLIST ────────────────────────────
export const ArchitectureReadinessChecklist: React.FC<{ guideSlug: string }> = ({ guideSlug }) => {
  const getItemsForSlug = (slug: string) => {
    if (slug.includes('devops')) {
      return [
        { id: '1', text: 'I write multi-stage Dockerfiles with non-root distroless base images' },
        { id: '2', text: 'I configure Kubernetes PodDisruptionBudgets and HPA metrics' },
        { id: '3', text: 'I store cloud state in encrypted remote Terraform S3 backends with DynamoDB locking' },
        { id: '4', text: 'I set up Prometheus alertmanager rules with P99 SLO thresholds' },
        { id: '5', text: 'I implement zero-downtime Canary or Blue/Green deployments via ArgoCD' }
      ]
    }
    if (slug.includes('system-design')) {
      return [
        { id: '1', text: 'I can calculate napkin-math QPS, storage, and bandwidth in under 3 minutes' },
        { id: '2', text: 'I design Redis cache-aside patterns with mutex locking to stop thundering herds' },
        { id: '3', text: 'I implement database sharding using consistent hashing rings' },
        { id: '4', text: 'I use Kafka consumer groups with dead-letter queues (DLQ) for guaranteed delivery' },
        { id: '5', text: 'I design idempotent APIs using unique idempotency keys in Redis' }
      ]
    }
    if (slug.includes('ai-engineering')) {
      return [
        { id: '1', text: 'I implement semantic sliding-window text chunking with token overlap' },
        { id: '2', text: 'I write SQL hybrid search queries combining pgvector cosine distance + BM25 text rank' },
        { id: '3', text: 'I enforce structured schema parsing using Zod models with low temperature' },
        { id: '4', text: 'I build autonomous agent workflows using LangGraph state machines' },
        { id: '5', text: 'I implement prompt caching and token cost guardrails in production' }
      ]
    }
    if (slug.includes('remote')) {
      return [
        { id: '1', text: 'I maintain a polished GitHub portfolio with live production demos on custom domains' },
        { id: '2', text: 'I write structured asynchronous RFC design docs rather than relying on Slack chats' },
        { id: '3', text: 'I have an active GST registration and filed an LUT (Letter of Undertaking) for 0% export' },
        { id: '4', text: 'I receive USD international inward remittances with automatic digital FIRC certificates' },
        { id: '5', text: 'I file taxes under Section 44ADA with a 50% legal expense deduction shield' }
      ]
    }
    return [
      { id: '1', text: 'I write strict TypeScript without using "any" or loose type assertions' },
      { id: '2', text: 'I understand React 19 Server Components vs Client boundary hydration' },
      { id: '3', text: 'I write composite PostgreSQL B-Tree indexes and analyze EXPLAIN ANALYZE query plans' },
      { id: '4', text: 'I execute atomic multi-row transactions with row-level locking to prevent race conditions' },
      { id: '5', text: 'I implement rate limiting and optimistic UI mutations with rollback states' }
    ]
  }

  const items = getItemsForSlug(guideSlug)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  const toggleItem = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const checkedCount = Object.values(checkedItems).filter(Boolean).length
  const scorePercent = Math.round((checkedCount / items.length) * 100)

  const getRank = () => {
    if (scorePercent === 100) return { title: 'Staff Production Architect', color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
    if (scorePercent >= 60) return { title: 'Senior Production Engineer', color: 'text-cyan-400', bg: 'bg-cyan-500/10' }
    if (scorePercent >= 40) return { title: 'Mid-Level Developer', color: 'text-amber-400', bg: 'bg-amber-500/10' }
    return { title: 'Junior / Tutorial Trainee', color: 'text-rose-400', bg: 'bg-rose-500/10' }
  }

  const rank = getRank()

  return (
    <div className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#070d18] to-[#03060c] border border-emerald-500/30 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider font-mono">
            <Trophy size={13} />
            <span>Interactive Diagnostic: Production Readiness Checklist</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-display mt-2">
            Where Do You Rank Against Senior Engineers?
          </h3>
          <p className="text-xs text-slate-400 font-light mt-1">
            Check off the capabilities you have personally shipped to production in real client codebases.
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[11px] text-slate-500 font-mono block">Current Score</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">{scorePercent}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-white/5">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
          style={{ width: `${scorePercent}%` }}
        />
      </div>

      {/* Checklist items */}
      <div className="space-y-3">
        {items.map((item) => {
          const isChecked = !!checkedItems[item.id]
          return (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                isChecked
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                  : 'bg-white/[0.02] border-white/5 text-slate-300 hover:bg-white/5 hover:border-white/10'
              }`}
            >
              <span className={`h-5 w-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                isChecked
                  ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                  : 'border-white/20 bg-white/5 text-transparent'
              }`}>
                <Check size={13} strokeWidth={3} />
              </span>
              <span className="text-xs sm:text-sm font-medium leading-relaxed">
                {item.text}
              </span>
            </button>
          )
        })}
      </div>

      {/* Rank Verdict Card */}
      <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${rank.bg} border-white/10`}>
        <div className="space-y-0.5">
          <span className="text-[11px] text-slate-400 font-mono block">Assessed Industry Level:</span>
          <h4 className={`text-base sm:text-lg font-black font-display ${rank.color}`}>
            {rank.title}
          </h4>
        </div>
        <div className="text-right text-xs font-mono text-slate-300">
          {checkedCount} / {items.length} Production Invariants Met
        </div>
      </div>
    </div>
  )
}

// ─── 7. SENIOR ARCHITECT SCENARIO QUIZ ────────────────────────────────────────
export const SeniorArchitectScenarioQuiz: React.FC<{ guideSlug: string }> = ({ guideSlug }) => {
  const getScenarioForSlug = (slug: string) => {
    if (slug.includes('devops')) {
      return {
        title: 'Production Incident: Pod Eviction Cascade During Traffic Surge',
        situation: 'At 01:45 AM, your Kubernetes cluster experiences a 4x sudden ingress traffic surge. Your worker pods suddenly start getting terminated with OOMKilled status. As pods die, remaining pods take more traffic and also get evicted in a rapid domino effect.',
        question: 'What is the root cause and the immediate production mitigation?',
        options: [
          {
            text: 'Increase container memory limits without requests, and restart the deployment',
            correct: false,
            explanation: 'Setting unbounded limits allows pods to starve the underlying EC2/Kubelet node memory, causing the whole node to become NotReady.'
          },
          {
            text: 'Set realistic memory requests = limits, define a PodDisruptionBudget (PDB), and configure Horizontal Pod Autoscaler (HPA) to scale on CPU/Memory thresholds before reaching 75%',
            correct: true,
            explanation: 'Guaranteed QoS (requests = limits) prevents node memory starvation, while PDB guarantees a minimum available pool during scaling churn.'
          },
          {
            text: 'Switch from Docker containers to raw PM2 processes on the host virtual machine',
            correct: false,
            explanation: 'PM2 on a single VM removes auto-healing, multi-node scheduling, and load balancing across failure zones.'
          }
        ]
      }
    }
    if (slug.includes('system-design')) {
      return {
        title: 'Architecture Scenario: Redis Cache Failure Shuts Down PostgreSQL',
        situation: 'A popular news article or product goes viral. Your primary Redis cache cluster node crashes due to an out-of-memory error. In less than 15 seconds, your backend response times surge from 35ms to 8,500ms, and PostgreSQL connection pools max out at 500/500.',
        question: 'How do you design the cache layer so database collapse is mathematically impossible?',
        options: [
          {
            text: 'Increase PostgreSQL max_connections from 500 to 5,000 in postgresql.conf',
            correct: false,
            explanation: 'PostgreSQL allocates memory per connection (~5-10MB). 5,000 connections will trigger kernel OOM killer and cause complete database corruption.'
          },
          {
            text: 'Implement a Distributed Mutex Lock (via Redis/Postgres advisory lock) so only 1 thread fetches from DB upon cache miss, combined with circuit breaker and stale-while-revalidate caching',
            correct: true,
            explanation: 'A single query populates the cache while all other concurrent requests receive stale data or wait on the mutex, completely shielding the database from the thundering herd.'
          },
          {
            text: 'Remove the Redis cache completely and add 10 read replicas to PostgreSQL',
            correct: false,
            explanation: 'Replicas still experience disk I/O bottlenecks and incur high cloud costs without matching Redis sub-millisecond memory latency.'
          }
        ]
      }
    }
    return {
      title: 'Database Concurrency Scenario: Flash Sale Final Item Race Condition',
      situation: 'Your e-commerce client has exactly 1 remaining PlayStation 5 in stock. Two customers click "Confirm Payment" at the exact same millisecond across two different AWS availability zones.',
      question: 'Which database technique prevents both customers from purchasing the same item?',
      options: [
        {
          text: 'Check stock > 0 in JavaScript memory, sleep for 50ms, then insert the order',
          correct: false,
          explanation: 'JavaScript thread sleeps do not provide transactional cross-process isolation. Both threads will read stock = 1 and sell the item twice.'
        },
        {
          text: 'Use atomic SQL conditional update: UPDATE products SET stock = stock - 1 WHERE id = $1 AND stock > 0, inside a SERIALIZABLE transaction',
          correct: true,
          explanation: 'The database engine utilizes row-level locking. The first transaction succeeds with 1 row updated; the second transaction finds 0 matching rows and safely aborts.'
        },
        {
          text: 'Store the inventory count in local browser localStorage of each customer',
          correct: false,
          explanation: 'LocalStorage is client-side only and has zero knowledge of other customers.'
        }
      ]
    }
  }

  const scenario = getScenarioForSlug(guideSlug)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  return (
    <div className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#100c1e] to-[#04060c] border border-indigo-500/30 shadow-2xl space-y-6">
      <div className="border-b border-white/10 pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider font-mono">
          <HelpCircle size={13} />
          <span>Interactive Interview Scenario Challenge</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white font-display mt-2">
          {scenario.title}
        </h3>
        <p className="text-xs text-slate-300 font-light mt-2 leading-relaxed bg-white/[0.03] p-4 rounded-xl border border-white/5">
          <strong className="text-amber-400 font-mono">Incident Brief:</strong> {scenario.situation}
        </p>
      </div>

      <div className="space-y-3">
        <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
          Senior Architect Decision: {scenario.question}
        </div>

        {scenario.options.map((opt, idx) => {
          const isSelected = selectedOption === idx
          let optStyle = 'bg-white/[0.02] border-white/5 text-slate-300 hover:bg-white/5'

          if (hasSubmitted) {
            if (opt.correct) {
              optStyle = 'bg-emerald-500/15 border-emerald-500/60 text-emerald-200'
            } else if (isSelected) {
              optStyle = 'bg-rose-500/15 border-rose-500/60 text-rose-200'
            }
          } else if (isSelected) {
            optStyle = 'bg-indigo-500/20 border-indigo-500/60 text-white'
          }

          return (
            <button
              key={idx}
              onClick={() => {
                if (!hasSubmitted) setSelectedOption(idx)
              }}
              className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-2 ${optStyle}`}
            >
              <div className="flex items-start gap-3">
                <span className="h-5 w-5 rounded-full border border-current flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-xs sm:text-sm font-medium leading-relaxed">
                  {opt.text}
                </span>
              </div>

              {hasSubmitted && (
                <div className="mt-2 pt-2 border-t border-white/10 text-xs font-light leading-relaxed pl-8">
                  <strong className={opt.correct ? 'text-emerald-400' : 'text-rose-400'}>
                    {opt.correct ? '✓ Senior Architect Reasoning: ' : '✗ Production Pitfall: '}
                  </strong>
                  <span>{opt.explanation}</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {!hasSubmitted ? (
        <button
          onClick={() => {
            if (selectedOption !== null) setHasSubmitted(true)
          }}
          disabled={selectedOption === null}
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/30 cursor-pointer disabled:cursor-not-allowed"
        >
          Submit Architecture Decision
        </button>
      ) : (
        <div className="flex items-center justify-between text-xs font-mono pt-2">
          <span className="text-slate-400">Decision evaluated against Production SRE Standards</span>
          <button
            onClick={() => {
              setHasSubmitted(false)
              setSelectedOption(null)
            }}
            className="text-indigo-400 hover:underline"
          >
            Retry Challenge
          </button>
        </div>
      )}
    </div>
  )
}
