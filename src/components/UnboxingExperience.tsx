'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Package, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';
import { DEFAULT_UNBOXING, type UnboxingData } from '@/types/unboxing';

export default function UnboxingExperience() {
  const [data, setData] = useState<UnboxingData>(DEFAULT_UNBOXING);

  useEffect(() => {
    let isMounted = true;
    async function loadUnboxing() {
      try {
        const res = await fetch('/api/unboxing', { next: { revalidate: 60 } } as any);
        if (res.ok) {
          const json = await res.json();
          if (json.unboxing && isMounted) {
            setData(json.unboxing);
          }
        }
      } catch (err) {
        console.warn('Usando experiencia de empaque por defecto:', err);
      }
    }
    loadUnboxing();
    return () => {
      isMounted = false;
    };
  }, []);

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'sparkles':
        return <Sparkles className="w-4 h-4 stroke-[1.5]" />;
      case 'shield':
        return <ShieldCheck className="w-4 h-4 stroke-[1.5]" />;
      case 'package':
        return <Package className="w-4 h-4 stroke-[1.5]" />;
      case 'heart':
      default:
        return <HeartHandshake className="w-4 h-4 stroke-[1.5]" />;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'calypso':
        return 'bg-calypso-50 border-calypso-200/60 text-calypso-700';
      case 'gold':
        return 'bg-gold-50 border-gold-200/60 text-gold-700';
      case 'blush':
        return 'bg-blush-50 border-blush-200/60 text-blush-700';
      case 'stone':
      default:
        return 'bg-stone-100 border-stone-200 text-stone-700';
    }
  };

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
                src={data.image || '/brand/unboxing-packaging.webp'}
                alt="Experiencia de empaque y packaging de lujo Casa Aira"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 border border-stone-200/60 text-[9px] uppercase tracking-[0.25em] font-semibold text-stone-800">
                {data.image_badge}
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

            <p className="text-stone-600 text-base sm:text-lg font-light leading-relaxed">
              {data.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-stone-200">
              {data.features.map((feature, idx) => (
                <div key={feature.id || idx} className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${getColorClasses(
                      feature.color
                    )}`}
                  >
                    {renderIcon(feature.icon)}
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-900">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-stone-500 font-light mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
