import { turso } from './turso';
import { DEFAULT_UNBOXING, type UnboxingData, type UnboxingFeature } from '@/types/unboxing';
export { DEFAULT_UNBOXING, type UnboxingData, type UnboxingFeature };

let isUnboxingTableInitialized = false;

/**
 * Inicializa la tabla unboxing_settings de forma idempotente y siembra los datos por defecto
 */
export async function initUnboxingTable(): Promise<void> {
  if (isUnboxingTableInitialized) return;

  try {
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS unboxing_settings (
        id TEXT PRIMARY KEY,
        badge TEXT NOT NULL,
        title_primary TEXT NOT NULL,
        title_highlight TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        image_badge TEXT NOT NULL,
        features_json TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const countRes = await turso.execute('SELECT COUNT(*) as count FROM unboxing_settings');
    const count = Number(countRes.rows[0]?.count || 0);

    if (count === 0) {
      await turso.execute({
        sql: `
          INSERT INTO unboxing_settings (
            id, badge, title_primary, title_highlight, description, image, image_badge, features_json
          ) VALUES (
            'main', ?, ?, ?, ?, ?, ?, ?
          )
        `,
        args: [
          DEFAULT_UNBOXING.badge,
          DEFAULT_UNBOXING.title_primary,
          DEFAULT_UNBOXING.title_highlight,
          DEFAULT_UNBOXING.description,
          DEFAULT_UNBOXING.image,
          DEFAULT_UNBOXING.image_badge,
          JSON.stringify(DEFAULT_UNBOXING.features),
        ],
      });
    }

    isUnboxingTableInitialized = true;
  } catch (error) {
    console.error('Error initializing unboxing_settings table in Turso:', error);
  }
}

/**
 * Obtiene la configuración actual de la experiencia de unboxing
 */
export async function getUnboxingSettings(): Promise<UnboxingData> {
  try {
    await initUnboxingTable();

    const res = await turso.execute("SELECT * FROM unboxing_settings WHERE id = 'main' LIMIT 1");

    if (res.rows.length === 0) {
      return DEFAULT_UNBOXING;
    }

    const row = res.rows[0] as any;
    let features: UnboxingFeature[] = DEFAULT_UNBOXING.features;

    try {
      if (row.features_json) {
        features = JSON.parse(String(row.features_json));
      }
    } catch (parseErr) {
      console.warn('Error parsing features_json, using default:', parseErr);
    }

    return {
      badge: String(row.badge || DEFAULT_UNBOXING.badge),
      title_primary: String(row.title_primary || DEFAULT_UNBOXING.title_primary),
      title_highlight: String(row.title_highlight || DEFAULT_UNBOXING.title_highlight),
      description: String(row.description || DEFAULT_UNBOXING.description),
      image: String(row.image || DEFAULT_UNBOXING.image),
      image_badge: String(row.image_badge || DEFAULT_UNBOXING.image_badge),
      features,
      updated_at: row.updated_at ? String(row.updated_at) : undefined,
    };
  } catch (error) {
    console.warn('Fallback a unboxing por defecto debido a error en base de datos:', error);
    return DEFAULT_UNBOXING;
  }
}

/**
 * Actualiza la configuración de la experiencia de unboxing
 */
export async function updateUnboxingSettings(data: Partial<UnboxingData>): Promise<UnboxingData> {
  try {
    await initUnboxingTable();

    const updates: string[] = [];
    const args: any[] = [];

    if (data.badge !== undefined) {
      updates.push('badge = ?');
      args.push(data.badge.trim());
    }
    if (data.title_primary !== undefined) {
      updates.push('title_primary = ?');
      args.push(data.title_primary.trim());
    }
    if (data.title_highlight !== undefined) {
      updates.push('title_highlight = ?');
      args.push(data.title_highlight.trim());
    }
    if (data.description !== undefined) {
      updates.push('description = ?');
      args.push(data.description.trim());
    }
    if (data.image !== undefined) {
      updates.push('image = ?');
      args.push(data.image.trim());
    }
    if (data.image_badge !== undefined) {
      updates.push('image_badge = ?');
      args.push(data.image_badge.trim());
    }
    if (data.features !== undefined) {
      updates.push('features_json = ?');
      args.push(JSON.stringify(data.features));
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    args.push('main');

    await turso.execute({
      sql: `UPDATE unboxing_settings SET ${updates.join(', ')} WHERE id = ?`,
      args,
    });

    return await getUnboxingSettings();
  } catch (error) {
    console.error('Error updating unboxing_settings in Turso:', error);
    throw error;
  }
}
