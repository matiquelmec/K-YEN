'use client';

import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useState, memo, useCallback } from 'react';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import Image from 'next/image';
import { getCategoryName, getColorClass, optimizeCloudinaryUrl } from '@/lib/product-utils';
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
  const isOutOfStock = Number(product.stock ?? 15) <= 0;

  const isNew = product.is_new ? true : undefined;
  const isSale = product.is_sale ? true : undefined;
  const originalPrice = product.original_price ?? undefined;

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        className='bg-white border border-stone-200/80 hover:border-stone-400/90 transition-all duration-500 shadow-sm'
      >
        <div className='flex flex-col md:flex-row'>
          <div className='relative w-full md:w-80 h-72 md:h-auto overflow-hidden bg-stone-100'>
            <Link href={`/catalogo/${product.slug || product.id}`}>
              {product.images && product.images[0] && !imgError ? (
                <Image
                  src={optimizeCloudinaryUrl(product.images[0], 700)}
                  alt={product.name}
                  fill
                  unoptimized
                  onError={() => setImgError(true)}
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  className='object-cover object-top hover:scale-105 transition-transform duration-700'
                />
              ) : (
                <div className='w-full h-full bg-stone-100 flex items-center justify-center'>
                  <ShoppingBag className='w-12 h-12 text-stone-300 stroke-[1]' />
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
              <div className='flex justify-between items-start gap-4 mb-3'>
                <div className='flex-1'>
                  <span className='text-[9px] font-semibold uppercase tracking-[0.25em] text-calypso-700 block mb-2'>
                    {getCategoryName(product.category)}
                  </span>

                  <Link href={`/catalogo/${product.slug || product.id}`}>
                    <h3
                      className='font-serif text-xl sm:text-2xl text-[#181716] hover:text-calypso-700 transition-colors mb-2 font-normal'
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {product.name}
                    </h3>
                  </Link>

                  <p className='text-stone-600 text-xs sm:text-sm mb-6 font-light line-clamp-2'>
                    {product.description}
                  </p>
                </div>

                <ProductPrice price={product.price} originalPrice={originalPrice} />
              </div>

              {/* Sizes and Colors */}
              <div className='mb-6 space-y-3'>
                <div>
                  <span className='text-[10px] font-semibold text-stone-500 uppercase tracking-[0.2em] mb-2 block'>
                    Tallas:
                  </span>
                  <div className='flex flex-wrap gap-1.5'>
                    {sizes.slice(0, 8).map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[44px] min-h-[44px] px-3 py-1 text-[11px] font-medium border transition-all ${
                          selectedSize === size
                            ? 'bg-[#181716] text-white border-[#181716]'
                            : 'border-stone-200 text-stone-700 bg-white hover:border-stone-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className='text-[10px] font-semibold text-stone-500 uppercase tracking-[0.2em] mb-2 block'>
                    Colores Disponibles:
                  </span>
                  <div className='flex gap-2'>
                    {colors.map((color, colorIndex) => (
                      <button
                        key={colorIndex}
                        onClick={() => setSelectedColor(color)}
                        aria-label={`Color ${color}`}
                        className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border ${
                          selectedColor === color ? 'border-stone-900 bg-stone-50' : 'border-transparent'
                        }`}
                        title={color}
                      >
                        <span
                          className={`w-6 h-6 rounded-full border ${
                            selectedColor === color ? 'ring-2 ring-calypso-700 ring-offset-2 border-stone-900' : 'border-stone-300'
                          } ${getColorClass(color)} transition-all`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className='flex gap-3 pt-6 border-t border-stone-100'>
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 min-h-[48px] uppercase tracking-[0.2em] text-[11px] font-semibold flex items-center justify-center gap-2 transition-all ${
                  isOutOfStock
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-200'
                    : 'btn-couture-primary'
                }`}
              >
                <ShoppingBag className='w-3.5 h-3.5 mr-1 stroke-[1.5]' />
                {isOutOfStock ? 'Agotado' : 'Añadir al Bolso'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4 }}
      className='group cursor-pointer h-full'
    >
      <div className='bg-white border border-stone-200/80 hover:border-stone-400/90 transition-all duration-500 h-full flex flex-col shadow-sm'>
        {/* Product Image */}
        <div className='relative aspect-[3/4] overflow-hidden bg-stone-100'>
          <Link href={`/catalogo/${product.slug || product.id}`}>
            {product.images && product.images[0] && !imgError ? (
              <Image
                src={optimizeCloudinaryUrl(product.images[0], 700)}
                alt={product.name}
                fill
                unoptimized
                onError={() => setImgError(true)}
                className='object-cover object-top group-hover:scale-105 transition-transform duration-700'
              />
            ) : (
              <div className='w-full h-full bg-stone-100 flex items-center justify-center'>
                <ShoppingBag className='w-12 h-12 text-stone-300 stroke-[1]' />
              </div>
            )}
          </Link>

          <ProductBadges
            isNew={isNew}
            isSale={isSale}
            hasLargeSizes={hasLargeSizes}
          />

          {/* Minimal Category Tag */}
          <div className='absolute top-3 right-3 sm:top-4 sm:right-4'>
            <span className='px-2 sm:px-2.5 py-0.5 sm:py-1 text-[8px] sm:text-[9px] font-semibold tracking-[0.2em] uppercase bg-white/90 text-stone-800 backdrop-blur-sm border border-stone-200/60'>
              {getCategoryName(product.category)}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className='p-3.5 sm:p-6 flex-1 flex flex-col justify-between bg-white'>
          <div>
            <Link href={`/catalogo/${product.slug || product.id}`}>
              <h3
                className='font-serif text-base sm:text-lg text-[#181716] group-hover:text-calypso-700 transition-colors mb-1.5 line-clamp-1 font-normal'
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                title={product.name}
              >
                {product.name}
              </h3>
            </Link>

            <p className='text-stone-500 text-[11px] sm:text-xs mb-3 sm:mb-4 line-clamp-2 font-light leading-relaxed'>
              {product.description}
            </p>
          </div>

          <div>
            {/* Size Options */}
            <div className='flex flex-wrap gap-1 mb-2.5 sm:mb-3'>
              {sizes.slice(0, 5).map(size => (
                <span
                  key={size}
                  className='px-1.5 py-0.5 text-[9px] sm:text-[10px] font-light border border-stone-200 text-stone-600'
                >
                  {size}
                </span>
              ))}
              {sizes.length > 5 && (
                <span className='px-1.5 py-0.5 text-[9px] sm:text-[10px] text-stone-400 font-light'>
                  +{sizes.length - 5}
                </span>
              )}
            </div>

            {/* Colors */}
            <div className='flex gap-1.5 mb-3 sm:mb-4'>
              {colors.slice(0, 5).map((color, colorIndex) => (
                <div
                  key={colorIndex}
                  className={`w-3 h-3 rounded-full border border-stone-300 ${getColorClass(color)}`}
                  title={color}
                />
              ))}
            </div>

            {/* Price and Add to Cart */}
            <div className='flex items-center justify-between pt-3 sm:pt-4 border-t border-stone-100'>
              <ProductPrice price={product.price} originalPrice={originalPrice} className="text-left [&>div]:items-start" />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (!isOutOfStock) handleAddToCart();
                }}
                disabled={isOutOfStock}
                aria-label={isOutOfStock ? `${product.name} agotado` : `Añadir ${product.name} al bolso`}
                className={`min-w-[44px] min-h-[44px] flex items-center justify-center border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-calypso-700 ${
                  isOutOfStock
                    ? 'bg-stone-100 border-stone-200 text-stone-300 cursor-not-allowed'
                    : 'border-stone-200 text-[#181716] hover:bg-[#181716] hover:text-white hover:border-[#181716] active:scale-95'
                }`}
                title={isOutOfStock ? 'Producto Agotado' : 'Añadir al bolso'}
              >
                <ShoppingBag className='w-4 h-4 stroke-[1.5]' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(ProductCard);
