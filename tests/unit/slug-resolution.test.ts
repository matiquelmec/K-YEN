import { describe, it, expect } from 'vitest';

describe('Auditoría de Enlaces y Slugs Semánticos', () => {
  it('debe generar slugs limpios a partir de nombres de vestidos', () => {
    const generateSlug = (name: string) =>
      name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    expect(generateSlug('Vestido Luna Nocturna')).toBe('vestido-luna-nocturna');
    expect(generateSlug('Vestido Flor de Cerezo ✨')).toBe('vestido-flor-de-cerezo');
    expect(generateSlug('Vestido Gala & Encaje 2026')).toBe('vestido-gala-encaje-2026');
  });

  it('debe preferir slug sobre id para enlaces de alta gama', () => {
    const product = {
      id: '861b213c-c159-4116-9b86-ba5ed845ef94',
      slug: 'vestido-luna-nocturna'
    };

    const link = `/catalogo/${product.slug || product.id}`;
    expect(link).toBe('/catalogo/vestido-luna-nocturna');
  });

  it('debe usar id como fallback seguro si slug no existiera', () => {
    const product = {
      id: '861b213c-c159-4116-9b86-ba5ed845ef94',
      slug: ''
    };

    const link = `/catalogo/${product.slug || product.id}`;
    expect(link).toBe('/catalogo/861b213c-c159-4116-9b86-ba5ed845ef94');
  });
});
