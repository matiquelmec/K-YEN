'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { DEFAULT_MANIFESTO, type ManifestoData } from '@/types/manifesto';

export default function BrandManifesto() {
  const [data, setData] = useState<ManifestoData>(DEFAULT_MANIFESTO);

  useEffect(() => {
    let isMounted = true;
    async function loadManifesto() {
      try {
        const res = await fetch('/api/manifesto', { next: { revalidate: 60 } } as any);
        if (res.ok) {
          const json = await res.json();
          if (json.manifesto && isMounted) {
            setData(json.manifesto);
          }
        }
      } catch (err) {
        console.warn('Usando manifiesto por defecto:', err);
      }
    }
    loadManifesto();
    return () => {
      isMounted = false;
    };
  }, []);

  const whatsappUrl = `https://wa.me/${data.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(
    data.whatsapp_message
  )}`;

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
                {data.badge}
              </span>
            </div>

            <h2
              className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#181716] leading-tight font-normal"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {data.title_primary} <br className="hidden sm:block" />
              <span className="italic text-calypso-700">{data.title_highlight}</span>
            </h2>

            <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
              {data.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-stone-300/60">
              {data.pillars.map((pillar, idx) => (
                <div key={idx}>
                  <span
                    className="block font-serif text-2xl text-[#181716] font-normal"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {pillar.number}
                  </span>
                  <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-800 mt-1">
                    {pillar.title}
                  </span>
                  <p className="text-xs text-stone-500 mt-1 font-light">{pillar.description}</p>
                </div>
              ))}
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
                  src={data.card_image || '/brand/manifesto-editorial.webp'}
                  alt="Selección de vestidos Casa Aira"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 border border-stone-200/70 text-[9px] uppercase tracking-[0.25em] font-semibold text-stone-800 shadow-sm">
                  {data.card_badge}
                </div>
              </div>

              {/* Contenido de la tarjeta */}
              <div className="p-8">
                <span className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-medium block mb-2">
                  {data.card_subtitle}
                </span>

                <h3
                  className="font-serif text-2xl text-[#181716] font-normal mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {data.card_title}
                </h3>

                <p className="text-xs text-stone-600 font-light leading-relaxed mb-6">
                  {data.card_description}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={data.catalog_button_link || '/catalogo'}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#181716] text-white text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-calypso-700 transition-colors"
                  >
                    <span>{data.catalog_button_text}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href={whatsappUrl}
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
