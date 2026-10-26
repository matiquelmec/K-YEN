import type { Metadata } from 'next';
import { Playfair_Display, Inter, Dancing_Script } from 'next/font/google';

import { CartProvider } from '@/contexts/CartContext';
import WhatsAppConciergeFloat from '@/components/ui/WhatsAppConciergeFloat';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const dancing = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-dancing',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kuyenchile.cl'),
  title: {
    default: 'Casa Aira - Boutique | Elegancia & Libertad en Vestidos',
    template: '%s | Casa Aira',
  },
  description:
    'Boutique de vestidos exclusivos seleccionados con los más altos estándares de calidad y caída. Diseños fluidos que abrazan todas las tallas de XS a 6XL con despacho a todo Chile.',
  keywords: [
    'Casa Aira',
    'vestidos boutique chile',
    'vestidos elegantes chile',
    'vestidos calipso',
    'vestidos fiesta chile',
    'vestidos tallas grandes',
    'moda inclusiva chile',
    'vestidos de gala y noche',
  ],
  authors: [{ name: 'Casa Aira' }],
  creator: 'Casa Aira Boutique',
  publisher: 'Casa Aira',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: 'https://kuyenchile.cl',
    siteName: 'Casa Aira',
    title: 'Casa Aira - Boutique | Elegancia, Frescura y Libertad',
    description:
      'Descubre vestidos únicos de selección exclusiva diseñados para celebrar tu esencia en todas las tallas.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Casa Aira - Boutique',
    description: 'Vestidos de selección exclusiva con despacho a todo Chile.',
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/brand/favicon.svg', type: 'image/svg+xml' },
      { url: '/brand/casa-aira_isotipo_color.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Casa Aira',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='es'
      className={`${playfair.variable} ${inter.variable} ${dancing.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className="bg-[#FAF8F5] text-[#181716] antialiased min-h-screen">
        <CartProvider>
          {children}
          <WhatsAppConciergeFloat />
        </CartProvider>
      </body>
    </html>
  );
}
