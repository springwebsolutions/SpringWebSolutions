import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginData } from '@/lib/validation'
import { Shield, KeyRound, Mail, Loader2, AlertCircle, ArrowLeft, Zap, Lock, Eye, EyeOff } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showPass, setShowPass] = useState(false)
  
  const { user, initialize, hasRole } = useAuthStore()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema)
  })

  const isSuiteDomain = typeof window !== 'undefined' && window.location.hostname.toLowerCase().startsWith('suite.')

  useEffect(() => {
    if (user) {
      const isStaff = hasRole('super_admin') || hasRole('admin') || hasRole('editor') || 
                      hasRole('sales') || hasRole('support') || hasRole('content_writer')
      if (isStaff) {
        navigate(isSuiteDomain ? '/dashboard' : '/admin/dashboard')
      }
    }
  }, [user, navigate, hasRole, isSuiteDomain])

  const onSubmit = async (data: LoginData) => {
    setLoading(true)
    setErrorMsg(null)

    if (!isSupabaseConfigured) {
      setErrorMsg('Database environment parameters are not configured.')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })

      if (error) throw error
      await initialize()
      
      const isStaff = useAuthStore.getState().hasRole('super_admin') || 
                      useAuthStore.getState().hasRole('admin') || 
                      useAuthStore.getState().hasRole('editor') || 
                      useAuthStore.getState().hasRole('sales') || 
                      useAuthStore.getState().hasRole('support') || 
                      useAuthStore.getState().hasRole('content_writer')
      
      if (isStaff) {
        navigate(isSuiteDomain ? '/dashboard' : '/admin/dashboard')
      } else {
        await supabase.auth.signOut()
        setErrorMsg('Access Restricted: This console is reserved for internal staff members.')
      }
    } catch (err: any) {
      console.error('Admin Login Error:', err)
      setErrorMsg(err.message || 'Invalid staff credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#040509] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.04),transparent_70%)] pointer-events-none" />

      <div className="relative w-full max-w-[420px] space-y-6">

        {/* Logo mark */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <div className="inline-flex justify-center mb-1">
            <Logo size="lg" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-bold uppercase tracking-widest mb-2">
              <Lock size={10} />
              <span>Restricted Staff Portal</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight leading-tight">SpringWeb Operations Suite</h1>
            <p className="text-[13px] text-slate-500 mt-1">Authorized personnel only — staff &amp; administrators</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#06080f] border border-white/[0.08] rounded-2xl p-7 space-y-5 shadow-2xl shadow-black/50">
          
          {/* Error message */}
          {errorMsg && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/8 border border-rose-500/20">
              <AlertCircle size={15} className="text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-300 leading-relaxed">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Mail size={11} />
                Staff Email Address
              </label>
              <input
                type="email"
                {...register('email')}
                className="admin-input"
                placeholder="admin@springwebsolutions.in"
                autoComplete="email"
              />
              {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound size={11} />
                Security Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  {...register('password')}
                  className="admin-input pr-10"
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-rose-400 mt-1">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-admin-primary w-full py-2.5 mt-2 text-sm shadow-lg shadow-emerald-500/20 justify-center"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Verifying credentials…</span>
                </>
              ) : (
                <>
                  <Shield size={15} />
                  <span>Sign In to Control Center</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer links */}
        <div className="text-center space-y-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-300 transition-colors"
          >
            <ArrowLeft size={12} />
            Return to Website Home
          </Link>
          <div className="text-[11px] text-slate-700">
            Looking for client login?{' '}
            <Link to="/login" className="text-slate-500 hover:text-slate-300 transition-colors">
              Client Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdminLogin
