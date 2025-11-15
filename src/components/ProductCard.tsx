'use client';

import { motion } from 'framer-motion';
import { Heart, Star, ShoppingBag, Eye, Plus } from 'lucide-react';
import { useState, memo, useCallback } from 'react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  sizes: string[];
  colors: string[];
  description: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isSale?: boolean;
  tags: string[];
  plusSize?: boolean;
}

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  const toggleFavorite = useCallback(() => setIsFavorite(prev => !prev), []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'gotico':
        return 'from-gothic-600 to-sensual-600';
      case 'primaveral':
        return 'from-spring-500 to-earth-500';
      case 'veraniego':
        return 'from-earth-500 to-sensual-500';
      default:
        return 'from-earth-600 to-sensual-600';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'gotico':
        return 'Gótico Sensual';
      case 'primaveral':
        return 'Primaveral';
      case 'veraniego':
        return 'Veraniego';
      default:
        return category;
    }
  };

  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      Negro: 'bg-black',
      Borgoña: 'bg-red-900',
      'Azul Medianoche': 'bg-blue-900',
      'Rosa Suave': 'bg-pink-300',
      'Verde Menta': 'bg-green-300',
      Lavanda: 'bg-purple-300',
      Dorado: 'bg-yellow-500',
      Coral: 'bg-orange-400',
      Turquesa: 'bg-teal-400',
      Tierra: 'bg-amber-700',
      Cobre: 'bg-orange-800',
      Óxido: 'bg-red-800',
      'Azul Océano': 'bg-blue-600',
      'Verde Agua': 'bg-cyan-400',
      'Blanco Espuma': 'bg-white border-gray-300',
      'Verde Bosque': 'bg-green-800',
      'Rosa Salvaje': 'bg-pink-600',
      Violeta: 'bg-purple-600',
    };
    return colorMap[color] || 'bg-gray-400';
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className='bg-gradient-to-r from-earth-50 to-sensual-50 backdrop-blur-sm border border-earth-200 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500'
      >
        <div className='flex flex-col md:flex-row'>
          {/* Image */}
          <div className='relative w-full md:w-80 h-64 md:h-auto overflow-hidden'>
            <div className='w-full h-full bg-gradient-to-br from-earth-200 to-sensual-200 flex items-center justify-center'>
              <div className='text-center text-earth-600'>
                <div className='w-16 h-16 rounded-full bg-gradient-to-br from-earth-400 to-sensual-400 flex items-center justify-center mx-auto mb-3'>
                  <ShoppingBag className='w-8 h-8 text-white' />
                </div>
                <p className='font-cursive text-lg'>{product.name}</p>
              </div>
            </div>

            {/* Badges */}
            <div className='absolute top-4 left-4 flex flex-col gap-2'>
              {product.isNew && (
                <span className='px-3 py-1 bg-spring-500 text-white text-xs font-semibold rounded-full'>
                  Nuevo
                </span>
              )}
              {product.isSale && (
                <span className='px-3 py-1 bg-sensual-500 text-white text-xs font-semibold rounded-full'>
                  Oferta
                </span>
              )}
              {product.plusSize && (
                <span className='px-3 py-1 bg-earth-600 text-white text-xs font-semibold rounded-full'>
                  Tallas Grandes
                </span>
              )}
            </div>

            {/* Heart Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsFavorite(!isFavorite)}
              className='absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg'
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? 'text-sensual-500 fill-current' : 'text-gray-600'}`}
              />
            </motion.button>
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

                {/* Rating */}
                <div className='flex items-center gap-2 mb-4'>
                  <div className='flex items-center'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className='text-sm text-gray-600'>
                    {product.rating} ({product.reviews} reseñas)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className='text-right'>
                <div className='flex flex-col items-end'>
                  {product.originalPrice && (
                    <span className='text-sm text-gray-500 line-through'>
                      ${product.originalPrice.toLocaleString('es-CL')}
                    </span>
                  )}
                  <span className='font-display text-3xl font-bold text-gradient-sensual'>
                    ${product.price.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>
            </div>

            {/* Sizes and Colors */}
            <div className='mb-6'>
              <div className='mb-3'>
                <span className='text-sm font-semibold text-gray-700 mb-2 block'>
                  Tallas:
                </span>
                <div className='flex flex-wrap gap-1'>
                  {product.sizes.slice(0, 8).map(size => (
                    <span
                      key={size}
                      className='px-2 py-1 text-xs border border-earth-300 rounded text-earth-600 bg-earth-50'
                    >
                      {size}
                    </span>
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
                    <div
                      key={colorIndex}
                      className={`w-6 h-6 rounded-full border-2 border-white shadow-sm ${getColorClass(color)}`}
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
                className='flex-1 btn-sensual'
              >
                <ShoppingBag className='w-4 h-4 mr-2' />
                Agregar al Carrito
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                className='px-4 py-2 border border-earth-400 text-earth-700 rounded-full hover:bg-earth-50 transition-colors'
              >
                <Eye className='w-4 h-4' />
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
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className='group cursor-pointer'
    >
      <div className='bg-gradient-to-br from-earth-50 to-sensual-50 backdrop-blur-sm border border-earth-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500'>
        {/* Product Image */}
        <div className='relative h-80 overflow-hidden'>
          <div className='w-full h-full bg-gradient-to-br from-earth-200 to-sensual-200 flex items-center justify-center'>
            <div className='text-center text-earth-600'>
              <div className='w-20 h-20 rounded-full bg-gradient-to-br from-earth-400 to-sensual-400 flex items-center justify-center mx-auto mb-4'>
                <ShoppingBag className='w-10 h-10 text-white' />
              </div>
              <p className='font-cursive text-2xl'>{product.name}</p>
            </div>
          </div>

          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-4'
          >
            <div className='flex gap-2'>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{
                  y: isHovered ? 0 : 20,
                  opacity: isHovered ? 1 : 0,
                }}
                className='bg-white/90 backdrop-blur-sm text-earth-800 p-2 rounded-full hover:bg-white transition-colors'
              >
                <Eye className='w-4 h-4' />
              </motion.button>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{
                  y: isHovered ? 0 : 20,
                  opacity: isHovered ? 1 : 0,
                }}
                transition={{ delay: 0.1 }}
                className='bg-sensual-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-sensual-600 transition-colors'
              >
                Agregar
              </motion.button>
            </div>
          </motion.div>

          {/* Badges */}
          <div className='absolute top-4 left-4 flex flex-col gap-2'>
            {product.isNew && (
              <span className='px-3 py-1 bg-spring-500 text-white text-xs font-semibold rounded-full'>
                Nuevo
              </span>
            )}
            {product.isSale && (
              <span className='px-3 py-1 bg-sensual-500 text-white text-xs font-semibold rounded-full'>
                Oferta
              </span>
            )}
            {product.plusSize && (
              <span className='px-3 py-1 bg-earth-600 text-white text-xs font-semibold rounded-full'>
                Tallas Grandes
              </span>
            )}
          </div>

          {/* Category Badge */}
          <div className='absolute top-4 right-14'>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(product.category)}`}
            >
              {getCategoryName(product.category)}
            </span>
          </div>

          {/* Heart Icon */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsFavorite(!isFavorite)}
            className='absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg'
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? 'text-sensual-500 fill-current' : 'text-gray-600'}`}
            />
          </motion.button>
        </div>

        {/* Product Info */}
        <div className='p-6'>
          <h3 className='font-display text-xl font-bold text-gradient-earth mb-2'>
            {product.name}
          </h3>

          <p className='text-gray-600 text-sm mb-3 line-clamp-2'>
            {product.description}
          </p>

          {/* Rating */}
          <div className='flex items-center gap-2 mb-4'>
            <div className='flex items-center'>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className='text-xs text-gray-500'>
              {product.rating} ({product.reviews})
            </span>
          </div>

          {/* Size Options */}
          <div className='flex flex-wrap gap-1 mb-4'>
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
            {product.colors.map((color, colorIndex) => (
              <div
                key={colorIndex}
                className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${getColorClass(color)}`}
                title={color}
              />
            ))}
          </div>

          {/* Price and Add to Cart */}
          <div className='flex items-center justify-between'>
            <div>
              {product.originalPrice && (
                <span className='text-sm text-gray-500 line-through block'>
                  ${product.originalPrice.toLocaleString('es-CL')}
                </span>
              )}
              <span className='font-display text-2xl font-bold text-gradient-sensual'>
                ${product.price.toLocaleString('es-CL')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(ProductCard);
