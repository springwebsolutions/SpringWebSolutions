import React, { useState } from 'react'
import { MessageSquare, X, Send, Phone, CheckCircle2, Sparkles, MessageCircle, ArrowUpRight } from 'lucide-react'

export const FloatingContactWidgets: React.FC = () => {
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false)
  const [message, setMessage] = useState('')

  const whatsappNumber = '918012622119'

  const quickMessages = [
    '👋 Hi! I need a quote for a new website.',
    '⚡ Hi! I want to build custom CRM / ERP software.',
    '🚀 Hi! I need Technical SEO & Business Automation.',
    '❓ Hi! I have a question about your services.'
  ]

  const handleWhatsAppClick = (customText?: string) => {
    const text = customText || 'Hi SpringWeb Solutions! I would like to discuss a web development or software project.'
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const handleSendChat = (textToSend?: string) => {
    const text = textToSend || message || 'Hi SpringWeb Solutions! I would like to inquire about your services.'
    handleWhatsAppClick(text)
    setIsLiveChatOpen(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3 pointer-events-auto">
      
      {/* Live Chat Modal Drawer */}
      {isLiveChatOpen && (
        <div className="mb-2 w-80 sm:w-96 rounded-2xl bg-[#080b14] border border-white/10 shadow-2xl shadow-emerald-900/30 overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-600 via-teal-600 to-emerald-500 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white backdrop-blur-md">
                  <MessageSquare size={20} className="text-white" />
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-emerald-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-tight">SpringWeb Instant Support</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-300" /> Engineer Online • Immediate Reply
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsLiveChatOpen(false)}
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
                Select a quick prompt or type your query below to connect with our solution engineers directly.
              </p>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider">Quick Inquiries</span>
              <div className="grid grid-cols-1 gap-1.5">
                {quickMessages.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendChat(prompt)}
                    className="text-left text-xs p-2.5 rounded-xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-400 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <span className="truncate">{prompt}</span>
                    <Send size={12} className="opacity-0 group-hover:opacity-100 text-emerald-400 shrink-0 ml-2 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>

            {/* Input Box */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Type your message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                onClick={() => handleSendChat()}
                className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all cursor-pointer shrink-0"
              >
                <Send size={14} />
              </button>
            </div>

            {/* Direct Call */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span>Direct Phone Line:</span>
              <a
                href="tel:+918012622119"
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
              >
                <Phone size={11} /> +91 80126 22119
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Buttons Stack (TWO SEPARATE BUTTONS) */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
        
        {/* BUTTON 1: WhatsApp Button */}
        <button
          onClick={() => handleWhatsAppClick()}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold text-xs shadow-lg shadow-emerald-600/30 hover:scale-105 transition-all duration-300 cursor-pointer"
          title="Direct WhatsApp Chat"
        >
          <MessageCircle size={17} className="fill-slate-950 text-[#25D366]" />
          <span>WhatsApp Us</span>
          <ArrowUpRight size={13} className="text-slate-950 opacity-80" />
        </button>

        {/* BUTTON 2: Live Support Chat Button */}
        <button
          onClick={() => setIsLiveChatOpen(!isLiveChatOpen)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300 cursor-pointer border border-white/20"
          title="Open Live Chat Support"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
          {isLiveChatOpen ? (
            <span className="flex items-center gap-1">
              <X size={15} /> Close Chat
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <MessageSquare size={15} /> Live Support
            </span>
          )}
        </button>

      </div>
    </div>
  )
}
export default FloatingContactWidgets
