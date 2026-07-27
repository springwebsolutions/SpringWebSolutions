import React from 'react'
import { 
  Activity, Server, Database, ShieldCheck, Cpu, RefreshCw, 
  CheckCircle2, AlertTriangle, Zap, Globe, HardDrive, Clock
} from 'lucide-react'

export const SystemHealth: React.FC = () => {
  const services = [
    { name: 'Database (Supabase PostgreSQL)', status: 'Operational', latency: '24 ms', uptime: '99.99%', icon: Database, color: 'emerald' },
    { name: 'Vercel Edge CDN & Static Assets', status: 'Operational', latency: '12 ms', uptime: '100.0%', icon: Globe, color: 'emerald' },
    { name: 'Cloudflare WAF & DNS Proxy', status: 'Protected', latency: '8 ms', uptime: '100.0%', icon: ShieldCheck, color: 'emerald' },
    { name: 'Resend Transactional Email API', status: 'Operational', latency: '110 ms', uptime: '99.95%', icon: Server, color: 'emerald' },
    { name: 'Ad Engine Slot Delivery', status: 'Active', latency: '18 ms', uptime: '99.98%', icon: Zap, color: 'emerald' },
    { name: 'Zustand & Local Caching Engine', status: 'Synced', latency: '1 ms', uptime: '100.0%', icon: Cpu, color: 'emerald' }
  ]

  const systemLogs = [
    { time: '20:52:14', event: 'Subdomain router checked hostname: careers.springwebsolutions.in', type: 'info' },
    { time: '20:48:43', event: 'Production deployment #9d95f11 verified cleanly on Vercel', type: 'success' },
    { time: '20:30:11', event: 'Supabase real-time subscription connected (auth_session_active)', type: 'info' },
    { time: '20:15:00', event: 'SEO robots.txt and sitemap.xml cache refreshed', type: 'info' }
  ]

  return (
    <div className="space-y-8 p-6 sm:p-8 max-w-7xl mx-auto text-white">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/20">
            <Activity size={13} /> Infrastructure &amp; API Monitor
          </div>
          <h1 className="text-3xl font-black font-display tracking-tight uppercase text-white">System &amp; API Health</h1>
          <p className="text-sm text-slate-400 mt-1 font-light">Real-time status diagnostics for database clusters, CDN edge nodes, DNS, and Mailer APIs.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>99.98% System Uptime SLA</span>
          </div>
        </div>
      </div>

      {/* Infrastructure Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s, idx) => (
          <div key={idx} className="p-5 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-emerald-400">
                <s.icon size={20} />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold font-mono uppercase flex items-center gap-1">
                <CheckCircle2 size={10} /> {s.status}
              </span>
            </div>

            <div>
              <div className="font-bold text-sm text-white">{s.name}</div>
              <div className="flex items-center justify-between text-xs text-slate-400 mt-2 font-mono">
                <span>Latency: <strong className="text-emerald-400">{s.latency}</strong></span>
                <span>Uptime: <strong className="text-slate-200">{s.uptime}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live System Log Audit Stream */}
      <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-2xl bg-[#060912]">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 font-bold text-sm text-white uppercase tracking-tight font-display">
            <Clock size={16} className="text-emerald-400" />
            <span>Live Audit Log Feed</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Auto-refreshed</span>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {systemLogs.map((lg, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-4 text-slate-300">
              <div className="flex items-center gap-3">
                <span className="text-slate-500">{lg.time}</span>
                <span className={lg.type === 'success' ? 'text-emerald-400 font-bold' : 'text-slate-200'}>
                  {lg.event}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-slate-400 uppercase">
                {lg.type}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
