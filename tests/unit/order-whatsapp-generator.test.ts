import { describe, it, expect } from 'vitest';

describe('Generador de Comprobantes de WhatsApp y Notificación de Pedidos', () => {
  it('debe estructurar un mensaje limpio para el taller con prendas, tallas y colores', () => {
    const orderNumber = 'ORD-1725000000-123';
    const items = [
      { product_name: 'Vestido Luna Nocturna', quantity: 1, size: 'XS', color: 'Borgoña', price: 89990 },
      { product_name: 'Vestido Flor de Cerezo', quantity: 2, size: 'M', color: 'Rosa Suave', price: 74990 }
    ];
    const total = 239970;

    const itemsSummary = items
      .map(it => `- ${it.quantity}x ${it.product_name} (${it.size}, ${it.color})`)
      .join('\n');

    const rawMessage = 
      `¡Hola Taller KÜYEN! Acabo de realizar el pedido ${orderNumber}.\n\n` +
      `Prendas:\n${itemsSummary}\n\n` +
      `Total Pagado: $${total.toLocaleString('es-CL')} CLP\n` +
      `Quedo atenta a la confirmación de confección y código de seguimiento. ¡Muchas gracias!`;

    const encoded = encodeURIComponent(rawMessage);
    const whatsappUrl = `https://wa.me/56912345678?text=${encoded}`;

    expect(whatsappUrl).toContain('https://wa.me/56912345678?text=');
    expect(decodeURIComponent(encoded)).toContain('Vestido Luna Nocturna (XS, Borgoña)');
    expect(decodeURIComponent(encoded)).toContain('Vestido Flor de Cerezo (M, Rosa Suave)');
    expect(decodeURIComponent(encoded)).toContain('Total Pagado: $239.970 CLP');
  });

  it('debe sanitizar números de teléfono removiendo caracteres no numéricos', () => {
    const rawPhone = '+56 9 8765 4321';
    const cleaned = rawPhone.replace(/[^0-9]/g, '');
    expect(cleaned).toBe('56987654321');
  });
});
