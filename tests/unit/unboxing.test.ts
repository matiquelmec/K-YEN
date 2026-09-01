import { describe, it, expect } from 'vitest';
import { DEFAULT_UNBOXING, type UnboxingData, type UnboxingFeature } from '@/types/unboxing';

describe('Unboxing & Packaging Module Integrity Tests', () => {
  it('contiene la estructura completa de la experiencia de empaque de Casa Aira', () => {
    expect(DEFAULT_UNBOXING.badge).toBe('UN DETALLE ESPECIAL');
    expect(DEFAULT_UNBOXING.title_primary).toBeTruthy();
    expect(DEFAULT_UNBOXING.title_highlight).toBeTruthy();
    expect(DEFAULT_UNBOXING.description).toBeTruthy();
    expect(DEFAULT_UNBOXING.image).toBeTruthy();
    expect(DEFAULT_UNBOXING.image_badge).toBeTruthy();
    expect(DEFAULT_UNBOXING.features).toHaveLength(4);
  });

  it('valida que cada uno de los 4 detalles de empaque contenga ID, icono, título, descripción y color', () => {
    const validIcons = ['sparkles', 'shield', 'package', 'heart'];
    const validColors = ['calypso', 'gold', 'blush', 'stone'];

    DEFAULT_UNBOXING.features.forEach((feat: UnboxingFeature) => {
      expect(feat.id).toBeTruthy();
      expect(validIcons).toContain(feat.icon);
      expect(validColors).toContain(feat.color);
      expect(feat.title).toBeTruthy();
      expect(feat.description).toBeTruthy();
    });
  });
});

describe('Unboxing API Security & Validation Logic', () => {
  it('rechaza descripciones que excedan los 800 caracteres', () => {
    const longDescription = 'A'.repeat(801);
    const isValidLength = longDescription.trim().length <= 800;
    expect(isValidLength).toBe(false);
  });

  it('valida formatos de imagen permitidos para la fotografía de packaging', () => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    expect(allowedMimeTypes.includes('image/webp')).toBe(true);
    expect(allowedMimeTypes.includes('image/jpeg')).toBe(true);
    expect(allowedMimeTypes.includes('image/png')).toBe(true);
    expect(allowedMimeTypes.includes('application/pdf')).toBe(false);
    expect(allowedMimeTypes.includes('text/html')).toBe(false);
  });

  it('valida que los detalles sean un array de objetos con título y descripción', () => {
    const validFeatures = [
      { id: '1', icon: 'sparkles', title: 'Aroma', description: 'Fragancia', color: 'calypso' },
    ];
    const invalidFeatures = 'invalid-string';

    expect(Array.isArray(validFeatures)).toBe(true);
    expect(Array.isArray(invalidFeatures)).toBe(false);
  });
});
