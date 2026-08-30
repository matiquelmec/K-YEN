'use client';

import { motion } from 'framer-motion';
import { Sparkles, Wind, Heart, ArrowRight, Truck, Gem, ChevronDown } from 'lucide-react';
import CasaAiraLogo from '@/components/ui/CasaAiraLogo';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className='relative min-h-[92vh] flex items-center justify-center px-4 pt-28 pb-16 overflow-hidden'>
      {/* Elementos lumínicos y gradientes de fondo */}
      <div className='absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-calypso-200/40 via-gold-100/30 to-blush-200/40 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute -bottom-10 right-10 w-96 h-96 bg-calypso-100/30 rounded-full blur-2xl pointer-events-none' />
      <div className='absolute top-20 left-10 w-80 h-80 bg-blush-100/40 rounded-full blur-2xl pointer-events-none' />

      <div className='relative z-10 text-center max-w-5xl mx-auto'>
        {/* Badge Superior */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-calypso-200/80 text-calypso-700 text-xs font-semibold uppercase tracking-widest shadow-sm mb-8'
        >
          <Sparkles className='w-3.5 h-3.5 text-gold-500' />
          <span>Nueva Colección 2026 • Alta Costura Chilena</span>
        </motion.div>

        {/* Logo / Nombre Editorial */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className='mb-6'
        >
          <div className='flex justify-center mb-4'>
            <CasaAiraLogo size='xl' variant='icon' animated={true} />
          </div>
          <h1 className='font-display font-extrabold text-4xl sm:text-6xl md:text-7xl text-stone-900 tracking-tight leading-tight'>
            Viste la brisa, <br className='hidden sm:block' />
            <span className='bg-gradient-to-r from-calypso-600 via-teal-600 to-gold-600 bg-clip-text text-transparent'>
              siente tu libertad
            </span>
          </h1>
        </motion.div>

        {/* Subtítulo Poético y Emocional */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className='text-stone-600 text-base sm:text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto leading-relaxed'
        >
          Vestidos exclusivos de caída perfecta que acompañan cada uno de tus movimientos. 
          Elegancia contemporánea, tonos calipso, destellos dorados y sedas suaves que abrazan todas las tallas.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className='flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto mb-16'
        >
          <Link href='/catalogo' className='w-full sm:w-auto flex-1'>
            <button className='btn-calypso w-full text-sm font-semibold py-4 shadow-lg shadow-calypso-500/20'>
              <span>Explorar Catálogo</span>
              <ArrowRight className='w-4 h-4 ml-1' />
            </button>
          </Link>

          <Link href='/catalogo?category=veraniego' className='w-full sm:w-auto flex-1'>
            <button className='btn-outline-aira w-full text-sm font-semibold py-3.5 bg-white/60'>
              <span>Colección Brisa</span>
              <Wind className='w-4 h-4 ml-1' />
            </button>
          </Link>
        </motion.div>

        {/* Value Props / Sellos de Confianza */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-8 border-t border-stone-200/80 text-left'
        >
          <div className='flex items-center gap-3.5 bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/60'>
            <div className='w-10 h-10 rounded-xl bg-calypso-50 flex items-center justify-center text-calypso-600 flex-shrink-0'>
              <Gem className='w-5 h-5' />
            </div>
            <div>
              <h4 className='font-semibold text-xs text-stone-900 uppercase tracking-wider'>Confección Exclusiva</h4>
              <p className='text-[11px] text-stone-500'>Telas seleccionadas y caída de alta costura</p>
            </div>
          </div>

          <div className='flex items-center gap-3.5 bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/60'>
            <div className='w-10 h-10 rounded-xl bg-gold-50 flex items-center justify-center text-gold-600 flex-shrink-0'>
              <Heart className='w-5 h-5' />
            </div>
            <div>
              <h4 className='font-semibold text-xs text-stone-900 uppercase tracking-wider'>Todas las Tallas</h4>
              <p className='text-[11px] text-stone-500'>Diseños que abrazan desde XS hasta 6XL</p>
            </div>
          </div>

          <div className='flex items-center gap-3.5 bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/60'>
            <div className='w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 flex-shrink-0'>
              <Truck className='w-5 h-5' />
            </div>
            <div>
              <h4 className='font-semibold text-xs text-stone-900 uppercase tracking-wider'>Despacho Seguro</h4>
              <p className='text-[11px] text-stone-500'>Envíos a todo Chile con seguimiento en vivo</p>
            </div>
          </div>
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
