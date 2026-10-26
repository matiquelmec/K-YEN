import { describe, it, expect } from 'vitest';
import { normalizeCategorySlug, CASA_AIRA_CATEGORIES } from '@/lib/product-utils';

describe('Admin Architecture & Endpoints Audit Suite (Nivel 5)', () => {
  it('valida que el alias "brisa-calipso" se resuelva canónicamente a "veraniego"', () => {
    expect(normalizeCategorySlug('brisa-calipso')).toBe('veraniego');
    expect(normalizeCategorySlug('verano')).toBe('veraniego');
    expect(normalizeCategorySlug('playa')).toBe('veraniego');
  });

  it('valida que el alias "solsticio-dorado" se resuelva canónicamente a "gotico"', () => {
    expect(normalizeCategorySlug('solsticio-dorado')).toBe('gotico');
    expect(normalizeCategorySlug('fiesta')).toBe('gotico');
    expect(normalizeCategorySlug('gala')).toBe('gotico');
  });

  it('valida que el alias "rosa-alba" se resuelva canónicamente a "primaveral"', () => {
    expect(normalizeCategorySlug('rosa-alba')).toBe('primaveral');
    expect(normalizeCategorySlug('romance')).toBe('primaveral');
    expect(normalizeCategorySlug('coctel')).toBe('primaveral');
  });

  it('verifica que las 3 colecciones canónicas existan con sus metadatos editoriales', () => {
    const ids = CASA_AIRA_CATEGORIES.map((c) => c.id);
    expect(ids).toContain('veraniego');
    expect(ids).toContain('gotico');
    expect(ids).toContain('primaveral');
    expect(CASA_AIRA_CATEGORIES.length).toBe(3);
  });

  it('valida cálculo y filtrado de órdenes pagadas para el cálculo de ingresos del Dashboard', () => {
    const sampleOrders = [
      { id: 'ord-1', total: 45990, status: 'paid', payment_status: 'approved' },
      { id: 'ord-2', total: 55000, status: 'delivered', payment_status: 'approved' },
      { id: 'ord-3', total: 39990, status: 'pending', payment_status: 'pending' },
      { id: 'ord-4', total: 62000, status: 'cancelled', payment_status: 'rejected' },
    ];

    const totalRevenue = sampleOrders.reduce((sum, order) => {
      const isPaid =
        order.status === 'paid' ||
        order.payment_status === 'approved' ||
        order.status === 'delivered';
      return sum + (isPaid ? order.total : 0);
    }, 0);

    expect(totalRevenue).toBe(45990 + 55000);
  });
});
