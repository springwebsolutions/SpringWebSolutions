import React, { useState } from 'react'
import { CreditCard, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react'
import { displayRazorpayCheckout } from '@/lib/razorpayService'

interface RazorpayButtonProps {
  amountInRupees: number
  productName: string
  productDescription?: string
  buttonText?: string
  className?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  onSuccess?: (paymentId: string) => void
}

export const RazorpayButton: React.FC<RazorpayButtonProps> = ({
  amountInRupees,
  productName,
  productDescription,
  buttonText = 'Pay Securely with Razorpay',
  className = '',
  customerName,
  customerEmail,
  customerPhone,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false)
  const [paymentDone, setPaymentDone] = useState(false)

  const handlePay = async () => {
    setLoading(true)
    await displayRazorpayCheckout({
      amountInRupees,
      productName,
      productDescription,
      customerName,
      customerEmail,
      customerPhone,
      onSuccess: (data) => {
        setLoading(false)
        setPaymentDone(true)
        if (onSuccess) onSuccess(data.paymentId)
      },
      onFailure: (err) => {
        setLoading(false)
        console.warn('[Razorpay Payment Cancelled / Failed]:', err)
      }
    })
  }

  if (paymentDone) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold font-mono">
        <CheckCircle2 size={16} />
        <span>Payment Verified ({productName})</span>
      </div>
    )
  }

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 ${className}`}
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>Opening Razorpay Checkout…</span>
        </>
      ) : (
        <>
          <CreditCard size={16} />
          <span>{buttonText} — ₹{amountInRupees.toLocaleString('en-IN')}</span>
          <ShieldCheck size={14} className="text-emerald-200 opacity-80" />
        </>
      )}
    </button>
  )
}

export default RazorpayButton
