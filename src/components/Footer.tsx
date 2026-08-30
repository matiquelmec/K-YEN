'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart,
  Mail,
  Phone,
  MapPin,
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
    <footer className='relative py-12 md:py-20 px-4 mt-16 md:mt-24 border-t border-stone-200/80 bg-stone-900 text-stone-300'>
      <div className='max-w-7xl mx-auto relative z-10'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-12 md:mb-16'>
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='md:col-span-2 lg:col-span-1'
          >
            <div className='mb-6'>
              <CasaAiraLogo size='lg' variant='full' animated={true} theme='dark' />
            </div>
            <p className='text-stone-400 text-sm leading-relaxed max-w-sm'>
              Celebrando tu libertad, elegancia y autenticidad. Vestidos exclusivos diseñados para fluir con tu esencia.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className='font-display text-lg font-bold text-white mb-6 uppercase tracking-wider'>
              Colecciones
            </h4>
            <ul className='space-y-3 text-sm'>
              {[
                { label: 'Brisa Calipso (Verano & Fiesta)', href: '/catalogo?category=veraniego' },
                { label: 'Dorado Solar (Gala & Noche)', href: '/catalogo?category=gotico' },
                { label: 'Rosa Amanecer (Cóctel & Romántico)', href: '/catalogo?category=primaveral' },
                { label: 'Ver Todo el Catálogo', href: '/catalogo' },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 4 }}
                  className='text-stone-400 hover:text-calypso-400 transition-colors cursor-pointer'
                >
                  <Link href={item.href}>
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className='font-display text-lg font-bold text-white mb-6 uppercase tracking-wider'>
              Atención & Taller
            </h4>
            <div className='space-y-3.5 text-sm'>
              <div className='flex items-center gap-3 text-stone-300'>
                <Mail className='w-4 h-4 flex-shrink-0 text-calypso-400' />
                <a href={`mailto:${APP_CONFIG.contact.email}`} className='hover:text-calypso-400 transition-colors'>
                  {APP_CONFIG.contact.email}
                </a>
              </div>
              <div className='flex items-center gap-3 text-stone-300'>
                <Phone className='w-4 h-4 flex-shrink-0 text-calypso-400' />
                <a href={`tel:${APP_CONFIG.contact.phone.replace(/\s+/g, '')}`} className='hover:text-calypso-400 transition-colors'>
                  {APP_CONFIG.contact.phone}
                </a>
              </div>
              <div className='flex items-center gap-3 text-stone-300'>
                <MapPin className='w-4 h-4 flex-shrink-0 text-calypso-400' />
                <span>Envíos a todo Chile vía Starken & Chilexpress</span>
              </div>
            </div>

            {/* Social Media */}
            <div className='mt-6'>
              <h5 className='text-xs uppercase tracking-widest text-stone-400 mb-3'>Síguenos</h5>
              <div className='flex gap-3'>
                {[
                  { icon: Instagram, href: APP_CONFIG.social.instagram, color: 'hover:text-pink-400' },
                  { icon: Facebook, href: APP_CONFIG.social.facebook, color: 'hover:text-calypso-400' },
                  { icon: TiktokIcon, href: APP_CONFIG.social.tiktok, color: 'hover:text-gold-400' },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-9 h-9 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 ${social.color} transition-all duration-300`}
                  >
                    <social.icon className='w-4 h-4' />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className='bg-stone-800/80 border border-stone-700/80 rounded-3xl p-8 mb-12'
        >
          <div className='text-center max-w-2xl mx-auto'>
            <h4 className='font-display text-2xl md:text-3xl font-bold text-white mb-2'>
              Club Exclusivo Casa Aira
            </h4>
            <p className='text-stone-400 text-sm mb-6'>
              Recibe lanzamientos de temporada, invitaciones a preventas y beneficios especiales.
            </p>
            <div className='flex flex-col md:flex-row gap-3 max-w-md mx-auto'>
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
                      alert('¡Bienvenida a Casa Aira! Te avisaremos de nuestras próximas colecciones.');
                      emailInput.value = '';
                    }
                  } catch (err) {
                    console.error(err);
                    alert('Hubo un error al suscribirte. Intenta nuevamente.');
                  } finally {
                    if (btn) btn.disabled = false;
                  }
                }}
                className='contents'
              >
                <input
                  name='email'
                  type='email'
                  required
                  placeholder='Tu correo electrónico'
                  className='flex-1 px-5 py-3 rounded-full bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-calypso-400 text-sm'
                />
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type='submit'
                  className='btn-calypso whitespace-nowrap disabled:opacity-50 text-sm'
                >
                  <span className='flex items-center gap-2'>
                    <Heart className='w-4 h-4' />
                    Unirme al Club
                  </span>
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className='border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500'>
          <div>
            © {currentYear} Casa Aira. Todos los derechos reservados.
          </div>

          <div className='flex items-center gap-6'>
            <Link href='/politicas?tab=privacidad' className='hover:text-calypso-400 transition-colors'>
              Privacidad
            </Link>
            <Link href='/politicas?tab=terminos' className='hover:text-calypso-400 transition-colors'>
              Términos
            </Link>
            <Link href='/politicas?tab=devoluciones' className='hover:text-calypso-400 transition-colors'>
              Cambios y Devoluciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
