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
    subtitle: 'COLECCIÓN VERANO & AIRE LIBRE',
    image: '/brand/chapter-brisa-calipso.webp',
    description:
      'Linos nobles, cortes asimétricos y la frescura del azul egeo. Vestidos seleccionados para caminar con soltura junto al mar y celebrar los días luminosos.',
    accentColor: 'text-calypso-700',
    tag: 'Brisa Marina',
  },
  {
    id: 'gotico',
    number: '02',
    title: 'Solsticio Dorado',
    subtitle: 'COLECCIÓN GALA & NOCHE',
    image: '/brand/chapter-solsticio-dorado.webp',
    description:
      'El resplandor del oro champagne y la sofisticación del crepúsculo. Siluetas elegidas para eventos especiales donde la distinción es protagonista.',
    accentColor: 'text-gold-700',
    tag: 'Gala & Fiesta',
  },
  {
    id: 'primaveral',
    number: '03',
    title: 'Rosa de Alba',
    subtitle: 'COLECCIÓN ROMÁNTICA & CÓCTEL',
    image: '/brand/chapter-rosa-alba.webp',
    description:
      'La delicadeza del rosa poudré y las caídas etéreas. Diseños curados para abrazar la feminidad contemporánea con absoluta gracia y ligereza.',
    accentColor: 'text-blush-700',
    tag: 'Seda & Romance',
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
            CURADURÍA DE TEMPORADA
          </span>
          <h2
            className='font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-[#181716] tracking-tight mb-4'
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Los Capítulos de Colección
          </h2>
          <p className='text-stone-600 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed'>
            Tres visiones de diseño seleccionadas para acompañar cada momento con fluidez y distinción sin esfuerzo.
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
                        CAPÍTULO {chapter.number}
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
