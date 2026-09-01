'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  HeartHandshake,
  Upload,
  Save,
  Check,
  AlertCircle,
  Loader2,
  RefreshCw,
  Eye,
  ArrowRight,
  MessageCircle,
  Sparkles,
  ImageIcon,
} from 'lucide-react';
import { compressImage } from '@/lib/imageUtils';
import { DEFAULT_MANIFESTO, type ManifestoData, type PillarItem } from '@/types/manifesto';

export default function AdminManifestoPage() {
  const [formData, setFormData] = useState<ManifestoData>(DEFAULT_MANIFESTO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'manifesto' | 'advisory'>('manifesto');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchManifesto = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/manifesto');
      if (!res.ok) throw new Error('Error al cargar datos del manifiesto');
      const data = await res.json();
      if (data.manifesto) {
        setFormData(data.manifesto);
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'No se pudo cargar la información del manifiesto.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManifesto();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePillarChange = (index: number, field: keyof PillarItem, value: string) => {
    setFormData((prev) => {
      const updatedPillars = [...prev.pillars];
      const target = updatedPillars[index] || { number: `0${index + 1}.`, title: '', description: '' };
      updatedPillars[index] = { ...target, [field]: value };
      return { ...prev, pillars: updatedPillars };
    });
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadMessage('Optimizando y comprimiendo fotografía editorial 3:4...');
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

      const res = await fetch('/api/admin/manifesto/upload', {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al subir la imagen');
      }

      setFormData((prev) => ({ ...prev, card_image: data.publicUrl }));
      setStatusMessage({
        type: 'success',
        text: '¡Fotografía editorial optimizada y subida! Haz clic en "Guardar Cambios" para confirmar.',
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
      const res = await fetch('/api/admin/manifesto', {
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
        text: '¡Sección de Compromiso & Asesoría actualizada correctamente en la portada!',
      });
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
        <p className="font-serif text-lg text-stone-700">Cargando manifiesto & asesoría...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-calypso-700 mb-1">
            <HeartHandshake className="w-4 h-4" />
            <span>CASA AIRA • FILOSOFÍA & ATENCIÓN</span>
          </div>
          <h1
            className="text-3xl font-serif text-[#181716] font-normal"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Compromiso & Asesoría Personalizada
          </h1>
          <p className="text-sm text-stone-500 font-light mt-1 max-w-2xl">
            Edita los textos de la historia de la boutique, los 3 pilares de selección y la tarjeta de atención directa con fotografía editorial y WhatsApp.
          </p>
        </div>

        <button
          onClick={fetchManifesto}
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
          onClick={() => setActiveTab('manifesto')}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all ${
            activeTab === 'manifesto'
              ? 'border-[#181716] text-[#181716]'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          1. Filosofía & 3 Pilares
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('advisory')}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all ${
            activeTab === 'advisory'
              ? 'border-[#181716] text-[#181716]'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          2. Tarjeta Editorial & WhatsApp
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

      {/* Main Grid: Form (Left 7) & Live Preview (Right 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-white border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          {activeTab === 'manifesto' ? (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-3">
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-stone-400 block mb-1">
                  FILOSOFÍA DE SELECCIÓN
                </span>
                <h2
                  className="text-xl font-serif text-[#181716] font-normal"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Manifiesto y Compromiso de Marca
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
                  placeholder="Ej: NUESTRO COMPROMISO"
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
                    placeholder="Ej: No fabricamos en masa;"
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
                    placeholder="Ej: elegimos cada vestido pensando en ti."
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                  Descripción / Historia de Curaduría *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                  className="w-full bg-[#FAF8F5] border border-stone-300 p-4 text-sm text-stone-900 focus:bg-white focus:border-stone-900 outline-none font-light leading-relaxed resize-none"
                  placeholder="Explica cómo seleccionan y prueban los vestidos..."
                />
              </div>

              {/* 3 Pilares */}
              <div className="pt-4 border-t border-stone-100 space-y-4">
                <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-stone-800 block">
                  Los 3 Pilares Editoriales
                </span>

                {formData.pillars.map((pillar, idx) => (
                  <div key={idx} className="p-4 bg-[#FAF8F5] border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-lg text-stone-900 font-normal">Pilar {pillar.number}</span>
                      <input
                        type="text"
                        value={pillar.number}
                        onChange={(e) => handlePillarChange(idx, 'number', e.target.value)}
                        className="w-16 bg-white border border-stone-300 px-2 py-1 text-xs text-center font-serif text-stone-800 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">Título del Pilar</label>
                      <input
                        type="text"
                        value={pillar.title}
                        onChange={(e) => handlePillarChange(idx, 'title', e.target.value)}
                        className="w-full bg-white border border-stone-300 px-3 py-1.5 text-xs text-stone-900 outline-none font-semibold uppercase tracking-wider"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">Descripción Corta</label>
                      <input
                        type="text"
                        value={pillar.description}
                        onChange={(e) => handlePillarChange(idx, 'description', e.target.value)}
                        className="w-full bg-white border border-stone-300 px-3 py-1.5 text-xs text-stone-900 outline-none font-light"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-3">
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-stone-400 block mb-1">
                  TARJETA DERECHA (3:4)
                </span>
                <h2
                  className="text-xl font-serif text-[#181716] font-normal"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Fotografía Editorial y Asesoría por WhatsApp
                </h2>
              </div>

              {/* Upload Foto 3:4 */}
              <div className="space-y-3">
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700">
                  Fotografía Editorial (Aspecto 3:4)
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#FAF8F5] border border-stone-200">
                  <div className="relative w-24 h-32 bg-stone-200 overflow-hidden flex-shrink-0 border border-stone-300 shadow-sm">
                    {formData.card_image ? (
                      <Image src={formData.card_image} alt="Preview" fill className="object-cover" />
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
                      <span>{uploading ? 'Procesando...' : 'Cambiar Fotografía 3:4'}</span>
                    </button>
                    <p className="text-[11px] text-stone-500 font-light mt-1.5">
                      Sube fotos en alta resolución; se comprimen a WebP ligero de forma automática.
                    </p>
                    {uploadMessage && (
                      <p className="text-[11px] text-calypso-700 font-medium mt-1 animate-pulse">{uploadMessage}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                    Badge de Fotografía *
                  </label>
                  <input
                    type="text"
                    name="card_badge"
                    value={formData.card_badge}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#FAF8F5] border border-stone-300 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                    placeholder="Ej: SELECCIÓN EXCLUSIVA"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                    Subtítulo de Tarjeta *
                  </label>
                  <input
                    type="text"
                    name="card_subtitle"
                    value={formData.card_subtitle}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#FAF8F5] border border-stone-300 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                    placeholder="Ej: ATENCIÓN & ASESORÍA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                  Título de Asesoría (Playfair) *
                </label>
                <input
                  type="text"
                  name="card_title"
                  value={formData.card_title}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#FAF8F5] border border-stone-300 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:border-stone-900 outline-none font-serif text-base"
                  placeholder="Ej: ¿Dudas con tu talla o el modelo?"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                  Descripción de Asesoría *
                </label>
                <textarea
                  name="card_description"
                  value={formData.card_description}
                  onChange={handleInputChange}
                  rows={3}
                  required
                  className="w-full bg-[#FAF8F5] border border-stone-300 p-4 text-sm text-stone-900 focus:bg-white focus:border-stone-900 outline-none font-light leading-relaxed resize-none"
                  placeholder="Mensaje de confianza para que te contacten..."
                />
              </div>

              {/* WhatsApp Config */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-900">
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                  <span>Configuración de Contacto WhatsApp</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-emerald-800 mb-1">
                      Número WhatsApp (con código de país)
                    </label>
                    <input
                      type="text"
                      name="whatsapp_number"
                      value={formData.whatsapp_number}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white border border-emerald-300 px-3 py-2 text-xs text-stone-900 outline-none"
                      placeholder="Ej: 56912345678"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-emerald-800 mb-1">
                      Mensaje Predeterminado
                    </label>
                    <input
                      type="text"
                      name="whatsapp_message"
                      value={formData.whatsapp_message}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white border border-emerald-300 px-3 py-2 text-xs text-stone-900 outline-none font-light"
                      placeholder="Ej: Hola Casa Aira, me gustaría asesoría..."
                    />
                  </div>
                </div>
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
              <span>{saving ? 'Guardando...' : 'Guardar Cambios de Manifiesto'}</span>
            </button>
          </div>
        </form>

        {/* Live Preview Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-28">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-stone-600">
            <Eye className="w-4 h-4 text-calypso-700" />
            <span>Vista Previa en Vivo (Portada)</span>
          </div>

          <div className="bg-[#F4EFE8]/70 border border-stone-200/80 p-6 space-y-6 shadow-sm">
            {/* Left Preview Portion */}
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

            {/* Advisory Card Preview */}
            <div className="bg-white border border-stone-200 shadow-sm overflow-hidden">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
                {formData.card_image ? (
                  <Image src={formData.card_image} alt="Preview" fill className="object-cover object-center" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[8px] uppercase tracking-[0.2em] font-semibold text-stone-800 border border-stone-200/70 shadow-sm">
                  {formData.card_badge}
                </div>
              </div>

              <div className="p-5 space-y-2.5">
                <span className="text-[9px] tracking-[0.25em] uppercase text-stone-400 font-medium block">
                  {formData.card_subtitle}
                </span>

                <h3
                  className="font-serif text-lg text-[#181716] font-normal"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {formData.card_title}
                </h3>

                <p className="text-[11px] text-stone-600 font-light leading-relaxed line-clamp-2">
                  {formData.card_description}
                </p>

                <div className="pt-2 flex gap-2">
                  <div className="px-3 py-2 bg-[#181716] text-white text-[9px] tracking-[0.2em] uppercase font-semibold flex items-center gap-1">
                    <span>Catálogo</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                  <div className="px-3 py-2 bg-stone-100 text-stone-800 text-[9px] tracking-[0.2em] uppercase font-semibold flex items-center gap-1">
                    <MessageCircle className="w-3 h-3 text-emerald-600" />
                    <span>WhatsApp</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
