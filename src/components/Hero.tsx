'use client';

import { motion } from 'framer-motion';
import { Leaf, Heart, Moon, Sun, Sparkles } from 'lucide-react';
import KuyenLogo from '@/components/ui/KuyenLogo';

export default function Hero() {
  return (
    <section className='relative min-h-screen flex items-center justify-center px-4 py-20'>
      {/* Background decorative elements */}
      <div className='absolute inset-0 alchemical-texture opacity-20'></div>

      <div className='relative z-10 text-center max-w-6xl mx-auto'>
        {/* Logo Principal - RESPONSIVE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className='mb-12 md:mb-20'
        >
          <div className='relative'>
            {/* Logo móvil */}
            <div className='block md:hidden'>
              <KuyenLogo size='2xl' variant='full' animated={true} className='drop-shadow-2xl' />
            </div>
            {/* Logo desktop */}
            <div className='hidden md:block'>
              <KuyenLogo size='4xl' variant='full' animated={true} className='drop-shadow-2xl' />
            </div>

            {/* Efectos dramáticos alrededor del logo */}
            <motion.div
              className='absolute -inset-12 bg-gradient-to-r from-lunar-500/15 via-mystic-500/15 to-terra-500/15 rounded-full blur-3xl'
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

          </div>
        </motion.div>

        {/* Subtitle - Poesía Cruda */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className='text-bone-200 text-lg sm:text-xl md:text-2xl font-light mb-8 max-w-3xl mx-auto leading-relaxed px-4 md:px-0'
        >
          Vestidos que abrazan cada curva. Incluimos tallas extragrandes.
          <br />
          Góticos sensuales y primaverales frescos.
          <br />
          <span className='font-cursive text-terra-300'>
            Para que todas puedan disfrutar de nuestros diseños únicos.
          </span>
        </motion.p>

        {/* Decorative Icons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className='flex justify-center items-center gap-8 mb-12'
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Moon className='text-lunar-400 w-8 h-8' />
          </motion.div>

          <motion.div
            className='w-16 h-0.5 bg-gradient-to-r from-terra-400 to-mystic-400'
            animate={{ scaleX: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className='text-blood-400 w-8 h-8 fill-current' />
          </motion.div>

          <motion.div
            className='w-16 h-0.5 bg-gradient-to-r from-mystic-400 to-ink-400'
            animate={{ scaleX: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          />

          <motion.div
            animate={{
              rotate: [0, 360, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, delay: 2 }}
          >
            <Sparkles className='text-terra-400 w-8 h-8' />
          </motion.div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className='flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4 md:px-0'
        >
          <button className='btn-ink group'>
            <span className='flex items-center gap-2'>
              <Moon className='w-5 h-5' />
              Luna Nueva
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.div>
            </span>
          </button>

          <button className='btn-terra group'>
            <span className='flex items-center gap-2'>
              <Sun className='w-5 h-5' />
              Solsticio
            </span>
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator - posicionado fuera del contenedor principal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className='absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30'
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className='text-bone-200/60 text-xs font-light text-center cursor-pointer hover:text-bone-200/90 transition-all duration-300'
        >
          <div className='w-6 h-10 border-2 border-bone-200/40 rounded-full mb-3 mx-auto relative bg-transparent hover:border-bone-200/60 transition-all duration-300'>
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className='w-1 h-3 bg-bone-200/60 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2'
            />
          </div>
          <span className='text-xs font-cursive opacity-70 hover:opacity-100 transition-opacity duration-300'>
            Descubre la magia
          </span>
        </motion.div>
      </motion.div>

      {/* Efectos sutiles de fondo */}
      <motion.div
        className='absolute top-1/3 left-8 opacity-10 z-0'
        animate={{
          y: [0, -20, 0],
          rotate: [0, 8, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <div className='w-20 h-20 rounded-full bg-gradient-to-br from-lunar-400/40 to-mystic-400/40 blur-xl' />
      </motion.div>
    </section>
  );
}
