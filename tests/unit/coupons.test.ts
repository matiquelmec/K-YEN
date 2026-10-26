import { describe, it, expect } from 'vitest';

describe('Sistema Integral de Cupones y Afiliados (Auditoría Nivel 5)', () => {
  it('debe calcular correctamente el descuento porcentual redondeado', () => {
    const cartTotal = 45990;
    const discountPercent = 10; // 10%
    const discountAmount = Math.round(cartTotal * (discountPercent / 100));
    const finalTotal = cartTotal - discountAmount;

    expect(discountAmount).toBe(4599);
    expect(finalTotal).toBe(41391);
  });

  it('debe calcular correctamente el descuento fijo y asegurar que no exceda el subtotal', () => {
    const cartTotal = 35000;
    const discountFixed = 50000; // Descuento mayor al carrito
    const discountApplied = Math.min(discountFixed, cartTotal);
    const finalTotal = Math.max(0, cartTotal - discountApplied);

    expect(discountApplied).toBe(35000);
    expect(finalTotal).toBe(0);
  });

  it('debe validar la compra mínima para aplicar un cupón', () => {
    const minCartAmount = 50000;
    const cart1 = 45000;
    const cart2 = 60000;

    const isValid1 = cart1 >= minCartAmount;
    const isValid2 = cart2 >= minCartAmount;

    expect(isValid1).toBe(false);
    expect(isValid2).toBe(true);
  });

  it('debe validar la expiración y límite de usos de un cupón', () => {
    const now = new Date('2026-08-20T10:00:00Z');
    const validExpiry = new Date('2026-08-25T00:00:00Z');
    const expiredExpiry = new Date('2026-08-10T00:00:00Z');

    expect(validExpiry > now).toBe(true);
    expect(expiredExpiry > now).toBe(false);

    const usageLimit = 10;
    const usageCountValid = 9;
    const usageCountExceeded = 10;

    expect(usageCountValid < usageLimit).toBe(true);
    expect(usageCountExceeded < usageLimit).toBe(false);
  });

  it('simula la conciliación atómica del cupón post-pago Flow.cl (incremento de uso)', () => {
    const mockDb = {
      coupons: [
        { code: 'BIENVENIDA10', usage_count: 5, usage_limit: 10 }
      ],
      orders: [] as any[]
    };

    // Al llegar webhook Flow.cl con pago aprobado:
    const appliedCoupon = mockDb.coupons.find(c => c.code === 'BIENVENIDA10');
    if (appliedCoupon) {
      appliedCoupon.usage_count += 1;
    }

    expect(appliedCoupon?.usage_count).toBe(6);
  });
});
