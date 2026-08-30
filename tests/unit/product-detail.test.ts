import { describe, it, expect } from 'vitest';

describe('Detalle de Producto & Asesoría Casa Aira', () => {
  describe('Generador de Mensaje de Consulta por WhatsApp', () => {
    it('debe codificar de forma segura el mensaje pre-llenado de asesoría', () => {
      const product = {
        name: 'Vestido Calipso Silvestre',
        price: 89990,
      };
      const selectedSize = 'XL';
      const selectedColor = 'Calipso';

      const rawText = `Hola Casa Aira Boutique, me encantó el vestido "${product.name}" en talla ${selectedSize} color ${selectedColor}. ¿Me podrían dar más detalles sobre disponibilidad y calce?`;
      const encoded = encodeURIComponent(rawText);

      expect(encoded).toContain('Hola%20Casa%20Aira%20Boutique');
      expect(encoded).toContain('Vestido%20Calipso%20Silvestre');
      expect(encoded).toContain('talla%20XL');
      expect(encoded).not.toContain('<script>');
    });
  });

  describe('Formateo de SKU Boutique Casa Aira', () => {
    it('debe formatear el código de inventario con prefijo CA y 4 dígitos', () => {
      const formatSKU = (id: number | string) => {
        return `CA-${String(id).padStart(4, '0')}`;
      };

      expect(formatSKU(1)).toBe('CA-0001');
      expect(formatSKU(42)).toBe('CA-0042');
      expect(formatSKU('105')).toBe('CA-0105');
    });
  });

  describe('Validación de Selección antes de Agregar a la Bolsa', () => {
    it('debe requerir obligatoriamente talla y color seleccionados', () => {
      const canAddToCart = (size: string, color: string) => {
        return Boolean(size && color && size.trim() !== '' && color.trim() !== '');
      };

      expect(canAddToCart('M', 'Negro')).toBe(true);
      expect(canAddToCart('', 'Negro')).toBe(false);
      expect(canAddToCart('M', '')).toBe(false);
      expect(canAddToCart('', '')).toBe(false);
    });
  });
});
