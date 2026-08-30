'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import CasaAiraLogo from '@/components/ui/CasaAiraLogo';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className='relative min-h-[96vh] flex items-center justify-center px-4 pt-28 pb-16 overflow-hidden bg-[#FAF8F5]'>
      {/* Video Loop Cinemático de Fondo */}
      <div className='absolute inset-0 w-full h-full overflow-hidden pointer-events-none'>
        {/* Video Desktop (16:9) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload='auto'
          src='/brand/hero-desktop.mp4'
          className='hidden md:block w-full h-full object-cover object-center scale-100 opacity-85 filter contrast-[1.05]'
        />

        {/* Video Mobile (9:16) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload='auto'
          src='/brand/hero-mobile.mp4'
          className='block md:hidden w-full h-full object-cover object-center scale-100 opacity-90 filter contrast-[1.05]'
        />

        {/* Velo Sutil de Contraste y Luz Editorial */}
        <div className='absolute inset-0 bg-gradient-to-b from-stone-900/30 via-transparent to-[#FAF8F5]' />
      </div>

      {/* Contenedor Editorial Central */}
      <div className='relative z-10 text-center max-w-4xl mx-auto w-full'>
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className='bg-white/85 sm:bg-white/80 backdrop-blur-md p-8 sm:p-14 border border-stone-200/80 shadow-2xl relative'
        >
          {/* Eyebrow */}
          <div className='inline-flex items-center gap-3 mb-6'>
            <span className='w-6 h-[1px] bg-gold-400' />
            <span className='text-[10px] tracking-[0.4em] uppercase font-semibold text-stone-600'>
              COLECCIÓN 2026 • VESTIDOS SELECCIONADOS
            </span>
            <span className='w-6 h-[1px] bg-gold-400' />
          </div>

          {/* Emblema y Título */}
          <div className='mb-6'>
            <div className='flex justify-center mb-6'>
              <CasaAiraLogo size='lg' variant='icon' animated={true} />
            </div>
            <h1
              className='font-serif font-normal text-3xl sm:text-5xl md:text-6xl text-[#181716] tracking-tight leading-[1.15]'
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              La belleza de fluir <br />
              <span className='italic font-normal text-calypso-700'>en absoluta libertad.</span>
            </h1>
          </div>

          {/* Subtítulo Cálido y Cercano */}
          <p className='text-stone-600 text-sm sm:text-base md:text-lg font-light mb-10 max-w-2xl mx-auto leading-relaxed'>
            Vestidos elegidos con dedicación por su frescura, comodidad y hermosa caída.
            Diseños livianos y favorecedores que realzan tu figura en todas las tallas, desde la XS hasta la 6XL.
          </p>

          {/* Botones de Acción */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto'>
            <Link href='/catalogo' className='w-full sm:w-auto flex-1'>
              <button className='btn-couture-primary w-full py-4'>
                <span>Ver Catálogo</span>
                <ArrowRight className='w-3.5 h-3.5 ml-1' />
              </button>
            </Link>

            <Link href='/#historia' className='w-full sm:w-auto flex-1'>
              <button className='btn-couture-outline w-full py-3.5'>
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
          className='mt-8 flex flex-col items-center justify-center gap-2 text-stone-600 cursor-pointer drop-shadow-sm'
          onClick={() => {
            const categoriesSection = document.getElementById('categories');
            if (categoriesSection) {
              categoriesSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <span className='text-[9px] tracking-[0.3em] uppercase font-semibold'>Descubrir Colección</span>
          <ChevronDown className='w-4 h-4 animate-bounce stroke-[2]' />
        </motion.div>
      </div>
    </section>
  );
}
