'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { ArrowLeft, MapPin, Mail, Phone, Package, Calendar, Truck } from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchOrder();
        }
    }, [params.id]);

    const fetchOrder = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('id', params.id)
                .single();

            if (error) throw error;
            setOrder(data);
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        setUpdating(true);
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', params.id);

            if (error) throw error;
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
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/orders"
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="font-display text-2xl font-bold text-gray-900">
                            {order.order_number}
                        </h1>
                        <p className="text-gray-500 text-sm flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.created_at).toLocaleDateString('es-CL', {
                                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Estado:</label>
                    <select
                        value={order.status}
                        onChange={(e) => updateStatus(e.target.value)}
                        disabled={updating}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-sm font-medium focus:ring-2 focus:ring-earth-500 focus:outline-none"
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
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-earth-600" /> Detalle del Pedido
                        </h2>
                        <div className="divide-y divide-gray-100">
                            {items.map((item: any, idx: number) => (
                                <div key={idx} className="py-4 flex gap-4">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md border border-gray-100" />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-100 rounded-md" />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            Talla: {item.size} • Color: {item.color}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">
                                            ${Number(item.price).toLocaleString('es-CL')}
                                        </p>
                                        <p className="text-sm text-gray-500">x{item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
                            <span className="font-semibold text-gray-900">Total Pagado</span>
                            <span className="font-bold text-xl text-earth-700">
                                ${Number(order.total).toLocaleString('es-CL')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Truck className="w-5 h-5 text-earth-600" /> Datos de Envío
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Cliente</span>
                                <p className="font-medium text-gray-900">{address.full_name}</p>
                            </div>
                            <div>
                                <label className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Contacto</label>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Mail className="w-4 h-4" /> {address.email}
                                </div>
                                {address.phone && (
                                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                                        <Phone className="w-4 h-4" /> {address.phone}
                                    </div>
                                )}
                            </div>
                            <div className="pt-2 border-t border-gray-50">
                                <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Dirección</span>
                                <div className="flex items-start gap-2 text-gray-800">
                                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-earth-500" />
                                    <div>
                                        <p>{address.address}</p>
                                        <p>{address.city}, {address.postal_code}</p>
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
