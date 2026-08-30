'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Package, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function UnboxingExperience() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 bg-[#FAF8F5] relative overflow-hidden border-t border-stone-200/60">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Imagen de Packaging & Bolsas Boutique (Mockup) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="lg:col-span-6"
          >
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-stone-100 border border-stone-200 shadow-sm group">
              <Image
                src="/brand/unboxing-packaging.webp"
                alt="Experiencia de empaque y packaging de lujo Casa Aira"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 border border-stone-200/60 text-[9px] uppercase tracking-[0.25em] font-semibold text-stone-800">
                EXPERIENCIA BOUTIQUE
              </div>
            </div>
          </motion.div>

          {/* Narrativa de Desempaque */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-block">
              <span className="text-[10px] tracking-[0.35em] uppercase font-semibold text-calypso-700 bg-calypso-50/80 px-3 py-1 border border-calypso-200/60">
                UN DETALLE ESPECIAL
              </span>
            </div>

            <h2
              className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#181716] leading-tight font-normal"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              La emoción de recibir <br className="hidden sm:block" />
              <span className="italic text-calypso-700">tu nuevo vestido.</span>
            </h2>

            <p className="text-stone-600 text-base sm:text-lg font-light leading-relaxed">
              Queremos que abrir tu paquete sea un momento lindo para ti. Cada pedido se prepara con cariño: envuelto en papel de seda, con un aroma suave y protegido para que llegue impecable a tus manos.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-stone-200">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-calypso-50 border border-calypso-200/60 flex items-center justify-center text-calypso-700 flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-900">Aroma Delicado</h4>
                  <p className="text-xs text-stone-500 font-light mt-1">Un toque de fragancia suave y fresca al abrirlo.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-gold-50 border border-gold-200/60 flex items-center justify-center text-gold-700 flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-900">Empaque Seguro</h4>
                  <p className="text-xs text-stone-500 font-light mt-1">Protegido para viajar por Starken o Chilexpress.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-blush-50 border border-blush-200/60 flex items-center justify-center text-blush-700 flex-shrink-0 mt-0.5">
                  <Package className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-900">Bolsa Boutique</h4>
                  <p className="text-xs text-stone-500 font-light mt-1">Práctica y bonita para guardar o regalar.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 flex-shrink-0 mt-0.5">
                  <HeartHandshake className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-900">Acompañamiento 1 a 1</h4>
                  <p className="text-xs text-stone-500 font-light mt-1">Te avisamos del envío y te ayudamos si necesitas cambio.</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
