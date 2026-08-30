'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';

export default function ProductCarousel() {
  const { products, loading } = useProducts({ limit: 4 });

  return (
    <section className='py-16 md:py-24 px-4 relative overflow-hidden'>
      <div className='max-w-7xl mx-auto relative z-10'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <span className='text-xs font-bold uppercase tracking-[0.25em] text-gold-600 block mb-3'>
            Selección Exclusiva
          </span>
          <h2 className='font-display text-3xl sm:text-5xl font-extrabold text-stone-900 mb-4 tracking-tight'>
            Vestidos Destacados
          </h2>
          <p className='text-stone-600 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed'>
            Piezas que celebran tu autenticidad y libertad con caídas envolventes y confección de atelier.
          </p>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8'>
            {[...Array(4)].map((_, index) => (
              <div key={index} className='card-aira h-96 animate-pulse bg-stone-100/60' />
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8'>
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                viewport={{ once: true }}
                className='h-full'
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className='text-center mt-14'
        >
          <Link href='/catalogo' className='inline-block'>
            <button className='btn-calypso px-9 py-4 text-sm font-semibold shadow-md shadow-calypso-500/20'>
              <span>Ver Toda la Colección Casa Aira</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
