'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

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
    sm: 'w-8 h-8',
    md: 'w-10 h-10 sm:w-12 sm:h-12',
    lg: 'w-14 h-14 sm:w-16 sm:h-16',
    xl: 'w-20 h-20 sm:w-24 sm:h-24',
    '2xl': 'w-28 h-28 sm:w-36 sm:h-36',
  };

  const pixelDimensions = {
    sm: 36,
    md: 48,
    lg: 64,
    xl: 96,
    '2xl': 144,
  };

  // Isotipo Oficial Casa Aira
  const IconComponent = () => (
    <div className={`relative flex items-center justify-center ${iconSizes[size]} ${className}`}>
      {animated ? (
        <motion.div
          className="relative w-full h-full flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Image
            src="/brand/casa-aira-isotipo.webp"
            alt="Isotipo Casa Aira"
            width={pixelDimensions[size]}
            height={pixelDimensions[size]}
            className="w-full h-full object-contain"
            priority
          />
        </motion.div>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src="/brand/casa-aira-isotipo.webp"
            alt="Isotipo Casa Aira"
            width={pixelDimensions[size]}
            height={pixelDimensions[size]}
            className="w-full h-full object-contain"
          />
        </div>
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
        BOUTIQUE • CHILE
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
          BOUTIQUE
        </span>
      </div>
    </div>
  );
}

