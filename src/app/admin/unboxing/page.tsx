'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Gift,
  Upload,
  Save,
  Check,
  AlertCircle,
  Loader2,
  RefreshCw,
  Eye,
  ImageIcon,
  Sparkles,
  ShieldCheck,
  Package,
  HeartHandshake,
} from 'lucide-react';
import { compressImage } from '@/lib/imageUtils';
import { DEFAULT_UNBOXING, type UnboxingData, type UnboxingFeature } from '@/types/unboxing';

export default function AdminUnboxingPage() {
  const [formData, setFormData] = useState<UnboxingData>(DEFAULT_UNBOXING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'narrative' | 'packaging' | 'features'>('narrative');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchUnboxing = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/unboxing');
      if (!res.ok) throw new Error('Error al cargar datos de unboxing');
      const data = await res.json();
      if (data.unboxing) {
        setFormData(data.unboxing);
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'No se pudo cargar la información de la experiencia de empaque.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnboxing();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index: number, field: keyof UnboxingFeature, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.features];
      const target = updated[index] || {
        id: `feat-${index + 1}`,
        icon: 'sparkles',
        title: '',
        description: '',
        color: 'calypso',
      };
      updated[index] = { ...target, [field]: value };
      return { ...prev, features: updated };
    });
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadMessage('Optimizando y comprimiendo fotografía de packaging...');
    setStatusMessage(null);

    try {
      let fileToUpload: Blob = file;
      try {
        fileToUpload = await compressImage(file);
        setUploadMessage('Subiendo imagen a Cloudinary...');
      } catch (compErr) {
        console.warn('Compresión omitida:', compErr);
      }

      const uploadData = new FormData();
      uploadData.append('file', fileToUpload, file.name);

      const res = await fetch('/api/admin/unboxing/upload', {
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
        text: '¡Fotografía de empaque subida con éxito! Haz clic en "Guardar Cambios" para confirmar.',
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
      const res = await fetch('/api/admin/unboxing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar');
      }

      setStatusMessage({
        type: 'success',
        text: '¡Experiencia de empaque actualizada correctamente en la portada!',
      });
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Error al guardar los cambios.' });
    } finally {
      setSaving(false);
    }
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'sparkles':
        return <Sparkles className="w-4 h-4" />;
      case 'shield':
        return <ShieldCheck className="w-4 h-4" />;
      case 'package':
        return <Package className="w-4 h-4" />;
      case 'heart':
      default:
        return <HeartHandshake className="w-4 h-4" />;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'calypso':
        return 'bg-calypso-50 border-calypso-200/60 text-calypso-700';
      case 'gold':
        return 'bg-gold-50 border-gold-200/60 text-gold-700';
      case 'blush':
        return 'bg-blush-50 border-blush-200/60 text-blush-700';
      case 'stone':
      default:
        return 'bg-stone-100 border-stone-200 text-stone-700';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-stone-500 font-light">
        <Loader2 className="w-10 h-10 text-calypso-700 animate-spin mb-4" />
        <p className="font-serif text-lg text-stone-700">Cargando experiencia de empaque...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-calypso-700 mb-1">
            <Gift className="w-4 h-4" />
            <span>CASA AIRA • EXPERIENCIA DE DESEMPAQUE</span>
          </div>
          <h1
            className="text-3xl font-serif text-[#181716] font-normal"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Experiencia de Empaque & Unboxing
          </h1>
          <p className="text-sm text-stone-500 font-light mt-1 max-w-2xl">
            Personaliza la fotografía del packaging boutique, los textos de emoción de desempaque y los 4 detalles de cuidado del envío.
          </p>
        </div>

        <button
          onClick={fetchUnboxing}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-medium uppercase tracking-wider transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refrescar</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('narrative')}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all ${
            activeTab === 'narrative'
              ? 'border-[#181716] text-[#181716]'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          1. Narrativa & Textos
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('packaging')}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all ${
            activeTab === 'packaging'
              ? 'border-[#181716] text-[#181716]'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          2. Fotografía Packaging
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('features')}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all ${
            activeTab === 'features'
              ? 'border-[#181716] text-[#181716]'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          3. Los 4 Detalles de Envío
        </button>
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

      {/* Main Grid: Form (7 cols) & Live Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-white border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          {activeTab === 'narrative' && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-3">
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-stone-400 block mb-1">
                  NARRATIVA EDITORIAL
                </span>
                <h2
                  className="text-xl font-serif text-[#181716] font-normal"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Mensaje de la Emoción al Recibir el Pedido
                </h2>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                  Etiqueta Superior (Badge) *
                </label>
                <input
                  type="text"
                  name="badge"
                  value={formData.badge}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#FAF8F5] border border-stone-300 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                  placeholder="Ej: UN DETALLE ESPECIAL"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                    Título Primario (Playfair) *
                  </label>
                  <input
                    type="text"
                    name="title_primary"
                    value={formData.title_primary}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#FAF8F5] border border-stone-300 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:border-stone-900 outline-none font-serif"
                    placeholder="Ej: La emoción de recibir"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                    Título Destacado (Cursiva Calipso) *
                  </label>
                  <input
                    type="text"
                    name="title_highlight"
                    value={formData.title_highlight}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#FAF8F5] border border-stone-300 px-4 py-2.5 text-sm text-calypso-700 focus:bg-white focus:border-stone-900 outline-none font-serif italic"
                    placeholder="Ej: tu nuevo vestido."
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                  Descripción / Experiencia del Momento *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                  className="w-full bg-[#FAF8F5] border border-stone-300 p-4 text-sm text-stone-900 focus:bg-white focus:border-stone-900 outline-none font-light leading-relaxed resize-none"
                  placeholder="Describe cómo se prepara cada paquete con cariño y fragancia..."
                />
              </div>
            </div>
          )}

          {activeTab === 'packaging' && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-3">
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-stone-400 block mb-1">
                  FOTOGRAFÍA BOUTIQUE
                </span>
                <h2
                  className="text-xl font-serif text-[#181716] font-normal"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Imagen de Packaging & Cajas Casa Aira
                </h2>
              </div>

              <div className="space-y-3">
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700">
                  Fotografía de Presentación (Aspecto Horizontal 4:3 o 16:11)
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#FAF8F5] border border-stone-200">
                  <div className="relative w-36 h-28 bg-stone-200 overflow-hidden flex-shrink-0 border border-stone-300 shadow-sm">
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
                      <span>{uploading ? 'Procesando...' : 'Cambiar Foto Packaging'}</span>
                    </button>
                    <p className="text-[11px] text-stone-500 font-light mt-1.5">
                      Compresión automática a WebP ultraligero antes de subir a Cloudinary.
                    </p>
                    {uploadMessage && (
                      <p className="text-[11px] text-calypso-700 font-medium mt-1 animate-pulse">{uploadMessage}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                  Etiqueta sobre la Imagen (Badge) *
                </label>
                <input
                  type="text"
                  name="image_badge"
                  value={formData.image_badge}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#FAF8F5] border border-stone-300 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                  placeholder="Ej: EXPERIENCIA BOUTIQUE"
                />
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-3">
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-stone-400 block mb-1">
                  BENEFICIOS & DETALLES
                </span>
                <h2
                  className="text-xl font-serif text-[#181716] font-normal"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Los 4 Pilares del Empaque
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.features.map((feature, idx) => (
                  <div key={idx} className="p-4 bg-[#FAF8F5] border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${getColorClasses(feature.color)}`}>
                        {renderIcon(feature.icon)}
                      </div>

                      {/* Icon selector */}
                      <select
                        value={feature.icon}
                        onChange={(e) => handleFeatureChange(idx, 'icon', e.target.value)}
                        className="bg-white border border-stone-300 px-2 py-1 text-[11px] text-stone-700 outline-none"
                      >
                        <option value="sparkles">Brillo / Fragancia</option>
                        <option value="shield">Escudo / Seguridad</option>
                        <option value="package">Paquete / Bolsa</option>
                        <option value="heart">Corazón / Atención</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">Título</label>
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                        className="w-full bg-white border border-stone-300 px-3 py-1.5 text-xs text-stone-900 outline-none font-semibold uppercase tracking-wider"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">Descripción</label>
                      <input
                        type="text"
                        value={feature.description}
                        onChange={(e) => handleFeatureChange(idx, 'description', e.target.value)}
                        className="w-full bg-white border border-stone-300 px-3 py-1.5 text-xs text-stone-900 outline-none font-light"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="pt-6 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={saving || uploading}
              className="w-full sm:w-auto btn-couture-primary px-8 py-3.5 text-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Guardando...' : 'Guardar Cambios de Empaque'}</span>
            </button>
          </div>
        </form>

        {/* Live Preview Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-28">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-stone-600">
            <Eye className="w-4 h-4 text-calypso-700" />
            <span>Vista Previa en Vivo (Portada)</span>
          </div>

          <div className="bg-[#FAF8F5] border border-stone-200/80 p-6 space-y-6 shadow-sm">
            {/* Packaging Image Preview */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 border border-stone-200 shadow-sm">
              {formData.image ? (
                <Image src={formData.image} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[8px] uppercase tracking-[0.2em] font-semibold text-stone-800 border border-stone-200/70 shadow-sm">
                {formData.image_badge}
              </div>
            </div>

            {/* Narrative Preview */}
            <div className="space-y-3">
              <span className="text-[9px] tracking-[0.3em] uppercase font-semibold text-calypso-700 bg-calypso-50 px-2.5 py-0.5 border border-calypso-200/60 inline-block">
                {formData.badge}
              </span>

              <h2
                className="font-serif text-xl sm:text-2xl text-[#181716] leading-tight font-normal"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {formData.title_primary} <br />
                <span className="italic text-calypso-700">{formData.title_highlight}</span>
              </h2>

              <p className="text-stone-600 text-xs font-light leading-relaxed line-clamp-3">
                {formData.description}
              </p>
            </div>

            {/* Features Preview (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-200">
              {formData.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${getColorClasses(feat.color)}`}>
                    {renderIcon(feat.icon)}
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider font-semibold text-stone-900 leading-tight">
                      {feat.title}
                    </span>
                    <p className="text-[8px] text-stone-500 font-light mt-0.5 line-clamp-2">
                      {feat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
