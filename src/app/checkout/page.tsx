'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import AddressForm from '@/components/checkout/AddressForm';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Truck, CreditCard } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function CheckoutPage() {
    const { state, clearCart } = useCart(); // Destructure clearCart from useCart
    const { items, total } = state;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    // supabase is imported directly

    const handleCheckout = async (formData: any) => {
        setIsSubmitting(true);

        try {
            // 1. Prepare Order Data
            const orderData = {
                user_id: null, // Guest checkout for now (or auth.user.id if we add auth later)
                is_guest: true,
                status: 'pending',
                total: total,
                shipping_address: formData,
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

            // 2. Insert into Supabase
            const { data, error } = await supabase
                .from('orders')
                .insert(orderData)
                .select()
                .single();

            if (error) throw error;

            // 3. Success
            clearCart(); // Empty local cart

            // Redirect to success page (or simple alert for now)
            alert(`¡Orden #${data.order_number || data.id} creada con éxito!\nTe contactaremos al correo ${formData.email}.`);
            router.push('/');

        } catch (error: any) {
            console.error('Error creating order:', error);
            alert('Hubo un error al procesar tu pedido. Por favor intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h1>
                <Link href="/catalogo" className="text-sensual-600 hover:text-sensual-700 font-medium flex items-center gap-2">
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
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <Link href="/catalogo" className="text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                        Volver a comprar
                    </Link>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-7">
                        <AddressForm onSubmit={handleCheckout} />

                        <div className="mt-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-display font-bold text-earth-900 mb-4">Método de Envío</h3>
                            <div className="flex items-start gap-4 p-4 border border-sensual-200 bg-sensual-50 rounded-xl">
                                <Truck className="w-6 h-6 text-sensual-600 mt-1" />
                                <div>
                                    <p className="font-semibold text-earth-900">Envío por Pagar</p>
                                    <p className="text-sm text-gray-600 mt-1">
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
                            className="w-full mt-8 py-4 bg-gradient-to-r from-earth-900 to-earth-800 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
                        </button>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5 mt-10 lg:mt-0">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-display font-bold text-earth-900 mb-6">Resumen del Pedido</h2>

                            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-16 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
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
                                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{item.product.name}</h4>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {item.quantity} x {formatPrice(item.product.price)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {item.selectedSize} / {item.selectedColor}
                                            </p>
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {formatPrice(item.product.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-6 space-y-4">
                                <div className="flex items-center justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                                <div className="flex items-center justify-between text-gray-600">
                                    <span>Envío</span>
                                    <span className="text-sensual-600 font-medium">Por Pagar</span>
                                </div>
                                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                    <span className="text-xl font-display font-bold text-earth-900">Total</span>
                                    <span className="text-2xl font-display font-bold text-sensual-600">{formatPrice(total)}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-sm">
                                <CreditCard className="w-4 h-4" />
                                <span>Transacción segura y encriptada</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
