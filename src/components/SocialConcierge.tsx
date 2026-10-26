'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, MessageCircle, ArrowUpRight, Sparkles } from 'lucide-react';
import { DEFAULT_STORE_SETTINGS, type StoreSettings } from '@/types/settings';

const TiktokIcon = (props: React.ComponentProps<'svg'>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.86.17 1.72.3 2.58.46.01 1.37 0 2.75-.01 4.12-.99-.28-1.92-.76-2.73-1.43-.13-.1-.23-.23-.33-.36-.07 1.83-.03 3.67-.03 5.5 0 2.44-.8 4.96-2.58 6.64-1.74 1.7-4.32 2.37-6.66 1.88-2.51-.43-4.71-2.43-5.26-4.93-.72-2.95.83-6.17 3.68-7.1 1.08-.38 2.24-.41 3.34-.17v4.18c-.89-.35-1.92-.26-2.72.33-.86.58-1.25 1.7-1.02 2.71.21 1.07 1.22 1.86 2.31 1.82 1.13-.02 2.11-.93 2.17-2.06.07-2.86.02-5.72.03-8.58-.01-4.65-.01-9.3 0-13.95z" />
  </svg>
);

export default function SocialConcierge() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);

  useEffect(() => {
    let isMounted = true;
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings', { next: { revalidate: 60 } } as any);
        if (res.ok) {
          const json = await res.json();
          if (json.settings && isMounted) {
            const rawWa = String(json.settings.contact_whatsapp || '');
            const officialWa =
              !rawWa || rawWa === '56912345678' ? '56985350038' : rawWa.replace(/\D/g, '');
            const officialPhone =
              !json.settings.contact_phone || json.settings.contact_phone.includes('1234')
                ? '+56 9 8535 0038'
                : json.settings.contact_phone;

            setSettings({
              ...json.settings,
              contact_whatsapp: officialWa,
              contact_phone: officialPhone,
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
  const whatsappUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
    'Hola Casa Aira ✨ Me gustaría recibir asesoría personalizada sobre tallas y modelos disponibles.'
  )}`;

  const channels = [
    {
      id: 'whatsapp',
      badge: 'ATENCIÓN INMEDIATA • CONCIERGE',
      title: 'WhatsApp Boutique',
      handle: '+56 9 8535 0038',
      description:
        'Asesoría directa de calce, tabla de medidas reales (XS a 6XL), videos de caída de tela y seguimiento de tu envío en Chile.',
      cta: 'Conversar por WhatsApp',
      href: whatsappUrl,
      icon: MessageCircle,
      featured: true,
    },
    {
      id: 'instagram',
      badge: 'LOOKBOOK & REELS',
      title: 'Instagram Editorial',
      handle: '@casaaira_oficial',
      description:
        'Reels de movimiento real en luz natural, adelantos de colección y clientas reales en todo Chile.',
      cta: 'Seguir en Instagram',
      href: settings.instagram_url,
      icon: Instagram,
      featured: false,
    },
    {
      id: 'tiktok',
      badge: 'BACKSTAGE & CALCE',
      title: 'TikTok Atelier',
      handle: '@casaaira_oficial',
      description:
        'Pruebas de vestidos en distintas siluetas, tips de estilismo para bodas y galas, y desempaque boutique.',
      cta: 'Ver Videos en TikTok',
      href: settings.tiktok_url,
      icon: TiktokIcon,
      featured: false,
    },
    {
      id: 'facebook',
      badge: 'COMUNIDAD & RESEÑAS',
      title: 'Facebook Oficial',
      handle: 'Casa Aira Boutique',
      description:
        'Catálogo sincronizado, reseñas verificadas de clientas y atención cercana para cada temporada.',
      cta: 'Visitar Facebook',
      href: settings.facebook_url,
      icon: Facebook,
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
            Conecta con nuestro atelier a través de nuestras redes oficiales o escríbenos directamente al WhatsApp Concierge <strong className="font-medium text-[#181716]">+56 9 8535 0038</strong> para asesoría personalizada de medidas.
          </p>
        </div>

        {/* Grilla Couture Base 8 (4 columnas en Desktop, 2 en Tablet, 1 en Móvil) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
