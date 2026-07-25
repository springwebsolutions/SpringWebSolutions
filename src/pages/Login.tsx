import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginData } from '@/lib/validation'
import { KeyRound, Mail, Loader2, AlertCircle, ArrowLeft, User, UserPlus, CheckCircle } from 'lucide-react'

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  
  // Registration fields
  const [regFullName, setRegFullName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')

  const { user, initialize, hasRole } = useAuthStore()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema)
  })

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const isStaff = hasRole('super_admin') || hasRole('admin') || hasRole('editor') || 
                      hasRole('sales') || hasRole('support') || hasRole('content_writer')
      if (isStaff) {
        navigate('/admin/dashboard')
      } else {
        navigate('/support')
      }
    }
  }, [user, navigate, hasRole])

  // Handle Client Sign In
  const onSubmitLogin = async (data: LoginData) => {
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

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
        setSuccessMsg('Staff member recognized! Redirecting to Admin Console...')
        setTimeout(() => navigate('/admin/dashboard'), 1000)
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

  // Handle Client Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    if (!regFullName.trim() || !regEmail.trim() || !regPassword || regPassword.length < 6) {
      setErrorMsg('Please fill in all fields with a password of at least 6 characters.')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: regEmail.trim(),
        password: regPassword,
        options: {
          data: {
            full_name: regFullName.trim()
          }
        }
      })

      if (error) throw error

      if (data.user) {
        // Ensure profile entry
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: regFullName.trim()
        })
      }

      setSuccessMsg('Account created successfully! Signing in...')
      await initialize()
      setTimeout(() => navigate('/support'), 1500)
    } catch (err: any) {
      console.error('Registration error:', err)
      setErrorMsg(err.message || 'Error creating client account.')
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
          <Link to="/" className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-tr from-brand-emerald to-brand-indigo items-center justify-center font-extrabold text-white text-lg shadow-md mb-2">S</Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">Client & Customer Portal</h1>
          <p className="text-xs text-slate-400">Sign in to access your resources, software downloads & support tickets.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-white/5 p-1 border border-white/10">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'login' ? 'bg-brand-emerald text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User size={14} />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'register' ? 'bg-brand-emerald text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus size={14} />
            <span>Create Account</span>
          </button>
        </div>

        {/* Form Panel */}
        <div className="p-8 rounded-3xl glass-panel border border-white/5 space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="shrink-0 mt-0.5" size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-brand-emerald/15 border border-brand-emerald/20 text-brand-emerald text-xs flex items-center gap-2">
              <CheckCircle size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleSubmit(onSubmitLogin)} className="space-y-4">
              
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail size={12} />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald"
                  placeholder="your-name@example.com"
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
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In to Portal</span>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User size={12} />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail size={12} />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald"
                  placeholder="john@example.com"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound size={12} />
                  <span>Create Password</span>
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald"
                  placeholder="At least 6 characters"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-2.5 px-4 font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-emerald/20 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Register Account</span>
                )}
              </button>
            </form>
          )}
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
export default Login
