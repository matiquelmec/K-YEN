'use client';

import Link from 'next/link';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';

export default function CheckoutFailurePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-earth-900 via-earth-800 to-gothic-900 flex flex-col items-center justify-center p-4 text-center text-bone-100">
            <Header />
            <div className="max-w-md w-full bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6 mt-16">
                
                {/* Icon Animation */}
                <motion.div
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                    className="w-20 h-20 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center mx-auto text-red-400"
                >
                    <XCircle className="w-12 h-12" />
                </motion.div>

                {/* Text Content */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-display font-bold text-bone-100">Pago Fallido</h1>
                    <p className="text-red-400 font-medium text-sm">No pudimos procesar tu transacción</p>
                </div>

                <p className="text-sm text-bone-300 leading-relaxed">
                    Hubo un problema al procesar el pago con Mercado Pago. Esto puede deberse a límites de la tarjeta, fondos insuficientes o un fallo de red temporal.
                </p>

                {/* Action Buttons */}
                <div className="pt-4 space-y-3">
                    <Link
                        href="/checkout"
                        className="w-full py-3.5 bg-gradient-to-r from-sensual-600 to-sensual-700 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-sensual-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4 animate-spin-slow" />
                        Reintentar el Pago
                    </Link>
                    
                    <Link
                        href="/catalogo"
                        className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-sm text-bone-200 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al Catálogo
                    </Link>
                </div>
            </div>
        </div>
    );
}
