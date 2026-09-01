'use client';

import { useState, useEffect } from 'react';
import {
  Sliders,
  Mail,
  Instagram,
  Facebook,
  Phone,
  MessageCircle,
  Save,
  Check,
  AlertCircle,
  Loader2,
  RefreshCw,
  Eye,
  MapPin,
  Megaphone,
} from 'lucide-react';
import { DEFAULT_STORE_SETTINGS, type StoreSettings } from '@/types/settings';

const TiktokIcon = (props: React.ComponentProps<'svg'>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.86.17 1.72.3 2.58.46.01 1.37 0 2.75-.01 4.12-.99-.28-1.92-.76-2.73-1.43-.13-.1-.23-.23-.33-.36-.07 1.83-.03 3.67-.03 5.5 0 2.44-.8 4.96-2.58 6.64-1.74 1.7-4.32 2.37-6.66 1.88-2.51-.43-4.71-2.43-5.26-4.93-.72-2.95.83-6.17 3.68-7.1 1.08-.38 2.24-.41 3.34-.17v4.18c-.89-.35-1.92-.26-2.72.33-.86.58-1.25 1.7-1.02 2.71.21 1.07 1.22 1.86 2.31 1.82 1.13-.02 2.11-.93 2.17-2.06.07-2.86.02-5.72.03-8.58-.01-4.65-.01-9.3 0-13.95z" />
  </svg>
);

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'contact' | 'social' | 'general'>('contact');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      if (!res.ok) throw new Error('Error al cargar configuración');
      const data = await res.json();
      if (data.settings) {
        setFormData(data.settings);
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'No se pudo cargar la configuración de la tienda.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar los ajustes');
      }

      setStatusMessage({
        type: 'success',
        text: '¡Ajustes de contacto y redes sociales actualizados correctamente en toda la tienda!',
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
        <p className="font-serif text-lg text-stone-700">Cargando ajustes de boutique...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-calypso-700 mb-1">
            <Sliders className="w-4 h-4" />
            <span>CASA AIRA • AJUSTES GLOBALES</span>
          </div>
          <h1
            className="text-3xl font-serif text-[#181716] font-normal"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Contacto & Redes Sociales
          </h1>
          <p className="text-sm text-stone-500 font-light mt-1 max-w-2xl">
            Administra el correo de soporte, los perfiles oficiales de Instagram, Facebook y TikTok, y los números de WhatsApp.
          </p>
        </div>

        <button
          onClick={fetchSettings}
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
          onClick={() => setActiveTab('contact')}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all ${
            activeTab === 'contact'
              ? 'border-[#181716] text-[#181716]'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          1. Canales de Contacto
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('social')}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all ${
            activeTab === 'social'
              ? 'border-[#181716] text-[#181716]'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          2. Redes Sociales
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all ${
            activeTab === 'general'
              ? 'border-[#181716] text-[#181716]'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          3. Ubicación & Avisos
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
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-3">
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-stone-400 block mb-1">
                  ATENCIÓN AL CLIENTE
                </span>
                <h2
                  className="text-xl font-serif text-[#181716] font-normal"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Canales de Contacto Directo
                </h2>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-calypso-700" />
                  <span>Correo Electrónico de Contacto Oficial *</span>
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#FAF8F5] border border-stone-300 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                  placeholder="ej: contacto@casaaira.cl"
                />
                <p className="text-[11px] text-stone-400 font-light mt-1">
                  Se muestra en el pie de página de la tienda y en los correos de confirmación.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-stone-600" />
                    <span>Teléfono de Soporte</span>
                  </label>
                  <input
                    type="text"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF8F5] border border-stone-300 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                    placeholder="ej: +56 9 1234 5678"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp de Atención (sin espacios)</span>
                  </label>
                  <input
                    type="text"
                    name="contact_whatsapp"
                    value={formData.contact_whatsapp}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF8F5] border border-stone-300 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                    placeholder="ej: 56912345678"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-3">
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-stone-400 block mb-1">
                  PRESENCIA DIGITAL
                </span>
                <h2
                  className="text-xl font-serif text-[#181716] font-normal"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Enlaces de Redes Sociales
                </h2>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-pink-600" />
                  <span>Perfil de Instagram (URL completa) *</span>
                </label>
                <input
                  type="url"
                  name="instagram_url"
                  value={formData.instagram_url}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#FAF8F5] border border-stone-300 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                  placeholder="https://instagram.com/casaaira_oficial"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Facebook className="w-3.5 h-3.5 text-blue-600" />
                  <span>Página de Facebook (URL completa) *</span>
                </label>
                <input
                  type="url"
                  name="facebook_url"
                  value={formData.facebook_url}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#FAF8F5] border border-stone-300 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                  placeholder="https://facebook.com/casaaira.oficial"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <TiktokIcon className="w-3.5 h-3.5 text-stone-900" />
                  <span>Cuenta de TikTok (URL completa) *</span>
                </label>
                <input
                  type="url"
                  name="tiktok_url"
                  value={formData.tiktok_url}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#FAF8F5] border border-stone-300 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                  placeholder="https://tiktok.com/@casaaira_oficial"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                  Cuenta de Pinterest (Opcional)
                </label>
                <input
                  type="url"
                  name="pinterest_url"
                  value={formData.pinterest_url || ''}
                  onChange={handleInputChange}
                  className="w-full bg-[#FAF8F5] border border-stone-300 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                  placeholder="https://pinterest.com/casaaira_oficial"
                />
              </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-3">
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-stone-400 block mb-1">
                  UBICACIÓN & ANUNCIOS
                </span>
                <h2
                  className="text-xl font-serif text-[#181716] font-normal"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Información Institucional
                </h2>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-600" />
                  <span>Ubicación / Ciudad</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleInputChange}
                  className="w-full bg-[#FAF8F5] border border-stone-300 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                  placeholder="ej: Santiago & Punta Arenas, Chile"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Megaphone className="w-3.5 h-3.5 text-gold-600" />
                  <span>Texto de Envíos y Avisos</span>
                </label>
                <textarea
                  name="announcement_text"
                  value={formData.announcement_text || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-[#FAF8F5] border border-stone-300 p-4 text-sm text-stone-900 focus:bg-white focus:border-stone-900 outline-none font-light leading-relaxed resize-none"
                  placeholder="ej: Envíos rápidos a todo Chile vía Starken y Chilexpress"
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="pt-6 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto btn-couture-primary px-8 py-3.5 text-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Guardando...' : 'Guardar Ajustes & Redes'}</span>
            </button>
          </div>
        </form>

        {/* Live Preview Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-28">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-stone-600">
            <Eye className="w-4 h-4 text-calypso-700" />
            <span>Vista Previa en Vivo (Pie de Página)</span>
          </div>

          <div className="bg-[#181716] text-[#FAF8F5] p-6 space-y-6 border border-stone-800 shadow-md">
            <div>
              <span className="text-[9px] uppercase tracking-[0.3em] font-semibold text-stone-400 block mb-2">
                CORREO & REDES SOCIALES
              </span>
              <p className="text-xs text-stone-400 font-light">
                Así se visualiza el bloque de contacto inferior en el pie de página de la tienda:
              </p>
            </div>

            <div className="pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-stone-300 font-light truncate max-w-[200px]">
                <span className="text-calypso-400 underline underline-offset-4">{formData.contact_email}</span>
              </div>

              <div className="flex gap-2.5">
                <a
                  href={formData.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:text-white hover:border-stone-500 transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
                <a
                  href={formData.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:text-white hover:border-stone-500 transition-colors"
                  title="Facebook"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
                <a
                  href={formData.tiktok_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:text-white hover:border-stone-500 transition-colors"
                  title="TikTok"
                >
                  <TiktokIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {formData.address && (
              <div className="pt-3 border-t border-stone-800/80 text-[10px] text-stone-500 tracking-wider uppercase font-light">
                📍 {formData.address}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
