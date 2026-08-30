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

          {/* Sidebar - Casa Aira Boutique Theme */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white/98 backdrop-blur-md z-[70] shadow-[0_0_50px_rgba(0,0,0,0.15)] border-l border-stone-200 text-stone-800"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-stone-200 bg-stone-50/50">
                <h2 className="font-display text-2xl font-bold text-stone-900 flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-calypso-600" />
                  Tu Bolsa Casa Aira
                </h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 rounded-full hover:bg-stone-200/60 transition-colors text-stone-500 hover:text-stone-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 bg-stone-50/30">
                {items.length === 0 ? (
                  <div className="text-center py-20 flex flex-col items-center">
                    <div className="w-20 h-20 bg-calypso-50 rounded-full flex items-center justify-center mb-6 text-calypso-500 border border-calypso-100">
                      <ShoppingBag className="w-10 h-10 text-calypso-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-stone-900 mb-2">Tu bolsa está vacía</h3>
                    <p className="text-stone-500 max-w-xs mx-auto text-sm font-light">
                      Aún no has agregado vestidos para acompañar tus momentos especiales.
                    </p>
                    <button
                      onClick={() => {
                        setCartOpen(false);
                        window.location.href = '/catalogo';
                      }}
                      className='mt-8 btn-calypso'
                    >
                      Explorar Catálogo
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
                        className="flex gap-4 p-4 bg-white rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        {/* Product Image */}
                        <div className="w-20 h-28 relative rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                          {item.product?.images?.[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name || ''}
                              fill
                              className="object-cover object-top"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-stone-400">
                              <ShoppingBag className="w-6 h-6" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col justify-between py-0.5">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-stone-900 text-sm leading-tight line-clamp-2">
                                {item.product?.name || 'Vestido'}
                              </h3>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-stone-400 hover:text-rose-500 transition-colors p-1 -mr-1 -mt-1"
                                title="Eliminar prenda"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="flex items-center gap-2.5 mt-1.5 text-xs text-stone-500">
                              <span className='bg-stone-100 px-2 py-0.5 rounded-md text-stone-700 font-medium'>
                                Talla {item.selectedSize}
                              </span>
                              <div className="flex items-center gap-1">
                                <div className={`w-3 h-3 rounded-full border border-stone-300 ${getColorClass(item.selectedColor)}`} />
                                <span>{item.selectedColor}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-end justify-between mt-3">
                            <div className="flex items-center gap-2 bg-stone-100 rounded-lg p-0.5">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-stone-700 hover:bg-stone-200 active:scale-95 transition-all shadow-xs"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-4 text-center font-semibold text-xs text-stone-800">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-stone-700 hover:bg-stone-200 active:scale-95 transition-all shadow-xs"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="font-display font-bold text-base text-stone-900">
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
                <div className="border-t border-stone-200 p-6 bg-white shadow-lg">
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center justify-between text-stone-500 text-sm">
                      <span>Subtotal</span>
                      <span className="text-stone-900 font-medium">{formatPrice(total)}</span>
                    </div>
                    <div className="flex items-center justify-between text-stone-500 text-sm">
                      <span>Despacho</span>
                      <span className="text-calypso-600 font-medium">Por Pagar (Starken / Chilexpress)</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                      <span className="font-display text-lg font-bold text-stone-900">Total</span>
                      <span className="font-display text-2xl font-bold text-calypso-700">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCartOpen(false);
                      window.location.href = '/checkout';
                    }}
                    className="w-full btn-calypso py-4 font-bold text-sm tracking-wide shadow-md shadow-calypso-500/25"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Continuar al Pago Seguro
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