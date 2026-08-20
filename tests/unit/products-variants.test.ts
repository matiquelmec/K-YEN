import { describe, it, expect } from 'vitest';
import { PRODUCT_COLORS, AVAILABLE_COLORS, getColorClass } from '@/lib/product-utils';

describe('Auditoría de Variantes y Paleta de Colores KÜYEN', () => {
  it('debe tener definidos los colores de la colección con sus clases de Tailwind', () => {
    expect(PRODUCT_COLORS['Negro']).toBe('bg-black');
    expect(PRODUCT_COLORS['Borgoña']).toBe('bg-red-900');
    expect(PRODUCT_COLORS['Lavanda']).toBe('bg-purple-300');
    expect(PRODUCT_COLORS['Rosa Suave']).toBe('bg-pink-300');
    expect(AVAILABLE_COLORS.length).toBeGreaterThan(15);
  });

  it('getColorClass debe devolver la clase correcta o un fallback seguro', () => {
    expect(getColorClass('Borgoña')).toBe('bg-red-900');
    expect(getColorClass('ColorInexistente')).toBe('bg-gray-400');
  });

  it('debe generar SKUs únicos por variante para producto cartesiano (Talla x Color)', () => {
    const sku = 'KY-001';
    const sizes = ['XS', '2XL'];
    const colors = ['Negro', 'Rosa Suave'];

    const generatedSkus: string[] = [];
    sizes.forEach(size => {
      colors.forEach(color => {
        generatedSkus.push(`${sku}-${size}-${color.replace(/\s+/g, '')}`);
      });
    });

    expect(generatedSkus).toEqual([
      'KY-001-XS-Negro',
      'KY-001-XS-RosaSuave',
      'KY-001-2XL-Negro',
      'KY-001-2XL-RosaSuave'
    ]);
    expect(new Set(generatedSkus).size).toBe(4);
  });

  it('debe mapear correctamente strings concatenados de BD a arreglos de tallas y colores', () => {
    const rawSizesStr = 'XS, M, 2XL, 5XL';
    const rawColorsStr = 'Borgoña, Lavanda, Negro';

    const parsedSizes = rawSizesStr.split(',').map(s => s.trim()).filter(Boolean);
    const parsedColors = rawColorsStr.split(',').map(c => c.trim()).filter(Boolean);

    expect(parsedSizes).toEqual(['XS', 'M', '2XL', '5XL']);
    expect(parsedColors).toEqual(['Borgoña', 'Lavanda', 'Negro']);
    expect(parsedSizes).not.toEqual(['S', 'M', 'L']); // Verifica que NO cae en default
  });
});
