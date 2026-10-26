'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Instagram,
  MessageCircle,
  Mail,
} from 'lucide-react';
import CasaAiraLogo from '@/components/ui/CasaAiraLogo';
import { DEFAULT_STORE_SETTINGS, type StoreSettings } from '@/types/settings';

export default function Footer() {
  const currentYear = new Date().getFullYear();
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
      } catch (err) {
        console.warn('Usando ajustes de tienda por defecto:', err);
      }
    }
    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const whatsappDigits = settings.contact_whatsapp.replace(/\D/g, '') || '56985350038';
  const whatsappUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
    'Hola Casa Aira ✨ Quisiera recibir atención personalizada.'
  )}`;

  return (
    <footer className='relative py-20 sm:py-28 px-4 sm:px-6 bg-[#181716] text-[#FAF8F5] border-t border-stone-800'>
      <div className='max-w-7xl mx-auto relative z-10'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-20'>
          
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='lg:col-span-4 space-y-6'
          >
            <div className='mb-6'>
              <CasaAiraLogo size='lg' variant='full' animated={true} theme='dark' />
            </div>
            <p className='text-stone-400 text-sm leading-relaxed font-light max-w-sm'>
              Celebrando la libertad, elegancia y autenticidad femenina. Vestidos seleccionados bajo rigurosos filtros de calidad y caída para abrazar todas las siluetas en Chile.
            </p>
            <div className='pt-2 space-y-2'>
              <span className='text-[10px] tracking-[0.3em] uppercase text-stone-400 block'>
                BOUTIQUE • CHILE
              </span>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-[#E5D3A1] hover:text-white transition-colors py-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Concierge: +56 9 8535 0038</span>
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className='lg:col-span-3'
          >
            <h4 className='text-[11px] uppercase tracking-[0.3em] font-semibold text-stone-300 mb-8'>
              Colecciones
            </h4>
            <ul className='space-y-4 text-xs tracking-wider uppercase font-light'>
              {[
                { label: 'Brisa & Calipso (Verano)', href: '/catalogo?category=veraniego' },
                { label: 'Solsticio Dorado (Gala)', href: '/catalogo?category=gotico' },
                { label: 'Rosa de Alba (Cóctel)', href: '/catalogo?category=primaveral' },
                { label: 'Todo el Catálogo', href: '/catalogo' },
                { label: 'Nuestra Historia', href: '/#historia' },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className='text-stone-400 hover:text-white transition-colors duration-300 inline-block py-1'
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info & Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className='lg:col-span-5 space-y-6'
          >
            <h4 className='text-[11px] uppercase tracking-[0.3em] font-semibold text-stone-300 mb-6'>
              Club Exclusivo <span className="font-serif italic font-normal text-gold-300">Casa Aira</span>
            </h4>
            <p className='text-stone-400 text-xs font-light leading-relaxed'>
              Recibe avisos exclusivos de prelanzamiento de nuevas selecciones y atenciones personalizadas.
            </p>

            {/* Newsletter Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const emailInput = form.elements.namedItem('email') as HTMLInputElement;
                const btn = form.querySelector('button');
                if (!emailInput || !emailInput.value) return;

                try {
                  if (btn) btn.disabled = true;
                  const res = await fetch('/api/subscribers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailInput.value }),
                  });
                  if (res.ok) {
                    alert('¡Bienvenida al Club Casa Aira! Te avisaremos de nuestros próximos lanzamientos.');
                    emailInput.value = '';
                  }
                } catch (err) {
                  console.error(err);
                  alert('Hubo un error al suscribirte. Intenta nuevamente.');
                } finally {
                  if (btn) btn.disabled = false;
                }
              }}
              className='flex flex-col sm:flex-row gap-3 pt-2'
            >
              <input
                name='email'
                type='email'
                autoComplete='email'
                required
                placeholder='Tu correo electrónico...'
                className='flex-1 min-h-[48px] px-4 py-3 bg-stone-900/80 border border-stone-700 text-stone-100 text-xs tracking-wider placeholder-stone-500 focus:outline-none focus:border-calypso-400'
              />
              <button
                type='submit'
                className='min-h-[48px] px-6 py-3 bg-[#FAF8F5] text-[#181716] hover:bg-calypso-600 hover:text-white tracking-[0.2em] text-[10px] uppercase font-semibold transition-all duration-300'
              >
                Suscribirme
              </button>
            </form>

            {/* Redes y Contacto con Touch Targets >= 44px (44x44px w-11 h-11) */}
            <div className='pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
              <div className='flex flex-col gap-1.5 text-xs text-stone-300'>
                <a
                  href={`mailto:${settings.contact_email}`}
                  className='inline-flex items-center gap-2 hover:text-white transition-colors py-1'
                >
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span>{settings.contact_email}</span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className='inline-flex items-center gap-2 text-[#E5D3A1] hover:text-white transition-colors py-1'
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{settings.contact_phone || '+56 9 8535 0038'}</span>
                </a>
              </div>
              <div className='flex items-center gap-3'>
                {[
                  { icon: MessageCircle, href: whatsappUrl, label: 'WhatsApp Concierge Casa Aira' },
                  { icon: Instagram, href: settings.instagram_url || 'https://www.instagram.com/casa.airaa?mdxt=MW11bHQ5dHpvZDl2NA%3D%3D', label: 'Instagram Editorial Casa Aira' },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className='w-11 h-11 rounded-full border border-stone-700 flex items-center justify-center text-stone-300 hover:text-white hover:border-[#BFA15F] hover:bg-stone-800/70 transition-all duration-300'
                  >
                    <social.icon className='w-4 h-4' />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-400 text-xs font-light">
          <p className="tracking-wide">
            © {currentYear} <span className="font-serif font-medium text-stone-200">Casa Aira</span> Boutique. Todos los derechos reservados.
          </p>

          <div className='flex items-center gap-8'>
            <Link href='/politicas?tab=privacidad' className='hover:text-white transition-colors py-1'>
              Privacidad
            </Link>
            <Link href='/politicas?tab=terminos' className='hover:text-white transition-colors py-1'>
              Términos
            </Link>
            <Link href='/politicas?tab=devoluciones' className='hover:text-white transition-colors py-1'>
              Cambios y Devoluciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
