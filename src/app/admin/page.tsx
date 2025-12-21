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
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">
                        Bienvenida de nuevo. Aquí tienes un resumen de KÜYEN.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-400 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                    <Clock className="w-4 h-4" />
                    Actualizado: justo ahora
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Revenue Card */}
                <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-earth-900/5 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-green-100/50 transition-colors" />
                    <div className="flex items-start justify-between relative">
                        <div className="space-y-3">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Ingresos Totales</p>
                            <h3 className="text-3xl font-bold text-gray-900">
                                ${stats.totalRevenue.toLocaleString('es-CL')}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit">
                                <TrendingUp className="w-3 h-3" />
                                +12% este mes
                            </div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                {/* Orders Card */}
                <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-earth-900/5 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-100/50 transition-colors" />
                    <div className="flex items-start justify-between relative">
                        <div className="space-y-3">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Pedidos</p>
                            <h3 className="text-3xl font-bold text-gray-900">
                                {stats.totalOrders}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full w-fit">
                                <ShoppingBag className="w-3 h-3" />
                                Gestionar ahora
                            </div>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <ShoppingBag className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Products Card */}
                <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-earth-900/5 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-earth-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-earth-100/50 transition-colors" />
                    <div className="flex items-start justify-between relative">
                        <div className="space-y-3">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Colección</p>
                            <h3 className="text-3xl font-bold text-gray-900">
                                {stats.totalProducts}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-earth-600 bg-earth-50 px-2 py-1 rounded-full w-fit">
                                <Package className="w-3 h-3" />
                                Productos activos
                            </div>
                        </div>
                        <div className="p-4 bg-earth-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <Package className="w-6 h-6 text-earth-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden shadow-xl shadow-earth-900/5">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Pedidos Recientes</h2>
                        <p className="text-sm text-gray-400 font-medium">Últimos movimientos realizados por tus clientas.</p>
                    </div>
                    <Link
                        href="/admin/orders"
                        className="flex items-center gap-2 text-sm text-earth-600 hover:text-earth-800 font-bold transition-colors group"
                    >
                        Ver mas
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>

                {stats.recentOrders.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 bg-gray-50/30">
                        <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-10" />
                        <p className="font-medium">No se registran pedidos este periodo.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-widest border-b border-gray-50">
                                <tr>
                                    <th className="px-8 py-4">Orden</th>
                                    <th className="px-8 py-4">Cliente</th>
                                    <th className="px-8 py-4">Estado</th>
                                    <th className="px-8 py-4 text-right">Monto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {stats.recentOrders.map((order) => {
                                    const total = order.total !== undefined ? order.total : order.total_amount;
                                    const statusColors: any = {
                                        delivered: 'bg-green-50 text-green-700 border-green-100',
                                        shipped: 'bg-blue-50 text-blue-700 border-blue-100',
                                        pending: 'bg-yellow-50 text-yellow-700 border-yellow-100',
                                        cancelled: 'bg-red-50 text-red-700 border-red-100',
                                    };

                                    return (
                                        <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <span className="font-mono text-xs font-bold text-earth-800 bg-earth-50 px-3 py-1.5 rounded-lg border border-earth-100">
                                                    #{order.order_number?.split('-')[1]?.toUpperCase() || order.id?.toString().slice(0, 5).toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-gray-900">
                                                    {order.shipping_address?.full_name || order.customer_details?.name || 'Invitada KÜYEN'}
                                                </div>
                                                <div className="text-xs text-gray-400 font-medium">Registrada recientemente</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-tighter ${statusColors[order.status] || statusColors.pending}`}>
                                                    {order.status || 'pending'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right font-bold text-gray-900 tabular-nums">
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
