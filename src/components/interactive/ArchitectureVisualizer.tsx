import React, { useState } from 'react'
import { 
  Server, Cpu, Database, Globe, Smartphone, ShieldCheck, Zap, 
  MessageSquare, ArrowRight, CheckCircle2, Activity, Radio, Layers
} from 'lucide-react'

interface NodeData {
  id: string
  label: string
  tech: string
  role: string
  latency: string
  throughput: string
  icon: any
  status: 'optimal' | 'syncing' | 'active'
}

interface FlowData {
  id: string
  name: string
  badge: string
  summary: string
  nodes: NodeData[]
}

const ARCHITECTURAL_FLOWS: FlowData[] = [
  {
    id: 'web-platform',
    name: 'Sub-Second Web & API Platform',
    badge: 'Core Performance',
    summary: 'Sub-second frontend delivery paired with edge-cached serverless APIs and scalable PostgreSQL database.',
    nodes: [
      {
        id: 'client',
        label: 'Client Browser / Mobile',
        tech: 'React 19 & Vite / Next.js',
        role: 'Instant hydration, zero bloat, mobile-first touch UI',
        latency: '< 16ms render',
        throughput: '60 FPS',
        icon: Globe,
        status: 'optimal'
      },
      {
        id: 'edge',
        label: 'Global Edge CDN Cache',
        tech: 'Cloudflare / Vercel Edge',
        role: 'Geo-distributed caching, Brotli/gzip, SSL termination',
        latency: '< 35ms TTFB',
        throughput: '10 Gbps Edge',
        icon: Zap,
        status: 'optimal'
      },
      {
        id: 'api',
        label: 'Serverless Function Gateway',
        tech: 'Node.js 22 & Edge Compute',
        role: 'Secure JWT verification, payload validation, HMAC signing',
        latency: '< 45ms cold/warm',
        throughput: 'Auto-Scaling',
        icon: Cpu,
        status: 'active'
      },
      {
        id: 'db',
        label: 'Supabase PostgreSQL DB',
        tech: 'Postgres 16 + Row Security',
        role: 'Encrypted at rest, row-level security (RLS), real-time replica',
        latency: '< 15ms query',
        throughput: '10k concurrent req',
        icon: Database,
        status: 'optimal'
      }
    ]
  },
  {
    id: 'lead-automation',
    name: 'WhatsApp & Lead CRM Pipeline',
    badge: 'Automation Suite',
    summary: 'Real-time prospective customer discovery, high-speed contact enrichment, and instant 1-click WhatsApp outreach.',
    nodes: [
      {
        id: 'discovery',
        label: 'Lead Scraper & Discovery Engine',
        tech: 'Google Maps / Overpass API',
        role: 'Real-time city POI discovery with verified phone/website tags',
        latency: '< 450ms scrape',
        throughput: '20 leads/sec',
        icon: Radio,
        status: 'optimal'
      },
      {
        id: 'enrichment',
        label: 'Contact Validation & Clean',
        tech: 'In-Memory Phone Sanitizer',
        role: 'Normalizes +91 numbers, verifies website URLs, deduplicates',
        latency: '< 5ms/lead',
        throughput: 'Instant Clean',
        icon: Activity,
        status: 'optimal'
      },
      {
        id: 'whatsapp',
        label: 'WhatsApp Cloud Webhook',
        tech: 'Meta API & Deep Link Engine',
        role: 'Instant chat handoff to sales team with pre-filled greeting',
        latency: '< 100ms dispatch',
        throughput: '100% Deliverability',
        icon: MessageSquare,
        status: 'active'
      },
      {
        id: 'crm',
        label: 'SpringWeb Operations CRM',
        tech: 'Role-Based Lead Database',
        role: 'Stage tracking (New, Contacted, Closed), notes, exports',
        latency: '< 20ms sync',
        throughput: 'Real-time Sync',
        icon: Server,
        status: 'optimal'
      }
    ]
  },
  {
    id: 'erp-core',
    name: 'Enterprise ERP & Operations Core',
    badge: 'Enterprise Architecture',
    summary: 'High-concurrency business management software for multi-branch retail, textile billing, and inventory tracking.',
    nodes: [
      {
        id: 'auth',
        label: 'Role-Based Authentication',
        tech: 'PBKDF2 / SHA-256 + 2FA',
        role: 'Staff access tiers, cryptographic session tokens, audit trail',
        latency: '< 10ms check',
        throughput: 'Zero Bypass',
        icon: ShieldCheck,
        status: 'optimal'
      },
      {
        id: 'events',
        label: 'Event Bus & Real-time Stream',
        tech: 'Postgres Change Data Capture',
        role: 'Real-time multi-terminal broadcast of stock changes & orders',
        latency: '< 50ms broadcast',
        throughput: 'Real-time Pub/Sub',
        icon: Layers,
        status: 'optimal'
      },
      {
        id: 'billing',
        label: 'Automated Billing & Invoice',
        tech: 'PDF Engine + Razorpay API',
        role: 'Automated GST calculation, instant receipt generator, payment sync',
        latency: '< 250ms render',
        throughput: 'Multi-Terminal',
        icon: Zap,
        status: 'active'
      },
      {
        id: 'inventory',
        label: 'Inventory & Stock DB',
        tech: 'PostgreSQL Relational Core',
        role: 'Atomic transactions, barcoding support, low-stock alerts',
        latency: '< 12ms ACID lock',
        throughput: '99.99% Integrity',
        icon: Database,
        status: 'optimal'
      }
    ]
  }
]

export const ArchitectureVisualizer: React.FC = () => {
  const [activeFlowIndex, setActiveFlowIndex] = useState(0)
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(0)

  const activeFlow = ARCHITECTURAL_FLOWS[activeFlowIndex]
  const selectedNode = activeFlow.nodes[selectedNodeIndex] || activeFlow.nodes[0]

  return (
    <div className="relative p-6 sm:p-10 rounded-3xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-[#080b14]/90 dark:bg-[#080b14]/90 light:bg-white backdrop-blur-2xl shadow-2xl dark:shadow-black/50 light:shadow-slate-200/80 space-y-8 overflow-hidden">
      
      {/* ── Ambient Background Glows ── */}
      <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-emerald-500/15 filter blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-indigo-600/15 filter blur-[100px] pointer-events-none" />

      {/* ── Header & Tab Switcher ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10 border-b border-white/10 dark:border-white/10 light:border-slate-200 pb-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 dark:text-emerald-400 light:text-emerald-700 light:bg-emerald-50 light:border-emerald-300 text-[11px] font-bold uppercase tracking-wider font-display">
            <Cpu size={13} /> Interactive Engineering Architecture
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white dark:text-white light:text-slate-900 font-display">
            Under the Hood: <span className="text-emerald-400 dark:text-emerald-400 light:text-emerald-700">Enterprise Data Flow</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 font-light">
            Click on any pipeline or node below to inspect real-time throughput, latency, and technology implementations.
          </p>
        </div>

        {/* Pipeline Toggle Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 shrink-0 flex-wrap">
          {ARCHITECTURAL_FLOWS.map((flow, idx) => (
            <button
              key={flow.id}
              onClick={() => {
                setActiveFlowIndex(idx)
                setSelectedNodeIndex(0)
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeFlowIndex === idx
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/25'
                  : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-white/5 light:hover:bg-slate-200/60'
              }`}
            >
              <span>{flow.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Pipeline Visualizer Stage ── */}
      <div className="relative z-10 space-y-6">
        
        {/* Animated Flow Track */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          
          {/* Animated Connecting SVG Line across desktop */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 pointer-events-none z-0">
            <svg className="w-full h-2 overflow-visible" preserveAspectRatio="none">
              <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="url(#activeLineGrad)" strokeWidth="2.5" />
              <defs>
                <linearGradient id="activeLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#2dd4bf" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>

            {/* Glowing Traveling Data Pulse */}
            <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse-travel" />
          </div>

          {activeFlow.nodes.map((node, nIdx) => {
            const Icon = node.icon
            const isSelected = selectedNodeIndex === nIdx

            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeIndex(nIdx)}
                className={`text-left p-5 rounded-2xl border transition-all duration-300 relative z-10 flex flex-col justify-between space-y-3 cursor-pointer group ${
                  isSelected
                    ? 'border-emerald-500/70 dark:border-emerald-500/70 light:border-emerald-500 bg-gradient-to-b from-emerald-950/50 to-slate-900/80 dark:from-emerald-950/50 dark:to-slate-900/80 light:from-emerald-50 light:to-white shadow-xl shadow-emerald-500/15 light:shadow-emerald-500/10 scale-[1.02]'
                    : 'border-white/10 dark:border-white/10 light:border-slate-200 bg-slate-900/40 dark:bg-slate-900/40 light:bg-slate-50 hover:border-white/20 dark:hover:border-white/20 light:hover:border-slate-300 hover:bg-slate-900/70 light:hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                      : 'bg-white/5 dark:bg-white/5 light:bg-slate-200/80 text-slate-300 dark:text-slate-300 light:text-slate-600 group-hover:text-emerald-400 group-hover:bg-emerald-500/10'
                  }`}>
                    <Icon size={20} />
                  </div>
                  
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 dark:bg-white/5 light:bg-slate-200/80 border border-white/10 dark:border-white/10 light:border-slate-200 text-slate-400 dark:text-slate-400 light:text-slate-600">
                    STEP 0{nIdx + 1}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-bold text-white dark:text-white light:text-slate-900 font-display group-hover:text-emerald-400 light:group-hover:text-emerald-600 transition-colors">
                    {node.label}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400 dark:text-emerald-400 light:text-emerald-700">
                    {node.tech}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-400 light:text-slate-500 pt-2 border-t border-white/5 dark:border-white/5 light:border-slate-200">
                  <span>{node.latency}</span>
                  <span className="text-emerald-400 dark:text-emerald-400 light:text-emerald-700 font-semibold">{node.throughput}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* ── Active Node Deep-Dive Inspection Card ── */}
        <div className="p-6 rounded-2xl border border-emerald-500/20 dark:border-emerald-500/20 light:border-emerald-200 bg-emerald-950/20 dark:bg-emerald-950/20 light:bg-emerald-50/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span className="text-xs font-mono font-bold text-emerald-400 dark:text-emerald-400 light:text-emerald-700 uppercase tracking-wider">
                Node Inspection: {selectedNode.label}
              </span>
            </div>
            <p className="text-sm text-slate-200 dark:text-slate-200 light:text-slate-700 leading-relaxed">
              {selectedNode.role}
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0 border-t md:border-t-0 md:border-l border-white/10 dark:border-white/10 light:border-slate-200 pt-4 md:pt-0 md:pl-6">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-400 light:text-slate-500">Execution Speed</div>
              <div className="text-base font-mono font-black text-emerald-400 dark:text-emerald-400 light:text-emerald-700">{selectedNode.latency}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-400 light:text-slate-500">Capacity</div>
              <div className="text-base font-mono font-black text-indigo-300 dark:text-indigo-300 light:text-indigo-700">{selectedNode.throughput}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-400 light:text-slate-500">Status</div>
              <div className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 dark:bg-emerald-500/20 light:bg-emerald-100 text-emerald-400 dark:text-emerald-400 light:text-emerald-700 border border-emerald-500/30 dark:border-emerald-500/30 light:border-emerald-200 flex items-center gap-1 w-max mt-0.5">
                <CheckCircle2 size={12} />
                <span>Optimal</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ArchitectureVisualizer
