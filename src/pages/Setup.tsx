import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Database, UserPlus, ShieldCheck, 
  Loader2, AlertCircle, CheckCircle2, KeyRound 
} from 'lucide-react'

// Wizard validation schema
const setupFormSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  company: z.string().min(2, 'Company/Agency name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

type SetupFormInputs = z.infer<typeof setupFormSchema>

export const Setup: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isLocked, setIsLocked] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<SetupFormInputs>({
    resolver: zodResolver(setupFormSchema)
  })

  useEffect(() => {
    const checkWizardLockStatus = async () => {
      if (!isSupabaseConfigured) {
        navigate('/')
        return
      }

      try {
        // Query RPC to see if super admin is already configured
        const { data: hasAdmin, error } = await supabase.rpc('has_super_admin')
        if (error) throw error
        
        if (hasAdmin) {
          setIsLocked(true)
        }
      } catch (err) {
        console.error('Error checking setup status:', err)
        // Fallback: Check if user_roles has any records as backup
        const { count } = await supabase
          .from('user_roles')
          .select('*', { count: 'exact', head: true })
        if (count && count > 0) {
          setIsLocked(true)
        }
      } finally {
        setLoading(false)
      }
    }

    checkWizardLockStatus()
  }, [navigate])

  const onSubmit = async (data: SetupFormInputs) => {
    setSubmitting(true)
    setErrorMsg(null)

    try {
      // 1. Sign up the user via Supabase Auth
      const { data: signUpData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            company: data.company
          }
        }
      })

      if (authError) throw authError
      const user = signUpData.user

      if (!user) {
        throw new Error('Authentication signup returned empty user data.')
      }

      // 2. Call RPC to map the user to the super_admin role securely
      const { data: rpcSuccess, error: rpcError } = await supabase.rpc('create_first_super_admin', {
        admin_id: user.id,
        admin_full_name: data.fullName,
        admin_company: data.company
      })

      if (rpcError) throw rpcError
      if (!rpcSuccess) {
        throw new Error('Verification failed: Super Admin role allocation failed.')
      }

      // 3. Mark success and sign in user
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 3000)

    } catch (err: any) {
      console.error('Setup failure:', err)
      setErrorMsg(err.message || 'An unexpected error occurred during first-time platform initialization.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070a13] text-brand-emerald flex flex-col items-center justify-center">
        <Loader2 className="animate-spin" size={48} />
        <span className="mt-4 text-sm font-medium tracking-wide">Scanning System Status...</span>
      </div>
    )
  }

  // Render Lock Screen if setup is already complete
  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#070a13] flex flex-col justify-center items-center text-slate-200 px-4">
        <div className="p-8 rounded-3xl glass-panel text-center max-w-md space-y-6">
          <ShieldCheck size={64} className="mx-auto text-brand-emerald" />
          <h1 className="text-2xl font-bold tracking-tight">Setup Completed</h1>
          <p className="text-sm text-slate-400">
            First-time platform installation is complete. For security, this initialization wizard has been permanently locked.
          </p>
          <div className="flex justify-center pt-2">
            <Link to="/login" className="btn-primary flex items-center gap-1.5 text-sm">
              <KeyRound size={16} />
              <span>Go to Login</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070a13] flex flex-col items-center justify-center px-4 py-12 text-slate-200">
      <div className="w-full max-w-xl space-y-8">
        
        {/* Branding header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-tr from-brand-emerald to-brand-indigo items-center justify-center font-extrabold text-white text-lg shadow-md mb-2">S</div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Platform Setup Wizard</h1>
          <p className="text-sm text-slate-400">Configure your primary administrator account to boot up Spring Web Solutions.</p>
        </div>

        {/* Wizard Panel */}
        <div className="p-8 rounded-3xl glass-panel border border-white/5 space-y-6">
          {success ? (
            <div className="text-center space-y-4 py-6">
              <CheckCircle2 size={64} className="mx-auto text-brand-emerald" />
              <h2 className="text-xl font-bold">Platform Initialized!</h2>
              <p className="text-sm text-slate-400">
                The Super Admin account has been registered successfully. Redirecting you to the authentication gate...
              </p>
              <div className="flex justify-center">
                <Loader2 className="animate-spin text-brand-emerald" size={24} />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Error Callout */}
              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-start gap-2.5">
                  <AlertCircle className="shrink-0 mt-0.5" size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Admin profile settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    {...register('fullName')}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-slate-900/5 light:border-slate-200 light:text-slate-800"
                    placeholder="E.g., John Doe"
                  />
                  {errors.fullName && <p className="text-xs text-rose-400">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Company/Agency Name</label>
                  <input
                    type="text"
                    {...register('company')}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-slate-900/5 light:border-slate-200 light:text-slate-800"
                    placeholder="Spring Web Solutions"
                  />
                  {errors.company && <p className="text-xs text-rose-400">{errors.company.message}</p>}
                </div>
              </div>

              {/* Email / Password Account credentials */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Admin Email</label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-slate-900/5 light:border-slate-200 light:text-slate-800"
                  placeholder="admin@springwebsolutions.com"
                />
                {errors.email && <p className="text-xs text-rose-400">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Admin Password</label>
                <input
                  type="password"
                  {...register('password')}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-slate-900/5 light:border-slate-200 light:text-slate-800"
                  placeholder="••••••••••••"
                />
                {errors.password && <p className="text-xs text-rose-400">{errors.password.message}</p>}
              </div>

              {/* Security info disclaimer */}
              <div className="p-3 rounded-lg bg-brand-emerald/5 border border-brand-emerald/10 text-xs text-slate-400 flex items-start gap-2 light:bg-slate-100 light:border-slate-200 light:text-slate-600">
                <ShieldCheck className="shrink-0 text-brand-emerald mt-0.5" size={15} />
                <span>This registers the first user profile and grants them root <strong>Super Admin</strong> access, lock-protecting this setup wizard.</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-3 px-6 font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-emerald/20"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Bootstrapping System...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    <span>Deploy Platform Administrator</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
export default Setup
