'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, Eye, Filter, ArrowUpDown, ChevronRight, Package } from 'lucide-react';
import { productService } from '@/services/productService';
import { Product } from '@/types';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await productService.getProducts();
            setProducts(data);
        } catch (err: any) {
            console.error('Error fetching products:', err);
            setError('No se pudieron cargar los productos.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDelete = async (id: string | number) => {
        if (!confirm('¿Estás segura de que quieres eliminar este vestido? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            await productService.deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
        } catch (err: any) {
            console.error('Error removing product:', err);
            alert('Error al eliminar el producto');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Métricas Financieras y de Inventario (Estándar JoyasJP)
    const totalInventoryValue = products.reduce((acc, p) => acc + (Number(p.price) * (Number(p.stock) || 0)), 0);
    const lowStockCount = products.filter(p => Number(p.stock) > 0 && Number(p.stock) <= 3).length;
    const outOfStockCount = products.filter(p => Number(p.stock) <= 0).length;

    const formatCLP = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
                <div className="w-12 h-12 border-4 border-earth-100 border-t-earth-600 rounded-full animate-spin" />
                <p className="text-earth-600 font-medium animate-pulse">Cargando catálogo...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {error && (
                <div className="p-4 bg-rose-50 text-rose-700 border border-rose-200 text-xs">
                    {error}
                </div>
            )}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-stone-500 block mb-1">
                        CASA AIRA • CATÁLOGO
                    </span>
                    <h1
                        className="font-serif text-3xl md:text-4xl font-normal text-[#181716] tracking-tight"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        Catálogo de Selección
                    </h1>
                    <p className="text-stone-500 font-light text-sm mt-1">
                        Gestión total de vestidos, disponibilidad y tallaje (XS a 6XL) en tiempo real.
                    </p>
                </div>

                <Link
                    href="/admin/products/new"
                    className="bg-[#181716] text-white px-6 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-calypso-700 transition-all flex items-center gap-2 shadow-sm group"
                >
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    <span>Añadir Vestido</span>
                </Link>
            </div>

            {/* KPI Cards de Inventario */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 border border-stone-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.25em]">Total Modelos</p>
                        <h3 className="text-2xl font-serif font-normal text-[#181716] mt-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            {products.length}
                        </h3>
                    </div>
                    <div className="w-10 h-10 bg-stone-100 text-stone-700 flex items-center justify-center">
                        <Package className="w-5 h-5 stroke-[1.5]" />
                    </div>
                </div>

                <div className="bg-white p-6 border border-stone-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.25em]">Valor Inventario</p>
                        <h3 className="text-2xl font-serif font-normal text-emerald-700 mt-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            {formatCLP(totalInventoryValue)}
                        </h3>
                    </div>
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base">
                        $
                    </div>
                </div>

                <div className="bg-white p-6 border border-stone-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.25em]">Stock Bajo (≤3)</p>
                        <h3 className="text-2xl font-serif font-normal text-amber-700 mt-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            {lowStockCount}
                        </h3>
                    </div>
                    <div className="w-10 h-10 bg-amber-50 text-amber-700 flex items-center justify-center text-xs font-bold">
                        ⚠️
                    </div>
                </div>

                <div className="bg-white p-6 border border-stone-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.25em]">Agotados</p>
                        <h3 className="text-2xl font-serif font-normal text-rose-700 mt-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            {outOfStockCount}
                        </h3>
                    </div>
                    <div className="w-10 h-10 bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs">
                        ✕
                    </div>
                </div>
            </div>

            <div className="bg-white border border-stone-200/80 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-5 sm:p-6 border-b border-stone-100 flex flex-col md:flex-row gap-4 bg-stone-50/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                        <input
                            type="text"
                            name="search"
                            autoComplete="off"
                            placeholder="Buscar por nombre del vestido..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-stone-200 text-xs text-stone-900 tracking-wide placeholder:text-stone-400 focus:outline-none focus:border-calypso-600 transition-colors"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 text-xs font-semibold uppercase tracking-wider text-stone-700 hover:border-calypso-600 hover:text-calypso-700 transition-all shadow-sm">
                            <Filter className="w-3.5 h-3.5" />
                            Filtros
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 text-xs font-semibold uppercase tracking-wider text-stone-700 hover:border-calypso-600 hover:text-calypso-700 transition-all shadow-sm">
                            <ArrowUpDown className="w-3.5 h-3.5" />
                            Ordenar
                        </button>
                    </div>
                </div>

                {/* Table */}
                {filteredProducts.length === 0 ? (
                    <div className="p-16 text-center text-stone-400">
                        <div className="bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 opacity-30" />
                        </div>
                        <h3 className="text-lg font-serif font-normal text-[#181716] mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            No se encontraron productos
                        </h3>
                        <p className="text-xs font-light max-w-xs mx-auto text-stone-500">
                            {searchTerm ? 'Prueba con otros términos de búsqueda.' : 'Tu catálogo está listo para recibir prendas de autor.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-stone-50 text-stone-500 text-[10px] font-semibold uppercase tracking-[0.25em] border-b border-stone-100">
                                <tr>
                                    <th className="px-6 py-3.5">Vestido</th>
                                    <th className="px-6 py-3.5">Capítulo</th>
                                    <th className="px-6 py-3.5">Precio</th>
                                    <th className="px-6 py-3.5">Disponibilidad</th>
                                    <th className="px-6 py-3.5 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="group hover:bg-stone-50/60 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3.5">
                                                <div className="relative w-12 h-16 flex-shrink-0 bg-stone-100 border border-stone-200 overflow-hidden">
                                                    {product.images?.[0] ? (
                                                        <img
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                                                            <Eye className="w-4 h-4 opacity-40" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-medium text-[#181716] block group-hover:text-calypso-700 transition-colors">
                                                        {product.name}
                                                    </span>
                                                    <span className="text-[10px] text-stone-400 font-mono">
                                                        SKU: CA-{product.id?.toString().padStart(4, '0')}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200 uppercase tracking-wider">
                                                {product.category || 'Curaduría'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-[#181716] tabular-nums">
                                                ${product.price.toLocaleString('es-CL')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`text-[11px] font-medium ${product.stock > 0 ? 'text-stone-700' : 'text-rose-600 font-semibold'}`}>
                                                    {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/admin/products/${product.id}`}
                                                    className="p-2 text-stone-400 hover:text-calypso-700 hover:bg-calypso-50 transition-all"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id!)}
                                                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                                <Link
                                                    href={`/admin/products/${product.id}`}
                                                    className="p-2 text-stone-400 hover:text-stone-800 transition-all"
                                                >
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                </Link>
                                            </div>
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
