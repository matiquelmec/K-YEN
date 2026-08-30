'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function BrandManifesto() {
  return (
    <section id="manifiesto" className="py-24 sm:py-32 px-4 sm:px-6 bg-[#F4EFE8]/60 border-y border-stone-200/60 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Columna Izquierda: Filosofía de Curaduría */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-block">
              <span className="text-[10px] tracking-[0.35em] uppercase font-semibold text-calypso-700 bg-calypso-50/80 px-3 py-1 border border-calypso-200/60">
                EL ARTE DE LA CURADURÍA
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#181716] leading-tight font-normal">
              No creamos prendas masivas; <br className="hidden sm:block" />
              <span className="italic text-calypso-700">seleccionamos la perfección para ti.</span>
            </h2>

            <p className="text-stone-600 text-base sm:text-lg font-light leading-relaxed">
              En Casa Aira creemos que la verdadera elegancia nace del criterio y la exigencia.
              Buscamos, evaluamos y filtramos meticulosamente vestidos destacados por su caída impecable, texturas nobles y comodidad insuperable.
              Hacemos el trabajo de búsqueda por ti, seleccionando únicamente piezas que realzan la belleza en todas las tallas, desde la XS hasta la 6XL.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-stone-300/60">
              <div>
                <span className="block font-serif text-2xl text-[#181716] font-normal">01.</span>
                <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-800 mt-1">Filtro de Calidad</span>
                <p className="text-xs text-stone-500 mt-1 font-light">Evaluamos costuras, telas nobles y suavidad al tacto.</p>
              </div>

              <div>
                <span className="block font-serif text-2xl text-[#181716] font-normal">02.</span>
                <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-800 mt-1">Calce Comprobado</span>
                <p className="text-xs text-stone-500 mt-1 font-light">Probamos que cada corte favorezca y otorgue total libertad.</p>
              </div>

              <div>
                <span className="block font-serif text-2xl text-[#181716] font-normal">03.</span>
                <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-800 mt-1">Edición Exclusiva</span>
                <p className="text-xs text-stone-500 mt-1 font-light">Pocas unidades por diseño para asegurar tu distinción.</p>
              </div>
            </div>
          </motion.div>

          {/* Columna Derecha: Tarjeta Editorial con Fotografía de Curaduría (3:4) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <div className="bg-white border border-stone-200 shadow-sm overflow-hidden group">
              {/* Fotografía Editorial 3:4 */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
                <Image
                  src="/brand/manifesto-editorial.webp"
                  alt="Curaduría editorial y selección de vestidos Casa Aira"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 border border-stone-200/60 text-[9px] uppercase tracking-[0.25em] font-semibold text-stone-800">
                  ESTUDIO & SELECCIÓN
                </div>
              </div>

              {/* Contenido Editorial de la tarjeta */}
              <div className="p-8">
                <span className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-medium block mb-2">
                  BOUTIQUE & ASESORÍA
                </span>

                <h3 className="font-serif text-2xl text-[#181716] font-normal mb-3">
                  Curaduría con Ojo Experto
                </h3>

                <p className="text-xs text-stone-600 font-light leading-relaxed mb-6">
                  Cada prenda que llega a tu puerta ha superado nuestro riguroso estándar de inspección. Cuidamos el empaque, la presentación y te asesoramos personalmente vía WhatsApp para que elijas tu talla perfecta.
                </p>

                <Link
                  href="/catalogo"
                  className="inline-flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase font-semibold text-[#181716] hover:text-calypso-700 transition-colors group/link"
                >
                  <span>Explorar Selección Curada</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
