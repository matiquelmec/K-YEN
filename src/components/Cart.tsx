'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import { getColorClass } from '@/lib/product-utils';

export default function Cart() {
  const { state, updateQuantity, removeItem, clearCart, setCartOpen } = useCart();
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

          {/* Sidebar - Dark Boutique Theme */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-earth-950/98 backdrop-blur-md z-[70] shadow-[0_0_50px_rgba(0,0,0,0.8)] border-l border-earth-800 text-bone-50"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-earth-800 bg-earth-950">
                <h2 className="font-display text-2xl font-bold text-bone-100 flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-terra-400" />
                  Tu Bolso
                </h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-bone-300 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 bg-earth-900/30">
                {items.length === 0 ? (
                  <div className="text-center py-20 flex flex-col items-center">
                    <div className="w-20 h-20 bg-earth-900 rounded-full flex items-center justify-center mb-6 text-earth-300 border border-white/5">
                      <ShoppingBag className="w-10 h-10 text-terra-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-bone-100 mb-2">Tu bolso está vacío</h3>
                    <p className="text-bone-400 max-w-xs mx-auto text-sm">
                      Parece que aún no has seleccionado el vestido perfecto para tu colección.
                    </p>
                    <button
                      onClick={() => {
                        setCartOpen(false);
                        window.location.href = '/catalogo';
                      }}
                      className='mt-8 px-6 py-3 bg-sensual-600 text-white rounded-full font-medium hover:bg-sensual-500 transition-all duration-300 shadow-lg shadow-sensual-600/20 active:scale-95'
                    >
                      Explorar Catálogo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex gap-4 p-4 bg-earth-900/50 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 shadow-md"
                      >
                        {/* Product Image */}
                        <div className="w-24 h-32 relative rounded-xl overflow-hidden bg-earth-800/50 flex-shrink-0 border border-white/5">
                          {item.product?.images?.[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name || ''}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-earth-400">
                              <ShoppingBag className="w-8 h-8" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-bone-100 text-lg leading-tight line-clamp-2">
                                {item.product?.name || 'Producto'}
                              </h3>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-bone-400 hover:text-red-400 transition-colors p-1 -mr-2 -mt-2"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-3 mt-2 text-sm text-bone-400">
                              <span className='bg-white/10 px-2 py-1 rounded-md text-bone-200 font-medium text-xs'>
                                {item.selectedSize}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <div className={`w-3.5 h-3.5 rounded-full border border-white/10 shadow-sm ${getColorClass(item.selectedColor)}`} />
                                <span className="text-xs">{item.selectedColor}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-end justify-between mt-4">
                            <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-lg p-1">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="w-7 h-7 flex items-center justify-center rounded-md bg-earth-800 text-bone-200 hover:text-white hover:bg-earth-700 active:scale-95 transition-all"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-4 text-center font-medium text-bone-100">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-md bg-earth-800 text-bone-200 hover:text-white hover:bg-earth-700 active:scale-95 transition-all"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="font-display font-bold text-xl text-terra-400">
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
                <div className="border-t border-earth-800 p-6 bg-earth-950 shadow-[0_-5px_20px_rgba(0,0,0,0.4)]">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-bone-400 text-sm">
                      <span>Subtotal</span>
                      <span className="text-bone-200">{formatPrice(total)}</span>
                    </div>
                    <div className="flex items-center justify-between text-bone-400 text-sm">
                      <span>Envío</span>
                      <span className="text-spring-400 font-medium">Por Pagar</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-dashed border-earth-800">
                      <span className="font-display text-xl font-bold text-bone-100">Total</span>
                      <span className="font-display text-2xl font-bold text-terra-400">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCartOpen(false);
                      window.location.href = '/checkout';
                    }}
                    className="w-full py-4 bg-gradient-to-r from-sensual-600 to-sensual-700 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-sensual-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Checkout Seguro
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
        className="relative p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors group animate-in fade-in duration-300"
      >
        <ShoppingBag className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-sensual-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-bounce">
            {itemCount}
          </span>
        )}
      </button>

      {/* Render sidebar in Portal to avoid z-index/overflow issues */}
      {mounted ? createPortal(cartContent, document.body) : null}
    </>
  );
}