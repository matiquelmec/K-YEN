'use client';

import { motion } from 'framer-motion';
import { Moon } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  fullScreen?: boolean;
}

const sizes = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const textSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

export default function LoadingSpinner({
  size = 'md',
  message = 'Cargando...',
  fullScreen = false,
}: LoadingSpinnerProps) {
  const spinnerContent = (
    <div className='flex flex-col items-center justify-center gap-4'>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
        className={`${sizes[size]} text-lunar-400`}
      >
        <Moon className='w-full h-full' />
      </motion.div>

      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`${textSizes[size]} text-slate-300 font-medium text-center`}
        >
          {message}
        </motion.p>
      )}

      {/* Floating particles effect */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-1 h-1 bg-lunar-400/30 rounded-full'
            initial={{
              x: Math.random() * 200,
              y: Math.random() * 200,
            }}
            animate={{
              x: Math.random() * 200,
              y: Math.random() * 200,
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50'
      >
        <div className='relative'>{spinnerContent}</div>
      </motion.div>
    );
  }

  return (
    <div className='flex items-center justify-center p-8 relative'>
      {spinnerContent}
    </div>
  );
}
