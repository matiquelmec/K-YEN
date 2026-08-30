'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const chapters = [
  {
    id: 'veraniego',
    number: '01',
    title: 'Brisa & Calipso',
    subtitle: 'LÍNEA VERANO & PLAYA',
    image: '/brand/chapter-brisa-calipso.webp',
    description:
      'Linos frescos, cortes sueltos y tonos calipso inspirados en el mar. Vestidos cómodos y livianos para disfrutar los días de sol y calor.',
    accentColor: 'text-calypso-700',
    tag: 'Verano & Playa',
  },
  {
    id: 'gotico',
    number: '02',
    title: 'Solsticio Dorado',
    subtitle: 'LÍNEA FIESTA & GALA',
    image: '/brand/chapter-solsticio-dorado.webp',
    description:
      'Destellos en oro champagne, elegancia y calce perfecto. Siluetas elegidas para matrimonios, graduaciones y celebraciones especiales.',
    accentColor: 'text-gold-700',
    tag: 'Fiesta & Gala',
  },
  {
    id: 'primaveral',
    number: '03',
    title: 'Rosa de Alba',
    subtitle: 'LÍNEA ROMANCE & CÓCTEL',
    image: '/brand/chapter-rosa-alba.webp',
    description:
      'Tonos rosa empolvado, telas suaves y caídas fluidas. Vestidos femeninos y versátiles ideales para salidas, cenas y eventos de día o tarde.',
    accentColor: 'text-blush-700',
    tag: 'Romance & Cóctel',
  },
];

export default function Categories() {
  return (
    <section id='categories' className='py-24 sm:py-32 px-4 sm:px-6 bg-[#FAF8F5] relative'>
      <div className='max-w-7xl mx-auto'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-16 sm:mb-20'
        >
          <span className='text-[10px] font-semibold uppercase tracking-[0.35em] text-stone-500 block mb-3'>
            ESTILOS DE TEMPORADA
          </span>
          <h2
            className='font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-[#181716] tracking-tight mb-4'
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Nuestras Colecciones
          </h2>
          <p className='text-stone-600 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed'>
            Tres estilos pensados para acompañarte en tus días de descanso, tus salidas y tus momentos más especiales.
          </p>
        </motion.div>

        {/* Chapters Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {chapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className='h-full'
            >
              <Link href={`/catalogo?category=${chapter.id}`} className='block h-full'>
                <div className='bg-white border border-stone-200/80 overflow-hidden h-full flex flex-col justify-between hover:border-stone-400/90 transition-all duration-500 shadow-sm hover:shadow-md group'>
                  <div>
                    {/* Cover de Colección */}
                    <div className='relative aspect-[4/3] w-full overflow-hidden bg-stone-100'>
                      <Image
                        src={chapter.image}
                        alt={chapter.title}
                        fill
                        sizes='(max-width: 768px) 100vw, 33vw'
                        className='object-cover object-center group-hover:scale-105 transition-transform duration-700'
                      />
                      <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 border border-stone-200/60 text-[9px] uppercase tracking-[0.25em] font-semibold text-stone-800'>
                        COLECCIÓN {chapter.number}
                      </div>
                      <div className='absolute top-4 right-4 bg-[#181716]/80 backdrop-blur-sm px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] font-semibold text-white'>
                        {chapter.tag}
                      </div>
                    </div>

                    {/* Contenido Editorial */}
                    <div className='p-8'>
                      <span className='text-[10px] font-medium tracking-[0.25em] uppercase text-stone-400 block mb-2'>
                        {chapter.subtitle}
                      </span>

                      <h3
                        className='font-serif text-2xl sm:text-3xl text-[#181716] group-hover:text-calypso-700 transition-colors mb-3 font-normal'
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        {chapter.title}
                      </h3>

                      <p className='text-stone-600 text-xs sm:text-sm leading-relaxed font-light line-clamp-3'>
                        {chapter.description}
                      </p>
                    </div>
                  </div>

                  {/* Enlace Editorial */}
                  <div className='px-8 pb-8 pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-[#181716] group-hover:text-calypso-700 transition-colors'>
                    <span>Explorar Capítulo</span>
                    <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform' />
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
