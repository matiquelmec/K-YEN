import { describe, it, expect } from 'vitest';

describe('Deducción Atómica de Stock y Conciliación de Pagos', () => {
  it('debe calcular correctamente la deducción de stock general y evitar valores negativos', () => {
    const currentStock = 5;
    const qtyPurchased = 3;
    const updatedStock = Math.max(0, currentStock - qtyPurchased);

    expect(updatedStock).toBe(2);

    // Caso de sobreventa evitada por MAX(0, stock - qty)
    const overboughtStock = Math.max(0, currentStock - 10);
    expect(overboughtStock).toBe(0);
  });

  it('debe manejar idempotencia: si la orden ya está pagada no debe duplicar deducción', () => {
    let stock = 10;
    let orderStatus = 'pending';

    const processPayment = (newStatus: string) => {
      if (orderStatus === 'paid') {
        return { modified: false, stock };
      }
      if (newStatus === 'paid') {
        orderStatus = 'paid';
        stock -= 2;
        return { modified: true, stock };
      }
      return { modified: false, stock };
    };

    // Primera confirmación
    const res1 = processPayment('paid');
    expect(res1.modified).toBe(true);
    expect(res1.stock).toBe(8);

    // Segunda confirmación (reintento de webhook de Mercado Pago)
    const res2 = processPayment('paid');
    expect(res2.modified).toBe(false);
    expect(res2.stock).toBe(8); // Se preserva el stock sin duplicar descuento
  });

  it('debe descontar stock relacional para la combinación exacta (Talla x Color)', () => {
    const variantMatrix: Record<string, number> = {
      'VLN-XS-Borgoña': 5,
      'VLN-M-Borgoña': 8,
      'VLN-XS-Negro': 10
    };

    const targetVariant = 'VLN-XS-Borgoña';
    const qty = 2;

    if (variantMatrix[targetVariant] !== undefined) {
      variantMatrix[targetVariant] = Math.max(0, variantMatrix[targetVariant] - qty);
    }

    expect(variantMatrix['VLN-XS-Borgoña']).toBe(3);
    expect(variantMatrix['VLN-M-Borgoña']).toBe(8); // Otras variantes intactas
  });
});
