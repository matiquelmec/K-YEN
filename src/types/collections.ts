export interface CollectionItem {
  id: string; // e.g. 'veraniego', 'gotico', 'primaveral'
  number: string; // e.g. '01', '02', '03'
  title: string; // e.g. 'Brisa & Calipso'
  subtitle: string; // e.g. 'LÍNEA VERANO & PLAYA'
  tag: string; // e.g. 'Verano & Playa'
  description: string;
  image: string; // e.g. '/brand/chapter-brisa-calipso.webp' or Cloudinary URL
  category_id: string; // links to category filter
  display_order: number;
  is_active: boolean;
  updated_at?: string | undefined;
}

export const DEFAULT_COLLECTIONS: CollectionItem[] = [
  {
    id: 'veraniego',
    number: '01',
    title: 'Brisa & Calipso',
    subtitle: 'LÍNEA VERANO & PLAYA',
    tag: 'Verano & Playa',
    description:
      'Linos frescos, cortes sueltos y tonos calipso inspirados en el mar. Vestidos cómodos y livianos para disfrutar los días de sol y calor.',
    image: '/brand/chapter-brisa-calipso.webp',
    category_id: 'veraniego',
    display_order: 1,
    is_active: true,
  },
  {
    id: 'gotico',
    number: '02',
    title: 'Solsticio Dorado',
    subtitle: 'LÍNEA FIESTA & GALA',
    tag: 'Fiesta & Gala',
    description:
      'Destellos en oro champagne, elegancia y calce perfecto. Siluetas elegidas para matrimonios, graduaciones y celebraciones especiales.',
    image: '/brand/chapter-solsticio-dorado.webp',
    category_id: 'gotico',
    display_order: 2,
    is_active: true,
  },
  {
    id: 'primaveral',
    number: '03',
    title: 'Rosa de Alba',
    subtitle: 'LÍNEA ROMANCE & CÓCTEL',
    tag: 'Romance & Cóctel',
    description:
      'Tonos rosa empolvado, telas suaves y caídas fluidas. Vestidos femeninos y versátiles ideales para salidas, cenas y eventos de día o tarde.',
    image: '/brand/chapter-rosa-alba.webp',
    category_id: 'primaveral',
    display_order: 3,
    is_active: true,
  },
];
