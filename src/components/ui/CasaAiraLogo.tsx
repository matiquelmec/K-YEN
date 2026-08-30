'use client';

import { motion } from 'framer-motion';
import { Wind, Sparkles } from 'lucide-react';

interface CasaAiraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'icon' | 'text';
  animated?: boolean;
  className?: string;
  theme?: 'light' | 'dark';
}

export default function CasaAiraLogo({
  size = 'md',
  variant = 'full',
  animated = true,
  className = '',
  theme = 'light',
}: CasaAiraLogoProps) {
  const isLight = theme === 'light';

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24',
  };

  const titleSizes = {
    sm: 'text-base tracking-[0.2em]',
    md: 'text-xl tracking-[0.25em]',
    lg: 'text-2xl tracking-[0.3em]',
    xl: 'text-4xl tracking-[0.35em]',
    '2xl': 'text-6xl tracking-[0.4em]',
  };

  const subtitleSizes = {
    sm: 'text-[9px] tracking-widest',
    md: 'text-[11px] tracking-widest',
    lg: 'text-xs tracking-widest',
    xl: 'text-sm tracking-widest',
    '2xl': 'text-lg tracking-widest',
  };

  const IconComponent = () => (
    <div className={`relative flex items-center justify-center ${iconSizes[size]} ${className}`}>
      {animated ? (
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-calypso-400 via-teal-300 to-gold-400 p-[1.5px] shadow-sm">
            <div className="w-full h-full rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center p-1.5">
              <Wind className="w-full h-full text-calypso-600 stroke-[1.75]" />
            </div>
          </div>
          <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-gold-500 animate-pulse" />
        </motion.div>
      ) : (
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-calypso-400 via-teal-300 to-gold-400 p-[1.5px]">
          <div className="w-full h-full rounded-full bg-white/90 flex items-center justify-center p-1.5">
            <Wind className="w-full h-full text-calypso-600 stroke-[1.75]" />
          </div>
        </div>
      )}
    </div>
  );

  const TextComponent = () => (
    <div className="flex flex-col items-center">
      <span className={`font-display font-bold uppercase ${titleSizes[size]} ${isLight ? 'bg-gradient-to-r from-stone-900 via-stone-800 to-calypso-800 bg-clip-text text-transparent' : 'text-white'}`}>
        CASA AIRA
      </span>
      <span className={`font-body uppercase ${isLight ? 'text-stone-500' : 'text-stone-400'} font-light ${subtitleSizes[size]} mt-0.5`}>
        Elegancia & Libertad
      </span>
    </div>
  );

  if (variant === 'icon') {
    return <IconComponent />;
  }

  if (variant === 'text') {
    return <TextComponent />;
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <IconComponent />
      <div className="flex flex-col text-left">
        <span className={`font-display font-bold uppercase ${titleSizes[size]} leading-none ${isLight ? 'bg-gradient-to-r from-stone-900 via-stone-800 to-calypso-800 bg-clip-text text-transparent' : 'text-white'}`}>
          CASA AIRA
        </span>
        <span className={`font-body uppercase ${isLight ? 'text-calypso-700 font-medium' : 'text-calypso-400'} ${subtitleSizes[size]} mt-1 leading-none`}>
          Elegancia & Libertad
        </span>
      </div>
    </div>
  );
}
