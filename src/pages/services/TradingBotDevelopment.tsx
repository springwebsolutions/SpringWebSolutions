import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import SEOHead from '@/components/seo/SEOHead'
import AnimatedBackground from '@/components/ui/AnimatedBackground'
import { 
  TrendingUp, Zap, ShieldCheck, CheckCircle2, ArrowRight, Activity, 
  Cpu, Terminal, BarChart2, Radio, Lock, RefreshCw, Smartphone, 
  Sparkles, HelpCircle, Phone, Award, Layers, Bot, Send
} from 'lucide-react'

export const TradingBotDevelopment: React.FC = () => {
  const [activeFeatureTab, setActiveFeatureTab] = useState<'quotex' | 'tradingview' | 'crypto' | 'risk'>('quotex')

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': 'Algorithmic Trading Bot & Quotex Signal Bot Development',
    'provider': {
      '@type': 'LocalBusiness',
      'name': 'Spring Web Solutions',
      'telephone': '+91-80126-22119',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Udumalpet',
        'addressRegion': 'Tamil Nadu',
        'postalCode': '642126',
        'addressCountry': 'IN'
      }
    },
    'areaServed': ['Global', 'India', 'Tamil Nadu', 'Udumalpet', 'Coimbatore', 'Bangalore', 'Dubai'],
    'description': 'Custom automated algorithmic trading bots, Quotex & Pocket Option WebSocket trade execution, TradingView PineScript webhook bots, Telegram signal copiers, and MT4/MT5 expert advisors.'
  }

  const packages = [
    {
      name: 'TradingView Webhook Bot',
      price: '₹14,999',
      period: 'one-time',
      desc: 'Ideal for traders with existing PineScript strategies who want automated execution on their broker or exchange.',
      features: [
        'TradingView Webhook Alert Listener',
        'Sub-second order execution engine (<150ms)',
        'Supports Crypto (Binance/Bybit) or Forex Brokers',
        'Take-Profit (TP) & Stop-Loss (SL) Automation',
        'Telegram Instant Trade Execution Alerts',
        'Cloud Server Deployment Setup (24/7 Uptime)'
      ],
      popular: false,
      cta: 'Build Webhook Bot'
    },
    {
      name: 'Quotex & Binary Pro Bot',
      price: '₹29,999',
      period: 'one-time',
      desc: 'High-speed automated binary options execution bot with real-time payout filtering, martingale, and session control.',
      features: [
        'Direct Quotex / Pocket Option WebSocket API Execution',
        'Sub-second Reaction (<80ms Signal-to-Trade)',
        'Smart Martingale & Anti-Martingale Money Management',
        'Auto Payout Threshold Filter (>80% Payout Only)',
        'Daily Profit Target & Max Loss Auto-Stop Safeguard',
        'Telegram VIP Channel Signal Scraper & Auto-Trader',
        'Windows Desktop Executable or Cloud VPS Hosting'
      ],
      popular: true,
      badge: 'Most In-Demand',
      cta: 'Build Quotex Bot'
    },
    {
      name: 'Enterprise Multi-Account Master',
      price: '₹59,999',
      period: 'one-time',
      desc: 'Comprehensive multi-client trade copier, signal distribution server, and encrypted license key management system.',
      features: [
        'Multi-Account Trade Copier (Master-to-Slave)',
        'Encrypted License Key Generation & Client Paywall',
        'MT4 / MT5 MQL5 Bridge & Custom Indicators',
        'Live Web Dashboard with P&L Analytics',
        'Dedicated Telegram Command Console Bot',
        'Strategy Backtesting Engine & Custom PineScript Coding',
        'Priority 24/7 SLA & Free Future Broker API Updates'
      ],
      popular: false,
      cta: 'Build Enterprise Engine'
    }
  ]

  const faqs = [
    {
      q: 'How does the Quotex & Pocket Option automated trading bot work?',
      a: 'Our bot connects directly via secure high-speed WebSocket protocols or authorized browser automation sessions. When a signal arrives (from TradingView, Telegram, or custom indicators), the bot verifies asset availability, checks that the broker payout is above your set threshold (e.g. 80%+), calculates the exact risk amount (including martingale step), and places the CALL/PUT trade in under 80 milliseconds.'
    },
    {
      q: 'Can you connect my custom TradingView PineScript strategy to auto-trade?',
      a: 'Yes! We create a dedicated webhook server that receives json alerts triggered by your TradingView PineScript indicator or strategy. The server instantly translates the alert into order commands on your exchange (Quotex, Pocket Option, Binance, Bybit, Delta, MT4/MT5) without requiring any manual clicking.'
    },
    {
      q: 'What risk management safeguards are built into the bot?',
      a: 'Every bot is engineered with capital protection at its core: configurable Martingale (custom multiplier & max step limit), Anti-Martingale, Daily Profit Target (auto-shuts off after hitting target), Maximum Daily Drawdown Stop-Loss, and High-Impact News Filter pauses.'
    },
    {
      q: 'Do I get full source code ownership and where is it hosted?',
      a: 'Yes, you receive 100% full source code ownership. We can package the bot as a single-click Windows Desktop application (`.exe`) with a graphical interface, or deploy it to a dedicated 24/7 cloud VPS server (like Ubuntu on AWS/DigitalOcean) so it runs continuously without requiring your computer to stay on.'
    },
    {
      q: 'Can the bot scrape signals from a Telegram VIP channel and trade automatically?',
      a: 'Yes! We engineer real-time Telegram signal copiers that parse messages from any Telegram channel (format like `EUR/USD 5M CALL`, `GOLD BUY 2350 TP1 TP2 SL`), extract the asset, expiry, and direction, and execute the trade instantaneously with zero lag.'
    }
  ]

  return (
    <div className="min-h-screen page-bg flex flex-col">
      <SEOHead
        title="Algorithmic Trading Bot & Quotex Signal Bot Development | SpringWeb Solutions"
        description="Engineering custom automated trading bots for Quotex, Pocket Option, TradingView Webhooks, Telegram signal copiers, Binance, and MT4/MT5. Sub-second execution with built-in risk management."
      />
      <Navbar />

      <main className="flex-grow py-12 sm:py-20 relative overflow-hidden">
        <AnimatedBackground accent="emerald" particleCount={24} />

        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14 space-y-24 relative z-10">
          
          {/* ── Hero Section ── */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 dark:text-emerald-400 light:text-emerald-700 text-xs font-bold uppercase tracking-widest font-display shadow-lg shadow-emerald-500/10">
              <Bot size={15} className="animate-pulse text-emerald-400" />
              <span>Institutional-Grade Bot Engineering</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white dark:text-white light:text-slate-900 font-display tracking-tight uppercase leading-tight">
              Automated Trading Bots &amp;{' '}
              <span className="text-emerald-400 dark:text-emerald-400 light:text-emerald-700 bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 light:from-emerald-700 light:to-indigo-700">
                Quotex Signal Engines
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 dark:text-slate-300 light:text-slate-600 font-sans font-light leading-relaxed max-w-3xl mx-auto">
              Eliminate emotional trading and latency delays. We engineer ultra-low-latency automated trading bots, Quotex &amp; Pocket Option execution engines, TradingView webhook listeners, and Telegram signal auto-copiers with automated risk management.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 max-w-3xl mx-auto">
              <div className="p-4 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 shadow-xl backdrop-blur-md">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 dark:text-emerald-400 light:text-emerald-700 font-display">&lt; 80ms</div>
                <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 font-mono mt-1">Execution Latency</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 shadow-xl backdrop-blur-md">
                <div className="text-2xl sm:text-3xl font-black text-indigo-400 dark:text-indigo-400 light:text-indigo-700 font-display">24/7</div>
                <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 font-mono mt-1">Cloud VPS Uptime</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 shadow-xl backdrop-blur-md">
                <div className="text-2xl sm:text-3xl font-black text-teal-400 dark:text-teal-400 light:text-teal-700 font-display">100%</div>
                <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 font-mono mt-1">Code Ownership</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 shadow-xl backdrop-blur-md">
                <div className="text-2xl sm:text-3xl font-black text-amber-400 dark:text-amber-400 light:text-amber-700 font-display">0%</div>
                <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 font-mono mt-1">Emotional Bias</div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://wa.me/918012622119?text=Hello%20SpringWeb%2C%20I%20want%20to%20develop%20a%20custom%20Trading%20Bot%20%2F%20Quotex%20Signal%20Engine."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 text-sm font-bold py-4 px-8"
              >
                <span>Consult Bot Engineers on WhatsApp</span>
                <ArrowRight size={16} />
              </a>
              <Link
                to="/contact"
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold py-4 px-8 bg-white/10 dark:bg-white/10 light:bg-slate-100 hover:bg-white/20 light:hover:bg-slate-200 text-white dark:text-white light:text-slate-800 border border-white/20 light:border-slate-300 backdrop-blur-md rounded-xl transition-all"
              >
                <span>Request Custom Bot Specs</span>
              </Link>
            </div>
          </div>

          {/* ── Interactive Feature Matrix / Tabs ── */}
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider font-display">
                <Cpu size={14} /> Full-Stack Trading Architecture
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white dark:text-white light:text-slate-900 uppercase tracking-tight font-display">
                Engineered For Extreme Speed &amp; Precision
              </h2>
            </div>

            {/* Tabs Selector */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
              {[
                { id: 'quotex', label: 'Quotex & Binary Automation', icon: Zap },
                { id: 'tradingview', label: 'TradingView & PineScript Webhooks', icon: Radio },
                { id: 'crypto', label: 'Crypto & Forex MT4/MT5', icon: BarChart2 },
                { id: 'risk', label: 'Risk & Money Management', icon: ShieldCheck }
              ].map(tab => {
                const TabIcon = tab.icon
                const isActive = activeFeatureTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFeatureTab(tab.id as any)}
                    className={`px-5 py-3 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                        : 'bg-white/5 dark:bg-white/5 light:bg-white text-slate-300 dark:text-slate-300 light:text-slate-700 border-white/10 dark:border-white/10 light:border-slate-200 hover:border-emerald-500/30'
                    }`}
                  >
                    <TabIcon size={16} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Tab Details Content Card */}
            <div className="p-8 sm:p-12 rounded-3xl border border-white/15 dark:border-white/15 light:border-slate-200 bg-gradient-to-br from-[#080b14]/95 via-slate-900/90 to-emerald-950/20 dark:from-[#080b14]/95 dark:via-slate-900/90 dark:to-emerald-950/20 light:from-white light:via-slate-50 light:to-emerald-50/40 shadow-2xl backdrop-blur-xl">
              {activeFeatureTab === 'quotex' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  <div className="space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                      QUOTEX &amp; POCKET OPTION WEBSOCKET CORE
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-slate-900 font-display">
                      Sub-Second Automated Binary Execution
                    </h3>
                    <p className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 font-light leading-relaxed">
                      Direct connection to Quotex and Pocket Option broker feeds. The bot reads real-time candlestick feeds, validates minimum asset payout percentages (e.g. ignore any currency pair below 85% payout), and executes trades within 80ms of signal generation.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {[
                        'Automatic 1M, 2M, 5M Expiry Setting',
                        'Real-Time Live Asset Payout Filter',
                        'Smart Martingale on Next Candle or Signal',
                        'Zero Human Latency Delay (<80ms)',
                        'Simultaneous Multi-Pair Monitoring',
                        'Auto-Switch to Alternate Currency on OTC'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 dark:text-slate-200 light:text-slate-700">
                          <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-black/60 border border-emerald-500/30 font-mono text-xs text-emerald-400 space-y-3 shadow-inner">
                    <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-white/10">
                      <span>SPRINGWEB_QUOTEX_CORE_V3.log</span>
                      <span className="text-emerald-400">● LIVE (80ms)</span>
                    </div>
                    <div className="text-slate-400">[14:32:00.102] INCOMING SIGNAL: EUR/USD_OTC 1M CALL</div>
                    <div className="text-teal-300">[14:32:00.118] PAYOUT CHECK: 92% (Threshold &gt; 80% ✓)</div>
                    <div className="text-indigo-300">[14:32:00.134] RISK CALC: Step 0 (Base Amount: $10.00)</div>
                    <div className="text-emerald-400 font-bold">[14:32:00.178] ORDER PLACED #QX-892109: CALL @ 1.08450 [SUCCESS]</div>
                    <div className="text-slate-400">[14:33:00.001] TRADE RESULT: ITM (+$9.20 PROFIT) • Martingale Reset</div>
                    <div className="text-purple-300">[14:33:00.024] BROADCAST: Telegram VIP Channel Notified ✓</div>
                  </div>
                </div>
              )}

              {activeFeatureTab === 'tradingview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  <div className="space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold">
                      TRADINGVIEW &amp; PINESCRIPT AUTOMATION
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-slate-900 font-display">
                      PineScript Strategy Alert Webhooks
                    </h3>
                    <p className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 font-light leading-relaxed">
                      Convert your private PineScript indicators and TradingView strategy buy/sell alerts into non-stop execution. Our webhook bridge parses dynamic alert messages, calculates lot sizes/contracts, and routes orders directly to your brokers.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {[
                        'Custom PineScript v5 Indicator Coding',
                        'Webhook Gateway with Zero-Drop Architecture',
                        'Support for Webhook Auth Tokens & IP Whitelists',
                        'Dynamic Order Quantity & Dynamic Stop-Loss',
                        'Instant Discord & Telegram Mirroring',
                        'High Availability Cloud VPS Hosting'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 dark:text-slate-200 light:text-slate-700">
                          <CheckCircle2 size={14} className="text-indigo-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-black/60 border border-indigo-500/30 font-mono text-xs text-indigo-300 space-y-3 shadow-inner">
                    <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-white/10">
                      <span>TRADINGVIEW_WEBHOOK_BRIDGE.json</span>
                      <span className="text-indigo-400">● LISTENING</span>
                    </div>
                    <div className="text-slate-400">{`{`}</div>
                    <div className="pl-4 text-emerald-400">"ticker": "BTCUSDT",</div>
                    <div className="pl-4 text-teal-300">"action": "BUY_LONG",</div>
                    <div className="pl-4 text-amber-300">"leverage": 10,</div>
                    <div className="pl-4 text-indigo-300">"stop_loss_pct": 1.5,</div>
                    <div className="pl-4 text-purple-300">"take_profit_pct": 3.2</div>
                    <div className="text-slate-400">{`}`}</div>
                    <div className="text-emerald-400 font-bold">&gt;&gt; Executed on Binance Futures API in 112ms</div>
                  </div>
                </div>
              )}

              {activeFeatureTab === 'crypto' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  <div className="space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-bold">
                      CRYPTO EXCHANGES &amp; FOREX MT4/MT5
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-slate-900 font-display">
                      Multi-Exchange Arbitrage &amp; Grid Bots
                    </h3>
                    <p className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 font-light leading-relaxed">
                      Custom algorithmic trading bots for Binance, Bybit, KuCoin, Delta Exchange, and Forex MetaTrader 4/5. Implement grid trading, DCA accumulation, trailing stop-losses, and automated scalping strategies.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {[
                        'MetaTrader MQL4 / MQL5 Expert Advisors (EAs)',
                        'Binance & Bybit Futures API Integration',
                        'DCA (Dollar Cost Averaging) Grid Bots',
                        'Delta Exchange Option Selling Automation',
                        'Multi-Account Master & Copy Trading',
                        'Encrypted Secret Keys (Never Shared)'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 dark:text-slate-200 light:text-slate-700">
                          <CheckCircle2 size={14} className="text-teal-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-black/60 border border-teal-500/30 font-mono text-xs text-teal-300 space-y-3 shadow-inner">
                    <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-white/10">
                      <span>MT5_EXPERT_ADVISOR_STATUS</span>
                      <span className="text-teal-400">● ACTIVE</span>
                    </div>
                    <div className="text-slate-400">[MT5] Symbol: XAUUSD (Gold) | Spread: 12 pts</div>
                    <div className="text-teal-300">[MQL5] Fast EMA crossed Slow EMA (Bullish Confluence)</div>
                    <div className="text-emerald-400 font-bold">[MQL5] OrderSend: BUY 0.50 Lots @ 2354.20</div>
                    <div className="text-slate-400">[MQL5] Hard SL: 2348.00 | Dynamic Trailing Active</div>
                    <div className="text-indigo-300">[SYNC] Copied to 14 client sub-accounts simultaneously</div>
                  </div>
                </div>
              )}

              {activeFeatureTab === 'risk' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  <div className="space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
                      CAPITAL PRESERVATION &amp; SAFEGUARDS
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-slate-900 font-display">
                      Algorithmic Risk Management Engine
                    </h3>
                    <p className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 font-light leading-relaxed">
                      Never blow an account due to bad streaks. Our bots include customizable risk parameters with hard safety ceilings that automatically lock trading sessions when boundaries are reached.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {[
                        'Daily Target Profit Auto-Shutdown',
                        'Max Daily Drawdown Loss Kill-Switch',
                        'Configurable Martingale Multiplier & Max Steps',
                        'Anti-Martingale (Profit Reinvestment)',
                        'Forex Factory High-Impact News Filter',
                        'Real-Time Balance & Margin Level Guard'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 dark:text-slate-200 light:text-slate-700">
                          <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-black/60 border border-amber-500/30 font-mono text-xs text-amber-300 space-y-3 shadow-inner">
                    <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-white/10">
                      <span>RISK_ENGINE_SAFEGUARDS.cfg</span>
                      <span className="text-emerald-400">● ARMED</span>
                    </div>
                    <div className="text-slate-400">MAX_MARTINGALE_STEPS: 2 (Cap at $45.00)</div>
                    <div className="text-teal-300">DAILY_TARGET_PROFIT: +$150.00 [TARGET HIT ✓]</div>
                    <div className="text-amber-400 font-bold">SAFETY LOCK ACTIVATED: Session paused until tomorrow</div>
                    <div className="text-slate-400">TOTAL SESSION TRADES: 18 | WIN RATE: 77.7%</div>
                    <div className="text-purple-300">NOTIFICATION: Daily P&L report sent to Telegram Admin</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Investment Packages ── */}
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider font-display">
                <Sparkles size={14} /> Transparent Fixed-Price Engineering
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white dark:text-white light:text-slate-900 font-display tracking-tight uppercase">
                Trading Bot Packages
              </h2>
              <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-sm sm:text-base font-light">
                Fixed one-time pricing with zero hidden fees. Includes full source code ownership, testing on live demo/real accounts, and cloud setup.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {packages.map((pkg, idx) => (
                <div
                  key={idx}
                  className={`p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 relative ${
                    pkg.popular
                      ? 'bg-gradient-to-b from-emerald-950/40 via-slate-900/90 to-[#080b14] border-emerald-500 shadow-2xl shadow-emerald-500/15 scale-[1.03]'
                      : 'bg-[#080b14]/80 dark:bg-[#080b14]/80 light:bg-white border-white/10 dark:border-white/10 light:border-slate-200'
                  }`}
                >
                  {pkg.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold uppercase tracking-wider font-display shadow-md">
                      {pkg.badge}
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900 font-display">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-2 font-sans font-light leading-relaxed">
                        {pkg.desc}
                      </p>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-white dark:text-white light:text-slate-900 font-display">
                        {pkg.price}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {pkg.period}
                      </span>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/10 dark:border-white/10 light:border-slate-200">
                      {pkg.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
                          <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8">
                    <a
                      href={`https://wa.me/918012622119?text=Hello%20SpringWeb%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(pkg.name)}%20(${pkg.price})%20Trading%20Bot.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider font-display flex items-center justify-center gap-2 transition-all shadow-lg ${
                        pkg.popular
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
                          : 'bg-white/10 dark:bg-white/10 light:bg-slate-900 text-white dark:text-white light:text-white hover:bg-white/20'
                      }`}
                    >
                      <span>{pkg.cta}</span>
                      <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── FAQ Accordion ── */}
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <HelpCircle size={14} /> Frequently Asked Questions
              </div>
              <h2 className="text-3xl font-black text-white dark:text-white light:text-slate-900 font-display uppercase">
                Trading Bot FAQs
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 space-y-2 shadow-sm"
                >
                  <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 font-display">
                    {faq.q}
                  </h3>
                  <p className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 font-light leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA Banner ── */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-900/40 via-slate-900 to-indigo-900/40 border border-emerald-500/30 text-center space-y-6 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
              Ready to Automate Your Trading Strategy?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
              Share your strategy rules, indicator alerts, or Quotex trading goals with our engineering team for a free technical consultation and fixed-price quote.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="https://wa.me/918012622119?text=Hello%20SpringWeb%2C%20I%20want%20to%20build%20a%20Trading%20Bot%20%2F%20Quotex%20Signal%20Engine."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2 py-3.5 px-8 shadow-xl shadow-emerald-500/30 text-xs font-bold uppercase tracking-wider"
              >
                <Send size={15} />
                <span>Start Direct WhatsApp Chat</span>
              </a>
              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 text-xs font-bold uppercase tracking-wider transition-all"
              >
                Send Requirements via Form
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}

export default TradingBotDevelopment
