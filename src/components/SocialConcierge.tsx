'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, MessageCircle, ArrowUpRight, Sparkles } from 'lucide-react';
import { DEFAULT_STORE_SETTINGS, type StoreSettings } from '@/types/settings';

export default function SocialConcierge() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);

  useEffect(() => {
    let isMounted = true;
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.settings && isMounted) {
            setSettings({
              ...json.settings,
              contact_email: json.settings.contact_email || DEFAULT_STORE_SETTINGS.contact_email,
              contact_whatsapp: json.settings.contact_whatsapp || DEFAULT_STORE_SETTINGS.contact_whatsapp,
              contact_phone: json.settings.contact_phone || DEFAULT_STORE_SETTINGS.contact_phone,
              instagram_url: json.settings.instagram_url || DEFAULT_STORE_SETTINGS.instagram_url,
            });
          }
        }
      } catch {
        // Fallback silencioso a DEFAULT_STORE_SETTINGS
      }
    }
    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const whatsappDigits = settings.contact_whatsapp.replace(/\D/g, '') || '56985350038';
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappDigits}&text=${encodeURIComponent(
    'Hola Casa Aira, me gustaría recibir asesoría personalizada sobre tallas y modelos disponibles.'
  )}`;

  const channels = [
    {
      id: 'whatsapp',
      badge: 'ATENCIÓN INMEDIATA • CONCIERGE',
      title: 'WhatsApp Boutique',
      handle: settings.contact_phone || '+56 9 8535 0038',
      description:
        'Asesoría directa de calce, tabla de medidas reales (XS a 6XL), videos de caída de tela y seguimiento prioritario de tu envío en todo Chile.',
      cta: 'Conversar por WhatsApp',
      href: whatsappUrl,
      icon: MessageCircle,
      featured: true,
    },
    {
      id: 'instagram',
      badge: 'LOOKBOOK & REELS OFICIAL',
      title: 'Instagram Editorial',
      handle: '@casa.airaa',
      description:
        'Reels de movimiento real en luz natural, lanzamientos exclusivos de vestidos de fiesta y alta costura para clientas en todo Chile.',
      cta: 'Seguir @casa.airaa en Instagram',
      href: settings.instagram_url || 'https://www.instagram.com/casa.airaa?mdxt=MW11bHQ5dHpvZDl2NA%3D%3D',
      icon: Instagram,
      featured: false,
    },
  ];

  return (
    <section
      aria-labelledby="social-concierge-heading"
      className="py-24 sm:py-32 px-4 sm:px-6 bg-[#F4EFE8]/70 border-t border-stone-200/70 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Encabezado Editorial */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/90 border border-stone-200/80 text-[10px] tracking-[0.32em] uppercase font-semibold text-calypso-800">
            <Sparkles className="w-3.5 h-3.5 text-[#BFA15F]" />
            <span>COMUNIDAD & CONCIERGE DIGITAL</span>
          </div>

          <h2
            id="social-concierge-heading"
            className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#181716] leading-tight font-normal"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Cercanía real en cada detalle,{' '}
            <span className="italic text-calypso-700">acompañándote en cada elección.</span>
          </h2>

          <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto">
            Conecta con nuestro atelier a través de nuestras redes oficiales o escríbenos directamente al WhatsApp Concierge <strong className="font-medium text-[#181716]">{settings.contact_phone || '+56 9 8535 0038'}</strong> para asesoría personalizada de medidas.
          </p>
        </div>

        {/* Grilla Couture Base 8 (2 columnas en Desktop/Tablet, 1 en Móvil) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {channels.map((channel, index) => {
            const IconComponent = channel.icon;
            const isFeatured = channel.featured;

            return (
              <motion.a
                key={channel.id}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
                viewport={{ once: true }}
                className={`group relative flex flex-col justify-between p-8 border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-calypso-700 focus-visible:ring-offset-2 ${
                  isFeatured
                    ? 'bg-[#181716] text-[#FAF8F5] border-stone-800 hover:border-[#BFA15F] shadow-md'
                    : 'bg-[#FAF8F5] text-[#181716] border-stone-200/90 hover:border-calypso-700/60 hover:bg-white shadow-sm'
                }`}
              >
                <div>
                  {/* Top Row: Badge + Ergonomic Icon */}
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <span
                      className={`text-[9px] tracking-[0.22em] uppercase font-semibold px-2.5 py-1 border ${
                        isFeatured
                          ? 'bg-stone-900/90 border-[#BFA15F]/40 text-[#E5D3A1]'
                          : 'bg-stone-100 border-stone-200 text-stone-700'
                      }`}
                    >
                      {channel.badge}
                    </span>

                    <div
                      className={`w-11 h-11 rounded-full border flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                        isFeatured
                          ? 'bg-[#1D707F]/25 border-[#BFA15F]/50 text-[#E5D3A1]'
                          : 'bg-stone-100 border-stone-200/80 text-[#181716] group-hover:bg-calypso-50 group-hover:border-calypso-200 group-hover:text-calypso-700'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title & Handle */}
                  <div className="space-y-1.5 mb-4">
                    <h3
                      className={`font-serif text-2xl font-normal ${
                        isFeatured ? 'text-[#FAF8F5]' : 'text-[#181716]'
                      }`}
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {channel.title}
                    </h3>
                    <p
                      className={`text-xs tracking-[0.18em] uppercase font-semibold ${
                        isFeatured ? 'text-[#E5D3A1]' : 'text-calypso-700'
                      }`}
                    >
                      {channel.handle}
                    </p>
                  </div>

                  <p
                    className={`text-xs font-light leading-relaxed mb-8 ${
                      isFeatured ? 'text-stone-300' : 'text-stone-600'
                    }`}
                  >
                    {channel.description}
                  </p>
                </div>

                {/* Ergonomic Touch Target CTA (>= 48px height) */}
                <div
                  className={`min-h-[48px] px-4 py-3 border flex items-center justify-between text-[10px] tracking-[0.2em] uppercase font-semibold transition-all duration-300 ${
                    isFeatured
                      ? 'bg-[#FAF8F5] text-[#181716] border-[#FAF8F5] group-hover:bg-[#BFA15F] group-hover:border-[#BFA15F] group-hover:text-[#181716]'
                      : 'bg-white text-[#181716] border-stone-300 group-hover:bg-[#181716] group-hover:text-[#FAF8F5] group-hover:border-[#181716]'
                  }`}
                >
                  <span>{channel.cta}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
