'use client';


import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductCarousel from '@/components/ProductCarousel';

import Categories from '@/components/Categories';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className='min-h-screen relative overflow-x-hidden'>
      <Header />
      {/* Efectos de partículas de fondo - reducidos */}


      {/* Hero Section */}
      <Hero />

      {/* Categories Section */}
      <Categories />



      {/* Featured Products */}
      <ProductCarousel />

      {/* Footer */}
      <Footer />
    </main>
  );
}
