import React from 'react'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'light' | 'dark' | 'auto'
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  showText = true, 
  size = 'md',
  variant = 'auto'
}) => {
  const iconDimensions = 
    size === 'sm' ? 'h-9 w-9' :
    size === 'md' ? 'h-10 w-10' :
    size === 'lg' ? 'h-12 w-12' : 'h-16 w-16'

  const textSize = 
    size === 'sm' ? 'text-lg sm:text-xl' :
    size === 'md' ? 'text-xl sm:text-2xl' :
    size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-3xl'

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Official S-W Emblem Mark */}
      <div className={`${iconDimensions} rounded-xl bg-white p-0.5 shadow-md shadow-emerald-500/10 flex items-center justify-center shrink-0 border border-white/20 hover:scale-105 transition-all duration-200`}>
        <img 
          src="/logo-emblem.jpg" 
          alt="Spring Web Solutions" 
          className="w-full h-full object-contain rounded-lg"
        />
      </div>

      {/* Restored Original Brand Typography */}
      {showText && (
        <span className={`font-display font-bold tracking-tight ${
          variant === 'light' ? 'text-white' :
          variant === 'dark' ? 'text-slate-900' :
          'text-white dark:text-white light:text-slate-900'
        } ${textSize}`}>
          Spring Web Solutions
        </span>
      )}
    </div>
  )
}

export default Logo
