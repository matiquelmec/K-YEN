'use client';

import { useEffect, useState } from 'react';
import { adminService, DashboardStats } from '@/services/adminService';
import { DollarSign, ShoppingBag, Package, TrendingUp, AlertCircle, ArrowUpRight, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await adminService.getDashboardStats();
            setStats(data);
        } catch (err: any) {
            console.error('Error fetching dashboard data:', err);
            setError(err.message || 'Error desconocido al cargar datos.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
                <div className="w-12 h-12 border-4 border-earth-100 border-t-earth-600 rounded-full animate-spin" />
                <p className="text-earth-600 font-medium animate-pulse">Cargando tablero...</p>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="p-8 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex flex-col items-center text-center gap-6 max-w-2xl mx-auto mt-12 shadow-sm">
                <div className="p-4 bg-red-100 rounded-full">
                    <AlertCircle className="w-10 h-10" />
                </div>
                <div>
                    <h3 className="font-display text-xl font-bold mb-2">Error al sincronizar datos</h3>
                    <p className="text-red-600/80 mb-4">{error}</p>
                </div>
                <button
                    onClick={fetchDashboardData}
                    className="px-6 py-2.5 bg-white border border-red-200 hover:bg-red-50 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                    Intentar de nuevo
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-stone-500 block mb-1">
                        CASA AIRA • PANEL DE CONTROL
                    </span>
                    <h1
                        className="font-serif text-3xl md:text-4xl text-[#181716] font-normal tracking-tight"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        Panel de Gestión
                    </h1>
                    <p className="text-stone-500 font-light text-sm mt-1">
                        Bienvenida de nuevo. Aquí tienes el resumen en tiempo real de Casa Aira Boutique.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-stone-500 bg-white px-4 py-2 border border-stone-200 shadow-sm">
                    <Clock className="w-3.5 h-3.5 text-calypso-600" />
                    Actualizado: justo ahora
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {/* Revenue Card */}
                <div className="bg-white p-8 border border-stone-200/80 shadow-sm hover:border-stone-400 transition-all duration-300 relative overflow-hidden">
                    <div className="flex items-start justify-between">
                        <div className="space-y-3">
                            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.25em]">Ingresos Totales</p>
                            <h3
                                className="text-3xl font-serif font-normal text-[#181716]"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                            >
                                ${stats.totalRevenue.toLocaleString('es-CL')}
                            </h3>
                            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-200/60 uppercase tracking-wider w-fit">
                                <TrendingUp className="w-3 h-3" />
                                Ventas activas
                            </div>
                        </div>
                        <div className="p-3.5 bg-emerald-50 border border-emerald-200/60 text-emerald-700">
                            <DollarSign className="w-5 h-5 stroke-[1.5]" />
                        </div>
                    </div>
                </div>

                {/* Orders Card */}
                <div className="bg-white p-8 border border-stone-200/80 shadow-sm hover:border-stone-400 transition-all duration-300 relative overflow-hidden">
                    <div className="flex items-start justify-between">
                        <div className="space-y-3">
                            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.25em]">Pedidos Boutique</p>
                            <h3
                                className="text-3xl font-serif font-normal text-[#181716]"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                            >
                                {stats.totalOrders}
                            </h3>
                            <Link href="/admin/orders" className="flex items-center gap-1.5 text-[10px] font-semibold text-calypso-700 bg-calypso-50 px-2.5 py-1 border border-calypso-200/60 uppercase tracking-wider w-fit hover:bg-calypso-100 transition-colors">
                                <ShoppingBag className="w-3 h-3" />
                                Gestionar pedidos
                            </Link>
                        </div>
                        <div className="p-3.5 bg-calypso-50 border border-calypso-200/60 text-calypso-700">
                            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                        </div>
                    </div>
                </div>

                {/* Products Card */}
                <div className="bg-white p-8 border border-stone-200/80 shadow-sm hover:border-stone-400 transition-all duration-300 relative overflow-hidden">
                    <div className="flex items-start justify-between">
                        <div className="space-y-3">
                            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.25em]">Colección Curada</p>
                            <h3
                                className="text-3xl font-serif font-normal text-[#181716]"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                            >
                                {stats.totalProducts}
                            </h3>
                            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gold-700 bg-gold-50 px-2.5 py-1 border border-gold-200/60 uppercase tracking-wider w-fit">
                                <Package className="w-3 h-3" />
                                Prendas en catálogo
                            </div>
                        </div>
                        <div className="p-3.5 bg-gold-50 border border-gold-200/60 text-gold-700">
                            <Package className="w-5 h-5 stroke-[1.5]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white border border-stone-200/80 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-stone-100 flex items-center justify-between">
                    <div>
                        <h2
                            className="text-xl font-serif text-[#181716] font-normal"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                            Pedidos Recientes
                        </h2>
                        <p className="text-xs text-stone-500 font-light mt-0.5">Últimas compras registradas en Casa Aira Boutique.</p>
                    </div>
                    <Link
                        href="/admin/orders"
                        className="flex items-center gap-2 text-xs text-[#181716] hover:text-calypso-700 font-semibold uppercase tracking-wider transition-colors group"
                    >
                        <span>Ver todos</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>

                {stats.recentOrders.length === 0 ? (
                    <div className="p-12 text-center text-stone-400 bg-stone-50/50">
                        <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-20" />
                        <p className="text-xs font-light">No se registran pedidos en este período.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-stone-50 text-stone-500 text-[10px] font-semibold uppercase tracking-[0.25em] border-b border-stone-100">
                                <tr>
                                    <th className="px-6 py-3.5">Orden</th>
                                    <th className="px-6 py-3.5">Clienta</th>
                                    <th className="px-6 py-3.5">Estado</th>
                                    <th className="px-6 py-3.5 text-right">Monto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-xs">
                                {stats.recentOrders.map((order) => {
                                    const total = order.total !== undefined ? order.total : order.total_amount;
                                    const statusColors: any = {
                                        delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                                        shipped: 'bg-blue-50 text-blue-700 border-blue-200',
                                        pending: 'bg-amber-50 text-amber-700 border-amber-200',
                                        cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
                                    };

                                    return (
                                        <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-[11px] text-stone-800 bg-stone-100 px-2.5 py-1 border border-stone-200">
                                                    #{order.order_number?.split('-')[1]?.toUpperCase() || order.id?.toString().slice(0, 5).toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-[#181716]">
                                                    {order.shipping_address?.full_name || order.customer_details?.name || 'Invitada Casa Aira'}
                                                </div>
                                                <div className="text-[11px] text-stone-400 font-light">Compra online</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-semibold border uppercase tracking-wider ${statusColors[order.status] || statusColors.pending}`}>
                                                    {order.status || 'pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-[#181716] tabular-nums">
                                                ${Number(total || 0).toLocaleString('es-CL')}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
