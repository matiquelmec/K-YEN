import { describe, it, expect } from 'vitest';
import { DEFAULT_STORE_SETTINGS, type StoreSettings } from '@/types/settings';

describe('Store Settings & Social Media Module Integrity Tests', () => {
  it('contiene la estructura por defecto completa de Casa Aira', () => {
    expect(DEFAULT_STORE_SETTINGS.contact_email).toBeTruthy();
    expect(DEFAULT_STORE_SETTINGS.instagram_url).toBeTruthy();
    expect(DEFAULT_STORE_SETTINGS.facebook_url).toBeTruthy();
    expect(DEFAULT_STORE_SETTINGS.tiktok_url).toBeTruthy();
    expect(DEFAULT_STORE_SETTINGS.contact_whatsapp).toBeTruthy();
  });

  it('valida que el correo por defecto tenga formato de email válido', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test(DEFAULT_STORE_SETTINGS.contact_email)).toBe(true);
  });

  it('valida que las URLs sociales comiencen con protocolo HTTPS seguro', () => {
    expect(DEFAULT_STORE_SETTINGS.instagram_url.startsWith('https://')).toBe(true);
    expect(DEFAULT_STORE_SETTINGS.facebook_url.startsWith('https://')).toBe(true);
    expect(DEFAULT_STORE_SETTINGS.tiktok_url.startsWith('https://')).toBe(true);
  });
});

describe('Store Settings Security & Validation Logic', () => {
  it('rechaza correos electrónicos con formatos maliciosos o inválidos', () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    expect(emailRegex.test('contacto@casaaira.cl')).toBe(true);
    expect(emailRegex.test('soporte.boutique@gmail.com')).toBe(true);
    expect(emailRegex.test('invalido-sin-arroba.com')).toBe(false);
    expect(emailRegex.test('contacto@sin-dominio')).toBe(false);
    expect(emailRegex.test('<script>alert(1)</script>@test.com')).toBe(false);
  });

  it('bloquea URLs inseguras o esquemas de inyección', () => {
    const isSecureUrl = (urlStr: string) => {
      try {
        const parsed = new URL(urlStr);
        return parsed.protocol === 'https:' || parsed.protocol === 'http:';
      } catch {
        return false;
      }
    };

    expect(isSecureUrl('https://instagram.com/casaaira')).toBe(true);
    expect(isSecureUrl('https://facebook.com/casaaira')).toBe(true);
    expect(isSecureUrl('javascript:alert(1)')).toBe(false);
    expect(isSecureUrl('data:text/html;base64,...')).toBe(false);
    expect(isSecureUrl('not-a-valid-url')).toBe(false);
  });

  it('sanitiza números de WhatsApp eliminando espacios, guiones y caracteres no numéricos', () => {
    const sanitizePhone = (raw: string) => raw.replace(/\D/g, '');

    expect(sanitizePhone('+56 9 1234 5678')).toBe('56912345678');
    expect(sanitizePhone('56-9-8765-4321')).toBe('56987654321');
    expect(sanitizePhone('  56911223344  ')).toBe('56911223344');
  });
});
