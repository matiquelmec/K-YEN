import { turso } from './turso';
import { DEFAULT_COLLECTIONS, type CollectionItem } from '@/types/collections';
export { DEFAULT_COLLECTIONS, type CollectionItem };

let isTableInitialized = false;

/**
 * Inicializa la tabla de colecciones de forma idempotente y siembra los datos iniciales
 */
export async function initCollectionsTable(): Promise<void> {
  if (isTableInitialized) return;

  try {
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS collections (
        id TEXT PRIMARY KEY,
        number TEXT NOT NULL,
        title TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        tag TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        category_id TEXT NOT NULL,
        display_order INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Verificar si la tabla tiene datos, si no, sembrar los por defecto
    const countRes = await turso.execute('SELECT COUNT(*) as count FROM collections');
    const count = Number(countRes.rows[0]?.count || 0);

    if (count === 0) {
      for (const item of DEFAULT_COLLECTIONS) {
        await turso.execute({
          sql: `
            INSERT INTO collections (id, number, title, subtitle, tag, description, image, category_id, display_order, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            item.id,
            item.number,
            item.title,
            item.subtitle,
            item.tag,
            item.description,
            item.image,
            item.category_id,
            item.display_order,
            item.is_active ? 1 : 0,
          ],
        });
      }
    }

    isTableInitialized = true;
  } catch (error) {
    console.error('Error initializing collections table in Turso:', error);
  }
}

/**
 * Obtiene todas las colecciones activas ordenadas por display_order
 */
export async function getCollections(includeInactive = false): Promise<CollectionItem[]> {
  try {
    await initCollectionsTable();

    const sql = includeInactive
      ? 'SELECT * FROM collections ORDER BY display_order ASC'
      : 'SELECT * FROM collections WHERE is_active = 1 ORDER BY display_order ASC';

    const res = await turso.execute(sql);

    if (res.rows.length === 0) {
      return DEFAULT_COLLECTIONS;
    }

    return res.rows.map((row: any) => ({
      id: String(row.id),
      number: String(row.number),
      title: String(row.title),
      subtitle: String(row.subtitle),
      tag: String(row.tag),
      description: String(row.description),
      image: String(row.image),
      category_id: String(row.category_id),
      display_order: Number(row.display_order),
      is_active: Boolean(row.is_active),
      updated_at: row.updated_at ? String(row.updated_at) : undefined,
    }));
  } catch (error) {
    console.warn('Fallback a colecciones por defecto debido a error en base de datos:', error);
    return DEFAULT_COLLECTIONS;
  }
}

/**
 * Actualiza los datos de una colección existente
 */
export async function updateCollection(
  id: string,
  data: Partial<Omit<CollectionItem, 'id'>>
): Promise<CollectionItem | null> {
  try {
    await initCollectionsTable();

    const existingRes = await turso.execute({
      sql: 'SELECT * FROM collections WHERE id = ? LIMIT 1',
      args: [id],
    });

    if (existingRes.rows.length === 0) {
      // Si no existe en la base de datos pero está en los defaults, insertarlo primero
      const defaultItem = DEFAULT_COLLECTIONS.find((c) => c.id === id);
      if (defaultItem) {
        await turso.execute({
          sql: `
            INSERT INTO collections (id, number, title, subtitle, tag, description, image, category_id, display_order, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            defaultItem.id,
            defaultItem.number,
            defaultItem.title,
            defaultItem.subtitle,
            defaultItem.tag,
            defaultItem.description,
            defaultItem.image,
            defaultItem.category_id,
            defaultItem.display_order,
            defaultItem.is_active ? 1 : 0,
          ],
        });
      } else {
        return null;
      }
    }

    const updates: string[] = [];
    const args: any[] = [];

    if (data.title !== undefined) {
      updates.push('title = ?');
      args.push(data.title.trim());
    }
    if (data.subtitle !== undefined) {
      updates.push('subtitle = ?');
      args.push(data.subtitle.trim());
    }
    if (data.tag !== undefined) {
      updates.push('tag = ?');
      args.push(data.tag.trim());
    }
    if (data.description !== undefined) {
      updates.push('description = ?');
      args.push(data.description.trim());
    }
    if (data.image !== undefined) {
      updates.push('image = ?');
      args.push(data.image.trim());
    }
    if (data.number !== undefined) {
      updates.push('number = ?');
      args.push(data.number.trim());
    }
    if (data.category_id !== undefined) {
      updates.push('category_id = ?');
      args.push(data.category_id.trim());
    }
    if (data.is_active !== undefined) {
      updates.push('is_active = ?');
      args.push(data.is_active ? 1 : 0);
    }
    if (data.display_order !== undefined) {
      updates.push('display_order = ?');
      args.push(Number(data.display_order));
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    args.push(id);

    await turso.execute({
      sql: `UPDATE collections SET ${updates.join(', ')} WHERE id = ?`,
      args,
    });

    const updatedRes = await turso.execute({
      sql: 'SELECT * FROM collections WHERE id = ? LIMIT 1',
      args: [id],
    });

    const row = updatedRes.rows[0] as any;
    if (!row) return null;

    return {
      id: String(row.id),
      number: String(row.number),
      title: String(row.title),
      subtitle: String(row.subtitle),
      tag: String(row.tag),
      description: String(row.description),
      image: String(row.image),
      category_id: String(row.category_id),
      display_order: Number(row.display_order),
      is_active: Boolean(row.is_active),
      updated_at: String(row.updated_at),
    };
  } catch (error) {
    console.error('Error updating collection in Turso:', error);
    throw error;
  }
}
