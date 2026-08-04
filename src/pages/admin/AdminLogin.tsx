import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginData } from '@/lib/validation'
import {
  Shield, KeyRound, Mail, Loader2, AlertCircle, ArrowLeft,
  Lock, Eye, EyeOff, Smartphone, CheckCircle2, ShieldCheck, ChevronRight
} from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

// ─── Step Types ───────────────────────────────────────────────────────────────
type LoginStep = 'credentials' | 'totp' | 'success'

export const AdminLogin: React.FC<{ initialStep?: 'credentials' | 'totp' }> = ({ initialStep = 'credentials' }) => {
  const navigate = useNavigate()
  const [loading, setLoading]     = useState(false)
  const [errorMsg, setErrorMsg]   = useState<string | null>(null)
  const [showPass, setShowPass]   = useState(false)
  const [step, setStep]           = useState<LoginStep>(initialStep)
  const [totpCode, setTotpCode]   = useState('')
  const [challengeId, setChallengeId] = useState<string | null>(null)
  const [factorId, setFactorId]   = useState<string | null>(null)
  const [pendingEmail, setPendingEmail] = useState('')

  const { user, mfaRequired, initialize, hasRole, checkMfaStatus } = useAuthStore()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema)
  })

  const isSuiteDomain = typeof window !== 'undefined' && window.location.hostname.toLowerCase().startsWith('suite.')

  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'robots')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', 'noindex, nofollow, noarchive, nosnippet')
  }, [])

  // Auto-initiate TOTP MFA challenge if user is signed in with password but needs 2FA verification
  useEffect(() => {
    const prepareMfaChallenge = async () => {
      if (user && mfaRequired) {
        setStep('totp')
        try {
          const { data: factors } = await supabase.auth.mfa.listFactors()
          const totpFactor = factors?.totp?.[0]
          if (totpFactor) {
            setFactorId(totpFactor.id)
            setPendingEmail(user.email || '')
            const { data: challenge, error: challengeErr } = await supabase.auth.mfa.challenge({
              factorId: totpFactor.id,
            })
            if (challengeErr) throw challengeErr
            setChallengeId(challenge.id)
          }
        } catch (err: any) {
          setErrorMsg(err.message || 'Failed to initialize 2FA challenge. Please try again.')
        }
      } else if (user && !mfaRequired) {
        const isStaff = hasRole('super_admin') || hasRole('admin') || hasRole('editor') ||
                        hasRole('sales') || hasRole('support') || hasRole('content_writer')
        if (isStaff) navigate(isSuiteDomain ? '/dashboard' : '/admin/dashboard')
      }
    }

    prepareMfaChallenge()
  }, [user, mfaRequired])

  // ── Step 1: Sign in with email/password ─────────────────────────────────────
  const onSubmit = async (data: LoginData) => {
    setLoading(true)
    setErrorMsg(null)

    if (!isSupabaseConfigured) {
      setErrorMsg('Database not configured. Contact your administrator.')
      setLoading(false)
      return
    }

    try {
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) throw error

      // Check AAL (Assurance Level) — if AAL2 is required, MFA must be verified
      const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      const currentLevel = aalData?.currentLevel
      const nextLevel    = aalData?.nextLevel

      if (nextLevel === 'aal2' && currentLevel !== 'aal2') {
        // MFA is enrolled — need TOTP verification
        const { data: factors } = await supabase.auth.mfa.listFactors()
        const totpFactor = factors?.totp?.[0]

        if (totpFactor) {
          setFactorId(totpFactor.id)
          setPendingEmail(data.email)

          const { data: challenge, error: challengeErr } = await supabase.auth.mfa.challenge({
            factorId: totpFactor.id,
          })
          if (challengeErr) throw challengeErr

          setChallengeId(challenge.id)
          setStep('totp')
        }
      } else {
        // No MFA enrolled — standard login
        await completeLogin()
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials. Check your email and password.')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 2: Verify TOTP code ─────────────────────────────────────────────────
  const verifyTotp = async (codeToVerify?: string) => {
    const code = (codeToVerify || totpCode).replace(/\s/g, '')
    if (!factorId || !challengeId || code.length < 6) return
    setLoading(true)
    setErrorMsg(null)

    try {
      const { error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code,
      })

      if (error) throw error

      await completeLogin()
    } catch (err: any) {
      setErrorMsg(err.message?.toLowerCase().includes('invalid') || err.message?.toLowerCase().includes('expired')
        ? 'Invalid code. Check your authenticator app and try again.'
        : err.message || 'TOTP verification failed.'
      )
      setTotpCode('')
    } finally {
      setLoading(false)
    }
  }

  // ── Complete login after all steps pass ────────────────────────────────────
  const completeLogin = async () => {
    await initialize()

    const isStaff = useAuthStore.getState().hasRole('super_admin') ||
                    useAuthStore.getState().hasRole('admin') ||
                    useAuthStore.getState().hasRole('editor') ||
                    useAuthStore.getState().hasRole('sales') ||
                    useAuthStore.getState().hasRole('support') ||
                    useAuthStore.getState().hasRole('content_writer')

    if (isStaff) {
      setStep('success')
      setTimeout(() => navigate(isSuiteDomain ? '/dashboard' : '/admin/dashboard'), 800)
    } else {
      await supabase.auth.signOut()
      setErrorMsg('Access Restricted: This console is reserved for internal staff members.')
      setStep('credentials')
    }
  }

  // ── Handle auto-submit when 6 digits entered ──────────────────────────────
  const handleTotpInput = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '').slice(0, 6)
    setTotpCode(cleaned)
    if (cleaned.length === 6) {
      verifyTotp(cleaned)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#040509] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.04),transparent_70%)] pointer-events-none" />

      <div className="relative w-full max-w-[420px] space-y-6">

        {/* Logo + header */}
        <div className="text-center flex flex-col items-center gap-3">
          <Logo size="lg" />
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-bold uppercase tracking-widest mb-2">
              <Lock size={10} />
              <span>Restricted Staff Portal</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">SpringWeb Operations Suite</h1>
            <p className="text-[13px] text-slate-500 mt-1">Authorized personnel only</p>
          </div>
        </div>

        {/* ── Step Indicator ── */}
        <div className="flex items-center justify-center gap-2">
          {[
            { id: 'credentials', label: 'Credentials', icon: KeyRound },
            { id: 'totp',        label: 'Authenticator', icon: Smartphone },
            { id: 'success',     label: 'Access',        icon: ShieldCheck },
          ].map((s, i) => {
            const steps: LoginStep[] = ['credentials', 'totp', 'success']
            const stepIdx = steps.indexOf(s.id as LoginStep)
            const currentIdx = steps.indexOf(step)
            const isDone    = stepIdx < currentIdx
            const isActive  = stepIdx === currentIdx
            const Icon = s.icon
            return (
              <React.Fragment key={s.id}>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all
                  ${isActive ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' :
                    isDone ? 'bg-emerald-500/8 text-emerald-500/60 border border-emerald-500/15' :
                    'bg-white/[0.03] text-slate-600 border border-white/[0.07]'}`}
                >
                  {isDone ? <CheckCircle2 size={10} /> : <Icon size={10} />}
                  {s.label}
                </div>
                {i < 2 && <ChevronRight size={11} className="text-slate-700" />}
              </React.Fragment>
            )
          })}
        </div>

        {/* ── Login Card ── */}
        <div className="bg-[#06080f] border border-white/[0.08] rounded-2xl p-7 space-y-5 shadow-2xl shadow-black/50">

          {/* Error */}
          {errorMsg && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/8 border border-rose-500/20 animate-in slide-in-from-top-2 duration-200">
              <AlertCircle size={15} className="text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-300 leading-relaxed">{errorMsg}</p>
            </div>
          )}

          {/* ════ STEP 1: Credentials ════ */}
          {step === 'credentials' && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail size={11} /> Staff Email Address
                </label>
                <input
                  type="email" {...register('email')}
                  className="admin-input" placeholder="admin@springwebsolutions.in" autoComplete="email"
                />
                {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound size={11} /> Security Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'} {...register('password')}
                    className="admin-input pr-10" placeholder="••••••••••••" autoComplete="current-password"
                  />
                  <button
                    type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] text-rose-400 mt-1">{errors.password.message}</p>}
              </div>

              <button
                type="submit" disabled={loading}
                className="btn-admin-primary w-full py-2.5 mt-2 text-sm shadow-lg shadow-emerald-500/20 justify-center"
              >
                {loading
                  ? <><Loader2 size={15} className="animate-spin" /><span>Verifying…</span></>
                  : <><Shield size={15} /><span>Sign In to Control Center</span></>}
              </button>
            </form>
          )}

          {/* ════ STEP 2: TOTP Verification ════ */}
          {step === 'totp' && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Authenticator icon */}
              <div className="flex flex-col items-center gap-3 pb-2">
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center">
                    <Smartphone size={28} className="text-emerald-400" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-400 border-2 border-[#06080f] flex items-center justify-center">
                    <Shield size={10} className="text-black" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
                  <p className="text-xs text-slate-500 mt-1">Open your authenticator app and enter the 6-digit code</p>
                </div>
              </div>

              {/* 6-digit OTP input */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center">
                  Authenticator Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={totpCode}
                  onChange={e => handleTotpInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && verifyTotp()}
                  autoFocus
                  className="admin-input text-center text-2xl font-black tracking-[0.5em] py-4 placeholder:tracking-normal placeholder:font-normal placeholder:text-base"
                  placeholder="000000"
                />
                <p className="text-[10px] text-slate-600 text-center">
                  Code refreshes every 30 seconds — use your current code
                </p>
              </div>

              <button
                onClick={() => verifyTotp()}
                disabled={loading || totpCode.length < 6}
                className="btn-admin-primary w-full py-2.5 text-sm justify-center shadow-lg shadow-emerald-500/20"
              >
                {loading
                  ? <><Loader2 size={15} className="animate-spin" /><span>Verifying code…</span></>
                  : <><ShieldCheck size={15} /><span>Verify & Access Suite</span></>}
              </button>

              <button
                onClick={() => { setStep('credentials'); setTotpCode(''); setErrorMsg(null) }}
                className="w-full text-xs text-slate-600 hover:text-slate-400 transition-colors text-center py-1"
              >
                ← Back to credentials
              </button>
            </div>
          )}

          {/* ════ STEP 3: Success ════ */}
          {step === 'success' && (
            <div className="flex flex-col items-center gap-4 py-4 animate-in zoom-in-75 duration-300">
              <div className="h-16 w-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 size={32} className="text-emerald-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-white">Authentication Successful</p>
                <p className="text-xs text-slate-500 mt-1">Redirecting to Operations Suite…</p>
              </div>
              <Loader2 size={16} className="animate-spin text-emerald-400" />
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'credentials' && (
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-300 transition-colors">
              <ArrowLeft size={12} /> Return to Website Home
            </Link>
            <div className="text-[11px] text-slate-700">
              Looking for client login?{' '}
              <Link to="/login" className="text-slate-500 hover:text-slate-300 transition-colors">Client Portal →</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminLogin
