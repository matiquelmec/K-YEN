'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { DEFAULT_STORE_SETTINGS } from '@/types/settings';

export default function WhatsAppConciergeFloat() {
  const [whatsappNumber, setWhatsappNumber] = useState<string>(
    DEFAULT_STORE_SETTINGS.contact_whatsapp
  );

  useEffect(() => {
    let isMounted = true;
    async function loadWhatsapp() {
      try {
        const res = await fetch('/api/settings', { next: { revalidate: 60 } } as any);
        if (res.ok) {
          const json = await res.json();
          const raw = String(json.settings?.contact_whatsapp || '').replace(/\D/g, '');
          if (isMounted && raw && raw !== '56912345678') {
            setWhatsappNumber(raw);
          }
        }
      } catch {
        // Fallback silencioso a +56 9 8535 0038
      }
    }
    loadWhatsapp();
    return () => {
      isMounted = false;
    };
  }, []);

  const href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hola Casa Aira ✨ Quisiera asesoría sobre un vestido del catálogo.'
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Asesoría directa por WhatsApp Concierge +56 9 8535 0038"
      className="fixed bottom-20 md:bottom-8 right-4 sm:right-6 z-40 group flex items-center gap-3 min-h-[48px] min-w-[48px] px-4 py-3 rounded-full bg-[#181716]/95 text-[#FAF8F5] border border-[#BFA15F]/50 shadow-lg backdrop-blur-md hover:bg-[#1D707F] hover:border-[#FAF8F5]/40 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D707F] focus-visible:ring-offset-2"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
      </span>
      <MessageCircle className="w-4 h-4 text-[#E5D3A1] group-hover:text-white transition-colors" />
      <span className="hidden sm:inline-block text-[10px] tracking-[0.22em] uppercase font-semibold">
        Concierge • +56 9 8535 0038
      </span>
    </a>
  );
}
