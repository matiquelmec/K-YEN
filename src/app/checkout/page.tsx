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
        <div className="min-h-screen bg-gradient-to-br from-earth-900 via-gothic-900 to-earth-950">
            <Header />

            <div className="container mx-auto px-4 py-12 pt-28">
                <Link href="/catalogo" className="inline-flex items-center gap-2 text-bone-400 hover:text-bone-200 mb-8 transition-colors text-sm">
                    <ChevronLeft className="w-4 h-4" />
                    Continuar comprando
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Address Form */}
                    <div className="lg:col-span-7">
                        <AddressForm onSubmit={handleCheckout} />

                        {/* Shipping Note */}
                        <div className="mt-8 bg-earth-800/40 border border-white/5 rounded-2xl p-6">
                            <div className="flex items-start gap-4">
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
                            className="w-full py-4 bg-gradient-to-r from-sensual-600 to-sensual-700 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-sensual-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-8"
                        >
                            {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
                        </button>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5">
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

                            {/* Sección de Cupón de Descuento */}
                            <div className="border-t border-white/10 pt-4 pb-4">
                                {appliedCoupon ? (
                                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-emerald-400" />
                                            <div>
                                                <p className="text-xs font-bold text-emerald-300 font-mono">{appliedCoupon.code}</p>
                                                <p className="text-[10px] text-emerald-400/80">
                                                    Descuento aplicado: -{formatPrice(appliedCoupon.discount_amount)}
                                                    {appliedCoupon.affiliate_name ? ` (Embajadora: ${appliedCoupon.affiliate_name})` : ''}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveCoupon}
                                            className="text-bone-400 hover:text-red-400 p-1 transition-colors"
                                            title="Quitar cupón"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleApplyCoupon} className="space-y-2">
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Tag className="w-4 h-4 text-bone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type="text"
                                                    placeholder="Código de descuento"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                    className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-bone-100 uppercase font-mono placeholder:text-bone-400 focus:outline-none focus:border-terra-400 transition-colors"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={validatingCoupon || !couponCode.trim()}
                                                className="px-4 py-2 bg-terra-500 hover:bg-terra-600 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1"
                                            >
                                                {validatingCoupon ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Aplicar'}
                                            </button>
                                        </div>
                                        {couponError && (
                                            <p className="text-[11px] text-red-400 font-medium">{couponError}</p>
                                        )}
                                    </form>
                                )}
                            </div>

                            <div className="border-t border-white/10 pt-4 space-y-3">
                                <div className="flex items-center justify-between text-bone-300 text-sm">
                                    <span>Subtotal</span>
                                    <span className="text-bone-100">{formatPrice(total)}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex items-center justify-between text-emerald-400 text-sm font-medium">
                                        <span>Descuento ({appliedCoupon.code})</span>
                                        <span>-{formatPrice(discountAmount)}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-bone-300 text-sm">
                                    <span>Envío</span>
                                    <span className="text-spring-400 font-medium">Por Pagar</span>
                                </div>
                                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                    <span className="text-xl font-display font-bold text-bone-100">Total</span>
                                    <span className="text-2xl font-display font-bold text-terra-400">{formatPrice(finalTotal)}</span>
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
