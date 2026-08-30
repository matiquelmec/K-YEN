import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Casa Aira - Boutique',
    short_name: 'Casa Aira',
    description: 'Elegancia, frescura y libertad en vestidos de selección exclusiva.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF8F5',
    theme_color: '#FAF8F5',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/brand/casa-aira-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
