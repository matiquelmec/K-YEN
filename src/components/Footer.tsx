'use client';

import { motion } from 'framer-motion';
import {
  Heart,
  Moon,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react';
import KuyenLogo from '@/components/ui/KuyenLogo';

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
                'Luna Nueva',
                'Solsticio',
              ].map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  className='text-bone-200 hover:text-terra-300 transition-colors cursor-pointer'
                >
                  {link}
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
                <Mail className='w-5 h-5' />
                <span>hola@kuyen.cl</span>
              </div>
              <div className='flex items-center gap-3 text-bone-200'>
                <Phone className='w-5 h-5' />
                <span>+56 9 1234 5678</span>
              </div>
              <div className='flex items-center gap-3 text-bone-200'>
                <MapPin className='w-5 h-5' />
                <span>Ñuble, Chile</span>
              </div>
            </div>

            {/* Social Media */}
            <div className='mt-6'>
              <h5 className='font-semibold text-gradient-lunar mb-4'>Síguenos</h5>
              <div className='flex gap-4'>
                {[
                  { icon: Instagram, href: '#', color: 'hover:text-mystic-400' },
                  { icon: Facebook, href: '#', color: 'hover:text-terra-400' },
                  { icon: Twitter, href: '#', color: 'hover:text-lunar-400' },
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
                    // Dynamic import to avoid dependency issues if any
                    const { supabase } = await import('@/lib/supabase/client');

                    const { error } = await supabase
                      .from('subscribers')
                      .insert({ email });

                    if (error) {
                      if (error.code === '23505') { // Unique violation
                        alert('¡Ya estás suscrita! Gracias por tu interés.');
                      } else {
                        throw error;
                      }
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
              <a href='#' className='hover:text-terra-300 transition-colors'>
                Política de Privacidad
              </a>
              <a href='#' className='hover:text-terra-300 transition-colors'>
                Términos y Condiciones
              </a>
              <a href='#' className='hover:text-terra-300 transition-colors'>
                Cambios y Devoluciones
              </a>
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
