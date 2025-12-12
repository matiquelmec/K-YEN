'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Moon, Sun, Leaf } from 'lucide-react';

const collections = [
  {
    id: 'gotico', // Internal key for "Luna Nueva"
    title: 'Luna Nueva',
    subtitle: 'Gótico Sensual • Tallas Grandes y Extragrandes',
    description:
      'Donde el misterio abraza la sensualidad. Vestidos oscuros con terciopelos, encajes y transparencias. Elegancia cruda para mujeres que celebran su poder nocturno. Especialistas en tallas grandes.',
    icon: Moon,
    gradient: 'from-ink-700 to-blood-600',
    bgGradient: 'from-ink-50/10 to-blood-50/10',
    textGradient: 'from-ink-700 to-blood-600',
  },
  {
    id: 'primaveral', // Internal key for "Eclipse Floral"
    title: 'Eclipse Floral',
    subtitle: 'Primaveral Fresco • Tallas Inclusivas XS-5XL',
    description:
      'El renacer de la naturaleza bajo la luz de la luna. Estampados florales oscuros, telas fluidas y cortes románticos. La belleza de la primavera con un toque de misterio.',
    icon: Leaf,
    gradient: 'from-spring-500 to-earth-500',
    bgGradient: 'from-spring-50/10 to-earth-50/10',
    textGradient: 'from-spring-600 to-earth-500',
  },
  {
    id: 'veraniego', // Internal key for "Solsticio"
    title: 'Solsticio',
    subtitle: 'Veraniego Sensual • Tallas Inclusivas XS-5XL',
    description:
      'El punto donde el sol toca la tierra. Vestidos ligeros con linos, sedas y texturas orgánicas. Sensualidad natural que florece bajo el sol. Tallas inclusivas para todas las mujeres.',
    icon: Sun,
    gradient: 'from-terra-500 to-lunar-400',
    bgGradient: 'from-terra-50/10 to-lunar-50/10',
    textGradient: 'from-terra-600 to-lunar-500',
  },
];

export default function Categories() {
  return (
    <section id='categories' className='py-20 px-4 relative'>
      <div className='max-w-7xl mx-auto'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <h2 className='font-display text-4xl md:text-6xl font-bold mb-6'>
            <span className='bg-gradient-to-r from-terra-500 to-mystic-500 bg-clip-text text-transparent'>
              Colecciones
            </span>
            <br />
            <span className='bg-gradient-to-r from-ink-700 to-lunar-400 bg-clip-text text-transparent'>
              y Estaciones
            </span>
          </h2>
          <p className='text-bone-200 text-lg md:text-xl max-w-3xl mx-auto font-cursive'>
            Tres fases. Tres almas. Una misma alquimia.
            <br />
            <span className='text-terra-300'>
              Elegancia cruda para toda mujer. Incluimos tallas extragrandes.
            </span>
          </p>
        </motion.div>

        {/* Collections Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto px-4 md:px-0'>
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
              className='group'
            >
              {/* Wrapped in Link for navigation */}
              <Link href={`/catalogo?category=${collection.id}`} className="block h-full">
                <div
                  className={`bg-gradient-to-br ${collection.bgGradient} backdrop-blur-sm border border-bone-100/10 rounded-2xl p-6 h-full relative overflow-hidden text-center`}
                >
                  {/* Background Pattern */}
                  <div className='absolute inset-0 opacity-5'>
                    <div
                      className={`w-full h-full bg-gradient-to-br ${collection.gradient}`}
                    />
                  </div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${collection.gradient} flex items-center justify-center mb-4 relative z-10 mx-auto`}
                  >
                    <collection.icon className='text-bone-50 w-6 h-6' />
                  </motion.div>

                  {/* Content */}
                  <div className='relative z-10'>
                    <h3
                      className={`font-display text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r ${collection.textGradient} bg-clip-text text-transparent`}
                    >
                      {collection.title}
                    </h3>

                    <p className='text-bone-300 text-sm mb-3 font-light uppercase tracking-wider'>
                      {collection.subtitle}
                    </p>

                    <p className='text-bone-200 mb-4 leading-relaxed text-sm'>
                      {collection.description}
                    </p>

                    {/* CTA */}
                    <motion.button
                      whileHover={{ x: 3 }}
                      className={`inline-flex items-center gap-2 text-sm md:text-sm font-semibold bg-gradient-to-r ${collection.textGradient} bg-clip-text text-transparent py-3 px-4 rounded-full border border-transparent hover:border-current/20 min-h-[44px]`}
                    >
                      Ver Catálogo
                      <motion.span
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </motion.button>
                  </div>

                  {/* Hover Effects */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 0.05 }}
                    transition={{ duration: 0.3 }}
                    className={`absolute inset-0 bg-gradient-to-br ${collection.gradient} rounded-2xl`}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
