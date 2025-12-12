import type { Metadata } from 'next';
import { Playfair_Display, Inter, Dancing_Script } from 'next/font/google';

import { CartProvider } from '@/contexts/CartContext';
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
  title: 'KÜYEN - Donde la elegancia florece bajo la luna',
  description:
    'Descubre vestidos únicos que conectan con tu esencia femenina. Elegancia lunar, sensualidad natural, diseños que abrazan todas las tallas. KÜYEN - donde cada mujer encuentra su brillo.',
  keywords:
    'KÜYEN, vestidos elegantes, moda lunar, sensualidad femenina, tallas grandes, elegancia natural, vestidos nocturnos, moda inclusiva',
  authors: [{ name: 'KÜYEN' }],
  creator: 'KÜYEN - Donde la elegancia florece bajo la luna',
  openGraph: {
    title: 'KÜYEN - Elegancia que florece bajo la luna',
    description:
      'Vestidos que celebran la feminidad en todas sus formas, bajo el manto protector de la luna',
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
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
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            * {
              box-sizing: border-box;
            }
            
            html {
              height: 100%;
              overflow-x: hidden;
            }
            
            body { 
              margin: 0; 
              padding: 0; 
              background: linear-gradient(-45deg, #0f172a, #1e293b, #334155, #831843) !important;
              background-size: 400% 400% !important;
              animation: gradientAnimation 20s ease infinite !important;
              min-height: 100vh;
              height: 100%;
              overflow-x: hidden;
            }
            
            @keyframes gradientAnimation {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `,
          }}
        />
      </head>
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
