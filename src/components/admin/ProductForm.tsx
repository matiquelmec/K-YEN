'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Upload, X, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';
import { compressImage } from '@/lib/imageUtils';

const CATEGORIES = [
    { id: 'gotico', label: 'Luna Nueva (Gótico)' },
    { id: 'primaveral', label: 'Eclipse Floral (Primaveral)' },
    { id: 'veraniego', label: 'Solsticio (Veraniego)' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'];

const COLORS = [
    'Negro', 'Borgoña', 'Azul Medianoche', 'Rosa Suave', 'Verde Menta',
    'Lavanda', 'Dorado', 'Coral', 'Turquesa', 'Tierra', 'Cobre', 'Óxido',
    'Azul Océano', 'Verde Agua', 'Blanco Espuma', 'Verde Bosque', 'Rosa Salvaje', 'Violeta'
];

interface ProductFormProps {
    initialData?: Product;
}

export default function ProductForm({ initialData }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Initialize state with props or defaults
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price?.toString() || '',
        category: initialData?.category || 'gotico',
        stock: initialData?.stock?.toString() || '10',
        sizes: initialData?.sizes || [] as string[],
        colors: initialData?.colors || [] as string[],
        images: initialData?.images || [] as string[],
        is_new: initialData?.is_new || false,
        is_sale: initialData?.is_sale || false
    });



    // ... (existing imports)

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        try {
            // Compress Image
            const compressedBlob = await compressImage(file);

            // Generate Path with .webp extension
            const fileName = `${Math.random().toString(36).substring(2)}.webp`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, compressedBlob, {
                    contentType: 'image/webp'
                });

            if (uploadError) throw uploadError;

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, data.publicUrl]
            }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error al subir la imagen');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const cleanPrice = formData.price.toString().replace(/[.,]/g, '');

            const payload = {
                name: formData.name,
                description: formData.description,
                price: parseInt(cleanPrice) || 0,
                category: formData.category,
                stock: parseInt(formData.stock),
                sizes: formData.sizes,
                colors: formData.colors,
                images: formData.images,
                is_new: formData.is_new,
                is_sale: formData.is_sale,
                // Preserve existing rating/reviews if editing, else default
                rating: initialData?.rating || 5,
                reviews_count: initialData?.reviews_count || 0
            };

            let error;

            if (initialData?.id) {
                // UPDATE
                const { error: updateError } = await supabase
                    .from('products')
                    .update(payload)
                    .eq('id', initialData.id);
                error = updateError;
            } else {
                // INSERT
                const { error: insertError } = await supabase
                    .from('products')
                    .insert(payload);
                error = insertError;
            }

            if (error) throw error;

            router.push('/admin/products');
            router.refresh();
        } catch (error: any) {
            console.error('Error saving product:', error);
            alert('Error al guardar el producto: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleSize = (size: string) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    const toggleColor = (color: string) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.includes(color)
                ? prev.colors.filter(c => c !== color)
                : [...prev.colors, color]
        }));
    };

    const pageTitle = initialData ? 'Editar Producto' : 'Nuevo Producto';
    const pageSubtitle = initialData ? 'Modifica los detalles del vestido' : 'Añade un nuevo vestido al catálogo';

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/products"
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900">
                        {pageTitle}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        {pageSubtitle}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                    <h2 className="font-semibold text-lg text-gray-900 border-b border-gray-100 pb-3">
                        Información Básica
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-earth-500 focus:outline-none"
                                placeholder="Ej: Vestido Medianoche Velvet"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                            <textarea
                                required
                                rows={4}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-earth-500 focus:outline-none"
                                placeholder="Describe los detalles, tela y sensación del vestido..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Precio (CLP)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-earth-500 focus:outline-none"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.stock}
                                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-earth-500 focus:outline-none"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-earth-500 focus:outline-none bg-white"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Media */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                    <h2 className="font-semibold text-lg text-gray-900 border-b border-gray-100 pb-3">
                        Imágenes
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images.map((url, idx) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-gray-200">
                                <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-earth-500 hover:bg-earth-50 transition-colors">
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                            />
                            {uploading ? (
                                <div className="w-6 h-6 border-2 border-earth-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500 font-medium">Subir foto</span>
                                </>
                            )}
                        </label>
                    </div>
                </div>

                {/* Variants */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                    <h2 className="font-semibold text-lg text-gray-900 border-b border-gray-100 pb-3">
                        Variantes
                    </h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Tallas Disponibles</label>
                        <div className="flex flex-wrap gap-2">
                            {SIZES.map(size => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => toggleSize(size)}
                                    className={`px-3 py-1.5 text-sm rounded-md border transition-all ${formData.sizes.includes(size)
                                        ? 'bg-earth-800 text-white border-earth-800'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Colores Disponibles</label>
                        <div className="flex flex-wrap gap-2">
                            {COLORS.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => toggleColor(color)}
                                    className={`px-3 py-1.5 text-sm rounded-md border transition-all ${formData.colors.includes(color)
                                        ? 'bg-earth-100 text-earth-800 border-earth-300 font-medium'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Options */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex gap-8">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.is_new}
                                onChange={e => setFormData({ ...formData, is_new: e.target.checked })}
                                className="w-5 h-5 text-earth-600 rounded focus:ring-earth-500"
                            />
                            <span className="text-gray-700 font-medium">Marcar como "Nuevo"</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.is_sale}
                                onChange={e => setFormData({ ...formData, is_sale: e.target.checked })}
                                className="w-5 h-5 text-earth-600 rounded focus:ring-earth-500"
                            />
                            <span className="text-gray-700 font-medium">Marcar en "Oferta"</span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-earth-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-earth-900 transition-colors shadow-lg shadow-earth-900/10 flex items-center gap-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                {initialData ? 'Actualizar Producto' : 'Guardar Producto'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
