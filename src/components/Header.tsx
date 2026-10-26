'use client';

import { motion } from 'framer-motion';
import { Menu, X, Search } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cart from './Cart';
import CasaAiraLogo from './ui/CasaAiraLogo';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  const navigation = [
    { name: 'Catálogo', href: '/catalogo' },
    { name: 'Brisa & Calipso', href: '/catalogo?category=veraniego' },
    { name: 'Solsticio Dorado', href: '/catalogo?category=gotico' },
    { name: 'Rosa de Alba', href: '/catalogo?category=primaveral' },
    { name: 'Nuestra Historia', href: '/#historia' },
  ];

  return (
    <header className='fixed top-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/70 transition-all duration-300'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-20'>
          {/* Logo con Zona de Respeto 1X */}
          <div className='flex-shrink-0 py-2 pr-2'>
            <Link href='/' className='flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-calypso-700 rounded-sm'>
              <CasaAiraLogo size='md' variant='full' />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-8 lg:space-x-9'>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className='text-[#181716]/85 hover:text-calypso-700 tracking-[0.2em] uppercase text-[11px] font-medium transition-colors duration-300 relative py-2 group focus-visible:outline-none focus-visible:text-calypso-700'
              >
                {item.name}
                <span className='absolute bottom-0 left-0 w-0 h-[1.5px] bg-calypso-600 group-hover:w-full transition-all duration-300 ease-out' />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions (Touch Targets >= 44px) */}
          <div className='hidden md:flex items-center space-x-2'>
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label='Buscar vestidos'
              className='min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-stone-200/50 text-stone-700 hover:text-calypso-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-calypso-700'
              title='Buscar vestidos'
            >
              <Search className='w-4 h-4 stroke-[1.5]' />
            </button>

            {/* Cart */}
            <Cart />
          </div>

          {/* Mobile Actions (Touch Targets >= 44px) */}
          <div className='md:hidden flex items-center gap-1'>
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (isMenuOpen) setIsMenuOpen(false);
              }}
              aria-label='Buscar vestidos'
              className='min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-stone-800 hover:text-calypso-700 transition-colors'
            >
              <Search className='w-4 h-4 stroke-[1.5]' />
            </button>
            <Cart />
            <button
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                if (isSearchOpen) setIsSearchOpen(false);
              }}
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              className='min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-800 hover:text-calypso-700 transition-colors'
            >
              {isMenuOpen ? (
                <X className='w-5 h-5' />
              ) : (
                <Menu className='w-5 h-5' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isMenuOpen ? 'auto' : 0,
          opacity: isMenuOpen ? 1 : 0,
        }}
        className='md:hidden bg-[#FAF8F5] border-t border-stone-200/70 overflow-hidden shadow-lg'
      >
        <div className='px-6 pt-3 pb-6 space-y-1'>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className='min-h-[48px] flex items-center text-[#181716] hover:text-calypso-700 tracking-[0.2em] uppercase text-xs font-medium border-b border-stone-200/40 last:border-0 transition-colors'
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className='absolute top-full left-0 right-0 bg-[#FAF8F5] shadow-lg border-t border-stone-200/80 p-6'
        >
          <div className='max-w-2xl mx-auto relative'>
            <input
              name='search'
              type='text'
              autoComplete='off'
              placeholder='Buscar por silueta, tono o colección...'
              className='w-full px-4 py-3.5 border-b border-stone-400 focus:border-calypso-700 bg-transparent text-sm tracking-wide focus:outline-none placeholder-stone-400 text-[#181716]'
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsSearchOpen(false);
                } else if (e.key === 'Enter') {
                  const query = (e.target as HTMLInputElement).value;
                  if (query.trim()) {
                    setIsMenuOpen(false);
                    setIsSearchOpen(false);
                    router.push(`/catalogo?search=${encodeURIComponent(query)}`);
                  }
                }
              }}
            />
          </div>
        </motion.div>
      )}
    </header>
  );
}
