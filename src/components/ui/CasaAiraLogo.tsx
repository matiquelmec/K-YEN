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

  // Dimensiones vectoriales exactas para cada configuración
  const dimensions = {
    // Configuración Horizontal (viewBox: 0 0 2678 902 -> aspect 2.97)
    full: {
      sm: { width: 140, height: 47, class: 'w-[130px] sm:w-[140px] h-auto' },
      md: { width: 180, height: 60, class: 'w-[160px] sm:w-[180px] h-auto' },
      lg: { width: 240, height: 81, class: 'w-[200px] sm:w-[240px] h-auto' },
      xl: { width: 320, height: 108, class: 'w-[260px] sm:w-[320px] h-auto' },
      '2xl': { width: 420, height: 141, class: 'w-[320px] sm:w-[420px] h-auto' },
    },
    // Isotipo Circular Oficial (viewBox: 0 0 902 902 -> aspect 1.0)
    icon: {
      sm: { width: 36, height: 36, class: 'w-8 h-8 sm:w-9 sm:h-9' },
      md: { width: 48, height: 48, class: 'w-10 h-10 sm:w-12 sm:h-12' },
      lg: { width: 64, height: 64, class: 'w-14 h-14 sm:w-16 sm:h-16' },
      xl: { width: 96, height: 96, class: 'w-20 h-20 sm:w-24 sm:h-24' },
      '2xl': { width: 144, height: 144, class: 'w-28 h-28 sm:w-36 sm:h-36' },
    },
    // Wordmark Tipográfico Editorial (viewBox: 0 0 1546 902 -> aspect 1.71)
    text: {
      sm: { width: 100, height: 58, class: 'w-[90px] sm:w-[100px] h-auto' },
      md: { width: 130, height: 76, class: 'w-[110px] sm:w-[130px] h-auto' },
      lg: { width: 170, height: 99, class: 'w-[140px] sm:w-[170px] h-auto' },
      xl: { width: 220, height: 128, class: 'w-[180px] sm:w-[220px] h-auto' },
      '2xl': { width: 280, height: 163, class: 'w-[230px] sm:w-[280px] h-auto' },
    },
  };

  // Selección del asset SVG canónico del paquete oficial
  const getAssetPath = () => {
    if (variant === 'icon') {
      return isLight ? '/brand/casa-aira_isotipo_color.svg' : '/brand/casa-aira_isotipo_blanco.svg';
    }
    if (variant === 'text') {
      return isLight ? '/brand/casa-aira_wordmark_color.svg' : '/brand/casa-aira_wordmark_blanco.svg';
    }
    // Full horizontal
    return isLight ? '/brand/casa-aira_horizontal_color.svg' : '/brand/casa-aira_horizontal_blanco.svg';
  };

  const currentDim = dimensions[variant][size];
  const src = getAssetPath();

  const alt =
    variant === 'icon'
      ? 'Isotipo Oficial Casa Aira'
      : variant === 'text'
      ? 'Casa Aira Tipografía'
      : 'Casa Aira Boutique';

  if (!animated) {
    return (
      <div className={`relative inline-flex items-center justify-center ${currentDim.class} ${className}`}>
        <Image
          src={src}
          alt={alt}
          width={currentDim.width}
          height={currentDim.height}
          className="w-full h-full object-contain"
          priority
        />
      </div>
    );
  }

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${currentDim.class} ${className}`}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Image
        src={src}
        alt={alt}
        width={currentDim.width}
        height={currentDim.height}
        className="w-full h-full object-contain"
        priority
      />
    </motion.div>
  );
}
