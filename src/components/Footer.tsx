'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Instagram,
  Facebook,
} from 'lucide-react';
import CasaAiraLogo from '@/components/ui/CasaAiraLogo';
import { APP_CONFIG } from '@/lib/config';

const TiktokIcon = (props: React.ComponentProps<'svg'>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.86.17 1.72.3 2.58.46.01 1.37 0 2.75-.01 4.12-.99-.28-1.92-.76-2.73-1.43-.13-.1-.23-.23-.33-.36-.07 1.83-.03 3.67-.03 5.5 0 2.44-.8 4.96-2.58 6.64-1.74 1.7-4.32 2.37-6.66 1.88-2.51-.43-4.71-2.43-5.26-4.93-.72-2.95.83-6.17 3.68-7.1 1.08-.38 2.24-.41 3.34-.17v4.18c-.89-.35-1.92-.26-2.72.33-.86.58-1.25 1.7-1.02 2.71.21 1.07 1.22 1.86 2.31 1.82 1.13-.02 2.11-.93 2.17-2.06.07-2.86.02-5.72.03-8.58-.01-4.65-.01-9.3 0-13.95z"/>
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
            <div className='pt-2'>
              <span className='text-[10px] tracking-[0.3em] uppercase text-stone-500 block'>
                CURATED BOUTIQUE • CHILE
              </span>
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
              Los Capítulos
            </h4>
            <ul className='space-y-4 text-xs tracking-wider uppercase font-light'>
              {[
                { label: 'Capítulo I: Brisa & Calipso', href: '/catalogo?category=veraniego' },
                { label: 'Capítulo II: Solsticio Dorado', href: '/catalogo?category=gotico' },
                { label: 'Capítulo III: Rosa de Alba', href: '/catalogo?category=primaveral' },
                { label: 'Ver Todo el Catálogo', href: '/catalogo' },
                { label: 'El Manifiesto de Marca', href: '/#manifiesto' },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className='text-stone-400 hover:text-white transition-colors duration-300'
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
              Club Exclusivo Casa Aira
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
                const email = emailInput.value;
                const btn = form.querySelector('button');

                if (!email) return;

                try {
                  if (btn) btn.disabled = true;
                  
                  const res = await fetch('/api/subscribers', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                  });

                  if (!res.ok) {
                    throw new Error('Error al registrar suscripción');
                  }

                  const data = await res.json();
                  
                  if (data.message === 'Ya suscrito') {
                    alert('¡Ya eres parte del Club Casa Aira! Gracias por tu preferencia.');
                  } else {
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
                required
                placeholder='Tu correo electrónico...'
                className='flex-1 px-4 py-3 bg-stone-900/80 border border-stone-700 text-stone-100 text-xs tracking-wider placeholder-stone-500 focus:outline-none focus:border-calypso-400'
              />
              <button
                type='submit'
                className='px-6 py-3 bg-[#FAF8F5] text-[#181716] hover:bg-calypso-600 hover:text-white tracking-[0.2em] text-[10px] uppercase font-semibold transition-all duration-300'
              >
                Suscribirme
              </button>
            </form>

            {/* Redes y Contacto */}
            <div className='pt-6 border-t border-stone-800/80 flex items-center justify-between'>
              <div className='flex items-center gap-4 text-xs text-stone-400'>
                <a href={`mailto:${APP_CONFIG.contact.email}`} className='hover:text-white transition-colors'>
                  {APP_CONFIG.contact.email}
                </a>
              </div>
              <div className='flex gap-3'>
                {[
                  { icon: Instagram, href: APP_CONFIG.social.instagram },
                  { icon: Facebook, href: APP_CONFIG.social.facebook },
                  { icon: TiktokIcon, href: APP_CONFIG.social.tiktok },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className='w-8 h-8 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:text-white hover:border-stone-500 transition-colors'
                  >
                    <social.icon className='w-3.5 h-3.5' />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-stone-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.25em] text-stone-500 font-light'>
          <div>
            © {currentYear} Casa Aira Atelier. Todos los derechos reservados.
          </div>

          <div className='flex items-center gap-8'>
            <Link href='/politicas?tab=privacidad' className='hover:text-white transition-colors'>
              Privacidad
            </Link>
            <Link href='/politicas?tab=terminos' className='hover:text-white transition-colors'>
              Términos
            </Link>
            <Link href='/politicas?tab=devoluciones' className='hover:text-white transition-colors'>
              Cambios y Devoluciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
