'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { productService } from '@/services/productService';
import { Upload, X, Save, ArrowLeft, Loader2, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';
import { compressImage } from '@/lib/imageUtils';

const CATEGORIES = [
    { id: 'gotico', label: 'Luna Nueva (Gótico)', color: 'bg-gray-900' },
    { id: 'primaveral', label: 'Eclipse Floral (Primaveral)', color: 'bg-rose-500' },
    { id: 'veraniego', label: 'Solsticio (Veraniego)', color: 'bg-amber-500' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'];

import { AVAILABLE_COLORS } from '@/lib/product-utils';

const COLORS = AVAILABLE_COLORS;


interface ProductFormProps {
    initialData?: Product;
}

export default function ProductForm({ initialData }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        try {
            let fileToUpload: File | Blob = file;
            let extension = file.name.split('.').pop() || 'png';

            // Try to compress
            try {
                const compressedBlob = await compressImage(file);
                fileToUpload = compressedBlob;
                extension = 'webp';
            } catch (compressErr) {
                console.warn('Compression failed, using original file:', compressErr);
                // Fallback to original file
            }

            const fileName = `product-${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
            const publicUrl = await productService.uploadProductImage(fileToUpload, fileName);

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, publicUrl]
            }));
        } catch (error: any) {
            console.error('Error uploading image:', error);
            alert('Error al subir la imagen: ' + (error.message || 'Desconocido'));
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const cleanPrice = formData.price.toString().replace(/[.,\s]/g, '');

            const payload: Partial<Product> = {
                name: formData.name,
                description: formData.description,
                price: parseInt(cleanPrice) || 0,
                category: formData.category,
                stock: parseInt(formData.stock) || 0,
                sizes: formData.sizes,
                colors: formData.colors,
                images: formData.images,
                is_new: formData.is_new,
                is_sale: formData.is_sale,
                rating: initialData?.rating || 5,
                reviews_count: initialData?.reviews_count || 0
            };

            if (initialData?.id) {
                await productService.updateProduct(initialData.id, payload);
            } else {
                await productService.createProduct(payload);
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/admin/products');
                router.refresh();
            }, 1500);
        } catch (error: any) {
            console.error('Error saving product:', error);
            alert('Error al guardar el vestido: ' + (error.message || 'Error desconocido'));
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

    const pageTitle = initialData ? 'Editar Vestido' : 'Nueva Creación';
    const pageSubtitle = initialData ? 'Perfecciona los detalles de esta pieza' : 'Comienza una nueva historia en el catálogo';

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">¡Guardado con éxito!</h2>
                <p className="text-gray-500 font-medium">Redirigiendo al catálogo...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-6 mb-10">
                <Link
                    href="/admin/products"
                    className="p-3 bg-white hover:bg-gray-50 rounded-2xl text-gray-400 hover:text-earth-600 transition-all border border-gray-100 shadow-sm active:scale-95"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                        {pageTitle}
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">
                        {pageSubtitle}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8 shadow-xl shadow-earth-900/5">
                    <div className="flex items-center gap-3 border-b border-gray-50 pb-5">
                        <div className="w-10 h-10 bg-earth-50 rounded-xl flex items-center justify-center text-earth-600">
                            <ImageIcon className="w-5 h-5" />
                        </div>
                        <h2 className="font-bold text-xl text-gray-900">
                            Detalles del Vestido
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Nombre Sugerente</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-earth-500/10 focus:border-earth-500 focus:outline-none transition-all font-medium text-gray-900 placeholder:text-gray-300"
                                placeholder="Ej: Vestido Medianoche Velvet"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Descripción e Historia</label>
                            <textarea
                                required
                                rows={4}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-earth-500/10 focus:border-earth-500 focus:outline-none transition-all font-medium text-gray-900 placeholder:text-gray-300 resize-none"
                                placeholder="Describe la caída, la tela y la ocasión ideal para este vestido..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Inversión (CLP)</label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold group-focus-within:text-earth-600 transition-colors">$</span>
                                <input
                                    type="text"
                                    required
                                    value={formData.price}
                                    onChange={e => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        setFormData({ ...formData, price: val ? parseInt(val).toLocaleString('es-CL') : '' });
                                    }}
                                    className="w-full pl-10 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-earth-500/10 focus:border-earth-500 focus:outline-none transition-all font-bold text-gray-900"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Piezas Disponibles</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.stock}
                                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-earth-500/10 focus:border-earth-500 focus:outline-none transition-all font-bold text-gray-900"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Colección de Origen</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, category: cat.id })}
                                        className={`flex flex-col p-4 rounded-2xl border transition-all text-left group ${formData.category === cat.id
                                            ? 'bg-earth-800 border-earth-800 text-white shadow-lg shadow-earth-900/20'
                                            : 'bg-white border-gray-100 text-gray-600 hover:border-earth-200'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg mb-3 ${cat.color} ${formData.category === cat.id ? 'opacity-30' : 'opacity-100'}`} />
                                        <span className="font-bold text-sm tracking-tight">{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Media */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8 shadow-xl shadow-earth-900/5">
                    <div className="flex items-center justify-between border-b border-gray-50 pb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-earth-50 rounded-xl flex items-center justify-center text-earth-600">
                                <Upload className="w-5 h-5" />
                            </div>
                            <h2 className="font-bold text-xl text-gray-900">
                                Galería Visual
                            </h2>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recomendado: 1200x1800px</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {formData.images.map((url, idx) => (
                            <div key={idx} className="relative aspect-[3/4] rounded-2xl overflow-hidden group ring-1 ring-gray-100 shadow-sm">
                                <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))}
                                        className="p-3 bg-red-500 text-white rounded-2xl transform scale-75 group-hover:scale-100 transition-all hover:bg-red-600 shadow-xl"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <label className={`aspect-[3/4] border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-earth-500 hover:bg-earth-50/30 transition-all group ${uploading ? 'pointer-events-none' : ''}`}>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                            />
                            {uploading ? (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-10 h-10 border-4 border-earth-100 border-t-earth-600 rounded-full animate-spin" />
                                    <span className="text-[10px] font-bold text-earth-600 uppercase tracking-widest animate-pulse">Subiendo...</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-center px-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-earth-600 group-hover:bg-white transition-all mb-4">
                                        <Upload className="w-6 h-6" />
                                    </div>
                                    <span className="text-sm text-gray-400 group-hover:text-gray-600 font-bold transition-all">Añadir Imagen</span>
                                </div>
                            )}
                        </label>
                    </div>
                </div>

                {/* Variants */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8 shadow-xl shadow-earth-900/5">
                    <div className="flex items-center gap-3 border-b border-gray-50 pb-5">
                        <div className="w-10 h-10 bg-earth-50 rounded-xl flex items-center justify-center text-earth-600">
                            <ImageIcon className="w-5 h-5" />
                        </div>
                        <h2 className="font-bold text-xl text-gray-900">
                            Variantes y Stock
                        </h2>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Tallas Disponibles</label>
                        <div className="flex flex-wrap gap-2">
                            {SIZES.map(size => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => toggleSize(size)}
                                    className={`w-12 h-12 flex items-center justify-center text-xs font-bold rounded-xl border transition-all active:scale-90 ${formData.sizes.includes(size)
                                        ? 'bg-earth-800 text-white border-earth-800 shadow-md shadow-earth-900/20'
                                        : 'bg-white text-gray-400 border-gray-100 hover:border-earth-200 hover:text-earth-700'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Paleta de Colores</label>
                        <div className="flex flex-wrap gap-2">
                            {COLORS.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => toggleColor(color)}
                                    className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl border transition-all active:scale-90 ${formData.colors.includes(color)
                                        ? 'bg-earth-50 text-earth-800 border-earth-200'
                                        : 'bg-white text-gray-400 border-gray-100 hover:border-earth-200 hover:text-earth-700'
                                        }`}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Options */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 shadow-xl shadow-earth-900/5">
                    <div className="flex flex-wrap gap-8">
                        <label className="flex items-center gap-4 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={formData.is_new}
                                    onChange={e => setFormData({ ...formData, is_new: e.target.checked })}
                                    className="peer sr-only"
                                />
                                <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-checked:bg-earth-600 transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-6" />
                            </div>
                            <span className="text-gray-900 font-bold text-sm tracking-tight group-hover:text-earth-800">Nueva Colección</span>
                        </label>

                        <label className="flex items-center gap-4 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={formData.is_sale}
                                    onChange={e => setFormData({ ...formData, is_sale: e.target.checked })}
                                    className="peer sr-only"
                                />
                                <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-checked:bg-amber-500 transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-6" />
                            </div>
                            <span className="text-gray-900 font-bold text-sm tracking-tight group-hover:text-amber-600">Oferta Especial</span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                    <Link
                        href="/admin/products"
                        className="px-8 py-4 bg-white text-gray-400 font-bold rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all active:scale-95"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="bg-earth-800 text-white px-10 py-4 rounded-2xl font-bold hover:bg-earth-900 transition-all shadow-xl shadow-earth-900/20 flex items-center gap-3 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Tejiendo cambios...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                <span>{initialData ? 'Guardar Cambios' : 'Lanzar Vestido'}</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
