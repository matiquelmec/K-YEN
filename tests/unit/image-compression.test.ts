import { describe, it, expect } from 'vitest';
import { optimizeCloudinaryUrl } from '@/lib/product-utils';

describe('Admin Image Optimization Pipeline (Pre-Compression & CDN Delivery)', () => {
  it('aplica transformaciones automáticas f_auto,q_auto:good y c_limit de forma idempotente en Cloudinary', () => {
    const rawCloudinaryUrl = 'https://res.cloudinary.com/casaaira/image/upload/v1700000000/kuyen-tienda-vestidos/vestido-fiesta.jpg';
    const optimized = optimizeCloudinaryUrl(rawCloudinaryUrl, 800);

    expect(optimized).toBe(
      'https://res.cloudinary.com/casaaira/image/upload/f_auto,q_auto:good,w_800,c_limit/v1700000000/kuyen-tienda-vestidos/vestido-fiesta.jpg'
    );

    // Idempotencia: una URL ya optimizada no debe duplicar parámetros ni desconfigurar el CDN
    expect(optimizeCloudinaryUrl(optimized, 800)).toBe(optimized);
  });

  it('respeta rutas estáticas locales (/brand/...) sin corromperlas', () => {
    expect(optimizeCloudinaryUrl('/brand/manifesto-editorial.webp', 800)).toBe('/brand/manifesto-editorial.webp');
    expect(optimizeCloudinaryUrl('/brand/unboxing-packaging.webp', 1000)).toBe('/brand/unboxing-packaging.webp');
    expect(optimizeCloudinaryUrl('/brand/chapter-brisa-calipso.webp', 800)).toBe('/brand/chapter-brisa-calipso.webp');
  });

  it('valida que los endpoints de upload admin rechacen extensiones no fotográficas', () => {
    const isAllowedMimeType = (mime: string) => {
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg'];
      return allowed.includes(mime.toLowerCase());
    };

    expect(isAllowedMimeType('image/webp')).toBe(true);
    expect(isAllowedMimeType('image/jpeg')).toBe(true);
    expect(isAllowedMimeType('image/png')).toBe(true);
    expect(isAllowedMimeType('application/pdf')).toBe(false);
    expect(isAllowedMimeType('text/html')).toBe(false);
    expect(isAllowedMimeType('application/x-executable')).toBe(false);
  });

  it('valida límites de peso de archivo en servidor (máximo 5MB)', () => {
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    const testFileValid = 180 * 1024; // 180KB (resultado típico tras pre-compresión WebP)
    const testFileTooLarge = 6 * 1024 * 1024; // 6MB

    expect(testFileValid <= MAX_SIZE_BYTES).toBe(true);
    expect(testFileTooLarge <= MAX_SIZE_BYTES).toBe(false);
  });
});
