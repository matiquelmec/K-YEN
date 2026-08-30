'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import { getColorClass } from '@/lib/product-utils';

export default function Cart() {
  const { state, updateQuantity, removeItem, setCartOpen } = useCart();
  const { items, total, itemCount, isOpen } = state;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const cartContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/70 z-[60] backdrop-blur-md"
          />

          {/* Sidebar - Casa Aira Haute Couture Bag */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#FAF8F5] z-[70] shadow-2xl border-l border-stone-200 text-[#181716]"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 sm:p-8 border-b border-stone-200/80 bg-white">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-stone-900 stroke-[1.5]" />
                  <h2
                    className="font-serif text-xl sm:text-2xl text-[#181716] font-normal"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Tu Bolso de Compras
                  </h2>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 text-stone-500 hover:text-stone-900 transition-colors"
                >
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#FAF8F5]">
                {items.length === 0 ? (
                  <div className="text-center py-20 flex flex-col items-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 text-stone-400 border border-stone-200">
                      <ShoppingBag className="w-8 h-8 stroke-[1]" />
                    </div>
                    <h3
                      className="font-serif text-xl text-[#181716] font-normal mb-2"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Tu bolso está vacío
                    </h3>
                    <p className="text-stone-500 max-w-xs mx-auto text-xs font-light leading-relaxed mb-8">
                      Aún no has seleccionado prendas curadas para acompañar tus momentos especiales.
                    </p>
                    <button
                      onClick={() => {
                        setCartOpen(false);
                        window.location.href = '/catalogo';
                      }}
                      className='btn-couture-primary'
                    >
                      Descubrir Catálogo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="flex gap-4 p-4 bg-white border border-stone-200/80 shadow-sm"
                      >
                        {/* Product Image */}
                        <div className="w-20 h-28 relative overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200/60">
                          {item.product?.images?.[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name || ''}
                              fill
                              className="object-cover object-top"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-stone-400">
                              <ShoppingBag className="w-6 h-6 stroke-[1]" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col justify-between py-0.5">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3
                                className="font-serif font-normal text-sm text-[#181716] leading-snug line-clamp-2"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                              >
                                {item.product?.name || 'Vestido'}
                              </h3>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-stone-400 hover:text-stone-900 transition-colors p-1"
                                title="Eliminar del bolso"
                              >
                                <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                              </button>
                            </div>

                            <div className="flex items-center gap-2 mt-1.5 text-[11px] text-stone-500 font-light">
                              <span className='border border-stone-200 px-1.5 py-0.5 text-[10px] text-stone-700'>
                                Talla {item.selectedSize}
                              </span>
                              <div className="flex items-center gap-1">
                                <div className={`w-2.5 h-2.5 rounded-full border border-stone-300 ${getColorClass(item.selectedColor)}`} />
                                <span>{item.selectedColor}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-end justify-between mt-3">
                            <div className="flex items-center gap-2 border border-stone-200 px-2 py-1 bg-white">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="text-stone-600 hover:text-stone-900 transition-colors"
                              >
                                <Minus className="w-3 h-3 stroke-[1.5]" />
                              </button>
                              <span className="w-4 text-center font-light text-xs text-stone-800">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="text-stone-600 hover:text-stone-900 transition-colors"
                              >
                                <Plus className="w-3 h-3 stroke-[1.5]" />
                              </button>
                            </div>
                            <p className="font-serif text-sm font-normal text-[#181716]">
                              {formatPrice(item.product?.price || 0)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-stone-200/80 p-6 sm:p-8 bg-white">
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between text-stone-500 text-xs tracking-wider uppercase font-light">
                      <span>Subtotal</span>
                      <span className="text-[#181716] font-normal">{formatPrice(total)}</span>
                    </div>
                    <div className="flex items-center justify-between text-stone-500 text-xs tracking-wider uppercase font-light">
                      <span>Despacho</span>
                      <span className="text-calypso-700 font-medium">Por Pagar (Starken / Chilexpress)</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                      <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#181716]">Total Estimado</span>
                      <span className="font-serif text-2xl text-[#181716] font-normal" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCartOpen(false);
                      window.location.href = '/checkout';
                    }}
                    className="w-full btn-couture-primary py-4 text-center"
                  >
                    <span>Proceder al Pago Seguro</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        onClick={() => setCartOpen(true)}
        className="relative p-2.5 rounded-full bg-stone-100/80 hover:bg-calypso-50 text-stone-700 hover:text-calypso-600 transition-colors group"
        title="Abrir bolsa de compras"
      >
        <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-calypso-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-md animate-bounce">
            {itemCount}
          </span>
        )}
      </button>

      {/* Render sidebar in Portal to avoid z-index/overflow issues */}
      {mounted ? createPortal(cartContent, document.body) : null}
    </>
  );
}