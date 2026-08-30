'use client';

import { useState, useEffect } from 'react';
import { Tag, Users, TrendingUp, Plus, Trash2, Edit, CheckCircle2, XCircle, Search, DollarSign } from 'lucide-react';
import { CouponRow } from '@/lib/db/coupons';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponRow | null>(null);

  // Form state
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [minCartAmount, setMinCartAmount] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [affiliateName, setAffiliateName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      if (res.ok) {
        setCoupons(data.coupons || []);
      }
    } catch (err) {
      console.error('Error loading coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setCode('');
    setDiscountType('percentage');
    setDiscountValue('10');
    setMinCartAmount('0');
    setUsageLimit('');
    setExpiresAt('');
    setIsActive(true);
    setAffiliateName('');
    setShowModal(true);
  };

  const openEditModal = (coupon: CouponRow) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setDiscountType(coupon.discount_type);
    setDiscountValue(coupon.discount_value.toString());
    setMinCartAmount(coupon.min_cart_amount.toString());
    setUsageLimit(coupon.usage_limit ? coupon.usage_limit.toString() : '');
    setExpiresAt(coupon.expires_at || '');
    setIsActive(coupon.is_active);
    setAffiliateName(coupon.affiliate_name || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        code: code.trim().toUpperCase(),
        discount_type: discountType,
        discount_value: parseFloat(discountValue) || 0,
        min_cart_amount: parseFloat(minCartAmount) || 0,
        usage_limit: usageLimit ? parseInt(usageLimit) : null,
        expires_at: expiresAt || null,
        is_active: isActive,
        affiliate_name: affiliateName.trim() || null
      };

      const url = '/api/admin/coupons';
      const method = editingCoupon ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar el cupón');
      }

      setShowModal(false);
      fetchCoupons();
    } catch (err: any) {
      alert(err.message || 'Error al procesar la solicitud');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (codeToDelete: string) => {
    if (!confirm(`¿Estás segura de que deseas eliminar permanentemente el cupón ${codeToDelete}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/coupons?code=${encodeURIComponent(codeToDelete)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCoupons(prev => prev.filter(c => c.code !== codeToDelete));
      } else {
        const data = await res.json();
        alert(data.error || 'Error al eliminar cupón');
      }
    } catch (err) {
      console.error('Error deleting coupon:', err);
    }
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.affiliate_name && c.affiliate_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Estadísticas calculadas
  const activeCoupons = coupons.filter(c => c.is_active).length;
  const affiliateCoupons = coupons.filter(c => !!c.affiliate_name).length;
  const totalSalesGenerated = coupons.reduce((acc, c) => acc + (c.total_sales || 0), 0);
  const totalOrdersGenerated = coupons.reduce((acc, c) => acc + (c.total_orders || 0), 0);

  const formatCLP = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-stone-500 block mb-1">
            CASA AIRA • PROMOCIONES
          </span>
          <h1
            className="text-3xl md:text-4xl font-serif font-normal text-[#181716] tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Cupones & Cortesías
          </h1>
          <p className="text-stone-500 text-sm font-light mt-1">
            Gestiona códigos de descuento para campañas y programas de embajadoras de Casa Aira.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-6 py-3.5 bg-[#181716] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-calypso-700 transition-all flex items-center gap-2 shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Cupón</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 border border-stone-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.25em]">Cupones Activos</p>
            <h3 className="text-2xl font-serif font-normal text-[#181716] mt-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {activeCoupons} / {coupons.length}
            </h3>
          </div>
          <div className="w-10 h-10 bg-stone-100 text-stone-700 flex items-center justify-center">
            <Tag className="w-5 h-5 stroke-[1.5]" />
          </div>
        </div>

        <div className="bg-white p-6 border border-stone-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.25em]">Embajadoras</p>
            <h3 className="text-2xl font-serif font-normal text-[#181716] mt-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {affiliateCoupons}
            </h3>
          </div>
          <div className="w-10 h-10 bg-calypso-50 text-calypso-700 flex items-center justify-center">
            <Users className="w-5 h-5 stroke-[1.5]" />
          </div>
        </div>

        <div className="bg-white p-6 border border-stone-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.25em]">Ventas Generadas</p>
            <h3 className="text-2xl font-serif font-normal text-emerald-700 mt-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {formatCLP(totalSalesGenerated)}
            </h3>
          </div>
          <div className="w-10 h-10 bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base">
            $
          </div>
        </div>

        <div className="bg-white p-6 border border-stone-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.25em]">Pedidos con Cupón</p>
            <h3 className="text-2xl font-serif font-normal text-amber-700 mt-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {totalOrdersGenerated}
            </h3>
          </div>
          <div className="w-10 h-10 bg-amber-50 text-amber-700 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 stroke-[1.5]" />
          </div>
        </div>
      </div>

      {/* Tabla de Cupones */}
      <div className="bg-white border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="search"
              autoComplete="off"
              placeholder="Buscar por código o embajadora..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 text-xs text-stone-900 tracking-wide placeholder:text-stone-400 focus:outline-none focus:border-calypso-600 transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-stone-400 font-light text-xs">Cargando cupones...</div>
        ) : filteredCoupons.length === 0 ? (
          <div className="p-16 text-center text-stone-400 font-light text-xs">
            {searchTerm ? 'No se encontraron cupones coincidentes.' : 'Aún no hay cupones creados.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-[10px] font-semibold text-stone-500 uppercase tracking-[0.25em] border-b border-stone-100">
                <tr>
                  <th className="px-6 py-3.5">Código</th>
                  <th className="px-6 py-3.5">Descuento</th>
                  <th className="px-6 py-3.5">Tipo / Embajadora</th>
                  <th className="px-6 py-3.5">Usos</th>
                  <th className="px-6 py-3.5">Ventas ($)</th>
                  <th className="px-6 py-3.5">Estado</th>
                  <th className="px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.code} className="hover:bg-stone-50/60 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-stone-900 tracking-wider">
                      <span className="bg-stone-100 text-stone-800 px-2.5 py-1 border border-stone-200 text-[11px]">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600">
                      {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `${formatCLP(coupon.discount_value)} OFF`}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.affiliate_name ? (
                        <div className="flex items-center gap-1.5 text-rose-600 font-medium">
                          <Users className="w-3.5 h-3.5" />
                          <span>{coupon.affiliate_name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Campaña General</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {coupon.usage_count} {coupon.usage_limit ? `/ ${coupon.usage_limit}` : 'usos'}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {formatCLP(coupon.total_sales || 0)}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.is_active ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
                          <XCircle className="w-3 h-3" /> Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(coupon)}
                          className="p-2 text-gray-400 hover:text-earth-800 hover:bg-earth-50 rounded-lg transition-colors"
                          title="Editar cupón"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.code)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar cupón"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Creación / Edición */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6">
            <h2 className="text-2xl font-bold font-display text-gray-900">
              {editingCoupon ? 'Editar Cupón' : 'Crear Nuevo Cupón'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Código del Cupón *</label>
                <input
                  type="text"
                  required
                  disabled={!!editingCoupon}
                  placeholder="EJ: VERANO2026 o SOFIA10"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-earth-500 disabled:opacity-60"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tipo de Descuento</label>
                  <select
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-earth-500"
                  >
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed">Monto Fijo ($ CLP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Valor de Descuento *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder={discountType === 'percentage' ? '15' : '5000'}
                    value={discountValue}
                    onChange={e => setDiscountValue(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-earth-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Compra Mínima ($ CLP)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={minCartAmount}
                    onChange={e => setMinCartAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-earth-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Límite de Usos (Opcional)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ilimitado"
                    value={usageLimit}
                    onChange={e => setUsageLimit(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-earth-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre de Afiliada / Embajadora (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: Sofía Muñoz (@sofia_outfits)"
                  value={affiliateName}
                  onChange={e => setAffiliateName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-earth-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-earth-800 focus:ring-earth-500"
                />
                <label htmlFor="isActive" className="text-sm font-bold text-gray-800">
                  Cupón activo y disponible para clientes
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-earth-800 hover:bg-earth-900 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Guardando...' : editingCoupon ? 'Actualizar Cupón' : 'Crear Cupón'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
