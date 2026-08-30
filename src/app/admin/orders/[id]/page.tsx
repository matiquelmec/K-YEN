'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, MapPin, Mail, Phone, Package, Calendar, Truck } from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailPage() {
    const params = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const fetchOrder = useCallback(async () => {
        try {
            const res = await fetch(`/api/orders/${params.id}`);
            if (!res.ok) throw new Error('Error al cargar la orden');
            const data = await res.json();
            setOrder(data);
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        if (params.id) {
            fetchOrder();
        }
    }, [params.id, fetchOrder]);

    const updateStatus = async (newStatus: string) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/orders/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) throw new Error('Error al actualizar el estado');
            setOrder({ ...order, status: newStatus });
            alert('Estado actualizado correctamente');
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error al actualizar el estado');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-earth-200 border-t-earth-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!order) {
        return <div className="p-8 text-center">Orden no encontrada</div>;
    }

    console.log('Order Data:', order);

    const address = order.shipping_address || {};
    let items = order.items || [];

    // Safety check if items comes as string
    if (typeof items === 'string') {
        try {
            items = JSON.parse(items);
        } catch (e) {
            console.error('Error parsing items:', e);
            items = [];
        }
    }

    if (!Array.isArray(items)) items = [];

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/orders"
                        className="p-2.5 bg-white hover:bg-stone-50 text-stone-500 border border-stone-200 shadow-sm transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-stone-500 block mb-0.5">
                            CASA AIRA • DETALLE DE PEDIDO
                        </span>
                        <h1
                            className="font-serif text-2xl md:text-3xl font-normal text-[#181716] tracking-tight"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                            {order.order_number}
                        </h1>
                        <p className="text-stone-400 text-xs flex items-center gap-1.5 mt-0.5">
                            <Calendar className="w-3.5 h-3.5 text-calypso-600" />
                            {new Date(order.created_at).toLocaleDateString('es-CL', {
                                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-600">Estado:</label>
                    <select
                        value={order.status}
                        onChange={(e) => updateStatus(e.target.value)}
                        disabled={updating}
                        className="border border-stone-200 px-3 py-2 bg-white text-xs font-semibold uppercase tracking-wider focus:border-calypso-600 focus:outline-none"
                    >
                        <option value="pending">Pendiente</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregado</option>
                        <option value="cancelled">Cancelado</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 sm:p-8 border border-stone-200/80 shadow-sm">
                        <h2
                            className="font-serif text-lg font-normal text-[#181716] mb-4 flex items-center gap-2"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                            <Package className="w-4 h-4 text-calypso-600" /> Prendas Seleccionadas
                        </h2>
                        <div className="divide-y divide-stone-100">
                            {items.map((item: any, idx: number) => (
                                <div key={idx} className="py-4 flex gap-4">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-16 h-20 object-cover border border-stone-200" />
                                    ) : (
                                        <div className="w-16 h-20 bg-stone-100 border border-stone-200" />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-medium text-xs text-[#181716]">{item.name}</h3>
                                        <p className="text-[11px] text-stone-500 font-light mt-0.5">
                                            Talla: <span className="font-medium text-stone-800">{item.size}</span> • Tono: <span className="font-medium text-stone-800">{item.color}</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-xs text-[#181716] tabular-nums">
                                            ${Number(item.price).toLocaleString('es-CL')}
                                        </p>
                                        <p className="text-[10px] text-stone-400 font-light">Cant: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-stone-100 mt-4 pt-4 flex justify-between items-center">
                            <span className="text-xs uppercase tracking-wider font-semibold text-stone-600">Total Pagado</span>
                            <span
                                className="font-serif font-normal text-2xl text-[#181716]"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                            >
                                ${Number(order.total).toLocaleString('es-CL')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 sm:p-8 border border-stone-200/80 shadow-sm">
                        <h2
                            className="font-serif text-lg font-normal text-[#181716] mb-4 flex items-center gap-2"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                            <Truck className="w-4 h-4 text-calypso-600" /> Destino & Clienta
                        </h2>
                        <div className="space-y-4 text-xs">
                            <div>
                                <span className="block text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-1">Nombre</span>
                                <p className="font-medium text-[#181716]">{address.full_name}</p>
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-1">Contacto</label>
                                <div className="flex items-center gap-2 text-stone-600">
                                    <Mail className="w-3.5 h-3.5 text-calypso-600" /> {address.email}
                                </div>
                                {address.phone && (
                                    <div className="flex items-center gap-2 text-stone-600 mt-1">
                                        <Phone className="w-3.5 h-3.5 text-calypso-600" /> {address.phone}
                                    </div>
                                )}
                            </div>
                            <div className="pt-3 border-t border-stone-100">
                                <span className="block text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-1">Dirección de Despacho</span>
                                <div className="flex items-start gap-2 text-stone-800">
                                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-calypso-600" />
                                    <div>
                                        <p className="font-medium">{address.address}</p>
                                        <p className="text-stone-500 font-light">{address.city}, {address.postal_code}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
