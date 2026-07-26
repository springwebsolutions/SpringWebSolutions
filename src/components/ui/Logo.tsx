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
  const iconSizeClass = 
    size === 'sm' ? 'h-8 w-8' :
    size === 'md' ? 'h-10 w-10' :
    size === 'lg' ? 'h-12 w-12' : 'h-16 w-16'

  const textSizeClass = 
    size === 'sm' ? 'text-xs' :
    size === 'md' ? 'text-sm' :
    size === 'lg' ? 'text-base' : 'text-xl'

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Official Logo Mark / Image Container */}
      <div className={`${iconSizeClass} rounded-xl overflow-hidden bg-white p-0.5 shadow-md flex items-center justify-center shrink-0 border border-slate-200/50 hover:scale-105 transition-transform`}>
        <img 
          src="/logo.jpg" 
          alt="Spring Web Solutions Logo" 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col justify-center">
          <span className={`font-serif font-bold tracking-[0.18em] uppercase leading-tight ${
            variant === 'light' ? 'text-white' :
            variant === 'dark' ? 'text-slate-900' :
            'text-white dark:text-white light:text-slate-900'
          } ${textSizeClass}`}>
            SPRING WEB
          </span>
          <span className={`font-serif font-semibold tracking-[0.25em] uppercase text-[9px] sm:text-[10px] leading-tight ${
            variant === 'light' ? 'text-emerald-400' :
            variant === 'dark' ? 'text-emerald-600' :
            'text-emerald-400 dark:text-emerald-400 light:text-emerald-600'
          }`}>
            SOLUTIONS
          </span>
        </div>
      )}
    </div>
  )
}

export default Logo
