'use client';

import { useParams } from 'next/navigation';
import { useProduct } from '@/hooks/useProducts';
import Image from 'next/image';
import { useState } from 'react';
import Header from '@/components/Header';
import { ShoppingBag, Star, Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { getCategoryColor, getCategoryName, getColorClass } from '@/lib/product-utils';

export default function ProductDetailPage() {
    const { id } = useParams();
    const { product, loading, error } = useProduct(Number(id));
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const { addItem } = useCart();

    const handleAddToCart = () => {
        if (product && selectedSize && selectedColor) {
            addItem({
                product,
                quantity: 1,
                selectedSize,
                selectedColor
            });
        }
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-earth-900 flex items-center justify-center'>
                <div className='animate-pulse text-earth-200'>Cargando...</div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className='min-h-screen bg-earth-900 flex flex-col items-center justify-center text-center p-4'>
                <h2 className='text-3xl font-display text-earth-100 mb-4'>Producto no encontrado</h2>
                <Link href='/catalogo' className='btn-earth'>
                    Volver al Catálogo
                </Link>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-earth-900 via-earth-800 to-gothic-900'>
            <Header />
            <div className='max-w-7xl mx-auto px-4 py-8 pt-24'>

                {/* Breadcrumb / Back */}
                <div className='mb-8'>
                    <Link href='/catalogo' className='text-earth-300 hover:text-earth-100 flex items-center gap-2 transition-colors'>
                        <ArrowLeft className='w-4 h-4' /> Volver al Catálogo
                    </Link>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
                    {/* Gallery Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='space-y-4'
                    >
                        <div className='relative aspect-[3/4] rounded-2xl overflow-hidden border border-earth-700/50 shadow-2xl'>
                            {product.images && product.images[0] ? (
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className='object-cover'
                                    priority
                                />
                            ) : (
                                <div className='w-full h-full bg-earth-800 flex items-center justify-center'>
                                    <ShoppingBag className='w-20 h-20 text-earth-600' />
                                </div>
                            )}
                            {/* Badges */}
                            <div className='absolute top-4 left-4 flex gap-2'>
                                {product.is_new && (
                                    <span className='px-3 py-1 bg-spring-500 text-white text-xs font-semibold rounded-full'>Nuevo</span>
                                )}
                                {product.is_sale && (
                                    <span className='px-3 py-1 bg-sensual-500 text-white text-xs font-semibold rounded-full'>Oferta</span>
                                )}
                            </div>
                        </div>
                        {/* Thumbnails (Optional expansion) */}
                        {product.images.length > 1 && (
                            <div className='flex gap-4 overflow-x-auto pb-2'>
                                {product.images.map((img, idx) => (
                                    <div key={idx} className='relative w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden border border-earth-700 cursor-pointer hover:border-earth-400'>
                                        <Image src={img} alt={`${product.name} view ${idx}`} fill className='object-cover' />
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Product Info Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-earth-700/30'
                    >
                        <div className='mb-6'>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(product.category)} inline-block mb-3`}>
                                {getCategoryName(product.category)}
                            </span>
                            <h1 className='font-display text-4xl md:text-5xl font-bold text-gradient-earth mb-4'>{product.name}</h1>

                            {/* Rating */}
                            <div className='flex items-center gap-2 mb-4'>
                                <div className='flex text-yellow-500'>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-earth-700'}`} />
                                    ))}
                                </div>
                                <span className='text-earth-300 text-sm'>
                                    {product.rating} ({product.reviews_count} reseñas)
                                </span>
                            </div>

                            <div className='flex items-baseline gap-4 mb-6'>
                                {product.original_price && (
                                    <span className='text-xl text-earth-500 line-through'>${product.original_price.toLocaleString('es-CL')}</span>
                                )}
                                <span className='text-4xl font-display font-bold text-gradient-sensual'>${product.price.toLocaleString('es-CL')}</span>
                            </div>

                            <p className='text-earth-200 leading-relaxed mb-8'>
                                {product.description}
                            </p>

                            {/* Selectors */}
                            <div className='space-y-6 mb-8'>
                                {/* Sizes */}
                                <div>
                                    <label className='block text-earth-200 mb-2 font-semibold'>Selecciona tu Talla:</label>
                                    <div className='flex flex-wrap gap-2'>
                                        {product.sizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`w-12 h-12 rounded-lg border flex items-center justify-center transition-all ${selectedSize === size
                                                    ? 'bg-sensual-600 border-sensual-400 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]'
                                                    : 'border-earth-600 text-earth-300 hover:border-earth-400 hover:bg-white/5'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Colors */}
                                <div>
                                    <label className='block text-earth-200 mb-2 font-semibold'>Selecciona un Color:</label>
                                    <div className='flex flex-wrap gap-3'>
                                        {product.colors.map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color
                                                    ? 'ring-2 ring-sensual-500 ring-offset-2 ring-offset-earth-900 border-transparent'
                                                    : 'border-earth-600 hover:border-earth-300'
                                                    } ${getColorClass(color)} shadow-sm`}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className='flex gap-4'>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!selectedSize || !selectedColor}
                                    className={`flex-1 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all ${selectedSize && selectedColor
                                        ? 'btn-sensual cursor-pointer'
                                        : 'bg-earth-800 text-earth-600 cursor-not-allowed border border-earth-700'
                                        }`}
                                >
                                    <ShoppingBag className='w-5 h-5' />
                                    {selectedSize && selectedColor ? 'Agregar al Carrito' : 'Elige talla y color'}
                                </button>
                                <button className='w-14 h-14 rounded-full border border-earth-600 flex items-center justify-center text-earth-300 hover:bg-white/10 hover:text-sensual-400 transition-colors'>
                                    <Heart className='w-6 h-6' />
                                </button>
                            </div>

                            {/* Additional Info */}
                            <div className='mt-8 pt-8 border-t border-earth-800 grid grid-cols-2 gap-4 text-sm text-earth-400'>
                                <div>
                                    <p className='font-semibold text-earth-300 mb-1'>Envío Gratis</p>
                                    <p>En compras sobre $50.000</p>
                                </div>
                                <div>
                                    <p className='font-semibold text-earth-300 mb-1'>Devolución Garantizada</p>
                                    <p>30 días para cambios</p>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
