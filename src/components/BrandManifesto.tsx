'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MessageCircle } from 'lucide-react';

export default function BrandManifesto() {
  return (
    <section id="historia" className="py-24 sm:py-32 px-4 sm:px-6 bg-[#F4EFE8]/60 border-y border-stone-200/60 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Columna Izquierda: Filosofía de Selección y Cercanía */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-block">
              <span className="text-[10px] tracking-[0.35em] uppercase font-semibold text-calypso-700 bg-calypso-50/80 px-3 py-1 border border-calypso-200/60">
                NUESTRO COMPROMISO
              </span>
            </div>

            <h2
              className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#181716] leading-tight font-normal"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              No fabricamos en masa; <br className="hidden sm:block" />
              <span className="italic text-calypso-700">elegimos cada vestido pensando en ti.</span>
            </h2>

            <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
              En <span className="font-serif font-medium text-[#181716]">Casa Aira</span> buscamos, tocamos y probamos vestidos de distintos talleres para traerte solo lo mejor: telas suaves, caídas hermosas y calce favorecedor desde la talla XS hasta la 6XL. Hacemos el trabajo de selección por ti para que solo te preocupes de lucir increíble.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-stone-300/60">
              <div>
                <span className="block font-serif text-2xl text-[#181716] font-normal" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>01.</span>
                <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-800 mt-1">Telas & Suavidad</span>
                <p className="text-xs text-stone-500 mt-1 font-light">Revisamos costuras, frescura y que la tela tenga una linda caída.</p>
              </div>

              <div>
                <span className="block font-serif text-2xl text-[#181716] font-normal" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>02.</span>
                <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-800 mt-1">Calce Real</span>
                <p className="text-xs text-stone-500 mt-1 font-light">Probamos que cada corte favorezca y te permita moverte con libertad.</p>
              </div>

              <div>
                <span className="block font-serif text-2xl text-[#181716] font-normal" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>03.</span>
                <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-800 mt-1">Pocas Unidades</span>
                <p className="text-xs text-stone-500 mt-1 font-light">Traemos stock limitado para que tu vestido sea único y especial.</p>
              </div>
            </div>
          </motion.div>

          {/* Columna Derecha: Tarjeta Editorial con Fotografía y Asesoría Directa (3:4) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <div className="bg-white border border-stone-200 shadow-sm overflow-hidden group">
              {/* Fotografía 3:4 */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
                <Image
                  src="/brand/manifesto-editorial.webp"
                  alt="Selección de vestidos Casa Aira"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 border border-stone-200/70 text-[9px] uppercase tracking-[0.25em] font-semibold text-stone-800 shadow-sm">
                  SELECCIÓN EXCLUSIVA
                </div>
              </div>

              {/* Contenido de la tarjeta */}
              <div className="p-8">
                <span className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-medium block mb-2">
                  ATENCIÓN & ASESORÍA
                </span>

                <h3
                  className="font-serif text-2xl text-[#181716] font-normal mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  ¿Dudas con tu talla o el modelo?
                </h3>

                <p className="text-xs text-stone-600 font-light leading-relaxed mb-6">
                  Queremos que compres con total tranquilidad. Escríbenos por WhatsApp y te ayudamos a revisar medidas, telas y disponibilidad para que aciertes a la primera.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/catalogo"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#181716] text-white text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-calypso-700 transition-colors"
                  >
                    <span>Ver Catálogo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href="https://wa.me/56912345678?text=Hola%20Casa%20Aira,%20me%20gustar%C3%ADa%20asesor%C3%ADa%20con%20la%20talla%20de%20un%20vestido"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-stone-100 text-stone-800 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-stone-200 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
