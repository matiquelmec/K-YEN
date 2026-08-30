'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wind, Sparkles, Heart, ArrowRight } from 'lucide-react';

const collections = [
  {
    id: 'veraniego',
    title: 'Brisa Calipso',
    subtitle: 'Frescura & Libertad',
    description:
      'Telas livianas, caídas fluidas y la sensación envolvente de la brisa marina. Diseños creados para caminar con soltura y alegría.',
    icon: Wind,
    color: 'from-calypso-500 to-teal-400',
    borderHover: 'hover:border-calypso-400/80',
    badge: 'bg-calypso-50 text-calypso-700 border-calypso-200',
  },
  {
    id: 'gotico',
    title: 'Dorado Solar',
    subtitle: 'Gala & Distinción',
    description:
      'El resplandor del oro champagne y la sofisticación de la noche. Vestidos elegantes con detalles de alta costura para momentos inolvidables.',
    icon: Sparkles,
    color: 'from-gold-500 to-amber-400',
    borderHover: 'hover:border-gold-400/80',
    badge: 'bg-gold-50 text-gold-800 border-gold-200',
  },
  {
    id: 'primaveral',
    title: 'Rosa Amanecer',
    subtitle: 'Romance & Delicadeza',
    description:
      'La suavidad del rosa pastel y los cortes etéreos. Siluetas románticas y femeninas que celebran la belleza natural en todas sus formas.',
    icon: Heart,
    color: 'from-pink-500 to-rose-400',
    borderHover: 'hover:border-pink-400/80',
    badge: 'bg-pink-50 text-pink-700 border-pink-200',
  },
];

export default function Categories() {
  return (
    <section id='categories' className='py-16 md:py-24 px-4 relative'>
      <div className='max-w-7xl mx-auto'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <span className='text-xs font-bold uppercase tracking-[0.25em] text-calypso-600 block mb-3'>
            Curaduría de Temporada
          </span>
          <h2 className='font-display text-3xl sm:text-5xl font-extrabold text-stone-900 mb-4 tracking-tight'>
            Nuestras Colecciones
          </h2>
          <p className='text-stone-600 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed'>
            Tres universos de diseño confeccionados para acompañar tu estilo con gracia, confort y distinción.
          </p>
        </motion.div>

        {/* Collections Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8'>
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className='h-full'
            >
              <Link href={`/catalogo?category=${collection.id}`} className='block h-full'>
                <div
                  className={`card-aira p-8 h-full flex flex-col justify-between text-left transition-all duration-300 ${collection.borderHover} group`}
                >
                  <div>
                    {/* Icon & Badge */}
                    <div className='flex items-center justify-between mb-6'>
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${collection.color} flex items-center justify-center text-white shadow-md shadow-cyan-500/10 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <collection.icon className='w-6 h-6' />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${collection.badge}`}>
                        {collection.subtitle}
                      </span>
                    </div>

                    <h3 className='font-display text-2xl font-bold text-stone-900 group-hover:text-calypso-700 transition-colors mb-3'>
                      {collection.title}
                    </h3>

                    <p className='text-stone-600 text-sm leading-relaxed mb-6 font-light'>
                      {collection.description}
                    </p>
                  </div>

                  {/* Action link */}
                  <div className='pt-4 border-t border-stone-100 flex items-center justify-between text-sm font-semibold text-calypso-600 group-hover:text-calypso-700'>
                    <span>Explorar Vestidos</span>
                    <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
