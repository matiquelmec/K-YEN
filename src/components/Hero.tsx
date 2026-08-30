'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import CasaAiraLogo from '@/components/ui/CasaAiraLogo';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className='relative min-h-[94vh] sm:min-h-[96vh] flex items-end sm:items-center justify-center px-4 sm:px-8 pt-24 pb-12 sm:pb-16 overflow-hidden bg-[#181716]'>
      {/* Video Loop Cinemático de Fondo - Full Bleed 100% Visible */}
      <div className='absolute inset-0 w-full h-full overflow-hidden pointer-events-none'>
        {/* Video Desktop (16:9) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload='auto'
          src='/brand/hero-desktop.mp4'
          className='hidden md:block w-full h-full object-cover object-center scale-100 opacity-100 filter contrast-[1.05] brightness-[0.92]'
        />

        {/* Video Mobile (9:16) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload='auto'
          src='/brand/hero-mobile.mp4'
          className='block md:hidden w-full h-full object-cover object-center scale-100 opacity-100 filter contrast-[1.05] brightness-[0.92]'
        />

        {/* Velo Editorial Cinemático de Contraste y Luz */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/30' />
      </div>

      {/* Contenedor Editorial Flotante (Sin Cajas Opacas que Bloqueen el Video) */}
      <div className='relative z-10 text-center max-w-4xl mx-auto w-full'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className='space-y-6 sm:space-y-8'
        >
          {/* Eyebrow de Marca */}
          <div className='inline-flex items-center gap-3 bg-black/30 backdrop-blur-md px-4 py-1.5 border border-white/20 shadow-sm'>
            <span className='w-4 h-[1px] bg-gold-400' />
            <span className='text-[10px] sm:text-[11px] tracking-[0.35em] uppercase font-semibold text-white/90'>
              COLECCIÓN 2026 • CASA AIRA BOUTIQUE
            </span>
            <span className='w-4 h-[1px] bg-gold-400' />
          </div>

          {/* Emblema Sutil (Solo en Desktop) */}
          <div className='hidden sm:flex justify-center'>
            <div className='p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/20'>
              <CasaAiraLogo size='md' variant='icon' theme='dark' animated={true} />
            </div>
          </div>

          {/* Titular Principal Editorial */}
          <h1
            className='font-serif font-normal text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.12] drop-shadow-lg'
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            La belleza de fluir <br />
            <span className='italic font-normal text-calypso-300'>en absoluta libertad.</span>
          </h1>

          {/* Subtítulo Descriptivo y Cálido */}
          <p className='text-white/85 text-xs sm:text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md px-2'>
            Vestidos elegidos con dedicación por su frescura, comodidad y hermosa caída.
            Prendas livianas y favorecedoras que realzan tu figura en todas las tallas, desde la XS hasta la 6XL.
          </p>

          {/* Botones de Acción Sastre */}
          <div className='flex flex-col sm:flex-row gap-3.5 sm:gap-4 justify-center items-center max-w-md mx-auto pt-2 sm:pt-4'>
            <Link href='/catalogo' className='w-full sm:w-auto flex-1'>
              <button className='w-full py-4 px-8 bg-white hover:bg-calypso-600 text-[#181716] hover:text-white uppercase tracking-[0.22em] text-xs font-semibold flex items-center justify-center gap-2 shadow-2xl transition-all duration-300 active:scale-95 group'>
                <span>Ver Catálogo</span>
                <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-1 transition-transform' />
              </button>
            </Link>

            <Link href='/#historia' className='w-full sm:w-auto flex-1'>
              <button className='w-full py-4 px-8 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/40 hover:border-white text-white uppercase tracking-[0.22em] text-xs font-semibold flex items-center justify-center transition-all duration-300 active:scale-95'>
                <span>Nuestra Historia</span>
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className='mt-8 sm:mt-12 flex flex-col items-center justify-center gap-1.5 text-white/80 hover:text-white cursor-pointer transition-colors drop-shadow-sm'
          onClick={() => {
            const categoriesSection = document.getElementById('categories');
            if (categoriesSection) {
              categoriesSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <span className='text-[8px] sm:text-[9px] tracking-[0.3em] uppercase font-semibold'>Descubrir Colección</span>
          <ChevronDown className='w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce stroke-[2]' />
        </motion.div>
      </div>
    </section>
  );
}


