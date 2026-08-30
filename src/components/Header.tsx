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
    { name: 'El Manifiesto', href: '/#manifiesto' },
  ];

  return (
    <header className='fixed top-0 left-0 right-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/60 transition-all duration-300'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-20'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link href='/' className='flex items-center'>
              <CasaAiraLogo size='md' variant='full' />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-9'>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className='text-[#181716]/80 hover:text-calypso-700 tracking-[0.2em] uppercase text-[11px] font-medium transition-colors duration-300 relative py-1 group'
              >
                {item.name}
                <span className='absolute bottom-0 left-0 w-0 h-[1px] bg-calypso-600 group-hover:w-full transition-all duration-300 ease-out' />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className='hidden md:flex items-center space-x-3'>
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className='p-2.5 rounded-full hover:bg-stone-200/50 text-stone-700 hover:text-calypso-700 transition-colors'
              title='Buscar vestidos'
            >
              <Search className='w-4 h-4 stroke-[1.5]' />
            </button>

            {/* Cart */}
            <Cart />
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden flex items-center space-x-2'>
            <Cart />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='p-2 text-stone-800 hover:text-calypso-700 transition-colors'
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
        className='md:hidden bg-[#FAF8F5] border-t border-stone-200/60 overflow-hidden'
      >
        <div className='px-6 pt-4 pb-6 space-y-2'>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className='block py-2.5 text-stone-800 hover:text-calypso-700 tracking-[0.2em] uppercase text-xs font-medium transition-colors'
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
          <div className='max-w-2xl mx-auto'>
            <input
              type='text'
              placeholder='Buscar por silueta, tono o colección...'
              className='w-full px-5 py-3 border-b border-stone-400 focus:border-calypso-600 bg-transparent text-sm tracking-wide focus:outline-none placeholder-stone-400'
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