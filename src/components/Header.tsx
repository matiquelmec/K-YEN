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
    { name: 'Brisa Calipso', href: '/catalogo?category=veraniego' },
    { name: 'Dorado Solar', href: '/catalogo?category=gotico' },
    { name: 'Rosa Amanecer', href: '/catalogo?category=primaveral' },
  ];

  return (
    <header className='fixed top-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-md border-b border-stone-200/70 shadow-sm transition-all duration-300'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-18 py-2'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link href='/' className='flex items-center'>
              <CasaAiraLogo size='md' variant='full' />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-8'>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className='text-stone-700 hover:text-calypso-600 font-medium text-sm transition-colors duration-300 relative group py-1'
              >
                {item.name}
                <span className='absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-calypso-500 to-gold-400 group-hover:w-full transition-all duration-300 rounded-full' />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className='hidden md:flex items-center space-x-4'>
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className='p-2.5 rounded-full bg-stone-100/80 hover:bg-calypso-50 text-stone-600 hover:text-calypso-600 transition-colors'
              title='Buscar vestidos'
            >
              <Search className='w-4 h-4' />
            </button>

            {/* Cart */}
            <Cart />
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden flex items-center space-x-2'>
            <Cart />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='p-2 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors'
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
        className='md:hidden bg-white/95 backdrop-blur-md border-t border-stone-200/70 overflow-hidden'
      >
        <div className='px-4 pt-3 pb-4 space-y-1'>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className='block px-4 py-2.5 text-stone-700 hover:text-calypso-600 hover:bg-calypso-50/50 rounded-xl text-sm font-medium transition-colors'
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
          className='absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-t border-stone-200/80 p-4'
        >
          <div className='max-w-2xl mx-auto'>
            <input
              type='text'
              placeholder='Buscar por nombre, color o estilo de vestido...'
              className='w-full px-5 py-3 rounded-full border border-stone-300 focus:outline-none focus:ring-2 focus:ring-calypso-500 focus:border-transparent text-sm bg-stone-50/50'
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