'use client';

import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-earth-900 via-earth-800 to-gothic-900 flex flex-col items-center justify-center p-4 text-center text-bone-100">
            <Header />
            <div className="max-w-md w-full bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6 mt-16">
                
                {/* Icon Animation */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                    className="w-20 h-20 bg-spring-500/20 border border-spring-500/30 rounded-full flex items-center justify-center mx-auto text-spring-400"
                >
                    <CheckCircle2 className="w-12 h-12" />
                </motion.div>

                {/* Text Content */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-display font-bold text-bone-100">¡Pago Aprobado!</h1>
                    <p className="text-terra-400 font-cursive text-lg">Tu orden ha sido registrada con éxito</p>
                </div>

                <p className="text-sm text-bone-300 leading-relaxed">
                    Muchas gracias por confiar en KÜYEN. Estamos preparando tu pedido con toda la dedicación y cuidado que nos caracteriza en nuestro taller regional.
                </p>

                {/* Timeline / Next steps */}
                <div className="border-t border-white/15 pt-6 text-left space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-bone-400">Próximos pasos</h3>
                    <ul className="space-y-3 text-xs text-bone-300">
                        <li className="flex gap-2">
                            <span className="text-terra-400 font-bold">1.</span>
                            <span>Procesamos y empaquetamos tu pedido en el taller.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-terra-400 font-bold">2.</span>
                            <span>Despachamos mediante el servicio de transporte seleccionado (Starken o Chilexpress).</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-terra-400 font-bold">3.</span>
                            <span>Te contactaremos con el código de seguimiento de Starken/Chilexpress para que rastrees tu pedido.</span>
                        </li>
                    </ul>
                </div>

                {/* CTA Buttons */}
                <div className="pt-4 space-y-3">
                    <Link
                        href="/catalogo"
                        className="w-full py-3.5 bg-gradient-to-r from-sensual-600 to-sensual-700 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-sensual-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Seguir Explorando
                    </Link>
                </div>
            </div>
        </div>
    );
}
