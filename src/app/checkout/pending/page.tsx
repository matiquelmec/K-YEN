'use client';

import Link from 'next/link';
import { Clock, ShoppingBag, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { APP_CONFIG } from '@/lib/config';

export default function CheckoutPendingPage() {
    const whatsappNumber = (APP_CONFIG.contact.whatsapp || '+56912345678').replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hola%20Casa%20Aira,%20mi%20pago%20qued%C3%B3%20en%20estado%20pendiente.%20%C2%BFMe%20podr%C3%ADan%20confirmar%20si%20se%20recibi%C3%B3?`;

    return (
        <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4 text-center text-[#181716]">
            <Header />
            <div className="max-w-md w-full bg-white border border-stone-200 p-8 sm:p-10 shadow-sm space-y-6 mt-16">
                
                {/* Icon Animation */}
                <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                    className="w-16 h-16 bg-gold-50 border border-gold-200 rounded-full flex items-center justify-center mx-auto text-gold-700"
                >
                    <Clock className="w-8 h-8 animate-pulse" />
                </motion.div>

                {/* Text Content */}
                <div className="space-y-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gold-700 block">
                        VALIDACIÓN EN PROCESO
                    </span>
                    <h1
                        className="text-2xl sm:text-3xl font-serif text-[#181716] font-normal"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        Pago Pendiente
                    </h1>
                    <p className="text-stone-600 font-light text-sm leading-relaxed">
                        Tu medio de pago está validando la transacción. Una vez acreditado, te avisaremos de inmediato para iniciar la preparación de tu vestido.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 space-y-3">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white uppercase tracking-[0.2em] text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span>Consultar por WhatsApp</span>
                    </a>

                    <Link
                        href="/catalogo"
                        className="w-full py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 uppercase tracking-[0.2em] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Seguir Explorando</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

