import React, { useState } from 'react'
import { MessageSquare, X, Send, Phone, CheckCircle2, Sparkles, MessageCircle } from 'lucide-react'

export const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')

  const whatsappNumber = '918012622119'

  const quickMessages = [
    '👋 Hi! I need a quote for a new website.',
    '⚡ Hi! I want to build custom CRM / ERP software.',
    '🚀 Hi! I need Technical SEO & Business Automation.',
    '❓ Hi! I have a question about your services.'
  ]

  const handleSend = (textToSend?: string) => {
    const text = textToSend || message || 'Hi SpringWeb Solutions! I would like to inquire about your web & software services.'
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 rounded-2xl bg-[#080b14] border border-white/10 shadow-2xl shadow-emerald-900/20 overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white backdrop-blur-md">
                  <MessageCircle size={22} className="text-white" />
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-emerald-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-tight">SpringWeb Live Support</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-300" /> Online • Usually replies in minutes
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 space-y-3 bg-[#040509]">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <Sparkles size={13} /> Welcome to Spring Web Solutions!
              </div>
              <p>
                How can our engineering team help you today? Select a quick inquiry or send us a message directly on WhatsApp.
              </p>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider">Quick Inquiries</span>
              <div className="grid grid-cols-1 gap-1.5">
                {quickMessages.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="text-left text-xs p-2.5 rounded-xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-400 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <span className="truncate">{prompt}</span>
                    <Send size={12} className="opacity-0 group-hover:opacity-100 text-emerald-400 shrink-0 ml-2 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                onClick={() => handleSend()}
                className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all cursor-pointer shrink-0"
              >
                <Send size={14} />
              </button>
            </div>

            {/* Call Action */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span>Need immediate phone assistance?</span>
              <a
                href="tel:+918012622119"
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
              >
                <Phone size={11} /> Call Us Directly
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center space-x-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        {isOpen ? (
          <span className="flex items-center gap-1.5">
            <X size={16} /> Close Chat
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-slate-950">
            <MessageSquare size={16} className="fill-slate-950 text-slate-950" /> Live Chat & WhatsApp
          </span>
        )}
      </button>
    </div>
  )
}
export default WhatsAppWidget
