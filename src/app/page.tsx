'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import BrandManifesto from '@/components/BrandManifesto';
import Categories from '@/components/Categories';
import ProductCarousel from '@/components/ProductCarousel';
import UnboxingExperience from '@/components/UnboxingExperience';
import SocialConcierge from '@/components/SocialConcierge';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className='min-h-screen relative overflow-x-hidden bg-[#FAF8F5]'>
      <Header />
      
      {/* Portada Editorial con Video Loop Cinemático */}
      <Hero />

      {/* Manifiesto y Filosofía de Curaduría con Fotografía Editorial */}
      <BrandManifesto />

      {/* Capítulos y Colecciones con Covers Visuales */}
      <Categories />

      {/* Vestidos Destacados de Selección Exclusiva */}
      <ProductCarousel />

      {/* Experiencia de Empaque y Bolsas Boutique (Unboxing) */}
      <UnboxingExperience />

      {/* Comunidad Editorial & WhatsApp Concierge Directo (+56 9 8535 0038) */}
      <SocialConcierge />

      {/* Pie de Página Editorial */}
      <Footer />
    </main>
  );
}
