'use client';

import { motion } from 'framer-motion';
import { Heart, Moon, Sun, Sparkles, Leaf, ChevronDown } from 'lucide-react';
import KuyenLogo from '@/components/ui/KuyenLogo';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className='relative min-h-screen flex items-center justify-center px-2 sm:px-4 py-20'>
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
          <div className='relative px-4'>
            {/* Logo móvil */}
            <div className='block md:hidden'>
              <KuyenLogo size='xl' variant='full' animated={true} className='drop-shadow-2xl' />
            </div>
            {/* Logo desktop */}
            <div className='hidden md:block'>
              <KuyenLogo size='4xl' variant='full' animated={true} className='drop-shadow-2xl' />
            </div>

            {/* Efectos dramáticos alrededor del logo */}
            <motion.div
              className='absolute -inset-6 sm:-inset-12 bg-gradient-to-r from-lunar-500/15 via-mystic-500/15 to-terra-500/15 rounded-full blur-3xl'
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
          Desde la sensualidad de Luna Nueva hasta la frescura de Eclipse Floral.
          <br />
          <span className='font-cursive text-terra-300'>
            Para que todas puedan disfrutar de nuestros diseños únicos.
          </span>
        </motion.p>

        {/* Decorative Icons - Solo desktop */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className='hidden md:flex justify-center items-center gap-8 mb-12'
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Moon className='text-lunar-400 w-8 h-8' />
          </motion.div>

          <motion.div
            className='w-16 h-0.5 bg-gradient-to-r from-lunar-400 to-spring-400'
            animate={{ scaleX: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Leaf className='text-spring-400 w-8 h-8' />
          </motion.div>

          <motion.div
            className='w-16 h-0.5 bg-gradient-to-r from-spring-400 to-terra-400'
            animate={{ scaleX: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          />

          <motion.div
            animate={{
              rotate: [0, 360, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 12, repeat: Infinity, delay: 2, ease: "linear" }}
          >
            <Sun className='text-terra-400 w-8 h-8' />
          </motion.div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className='flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4 md:px-0'
        >
          <Link href='/catalogo?category=gotico' className='group'>
            <button className='btn-ink w-full sm:w-auto'>
              <span className='flex items-center gap-2 justify-center'>
                Luna Nueva
              </span>
            </button>
          </Link>

          <Link href='/catalogo?category=primaveral' className='group'>
            <button className='btn-spring w-full sm:w-auto'>
              <span className='flex items-center gap-2 justify-center'>
                Eclipse Floral
              </span>
            </button>
          </Link>

          <Link href='/catalogo?category=veraniego' className='group'>
            <button className='btn-terra w-full sm:w-auto'>
              <span className='flex items-center gap-2 justify-center'>
                Solsticio
              </span>
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator - posicionado fuera del contenedor principal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className='absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center cursor-pointer'
        onClick={() => {
          const categoriesSection = document.getElementById('categories');
          if (categoriesSection) {
            categoriesSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className='text-bone-200/60 text-xs font-light text-center hover:text-bone-200/90 transition-all duration-300'
        >
          <ChevronDown className='w-8 h-8 text-bone-200/60 mb-1 mx-auto' strokeWidth={1} />
          <span className='text-xs font-cursive opacity-70 hover:opacity-100 transition-opacity duration-300'>
            Descubre la magia
          </span>
        </motion.div>
      </motion.div>


    </section>
  );
}
