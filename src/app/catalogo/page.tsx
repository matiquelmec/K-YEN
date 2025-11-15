'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Heart,
  Star,
  ShoppingBag,
  Grid,
  List,
  SlidersHorizontal,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';

// Mock product data
const allProducts = [
  {
    id: 1,
    name: 'Vestido Luna Nocturna',
    category: 'gotico',
    price: 89990,
    originalPrice: 109990,
    image: '/api/placeholder/400/600',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    colors: ['Negro', 'Borgoña', 'Azul Medianoche'],
    description:
      'Elegancia misteriosa con detalles de encaje y corte que abraza cada curva',
    rating: 4.8,
    reviews: 127,
    isNew: false,
    isSale: true,
    tags: ['elegante', 'nocturno', 'encaje'],
  },
  {
    id: 2,
    name: 'Vestido Flor de Cerezo',
    category: 'primaveral',
    price: 74990,
    image: '/api/placeholder/400/600',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    colors: ['Rosa Suave', 'Verde Menta', 'Lavanda'],
    description:
      'Frescura natural con estampado floral y silueta que fluye con tu movimiento',
    rating: 4.9,
    reviews: 89,
    isNew: true,
    isSale: false,
    tags: ['floral', 'fresco', 'natural'],
  },
  {
    id: 3,
    name: 'Vestido Sol Radiante',
    category: 'veraniego',
    price: 69990,
    image: '/api/placeholder/400/600',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    colors: ['Dorado', 'Coral', 'Turquesa'],
    description:
      'Libertad solar con tela ligera y corte que celebra tu feminidad',
    rating: 4.7,
    reviews: 156,
    isNew: false,
    isSale: false,
    tags: ['verano', 'ligero', 'luminoso'],
  },
  {
    id: 4,
    name: 'Vestido Tierra Ancestral',
    category: 'gotico',
    price: 94990,
    image: '/api/placeholder/400/600',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'],
    colors: ['Tierra', 'Cobre', 'Óxido'],
    description:
      'Conexión profunda con detalles bordados y silueta que honra tus raíces',
    rating: 4.9,
    reviews: 203,
    isNew: false,
    isSale: false,
    tags: ['artesanal', 'bordado', 'ancestral'],
  },
  {
    id: 5,
    name: 'Vestido Brisa Marina',
    category: 'veraniego',
    price: 79990,
    image: '/api/placeholder/400/600',
    sizes: ['M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'],
    colors: ['Azul Océano', 'Verde Agua', 'Blanco Espuma'],
    description:
      'Inspirado en las olas del mar, perfecto para tallas grandes con máxima comodidad',
    rating: 4.8,
    reviews: 142,
    isNew: true,
    isSale: false,
    tags: ['marino', 'amplio', 'cómodo'],
    plusSize: true,
  },
  {
    id: 6,
    name: 'Vestido Jardín Secreto',
    category: 'primaveral',
    price: 84990,
    image: '/api/placeholder/400/600',
    sizes: ['L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'],
    colors: ['Verde Bosque', 'Rosa Salvaje', 'Violeta'],
    description:
      'Diseño exclusivo para tallas grandes que realza la belleza natural',
    rating: 4.9,
    reviews: 98,
    isNew: false,
    isSale: true,
    originalPrice: 99990,
    tags: ['natural', 'exclusivo', 'realzador'],
    plusSize: true,
  },
];

export default function CatalogoPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 150000]);
  const [showPlusSize, setShowPlusSize] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    const filtered = allProducts.filter(product => {
      // Búsqueda por texto
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Filtro por categoría
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;

      // Filtro por tallas
      const matchesSizes =
        selectedSizes.length === 0 ||
        selectedSizes.some(size => product.sizes.includes(size));

      // Filtro por precio
      const matchesPrice =
        product.price >= (priceRange[0] ?? 0) &&
        product.price <= (priceRange[1] ?? 150000);

      // Filtro por tallas grandes
      const matchesPlusSize = !showPlusSize || product.plusSize;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSizes &&
        matchesPrice &&
        matchesPlusSize
      );
    });

    // Ordenamiento
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // Featured - mantener orden original
        break;
    }

    return filtered;
  }, [
    searchTerm,
    selectedCategory,
    selectedSizes,
    priceRange,
    showPlusSize,
    sortBy,
  ]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-earth-900 via-earth-800 to-gothic-900 pt-20'>
      <div className='max-w-7xl mx-auto px-4 py-8'>
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
            Descubre vestidos únicos que celebran la feminidad en todas sus
            formas
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
                    onChange={e => setSortBy(e.target.value)}
                    className='px-4 py-2 rounded-full border border-earth-300 bg-white text-earth-700 focus:outline-none focus:ring-2 focus:ring-sensual-400'
                  >
                    <option value='featured'>Destacados</option>
                    <option value='newest'>Más Nuevos</option>
                    <option value='price-low'>Menor Precio</option>
                    <option value='price-high'>Mayor Precio</option>
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
                {filteredProducts.length} vestido
                {filteredProducts.length !== 1 ? 's' : ''} encontrado
                {filteredProducts.length !== 1 ? 's' : ''}
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

            {/* Products Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`grid gap-6 ${
                viewMode === 'grid'
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

            {/* No results */}
            {filteredProducts.length === 0 && (
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
