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
    `¡Hola Taller KÜYEN! Acabo de realizar el pedido ${order?.order_number || orderId || ''}.\n\n` +
    (itemsSummary ? `Prendas:\n${itemsSummary}\n\n` : '') +
    (order?.total ? `Total Pagado: $${order.total.toLocaleString('es-CL')} CLP\n` : '') +
    `Quedo atenta a la confirmación de confección y código de seguimiento. ¡Muchas gracias!`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="max-w-lg w-full bg-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6 mt-16 my-8">
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
        {order?.order_number && (
          <div className="inline-block px-3 py-1 bg-white/10 border border-white/10 rounded-full text-xs font-mono font-bold text-bone-200">
            N° {order.order_number}
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-6 flex items-center justify-center gap-2 text-xs text-bone-400">
          <Loader2 className="w-4 h-4 animate-spin text-terra-400" />
          <span>Cargando detalle de tu pedido...</span>
        </div>
      ) : order ? (
        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-left space-y-3 text-xs text-bone-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold uppercase tracking-wider text-[10px] text-terra-300">Resumen de Compra</span>
            <span className="text-spring-400 font-bold">Estado: Pagado</span>
          </div>

          <div className="space-y-2">
            {order.items?.map((it, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div>
                  <span className="font-semibold text-bone-100">{it.quantity}x {it.product_name || it.name}</span>
                  <div className="text-[11px] text-bone-400">Talla: {it.size || 'N/A'} • Color: {it.color || 'N/A'}</div>
                </div>
                {it.price && <span className="font-mono">${(it.price * (it.quantity || 1)).toLocaleString('es-CL')}</span>}
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-2 flex justify-between items-center text-sm font-bold text-bone-100">
            <span>Total Pagado:</span>
            <span className="text-terra-300">${order.total?.toLocaleString('es-CL')} CLP</span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-bone-300 leading-relaxed">
          Muchas gracias por confiar en KÜYEN. Estamos preparando tu pedido con toda la dedicación y cuidado que nos caracteriza en nuestro taller regional.
        </p>
      )}

      {/* Timeline / Next steps */}
      <div className="border-t border-white/15 pt-6 text-left space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-bone-400">Próximos pasos</h3>
        <ul className="space-y-3 text-xs text-bone-300">
          <li className="flex gap-2">
            <span className="text-terra-400 font-bold">1.</span>
            <span>Confeccionamos y empaquetamos tu pedido en el taller.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-terra-400 font-bold">2.</span>
            <span>Despachamos mediante Starken o Chilexpress.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-terra-400 font-bold">3.</span>
            <span>Recibirás tu número de seguimiento para rastrear el envío a tu domicilio.</span>
          </li>
        </ul>
      </div>

      {/* CTA Buttons */}
      <div className="pt-2 space-y-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          Enviar comprobante por WhatsApp
        </a>

        <Link
          href="/catalogo"
          className="w-full py-3.5 bg-white/10 hover:bg-white/15 text-bone-200 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          Seguir Explorando el Catálogo
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-900 via-earth-800 to-gothic-900 flex flex-col items-center justify-center p-4 text-center text-bone-100">
      <Header />
      <Suspense fallback={<div className="text-bone-300 py-20">Cargando confirmación...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
