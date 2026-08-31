/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix workspace root warning
  outputFileTracingRoot: __dirname,
  
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Security headers & CSP (Estándar JoyasJP)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self' https://*.vercel.app",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdk.mercadopago.com https://http2.mlstatic.com https://*.vercel.app https://vercel.live",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.vercel.app https://vercel.live",
              "img-src 'self' data: blob: https: res.cloudinary.com images.unsplash.com https://http2.mlstatic.com https://*.vercel.app",
              "font-src 'self' data: https://fonts.gstatic.com https://*.vercel.app https://vercel.live",
              "connect-src 'self' https: wss: *.turso.io https://api.mercadopago.com https://*.vercel.app https://vercel.live https://vercel.com",
              "frame-src 'self' https://sdk.mercadopago.com https://www.mercadopago.cl https://*.vercel.app https://vercel.live",
              "manifest-src 'self' https: https://*.vercel.app https://vercel.com blob: data:",
              "object-src 'none'",
              "base-uri 'self'"
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ],
      },
    ];
  },
};

module.exports = nextConfig;