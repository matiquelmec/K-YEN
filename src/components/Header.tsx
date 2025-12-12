'use client';

import { motion } from 'framer-motion';
import { Menu, X, Search } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cart from './Cart';
import KuyenLogo from './ui/KuyenLogo';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  const navigation = [
    { name: 'Catálogo', href: '/catalogo' },
    { name: 'Luna Nueva', href: '/catalogo?category=gotico' },
    { name: 'Eclipse Floral', href: '/catalogo?category=primaveral' },
    { name: 'Solsticio', href: '/catalogo?category=veraniego' },
  ];

  return (
    <header className='fixed top-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-md border-b border-white/10'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link href='/' className='flex items-center'>
              <KuyenLogo size='sm' variant='icon' />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-8'>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className='text-white/90 hover:text-white font-medium transition-colors duration-300 relative group'
              >
                {item.name}
                <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sensual-400 to-earth-400 group-hover:w-full transition-all duration-300' />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className='hidden md:flex items-center space-x-4'>
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className='p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors'
            >
              <Search className='w-5 h-5 text-white' />
            </button>



            {/* Cart */}
            <Cart />
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden flex items-center space-x-2'>
            <Cart />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors'
            >
              {isMenuOpen ? (
                <X className='w-6 h-6 text-white' />
              ) : (
                <Menu className='w-6 h-6 text-white' />
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
        className='md:hidden bg-black/30 backdrop-blur-md border-t border-white/10 overflow-hidden'
      >
        <div className='px-4 pt-2 pb-3 space-y-1'>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className='block px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-colors'
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
          className='absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4'
        >
          <div className='max-w-2xl mx-auto'>
            <input
              type='text'
              placeholder='Buscar vestidos...'
              className='w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sensual-500 focus:border-transparent'
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsSearchOpen(false);
                } else if (e.key === 'Enter') {
                  const query = (e.target as HTMLInputElement).value;
                  if (query.trim()) {
                    setIsMenuOpen(false); // Close mobile menu if open
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