'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ShoppingBag, MessageCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { APP_CONFIG } from '@/lib/config';

interface OrderDetail {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total: number;
  shipping_address: any;
  items: Array<{
    product_name?: string;
    name?: string;
    quantity?: number;
    price?: number;
    size?: string;
    color?: string;
  }>;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(orderId));

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (err) {
        console.warn('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

    // Generador de mensaje para WhatsApp
    const whatsappNumber = (APP_CONFIG.contact.whatsapp || '+56912345678').replace(/[^0-9]/g, '');
    const itemsSummary = order?.items?.map(it => `- ${it.quantity}x ${it.product_name || it.name} (${it.size || 'N/A'}, ${it.color || 'N/A'})`).join('\n') || '';
    const whatsappMessage = encodeURIComponent(
        `¡Hola Casa Aira Boutique! Acabo de realizar el pedido ${order?.order_number || orderId || ''}.\n\n` +
        (itemsSummary ? `Prendas seleccionadas:\n${itemsSummary}\n\n` : '') +
        (order?.total ? `Total Pagado: $${order.total.toLocaleString('es-CL')} CLP\n` : '') +
        `Quedo atenta al despacho y código de seguimiento de Starken/Chilexpress. ¡Muchas gracias!`
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return (
        <div className="max-w-lg w-full bg-white border border-stone-200 p-8 sm:p-10 shadow-sm space-y-6 mt-16 my-8 text-center text-[#181716]">
            {/* Icon Animation */}
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                className="w-16 h-16 bg-calypso-50 border border-calypso-200/80 rounded-full flex items-center justify-center mx-auto text-calypso-700"
            >
                <CheckCircle2 className="w-9 h-9" />
            </motion.div>

            {/* Text Content */}
            <div className="space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-calypso-700 block">
                    COMPRA CONFIRMADA
                </span>
                <h1
                    className="text-3xl font-serif text-[#181716] font-normal"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                    ¡Gracias por tu pedido!
                </h1>
                <p className="text-stone-600 font-light text-sm">
                    Tu orden ha sido registrada y comenzaremos a prepararla con dedicación.
                </p>
                {order?.order_number && (
                    <div className="inline-block px-4 py-1.5 bg-stone-100 border border-stone-200 text-xs font-mono font-semibold text-stone-800 tracking-wider">
                        N° {order.order_number}
                    </div>
                )}
            </div>

            {loading ? (
                <div className="py-6 flex items-center justify-center gap-2 text-xs text-stone-500 font-light">
                    <Loader2 className="w-4 h-4 animate-spin text-calypso-700" />
                    <span>Cargando detalle de tu pedido...</span>
                </div>
            ) : order ? (
                <div className="bg-stone-50 border border-stone-200 p-5 text-left space-y-3 text-xs text-stone-700">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                        <span className="font-semibold uppercase tracking-wider text-[10px] text-stone-500">Resumen de tu Selección</span>
                        <span className="text-calypso-700 font-semibold uppercase text-[10px]">Pago Aprobado</span>
                    </div>

                    <div className="space-y-2">
                        {order.items?.map((it, idx) => (
                            <div key={idx} className="flex justify-between items-start">
                                <div>
                                    <span className="font-medium text-[#181716]">{it.quantity}x {it.product_name || it.name}</span>
                                    <div className="text-[11px] text-stone-500 font-light">Talla: {it.size || 'N/A'} • Tono: {it.color || 'N/A'}</div>
                                </div>
                                {it.price && <span className="font-sans font-medium text-stone-900">${(it.price * (it.quantity || 1)).toLocaleString('es-CL')}</span>}
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-stone-200 pt-2 flex justify-between items-center text-sm font-semibold text-[#181716]">
                        <span>Total Pagado:</span>
                        <span className="text-calypso-700">${order.total?.toLocaleString('es-CL')} CLP</span>
                    </div>
                </div>
            ) : (
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                    Muchas gracias por elegir Casa Aira. Cuidamos cada detalle de empaque, aroma y presentación para que disfrutes tu vestido al recibirlo.
                </p>
            )}

            {/* Timeline / Next steps */}
            <div className="border-t border-stone-200 pt-6 text-left space-y-3">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-500">¿Qué sucederá ahora?</h3>
                <ul className="space-y-2 text-xs text-stone-600 font-light">
                    <li className="flex items-start gap-2.5">
                        <span className="font-semibold text-calypso-700 font-serif">1.</span>
                        <span>Preparamos y perfumamos tu vestido en empaque seguro con papel de seda.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                        <span className="font-semibold text-calypso-700 font-serif">2.</span>
                        <span>Despachamos tu paquete a través de Starken o Chilexpress.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                        <span className="font-semibold text-calypso-700 font-serif">3.</span>
                        <span>Te enviaremos tu código de seguimiento directo para rastrearlo.</span>
                    </li>
                </ul>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 space-y-3">
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white uppercase tracking-[0.2em] text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                    <MessageCircle className="w-4 h-4" />
                    <span>Confirmar por WhatsApp</span>
                </a>

                <Link
                    href="/catalogo"
                    className="w-full py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 uppercase tracking-[0.2em] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Ver Más Vestidos</span>
                </Link>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4 text-center">
            <Header />
            <Suspense fallback={<div className="text-stone-500 py-20 font-serif">Cargando confirmación...</div>}>
                <SuccessContent />
            </Suspense>
        </div>
    );
}
