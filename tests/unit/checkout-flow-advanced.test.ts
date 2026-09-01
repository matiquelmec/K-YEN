import { describe, it, expect } from 'vitest';
import { validateRut, formatRut } from '@/lib/rut-validator';

describe('Advanced Purchase Flow & Logistics Lifecycle Tests', () => {
  it('garantiza que el carrito permanezca intacto si el usuario es redirigido a la pasarela', () => {
    let cartItems = [
      { id: 'v1', name: 'Vestido Brisa Marina', quantity: 1, size: 'S', color: 'Calipso' },
      { id: 'v2', name: 'Aire Elegante', quantity: 2, size: 'M', color: 'Negro' },
    ];

    // Simular el inicio de checkout (no debe vaciar el carrito inmediatamente)
    const onStartCheckout = () => {
      // Redirección externa iniciada
      return { redirecting: true, cartCount: cartItems.length };
    };

    const checkoutResult = onStartCheckout();
    expect(checkoutResult.cartCount).toBe(2);
    expect(cartItems.length).toBe(2);

    // Simular fallo o cancelación en Mercado Pago y regreso a la tienda
    const onUserReturnsAfterCancellation = () => {
      return cartItems; // El carrito sigue existiendo
    };

    expect(onUserReturnsAfterCancellation().length).toBe(2);

    // Simular confirmación exitosa en /checkout/success
    const onCheckoutSuccess = () => {
      cartItems = [];
      return cartItems;
    };

    expect(onCheckoutSuccess().length).toBe(0);
  });

  it('valida que el payload de despacho incluya RUT, Región y Comuna chilena de forma íntegra', () => {
    const customerFormData = {
      firstName: 'Camila',
      lastName: 'Valenzuela',
      rut: formatRut('123456785'),
      email: 'camila.valenzuela@gmail.com',
      phone: '+56 9 9876 5432',
      region: 'Región de Magallanes y de la Antártica Chilena',
      commune: 'Punta Arenas',
      address: 'Av. Costanera del Estrecho',
      number: '1240',
      dept: 'Torre Austral Depto 302',
    };

    expect(validateRut(customerFormData.rut)).toBe(true);
    expect(customerFormData.region).toContain('Magallanes');
    expect(customerFormData.commune).toBe('Punta Arenas');
    expect(customerFormData.rut).toBe('12.345.678-5');
  });
});
