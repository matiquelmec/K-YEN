'use client';

import { motion } from 'framer-motion';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

const products = [
  {
    id: 1,
    name: 'Vestido Luna Nocturna',
    category: 'Gótico Sensual',
    price: 89990,
    image: '/api/placeholder/400/600',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    description:
      'Elegancia misteriosa con detalles de encaje y corte que abraza cada curva',
    colors: ['Negro', 'Borgoña', 'Azul Medianoche'],
  },
  {
    id: 2,
    name: 'Vestido Flor de Cerezo',
    category: 'Primaveral',
    price: 74990,
    image: '/api/placeholder/400/600',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    description:
      'Frescura natural con estampado floral y silueta que fluye con tu movimiento',
    colors: ['Rosa Suave', 'Verde Menta', 'Lavanda'],
  },
  {
    id: 3,
    name: 'Vestido Sol Radiante',
    category: 'Veraniego',
    price: 69990,
    image: '/api/placeholder/400/600',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    description:
      'Libertad solar con tela ligera y corte que celebra tu feminidad',
    colors: ['Dorado', 'Coral', 'Turquesa'],
  },
  {
    id: 4,
    name: 'Vestido Tierra Ancestral',
    category: 'Gótico Sensual',
    price: 94990,
    image: '/api/placeholder/400/600',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'],
    description:
      'Conexión profunda con detalles bordados y silueta que honra tus raíces',
    colors: ['Tierra', 'Cobre', 'Óxido'],
  },
];

export default function ProductCarousel() {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

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
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              onHoverStart={() => setHoveredProduct(product.id)}
              onHoverEnd={() => setHoveredProduct(null)}
              className='group cursor-pointer'
            >
              <div className='bg-gradient-to-br from-earth-50 to-sensual-50 backdrop-blur-sm border border-earth-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 group-hover:scale-105'>
                {/* Product Image */}
                <div className='relative h-80 overflow-hidden'>
                  {/* Placeholder for product image */}
                  <div className='w-full h-full bg-gradient-to-br from-earth-200 to-sensual-200 flex items-center justify-center'>
                    <div className='text-center text-earth-600'>
                      <div className='w-20 h-20 rounded-full bg-gradient-to-br from-earth-400 to-sensual-400 flex items-center justify-center mx-auto mb-4'>
                        <ShoppingBag className='w-10 h-10 text-white' />
                      </div>
                      <p className='font-cursive text-2xl'>{product.name}</p>
                    </div>
                  </div>

                  {/* Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredProduct === product.id ? 1 : 0 }}
                    className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-4'
                  >
                    <motion.button
                      initial={{ y: 20, opacity: 0 }}
                      animate={{
                        y: hoveredProduct === product.id ? 0 : 20,
                        opacity: hoveredProduct === product.id ? 1 : 0,
                      }}
                      className='bg-white/90 backdrop-blur-sm text-earth-800 px-6 py-2 rounded-full font-semibold hover:bg-white transition-colors'
                    >
                      Vista Rápida
                    </motion.button>
                  </motion.div>

                  {/* Category Badge */}
                  <div className='absolute top-4 left-4'>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                        product.category === 'Gótico Sensual'
                          ? 'bg-gothic-600'
                          : product.category === 'Primaveral'
                            ? 'bg-spring-600'
                            : 'bg-earth-600'
                      }`}
                    >
                      {product.category}
                    </span>
                  </div>

                  {/* Heart Icon */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className='absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg'
                  >
                    <Heart className='w-5 h-5 text-sensual-500' />
                  </motion.button>
                </div>

                {/* Product Info */}
                <div className='p-6'>
                  <h3 className='font-display text-xl font-bold text-gradient-earth mb-2'>
                    {product.name}
                  </h3>

                  <p className='text-gray-600 text-sm mb-3 line-clamp-2'>
                    {product.description}
                  </p>

                  {/* Size Options */}
                  <div className='flex flex-wrap gap-1 mb-4'>
                    {product.sizes.slice(0, 5).map(size => (
                      <span
                        key={size}
                        className='px-2 py-1 text-xs border border-earth-300 rounded text-earth-600 bg-earth-50'
                      >
                        {size}
                      </span>
                    ))}
                    {product.sizes.length > 5 && (
                      <span className='px-2 py-1 text-xs text-earth-500'>
                        +{product.sizes.length - 5}
                      </span>
                    )}
                  </div>

                  {/* Colors */}
                  <div className='flex gap-2 mb-4'>
                    {product.colors.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                          color === 'Negro'
                            ? 'bg-black'
                            : color === 'Borgoña'
                              ? 'bg-red-900'
                              : color === 'Azul Medianoche'
                                ? 'bg-blue-900'
                                : color === 'Rosa Suave'
                                  ? 'bg-pink-300'
                                  : color === 'Verde Menta'
                                    ? 'bg-green-300'
                                    : color === 'Lavanda'
                                      ? 'bg-purple-300'
                                      : color === 'Dorado'
                                        ? 'bg-yellow-500'
                                        : color === 'Coral'
                                          ? 'bg-orange-400'
                                          : color === 'Turquesa'
                                            ? 'bg-teal-400'
                                            : color === 'Tierra'
                                              ? 'bg-amber-700'
                                              : color === 'Cobre'
                                                ? 'bg-orange-800'
                                                : 'bg-red-800'
                        }`}
                        title={color}
                      />
                    ))}
                  </div>

                  {/* Price and Rating */}
                  <div className='flex items-center justify-between'>
                    <div>
                      <span className='font-display text-2xl font-bold text-gradient-sensual'>
                        ${product.price.toLocaleString('es-CL')}
                      </span>
                    </div>
                    <div className='flex items-center gap-1'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < 4
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className='text-xs text-gray-500 ml-1'>(4.8)</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
