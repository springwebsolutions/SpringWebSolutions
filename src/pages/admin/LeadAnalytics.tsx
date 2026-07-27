import React from 'react'
import { 
  TrendingUp, Users, DollarSign, Target, Award, ArrowUpRight, 
  Sparkles, CheckCircle2, BarChart2, PieChart, Activity
} from 'lucide-react'

export const LeadAnalytics: React.FC = () => {
  const metrics = [
    { label: 'Total Lead Inquiries', val: '142', change: '+24% this month', icon: Users, color: 'emerald' },
    { label: 'Lead Conversion Rate', val: '38.5%', change: '+5.2% vs target', icon: Target, color: 'indigo' },
    { label: 'Estimated Pipeline Value', val: '₹42,50,000', change: '18 Active Proposals', icon: DollarSign, color: 'teal' },
    { label: 'Avg Response Time', val: '14 Mins', change: '99.2% SLA Compliance', icon: Activity, color: 'purple' }
  ]

  const serviceBreakdown = [
    { name: 'Custom Web Apps (React/Next.js)', share: '42%', leads: 60, val: '₹18,00,000' },
    { name: 'Mobile Apps (Android Kotlin / iOS)', share: '24%', leads: 34, val: '₹10,50,000' },
    { name: 'Windows Desktop Software (C# .NET)', share: '18%', leads: 25, val: '₹8,00,000' },
    { name: 'Technical SEO & Lead Generation', share: '16%', leads: 23, val: '₹6,00,000' }
  ]

  const funnelStages = [
    { stage: '1. New Consultation Submitted', count: 142, pct: '100%' },
    { stage: '2. Discovery Call Completed', count: 98, pct: '69%' },
    { stage: '3. Technical Architecture Proposal', count: 64, pct: '45%' },
    { stage: '4. Closed Won / Contract Signed', count: 55, pct: '38.7%' }
  ]

  return (
    <div className="space-y-8 p-6 sm:p-8 max-w-7xl mx-auto text-white">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/20">
            <TrendingUp size={13} /> Business Intelligence &amp; Revenue
          </div>
          <h1 className="text-3xl font-black font-display tracking-tight uppercase text-white">Lead Conversion Analytics</h1>
          <p className="text-sm text-slate-400 mt-1 font-light">Real-time pipeline metrics, service interest distribution, and consultation conversion rates.</p>
        </div>
      </div>

      {/* Top 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="p-6 rounded-3xl glass-panel border border-white/10 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">{m.label}</span>
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-emerald-400">
                <m.icon size={18} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-display text-white">{m.val}</div>
            <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <ArrowUpRight size={12} /> {m.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Conversion Funnel + Service Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Conversion Funnel */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-panel border border-white/10 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 font-bold text-sm text-white uppercase tracking-tight font-display">
              <Target size={16} className="text-emerald-400" />
              <span>Consultation Conversion Funnel</span>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold">38.7% Win Rate</span>
          </div>

          <div className="space-y-4">
            {funnelStages.map((st, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-200">{st.stage}</span>
                  <span className="text-emerald-400 font-mono font-bold">{st.count} Leads ({st.pct})</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: st.pct }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Category Revenue Distribution */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-panel border border-white/10 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 font-bold text-sm text-white uppercase tracking-tight font-display">
              <PieChart size={16} className="text-emerald-400" />
              <span>Service Category Breakdown</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Top Revenue Drivers</span>
          </div>

          <div className="space-y-4">
            {serviceBreakdown.map((sb, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-white">{sb.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono">{sb.leads} Inquiries</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400 font-mono">{sb.val}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{sb.share} share</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}
