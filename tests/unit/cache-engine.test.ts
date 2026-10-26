import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  CACHE_TAGS,
  withTaggedCache,
  invalidateCacheTag,
  invalidateAllStoreCaches,
  memoryTagCache,
} from '@/lib/cache';

describe('Enterprise Cache Engine (L1/L2 Tagged Invalidation Tests)', () => {
  beforeEach(() => {
    memoryTagCache.clearAll();
  });

  it('debe ejecutar el fetcher en la primera llamada (Cache MISS) y reutilizar el dato en la segunda (Cache HIT)', async () => {
    let callCount = 0;
    const fetcher = vi.fn(async () => {
      callCount++;
      return { email: 'contacto@casaaira.cl', timestamp: callCount };
    });

    const key = 'test:settings:main';
    const tag = CACHE_TAGS.SETTINGS;

    // 1. Primera lectura: MISS -> ejecuta fetcher
    const res1 = await withTaggedCache(key, tag, fetcher, 3600);
    expect(res1.email).toBe('contacto@casaaira.cl');
    expect(res1.timestamp).toBe(1);
    expect(fetcher).toHaveBeenCalledTimes(1);

    // 2. Segunda lectura: HIT -> responde desde memoria en 0ms sin invocar fetcher
    const res2 = await withTaggedCache(key, tag, fetcher, 3600);
    expect(res2.email).toBe('contacto@casaaira.cl');
    expect(res2.timestamp).toBe(1);
    expect(fetcher).toHaveBeenCalledTimes(1); // Sigue siendo 1
  });

  it('debe purgar quirúrgicamente la caché al llamar a invalidateCacheTag sin afectar otros tags', async () => {
    let settingsCount = 0;
    const settingsFetcher = vi.fn(async () => {
      settingsCount++;
      return { email: `admin-${settingsCount}@casaaira.cl` };
    });

    let productsCount = 0;
    const productsFetcher = vi.fn(async () => {
      productsCount++;
      return [{ id: 'prod-1', stock: 10 - productsCount }];
    });

    // Poblar ambos caches
    await withTaggedCache('settings:item', CACHE_TAGS.SETTINGS, settingsFetcher, 3600);
    await withTaggedCache('products:item', CACHE_TAGS.PRODUCTS, productsFetcher, 3600);

    expect(settingsFetcher).toHaveBeenCalledTimes(1);
    expect(productsFetcher).toHaveBeenCalledTimes(1);

    // Invalidar ÚNICAMENTE el tag de SETTINGS
    await invalidateCacheTag(CACHE_TAGS.SETTINGS);

    // La lectura de SETTINGS debe ser MISS y volver a consultar la fuente de verdad
    const newSettings = await withTaggedCache('settings:item', CACHE_TAGS.SETTINGS, settingsFetcher, 3600);
    expect(newSettings.email).toBe('admin-2@casaaira.cl');
    expect(settingsFetcher).toHaveBeenCalledTimes(2);

    // La lectura de PRODUCTS debe permanecer intacta (HIT)
    const sameProducts = await withTaggedCache('products:item', CACHE_TAGS.PRODUCTS, productsFetcher, 3600);
    expect(sameProducts[0]?.stock).toBe(9);
    expect(productsFetcher).toHaveBeenCalledTimes(1); // No fue llamado nuevamente
  });

  it('debe expirar entradas que superen el TTL configurado', async () => {
    let count = 0;
    const fetcher = vi.fn(async () => {
      count++;
      return { count };
    });

    const key = 'test:expiring:key';
    const tag = CACHE_TAGS.MANIFESTO;

    // Guardar con TTL negativo o muy corto
    memoryTagCache.set(key, { count: 99 }, tag, -10);

    // Como ya expiró, withTaggedCache debe detectar la expiración y ejecutar el fetcher
    const fresh = await withTaggedCache(key, tag, fetcher, 3600);
    expect(fresh.count).toBe(1);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('debe limpiar todos los tags y métricas al invocar invalidateAllStoreCaches', async () => {
    await withTaggedCache('key1', CACHE_TAGS.SETTINGS, async () => 'data1', 3600);
    await withTaggedCache('key2', CACHE_TAGS.COLLECTIONS, async () => 'data2', 3600);

    const metricsBefore = memoryTagCache.getMetrics();
    expect(metricsBefore.entriesCount).toBe(2);

    await invalidateAllStoreCaches();

    const metricsAfter = memoryTagCache.getMetrics();
    expect(metricsAfter.entriesCount).toBe(0);
  });
});
