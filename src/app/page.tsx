'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import BrandManifesto from '@/components/BrandManifesto';
import Categories from '@/components/Categories';
import ProductCarousel from '@/components/ProductCarousel';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className='min-h-screen relative overflow-x-hidden bg-[#FAF8F5]'>
      <Header />
      
      {/* Portada Editorial */}
      <Hero />

      {/* Manifiesto y Filosofía de Marca */}
      <BrandManifesto />

      {/* Capítulos y Colecciones */}
      <Categories />

      {/* Vestidos Destacados de Atelier */}
      <ProductCarousel />

      {/* Pie de Página Editorial */}
      <Footer />
    </main>
  );
}
