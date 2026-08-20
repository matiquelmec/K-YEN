'use client';

// Mapeo RGB de la paleta oficial de KÜYEN para matching de color
export const KUYEN_COLOR_MAP: Record<string, { r: number; g: number; b: number }> = {
  'Negro': { r: 15, g: 15, b: 15 },
  'Blanco': { r: 250, g: 250, b: 250 },
  'Borgoña': { r: 128, g: 0, b: 32 },
  'Rojo': { r: 220, g: 38, b: 38 },
  'Rosa Suave': { r: 255, g: 182, b: 193 },
  'Rosa Salvaje': { r: 219, g: 39, b: 119 },
  'Azul Medianoche': { r: 25, g: 25, b: 112 },
  'Azul Noche': { r: 15, g: 23, b: 42 },
  'Azul Océano': { r: 37, g: 99, b: 235 },
  'Lavanda': { r: 230, g: 230, b: 250 },
  'Violeta': { r: 147, g: 51, b: 234 },
  'Verde Menta': { r: 152, g: 251, b: 152 },
  'Verde Terra': { r: 22, g: 163, b: 74 },
  'Verde Bosque': { r: 22, g: 101, b: 52 },
  'Verde Agua': { r: 34, g: 211, b: 238 },
  'Dorado': { r: 245, g: 158, b: 11 },
  'Coral': { r: 251, g: 146, b: 60 },
  'Turquesa': { r: 45, g: 212, b: 191 },
  'Tierra': { r: 180, g: 83, b: 9 },
  'Cobre': { r: 154, g: 52, b: 18 },
  'Óxido': { r: 153, g: 27, b: 27 },
  'Gris': { r: 107, g: 114, b: 128 },
  'Plata': { r: 209, g: 213, b: 219 },
  'Marfil': { r: 255, g: 251, b: 235 }
};

/**
 * Calcula la distancia euclidiana ponderada para percepción humana del color
 */
function colorDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  const rmean = (r1 + r2) / 2;
  const r = r1 - r2;
  const g = g1 - g2;
  const b = b1 - b2;
  return Math.sqrt((((512 + rmean) * r * r) >> 8) + 4 * g * g + (((767 - rmean) * b * b) >> 8));
}

/**
 * Encuentra el color KÜYEN más cercano para un píxel RGB
 */
export function findClosestKuyenColor(r: number, g: number, b: number): string {
  let minDistance = Infinity;
  let closestColor = 'Negro';

  for (const [colorName, rgb] of Object.entries(KUYEN_COLOR_MAP)) {
    const dist = colorDistance(r, g, b, rgb.r, rgb.g, rgb.b);
    if (dist < minDistance) {
      minDistance = dist;
      closestColor = colorName;
    }
  }

  return closestColor;
}

/**
 * Extrae los colores dominantes de una imagen mediante HTML5 Canvas (100% Client-Side y Gratis)
 */
export async function extractDominantColorsFromImage(
  imageSource: File | Blob | string,
  maxColors = 3
): Promise<string[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve([]);
      return;
    }

    let urlToRevoke: string | null = null;
    let imageUrl = '';

    if (typeof imageSource === 'string') {
      imageUrl = imageSource;
    } else {
      imageUrl = URL.createObjectURL(imageSource);
      urlToRevoke = imageUrl;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      try {
        const sampleSize = 100;
        const canvas = document.createElement('canvas');
        canvas.width = sampleSize;
        canvas.height = sampleSize;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);
          resolve([]);
          return;
        }

        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
        const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize).data;

        const colorCounts: Record<string, number> = {};
        let validPixels = 0;

        // Recorremos los píxeles (paso de 4 para ultra-velocidad)
        for (let i = 0; i < imgData.length; i += 16) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          const a = imgData[i + 3];

          if (r === undefined || g === undefined || b === undefined || a === undefined) continue;

          // Ignorar píxeles transparentes
          if (a < 128) continue;

          // Ignorar fondos de estudio blancos o excesivamente claros si dominan la periferia
          if (r > 248 && g > 248 && b > 248) continue;

          const matchedColor = findClosestKuyenColor(r, g, b);
          colorCounts[matchedColor] = (colorCounts[matchedColor] || 0) + 1;
          validPixels++;
        }

        if (validPixels === 0) {
          if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);
          resolve([]);
          return;
        }

        // Ordenar colores por frecuencia y filtrar aquellos con presencia significativa (>= 8%)
        const sortedColors = Object.entries(colorCounts)
          .sort((a, b) => b[1] - a[1])
          .filter(([_, count]) => (count / validPixels) >= 0.08)
          .map(([color]) => color)
          .slice(0, maxColors);

        if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);
        resolve(sortedColors);
      } catch (err) {
        console.warn('Error extracting dominant colors:', err);
        if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);
        resolve([]);
      }
    };

    img.onerror = () => {
      if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);
      resolve([]);
    };

    img.src = imageUrl;
  });
}
