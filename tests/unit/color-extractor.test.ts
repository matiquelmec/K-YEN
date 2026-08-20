import { describe, it, expect } from 'vitest';
import { findClosestKuyenColor, KUYEN_COLOR_MAP } from '@/lib/colorExtractor';

describe('Auto-Detector de Color (Canvas & Euclidean Color Matching)', () => {
  it('debe mapear correctamente un RGB oscuro a Negro o Azul Noche', () => {
    const matched = findClosestKuyenColor(10, 10, 12);
    expect(['Negro', 'Azul Noche']).toContain(matched);
  });

  it('debe mapear un tono vino tinto (RGB 130, 10, 35) a Borgoña', () => {
    const matched = findClosestKuyenColor(130, 10, 35);
    expect(matched).toBe('Borgoña');
  });

  it('debe mapear un tono verde esmeralda a Verde Terra o Verde Bosque', () => {
    const matched = findClosestKuyenColor(20, 160, 70);
    expect(['Verde Terra', 'Verde Bosque']).toContain(matched);
  });

  it('debe mapear un tono pastel lila a Lavanda', () => {
    const matched = findClosestKuyenColor(230, 225, 252);
    expect(matched).toBe('Lavanda');
  });

  it('debe contar con todos los colores oficiales mapeados', () => {
    expect(Object.keys(KUYEN_COLOR_MAP).length).toBeGreaterThan(15);
  });
});
