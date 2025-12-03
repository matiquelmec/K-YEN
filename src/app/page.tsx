'use client';

import { motion } from 'framer-motion';
import { Leaf, Moon, Star } from 'lucide-react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductCarousel from '@/components/ProductCarousel';
import SizeInclusive from '@/components/SizeInclusive';
import Categories from '@/components/Categories';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className='min-h-screen relative overflow-x-hidden'>
      <Header />
      {/* Efectos de partículas de fondo - reducidos */}
      <div className='fixed inset-0 pointer-events-none z-0'>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute opacity-10'
            initial={{
              x: (i % 3) * 300 + (((i + 1) * 50) % 150),
              y: (i % 2) * 250 + (((i + 2) * 60) % 200),
            }}
            animate={{
              opacity: [0.05, 0.15, 0.05],
              y: [0, -10, 0],
              rotate: [0, 90, 180],
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              delay: i * 1,
              ease: 'easeInOut',
            }}
          >
            {i % 3 === 0 && <Leaf className='text-terra-400/40 w-2 h-2' />}
            {i % 3 === 1 && <Star className='text-mystic-400/40 w-2 h-2' />}
            {i % 3 === 2 && <Moon className='text-lunar-400/40 w-2 h-2' />}
          </motion.div>
        ))}
      </div>

      {/* Hero Section */}
      <Hero />

      {/* Categories Section */}
      <Categories />

      {/* Size Inclusive Section */}
      <SizeInclusive />

      {/* Featured Products */}
      <ProductCarousel />

      {/* Footer */}
      <Footer />
    </main>
  );
}
