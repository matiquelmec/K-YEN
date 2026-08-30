'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Eye, Truck, CheckCircle, Clock } from 'lucide-react';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            if (!res.ok) throw new Error('Error al cargar pedidos');
            const data = await res.json();
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const s = status?.toLowerCase() || 'pending';
        if (s === 'delivered' || s === 'entregado') {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3" /> Entregado
                </span>
            );
        } else if (s === 'shipped' || s === 'enviado') {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Truck className="w-3 h-3" /> Enviado
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Clock className="w-3 h-3" /> Pendiente
                </span>
            );
        }
    };

    const getPaymentStatusBadge = (status: string) => {
        const s = status?.toLowerCase() || 'pending';
        if (s === 'approved') {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-tighter">
                    Aprobado
                </span>
            );
        } else if (s === 'rejected' || s === 'cancelled') {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-tighter">
                    Rechazado
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-tighter animate-pulse">
                    Pendiente
                </span>
            );
        }
    };

    const filteredOrders = orders.filter(order =>
        (order.order_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.shipping_address?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-earth-200 border-t-earth-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-stone-500 block mb-1">
                    CASA AIRA • VENTAS
                </span>
                <h1
                    className="font-serif text-3xl md:text-4xl font-normal text-[#181716] tracking-tight"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                    Pedidos de Boutique
                </h1>
                <p className="text-stone-500 font-light text-sm mt-1">
                    Revisa y gestiona los despachos y confirmaciones de pago en tiempo real.
                </p>
            </div>

            <div className="bg-white border border-stone-200/80 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-5 border-b border-stone-100 flex gap-4 bg-stone-50/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                        <input
                            type="text"
                            name="search"
                            autoComplete="off"
                            placeholder="Buscar por Orden # o clienta..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 text-xs text-stone-900 tracking-wide placeholder:text-stone-400 focus:outline-none focus:border-calypso-600 transition-colors"
                        />
                    </div>
                </div>

                {/* Table */}
                {filteredOrders.length === 0 ? (
                    <div className="p-16 text-center text-stone-400">
                        <p className="text-xs font-light">
                            {searchTerm ? 'No se encontraron pedidos con ese criterio.' : 'No hay pedidos registrados aún.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-stone-50 text-stone-500 text-[10px] font-semibold uppercase tracking-[0.25em] border-b border-stone-100">
                                <tr>
                                    <th className="px-6 py-3.5">N° Orden</th>
                                    <th className="px-6 py-3.5">Clienta</th>
                                    <th className="px-6 py-3.5">Fecha</th>
                                    <th className="px-6 py-3.5">Envío</th>
                                    <th className="px-6 py-3.5">Estado Pago</th>
                                    <th className="px-6 py-3.5">Total</th>
                                    <th className="px-6 py-3.5 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                                        <td className="px-6 py-4 font-mono text-[11px] text-stone-800 font-medium">
                                            {order.order_number}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-[#181716]">
                                                {order.shipping_address?.full_name || 'Clienta sin nombre'}
                                            </div>
                                            <div className="text-[11px] text-stone-400 font-light">
                                                {order.shipping_address?.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-stone-500 font-light">
                                            {new Date(order.created_at).toLocaleDateString('es-CL')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getPaymentStatusBadge(order.payment_status)}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-[#181716] tabular-nums">
                                            ${Number(order.total).toLocaleString('es-CL')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="inline-flex items-center gap-1.5 text-xs text-[#181716] hover:text-calypso-700 font-semibold uppercase tracking-wider transition-colors"
                                            >
                                                <span>Detalle</span>
                                                <Eye className="w-3.5 h-3.5" />
                                            </Link>
                                        </td>
                                    </tr>
                                 ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
