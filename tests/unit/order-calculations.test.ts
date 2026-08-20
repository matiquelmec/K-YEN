import { describe, it, expect } from 'vitest';
import { formatPrice, slugify, capitalizeFirst } from '@/lib/utils';

describe('Order & Price Calculations', () => {
  it('debe formatear precios en pesos chilenos (CLP) correctamente', () => {
    const formatted = formatPrice(29990);
    expect(formatted).toContain('29.990');
  });

  it('debe generar slugs de productos limpios y normalizados (SEO)', () => {
    const slug = slugify('Vestido Gótico Terciopelo 2026!');
    expect(slug).toBe('vestido-gotico-terciopelo-2026');
  });

  it('debe capitalizar textos correctamente', () => {
    expect(capitalizeFirst('vestidos')).toBe('Vestidos');
  });
});
