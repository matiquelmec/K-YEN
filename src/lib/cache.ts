import { revalidateTag, revalidatePath, unstable_cache } from 'next/cache';

/**
 * Diccionario canónico de tags de caché para Casa Aira Boutique.
 * Permite invalidar quirúrgicamente fragmentos de datos sin purgar toda la aplicación.
 */
export const CACHE_TAGS = {
  SETTINGS: 'store-settings',
  COLLECTIONS: 'store-collections',
  MANIFESTO: 'store-manifesto',
  UNBOXING: 'store-unboxing',
  PRODUCTS: 'store-products',
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  tag: CacheTag;
  version: number;
}

/**
 * Capa L1: In-Memory Tag & Version Store.
 * Proporciona lecturas sub-milisegundo en la misma instancia y purga síncrona inmediata.
 */
class InMemoryTagCache {
  private cache = new Map<string, CacheEntry<any>>();
  private tagVersions = new Map<CacheTag, number>();

  constructor() {
    // Inicializar versiones de cada tag en 1
    Object.values(CACHE_TAGS).forEach((tag) => {
      this.tagVersions.set(tag, 1);
    });
  }

  getTagVersion(tag: CacheTag): number {
    return this.tagVersions.get(tag) || 1;
  }

  get<T>(key: string, tag: CacheTag): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Verificar si expiró por TTL
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Verificar si el tag fue invalidado (versión obsoleta)
    const currentVersion = this.getTagVersion(tag);
    if (entry.version !== currentVersion) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, tag: CacheTag, ttlSeconds: number): void {
    const currentVersion = this.getTagVersion(tag);
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
      tag,
      version: currentVersion,
    });
  }

  invalidateTag(tag: CacheTag): number {
    const nextVersion = (this.tagVersions.get(tag) || 1) + 1;
    this.tagVersions.set(tag, nextVersion);

    // Limpiar entradas asociadas al tag en L1
    let purgedCount = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tag === tag) {
        this.cache.delete(key);
        purgedCount++;
      }
    }
    return purgedCount;
  }

  clearAll(): void {
    this.cache.clear();
    Object.values(CACHE_TAGS).forEach((tag) => {
      this.tagVersions.set(tag, (this.tagVersions.get(tag) || 1) + 1);
    });
  }

  getMetrics() {
    return {
      entriesCount: this.cache.size,
      tagVersions: Object.fromEntries(this.tagVersions.entries()),
    };
  }
}

// Instancia singleton en memoria para el runtime de Node / Serverless Warm
export const memoryTagCache = new InMemoryTagCache();

/**
 * Envoltorio de caché híbrido de dos niveles:
 * 1. Nivel L1: Memoria RAM local (in-memory con TTL y versionado por tag).
 * 2. Nivel L2: Next.js Data Cache (unstable_cache con tags para revalidateTag).
 *
 * @param key Clave única del recurso (ej: 'settings:main', 'products:list:all')
 * @param tag Tag canónico de invalidación
 * @param fetcher Función que consulta Turso DB
 * @param ttlSeconds Tiempo de vida máximo en segundos (default 3600s / 1 hora)
 */
export async function withTaggedCache<T>(
  key: string,
  tag: CacheTag,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 3600
): Promise<T> {
  // 1. Chequeo L1 (Memoria local)
  const l1Data = memoryTagCache.get<T>(key, tag);
  if (l1Data !== null) {
    return l1Data;
  }

  // 2. Si estamos en entorno de testing o sin soporte unstable_cache, ejecutar fetcher directo y cachear en L1
  if (process.env.NODE_ENV === 'test' || typeof unstable_cache !== 'function') {
    const freshData = await fetcher();
    memoryTagCache.set(key, freshData, tag, ttlSeconds);
    return freshData;
  }

  // 3. Chequeo L2: Next.js Data Cache con tags
  try {
    const cachedFetcher = unstable_cache(
      async () => {
        return await fetcher();
      },
      [key],
      {
        revalidate: ttlSeconds,
        tags: [tag],
      }
    );

    const data = await cachedFetcher();
    memoryTagCache.set(key, data, tag, ttlSeconds);
    return data;
  } catch (err) {
    console.warn(`[Cache Warning] Fallback directo a fetcher para clave ${key}:`, err);
    const fallbackData = await fetcher();
    memoryTagCache.set(key, fallbackData, tag, ttlSeconds);
    return fallbackData;
  }
}

/**
 * Invalida quirúrgicamente un tag canónico en L1 (memoria), L2 (Next.js Data Cache)
 * y revalida las rutas visuales afectadas.
 *
 * @param tag Tag canónico a purgar
 * @param paths Rutas opcionales a revalidar inmediatamente (ej: ['/', '/catalogo'])
 */
export async function invalidateCacheTag(tag: CacheTag, paths: string[] = []): Promise<void> {
  // 1. Purga L1 inmediata
  memoryTagCache.invalidateTag(tag);

  // 2. Purga L2 (Next.js Data Cache) solo en runtime de servidor Next.js
  if (process.env.NODE_ENV !== 'test') {
    try {
      if (typeof revalidateTag === 'function') {
        (revalidateTag as any)(tag);
      }
    } catch (err) {
      console.warn(`[Cache Warning] Error en revalidateTag(${tag}):`, err);
    }
  }

  // 3. Revalidar rutas visuales
  if (paths.length > 0 && typeof revalidatePath === 'function') {
    for (const p of paths) {
      try {
        revalidatePath(p, 'page');
        revalidatePath(p, 'layout');
      } catch (err) {
        console.warn(`[Cache Warning] Error en revalidatePath(${p}):`, err);
      }
    }
  }
}

/**
 * Purga completa de todos los tags del sistema (para mantenimiento o forzado desde Admin)
 */
export async function invalidateAllStoreCaches(): Promise<void> {
  memoryTagCache.clearAll();

  if (process.env.NODE_ENV !== 'test') {
    const allTags = Object.values(CACHE_TAGS);
    for (const tag of allTags) {
      try {
        if (typeof revalidateTag === 'function') {
          (revalidateTag as any)(tag);
        }
      } catch {
        // ignore
      }
    }

    if (typeof revalidatePath === 'function') {
      try {
        revalidatePath('/', 'layout');
        revalidatePath('/catalogo', 'layout');
      } catch {
        // ignore
      }
    }
  }
}
