export const APP_CONFIG = {
  name: 'Casa Aira',
  description: 'Elegancia, frescura y libertad en vestidos exclusivos de alta costura',
  version: '2.0.0',

  // URLs and endpoints
  urls: {
    base: process.env.NEXT_PUBLIC_APP_URL || 'https://casaaira.cl',
    api: process.env.NEXT_PUBLIC_API_URL || 'https://casaaira.cl/api',
  },

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
    siteUrl: 'https://casaaira.cl',
    twitterHandle: '@casa_aira',
  },

  // Analytics
  analytics: {
    googleAnalytics: process.env.NEXT_PUBLIC_GA_ID || '',
    hotjar: process.env.NEXT_PUBLIC_HOTJAR_ID || '',
  },

  // Contact
  contact: {
    email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'contacto@casaaira.cl',
    phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || '+56 9 8535 0038',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+56985350038',
    support: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'contacto@casaaira.cl',
  },

  // Social media
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/casa.airaa?mdxt=MW11bHQ5dHpvZDl2NA%3D%3D',
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || '',
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || '',
    pinterest: process.env.NEXT_PUBLIC_PINTEREST_URL || '',
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
