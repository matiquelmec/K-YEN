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
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'newest'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const category = searchParams.get('category');
    setSelectedCategory(category || 'all');
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
    <div className='min-h-screen bg-[#FAF8F5]'>
      <Header />
      <div className='max-w-7xl mx-auto px-4 py-8 pt-32'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center mb-12 sm:mb-16'
        >
          <span className='text-[10px] font-semibold uppercase tracking-[0.35em] text-stone-500 block mb-3'>
            COLECCIÓN CURADA 2026
          </span>
          <h1
            className='font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-[#181716] tracking-tight mb-4'
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Catálogo de Selección
          </h1>
          <p className='text-stone-600 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed'>
            Prendas meticulosamente filtradas por su calidad textil y caída favorecedora para todas las curvas (XS a 6XL).
          </p>
        </motion.div>

        {/* Mobile Category Pills (Horizontal Scroll) */}
        <div className="lg:hidden mb-8 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-2.5 px-1 min-w-max">
            {[
              { id: 'all', label: 'Todo el Catálogo', icon: Grid },
              { id: 'veraniego', label: 'Cap. I: Brisa & Calipso', icon: Sun },
              { id: 'gotico', label: 'Cap. II: Solsticio Dorado', icon: Moon },
              { id: 'primaveral', label: 'Cap. III: Rosa de Alba', icon: Leaf },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 border transition-all whitespace-nowrap text-[11px] uppercase tracking-wider font-medium ${selectedCategory === cat.id
                  ? 'bg-[#181716] text-white border-[#181716]'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                  }`}
              >
                <cat.icon className="w-3 h-3 stroke-[1.5]" />
                <span>{cat.label}</span>
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
                    name='search'
                    type='text'
                    autoComplete='off'
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