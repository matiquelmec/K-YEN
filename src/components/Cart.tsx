'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
      >
        <ShoppingBag className="w-6 h-6 text-white" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-sensual-500 text-white text-xs rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="font-display text-2xl font-bold">Tu Carrito</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                  {items.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">Tu carrito está vacío</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                        >
                          {/* Product Image */}
                          <div className="w-20 h-28 relative rounded-md overflow-hidden bg-gray-200">
                            {item.product?.images?.[0] && (
                              <Image
                                src={item.product.images[0]}
                                alt={item.product.name || ''}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">
                              {item.product?.name || 'Producto'}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Talla: {item.size} | Color: {item.color}
                            </p>
                            <p className="text-sensual-600 font-semibold mt-2">
                              {formatPrice(item.product?.price || 0)}
                            </p>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 mt-3">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="p-1 rounded hover:bg-gray-200 transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 rounded hover:bg-gray-200 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="ml-auto p-1 rounded hover:bg-red-50 text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                  <div className="border-t p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-display text-xl">Total:</span>
                      <span className="font-display text-2xl font-bold text-sensual-600">
                        {formatPrice(total)}
                      </span>
                    </div>
                    <button className="w-full py-3 bg-gradient-to-r from-sensual-500 to-sensual-600 text-white rounded-full font-semibold hover:from-sensual-600 hover:to-sensual-700 transition-all">
                      Proceder al Pago
                    </button>
                    <button
                      onClick={clearCart}
                      className="w-full py-2 mt-2 text-gray-500 hover:text-red-500 transition-colors text-sm"
                    >
                      Vaciar carrito
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}