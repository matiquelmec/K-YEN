'use client';

import { motion } from 'framer-motion';
import { Moon } from 'lucide-react';

interface KuyenLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  variant?: 'full' | 'icon' | 'text';
  animated?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-32 h-32',
  '2xl': 'w-40 h-40',
  '3xl': 'w-48 h-48',
  '4xl': 'w-60 h-60',
};

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-6xl',
  '2xl': 'text-7xl',
  '3xl': 'text-8xl',
  '4xl': 'text-9xl',
};

export default function KuyenLogo({
  size = 'md',
  variant = 'full',
  animated = true,
  className = '',
}: KuyenLogoProps) {
  // Componente del ícono (Luna creciente simple)
  const IconComponent = () => (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {animated ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          <Moon className={`${sizeClasses[size]} text-lunar-300`} />
        </motion.div>
      ) : (
        <Moon className={`${sizeClasses[size]} text-lunar-300`} />
      )}
    </div>
  );

  // Componente del texto
  const TextComponent = () => (
    <div className='flex flex-col items-center'>
      <h1
        className={`font-display font-bold ${textSizeClasses[size]} text-gradient-lunar leading-none`}
      >
        KÜYEN
      </h1>
      <p
      className={`font-cursive text-slate-400 ${
      size === '4xl' ? 'text-2xl' :
        size === '3xl' ? 'text-xl' :
          size === '2xl' ? 'text-lg' :
            size === 'xl' ? 'text-base' :
              size === 'lg' ? 'text-sm' :
              size === 'md' ? 'text-xs' : 'text-[10px]'
          } mt-2 text-center leading-tight`}
        >
        donde la elegancia florece bajo la luna
      </p>
    </div>
  );

  const WrapperComponent = ({ children }: { children: React.ReactNode }) => {
    if (animated) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      );
    }
    return <div>{children}</div>;
  };

  if (variant === 'icon') {
    return (
      <WrapperComponent>
        <IconComponent />
      </WrapperComponent>
    );
  }

  if (variant === 'text') {
    return (
      <WrapperComponent>
        <TextComponent />
      </WrapperComponent>
    );
  }

  // Versión completa (icon + text)
  return (
    <WrapperComponent>
      <div className={`flex items-center gap-3 ${className}`}>
        <IconComponent />
        <div className='flex flex-col'>
          <h1
            className={`font-display font-bold ${textSizeClasses[size]} text-gradient-lunar leading-none`}
          >
            KÜYEN
          </h1>
          <p
            className={`font-cursive text-slate-400 ${
              size === '4xl'
                ? 'text-lg'
                : size === '3xl'
                  ? 'text-base'
                  : size === 'xl'
                    ? 'text-sm'
                    : size === 'lg'
                      ? 'text-xs'
                      : 'text-[10px]'
            } leading-tight`}
          >
            donde la elegancia florece bajo la luna
          </p>
        </div>
      </div>
    </WrapperComponent>
  );
}
