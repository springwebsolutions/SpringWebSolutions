import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginData } from '@/lib/validation'
import { KeyRound, Mail, Loader2, AlertCircle, ArrowLeft } from 'lucide-react'

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  const { user, initialize, hasRole } = useAuthStore()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema)
  })

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const isStaff = hasRole('super_admin') || hasRole('admin') || hasRole('editor') || hasRole('sales') || hasRole('support') || hasRole('content_writer')
      if (isStaff) {
        navigate('/admin/dashboard')
      } else {
        navigate('/support')
      }
    }
  }, [user, navigate, hasRole])

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

      // Refresh store credentials
      await initialize()
      
      const isStaff = useAuthStore.getState().hasRole('super_admin') || 
                      useAuthStore.getState().hasRole('admin') || 
                      useAuthStore.getState().hasRole('editor') || 
                      useAuthStore.getState().hasRole('sales') || 
                      useAuthStore.getState().hasRole('support') || 
                      useAuthStore.getState().hasRole('content_writer')
      
      if (isStaff) {
        navigate('/admin/dashboard')
      } else {
        navigate('/support')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setErrorMsg(err.message || 'Invalid email or password credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#070a13] flex flex-col justify-center items-center px-4 text-slate-200 relative">
      {/* Decorative Glow Nodes */}
      <div className="glow-node glow-indigo -bottom-20 -left-20" />
      <div className="glow-node glow-emerald -top-20 -right-20" />

      <div className="w-full max-w-md space-y-6">
        {/* Branding Title */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex h-10 w-10 rounded-lg bg-gradient-to-tr from-brand-emerald to-brand-indigo items-center justify-center font-extrabold text-white text-base shadow shadow-brand-emerald/10 mb-2">S</Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">Staff Control Login</h1>
          <p className="text-xs text-slate-400">Authenticate using your administrator credentials.</p>
        </div>

        {/* Login Form Panel */}
        <div className="p-8 rounded-3xl glass-panel border border-white/5 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="shrink-0 mt-0.5" size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mail size={12} />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-slate-900/5 light:border-slate-200 light:text-slate-800"
                placeholder="admin@springwebsolutions.in"
              />
              {errors.email && <p className="text-xs text-rose-400">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound size={12} />
                <span>Password</span>
              </label>
              <input
                type="password"
                {...register('password')}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-slate-900/5 light:border-slate-200 light:text-slate-800"
                placeholder="••••••••••••"
              />
              {errors.password && <p className="text-xs text-rose-400">{errors.password.message}</p>}
            </div>

            {/* Submit handle */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 px-4 font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-emerald/20 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Access Dashboard</span>
              )}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors">
            <ArrowLeft size={12} />
            <span>Return to Site Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
export default Login
