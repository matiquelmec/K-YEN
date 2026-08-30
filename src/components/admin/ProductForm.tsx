'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { productService } from '@/services/productService';
import { Upload, Save, ArrowLeft, Loader2, CheckCircle2, Image as ImageIcon, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';
import { MultiImageUpload } from '@/components/admin/MultiImageUpload';
import { extractDominantColorsFromImage } from '@/lib/colorExtractor';

const CATEGORIES = [
    { id: 'brisa-calipso', label: 'Brisa & Calipso (Lino y Seda)', color: 'bg-calypso-600' },
    { id: 'solsticio-dorado', label: 'Solsticio Dorado (Gala & Ocasión)', color: 'bg-gold-500' },
    { id: 'rosa-alba', label: 'Rosa de Alba (Couture & Cocktail)', color: 'bg-rose-400' },
    { id: 'gotico', label: 'Luna Nueva (Gótico)', color: 'bg-stone-900' },
    { id: 'primaveral', label: 'Eclipse Floral (Primaveral)', color: 'bg-rose-500' },
    { id: 'veraniego', label: 'Solsticio (Veraniego)', color: 'bg-amber-500' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'];

import { AVAILABLE_COLORS, getColorClass } from '@/lib/product-utils';

const COLORS = AVAILABLE_COLORS;

interface ProductFormProps {
    initialData?: Product;
}

export default function ProductForm({ initialData }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Initialize state with props or defaults
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price?.toString() || '',
        category: initialData?.category || 'brisa-calipso',
        stock: initialData?.stock?.toString() || '10',
        sizes: initialData?.sizes || [] as string[],
        colors: initialData?.colors || [] as string[],
        images: initialData?.images || [] as string[],
        is_new: initialData?.is_new || false,
        is_sale: initialData?.is_sale || false
    });

    const [detectingColors, setDetectingColors] = useState(false);
    const [colorDetectionMsg, setColorDetectionMsg] = useState<string | null>(null);

    const handleAutoDetectColors = (detected: string[]) => {
        if (!detected || detected.length === 0) return;
        setFormData(prev => {
            const combined = Array.from(new Set([...prev.colors, ...detected]));
            return { ...prev, colors: combined };
        });
        setColorDetectionMsg(`✨ Detectados: ${detected.join(', ')}`);
        setTimeout(() => setColorDetectionMsg(null), 4000);
    };

    const triggerManualColorDetection = async () => {
        if (formData.images.length === 0) {
            alert('Sube primero al menos una imagen en la galería para detectar sus colores.');
            return;
        }
        setDetectingColors(true);
        try {
            const firstImg = formData.images[0];
            if (firstImg) {
                const detected = await extractDominantColorsFromImage(firstImg, 3);
                if (detected.length > 0) {
                    handleAutoDetectColors(detected);
                } else {
                    setColorDetectionMsg('No se detectaron colores contrastantes.');
                    setTimeout(() => setColorDetectionMsg(null), 3000);
                }
            }
        } catch (err) {
            console.warn('Error en detección manual:', err);
        } finally {
            setDetectingColors(false);
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
                is_sale: formData.is_sale
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

    const pageTitle = initialData ? 'Editar Vestido' : 'Nueva Pieza de Autor';
    const pageSubtitle = initialData ? 'Perfecciona los detalles y disponibilidad de esta prenda' : 'Incorpora un nuevo diseño a la curaduría de Casa Aira';

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mb-5 text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2
                    className="text-3xl font-serif font-normal text-[#181716] mb-1"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                    ¡Guardado con éxito!
                </h2>
                <p className="text-stone-500 font-light text-xs">Actualizando catálogo de boutique...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-5 mb-8">
                <Link
                    href="/admin/products"
                    className="p-3 bg-white hover:bg-stone-50 text-stone-400 hover:text-stone-800 transition-all border border-stone-200 shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-stone-500 block mb-1">
                        CASA AIRA • CURADURÍA
                    </span>
                    <h1
                        className="font-serif text-3xl md:text-4xl font-normal text-[#181716] tracking-tight"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        {pageTitle}
                    </h1>
                    <p className="text-stone-500 font-light text-xs mt-0.5">
                        {pageSubtitle}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="bg-white p-8 border border-stone-200/80 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 border-b border-stone-100 pb-5">
                        <div className="w-9 h-9 bg-stone-100 text-stone-700 flex items-center justify-center">
                            <ImageIcon className="w-4 h-4" />
                        </div>
                        <h2
                            className="font-serif text-xl font-normal text-[#181716]"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                            Detalles de la Prenda
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-[0.25em] mb-2">Nombre del Vestido</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 bg-stone-50/50 border border-stone-200 text-xs text-stone-900 tracking-wide placeholder:text-stone-400 focus:outline-none focus:border-calypso-600 transition-colors"
                                placeholder="Ej: Vestido Brisa Calipso Seda"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-[0.25em] mb-2">Descripción & Nota de Estilo</label>
                            <textarea
                                required
                                rows={4}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 bg-stone-50/50 border border-stone-200 text-xs text-stone-900 tracking-wide placeholder:text-stone-400 focus:outline-none focus:border-calypso-600 transition-colors resize-none leading-relaxed"
                                placeholder="Describe el corte, la textura, caída de la tela y ocasión recomendada..."
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-[0.25em] mb-2">Inversión (CLP)</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-semibold text-xs">$</span>
                                <input
                                    type="text"
                                    required
                                    value={formData.price}
                                    onChange={e => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        setFormData({ ...formData, price: val ? parseInt(val).toLocaleString('es-CL') : '' });
                                    }}
                                    className="w-full pl-8 pr-4 py-3 bg-stone-50/50 border border-stone-200 text-xs text-stone-900 tracking-wide font-medium focus:outline-none focus:border-calypso-600 transition-colors"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-[0.25em] mb-2">Piezas Disponibles</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.stock}
                                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                className="w-full px-4 py-3 bg-stone-50/50 border border-stone-200 text-xs text-stone-900 tracking-wide font-medium focus:outline-none focus:border-calypso-600 transition-colors"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-[0.25em] mb-2">Capítulo de Colección</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {CATEGORIES.slice(0, 3).map(cat => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, category: cat.id })}
                                        className={`flex flex-col p-4 border transition-all text-left ${formData.category === cat.id
                                            ? 'bg-[#181716] border-[#181716] text-white shadow-md'
                                            : 'bg-white border-stone-200 text-stone-700 hover:border-calypso-600'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 mb-2.5 ${cat.color}`} />
                                        <span className="font-semibold text-xs tracking-tight">{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Media */}
                <div className="bg-white p-8 border border-stone-200/80 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-stone-100 text-stone-700 flex items-center justify-center">
                                <Upload className="w-4 h-4" />
                            </div>
                            <h2
                                className="font-serif text-xl font-normal text-[#181716]"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                            >
                                Galería Visual
                            </h2>
                        </div>
                        <span className="text-[9px] font-semibold text-stone-400 uppercase tracking-[0.25em]">WebP Automático • Calidad Boutique</span>
                    </div>

                    <MultiImageUpload
                        images={formData.images}
                        onChange={(newImages) => setFormData(prev => ({ ...prev, images: newImages }))}
                        onColorsDetected={handleAutoDetectColors}
                        category={formData.category}
                        productName={formData.name}
                        maxImages={8}
                        disabled={loading}
                    />
                </div>

                {/* Variants */}
                <div className="bg-white p-8 border border-stone-200/80 shadow-sm space-y-8">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-stone-100 text-stone-700 flex items-center justify-center">
                                <ImageIcon className="w-4 h-4" />
                            </div>
                            <div>
                                <h2
                                    className="font-serif text-xl font-normal text-[#181716]"
                                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                                >
                                    Tallas Reales & Colores
                                </h2>
                                <p className="text-[11px] text-stone-400 font-light">Configura el tallaje inclusivo (XS a 6XL) y los tonos disponibles</p>
                            </div>
                        </div>

                        {formData.images.length > 0 && (
                            <button
                                type="button"
                                onClick={triggerManualColorDetection}
                                disabled={detectingColors}
                                className="px-3.5 py-2 bg-stone-50 border border-stone-200 text-stone-700 hover:border-calypso-600 hover:text-calypso-700 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {detectingColors ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-calypso-600" />
                                ) : (
                                    <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                                )}
                                <span>{detectingColors ? 'Analizando...' : 'Auto-detectar Colores'}</span>
                            </button>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-[0.25em]">Tallas Seleccionadas ({formData.sizes.length})</label>
                            <div className="flex gap-2 text-[10px] uppercase font-semibold">
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, sizes: ['XS', 'S', 'M', 'L', 'XL'] }))}
                                    className="text-stone-600 hover:text-calypso-700 tracking-wider"
                                >
                                    Estándar (XS-XL)
                                </button>
                                <span className="text-stone-300">•</span>
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, sizes: ['2XL', '3XL', '4XL', '5XL', '6XL'] }))}
                                    className="text-stone-600 hover:text-calypso-700 tracking-wider"
                                >
                                    Plus Size (2XL-6XL)
                                </button>
                                <span className="text-stone-300">•</span>
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, sizes: SIZES }))}
                                    className="text-stone-600 hover:text-calypso-700 tracking-wider"
                                >
                                    Todas
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {SIZES.map(size => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => toggleSize(size)}
                                    className={`w-11 h-11 flex items-center justify-center text-xs font-semibold transition-all active:scale-95 ${formData.sizes.includes(size)
                                        ? 'bg-[#181716] text-white border border-[#181716] shadow-sm'
                                        : 'bg-white text-stone-500 border border-stone-200 hover:border-stone-400'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-[0.25em]">Paleta de Tonos ({formData.colors.length})</label>
                                {colorDetectionMsg && (
                                    <span className="text-[10px] font-medium text-calypso-700 bg-calypso-50 px-2 py-0.5 border border-calypso-200">
                                        {colorDetectionMsg}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] text-stone-400">Clic para activar / desactivar</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {COLORS.map(color => {
                                const isSelected = formData.colors.includes(color);
                                return (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => toggleColor(color)}
                                        className={`px-3.5 py-2 text-xs font-medium transition-all active:scale-95 flex items-center gap-2 border ${isSelected
                                            ? 'bg-[#181716] text-white border-[#181716] shadow-sm'
                                            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                                            }`}
                                    >
                                        <span className={`w-3 h-3 rounded-full border border-black/10 shadow-inner ${getColorClass(color)}`} />
                                        <span>{color}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Options */}
                <div className="bg-white p-6 border border-stone-200/80 shadow-sm">
                    <div className="flex flex-wrap gap-8">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={formData.is_new}
                                onChange={e => setFormData({ ...formData, is_new: e.target.checked })}
                                className="w-4 h-4 text-calypso-600 rounded border-stone-300 focus:ring-calypso-500"
                            />
                            <span className="text-stone-800 text-xs font-semibold uppercase tracking-wider group-hover:text-calypso-700">
                                Nueva Colección
                            </span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={formData.is_sale}
                                onChange={e => setFormData({ ...formData, is_sale: e.target.checked })}
                                className="w-4 h-4 text-gold-600 rounded border-stone-300 focus:ring-gold-500"
                            />
                            <span className="text-stone-800 text-xs font-semibold uppercase tracking-wider group-hover:text-gold-700">
                                Selección Especial / Sale
                            </span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Link
                        href="/admin/products"
                        className="px-6 py-3.5 bg-stone-100 text-stone-700 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-stone-200 transition-all active:scale-95"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#181716] text-white px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-calypso-700 transition-all flex items-center gap-2.5 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-sm"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Guardando pieza...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span>{initialData ? 'Guardar Cambios' : 'Incorporar al Catálogo'}</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
