'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { DollarSign, ShoppingBag, Package, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        recentOrders: [] as any[]
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // 1. Fetch Orders 
            // We use select('*') to be safe with column names, or specify known ones if confident.
            const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (ordersError) throw new Error(`Error cargando pedidos: ${ordersError.message}`);

            // 2. Fetch Products Count
            const { count: productsCount, error: productsError } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true });

            if (productsError) throw new Error(`Error cargando productos: ${productsError.message}`);

            // Calculate Stats
            // Ensure 'total' or 'total_amount' is used correctly. Based on previous schema checks, it is 'total'.
            const totalRevenue = orders?.reduce((sum, order) => {
                // Try 'total' first, then 'total_amount' if 'total' is missing/null, just to be safe.
                const val = order.total !== undefined ? order.total : order.total_amount;
                return sum + (Number(val) || 0);
            }, 0) || 0;

            const recentOrders = orders?.slice(0, 5) || [];

            setStats({
                totalRevenue,
                totalOrders: orders?.length || 0,
                totalProducts: productsCount || 0,
                recentOrders
            });

        } catch (err: any) {
            console.error('Error fetching dashboard data:', err);
            setError(err.message || 'Error desconocido al cargar datos.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-earth-200 border-t-earth-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-200 flex flex-col items-start gap-4">
                <div className="flex items-center gap-2">
                    <AlertCircle className="w-6 h-6" />
                    <h3 className="font-bold">Error cargando el resumen</h3>
                </div>
                <p className="font-mono text-sm bg-red-100 p-2 rounded w-full">{error}</p>
                <button
                    onClick={fetchDashboardData}
                    className="px-4 py-2 bg-white border border-red-200 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900">
                    Resumen
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Estado general de tu tienda
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Revenue */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Ventas Totales</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-2">
                            ${stats.totalRevenue.toLocaleString('es-CL')}
                        </h3>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                        <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                </div>

                {/* Orders */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Pedidos Totales</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-2">
                            {stats.totalOrders}
                        </h3>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <ShoppingBag className="w-6 h-6 text-blue-600" />
                    </div>
                </div>

                {/* Products */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Productos Activos</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-2">
                            {stats.totalProducts}
                        </h3>
                    </div>
                    <div className="p-3 bg-earth-50 rounded-lg">
                        <Package className="w-6 h-6 text-earth-600" />
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Últimos Pedidos</h2>
                    <Link href="/admin/orders" className="text-sm text-earth-600 hover:text-earth-700 font-medium">
                        Ver todos
                    </Link>
                </div>

                {stats.recentOrders.length === 0 ? (
                    <p className="p-6 text-gray-500 text-sm">No hay pedidos recientes.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3">Orden</th>
                                    <th className="px-6 py-3">Cliente</th>
                                    <th className="px-6 py-3">Estado</th>
                                    <th className="px-6 py-3 text-right">Monto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats.recentOrders.map((order) => {
                                    const total = order.total !== undefined ? order.total : order.total_amount;
                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4 font-mono text-xs text-earth-700">
                                                {order.order_number || order.id?.toString().slice(0, 8)}
                                            </td>
                                            <td className="px-6 py-4 text-gray-900">
                                                {order.shipping_address?.full_name || order.customer_details?.name || 'Cliente'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize
                            ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {order.status || order.shipping_status || 'pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-gray-900">
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
