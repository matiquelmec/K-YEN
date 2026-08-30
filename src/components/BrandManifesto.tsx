'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function BrandManifesto() {
  return (
    <section id="manifiesto" className="py-24 sm:py-32 px-4 sm:px-6 bg-[#F4EFE8]/60 border-y border-stone-200/60 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Columna Izquierda: Cita y Manifiesto */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-block">
              <span className="text-[10px] tracking-[0.35em] uppercase font-semibold text-calypso-700 bg-calypso-50/80 px-3 py-1 border border-calypso-200/60">
                FILOSOFÍA DE ATELIER
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#181716] leading-tight font-normal">
              La elegancia no aprisiona; <br className="hidden sm:block" />
              <span className="italic text-calypso-700">fluye con tu libertad.</span>
            </h2>

            <p className="text-stone-600 text-base sm:text-lg font-light leading-relaxed">
              Casa Aira nace del deseo de reconciliar la alta costura con la comodidad absoluta.
              Creemos en prendas que no imponen formas, sino que acompañan la verdad del cuerpo.
              Cada vestido es concebido para moverse con la brisa, acariciar la piel y celebrar la gracia de toda mujer, desde la talla XS hasta la 6XL.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-stone-300/60">
              <div>
                <span className="block font-serif text-2xl text-[#181716] font-normal">01.</span>
                <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-800 mt-1">Confección Fluida</span>
                <p className="text-xs text-stone-500 mt-1 font-light">Telas nobles que caen con naturalidad y ligereza.</p>
              </div>

              <div>
                <span className="block font-serif text-2xl text-[#181716] font-normal">02.</span>
                <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-800 mt-1">Tallaje Inclusivo</span>
                <p className="text-xs text-stone-500 mt-1 font-light">Patronaje estudiado para honrar todas las curvas.</p>
              </div>

              <div>
                <span className="block font-serif text-2xl text-[#181716] font-normal">03.</span>
                <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-800 mt-1">Luz & Pigmento</span>
                <p className="text-xs text-stone-500 mt-1 font-light">Paletas inspiradas en el agua, el sol y el alba.</p>
              </div>
            </div>
          </motion.div>

          {/* Columna Derecha: Tarjeta Editorial Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <div className="bg-white p-8 sm:p-10 border border-stone-200 shadow-sm relative">
              <div className="w-8 h-[1px] bg-gold-500 mb-6" />
              
              <span className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-medium block mb-2">
                DESPACHO & ATENCIÓN
              </span>

              <h3 className="font-serif text-2xl text-[#181716] font-normal mb-4">
                Del Taller a tus Manos
              </h3>

              <p className="text-sm text-stone-600 font-light leading-relaxed mb-8">
                Cada pedido es empacado con esmero y perfumado en nuestro taller. Despachamos a todo Chile con seguimiento personalizado y asesoría directa vía WhatsApp.
              </p>

              <Link
                href="/catalogo"
                className="inline-flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase font-semibold text-[#181716] hover:text-calypso-700 transition-colors group"
              >
                <span>Descubrir Colecciones</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
