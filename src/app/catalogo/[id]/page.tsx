'use client';

import { useParams } from 'next/navigation';
import { useProduct } from '@/hooks/useProducts';
import Image from 'next/image';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShoppingBag, ArrowLeft, MessageCircle, ShieldCheck, Truck, RefreshCw, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { getCategoryName, getColorClass } from '@/lib/product-utils';
import { APP_CONFIG } from '@/lib/config';

export default function ProductDetailPage() {
    const { id } = useParams();
    const { product, loading, error } = useProduct(id as string);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const { addItem, setCartOpen } = useCart();

    const handleAddToCart = () => {
        if (product && selectedSize && selectedColor) {
            addItem({
                product,
                quantity: 1,
                selectedSize,
                selectedColor
            });
            setCartOpen(true);
        }
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center'>
                <Header />
                <div className='animate-pulse text-stone-500 font-serif text-lg'>Cargando vestido Casa Aira...</div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className='min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center text-center p-4'>
                <Header />
                <div className='bg-white border border-stone-200 p-10 max-w-md shadow-sm'>
                    <h2
                        className='text-2xl font-serif text-[#181716] mb-3'
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        Vestido no encontrado
                    </h2>
                    <p className='text-stone-600 font-light text-sm mb-6 leading-relaxed'>
                        Es posible que este diseño haya agotado su edición o haya cambiado su enlace.
                    </p>
                    <Link
                        href='/catalogo'
                        className='inline-flex items-center gap-2 px-6 py-3 bg-[#181716] text-white text-xs uppercase tracking-widest font-semibold hover:bg-calypso-700 transition-colors'
                    >
                        <ArrowLeft className='w-4 h-4' /> Volver al Catálogo
                    </Link>
                </div>
            </div>
        );
    }

    const whatsappNumber = (APP_CONFIG.contact.whatsapp || '+56912345678').replace(/[^0-9]/g, '');
    const whatsappQueryText = encodeURIComponent(
        `Hola Casa Aira Boutique, me encantó el vestido "${product.name}"${selectedSize ? ` en talla ${selectedSize}` : ''}${selectedColor ? ` color ${selectedColor}` : ''}. ¿Me podrían dar más detalles sobre disponibilidad y calce?`
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappQueryText}`;

    return (
        <div className='min-h-screen bg-[#FAF8F5] text-[#181716]'>
            <Header />
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32'>

                {/* Breadcrumb / Back */}
                <div className='mb-8 flex items-center justify-between'>
                    <Link
                        href='/catalogo'
                        className='text-stone-600 hover:text-[#181716] flex items-center gap-2 text-xs uppercase tracking-widest font-medium transition-colors'
                    >
                        <ArrowLeft className='w-3.5 h-3.5' /> Volver a la Colección
                    </Link>
                    <span className='text-[10px] uppercase tracking-[0.3em] text-stone-400 hidden sm:inline-block'>
                        SKU: CA-{String(product.id || '').padStart(4, '0')}
                    </span>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start'>
                    
                    {/* Gallery Section (Left - 6 Cols) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className='lg:col-span-6 space-y-4'
                    >
                        <div className='relative aspect-[3/4] w-full overflow-hidden bg-stone-100 border border-stone-200/90 shadow-sm group'>
                            {product.images && (product.images[activeImageIndex] || product.images[0]) ? (
                                <Image
                                    src={product.images[activeImageIndex] || product.images[0] || ''}
                                    alt={product.name}
                                    fill
                                    unoptimized
                                    className='object-cover object-center group-hover:scale-105 transition-transform duration-700'
                                    priority
                                    sizes='(max-width: 1024px) 100vw, 50vw'
                                />
                            ) : (
                                <div className='w-full h-full flex items-center justify-center bg-stone-100'>
                                    <ShoppingBag className='w-16 h-16 text-stone-300' />
                                </div>
                            )}

                            {/* Badges */}
                            <div className='absolute top-4 left-4 flex flex-col gap-2'>
                                {product.is_new && (
                                    <span className='px-3 py-1 bg-white/95 backdrop-blur-sm text-[#181716] text-[9px] uppercase tracking-[0.25em] font-semibold border border-stone-200 shadow-sm'>
                                        Nuevo Ingreso
                                    </span>
                                )}
                                {product.is_sale && (
                                    <span className='px-3 py-1 bg-calypso-700 text-white text-[9px] uppercase tracking-[0.25em] font-semibold shadow-sm'>
                                        Ocasión Especial
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div className='flex gap-3 overflow-x-auto pb-2 scrollbar-hide'>
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`relative w-20 h-28 flex-shrink-0 overflow-hidden border transition-all duration-300 bg-stone-100 ${
                                            activeImageIndex === idx
                                                ? 'border-calypso-700 ring-1 ring-calypso-700'
                                                : 'border-stone-200 hover:border-stone-400 opacity-70 hover:opacity-100'
                                        }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} vista ${idx + 1}`}
                                            fill
                                            unoptimized
                                            className='object-cover object-center'
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Product Info Section (Right - 6 Cols) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className='lg:col-span-6 bg-white border border-stone-200/90 p-8 sm:p-10 shadow-sm'
                    >
                        {/* Categoría / Colección */}
                        <div className='mb-3'>
                            <span className='text-[10px] uppercase tracking-[0.35em] text-calypso-700 font-semibold'>
                                {getCategoryName(product.category)}
                            </span>
                        </div>

                        {/* Título */}
                        <h1
                            className='font-serif text-3xl sm:text-4xl text-[#181716] font-normal leading-tight mb-4'
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                            {product.name}
                        </h1>

                        {/* Precio */}
                        <div className='flex items-baseline gap-4 mb-6 pb-6 border-b border-stone-200'>
                            <span className='text-3xl font-serif text-[#181716] font-normal'>
                                ${product.price.toLocaleString('es-CL')} <span className='text-xs font-sans tracking-widest text-stone-500 uppercase'>CLP</span>
                            </span>
                            {product.original_price && product.original_price > product.price && (
                                <span className='text-base text-stone-400 line-through font-light'>
                                    ${product.original_price.toLocaleString('es-CL')}
                                </span>
                            )}
                        </div>

                        {/* Descripción */}
                        <p className='text-stone-600 font-light text-sm sm:text-base leading-relaxed mb-8'>
                            {product.description || 'Vestido seleccionado exclusivamente por su textura suave, caída estilizada y calce favorecedor. Una prenda pensada para acompañarte con elegancia y total soltura.'}
                        </p>

                        {/* Selectores */}
                        <div className='space-y-6 mb-8'>
                            {/* Tallas */}
                            <div>
                                <div className='flex justify-between items-center mb-2.5'>
                                    <label className='text-xs uppercase tracking-wider font-semibold text-[#181716]'>
                                        Talla Seleccionada: <span className='text-calypso-700'>{selectedSize || 'Elige una talla'}</span>
                                    </label>
                                    <span className='text-[11px] text-stone-500 font-light'>Tallaje inclusivo real</span>
                                </div>
                                <div className='flex flex-wrap gap-2'>
                                    {product.sizes && product.sizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`min-w-[46px] h-11 px-3 border text-xs uppercase tracking-wider font-medium transition-all ${
                                                selectedSize === size
                                                    ? 'bg-[#181716] text-white border-[#181716] shadow-sm'
                                                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400 hover:bg-stone-50'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Colores */}
                            <div>
                                <div className='flex justify-between items-center mb-2.5'>
                                    <label className='text-xs uppercase tracking-wider font-semibold text-[#181716]'>
                                        Tono: <span className='text-calypso-700'>{selectedColor || 'Elige un color'}</span>
                                    </label>
                                </div>
                                <div className='flex flex-wrap gap-3'>
                                    {product.colors && product.colors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-9 h-9 rounded-full border transition-all ${
                                                selectedColor === color
                                                    ? 'ring-2 ring-calypso-700 ring-offset-2 border-stone-800 scale-105'
                                                    : 'border-stone-300 hover:scale-105'
                                            } ${getColorClass(color)} shadow-sm`}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Botones de Acción */}
                        <div className='space-y-3 pt-2'>
                            <button
                                onClick={handleAddToCart}
                                disabled={!selectedSize || !selectedColor}
                                className={`w-full py-4 uppercase tracking-[0.25em] text-xs font-semibold flex items-center justify-center gap-3 transition-all ${
                                    selectedSize && selectedColor
                                        ? 'bg-[#181716] text-white hover:bg-calypso-700 cursor-pointer shadow-md'
                                        : 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-200'
                                }`}
                            >
                                <ShoppingBag className='w-4 h-4' />
                                {selectedSize && selectedColor ? 'Agregar a mi Bolsa' : 'Selecciona Talla y Color'}
                            </button>

                            {/* Asesoría por WhatsApp */}
                            <a
                                href={whatsappUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='w-full py-3.5 bg-emerald-50 border border-emerald-200/80 hover:bg-emerald-100/70 text-emerald-900 uppercase tracking-[0.2em] text-[11px] font-semibold flex items-center justify-center gap-2.5 transition-colors'
                            >
                                <MessageCircle className='w-4 h-4 text-emerald-600' />
                                <span>¿Dudas con la talla? Asesoría por WhatsApp</span>
                            </a>
                        </div>

                        {/* Garantías y Beneficios Reales */}
                        <div className='mt-8 pt-8 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4'>
                            <div className='flex items-start gap-2.5'>
                                <Truck className='w-4 h-4 text-calypso-700 flex-shrink-0 mt-0.5' />
                                <div>
                                    <p className='text-xs uppercase tracking-wider font-semibold text-stone-900'>Envíos a Todo Chile</p>
                                    <p className='text-[11px] text-stone-500 font-light mt-0.5'>Starken y Chilexpress</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-2.5'>
                                <RefreshCw className='w-4 h-4 text-gold-700 flex-shrink-0 mt-0.5' />
                                <div>
                                    <p className='text-xs uppercase tracking-wider font-semibold text-stone-900'>30 Días para Cambios</p>
                                    <p className='text-[11px] text-stone-500 font-light mt-0.5'>Cambios de talla fáciles</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-2.5'>
                                <ShieldCheck className='w-4 h-4 text-stone-800 flex-shrink-0 mt-0.5' />
                                <div>
                                    <p className='text-xs uppercase tracking-wider font-semibold text-stone-900'>Calidad Comprobada</p>
                                    <p className='text-[11px] text-stone-500 font-light mt-0.5'>Inspección antes de enviar</p>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>
            <div className='mt-24'>
                <Footer />
            </div>
        </div>
    );
}

