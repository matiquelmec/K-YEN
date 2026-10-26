import { MetadataRoute } from 'next';
import { dbGetProducts } from '@/lib/db/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://casaaira.cl';

  // Base routes
  const routes = [
    '',
    '/catalogo',
    '/politicas',
    '/checkout',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : (route === '/catalogo' ? 0.9 : 0.6),
  }));

  // Dynamic routes for catalog products
  try {
    const products = await dbGetProducts();
    const productRoutes = products.map((product) => ({
      url: `${baseUrl}/catalogo/${product.slug || product.id}`,
      lastModified: product.updated_at || new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...routes, ...productRoutes];
  } catch (error) {
    console.error('⚠️ Failed to fetch products for sitemap from Turso directly, returning static routes:', error);
    return routes;
  }
}
