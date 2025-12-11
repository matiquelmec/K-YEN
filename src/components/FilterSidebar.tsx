'use client';

import { motion } from 'framer-motion';
import { Moon, Sun, Leaf, Heart, Filter } from 'lucide-react';

interface FilterSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedSizes: string[];
  onSizesChange: (sizes: string[]) => void;
  priceRange: number[];
  onPriceRangeChange: (range: number[]) => void;
  showPlusSize: boolean;
  onPlusSizeChange: (show: boolean) => void;
}

const categories = [
  {
    id: 'all',
    name: 'Todos los Estilos',
    icon: Heart,
    color: 'from-sensual-500 to-earth-500',
  },
  {
    id: 'gotico',
    name: 'Luna Nueva',
    icon: Moon,
    color: 'from-gothic-600 to-sensual-600',
  },
  {
    id: 'primaveral',
    name: 'Eclipse Floral',
    icon: Leaf,
    color: 'from-spring-500 to-earth-500',
  },
  {
    id: 'veraniego',
    name: 'Solsticio',
    icon: Sun,
    color: 'from-earth-500 to-sensual-500',
  },
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'];

export default function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  selectedSizes,
  onSizesChange,
  priceRange,
  onPriceRangeChange,
  showPlusSize,
  onPlusSizeChange,
}: FilterSidebarProps) {
  const handleSizeToggle = (size: string) => {
    if (selectedSizes.includes(size)) {
      onSizesChange(selectedSizes.filter(s => s !== size));
    } else {
      onSizesChange([...selectedSizes, size]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className='bg-gradient-to-br from-earth-50 to-sensual-50 backdrop-blur-sm border border-earth-200 rounded-xl p-6 sticky top-4'
    >
      {/* Header */}
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-8 h-8 rounded-full bg-gradient-to-br from-earth-500 to-sensual-500 flex items-center justify-center'>
          <Filter className='w-4 h-4 text-white' />
        </div>
        <h3 className='font-display text-xl font-bold text-gradient-earth'>
          Filtros
        </h3>
      </div>

      {/* Categories */}
      <div className='mb-8'>
        <h4 className='font-semibold text-gray-800 mb-4'>Categorías</h4>
        <div className='space-y-2'>
          {categories.map(category => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCategoryChange(category.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${selectedCategory === category.id
                  ? 'bg-gradient-to-r ' +
                  category.color +
                  ' text-white shadow-lg'
                  : 'bg-white/50 text-gray-700 hover:bg-white/80'
                }`}
            >
              <category.icon className='w-5 h-5' />
              <span className='font-medium'>{category.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Plus Size Filter */}
      <div className='mb-8'>
        <h4 className='font-semibold text-gray-800 mb-4'>Tallas Especiales</h4>
        <motion.label
          whileHover={{ scale: 1.02 }}
          className='flex items-center gap-3 p-3 bg-white/50 rounded-lg cursor-pointer hover:bg-white/80 transition-colors'
        >
          <input
            type='checkbox'
            checked={showPlusSize}
            onChange={e => onPlusSizeChange(e.target.checked)}
            className='w-5 h-5 text-sensual-500 rounded focus:ring-sensual-400'
          />
          <div className='flex items-center gap-2'>
            <Heart className='w-5 h-5 text-sensual-500' />
            <span className='font-medium text-gray-700'>
              Solo Tallas Grandes
            </span>
          </div>
        </motion.label>
      </div>

      {/* Sizes */}
      <div className='mb-8'>
        <h4 className='font-semibold text-gray-800 mb-4'>Tallas</h4>
        <div className='grid grid-cols-3 gap-2'>
          {sizes.map(size => (
            <motion.button
              key={size}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSizeToggle(size)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${selectedSizes.includes(size)
                  ? 'bg-gradient-to-r from-sensual-500 to-earth-500 text-white shadow-md'
                  : 'bg-white/50 text-gray-700 hover:bg-white/80 border border-earth-200'
                }`}
            >
              {size}
            </motion.button>
          ))}
        </div>
        {selectedSizes.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => onSizesChange([])}
            className='w-full mt-3 px-3 py-2 text-xs text-gray-600 bg-white/50 rounded-lg hover:bg-white/80 transition-colors'
          >
            Limpiar tallas
          </motion.button>
        )}
      </div>

      {/* Price Range */}
      <div className='mb-8'>
        <h4 className='font-semibold text-gray-800 mb-4'>Rango de Precio</h4>
        <div className='space-y-4'>
          <div className='flex items-center justify-between text-sm text-gray-600'>
            <span>${(priceRange[0] ?? 0).toLocaleString('es-CL')}</span>
            <span>${(priceRange[1] ?? 150000).toLocaleString('es-CL')}</span>
          </div>

          <div className='relative'>
            <input
              type='range'
              min='0'
              max='150000'
              step='5000'
              value={priceRange[1] ?? 150000}
              onChange={e =>
                onPriceRangeChange([
                  priceRange[0] ?? 0,
                  parseInt(e.target.value) || 150000,
                ])
              }
              className='w-full h-2 bg-earth-200 rounded-lg appearance-none cursor-pointer slider'
              style={{
                background: `linear-gradient(to right, #c68047 0%, #c68047 ${((priceRange[1] ?? 150000) / 150000) * 100}%, #f1d9c0 ${((priceRange[1] ?? 150000) / 150000) * 100}%, #f1d9c0 100%)`,
              }}
            />
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='block text-xs text-gray-600 mb-1'>Mínimo</label>
              <input
                type='number'
                min='0'
                max={priceRange[1] ?? 150000}
                value={priceRange[0] ?? 0}
                onChange={e =>
                  onPriceRangeChange([
                    parseInt(e.target.value) || 0,
                    priceRange[1] ?? 150000,
                  ])
                }
                className='w-full px-3 py-2 text-sm border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sensual-400'
              />
            </div>
            <div>
              <label className='block text-xs text-gray-600 mb-1'>Máximo</label>
              <input
                type='number'
                min={priceRange[0] ?? 0}
                max='150000'
                value={priceRange[1] ?? 150000}
                onChange={e =>
                  onPriceRangeChange([
                    priceRange[0] ?? 0,
                    parseInt(e.target.value) || 150000,
                  ])
                }
                className='w-full px-3 py-2 text-sm border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sensual-400'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Price Filters */}
      <div className='mb-6'>
        <h4 className='font-semibold text-gray-800 mb-4'>Rangos Rápidos</h4>
        <div className='space-y-2'>
          {[
            { label: 'Hasta $50.000', range: [0, 50000] },
            { label: '$50.000 - $80.000', range: [50000, 80000] },
            { label: '$80.000 - $100.000', range: [80000, 100000] },
            { label: 'Más de $100.000', range: [100000, 150000] },
          ].map(option => (
            <motion.button
              key={option.label}
              whileHover={{ scale: 1.02 }}
              onClick={() => onPriceRangeChange(option.range)}
              className={`w-full p-2 text-sm text-left rounded-lg transition-colors ${priceRange[0] === option.range[0] &&
                  priceRange[1] === option.range[1]
                  ? 'bg-gradient-to-r from-sensual-500 to-earth-500 text-white'
                  : 'bg-white/50 text-gray-700 hover:bg-white/80'
                }`}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Clear All Filters */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          onCategoryChange('all');
          onSizesChange([]);
          onPriceRangeChange([0, 150000]);
          onPlusSizeChange(false);
        }}
        className='w-full px-4 py-3 bg-gradient-to-r from-earth-600 to-sensual-600 text-white font-semibold rounded-lg hover:from-earth-700 hover:to-sensual-700 transition-all duration-300 shadow-lg'
      >
        Limpiar Todos los Filtros
      </motion.button>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #c68047, #ee6b6a);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #c68047, #ee6b6a);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </motion.div>
  );
}
