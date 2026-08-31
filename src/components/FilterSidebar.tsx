'use client';

import { motion } from 'framer-motion';
import { Sparkles, Sun, Moon, Leaf, Heart, Filter, RotateCcw } from 'lucide-react';

interface FilterSidebarProps {
  selectedCategory: string;
  onCategoryChange: (_category: string) => void;
  selectedSizes: string[];
  onSizesChange: (_sizes: string[]) => void;
  priceRange: number[];
  onPriceRangeChange: (_range: number[]) => void;
  showPlusSize: boolean;
  onPlusSizeChange: (_show: boolean) => void;
}

const categories = [
  {
    id: 'all',
    name: 'Todos los Estilos',
    icon: Sparkles,
  },
  {
    id: 'veraniego',
    name: 'Brisa & Calipso',
    icon: Sun,
  },
  {
    id: 'gotico',
    name: 'Solsticio Dorado',
    icon: Moon,
  },
  {
    id: 'primaveral',
    name: 'Rosa de Alba',
    icon: Leaf,
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
    <div className='bg-white border border-stone-200 p-6 sm:p-8 sticky top-28 shadow-sm space-y-8 text-[#181716]'>
      {/* Header */}
      <div className='flex items-center justify-between pb-4 border-b border-stone-100'>
        <div className='flex items-center gap-2.5'>
          <Filter className='w-4 h-4 text-calypso-700 stroke-[1.5]' />
          <h3
            className='font-serif text-lg text-[#181716] font-normal'
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Filtros de Curaduría
          </h3>
        </div>
        {(selectedCategory !== 'all' || selectedSizes.length > 0 || showPlusSize || (priceRange[0] ?? 0) > 0 || (priceRange[1] ?? 150000) < 150000) && (
          <button
            onClick={() => {
              onCategoryChange('all');
              onSizesChange([]);
              onPriceRangeChange([0, 150000]);
              onPlusSizeChange(false);
            }}
            className='text-[10px] text-stone-500 hover:text-stone-900 tracking-wider uppercase font-semibold flex items-center gap-1 transition-colors'
            title="Restablecer filtros"
          >
            <RotateCcw className='w-3 h-3' />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h4 className='text-[11px] uppercase tracking-wider font-semibold text-stone-800 mb-3'>
          Colecciones
        </h4>
        <div className='space-y-1.5'>
          {categories.map(category => {
            const isSelected = selectedCategory === category.id;
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs transition-all text-left border ${
                  isSelected
                    ? 'bg-[#181716] text-[#FAF8F5] border-[#181716] font-medium shadow-sm'
                    : 'bg-[#FAF8F5] text-stone-700 hover:bg-stone-100 border-stone-200/80 font-light'
                }`}
              >
                <Icon className={`w-4 h-4 stroke-[1.5] ${isSelected ? 'text-gold-300' : 'text-stone-500'}`} />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Plus Size Filter */}
      <div>
        <label className='flex items-center gap-3 p-3 bg-[#FAF8F5] border border-stone-200/80 cursor-pointer hover:bg-stone-100 transition-colors select-none'>
          <input
            type='checkbox'
            checked={showPlusSize}
            onChange={e => onPlusSizeChange(e.target.checked)}
            className='w-4 h-4 text-calypso-700 rounded border-stone-300 focus:ring-calypso-500 accent-calypso-700'
          />
          <div className='flex items-center gap-2'>
            <Heart className={`w-4 h-4 stroke-[1.5] ${showPlusSize ? 'text-rose-600 fill-rose-600' : 'text-stone-500'}`} />
            <span className='text-xs font-medium text-stone-800'>
              Tallas Grandes (XL a 6XL)
            </span>
          </div>
        </label>
      </div>

      {/* Sizes */}
      <div>
        <div className='flex items-center justify-between mb-3'>
          <h4 className='text-[11px] uppercase tracking-wider font-semibold text-stone-800'>
            Tallas de Atelier
          </h4>
          {selectedSizes.length > 0 && (
            <button
              onClick={() => onSizesChange([])}
              className='text-[10px] text-stone-500 hover:text-stone-900 tracking-wide font-light underline'
            >
              Borrar tallas
            </button>
          )}
        </div>
        <div className='grid grid-cols-5 gap-1.5'>
          {sizes.map(size => {
            const isSelected = selectedSizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`py-2 text-xs text-center border transition-all ${
                  isSelected
                    ? 'bg-[#181716] text-white border-[#181716] font-semibold shadow-sm'
                    : 'bg-[#FAF8F5] text-stone-700 hover:bg-stone-100 border-stone-200 font-light'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className='text-[11px] uppercase tracking-wider font-semibold text-stone-800 mb-3'>
          Rango de Precio
        </h4>
        <div className='space-y-3'>
          <div className='flex items-center justify-between text-xs text-stone-700 font-medium'>
            <span>${(priceRange[0] ?? 0).toLocaleString('es-CL')}</span>
            <span className='text-stone-400'>–</span>
            <span>${(priceRange[1] ?? 150000).toLocaleString('es-CL')}</span>
          </div>

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
            className='w-full h-1.5 bg-stone-200 accent-calypso-700 cursor-pointer'
          />

          <div className='grid grid-cols-2 gap-2 pt-1'>
            <div>
              <label htmlFor='min-price' className='block text-[10px] uppercase tracking-wider text-stone-500 mb-1'>Mínimo</label>
              <input
                id='min-price'
                name='minPrice'
                autoComplete='off'
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
                className='w-full px-2.5 py-1.5 text-xs border border-stone-300 bg-[#FAF8F5] text-stone-900 focus:bg-white focus:border-stone-900 focus:outline-none'
              />
            </div>
            <div>
              <label htmlFor='max-price' className='block text-[10px] uppercase tracking-wider text-stone-500 mb-1'>Máximo</label>
              <input
                id='max-price'
                name='maxPrice'
                autoComplete='off'
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
                className='w-full px-2.5 py-1.5 text-xs border border-stone-300 bg-[#FAF8F5] text-stone-900 focus:bg-white focus:border-stone-900 focus:outline-none'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Clear All Filters Button */}
      <button
        onClick={() => {
          onCategoryChange('all');
          onSizesChange([]);
          onPriceRangeChange([0, 150000]);
          onPlusSizeChange(false);
        }}
        className='w-full btn-couture-primary py-3.5 justify-center text-xs'
      >
        <span>Limpiar Todos los Filtros</span>
      </button>
    </div>
  );
}
