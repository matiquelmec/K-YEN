'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import { getColorClass } from '@/lib/product-utils';

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const { items, total, itemCount } = state;
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
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl border-l border-gray-200"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
                <h2 className="font-display text-2xl font-bold text-earth-900">Tu Bolso</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                {items.length === 0 ? (
                  <div className="text-center py-20 flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                      <ShoppingBag className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Tu bolso está vacío</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">
                      Parece que aún no has encontrado tu vestido perfecto.
                    </p>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        window.location.href = '/catalogo';
                      }}
                      className='mt-8 px-6 py-3 bg-earth-900 text-white rounded-full font-medium hover:bg-earth-800 transition-colors'
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
                        className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                      >
                        {/* Product Image */}
                        <div className="w-24 h-32 relative rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {item.product?.images?.[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name || ''}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-300">
                              <ShoppingBag className="w-8 h-8" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-earth-900 text-lg leading-tight line-clamp-2">
                                {item.product?.name || 'Producto'}
                              </h3>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1 -mr-2 -mt-2"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                              <span className='bg-gray-100 px-2 py-1 rounded-md text-gray-700 font-medium'>
                                {item.selectedSize}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <div className={`w-4 h-4 rounded-full border border-gray-200 shadow-sm ${getColorClass(item.selectedColor)}`} />
                                <span>{item.selectedColor}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-end justify-between mt-4">
                            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="w-7 h-7 flex items-center justify-center rounded-md bg-white shadow-sm text-gray-600 hover:text-gray-900 active:scale-95 transition-all"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-4 text-center font-medium text-gray-900">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-md bg-white shadow-sm text-gray-600 hover:text-gray-900 active:scale-95 transition-all"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="font-display font-bold text-xl text-sensual-600">
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
                <div className="border-t border-gray-100 p-6 bg-white shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-500">
                      <span>Envío</span>
                      <span className="text-green-600 font-medium">Gratis</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-200">
                      <span className="font-display text-xl font-bold text-earth-900">Total</span>
                      <span className="font-display text-2xl font-bold text-sensual-600">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsOpen(false);
                      window.location.href = '/checkout';
                    }}
                    className="w-full py-4 bg-gradient-to-r from-earth-900 to-earth-800 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
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
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors group"
      >
        <ShoppingBag className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-sensual-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
            {itemCount}
          </span>
        )}
      </button>

      {/* Render sidebar in Portal to avoid z-index/overflow issues */}
      {mounted ? createPortal(cartContent, document.body) : null}
    </>
  );
}