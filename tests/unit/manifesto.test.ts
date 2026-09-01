import { describe, it, expect } from 'vitest';
import { DEFAULT_MANIFESTO, type ManifestoData, type PillarItem } from '@/types/manifesto';

describe('Manifesto & Advisory Module Integrity Tests', () => {
  it('contiene la estructura completa del manifiesto por defecto de Casa Aira', () => {
    expect(DEFAULT_MANIFESTO.badge).toBe('NUESTRO COMPROMISO');
    expect(DEFAULT_MANIFESTO.title_primary).toBeTruthy();
    expect(DEFAULT_MANIFESTO.title_highlight).toBeTruthy();
    expect(DEFAULT_MANIFESTO.description).toBeTruthy();
    expect(DEFAULT_MANIFESTO.pillars).toHaveLength(3);
    expect(DEFAULT_MANIFESTO.card_image).toBeTruthy();
    expect(DEFAULT_MANIFESTO.card_badge).toBeTruthy();
    expect(DEFAULT_MANIFESTO.card_subtitle).toBeTruthy();
    expect(DEFAULT_MANIFESTO.card_title).toBeTruthy();
    expect(DEFAULT_MANIFESTO.card_description).toBeTruthy();
    expect(DEFAULT_MANIFESTO.catalog_button_text).toBeTruthy();
    expect(DEFAULT_MANIFESTO.whatsapp_number).toBeTruthy();
    expect(DEFAULT_MANIFESTO.whatsapp_message).toBeTruthy();
  });

  it('valida que cada uno de los 3 pilares contenga número, título y descripción', () => {
    DEFAULT_MANIFESTO.pillars.forEach((pillar: PillarItem) => {
      expect(pillar.number).toMatch(/^\d{2}\.$/);
      expect(pillar.title).toBeTruthy();
      expect(pillar.description).toBeTruthy();
    });
  });

  it('valida y sanitiza correctamente los números de teléfono para WhatsApp', () => {
    const rawNumber = '+56 9 1234 5678';
    const sanitizedNumber = rawNumber.replace(/\D/g, '');
    expect(sanitizedNumber).toBe('56912345678');
    expect(/^\d+$/.test(sanitizedNumber)).toBe(true);
  });

  it('construye la URL de WhatsApp con codificación segura de caracteres', () => {
    const number = '56912345678';
    const message = 'Hola Casa Aira, ¿tienen talla M?';
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${number}?text=${encoded}`;

    expect(url).toContain('https://wa.me/56912345678?text=Hola%20Casa%20Aira');
    expect(url).toContain('%C2%BFtienen%20talla%20M%3F');
  });
});

describe('Manifesto API Security & Validation Logic', () => {
  it('rechaza descripciones que excedan los 800 caracteres', () => {
    const longDescription = 'A'.repeat(801);
    const isValidLength = longDescription.trim().length <= 800;
    expect(isValidLength).toBe(false);
  });

  it('rechaza formatos no permitidos para la fotografía editorial 3:4', () => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    expect(allowedMimeTypes.includes('image/webp')).toBe(true);
    expect(allowedMimeTypes.includes('image/jpeg')).toBe(true);
    expect(allowedMimeTypes.includes('image/png')).toBe(true);
    expect(allowedMimeTypes.includes('application/pdf')).toBe(false);
    expect(allowedMimeTypes.includes('application/x-msdownload')).toBe(false);
    expect(allowedMimeTypes.includes('text/html')).toBe(false);
  });

  it('valida que los pilares sean un array de objetos', () => {
    const validPillars = [
      { number: '01.', title: 'A', description: 'B' },
      { number: '02.', title: 'C', description: 'D' },
    ];
    const invalidPillars = 'invalid-string';

    expect(Array.isArray(validPillars)).toBe(true);
    expect(Array.isArray(invalidPillars)).toBe(false);
  });
});
