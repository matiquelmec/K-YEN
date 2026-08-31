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
              { id: 'veraniego', label: 'Brisa & Calipso', icon: Sun },
              { id: 'gotico', label: 'Solsticio Dorado', icon: Moon },
              { id: 'primaveral', label: 'Rosa de Alba', icon: Leaf },
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
              className='bg-white border border-stone-200 shadow-sm p-4 md:p-6 mb-8'
            >
              <div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
                {/* Search */}
                <div className='relative flex-1 max-w-md w-full'>
                  <Search className='absolute left-3.5 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4' />
                  <input
                    name='search'
                    type='text'
                    autoComplete='off'
                    placeholder='Buscar vestidos por nombre, color...'
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className='w-full pl-10 pr-4 py-2.5 text-sm border border-stone-200 focus:outline-none focus:ring-1 focus:ring-calypso-700 focus:border-calypso-700 bg-stone-50/50 text-[#181716] placeholder:text-stone-400'
                  />
                </div>

                <div className='flex items-center gap-3 w-full md:w-auto justify-between md:justify-end'>
                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className='lg:hidden flex items-center gap-2 px-4 py-2.5 bg-[#181716] text-white hover:bg-stone-800 transition-colors text-xs uppercase tracking-wider font-semibold'
                  >
                    <SlidersHorizontal className='w-3.5 h-3.5' />
                    <span>Filtros</span>
                  </button>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className='flex-1 md:flex-none px-4 py-2.5 border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-stone-900 text-xs uppercase tracking-wider font-medium'
                  >
                    <option value='newest'>Novedades</option>
                    <option value='price_asc'>Precio: Menor a Mayor</option>
                    <option value='price_desc'>Precio: Mayor a Menor</option>
                  </select>

                  {/* View Mode */}
                  <div className='hidden md:flex border border-stone-300 bg-white overflow-hidden'>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-[#181716] text-white' : 'text-stone-500 hover:text-stone-900'}`}
                      title="Vista en Cuadrícula"
                    >
                      <Grid className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-[#181716] text-white' : 'text-stone-500 hover:text-stone-900'}`}
                      title="Vista en Lista"
                    >
                      <List className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              </div>

              {/* Results count */}
              <div className='mt-4 text-stone-600 text-xs tracking-wider uppercase font-light text-center md:text-left'>
                {loading ? 'Cargando selección...' : (
                  <>
                    {filteredProducts.length} diseño{filteredProducts.length !== 1 ? 's' : ''} disponible{filteredProducts.length !== 1 ? 's' : ''}
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
              <div className='text-center py-12 bg-white border border-rose-200 text-rose-700 p-6 text-sm font-light'>
                Hubo un inconveniente al cargar los vestidos. Por favor, intenta recargar la página.
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className='grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6'>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className='bg-white border border-stone-200/60 h-72 md:h-96 animate-pulse' />
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
                className='text-center py-16 bg-white border border-stone-200 p-8 shadow-sm'
              >
                <div className='w-20 h-20 rounded-full bg-[#FAF8F5] border border-stone-200 flex items-center justify-center mx-auto mb-6 text-stone-400'>
                  <Search className='w-8 h-8 stroke-[1.5]' />
                </div>
                <h3
                  className='font-serif text-2xl text-[#181716] font-normal mb-3'
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  No encontramos vestidos con ese criterio
                </h3>
                <p className='text-stone-500 text-sm font-light mb-8 max-w-sm mx-auto leading-relaxed'>
                  Intenta ajustar tus filtros o buscar con otros términos para explorar nuestra colección.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedSizes([]);
                    setShowPlusSize(false);
                  }}
                  className='btn-couture-primary'
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
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-stone-600 font-serif text-lg">Cargando catálogo Casa Aira...</div>}>
      <CatalogoContent />
    </Suspense>
  );
}