'use client';

import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useState, memo, useCallback } from 'react';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import Image from 'next/image';
import { getCategoryColor, getCategoryName, getColorClass } from '@/lib/product-utils';
import ProductBadges from './product-card/ProductBadges';
import ProductPrice from './product-card/ProductPrice';


import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L'];
  const colors = product.colors && product.colors.length > 0 ? product.colors : ['Negro', 'Blanco'];

  const [selectedSize, setSelectedSize] = useState(sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(colors[0] || 'Negro');
  const [imgError, setImgError] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = useCallback(() => {
    if (product.id && selectedSize && selectedColor) {
      addItem({
        product,
        quantity: 1,
        selectedSize,
        selectedColor
      });
    }
  }, [product, selectedSize, selectedColor, addItem]);

  const hasLargeSizes = sizes.some(size => ['4XL', '5XL', '6XL'].includes(size));

  // Helper to ensure boolean | undefined is treated as boolean | undefined explicitly for the component props
  const isNew = product.is_new ? true : undefined;
  const isSale = product.is_sale ? true : undefined;
  const originalPrice = product.original_price ?? undefined;

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className='card-aira overflow-hidden hover:shadow-xl transition-all duration-500'
      >
        <div className='flex flex-col md:flex-row'>
          <div className='relative w-full md:w-80 h-64 md:h-auto overflow-hidden rounded-t-3xl md:rounded-t-none md:rounded-l-3xl bg-stone-100'>
            <Link href={`/catalogo/${product.slug || product.id}`}>
              {product.images && product.images[0] && !imgError ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  unoptimized
                  onError={() => setImgError(true)}
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  className='object-cover object-top hover:scale-105 transition-transform duration-700'
                />
              ) : (
                <div className='w-full h-full bg-gradient-to-br from-calypso-100 to-blush-100 flex items-center justify-center'>
                  <ShoppingBag className='w-16 h-16 text-calypso-400/50' />
                </div>
              )}
            </Link>

            <ProductBadges
              isNew={isNew}
              isSale={isSale}
              hasLargeSizes={hasLargeSizes}
            />
          </div>

          {/* Content */}
          <div className='flex-1 p-6 sm:p-8 flex flex-col justify-between'>
            <div>
              <div className='flex justify-between items-start mb-3'>
                <div className='flex-1'>
                  <div className='flex items-center gap-3 mb-2'>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(product.category)} shadow-sm`}
                    >
                      {getCategoryName(product.category)}
                    </span>
                  </div>

                  <Link href={`/catalogo/${product.slug || product.id}`}>
                    <h3 className='font-display text-2xl font-bold text-stone-900 hover:text-calypso-700 transition-colors mb-2'>
                      {product.name}
                    </h3>
                  </Link>

                  <p className='text-stone-600 text-sm mb-4 line-clamp-2'>
                    {product.description}
                  </p>
                </div>

                <ProductPrice price={product.price} originalPrice={originalPrice} />
              </div>

              {/* Sizes and Colors */}
              <div className='mb-6 space-y-3'>
                <div>
                  <span className='text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5 block'>
                    Tallas Disponibles:
                  </span>
                  <div className='flex flex-wrap gap-1.5'>
                    {sizes.slice(0, 8).map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-2.5 py-1 text-xs font-medium border rounded-lg transition-all ${
                          selectedSize === size
                            ? 'bg-calypso-500 text-white border-calypso-500 shadow-sm'
                            : 'border-stone-200 text-stone-700 bg-stone-50 hover:border-calypso-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className='text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5 block'>
                    Colores:
                  </span>
                  <div className='flex gap-2'>
                    {colors.map((color, colorIndex) => (
                      <button
                        key={colorIndex}
                        onClick={() => setSelectedColor(color)}
                        className={`w-6 h-6 rounded-full border-2 ${
                          selectedColor === color ? 'ring-2 ring-calypso-500 ring-offset-2' : 'border-white'
                        } shadow-sm ${getColorClass(color)} transition-all`}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className='flex gap-3 pt-4 border-t border-stone-100'>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className='btn-calypso flex-1'
              >
                <ShoppingBag className='w-4 h-4 mr-2' />
                Agregar a la Bolsa
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className='group cursor-pointer h-full'
    >
      <div className='card-aira overflow-hidden h-full flex flex-col'>
        {/* Product Image */}
        <div className='relative aspect-[3/4] overflow-hidden rounded-t-3xl bg-stone-100'>
          <Link href={`/catalogo/${product.slug || product.id}`}>
            {product.images && product.images[0] && !imgError ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                unoptimized
                onError={() => setImgError(true)}
                className='object-cover object-top group-hover:scale-105 transition-transform duration-700'
              />
            ) : (
              <div className='w-full h-full bg-gradient-to-br from-calypso-100 to-blush-100 flex items-center justify-center'>
                <ShoppingBag className='w-20 h-20 text-calypso-400/50' />
              </div>
            )}
          </Link>

          <ProductBadges
            isNew={isNew}
            isSale={isSale}
            hasLargeSizes={hasLargeSizes}
          />

          {/* Category Badge */}
          <div className='absolute top-4 right-4'>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(product.category)} shadow-sm`}
            >
              {getCategoryName(product.category)}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className='p-6 flex-1 flex flex-col'>
          <Link href={`/catalogo/${product.slug || product.id}`}>
            <h3 className='font-display text-xl font-bold text-stone-900 group-hover:text-calypso-700 transition-colors mb-2 line-clamp-1' title={product.name}>
              {product.name}
            </h3>
          </Link>

          <p className='text-stone-600 text-sm mb-3 line-clamp-2'>
            {product.description}
          </p>

          {/* Size Options */}
          <div className='flex flex-wrap gap-1.5 mb-3 mt-auto'>
            {sizes.slice(0, 5).map(size => (
              <span
                key={size}
                className='px-2 py-0.5 text-[11px] font-medium border border-stone-200 rounded-md text-stone-700 bg-stone-50'
              >
                {size}
              </span>
            ))}
            {sizes.length > 5 && (
              <span className='px-2 py-0.5 text-[11px] text-stone-500 font-medium'>
                +{sizes.length - 5}
              </span>
            )}
          </div>

          {/* Colors */}
          <div className='flex gap-1.5 mb-4'>
            {colors.slice(0, 5).map((color, colorIndex) => (
              <div
                key={colorIndex}
                className={`w-3.5 h-3.5 rounded-full border border-stone-300 shadow-sm ${getColorClass(color)}`}
                title={color}
              />
            ))}
            {colors.length > 5 && (
              <span className='text-[11px] text-stone-400 flex items-center font-medium'>
                +{colors.length - 5}
              </span>
            )}
          </div>

          {/* Price and Add to Cart */}
          <div className='flex items-center justify-between mt-auto pt-4 border-t border-stone-100'>
            <ProductPrice price={product.price} originalPrice={originalPrice} className="text-left" />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              className='p-2.5 rounded-full bg-calypso-50 text-calypso-600 hover:bg-calypso-500 hover:text-white transition-colors shadow-sm'
              title='Agregar a la bolsa'
            >
              <ShoppingBag className='w-4 h-4' />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(ProductCard);