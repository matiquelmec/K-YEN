'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';

export default function ProductCarousel() {
  const { products, loading } = useProducts({ limit: 4 });

  return (
    <section className='py-24 sm:py-32 px-4 sm:px-6 bg-[#FAF8F5] relative overflow-hidden'>
      <div className='max-w-7xl mx-auto relative z-10'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-16 sm:mb-20'
        >
          <span className='text-[10px] font-semibold uppercase tracking-[0.35em] text-stone-500 block mb-3'>
            CURADURÍA DE TEMPORADA
          </span>
          <h2
            className='font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-[#181716] tracking-tight mb-4'
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Selección Exclusiva
          </h2>
          <p className='text-stone-600 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed'>
            Vestidos elegidos meticulosamente por la nobleza de sus telas y la armonía de su calce en todas las curvas.
          </p>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            {[...Array(4)].map((_, index) => (
              <div key={index} className='bg-stone-100 h-96 animate-pulse border border-stone-200/50' />
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
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
          className='text-center mt-16 sm:mt-20'
        >
          <Link href='/catalogo' className='inline-block'>
            <button className='btn-couture-primary px-10 py-4'>
              <span>Ver Todo el Catálogo <span className="font-serif italic font-normal">Casa Aira</span></span>
              <span className='ml-2'>→</span>
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
