'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import CasaAiraLogo from '@/components/ui/CasaAiraLogo';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className='relative min-h-[94vh] flex items-center justify-center px-4 pt-32 pb-20 overflow-hidden bg-[#FAF8F5]'>
      {/* Video Loop Cinemático de Fondo */}
      <div className='absolute inset-0 w-full h-full overflow-hidden pointer-events-none'>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload='auto'
          className='w-full h-full object-cover object-center scale-105 opacity-25 sm:opacity-30 filter saturate-[0.85]'
        >
          <source src='/brand/hero-desktop.mp4' type='video/mp4' media='(min-width: 768px)' />
          <source src='/brand/hero-mobile.mp4' type='video/mp4' />
        </video>
        {/* Velo de Seda y Luz Editorial para legibilidad perfecta */}
        <div className='absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/90 via-[#FAF8F5]/70 to-[#FAF8F5]' />
        <div className='absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-calypso-100/40 via-gold-100/30 to-blush-100/40 rounded-full blur-3xl' />
      </div>

      <div className='relative z-10 text-center max-w-4xl mx-auto'>
        {/* Eyebrow de Boutique Curada */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='inline-flex items-center gap-3 mb-8'
        >
          <span className='w-6 h-[1px] bg-gold-400' />
          <span className='text-[10px] tracking-[0.4em] uppercase font-semibold text-stone-500'>
            COLECCIÓN 2026 • CURADURÍA EXCLUSIVA
          </span>
          <span className='w-6 h-[1px] bg-gold-400' />
        </motion.div>

        {/* Emblema y Nombre */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className='mb-6'
        >
          <div className='flex justify-center mb-6'>
            <CasaAiraLogo size='lg' variant='icon' animated={true} />
          </div>
          <h1
            className='font-serif font-normal text-4xl sm:text-6xl md:text-7xl text-[#181716] tracking-tight leading-[1.1]'
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            La belleza de fluir <br />
            <span className='italic font-normal text-calypso-700'>en absoluta libertad.</span>
          </h1>
        </motion.div>

        {/* Subtítulo Poético y Narrativo */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className='text-stone-600 text-base sm:text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto leading-relaxed'
        >
          Vestidos rigurosamente seleccionados por su movimiento y suavidad.
          Curaduría exclusiva de prendas livianas, destellos dorados y caídas fluidas que realzan toda silueta de la talla XS a la 6XL.
        </motion.p>

        {/* Botones de Acción - Corte Sastre */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className='flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto mb-20'
        >
          <Link href='/catalogo' className='w-full sm:w-auto flex-1'>
            <button className='btn-couture-primary w-full py-4'>
              <span>Explorar Catálogo</span>
              <ArrowRight className='w-3.5 h-3.5 ml-1' />
            </button>
          </Link>

          <Link href='/#manifiesto' className='w-full sm:w-auto flex-1'>
            <button className='btn-couture-outline w-full py-3.5'>
              <span>El Manifiesto</span>
            </button>
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className='flex flex-col items-center justify-center gap-2 text-stone-400 cursor-pointer'
          onClick={() => {
            const categoriesSection = document.getElementById('categories');
            if (categoriesSection) {
              categoriesSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <span className='text-[9px] tracking-[0.3em] uppercase'>Descubrir Colección</span>
          <ChevronDown className='w-4 h-4 animate-bounce stroke-[1.5]' />
        </motion.div>
      </div>
    </section>
  );
}
