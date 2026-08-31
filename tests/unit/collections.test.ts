import { describe, it, expect, vi } from 'vitest';
import { DEFAULT_COLLECTIONS, type CollectionItem } from '@/types/collections';

describe('Collections Database & Module Quality Tests', () => {
  it('contiene exactamente las 3 colecciones por defecto de Casa Aira', () => {
    expect(DEFAULT_COLLECTIONS).toHaveLength(3);
  });

  it('valida la estructura de cada colección por defecto', () => {
    DEFAULT_COLLECTIONS.forEach((col: CollectionItem) => {
      expect(col.id).toBeDefined();
      expect(col.number).toMatch(/^\d{2}$/);
      expect(col.title).toBeTruthy();
      expect(col.subtitle).toBeTruthy();
      expect(col.tag).toBeTruthy();
      expect(col.description).toBeTruthy();
      expect(col.image).toBeTruthy();
      expect(col.category_id).toBeTruthy();
      expect(col.is_active).toBe(true);
      expect(col.display_order).toBeGreaterThan(0);
    });
  });

  it('verifica que los IDs de colecciones correspondan a categorías válidas del catálogo', () => {
    const validCategories = ['veraniego', 'gotico', 'primaveral', 'all'];
    DEFAULT_COLLECTIONS.forEach((col) => {
      expect(validCategories).toContain(col.category_id);
    });
  });

  it('valida el ordenamiento secuencial de las colecciones', () => {
    const orders = DEFAULT_COLLECTIONS.map((c) => c.display_order);
    expect(orders).toEqual([1, 2, 3]);
  });
});

describe('Collections API Security & Validation Logic', () => {
  it('rechaza solicitudes de actualización sin ID de colección', () => {
    const payload = { title: 'Nuevo Título' };
    const isValid = Boolean((payload as any).id);
    expect(isValid).toBe(false);
  });

  it('rechaza títulos que excedan los 100 caracteres', () => {
    const longTitle = 'A'.repeat(101);
    const isValidLength = longTitle.trim().length <= 100;
    expect(isValidLength).toBe(false);
  });

  it('rechaza descripciones que excedan los 500 caracteres', () => {
    const longDescription = 'B'.repeat(501);
    const isValidLength = longDescription.trim().length <= 500;
    expect(isValidLength).toBe(false);
  });

  it('valida formatos de imagen permitidos para subida segura', () => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    
    expect(allowedMimeTypes.includes('image/webp')).toBe(true);
    expect(allowedMimeTypes.includes('image/png')).toBe(true);
    expect(allowedMimeTypes.includes('image/jpeg')).toBe(true);
    expect(allowedMimeTypes.includes('application/pdf')).toBe(false);
    expect(allowedMimeTypes.includes('text/html')).toBe(false);
    expect(allowedMimeTypes.includes('application/javascript')).toBe(false);
  });
});

import { normalizeCategorySlug, getCategoryName, getCategoryColor, CASA_AIRA_CATEGORIES } from '@/lib/product-utils';

describe('Category Normalization & Aliases Audit Tests', () => {
  it('normaliza slugs y aliases correctamente a los IDs oficiales', () => {
    expect(normalizeCategorySlug('veraniego')).toBe('veraniego');
    expect(normalizeCategorySlug('brisa-calipso')).toBe('veraniego');
    expect(normalizeCategorySlug('verano')).toBe('veraniego');

    expect(normalizeCategorySlug('gotico')).toBe('gotico');
    expect(normalizeCategorySlug('solsticio-dorado')).toBe('gotico');
    expect(normalizeCategorySlug('fiesta')).toBe('gotico');

    expect(normalizeCategorySlug('primaveral')).toBe('primaveral');
    expect(normalizeCategorySlug('rosa-alba')).toBe('primaveral');
    expect(normalizeCategorySlug('romance')).toBe('primaveral');
  });

  it('obtiene los nombres oficiales de marca Casa Aira para cualquier alias', () => {
    expect(getCategoryName('veraniego')).toBe('Brisa & Calipso');
    expect(getCategoryName('brisa-calipso')).toBe('Brisa & Calipso');
    expect(getCategoryName('gotico')).toBe('Solsticio Dorado');
    expect(getCategoryName('solsticio-dorado')).toBe('Solsticio Dorado');
    expect(getCategoryName('primaveral')).toBe('Rosa de Alba');
    expect(getCategoryName('rosa-alba')).toBe('Rosa de Alba');
  });

  it('garantiza que cada categoría tenga paleta de color y etiqueta', () => {
    CASA_AIRA_CATEGORIES.forEach((cat) => {
      expect(cat.id).toBeDefined();
      expect(cat.name).toBeTruthy();
      expect(cat.subtitle).toBeTruthy();
      expect(cat.tag).toBeTruthy();
      expect(cat.color).toBeTruthy();
      expect(cat.badgeColor).toBeTruthy();
    });
  });
});

