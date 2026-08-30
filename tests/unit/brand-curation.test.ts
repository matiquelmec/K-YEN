import { describe, it, expect } from 'vitest';
import { AVAILABLE_SIZES, AVAILABLE_COLORS } from '@/lib/product-utils';
import { findClosestCasaAiraColor } from '@/lib/colorExtractor';

describe('Curaduría & Estándares Casa Aira Boutique', () => {
  describe('Inclusividad de Tallaje Real', () => {
    it('debe contener el rango completo de tallas inclusivas de XS a 6XL', () => {
      const expectedSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'];
      
      expectedSizes.forEach((size) => {
        expect(AVAILABLE_SIZES).toContain(size);
      });
      expect(AVAILABLE_SIZES.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe('Paleta de Colores de Autor', () => {
    it('debe contener los colores emblemáticos de la boutique', () => {
      const coreColors = ['Negro', 'Blanco', 'Calipso', 'Dorado', 'Rosa Suave', 'Azul Medianoche', 'Verde Bosque'];
      
      coreColors.forEach((color) => {
        expect(AVAILABLE_COLORS).toContain(color);
      });
    });

    it('debe mapear con precisión tonos RGB hacia el color de catálogo más cercano', () => {
      // Tono casi negro
      expect(findClosestCasaAiraColor(15, 15, 15)).toBe('Negro');
      // Tono blanco marfil
      expect(findClosestCasaAiraColor(250, 248, 245)).toBe('Blanco');
      // Tono calipso egeo / azul turquesa
      expect(findClosestCasaAiraColor(29, 112, 127)).toBe('Calipso');
      // Tono dorado champagne
      expect(findClosestCasaAiraColor(191, 161, 95)).toBe('Dorado');
    });
  });
});
