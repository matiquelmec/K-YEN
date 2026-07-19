'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AddressForm from '@/components/checkout/AddressForm';
import { ChevronLeft, Truck, CreditCard } from 'lucide-react';
import Header from '@/components/Header';

export default function CheckoutPage() {
    const { state, clearCart } = useCart();
    const { items, total } = state;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleCheckout = async (formData: any) => {
        setIsSubmitting(true);

        try {
            // 1. Llamar a la API de Checkout para crear la preferencia de Mercado Pago
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: items,
                    customerInfo: formData,
                }),
            });

            const checkoutData = await response.json();

            if (!response.ok) {
                throw new Error(checkoutData.error || 'Error al iniciar checkout');
            }

            // 2. Prepare Order Data including the payment_id (external_reference)
            const orderData = {
                is_guest: true,
                total: total,
                shipping_address: formData,
                payment_id: checkoutData.paymentId, // Link order with external_reference
                payment_status: 'pending',
                items: items.map(item => ({
                    product_id: item.product.id,
                    product_name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                    size: item.selectedSize,
                    color: item.selectedColor,
                    image: item.product.images?.[0] || ''
                }))
            };

            const orderRes = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!orderRes.ok) {
                const orderError = await orderRes.json();
                throw new Error(orderError.error || 'Error al guardar la orden');
            }

            // 4. Success - Clear cart and redirect to Mercado Pago
            clearCart();
            window.location.href = checkoutData.checkoutUrl;

        } catch (error: any) {
            console.error('Error creating order:', error);
            alert(`Error al procesar tu pago: ${error.message || 'Intenta nuevamente.'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-earth-900 to-gothic-900 flex flex-col items-center justify-center p-4 text-center">
                <Header />
                <h1 className="text-3xl font-display font-bold text-bone-100 mb-6">Tu bolso está vacío</h1>
                <Link href="/catalogo" className="text-terra-400 hover:text-terra-300 font-medium flex items-center gap-2 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                    Volver al catálogo
                </Link>
            </div>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-earth-900 via-earth-800 to-gothic-900 pt-28 pb-12 px-4 sm:px-6 lg:px-8 text-bone-100">
            <Header />
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <Link href="/catalogo" className="text-bone-400 hover:text-bone-200 flex items-center gap-2 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                        Volver a comprar
                    </Link>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-7 space-y-6">
                        <AddressForm onSubmit={handleCheckout} />

                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                            <h3 className="text-xl font-display font-bold text-bone-100 mb-4">Método de Envío</h3>
                            <div className="flex items-start gap-4 p-4 border border-sensual-500/30 bg-sensual-950/20 rounded-xl">
                                <Truck className="w-6 h-6 text-terra-400 mt-1" />
                                <div>
                                    <p className="font-semibold text-bone-100">Envío por Pagar</p>
                                    <p className="text-sm text-bone-300 mt-1">
                                        El costo del envío se pagará directamente a la empresa de transporte (Starken o Chilexpress) al momento de recibir tu pedido.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                const form = document.querySelector('form');
                                if (form) form.requestSubmit();
                            }}
                            disabled={isSubmitting}
                            className="w-full py-4 bg-gradient-to-r from-sensual-600 to-sensual-700 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-sensual-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
                        </button>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5 mt-10 lg:mt-0">
                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl sticky top-24">
                            <h2 className="text-xl font-display font-bold text-bone-100 mb-6">Resumen del Pedido</h2>

                            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-16 h-20 rounded-md overflow-hidden bg-earth-800/50 flex-shrink-0 border border-white/5">
                                            {item.product?.images?.[0] && (
                                                <Image
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-bone-100 line-clamp-2">{item.product.name}</h4>
                                            <p className="text-xs text-bone-400 mt-1">
                                                {item.quantity} x {formatPrice(item.product.price)}
                                            </p>
                                            <p className="text-xs text-bone-400">
                                                {item.selectedSize} / {item.selectedColor}
                                            </p>
                                        </div>
                                        <div className="text-sm font-medium text-bone-100">
                                            {formatPrice(item.product.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-6 space-y-4">
                                <div className="flex items-center justify-between text-bone-300">
                                    <span>Subtotal</span>
                                    <span className="text-bone-100">{formatPrice(total)}</span>
                                </div>
                                <div className="flex items-center justify-between text-bone-300">
                                    <span>Envío</span>
                                    <span className="text-spring-400 font-medium">Por Pagar</span>
                                </div>
                                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                    <span className="text-xl font-display font-bold text-bone-100">Total</span>
                                    <span className="text-2xl font-display font-bold text-terra-400">{formatPrice(total)}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-center gap-2 text-bone-400 text-sm">
                                <CreditCard className="w-4 h-4 text-terra-400" />
                                <span>Transacción segura y encriptada</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
