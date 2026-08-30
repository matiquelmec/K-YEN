export const APP_CONFIG = {
  name: 'Casa Aira',
  description: 'Elegancia, frescura y libertad en vestidos exclusivos de alta costura',
  version: '2.0.0',

  // URLs and endpoints
  urls: {
    base: process.env.NEXT_PUBLIC_APP_URL || 'https://kuyenchile.cl',
    api: process.env.NEXT_PUBLIC_API_URL || 'https://kuyenchile.cl/api',
  },

  // Database / Turso settings are loaded in src/lib/db/turso.ts

  // Performance settings
  performance: {
    imageOptimization: true,
    lazyLoading: true,
    preloadCritical: true,
    enableSWR: true,
  },

  // Feature flags
  features: {
    darkMode: false,
    wishlist: true,
    reviews: true,
    socialLogin: false,
    analytics: process.env.NODE_ENV === 'production',
  },

  // SEO
  seo: {
    defaultTitle: 'Casa Aira - Elegancia, Frescura y Libertad',
    titleTemplate: '%s | Casa Aira',
    defaultDescription:
      'Descubre vestidos únicos diseñados para celebrar tu libertad y elegancia. Diseños fluidos, paletas de calipso, dorado y rosa pastel que abrazan todas las tallas.',
    siteUrl: 'https://kuyenchile.cl',
    twitterHandle: '@casa_aira',
  },

  // Analytics
  analytics: {
    googleAnalytics: process.env.NEXT_PUBLIC_GA_ID || '',
    hotjar: process.env.NEXT_PUBLIC_HOTJAR_ID || '',
  },

  // Contact
  contact: {
    email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'contacto@kuyenchile.cl',
    phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || '+56 9 1234 5678',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+56912345678',
    support: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'contacto@kuyenchile.cl',
  },

  // Social media
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/casaaira_oficial',
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/casaaira.oficial',
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || 'https://tiktok.com/@casaaira_oficial',
    pinterest: process.env.NEXT_PUBLIC_PINTEREST_URL || 'https://pinterest.com/casaaira_oficial',
  },

  // Cache and performance
  cache: {
    revalidateProducts: 3600, // 1 hour
    revalidateCategories: 86400, // 24 hours
    maxAge: 31536000, // 1 year for static assets
  },

  // Pagination
  pagination: {
    productsPerPage: 12,
    maxItemsPerPage: 50,
  },

  // Product settings
  products: {
    maxImages: 8,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    maxImageSize: 5 * 1024 * 1024, // 5MB
    thumbnailSize: { width: 400, height: 600 },
    largeSize: { width: 800, height: 1200 },
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
