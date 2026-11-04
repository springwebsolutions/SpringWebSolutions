import React, { useState } from 'react'
import { DollarSign, CheckCircle2, XCircle, AlertTriangle, Calculator, Sparkles, Trophy, HelpCircle, ArrowRight, ShieldCheck, Flame } from 'lucide-react'

// ─── 1. INTERACTIVE REMOTE COMPENSATION & SECTION 44ADA TAX CALCULATOR ────────
export const RemoteCompensationCalculator: React.FC = () => {
  const [monthlyUsd, setMonthlyUsd] = useState(5500)
  const exchangeRate = 86.5 // USD to INR exchange rate

  const annualUsd = monthlyUsd * 12
  const annualInr = annualUsd * exchangeRate

  // Section 44ADA: 50% presumptive business expenses deducted automatically
  const presumptiveTaxableIncome = annualInr * 0.5
  // Rough effective tax calculation under Indian New Tax Regime on the 50% profit
  const section44adaTax = presumptiveTaxableIncome > 1500000 
    ? (presumptiveTaxableIncome - 1500000) * 0.30 + 150000 
    : presumptiveTaxableIncome * 0.15
  const section44adaInHand = annualInr - section44adaTax

  // Traditional Salaried employee with same gross (taxed on full CTC with 75k standard deduction)
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
          <span className="text-[11px] text-slate-400 font-light">Legally saved each year via 44ADA expenses</span>
        </div>
      </div>

      {/* Tier-2 Living Arbitrage Note */}
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-3 text-xs text-slate-300 leading-relaxed font-light">
        <Sparkles size={16} className="text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white font-bold">The Tier-2 Arbitrage Real-Life Math:</strong> Rent for a luxury 3BHK independent villa in Udumalpet or Pollachi is ~₹15,000/mo vs ₹75,000/mo in Bangalore HSR Layout. That alone puts an extra <span className="text-emerald-300 font-semibold font-mono">₹7,20,000 cash</span> directly into your savings account every single year.
        </div>
      </div>
    </div>
  )
}

// ─── 2. INTERACTIVE ARCHITECTURE & SKILL READINESS CHECKLIST ──────────────────
interface ChecklistProps {
  guideSlug: string
}

export const ArchitectureReadinessChecklist: React.FC<ChecklistProps> = ({ guideSlug }) => {
  const checklists: Record<string, { title: string; items: string[] }> = {
    'full-stack-developer-roadmap-2026': {
      title: 'Full-Stack Production Readiness Diagnostic',
      items: [
        'I write strict TypeScript with zero `any` and understand conditional types (infer)',
        'I know how React 19 Server Components differ from client-side hydration',
        'I use TanStack Query for cache invalidation rather than storing server data in Redux',
        'I design PostgreSQL schemas with B-Tree indexes, composite keys, and foreign constraints',
        'I prevent double-spending in database transactions using `SELECT ... FOR UPDATE`',
        'I build multi-stage Dockerfiles that compile production images under 80 MB',
        'I have automated GitHub Actions CI/CD deploying directly to Vercel or AWS'
      ]
    },
    'system-design-microservices-interview-masterclass': {
      title: 'Distributed System Design Mastery Audit',
      items: [
        'I can calculate back-of-the-envelope RPS, disk IOPS, and memory requirements in 5 minutes',
        'I understand why Redis token bucket rate limiters prevent DDoS spikes on API gateways',
        'I can explain the exact tradeoff between Cache-Aside vs Write-Through caching patterns',
        'I know how to resolve cache stampede (thundering herd) with mutex locks or XFetch',
        'I can design an idempotent order execution API using unique client transaction UUIDs',
        'I understand how database read-replicas differ from horizontal sharding strategies'
      ]
    },
    'remote-software-engineer-playbook-tier2-tier3-india': {
      title: 'Global Remote Engineer Readiness Checklist',
      items: [
        'My GitHub has 2+ deployed, non-tutorial production repos with clean architecture diagrams',
        'I have written a concise 3-paragraph value-first cold email targeting startup founders',
        'I have tested asynchronous communication via detailed Loom videos & written PR descriptions',
        'I understand Section 44ADA presumptive taxation and how FIRC remittance certificates work',
        'I have an active Wise or direct SWIFT bank account configured for zero-loss forex conversion'
      ]
    },
    'devops-cloud-engineering-blueprint-2026': {
      title: 'DevOps & Kubernetes Production Readiness Audit',
      items: [
        'I use multi-stage Docker builds to strip build compilers from runtime container images',
        'I understand Kubernetes Pod lifecycle, Deployment replica sets, and Ingress routing',
        'I write reusable Terraform (HCL) modules for VPCs, private subnets, and RDS databases',
        'I have configured Prometheus metrics and Grafana dashboards for latency & 5xx alerts',
        'I implement blue-green or canary zero-downtime rolling deployments via GitHub Actions'
      ]
    },
    'applied-ai-engineering-rag-vector-databases': {
      title: 'Applied AI Engineering Competency Checklist',
      items: [
        'I understand chunking strategies (semantic, recursive) and token limits for LLM embeddings',
        'I have executed cosine similarity `<=>` queries using PostgreSQL `pgvector`',
        'I know how to enforce deterministic JSON outputs using Zod schema function calling',
        'I have built an autonomous multi-step agent workflow that calls custom external APIs',
        'I implement prompt caching and streaming Server-Sent Events (SSE) to minimize user latency'
      ]
    }
  }

  const currentChecklist = checklists[guideSlug] || checklists['full-stack-developer-roadmap-2026']
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({})

  const toggleItem = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  const completedCount = Object.values(checkedItems).filter(Boolean).length
  const totalCount = currentChecklist.items.length
  const percent = Math.round((completedCount / totalCount) * 100)

  const getRank = () => {
    if (percent === 100) return { label: 'Principal Architect Caliber', color: 'text-emerald-400', badge: 'Ready for Top 1% Roles' }
    if (percent >= 70) return { label: 'Senior Production Engineer', color: 'text-teal-300', badge: 'Ready for Tier-1 Startups' }
    if (percent >= 40) return { label: 'Solid Mid-Level Developer', color: 'text-indigo-400', badge: '2-3 Milestones Left' }
    return { label: 'Aspiring Foundation Builder', color: 'text-amber-400', badge: 'Focus on Phase 1 & 2' }
  }

  const rank = getRank()

  return (
    <div className="my-10 p-6 sm:p-8 rounded-3xl bg-[#060812] border border-white/10 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider font-mono">
            <CheckCircle2 size={13} />
            <span>Interactive Self-Audit Checklist</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-display mt-2">
            {currentChecklist.title}
          </h3>
          <p className="text-xs text-slate-400 font-light mt-1">
            Check off competencies you can confidently defend in a live technical interview.
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[11px] text-slate-400 font-mono block">Your Readiness Score</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">{percent}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-white/5">
        <div 
          className="bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs pt-1">
        <span className="text-slate-400 font-light">Completed: <strong className="text-white">{completedCount}</strong> of {totalCount} competencies</span>
        <span className={`font-bold font-mono ${rank.color} flex items-center gap-1.5`}>
          <Trophy size={13} />
          {rank.label} ({rank.badge})
        </span>
      </div>

      {/* Interactive Checkbox Items */}
      <div className="space-y-2.5 pt-2">
        {currentChecklist.items.map((item, idx) => {
          const isChecked = !!checkedItems[idx]
          return (
            <button
              key={idx}
              type="button"
              onClick={() => toggleItem(idx)}
              className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                isChecked
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/20 text-slate-300'
              }`}
            >
              <span className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                isChecked
                  ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-black'
                  : 'border-slate-600 bg-slate-900/50'
              }`}>
                {isChecked && <CheckCircle2 size={13} strokeWidth={3} />}
              </span>
              <span className="text-xs sm:text-sm font-medium leading-relaxed">
                {item}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── 3. SENIOR ARCHITECT TECHNICAL SCENARIO QUIZ ──────────────────────────────
interface QuizProps {
  guideSlug: string
}

export const SeniorArchitectScenarioQuiz: React.FC<QuizProps> = ({ guideSlug }) => {
  const quizzes: Record<string, {
    question: string
    scenario: string
    options: { text: string; isCorrect: boolean; explanation: string }[]
  }> = {
    'full-stack-developer-roadmap-2026': {
      scenario: 'High-Concurrency E-Commerce Flash Sale',
      question: 'Two users click "Buy Last Unit" at the exact same millisecond. If your API runs `SELECT quantity FROM items WHERE id = 1` followed by `UPDATE items SET quantity = quantity - 1`, what occurs?',
      options: [
        {
          text: 'The database automatically halts the second transaction because PostgreSQL is ACID compliant.',
          isCorrect: false,
          explanation: 'Incorrect! Default Read Committed isolation allows both transactions to read quantity = 1, leading to an overselling race condition where inventory drops to -1.'
        },
        {
          text: 'A Race Condition occurs, resulting in both orders completing and inventory selling past zero.',
          isCorrect: true,
          explanation: 'Correct! Without an explicit row-level lock (`SELECT ... FOR UPDATE`) or an atomic constraint (`WHERE quantity > 0`), both concurrent reads see 1 item in stock and both succeed.'
        },
        {
          text: 'The API Gateway triggers a 429 Too Many Requests status code.',
          isCorrect: false,
          explanation: 'Incorrect. Rate limiting limits request volume per IP; it cannot detect application-level inventory concurrency.'
        }
      ]
    },
    'system-design-microservices-interview-masterclass': {
      scenario: 'Cache Stampede / Thundering Herd Problem',
      question: 'Your Redis cluster crashes for 30 seconds during a cricket World Cup final. Millions of users reload the live score page simultaneously. What immediate failure mode hits your backend?',
      options: [
        {
          text: 'Cache Stampede: Millions of cache-miss queries simultaneously hit the primary database, exhausting connection pools and causing a total site blackout.',
          isCorrect: true,
          explanation: 'Correct! When the cache layer is down, every incoming request falls through to the database. Without probabilistic early refresh or mutex locking, database connection pools crash in seconds.'
        },
        {
          text: 'PostgreSQL automatically spins up 500 read replicas to handle the surge.',
          isCorrect: false,
          explanation: 'Incorrect. Database replication requires infrastructure provisioning time and cannot react to sub-second thundering herd spikes.'
        },
        {
          text: 'Cloudflare buffers the database write locks and serves stale HTML.',
          isCorrect: false,
          explanation: 'Incorrect. CDN edge caches only serve cached static assets; dynamic API routes without cache-headers hit origin servers directly.'
        }
      ]
    },
    'remote-software-engineer-playbook-tier2-tier3-india': {
      scenario: 'Contractor Invoicing & Compliance',
      question: 'You earn $6,000/month as an independent contractor from a US Delaware company into your Indian bank account. Under Section 44ADA, how much of your gross income is considered taxable profit?',
      options: [
        {
          text: '100% of income is taxed under the highest 30% slab rate without deductions.',
          isCorrect: false,
          explanation: 'Incorrect. That is true only for salaried employees. Contractors eligible for Section 44ADA can deduct 50% as presumed business expenses.'
        },
        {
          text: 'Exactly 50% is treated as taxable profit; the other 50% is treated as presumed expenses with zero receipts required.',
          isCorrect: true,
          explanation: 'Correct! Section 44ADA allows eligible professionals earning up to ₹75 Lakhs to declare a flat 50% profit margin, dramatically lowering their effective tax.'
        },
        {
          text: 'Foreign remittances are completely tax-free in India under SEZ export subsidies.',
          isCorrect: false,
          explanation: 'Incorrect. Zero-rated GST applies to export of services, but personal Income Tax is still strictly mandatory.'
        }
      ]
    },
    'devops-cloud-engineering-blueprint-2026': {
      scenario: 'Kubernetes Rolling Deployment Outage',
      question: 'You push a new container version to your Kubernetes cluster. The container crashes on boot due to a missing environment variable. What does Kubernetes do if configured properly?',
      options: [
        {
          text: 'It halts the rolling update because the Readiness Probe fails, leaving your existing healthy pods serving live traffic uninterrupted.',
          isCorrect: true,
          explanation: 'Correct! If Readiness and Liveness probes are configured, Kubernetes detects that the new pods never reach ready state and preserves the previous healthy ReplicaSet.'
        },
        {
          text: 'It terminates all old pods immediately, displaying a 500 Error to users.',
          isCorrect: false,
          explanation: 'Incorrect. That only happens if you set maxUnavailable = 100% and have zero readiness probe checks.'
        },
        {
          text: 'Docker restarts the host operating system automatically.',
          isCorrect: false,
          explanation: 'Incorrect. Pod failures are isolated within container namespaces; they never reboot the host node.'
        }
      ]
    },
    'applied-ai-engineering-rag-vector-databases': {
      scenario: 'Vector Search vs Exact Match Queries',
      question: 'A user searches for "automobile mechanics in Udumalpet". Your database only contains documents labeled "car repair workshops in Udumalpet". Why does semantic vector search succeed where standard SQL `LIKE` fails?',
      options: [
        {
          text: 'Vector embeddings map words into high-dimensional semantic space where "automobile" and "car" have high cosine similarity regardless of exact string spelling.',
          isCorrect: true,
          explanation: 'Correct! Embeddings capture semantic meaning rather than lexical tokens. Cosine similarity evaluates contextual closeness in 1536-dimensional vector space.'
        },
        {
          text: 'PostgreSQL runs a brute-force regex against Google Translate APIs.',
          isCorrect: false,
          explanation: 'Incorrect. Semantic search is completely offline math (dot product or cosine angle distance) computed directly on stored vectors.'
        },
        {
          text: 'The LLM automatically rewrites the database table schema before every query.',
          isCorrect: false,
          explanation: 'Incorrect. The database schema remains static; the vector index computes distance metrics.'
        }
      ]
    }
  }

  const currentQuiz = quizzes[guideSlug] || quizzes['full-stack-developer-roadmap-2026']
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  return (
    <div className="my-10 p-6 sm:p-8 rounded-3xl bg-[#070b16] border border-emerald-500/20 shadow-2xl space-y-5">
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider font-mono w-max">
        <HelpCircle size={13} />
        <span>Senior Architect Scenario Challenge</span>
      </div>

      <div>
        <span className="text-[11px] text-slate-500 uppercase tracking-widest font-mono font-bold block mb-1">
          {currentQuiz.scenario}
        </span>
        <h4 className="text-base sm:text-lg font-bold text-white font-display leading-snug">
          {currentQuiz.question}
        </h4>
      </div>

      <div className="space-y-3 pt-2">
        {currentQuiz.options.map((opt, idx) => {
          const isSelected = selectedOption === idx
          return (
            <div key={idx} className="space-y-2">
              <button
                type="button"
                onClick={() => setSelectedOption(idx)}
                className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? opt.isCorrect
                      ? 'bg-emerald-500/15 border-emerald-400 text-white font-semibold'
                      : 'bg-rose-500/15 border-rose-400 text-white font-semibold'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-slate-300'
                }`}
              >
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                  isSelected
                    ? opt.isCorrect
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                      : 'bg-rose-500 border-rose-400 text-white'
                    : 'border-slate-600 bg-slate-900/60 text-slate-400'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="leading-relaxed">{opt.text}</span>
              </button>

              {isSelected && (
                <div className={`p-4 rounded-xl text-xs leading-relaxed animate-fade-in ${
                  opt.isCorrect 
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' 
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                }`}>
                  <strong className="block font-bold mb-1">
                    {opt.isCorrect ? '✓ Correct Architectural Insight:' : '✗ Common Pitfall:'}
                  </strong>
                  {opt.explanation}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

