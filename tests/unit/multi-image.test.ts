import { describe, it, expect } from 'vitest';

describe('Lógica de Galería Multi-Image', () => {
  it('debe reordenar imágenes a la izquierda correctamente', () => {
    const images = ['foto1.webp', 'foto2.webp', 'foto3.webp'];
    const index = 1; // foto2
    const direction = 'left';

    const newIndex = direction === 'left' ? index - 1 : index + 1;
    const updated = [...images];
    const temp = updated[index];
    const target = updated[newIndex];
    if (temp && target) {
      updated[index] = target;
      updated[newIndex] = temp;
    }

    expect(updated).toEqual(['foto2.webp', 'foto1.webp', 'foto3.webp']);
  });

  it('debe establecer una foto seleccionada como la portada principal en la posición 0', () => {
    const images = ['foto1.webp', 'foto2.webp', 'foto3.webp'];
    const coverIndex = 2; // foto3

    const updated = images.filter((_, i) => i !== coverIndex);
    const coverImage = images[coverIndex];
    if (coverImage) {
      updated.unshift(coverImage);
    }

    expect(updated[0]).toBe('foto3.webp');
    expect(updated.length).toBe(3);
  });
});
