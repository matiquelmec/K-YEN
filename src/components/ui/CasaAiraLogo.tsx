'use client';

import { motion } from 'framer-motion';

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

  const titleSizes = {
    sm: 'text-sm tracking-[0.28em]',
    md: 'text-lg tracking-[0.32em]',
    lg: 'text-2xl tracking-[0.35em]',
    xl: 'text-3xl sm:text-4xl tracking-[0.4em]',
    '2xl': 'text-4xl sm:text-6xl tracking-[0.45em]',
  };

  const subtitleSizes = {
    sm: 'text-[8px] tracking-[0.35em]',
    md: 'text-[9px] tracking-[0.35em]',
    lg: 'text-[10px] tracking-[0.4em]',
    xl: 'text-xs tracking-[0.45em]',
    '2xl': 'text-sm tracking-[0.5em]',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16',
  };

  // Emblema Lineal Fino - Onda de Seda y Brisa
  const IconComponent = () => (
    <div className={`relative flex items-center justify-center ${iconSizes[size]} ${className}`}>
      {animated ? (
        <motion.svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Círculo sutil exterior */}
          <circle
            cx="20"
            cy="20"
            r="18.5"
            stroke={isLight ? '#E5D8CE' : '#3A3735'}
            strokeWidth="0.75"
          />
          {/* Línea de brisa continua (Seda) */}
          <motion.path
            d="M10 21C13 14 17 14 20 20C23 26 27 26 30 19"
            stroke={isLight ? '#1D707F' : '#93CAD3'}
            strokeWidth="1.2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
          />
          {/* Punto de luz dorado */}
          <circle cx="20" cy="11.5" r="1.5" fill={isLight ? '#BFA15F' : '#D8C69C'} />
        </motion.svg>
      ) : (
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <circle
            cx="20"
            cy="20"
            r="18.5"
            stroke={isLight ? '#E5D8CE' : '#3A3735'}
            strokeWidth="0.75"
          />
          <path
            d="M10 21C13 14 17 14 20 20C23 26 27 26 30 19"
            stroke={isLight ? '#1D707F' : '#93CAD3'}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="20" cy="11.5" r="1.5" fill={isLight ? '#BFA15F' : '#D8C69C'} />
        </svg>
      )}
    </div>
  );

  const TextComponent = () => (
    <div className="flex flex-col items-center select-none text-center">
      <span
        className={`font-serif font-normal uppercase ${titleSizes[size]} leading-none ${
          isLight ? 'text-[#181716]' : 'text-[#FAF8F5]'
        }`}
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        CASA AIRA
      </span>
      <span
        className={`font-sans font-light uppercase ${subtitleSizes[size]} ${
          isLight ? 'text-stone-500' : 'text-stone-400'
        } mt-1.5 leading-none`}
      >
        CURATED BOUTIQUE • CHILE
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
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      <IconComponent />
      <div className="flex flex-col text-left">
        <span
          className={`font-serif font-normal uppercase ${titleSizes[size]} leading-tight ${
            isLight ? 'text-[#181716]' : 'text-[#FAF8F5]'
          }`}
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          CASA AIRA
        </span>
        <span
          className={`font-sans font-light uppercase ${subtitleSizes[size]} ${
            isLight ? 'text-stone-500' : 'text-stone-400'
          } mt-0.5 leading-none`}
        >
          CURATED BOUTIQUE
        </span>
      </div>
    </div>
  );
}
