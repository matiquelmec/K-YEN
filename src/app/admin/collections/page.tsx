'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Upload,
  Save,
  Check,
  AlertCircle,
  Loader2,
  RefreshCw,
  Eye,
  ArrowRight,
  Sliders,
  ImageIcon,
} from 'lucide-react';
import { compressImage } from '@/lib/imageUtils';
import type { CollectionItem } from '@/lib/db/collections';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>('veraniego');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State for the currently selected collection
  const [formData, setFormData] = useState<{
    title: string;
    subtitle: string;
    tag: string;
    number: string;
    description: string;
    image: string;
    category_id: string;
  }>({
    title: '',
    subtitle: '',
    tag: '',
    number: '01',
    description: '',
    image: '',
    category_id: 'veraniego',
  });

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/collections');
      if (!res.ok) throw new Error('Error al cargar colecciones');
      const data = await res.json();
      if (data.collections && data.collections.length > 0) {
        setCollections(data.collections);
        const active = data.collections.find((c: CollectionItem) => c.id === selectedId) || data.collections[0];
        if (active) {
          setSelectedId(active.id);
          setFormData({
            title: active.title,
            subtitle: active.subtitle,
            tag: active.tag,
            number: active.number,
            description: active.description,
            image: active.image,
            category_id: active.category_id,
          });
        }
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'No se pudieron cargar las colecciones.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleSelectCollection = (id: string) => {
    setSelectedId(id);
    const target = collections.find((c) => c.id === id);
    if (target) {
      setFormData({
        title: target.title,
        subtitle: target.subtitle,
        tag: target.tag,
        number: target.number,
        description: target.description,
        image: target.image,
        category_id: target.category_id,
      });
      setStatusMessage(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadMessage('Optimizando y comprimiendo imagen en tu navegador...');
    setStatusMessage(null);

    try {
      // 1. Compresión inteligente en el cliente (reduce fotos de 10MB a <200KB WebP)
      let fileToUpload: Blob = file;
      try {
        fileToUpload = await compressImage(file);
        setUploadMessage('Subiendo imagen optimizada a Cloudinary...');
      } catch (compErr) {
        console.warn('Compresión omitida, subiendo original:', compErr);
      }

      // 2. Subir imagen procesada a Cloudinary
      const uploadData = new FormData();
      uploadData.append('file', fileToUpload, file.name);
      uploadData.append('collectionId', selectedId);

      const res = await fetch('/api/admin/collections/upload', {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al subir la imagen');
      }

      setFormData((prev) => ({ ...prev, image: data.publicUrl }));
      setStatusMessage({
        type: 'success',
        text: '¡Imagen comprimida y subida con éxito! No olvides presionar "Guardar Cambios".',
      });
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Error al procesar la imagen' });
    } finally {
      setUploading(false);
      setUploadMessage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/collections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedId,
          ...formData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar');
      }

      setStatusMessage({ type: 'success', text: '¡Colección actualizada correctamente! Ya está visible en la portada.' });
      await fetchCollections();
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Error al guardar los cambios.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-stone-500 font-light">
        <Loader2 className="w-10 h-10 text-calypso-700 animate-spin mb-4" />
        <p className="font-serif text-lg text-stone-700">Cargando colecciones de portada...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-calypso-700 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>CASA AIRA • GESTIÓN DE PORTADA</span>
          </div>
          <h1
            className="text-3xl font-serif text-[#181716] font-normal"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Colecciones & Capítulos de Portada
          </h1>
          <p className="text-sm text-stone-500 font-light mt-1 max-w-2xl">
            Edita los 3 bloques principales de la página de inicio. El compresor inteligente optimiza las fotografías tomadas con tu celular a formato ligero antes de guardarlas.
          </p>
        </div>

        <button
          onClick={fetchCollections}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-medium uppercase tracking-wider transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refrescar</span>
        </button>
      </div>

      {/* Selector de Colección (Tabs) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {collections.map((col) => {
          const isSelected = col.id === selectedId;
          return (
            <button
              key={col.id}
              onClick={() => handleSelectCollection(col.id)}
              className={`p-4 text-left border transition-all flex items-center justify-between ${
                isSelected
                  ? 'bg-[#181716] text-[#FAF8F5] border-[#181716] shadow-md'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
              }`}
            >
              <div>
                <span
                  className={`text-[9px] uppercase tracking-[0.25em] font-semibold block mb-1 ${
                    isSelected ? 'text-gold-300' : 'text-calypso-700'
                  }`}
                >
                  COLECCIÓN {col.number}
                </span>
                <h3
                  className="font-serif text-base font-normal"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {col.title}
                </h3>
                <span className={`text-[10px] font-light ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                  {col.tag}
                </span>
              </div>
              <Sliders className={`w-4 h-4 ${isSelected ? 'text-gold-300' : 'text-stone-400'}`} />
            </button>
          );
        })}
      </div>

      {/* Notifications */}
      {statusMessage && (
        <div
          className={`p-4 border text-xs font-light flex items-center gap-3 transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <Check className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-700 flex-shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Form & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Edit Form (7 cols) */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-white border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-400 block mb-1">
              EDITANDO CAPÍTULO
            </span>
            <h2
              className="text-xl font-serif text-[#181716] font-normal"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Colección {formData.number}: {formData.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                Número de Colección *
              </label>
              <input
                type="text"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                required
                className="w-full bg-[#FAF8F5] border border-stone-300 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                placeholder="Ej: 01"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                Etiqueta Superior (Badge) *
              </label>
              <input
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleInputChange}
                required
                className="w-full bg-[#FAF8F5] border border-stone-300 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                placeholder="Ej: Verano & Playa"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                Título Principal (Playfair Display) *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full bg-[#FAF8F5] border border-stone-300 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:border-stone-900 outline-none font-serif text-base"
                placeholder="Ej: Brisa & Calipso"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                Línea / Subtítulo *
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                required
                className="w-full bg-[#FAF8F5] border border-stone-300 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                placeholder="Ej: LÍNEA VERANO & PLAYA"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                Categoría Vinculada del Catálogo *
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full bg-[#FAF8F5] border border-stone-300 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
              >
                <option value="veraniego">Verano & Playa (veraniego)</option>
                <option value="gotico">Fiesta & Gala (gotico)</option>
                <option value="primaveral">Romance & Cóctel (primaveral)</option>
                <option value="all">Todo el Catálogo (all)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                Descripción Editorial *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                required
                className="w-full bg-[#FAF8F5] border border-stone-300 p-4 text-sm text-stone-900 focus:bg-white focus:border-stone-900 outline-none font-light leading-relaxed resize-none"
                placeholder="Describe la tela, caída y calce de esta selección..."
              />
            </div>
          </div>

          {/* Image Upload Zone */}
          <div className="pt-4 border-t border-stone-100 space-y-3">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700">
              Fotografía de Portada
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#FAF8F5] border border-stone-200">
              <div className="relative w-28 h-20 bg-stone-200 overflow-hidden flex-shrink-0 border border-stone-300 shadow-sm">
                {formData.image ? (
                  <Image src={formData.image} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-stone-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleImageFileChange}
                  className="hidden"
                  disabled={uploading}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#181716] text-white hover:bg-stone-800 text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{uploading ? 'Procesando...' : 'Cambiar Fotografía'}</span>
                </button>
                <p className="text-[11px] text-stone-500 font-light mt-1.5">
                  Formatos: JPG, PNG o WebP. Se comprime automáticamente en tu navegador.
                </p>
                {uploadMessage && (
                  <p className="text-[11px] text-calypso-700 font-medium mt-1 animate-pulse">{uploadMessage}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={saving || uploading}
              className="w-full sm:w-auto btn-couture-primary px-8 py-3.5 text-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Guardando en Base de Datos...' : 'Guardar Cambios de Colección'}</span>
            </button>
          </div>
        </form>

        {/* Right: Live Preview in Real Boutique Style (5 cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-28">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-stone-600">
            <Eye className="w-4 h-4 text-calypso-700" />
            <span>Vista Previa en Vivo (Página de Inicio)</span>
          </div>

          <div className="bg-white border border-stone-200 overflow-hidden shadow-md group">
            {/* Cover Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
              {formData.image ? (
                <Image src={formData.image} alt={formData.title} fill className="object-cover object-center" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300">
                  <ImageIcon className="w-12 h-12" />
                </div>
              )}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 border border-stone-200/60 text-[9px] uppercase tracking-[0.25em] font-semibold text-stone-800">
                COLECCIÓN {formData.number || '01'}
              </div>
              <div className="absolute top-4 right-4 bg-[#181716]/80 backdrop-blur-sm px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] font-semibold text-white">
                {formData.tag || 'LÍNEA'}
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-stone-400 block mb-2">
                {formData.subtitle || 'SUBTÍTULO'}
              </span>

              <h3
                className="font-serif text-2xl sm:text-3xl text-[#181716] group-hover:text-calypso-700 transition-colors mb-3 font-normal"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {formData.title || 'Título de Colección'}
              </h3>

              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light line-clamp-3">
                {formData.description || 'Descripción de la colección y telas seleccionadas...'}
              </p>
            </div>

            {/* Bottom Button */}
            <div className="px-8 pb-8 pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-[#181716]">
              <span>Explorar Capítulo</span>
              <ArrowRight className="w-3.5 h-3.5 text-calypso-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
