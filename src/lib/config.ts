export const APP_CONFIG = {
  name: 'KÜYEN',
  description: 'Donde la elegancia florece bajo la luna',
  version: '1.0.0',

  // URLs and endpoints
  urls: {
    base:
      process.env.NODE_ENV === 'production'
        ? 'https://kuyen.cl'
        : 'http://localhost:3000',
    api:
      process.env.NODE_ENV === 'production'
        ? 'https://api.kuyen.cl'
        : 'http://localhost:3001',
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
    darkMode: true,
    wishlist: true,
    reviews: true,
    socialLogin: false,
    analytics: process.env.NODE_ENV === 'production',
  },

  // SEO
  seo: {
    defaultTitle: 'KÜYEN - Elegancia que florece bajo la luna',
    titleTemplate: '%s | KÜYEN',
    defaultDescription:
      'Descubre vestidos únicos que conectan con tu esencia femenina. Elegancia lunar, sensualidad natural, diseños que abrazan todas las tallas.',
    siteUrl: 'https://kuyen.cl',
    twitterHandle: '@kuyen_oficial',
  },

  // Analytics
  analytics: {
    googleAnalytics: process.env.NEXT_PUBLIC_GA_ID || '',
    hotjar: process.env.NEXT_PUBLIC_HOTJAR_ID || '',
  },

  // Contact
  contact: {
    email: 'hola@kuyen.cl',
    phone: '+56 9 1234 5678',
    whatsapp: '+56912345678',
    support: 'soporte@kuyen.cl',
  },

  // Social media
  social: {
    instagram: 'https://instagram.com/kuyen_oficial',
    facebook: 'https://facebook.com/kuyen.oficial',
    tiktok: 'https://tiktok.com/@kuyen_oficial',
    pinterest: 'https://pinterest.com/kuyen_oficial',
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
