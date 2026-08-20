'use client';

import { useState, useRef } from 'react';
import { Upload, X, ArrowLeft, ArrowRight, Star, Loader2, Image as ImageIcon } from 'lucide-react';
import { compressImage } from '@/lib/imageUtils';
import { productService } from '@/services/productService';

interface MultiImageUploadProps {
    images: string[];
    onChange: (_images: string[]) => void;
    category?: string;
    productName?: string;
    maxImages?: number;
    disabled?: boolean;
}

export function MultiImageUpload({
    images,
    onChange,
    category = 'gotico',
    productName = 'vestido',
    maxImages = 8,
    disabled = false
}: MultiImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const remainingSlots = maxImages - images.length;
        if (remainingSlots <= 0) {
            alert(`Has alcanzado el límite máximo de ${maxImages} imágenes.`);
            return;
        }

        const filesToUpload = Array.from(files).slice(0, remainingSlots);
        setUploading(true);
        setUploadProgress({ current: 0, total: filesToUpload.length });

        const newUploadedUrls: string[] = [];

        try {
            for (let i = 0; i < filesToUpload.length; i++) {
                const file = filesToUpload[i];
                if (!file) continue;
                setUploadProgress({ current: i + 1, total: filesToUpload.length });

                // 1. Pre-compresión en el cliente
                let fileToUpload: Blob = file;
                try {
                    fileToUpload = await compressImage(file);
                } catch (compressErr) {
                    console.warn('Compresión omitida para:', file.name, compressErr);
                }

                // 2. Nombre SEO
                const slugName = productName
                    ? productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                    : 'vestido';
                const seoFileName = `${slugName}-${Date.now().toString().slice(-4)}-${i + 1}`;

                // 3. Subida a Cloudinary
                const publicUrl = await productService.uploadProductImage(fileToUpload, seoFileName, category);
                newUploadedUrls.push(publicUrl);
            }

            onChange([...images, ...newUploadedUrls]);
        } catch (error: any) {
            console.error('Error al subir lote de imágenes:', error);
            alert('Error al subir algunas imágenes: ' + (error.message || 'Error desconocido'));
        } finally {
            setUploading(false);
            setUploadProgress({ current: 0, total: 0 });
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveImage = (index: number) => {
        onChange(images.filter((_, i) => i !== index));
    };

    const handleMove = (index: number, direction: 'left' | 'right') => {
        const newIndex = direction === 'left' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= images.length) return;

        const currentItem = images[index];
        const targetItem = images[newIndex];
        if (!currentItem || !targetItem) return;

        const updated = [...images];
        updated[index] = targetItem;
        updated[newIndex] = currentItem;
        onChange(updated);
    };

    const handleSetCover = (index: number) => {
        if (index === 0) return;
        const currentItem = images[index];
        if (!currentItem) return;

        const updated = images.filter((_, i) => i !== index);
        updated.unshift(currentItem);
        onChange(updated);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-sm font-bold text-gray-700">Fotos del Producto ({images.length}/{maxImages})</span>
                    <p className="text-xs text-gray-400">La primera imagen será la portada principal del vestido.</p>
                </div>
                {images.length < maxImages && (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled || uploading}
                        className="px-4 py-2 bg-earth-800 text-white rounded-xl text-xs font-bold hover:bg-earth-900 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Subiendo ({uploadProgress.current}/{uploadProgress.total})...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                Subir Imágenes
                            </>
                        )}
                    </button>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                multiple
                className="hidden"
                disabled={disabled || uploading}
            />

            {/* Grid de imágenes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((url, idx) => (
                    <div
                        key={idx}
                        className={`relative aspect-[3/4] rounded-2xl overflow-hidden group ring-2 transition-all shadow-sm ${
                            idx === 0 ? 'ring-earth-600 shadow-md' : 'ring-gray-100 hover:ring-earth-300'
                        }`}
                    >
                        <img
                            src={url}
                            alt={`Foto ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Badge de Portada */}
                        {idx === 0 && (
                            <div className="absolute top-2 left-2 bg-earth-800/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                Portada
                            </div>
                        )}

                        {/* Overlay con controles */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 backdrop-blur-[2px]">
                            <div className="flex justify-between items-center">
                                {idx !== 0 ? (
                                    <button
                                        type="button"
                                        onClick={() => handleSetCover(idx)}
                                        className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-md transition-colors"
                                        title="Establecer como portada"
                                    >
                                        <Star className="w-3 h-3" /> Portada
                                    </button>
                                ) : <div />}

                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(idx)}
                                    className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-md ml-auto"
                                    title="Eliminar foto"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex justify-between items-center gap-2">
                                <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => handleMove(idx, 'left')}
                                    className="p-1.5 bg-white/90 hover:bg-white text-gray-800 rounded-lg disabled:opacity-30 transition-colors shadow-md"
                                    title="Mover a la izquierda"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-[10px] font-bold text-white/80">#{idx + 1}</span>
                                <button
                                    type="button"
                                    disabled={idx === images.length - 1}
                                    onClick={() => handleMove(idx, 'right')}
                                    className="p-1.5 bg-white/90 hover:bg-white text-gray-800 rounded-lg disabled:opacity-30 transition-colors shadow-md"
                                    title="Mover a la derecha"
                                >
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Botón para añadir si está vacío o quedan slots */}
                {images.length < maxImages && (
                    <div
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        className={`aspect-[3/4] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-earth-500 hover:bg-earth-50/40 transition-all group ${
                            uploading ? 'pointer-events-none opacity-60' : ''
                        }`}
                    >
                        {uploading ? (
                            <div className="flex flex-col items-center gap-2 text-center p-4">
                                <Loader2 className="w-8 h-8 text-earth-600 animate-spin" />
                                <span className="text-xs font-bold text-earth-700">Subiendo fotos...</span>
                                <span className="text-[10px] text-gray-400">({uploadProgress.current} de {uploadProgress.total})</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-center p-4">
                                <div className="w-10 h-10 bg-earth-50 rounded-xl flex items-center justify-center text-earth-600 group-hover:bg-earth-100 transition-colors mb-2">
                                    <ImageIcon className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold text-gray-700 group-hover:text-earth-800">Añadir Fotos</span>
                                <span className="text-[10px] text-gray-400 mt-1">Selecciona 1 o varias</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
