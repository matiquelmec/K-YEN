'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect, Suspense } from 'react';
import {
  Search,
  Grid,
  List,
  SlidersHorizontal,
} from 'lucide-react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import { useProducts } from '@/hooks/useProducts';

function CatalogoContent() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 150000]);
  const [showPlusSize, setShowPlusSize] = useState(false);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'newest' | 'rating'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  const { products, loading, error } = useProducts({
    category: selectedCategory,
    search: searchTerm,
    sortBy: sortBy,
  });

  // Filter products locally by size and price
  const filteredProducts = products.filter(product => {
    const matchesSizes = selectedSizes.length === 0 ||
      selectedSizes.some(size => product.sizes.includes(size));

    const matchesPrice = product.price >= (priceRange[0] ?? 0) && product.price <= (priceRange[1] ?? 150000);

    const matchesPlusSize = !showPlusSize ||
      product.sizes.some(size => ['4XL', '5XL', '6XL'].includes(size));

    return matchesSizes && matchesPrice && matchesPlusSize;
  });

  return (
    <div className='min-h-screen bg-gradient-to-br from-earth-900 via-earth-800 to-gothic-900'>
      <Header />
      <div className='max-w-7xl mx-auto px-4 py-8 pt-24'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center mb-12'
        >
          <h1 className='font-display text-4xl md:text-6xl font-bold mb-4'>
            <span className='text-gradient-earth'>Nuestra</span>{' '}
            <span className='text-gradient-sensual'>Colección</span>
          </h1>
          <p className='text-earth-200 text-lg max-w-2xl mx-auto'>
            Descubre vestidos únicos que celebran la feminidad en todas sus formas
          </p>
        </motion.div>

        <div className='flex gap-8'>
          {/* Sidebar Filters - Desktop */}
          <div className='hidden lg:block w-80 flex-shrink-0'>
            <FilterSidebar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedSizes={selectedSizes}
              onSizesChange={setSelectedSizes}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              showPlusSize={showPlusSize}
              onPlusSizeChange={setShowPlusSize}
            />
          </div>

          {/* Main Content */}
          <div className='flex-1'>
            {/* Search and Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-gradient-to-r from-earth-50 to-sensual-50 backdrop-blur-sm border border-earth-200 rounded-xl p-6 mb-8'
            >
              <div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
                {/* Search */}
                <div className='relative flex-1 max-w-md'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-500 w-5 h-5' />
                  <input
                    type='text'
                    placeholder='Buscar vestidos...'
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className='w-full pl-10 pr-4 py-3 rounded-full border border-earth-300 focus:outline-none focus:ring-2 focus:ring-sensual-400 bg-white'
                  />
                </div>

                <div className='flex items-center gap-4'>
                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className='lg:hidden flex items-center gap-2 px-4 py-2 bg-earth-600 text-white rounded-full hover:bg-earth-700 transition-colors'
                  >
                    <SlidersHorizontal className='w-4 h-4' />
                    Filtros
                  </button>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className='px-4 py-2 rounded-full border border-earth-300 bg-white text-earth-700 focus:outline-none focus:ring-2 focus:ring-sensual-400'
                  >
                    <option value='newest'>Más Nuevos</option>
                    <option value='price_asc'>Menor Precio</option>
                    <option value='price_desc'>Mayor Precio</option>
                    <option value='rating'>Mejor Valorados</option>
                  </select>

                  {/* View Mode */}
                  <div className='flex rounded-full border border-earth-300 bg-white overflow-hidden'>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-sensual-500 text-white' : 'text-earth-600'}`}
                    >
                      <Grid className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-sensual-500 text-white' : 'text-earth-600'}`}
                    >
                      <List className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              </div>

              {/* Results count */}
              <div className='mt-4 text-earth-600'>
                {loading ? 'Cargando...' : (
                  <>
                    {filteredProducts.length} vestido{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                  </>
                )}
              </div>
            </motion.div>

            {/* Mobile Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className='lg:hidden mb-8'
              >
                <FilterSidebar
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  selectedSizes={selectedSizes}
                  onSizesChange={setSelectedSizes}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  showPlusSize={showPlusSize}
                  onPlusSizeChange={setShowPlusSize}
                />
              </motion.div>
            )}

            {/* Error State */}
            {error && (
              <div className='text-center py-8 text-red-400'>
                Error al cargar productos. Por favor, intenta nuevamente.
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className='bg-white/10 rounded-xl h-96 animate-pulse' />
                ))}
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`grid gap-6 ${viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
                  }`}
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ProductCard product={product} viewMode={viewMode} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* No results */}
            {!loading && !error && filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='text-center py-16'
              >
                <div className='w-24 h-24 rounded-full bg-gradient-to-br from-earth-400 to-sensual-400 flex items-center justify-center mx-auto mb-6 opacity-50'>
                  <Search className='w-12 h-12 text-white' />
                </div>
                <h3 className='font-display text-2xl font-bold text-earth-300 mb-4'>
                  No encontramos vestidos
                </h3>
                <p className='text-earth-400 mb-6'>
                  Intenta ajustar tus filtros o buscar con otros términos
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedSizes([]);
                    setShowPlusSize(false);
                  }}
                  className='btn-earth'
                >
                  Limpiar Filtros
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-earth-900 flex items-center justify-center text-white">Cargando catálogo...</div>}>
      <CatalogoContent />
    </Suspense>
  );
}