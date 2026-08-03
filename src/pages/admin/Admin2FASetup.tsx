import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import {
  Smartphone, Shield, ShieldCheck, ShieldOff, QrCode, KeyRound,
  Loader2, CheckCircle2, AlertCircle, AlertTriangle, Copy, ArrowLeft,
  RefreshCw, Lock, Unlock, Info, Eye, EyeOff, Trash2
} from 'lucide-react'

// ─── QR Code display using native browser API ────────────────────────────────
// Uses a public QR generation service (no npm dependency needed)
const QRDisplay: React.FC<{ uri: string }> = ({ uri }) => {
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(uri)}&bgcolor=040509&color=10b981&margin=12`
  return (
    <div className="relative mx-auto w-[200px] h-[200px]">
      <div className="absolute inset-0 rounded-2xl bg-[#040509] border border-emerald-500/20 overflow-hidden">
        <img src={src} alt="TOTP QR Code" className="w-full h-full object-contain" />
      </div>
      {/* Corner accents */}
      <div className="absolute top-1.5 left-1.5 h-4 w-4 border-t-2 border-l-2 border-emerald-400 rounded-tl-md" />
      <div className="absolute top-1.5 right-1.5 h-4 w-4 border-t-2 border-r-2 border-emerald-400 rounded-tr-md" />
      <div className="absolute bottom-1.5 left-1.5 h-4 w-4 border-b-2 border-l-2 border-emerald-400 rounded-bl-md" />
      <div className="absolute bottom-1.5 right-1.5 h-4 w-4 border-b-2 border-r-2 border-emerald-400 rounded-br-md" />
    </div>
  )
}

// ─── Main 2FA Setup Component ─────────────────────────────────────────────────
export const Admin2FASetup: React.FC = () => {
  const { user } = useAuthStore()

  // Enrollment state
  const [enrolling, setEnrolling]       = useState(false)
  const [factorId, setFactorId]         = useState<string | null>(null)
  const [qrUri, setQrUri]               = useState<string | null>(null)
  const [secret, setSecret]             = useState<string | null>(null)
  const [showSecret, setShowSecret]     = useState(false)
  const [verifyCode, setVerifyCode]     = useState('')
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [verifyError, setVerifyError]   = useState<string | null>(null)
  const [verified, setVerified]         = useState(false)

  // Enrolled factor state
  const [enrolledFactors, setEnrolledFactors] = useState<any[]>([])
  const [loadingFactors, setLoadingFactors]   = useState(true)
  const [removeLoading, setRemoveLoading]     = useState(false)
  const [removeConfirm, setRemoveConfirm]     = useState(false)
  const [removeCode, setRemoveCode]           = useState('')
  const [removeError, setRemoveError]         = useState<string | null>(null)
  const [copied, setCopied]                   = useState(false)

  const isSuiteDomain = typeof window !== 'undefined' && window.location.hostname.toLowerCase().startsWith('suite.')
  const settingsPrefix = isSuiteDomain ? '/settings' : '/admin/settings'

  // ── Load existing factors ──────────────────────────────────────────────────
  const loadFactors = async () => {
    if (!isSupabaseConfigured) return
    setLoadingFactors(true)
    try {
      const { data } = await supabase.auth.mfa.listFactors()
      setEnrolledFactors(data?.totp || [])
    } catch {}
    setLoadingFactors(false)
  }

  useEffect(() => { loadFactors() }, [])

  // ── Start TOTP enrollment ──────────────────────────────────────────────────
  const startEnrollment = async () => {
    setEnrolling(true)
    setVerifyError(null)
    setVerifyCode('')
    setVerified(false)

    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: `SpringWeb Suite (${user?.email || 'Admin'})`,
      })
      if (error) throw error

      setFactorId(data.id)
      setQrUri(data.totp.qr_code)
      setSecret(data.totp.secret)
    } catch (err: any) {
      setVerifyError(err.message || 'Failed to start enrollment.')
    }
  }

  // ── Verify code and complete enrollment ───────────────────────────────────
  const completeEnrollment = async () => {
    if (!factorId || verifyCode.replace(/\s/g, '').length < 6) return
    setVerifyLoading(true)
    setVerifyError(null)

    try {
      // Challenge
      const { data: challenge, error: challengeErr } = await supabase.auth.mfa.challenge({
        factorId,
      })
      if (challengeErr) throw challengeErr

      // Verify
      const { error: verifyErr } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: verifyCode.replace(/\s/g, ''),
      })
      if (verifyErr) throw verifyErr

      setVerified(true)
      setEnrolling(false)
      setQrUri(null)
      setSecret(null)
      setFactorId(null)
      setVerifyCode('')
      await loadFactors()
    } catch (err: any) {
      setVerifyError(
        err.message?.toLowerCase().includes('invalid')
          ? 'Invalid code — check your authenticator app and try the current code.'
          : err.message || 'Verification failed.'
      )
      setVerifyCode('')
    } finally {
      setVerifyLoading(false)
    }
  }

  // ── Remove (unenroll) factor ───────────────────────────────────────────────
  const removeFactor = async (fid: string) => {
    if (!removeCode || removeCode.replace(/\s/g, '').length < 6) {
      setRemoveError('Enter your current TOTP code to confirm removal.')
      return
    }
    setRemoveLoading(true)
    setRemoveError(null)

    try {
      // Must verify before unenrolling to confirm intent
      const { data: challenge } = await supabase.auth.mfa.challenge({ factorId: fid })
      if (!challenge) throw new Error('Could not create challenge')

      const { error: verifyErr } = await supabase.auth.mfa.verify({
        factorId: fid,
        challengeId: challenge.id,
        code: removeCode.replace(/\s/g, ''),
      })
      if (verifyErr) throw new Error('Invalid code. Confirm with your current authenticator code.')

      const { error } = await supabase.auth.mfa.unenroll({ factorId: fid })
      if (error) throw error

      setRemoveConfirm(false)
      setRemoveCode('')
      await loadFactors()
    } catch (err: any) {
      setRemoveError(err.message || 'Failed to remove factor.')
    } finally {
      setRemoveLoading(false)
    }
  }

  const copySecret = async () => {
    if (!secret) return
    await navigator.clipboard.writeText(secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleVerifyInput = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '').slice(0, 6)
    setVerifyCode(cleaned)
    if (cleaned.length === 6) setTimeout(() => completeEnrollment(), 200)
  }

  const is2FAEnabled = enrolledFactors.length > 0

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-10">

      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link
          to={settingsPrefix}
          className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] text-slate-500 hover:text-white transition-all"
        >
          <ArrowLeft size={15} />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield size={18} className="text-emerald-400" />
            Two-Factor Authentication
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Protect your admin account with an authenticator app (TOTP)</p>
        </div>
      </div>

      {/* ── Status Card ── */}
      <div className={`relative overflow-hidden rounded-2xl border p-5 ${
        is2FAEnabled
          ? 'bg-emerald-500/5 border-emerald-500/20'
          : 'bg-[#07090f] border-white/[0.07]'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
            is2FAEnabled ? 'bg-emerald-500/15 border border-emerald-500/25' : 'bg-rose-500/10 border border-rose-500/20'
          }`}>
            {is2FAEnabled
              ? <ShieldCheck size={22} className="text-emerald-400" />
              : <ShieldOff size={22} className="text-rose-400" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                2FA is {is2FAEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                is2FAEnabled
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>
                {is2FAEnabled ? '🔒 ACTIVE' : '⚠️ INACTIVE'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {is2FAEnabled
                ? 'Your account requires an authenticator code at every sign-in. Your account is protected against unauthorized access.'
                : 'Without 2FA, your account is protected only by your password. Enable it for maximum security.'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Enrolled Factors ── */}
      {!loadingFactors && is2FAEnabled && (
        <div className="bg-[#07090f] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.05]">
            <h3 className="text-sm font-bold text-white">Active Authenticator</h3>
            <p className="text-[11px] text-slate-600 mt-0.5">Your enrolled TOTP factor</p>
          </div>
          <div className="p-4 space-y-3">
            {enrolledFactors.map(factor => (
              <div key={factor.id} className="flex items-center gap-3 p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Smartphone size={16} className="text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200">{factor.friendly_name || 'Authenticator App'}</div>
                  <div className="text-[10px] text-slate-600 font-mono">
                    ID: {factor.id.slice(0, 8)}… · Added {new Date(factor.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <button
                  onClick={() => { setRemoveConfirm(true); setRemoveError(null); setRemoveCode('') }}
                  className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/15 transition-all"
                  title="Remove this factor"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Remove confirm panel */}
          {removeConfirm && (
            <div className="border-t border-white/[0.06] p-4 space-y-3 bg-rose-500/5">
              <div className="flex items-start gap-2">
                <AlertTriangle size={14} className="text-rose-400 mt-0.5 shrink-0" />
                <div className="text-xs text-rose-300">
                  <span className="font-bold">Remove 2FA?</span> This will disable two-factor authentication.
                  Enter your current authenticator code to confirm.
                </div>
              </div>
              <input
                type="text" inputMode="numeric" maxLength={6}
                value={removeCode}
                onChange={e => { setRemoveCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6)); setRemoveError(null) }}
                placeholder="Enter 6-digit code"
                className="admin-input text-center tracking-[0.4em] font-mono"
                autoFocus
              />
              {removeError && (
                <p className="text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle size={11} /> {removeError}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => enrolledFactors[0] && removeFactor(enrolledFactors[0].id)}
                  disabled={removeLoading || removeCode.length < 6}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/15 border border-rose-500/25 text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition-all disabled:opacity-40"
                >
                  {removeLoading ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  Remove 2FA
                </button>
                <button
                  onClick={() => { setRemoveConfirm(false); setRemoveCode(''); setRemoveError(null) }}
                  className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-400 text-xs font-medium hover:bg-white/[0.07] transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Success message after verified */}
      {verified && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20 animate-in slide-in-from-bottom-2 duration-300">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <p className="text-xs text-emerald-300 font-semibold">
            ✅ 2FA enabled successfully! Your next sign-in will require an authenticator code.
          </p>
        </div>
      )}

      {/* ── Enrollment Flow ── */}
      {!is2FAEnabled && !enrolling && (
        <div className="bg-[#07090f] border border-white/[0.07] rounded-2xl p-6 space-y-5">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-indigo-500/8 border border-indigo-500/20">
            <Info size={14} className="text-indigo-400 mt-0.5 shrink-0" />
            <div className="text-xs text-indigo-300 leading-relaxed space-y-1">
              <p className="font-semibold">How TOTP 2FA works:</p>
              <ol className="list-decimal list-inside space-y-0.5 text-indigo-300/80">
                <li>Scan the QR code with <strong>Google Authenticator</strong>, <strong>Authy</strong>, or any TOTP app</li>
                <li>The app generates a new 6-digit code every 30 seconds</li>
                <li>Enter the code at each login after your password</li>
                <li>Even if your password is stolen, your account stays protected</li>
              </ol>
            </div>
          </div>

          <button
            onClick={startEnrollment}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35"
          >
            <Smartphone size={16} />
            Enable Two-Factor Authentication
          </button>
        </div>
      )}

      {/* ── Enrollment: QR Code + Verify ── */}
      {enrolling && qrUri && (
        <div className="bg-[#07090f] border border-white/[0.07] rounded-2xl overflow-hidden animate-in fade-in duration-300">
          {/* Step 1: Scan */}
          <div className="p-6 space-y-5">
            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold text-white flex items-center justify-center gap-2">
                <QrCode size={15} className="text-emerald-400" />
                Step 1 — Scan this QR Code
              </h3>
              <p className="text-xs text-slate-500">Open your authenticator app and scan</p>
            </div>

            <div className="flex justify-center">
              <QRDisplay uri={qrUri} />
            </div>

            {/* Manual secret */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Can't scan? Enter manually:</span>
                <button onClick={() => setShowSecret(!showSecret)} className="text-[10px] text-slate-600 hover:text-slate-400 flex items-center gap-1">
                  {showSecret ? <EyeOff size={10} /> : <Eye size={10} />}
                  {showSecret ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <div className={`admin-input font-mono text-xs tracking-widest ${!showSecret && 'blur-sm select-none'}`}>
                  {secret}
                </div>
                {showSecret && (
                  <button
                    onClick={copySecret}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] text-slate-500 hover:text-slate-200 transition-all"
                  >
                    {copied ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Verify */}
          <div className="border-t border-white/[0.05] p-6 space-y-4 bg-white/[0.01]">
            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold text-white flex items-center justify-center gap-2">
                <KeyRound size={15} className="text-emerald-400" />
                Step 2 — Enter the 6-Digit Code
              </h3>
              <p className="text-xs text-slate-500">Enter the code shown in your authenticator app to confirm setup</p>
            </div>

            <input
              type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6}
              value={verifyCode}
              onChange={e => handleVerifyInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && completeEnrollment()}
              autoFocus
              className="admin-input text-center text-2xl font-black tracking-[0.5em] py-4 placeholder:tracking-normal placeholder:font-normal placeholder:text-base"
              placeholder="000000"
            />

            {verifyError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/8 border border-rose-500/20">
                <AlertCircle size={13} className="text-rose-400 shrink-0" />
                <p className="text-xs text-rose-300">{verifyError}</p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={completeEnrollment}
                disabled={verifyLoading || verifyCode.replace(/\s/g, '').length < 6}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-40"
              >
                {verifyLoading ? <Loader2 size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
                {verifyLoading ? 'Verifying…' : 'Confirm & Enable 2FA'}
              </button>
              <button
                onClick={() => { setEnrolling(false); setQrUri(null); setSecret(null); setVerifyCode(''); setVerifyError(null) }}
                className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-400 text-xs font-medium hover:bg-white/[0.07] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Security Tips ── */}
      <div className="bg-[#07090f] border border-white/[0.05] rounded-2xl p-5 space-y-3">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Lock size={11} /> Security Best Practices
        </h4>
        <ul className="space-y-2">
          {[
            { icon: Smartphone, text: 'Use Google Authenticator, Authy, or Microsoft Authenticator' },
            { icon: Shield,     text: 'Store your backup codes in a secure password manager' },
            { icon: Lock,       text: 'Never share your TOTP codes with anyone, including SpringWeb staff' },
            { icon: RefreshCw,  text: 'If you lose access to your authenticator, contact your Super Admin' },
          ].map(({ icon: Icon, text }, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-slate-500">
              <Icon size={12} className="text-slate-700 mt-0.5 shrink-0" />
              {text}
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}

export default Admin2FASetup
