'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart,
  Moon,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
} from 'lucide-react';
import KuyenLogo from '@/components/ui/KuyenLogo';
import { APP_CONFIG } from '@/lib/config';

const TiktokIcon = (props: React.ComponentProps<'svg'>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.86.17 1.72.3 2.58.46.01 1.37 0 2.75-.01 4.12-.99-.28-1.92-.76-2.73-1.43-.13-.1-.23-.23-.33-.36-.07 1.83-.03 3.67-.03 5.5 0 2.44-.8 4.96-2.58 6.64-1.74 1.7-4.32 2.37-6.66 1.88-2.51-.43-4.71-2.43-5.26-4.93-.72-2.95.83-6.17 3.68-7.1 1.08-.38 2.24-.41 3.34-.17v4.18c-.89-.35-1.92-.26-2.72.33-.86.58-1.25 1.7-1.02 2.71.21 1.07 1.22 1.86 2.31 1.82 1.13-.02 2.11-.93 2.17-2.06.07-2.86.02-5.72.03-8.58-.01-4.65-.01-9.3 0-13.95z"/>
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='relative py-12 md:py-20 px-4 mt-12 md:mt-20'>
      {/* Background - coherente con el resto */}
      <div className='absolute inset-0 alchemical-texture opacity-30' />
      <div className='absolute inset-0 bg-gradient-to-t from-ink-950/90 to-terra-950/80' />

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
            <div className='mb-8'>
              <KuyenLogo size='lg' variant='full' animated={true} />
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className='font-display text-xl font-bold text-gradient-lunar mb-6'>
              Colecciones
            </h4>
            <ul className='space-y-3'>
              {[
                { label: 'Luna Nueva', href: '/catalogo?category=gotico' },
                { label: 'Eclipse Floral', href: '/catalogo?category=primaveral' },
                { label: 'Solsticio', href: '/catalogo?category=veraniego' },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  className='text-bone-200 hover:text-terra-300 transition-colors cursor-pointer'
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
            <h4 className='font-display text-xl font-bold text-gradient-lunar mb-6'>
              Contacto
            </h4>
            <div className='space-y-4'>
              <div className='flex items-center gap-3 text-bone-200'>
                <Mail className='w-5 h-5 flex-shrink-0 text-terra-400' />
                <a href={`mailto:${APP_CONFIG.contact.email}`} className='hover:text-terra-300 transition-colors'>
                  {APP_CONFIG.contact.email}
                </a>
              </div>
              <div className='flex items-center gap-3 text-bone-200'>
                <Phone className='w-5 h-5 flex-shrink-0 text-terra-400' />
                <a href={`tel:${APP_CONFIG.contact.phone.replace(/\s+/g, '')}`} className='hover:text-terra-300 transition-colors'>
                  {APP_CONFIG.contact.phone}
                </a>
              </div>
              <div className='flex items-center gap-3 text-bone-200'>
                <MapPin className='w-5 h-5 flex-shrink-0 text-terra-400' />
                <span>Ñuble, Chile</span>
              </div>
            </div>

            {/* Social Media */}
            <div className='mt-6'>
              <h5 className='font-semibold text-gradient-lunar mb-4'>Síguenos</h5>
              <div className='flex gap-4'>
                {[
                  { icon: Instagram, href: APP_CONFIG.social.instagram, color: 'hover:text-mystic-400' },
                  { icon: Facebook, href: APP_CONFIG.social.facebook, color: 'hover:text-terra-400' },
                  { icon: TiktokIcon, href: APP_CONFIG.social.tiktok, color: 'hover:text-lunar-400' },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 rounded-full bg-gradient-to-br from-terra-50/10 to-mystic-50/10 backdrop-blur-sm border border-terra-200/20 flex items-center justify-center text-bone-300 ${social.color} transition-all duration-300`}
                  >
                    <social.icon className='w-5 h-5' />
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
          className='bg-gradient-to-br from-terra-50/10 to-mystic-50/10 backdrop-blur-sm border border-terra-200/20 rounded-2xl p-8 mb-12'
        >
          <div className='text-center max-w-2xl mx-auto'>
            <h4 className='font-display text-2xl md:text-3xl font-bold text-gradient-lunar mb-4'>
              Únete a KÜYEN
            </h4>
            <p className='text-bone-200 mb-6'>
              Recibe nuestras nuevas colecciones y ofertas especiales
            </p>
            <div className='flex flex-col md:flex-row gap-4 max-w-md mx-auto'>
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
                      alert('¡Ya estás suscrita! Gracias por tu interés.');
                    } else {
                      alert('¡Gracias por suscribirte! Te avisaremos de nuestras novedades.');
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
                  className='flex-1 px-4 py-3 rounded-full bg-bone-50/90 backdrop-blur-sm text-ink-800 placeholder-ink-500 focus:outline-none focus:ring-2 focus:ring-mystic-400'
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type='submit'
                  className='btn-terra whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <span className='flex items-center gap-2'>
                    <Heart className='w-4 h-4' />
                    Suscribirse
                  </span>
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className='border-t border-ink-700 pt-8'
        >
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <div className='text-bone-300 text-sm'>
              © {currentYear} KÜYEN. Todos los derechos reservados.
            </div>

            <div className='flex items-center gap-6 text-bone-300 text-sm'>
              <Link href='/politicas?tab=privacidad' className='hover:text-terra-300 transition-colors'>
                Política de Privacidad
              </Link>
              <Link href='/politicas?tab=terminos' className='hover:text-terra-300 transition-colors'>
                Términos y Condiciones
              </Link>
              <Link href='/politicas?tab=devoluciones' className='hover:text-terra-300 transition-colors'>
                Cambios y Devoluciones
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Decorative Elements - reposicionados */}
        <div className='absolute top-1/3 right-4 opacity-10 hidden lg:block'>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            <Moon className='text-lunar-400 w-12 h-12' />
          </motion.div>
        </div>

        <div className='absolute bottom-1/3 left-4 opacity-10 hidden lg:block'>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Heart className='text-blood-400 w-8 h-8 fill-current' />
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
