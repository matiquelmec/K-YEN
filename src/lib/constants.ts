export const SITE_CONFIG = {
  name: 'KÜYEN',
  description: 'Donde la elegancia florece bajo la luna',
  url: 'https://kuyen.cl',
  ogImage: '/og-image.png',
  links: {
    instagram: 'https://instagram.com/kuyen',
    facebook: 'https://facebook.com/kuyen',
    whatsapp: 'https://wa.me/56912345678',
  },
} as const;

export const PRODUCT_CATEGORIES = [
  { id: 'vestidos-noche', name: 'Vestidos de Noche', slug: 'vestidos-noche' },
  { id: 'vestidos-casual', name: 'Vestidos Casuales', slug: 'vestidos-casual' },
  {
    id: 'vestidos-fiesta',
    name: 'Vestidos de Fiesta',
    slug: 'vestidos-fiesta',
  },
  {
    id: 'vestidos-trabajo',
    name: 'Vestidos de Trabajo',
    slug: 'vestidos-trabajo',
  },
] as const;

export const PRODUCT_SIZES = [
  { id: 'xs', name: 'XS', measurements: { bust: 80, waist: 60, hips: 86 } },
  { id: 's', name: 'S', measurements: { bust: 84, waist: 64, hips: 90 } },
  { id: 'm', name: 'M', measurements: { bust: 88, waist: 68, hips: 94 } },
  { id: 'l', name: 'L', measurements: { bust: 92, waist: 72, hips: 98 } },
  { id: 'xl', name: 'XL', measurements: { bust: 96, waist: 76, hips: 102 } },
  { id: 'xxl', name: 'XXL', measurements: { bust: 100, waist: 80, hips: 106 } },
  { id: '3xl', name: '3XL', measurements: { bust: 104, waist: 84, hips: 110 } },
] as const;

export const PRODUCT_COLORS = [
  { id: 'negro', name: 'Negro', hex: '#000000' },
  { id: 'blanco', name: 'Blanco', hex: '#FFFFFF' },
  { id: 'azul-noche', name: 'Azul Noche', hex: '#0F172A' },
  { id: 'rosa-luna', name: 'Rosa Luna', hex: '#F8BBD9' },
  { id: 'verde-terra', name: 'Verde Terra', hex: '#16A34A' },
  { id: 'dorado-mystic', name: 'Dorado Místico', hex: '#F59E0B' },
] as const;

export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideIn: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
} as const;

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  xl: 1536,
} as const;
