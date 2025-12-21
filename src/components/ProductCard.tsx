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


  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
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

  const hasLargeSizes = product.sizes.some(size => ['4XL', '5XL', '6XL'].includes(size));

  // Helper to ensure boolean | undefined is treated as boolean | undefined explicitly for the component props
  const isNew = product.is_new ? true : undefined;
  const isSale = product.is_sale ? true : undefined;
  const originalPrice = product.original_price ?? undefined;

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className='bg-gradient-to-r from-earth-50 to-sensual-50 backdrop-blur-sm border border-earth-200 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500'
      >
        <div className='flex flex-col md:flex-row'>
          {/* Image */}
          <div className='relative w-full md:w-80 h-64 md:h-auto overflow-hidden'>
            {product.images && product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className='object-cover'
              />
            ) : (
              <div className='w-full h-full bg-gradient-to-br from-earth-200 to-sensual-200 flex items-center justify-center'>
                <ShoppingBag className='w-16 h-16 text-white/50' />
              </div>
            )}

            <ProductBadges
              isNew={isNew}
              isSale={isSale}
              hasLargeSizes={hasLargeSizes}
            />

            {/* Heart Button */}

          </div>

          {/* Content */}
          <div className='flex-1 p-6'>
            <div className='flex justify-between items-start mb-4'>
              <div className='flex-1'>
                <div className='flex items-center gap-3 mb-2'>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(product.category)}`}
                  >
                    {getCategoryName(product.category)}
                  </span>
                </div>

                <h3 className='font-display text-2xl font-bold text-gradient-earth mb-2'>
                  {product.name}
                </h3>

                <p className='text-gray-600 mb-4 line-clamp-2'>
                  {product.description}
                </p>


              </div>

              <ProductPrice price={product.price} originalPrice={originalPrice} />
            </div>

            {/* Sizes and Colors */}
            <div className='mb-6'>
              <div className='mb-3'>
                <span className='text-sm font-semibold text-gray-700 mb-2 block'>
                  Tallas:
                </span>
                <div className='flex flex-wrap gap-1'>
                  {product.sizes.slice(0, 8).map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-2 py-1 text-xs border rounded transition-colors ${selectedSize === size
                        ? 'bg-sensual-500 text-white border-sensual-500'
                        : 'border-earth-300 text-earth-600 bg-earth-50 hover:border-sensual-400'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                  {product.sizes.length > 8 && (
                    <span className='px-2 py-1 text-xs text-earth-500'>
                      +{product.sizes.length - 8}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className='text-sm font-semibold text-gray-700 mb-2 block'>
                  Colores:
                </span>
                <div className='flex gap-2'>
                  {product.colors.map((color, colorIndex) => (
                    <button
                      key={colorIndex}
                      onClick={() => setSelectedColor(color)}
                      className={`w-6 h-6 rounded-full border-2 ${selectedColor === color ? 'ring-2 ring-sensual-500 ring-offset-2' : 'border-white'
                        } shadow-sm ${getColorClass(color)}`}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className='flex gap-3'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className='flex-1 btn-sensual'
              >
                <ShoppingBag className='w-4 h-4 mr-2' />
                Agregar al Carrito
              </motion.button>


            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className='group cursor-pointer h-full'
    >
      <div className='bg-gradient-to-br from-earth-50 to-sensual-50 backdrop-blur-sm border border-earth-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col'>
        {/* Product Image */}
        <div className='relative aspect-[3/4] overflow-hidden'>
          <Link href={`/catalogo/${product.id}`}>
            {product.images && product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className='object-cover object-top group-hover:scale-110 transition-transform duration-500'
              />
            ) : (
              <div className='w-full h-full bg-gradient-to-br from-earth-200 to-sensual-200 flex items-center justify-center'>
                <ShoppingBag className='w-20 h-20 text-white/50' />
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
              className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(product.category)}`}
            >
              {getCategoryName(product.category)}
            </span>
          </div>

          {/* Heart Icon */}

        </div>

        {/* Product Info */}
        <div className='p-6 flex-1 flex flex-col'>
          <Link href={`/catalogo/${product.id}`}>
            <h3 className='font-display text-xl font-bold text-gradient-earth mb-2 line-clamp-1' title={product.name}>
              {product.name}
            </h3>
          </Link>

          <p className='text-gray-600 text-sm mb-3 line-clamp-2'>
            {product.description}
          </p>



          {/* Size Options */}
          <div className='flex flex-wrap gap-1 mb-4 mt-auto'>
            {product.sizes.slice(0, 5).map(size => (
              <span
                key={size}
                className='px-2 py-1 text-xs border border-earth-300 rounded text-earth-600 bg-earth-50'
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 5 && (
              <span className='px-2 py-1 text-xs text-earth-500'>
                +{product.sizes.length - 5}
              </span>
            )}
          </div>

          {/* Colors */}
          <div className='flex gap-2 mb-4'>
            {product.colors.slice(0, 5).map((color, colorIndex) => (
              <div
                key={colorIndex}
                className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${getColorClass(color)}`}
                title={color}
              />
            ))}
            {product.colors.length > 5 && (
              <span className='text-xs text-gray-400 flex items-center'>
                +{product.colors.length - 5}
              </span>
            )}
          </div>

          {/* Price and Add to Cart */}
          <div className='flex items-center justify-between mt-auto pt-4 border-t border-gray-100'>
            <ProductPrice price={product.price} originalPrice={originalPrice} className="text-left" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(ProductCard);