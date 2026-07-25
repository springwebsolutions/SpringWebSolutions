import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginData } from '@/lib/validation'
import { Shield, KeyRound, Mail, Loader2, AlertCircle, ArrowLeft, Lock } from 'lucide-react'

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  const { user, initialize, hasRole } = useAuthStore()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema)
  })

  // If already authenticated as staff, redirect directly to admin dashboard
  useEffect(() => {
    if (user) {
      const isStaff = hasRole('super_admin') || hasRole('admin') || hasRole('editor') || 
                      hasRole('sales') || hasRole('support') || hasRole('content_writer')
      if (isStaff) {
        navigate('/admin/dashboard')
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

      // Refresh store credentials and permissions
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
        // Sign out non-staff user from admin portal session
        await supabase.auth.signOut()
        setErrorMsg('Access Restricted: This console is reserved for internal staff members. Please use the Client Portal Login.')
      }
    } catch (err: any) {
      console.error('Admin Login Error:', err)
      setErrorMsg(err.message || 'Invalid staff credentials.')
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
        
        {/* Branding Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-tr from-brand-emerald to-brand-indigo items-center justify-center font-extrabold text-white text-lg shadow-md mb-2">
            <Shield size={24} />
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
            <Lock size={12} />
            <span>Restricted Staff Portal</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white pt-1">Internal Admin Console</h1>
          <p className="text-xs text-slate-400">Authorized personnel login for system administrators, editors & staff.</p>
        </div>

        {/* Login Form Panel */}
        <div className="p-8 rounded-3xl glass-panel border border-white/5 space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="shrink-0 mt-0.5" size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mail size={12} />
                <span>Staff Email Address</span>
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald"
                placeholder="admin@springwebsolutions.in"
              />
              {errors.email && <p className="text-xs text-rose-400">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound size={12} />
                <span>Security Password</span>
              </label>
              <input
                type="password"
                {...register('password')}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald"
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
                  <span>Verifying Staff Credentials...</span>
                </>
              ) : (
                <span>Authenticate Staff Login</span>
              )}
            </button>
          </form>
        </div>

        {/* Portal Links */}
        <div className="text-center text-xs text-slate-500">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-slate-300 transition-colors">
            <ArrowLeft size={12} />
            <span>Return to Site Home</span>
          </Link>
        </div>

      </div>
    </div>
  )
}
export default AdminLogin
