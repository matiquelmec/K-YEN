'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect, Suspense } from 'react';
import {
  Search,
  Grid,
  List,
  SlidersHorizontal,
  Moon,
  Sun,
  Leaf,
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
          className='text-center mb-8 md:mb-12'
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Moon className="w-6 h-6 text-lunar-400 hidden md:block" />
            <h1 className='font-display text-4xl md:text-6xl font-bold'>
              <span className='text-gradient-earth'>Nuestra</span>{' '}
              <span className='text-gradient-sensual'>Colección</span>
            </h1>
            <Leaf className="w-6 h-6 text-spring-400 hidden md:block" />
          </div>
          <p className='text-earth-200 text-lg max-w-2xl mx-auto'>
            Descubre vestidos únicos que celebran la feminidad en todas sus formas
          </p>
        </motion.div>

        {/* Mobile Category Pills (Horizontal Scroll) */}
        <div className="lg:hidden mb-8 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-3 px-1 min-w-max">
            {[
              { id: 'all', label: 'Todo', icon: Grid },
              { id: 'gotico', label: 'Luna Nueva', icon: Moon },
              { id: 'primaveral', label: 'Eclipse', icon: Leaf },
              { id: 'veraniego', label: 'Solsticio', icon: Sun },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap ${selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-sensual-500 to-earth-500 text-white border-transparent shadow-md'
                  : 'bg-white/10 text-earth-200 border-earth-700 hover:bg-white/20'
                  }`}
              >
                <cat.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

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
              className='bg-gradient-to-r from-earth-50 to-sensual-50 backdrop-blur-sm border border-earth-200 rounded-xl p-4 md:p-6 mb-8'
            >
              <div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
                {/* Search */}
                <div className='relative flex-1 max-w-md w-full'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-500 w-5 h-5' />
                  <input
                    type='text'
                    placeholder='Buscar vestidos...'
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className='w-full pl-10 pr-4 py-3 rounded-full border border-earth-300 focus:outline-none focus:ring-2 focus:ring-sensual-400 bg-white'
                  />
                </div>

                <div className='flex items-center gap-3 w-full md:w-auto justify-between md:justify-end'>
                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className='lg:hidden flex items-center gap-2 px-4 py-2 bg-earth-600/90 text-white rounded-full hover:bg-earth-700 transition-colors text-sm'
                  >
                    <SlidersHorizontal className='w-4 h-4' />
                    Filtros
                  </button>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className='flex-1 md:flex-none px-4 py-2 rounded-full border border-earth-300 bg-white text-earth-700 focus:outline-none focus:ring-2 focus:ring-sensual-400 text-sm'
                  >
                    <option value='newest'>Nuevos</option>
                    <option value='price_asc'>$-$$$</option>
                    <option value='price_desc'>$$$-$</option>
                    <option value='rating'>Populares</option>
                  </select>

                  {/* View Mode */}
                  <div className='hidden md:flex rounded-full border border-earth-300 bg-white overflow-hidden'>
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
              <div className='mt-4 text-earth-600 text-sm text-center md:text-left'>
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
              <div className='grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6'>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className='bg-white/10 rounded-xl h-64 md:h-96 animate-pulse' />
                ))}
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`grid gap-3 md:gap-6 ${viewMode === 'grid'
                  ? 'grid-cols-2 md:grid-cols-2 xl:grid-cols-3'
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