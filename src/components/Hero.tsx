'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import CasaAiraLogo from '@/components/ui/CasaAiraLogo';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className='relative min-h-[92vh] sm:min-h-[96vh] flex items-end sm:items-center justify-center px-4 pt-24 pb-8 sm:pb-16 overflow-hidden bg-[#181716] sm:bg-[#FAF8F5]'>
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

        {/* Video Mobile (9:16) - 100% Inmersivo y Visible */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload='auto'
          src='/brand/hero-mobile.mp4'
          className='block md:hidden w-full h-full object-cover object-center scale-100 opacity-100 filter contrast-[1.05]'
        />

        {/* Velo Editorial: En móvil gradiente inferior para legibilidad; en desktop velo suave */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 sm:hidden' />
        <div className='hidden sm:block absolute inset-0 bg-gradient-to-b from-stone-900/30 via-transparent to-[#FAF8F5]' />
      </div>

      {/* Contenedor Editorial */}
      <div className='relative z-10 text-center max-w-4xl mx-auto w-full'>
        
        {/* Versión Desktop: Tarjeta Editorial Alabastro */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className='hidden sm:block bg-white/85 sm:bg-white/80 backdrop-blur-md p-10 sm:p-14 border border-stone-200/80 shadow-2xl relative'
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
              className='font-serif font-normal text-4xl md:text-6xl text-[#181716] tracking-tight leading-[1.15]'
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              La belleza de fluir <br />
              <span className='italic font-normal text-calypso-700'>en absoluta libertad.</span>
            </h1>
          </div>

          {/* Subtítulo */}
          <p className='text-stone-600 text-base md:text-lg font-light mb-10 max-w-2xl mx-auto leading-relaxed'>
            Vestidos elegidos con dedicación por su frescura, comodidad y hermosa caída.
            Diseños livianos y favorecedores que realzan tu figura en todas las tallas, desde la XS hasta la 6XL.
          </p>

          {/* Botones de Acción */}
          <div className='flex flex-row gap-4 justify-center items-center max-w-md mx-auto'>
            <Link href='/catalogo' className='flex-1'>
              <button className='btn-couture-primary w-full py-4'>
                <span>Ver Catálogo</span>
                <ArrowRight className='w-3.5 h-3.5 ml-1' />
              </button>
            </Link>

            <Link href='/#historia' className='flex-1'>
              <button className='btn-couture-outline w-full py-3.5'>
                <span>Nuestra Historia</span>
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Versión Mobile: Full-Bleed Cinemático con Texto en Zona Inferior */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className='block sm:hidden text-left px-2 pb-4 space-y-4'
        >
          <div className='inline-flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 border border-white/20 text-[9px] uppercase tracking-[0.3em] font-medium text-white/90'>
            <span>COLECCIÓN 2026 • CASA AIRA</span>
          </div>

          <h1
            className='font-serif text-3xl text-white font-normal leading-tight tracking-tight drop-shadow-md'
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            La belleza de fluir <br />
            <span className='italic text-calypso-300'>en absoluta libertad.</span>
          </h1>

          <p className='text-white/80 text-xs font-light leading-relaxed drop-shadow-sm max-w-sm'>
            Vestidos seleccionados por su frescura, caída y comodidad. Tallaje inclusivo real de XS a 6XL.
          </p>

          <div className='flex gap-3 pt-2'>
            <Link href='/catalogo' className='flex-1'>
              <button className='w-full py-3.5 bg-white text-[#181716] uppercase tracking-[0.2em] text-[11px] font-semibold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform'>
                <span>Ver Catálogo</span>
                <ArrowRight className='w-3.5 h-3.5' />
              </button>
            </Link>

            <Link href='/#historia' className='flex-1'>
              <button className='w-full py-3.5 bg-black/40 backdrop-blur-md border border-white/30 text-white uppercase tracking-[0.2em] text-[11px] font-semibold flex items-center justify-center active:scale-95 transition-transform'>
                <span>Historia</span>
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className='mt-4 sm:mt-8 flex flex-col items-center justify-center gap-1.5 text-white/80 sm:text-stone-600 cursor-pointer drop-shadow-sm'
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

