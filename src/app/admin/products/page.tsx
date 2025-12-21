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

    const handleDelete = async (id: number) => {
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                        Catálogo de Vestidos
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">
                        Gestiona y actualiza la colección de KÜYEN.
                    </p>
                </div>

                <Link
                    href="/admin/products/new"
                    className="bg-earth-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-earth-900 transition-all flex items-center gap-2 shadow-lg shadow-earth-900/20 active:scale-95 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Nuevo Vestido
                </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden shadow-xl shadow-earth-900/5">
                {/* Toolbar */}
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4 bg-gray-50/30">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre del vestido..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-earth-500/20 focus:border-earth-500 bg-white shadow-inner transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:border-earth-500 hover:text-earth-700 transition-all shadow-sm">
                            <Filter className="w-4 h-4" />
                            Filtros
                        </button>
                        <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:border-earth-500 hover:text-earth-700 transition-all shadow-sm">
                            <ArrowUpDown className="w-4 h-4" />
                            Ordenar
                        </button>
                    </div>
                </div>

                {/* Table */}
                {filteredProducts.length === 0 ? (
                    <div className="p-20 text-center text-gray-400">
                        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-10 opacity-20" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron productos</h3>
                        <p className="font-medium max-w-xs mx-auto">
                            {searchTerm ? 'Prueba con otros términos de búsqueda.' : 'Tu catálogo está vacío. Comienza añadiendo una pieza única.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-widest border-b border-gray-50">
                                <tr>
                                    <th className="px-8 py-4">Vestido</th>
                                    <th className="px-8 py-4">Colección</th>
                                    <th className="px-8 py-4">Precio</th>
                                    <th className="px-8 py-4">Disponibilidad</th>
                                    <th className="px-8 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-14 h-20 flex-shrink-0">
                                                    {product.images?.[0] ? (
                                                        <img
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover rounded-xl shadow-sm group-hover:shadow-md transition-shadow"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-earth-50 rounded-xl flex items-center justify-center text-earth-300">
                                                            <Eye className="w-6 h-6 opacity-30" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-gray-900 block group-hover:text-earth-800 transition-colors">{product.name}</span>
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">SKU: KY-{product.id?.toString().padStart(4, '0')}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-earth-50 text-earth-800 border border-earth-100 uppercase tracking-widest">
                                                {product.category || 'Sin categoría'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-bold text-gray-900 tabular-nums">
                                                ${product.price.toLocaleString('es-CL')}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1.5">
                                                <div className={`h-2 w-24 bg-gray-100 rounded-full overflow-hidden`}>
                                                    <div
                                                        className={`h-full rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                        style={{ width: `${Math.min((product.stock / 20) * 100, 100)}%` }}
                                                    />
                                                </div>
                                                <span className={`text-[10px] font-bold uppercase tracking-tight ${product.stock > 0 ? 'text-gray-500' : 'text-red-500'}`}>
                                                    {product.stock > 0 ? `${product.stock} unidades` : 'Agotado'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <Link
                                                    href={`/admin/products/${product.id}`}
                                                    className="p-2.5 text-gray-400 hover:text-earth-700 hover:bg-earth-50 rounded-xl transition-all"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id!)}
                                                    className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <div className="w-px h-4 bg-gray-200 mx-1" />
                                                <Link
                                                    href={`/admin/products/${product.id}`}
                                                    className="p-2.5 text-gray-400 hover:text-earth-700 rounded-xl transition-all"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
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
