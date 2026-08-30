'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import Image from 'next/image';
import AddressForm from '@/components/checkout/AddressForm';
import { ChevronLeft, Truck, CreditCard, Tag, Check, X, Loader2 } from 'lucide-react';
import Header from '@/components/Header';

export default function CheckoutPage() {
    const { state, clearCart } = useCart();
    const { items, total } = state;
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estado del cupón de descuento
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{
        code: string;
        discount_amount: number;
        discount_type: string;
        discount_value: number;
        affiliate_name?: string | null;
    } | null>(null);
    const [validatingCoupon, setValidatingCoupon] = useState(false);
    const [couponError, setCouponError] = useState<string | null>(null);

    const handleApplyCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!couponCode.trim()) return;

        setValidatingCoupon(true);
        setCouponError(null);

        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: couponCode.trim().toUpperCase(),
                    cart_amount: total
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Cupón no válido');
            }

            setAppliedCoupon({
                code: data.code,
                discount_amount: data.discount_amount,
                discount_type: data.discount_type,
                discount_value: data.discount_value,
                affiliate_name: data.affiliate_name
            });
            setCouponCode('');
        } catch (err: any) {
            setCouponError(err.message || 'Cupón no válido');
            setAppliedCoupon(null);
        } finally {
            setValidatingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponError(null);
    };

    const discountAmount = appliedCoupon ? appliedCoupon.discount_amount : 0;
    const finalTotal = Math.max(0, total - discountAmount);

    const handleCheckout = async (formData: any) => {
        setIsSubmitting(true);

        try {
            // 1. Llamar a la API de Checkout (crea la orden en BD de forma atómica y genera preferencia de pago)
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: items,
                    customerInfo: formData,
                    couponCode: appliedCoupon ? appliedCoupon.code : undefined,
                }),
            });

            const checkoutData = await response.json();

            if (!response.ok) {
                throw new Error(checkoutData.error || 'Error al iniciar checkout');
            }

            // 2. Éxito: Limpiar carrito y redirigir inmediatamente a Mercado Pago
            clearCart();
            window.location.href = checkoutData.checkoutUrl;

        } catch (error: any) {
            console.error('Error creating order:', error);
            alert(`Error al procesar tu pedido: ${error.message || 'Intenta nuevamente.'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4 text-center">
                <Header />
                <h1
                    className="text-3xl font-serif text-[#181716] font-normal mb-4"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                    Tu bolso está vacío
                </h1>
                <p className="text-stone-500 text-sm font-light mb-8 max-w-sm">
                    No tienes prendas seleccionadas para procesar el pago.
                </p>
                <Link href="/catalogo" className="btn-couture-primary">
                    <ChevronLeft className="w-4 h-4 mr-1 stroke-[1.5]" />
                    <span>Volver al Catálogo</span>
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
        <div className="min-h-screen bg-[#FAF8F5] text-[#181716]">
            <Header />

            <div className="container mx-auto px-4 sm:px-6 py-12 pt-32 max-w-6xl">
                <Link href="/catalogo" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 mb-8 transition-colors text-xs tracking-wider uppercase font-light">
                    <ChevronLeft className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>Continuar explorando</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Address Form */}
                    <div className="lg:col-span-7">
                        <AddressForm onSubmit={handleCheckout} />

                        {/* Shipping Note */}
                        <div className="mt-8 bg-white border border-stone-200 p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <Truck className="w-5 h-5 text-calypso-700 mt-1 stroke-[1.5]" />
                                <div>
                                    <p className="font-serif text-base text-[#181716] font-normal">Despacho por Pagar a Todo Chile</p>
                                    <p className="text-xs text-stone-500 mt-1 font-light leading-relaxed">
                                        El costo del envío se cancela directamente a la empresa de transporte (Starken o Chilexpress) al momento de recibir el paquete en tu domicilio o sucursal.
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
                            className="w-full btn-couture-primary py-4 mt-8 justify-center disabled:opacity-50"
                        >
                            {isSubmitting ? 'Procesando con Mercado Pago...' : 'Confirmar Pedido & Ir al Pago Seguro'}
                        </button>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-white p-8 border border-stone-200 shadow-sm sticky top-28">
                            <h2
                                className="text-xl font-serif text-[#181716] font-normal mb-6 pb-4 border-b border-stone-100"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                            >
                                Resumen del Pedido
                            </h2>

                            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 pb-4 border-b border-stone-100 last:border-0">
                                        <div className="relative w-16 h-20 bg-stone-100 flex-shrink-0 border border-stone-200 overflow-hidden">
                                            {item.product?.images?.[0] && (
                                                <Image
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover object-top"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4
                                                className="text-sm font-serif text-[#181716] line-clamp-2 font-normal"
                                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                                            >
                                                {item.product.name}
                                            </h4>
                                            <p className="text-xs text-stone-500 mt-1 font-light">
                                                {item.quantity} x {formatPrice(item.product.price)}
                                            </p>
                                            <p className="text-[11px] text-stone-400 font-light">
                                                Talla {item.selectedSize} • {item.selectedColor}
                                            </p>
                                        </div>
                                        <div className="text-sm font-medium text-[#181716]">
                                            {formatPrice(item.product.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Sección de Cupón de Descuento */}
                            <div className="border-t border-stone-100 pt-4 pb-4">
                                {appliedCoupon ? (
                                    <div className="bg-stone-50 border border-stone-300 p-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-calypso-700" />
                                            <div>
                                                <p className="text-xs font-bold text-stone-900 font-mono">{appliedCoupon.code}</p>
                                                <p className="text-[10px] text-stone-500 font-light">
                                                    Descuento: -{formatPrice(appliedCoupon.discount_amount)}
                                                    {appliedCoupon.affiliate_name ? ` (Embajadora: ${appliedCoupon.affiliate_name})` : ''}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveCoupon}
                                            className="text-stone-400 hover:text-stone-900 p-1 transition-colors"
                                            title="Quitar cupón"
                                        >
                                            <X className="w-4 h-4 stroke-[1.5]" />
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleApplyCoupon} className="space-y-2">
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type="text"
                                                    placeholder="CÓDIGO DE DESCUENTO"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 text-xs text-stone-900 uppercase tracking-wider placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={validatingCoupon || !couponCode.trim()}
                                                className="px-4 py-2 bg-[#181716] hover:bg-stone-800 text-white text-[10px] uppercase tracking-wider font-semibold transition-colors disabled:opacity-50 flex items-center gap-1"
                                            >
                                                {validatingCoupon ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Aplicar'}
                                            </button>
                                        </div>
                                        {couponError && (
                                            <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
                                        )}
                                    </form>
                                )}
                            </div>

                            <div className="border-t border-stone-100 pt-4 space-y-3">
                                <div className="flex items-center justify-between text-stone-500 text-xs tracking-wider uppercase font-light">
                                    <span>Subtotal</span>
                                    <span className="text-[#181716] font-normal">{formatPrice(total)}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex items-center justify-between text-calypso-700 text-xs tracking-wider uppercase font-medium">
                                        <span>Descuento ({appliedCoupon.code})</span>
                                        <span>-{formatPrice(discountAmount)}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-stone-500 text-xs tracking-wider uppercase font-light">
                                    <span>Despacho</span>
                                    <span className="text-calypso-700 font-medium">Por Pagar</span>
                                </div>
                                <div className="flex items-center justify-between border-t border-stone-200 pt-4">
                                    <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#181716]">Total Final</span>
                                    <span
                                        className="text-2xl font-serif text-[#181716] font-normal"
                                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                                    >
                                        {formatPrice(finalTotal)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-center gap-2 text-stone-400 text-xs font-light">
                                <CreditCard className="w-4 h-4 stroke-[1.5]" />
                                <span>Pasarela segura procesada por Mercado Pago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
