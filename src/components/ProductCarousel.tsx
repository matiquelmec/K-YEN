'use client';

import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';

export default function ProductCarousel() {
  const { products, loading } = useProducts({ limit: 4 });

  return (
    <section className='py-20 px-4 relative overflow-hidden'>
      {/* Background Elements */}
      <div className='absolute inset-0'>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className='absolute top-20 left-20 w-32 h-32 border border-earth-400/30 rounded-full'
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className='absolute bottom-20 right-20 w-48 h-48 border border-sensual-400/20 rounded-full'
        />
      </div>

      <div className='max-w-7xl mx-auto relative z-10'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <h2 className='font-display text-4xl md:text-6xl font-bold mb-6'>
            <span className='text-gradient-earth'>Vestidos</span>
            <br />
            <span className='text-gradient-sensual'>Destacados</span>
          </h2>
          <p className='text-earth-200 text-lg md:text-xl max-w-3xl mx-auto'>
            Descubre piezas únicas que cuentan tu historia y abrazan tu esencia
            natural.
          </p>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {[...Array(4)].map((_, index) => (
              <div key={index} className='bg-white/10 rounded-xl h-96 animate-pulse' />
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
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
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className='text-center mt-16'
        >
          <button className='btn-earth'>
            <span className='flex items-center gap-2'>
              Ver Toda la Colección
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.div>
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
