'use client';

import Link from 'next/link';
import { XCircle, ArrowLeft, RefreshCw, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { APP_CONFIG } from '@/lib/config';

export default function CheckoutFailurePage() {
    const whatsappNumber = (APP_CONFIG.contact.whatsapp || '+56912345678').replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hola%20Casa%20Aira,%20tuve%20un%20problema%20al%20intentar%20pagar%20mi%20pedido%20en%20la%20p%C3%A1gina.%20%C2%BFMe%20podr%C3%ADan%20ayudar?`;

    return (
        <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4 text-center text-[#181716]">
            <Header />
            <div className="max-w-md w-full bg-white border border-stone-200 p-8 sm:p-10 shadow-sm space-y-6 mt-16">
                
                {/* Icon Animation */}
                <motion.div
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                    className="w-16 h-16 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto text-red-600"
                >
                    <XCircle className="w-8 h-8" />
                </motion.div>

                {/* Text Content */}
                <div className="space-y-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-red-600 block">
                        ESTADO DE LA TRANSACCIÓN
                    </span>
                    <h1
                        className="text-2xl sm:text-3xl font-serif text-[#181716] font-normal"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        No pudimos procesar el pago
                    </h1>
                    <p className="text-stone-600 font-light text-sm leading-relaxed">
                        La pasarela de pago no pudo completar la transacción. Esto puede deberse a límites en la tarjeta, fondos insuficientes o un corte de conexión temporal.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 space-y-3">
                    <Link
                        href="/checkout"
                        className="w-full py-3.5 bg-[#181716] hover:bg-calypso-700 text-white uppercase tracking-[0.2em] text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Reintentar el Pago</span>
                    </Link>

                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 uppercase tracking-[0.2em] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors"
                    >
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                        <span>Ayuda por WhatsApp</span>
                    </a>
                    
                    <Link
                        href="/catalogo"
                        className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 uppercase tracking-[0.2em] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Volver al Catálogo</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

