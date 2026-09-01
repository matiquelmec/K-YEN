import { turso } from './turso';
import { DEFAULT_MANIFESTO, type ManifestoData, type PillarItem } from '@/types/manifesto';
export { DEFAULT_MANIFESTO, type ManifestoData, type PillarItem };

let isManifestoTableInitialized = false;

/**
 * Inicializa la tabla manifesto_settings de forma idempotente y siembra los datos por defecto
 */
export async function initManifestoTable(): Promise<void> {
  if (isManifestoTableInitialized) return;

  try {
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS manifesto_settings (
        id TEXT PRIMARY KEY,
        badge TEXT NOT NULL,
        title_primary TEXT NOT NULL,
        title_highlight TEXT NOT NULL,
        description TEXT NOT NULL,
        pillars_json TEXT NOT NULL,
        card_image TEXT NOT NULL,
        card_badge TEXT NOT NULL,
        card_subtitle TEXT NOT NULL,
        card_title TEXT NOT NULL,
        card_description TEXT NOT NULL,
        catalog_button_text TEXT NOT NULL,
        catalog_button_link TEXT NOT NULL,
        whatsapp_number TEXT NOT NULL,
        whatsapp_message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const countRes = await turso.execute('SELECT COUNT(*) as count FROM manifesto_settings');
    const count = Number(countRes.rows[0]?.count || 0);

    if (count === 0) {
      await turso.execute({
        sql: `
          INSERT INTO manifesto_settings (
            id, badge, title_primary, title_highlight, description, pillars_json,
            card_image, card_badge, card_subtitle, card_title, card_description,
            catalog_button_text, catalog_button_link, whatsapp_number, whatsapp_message
          ) VALUES (
            'main', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
          )
        `,
        args: [
          DEFAULT_MANIFESTO.badge,
          DEFAULT_MANIFESTO.title_primary,
          DEFAULT_MANIFESTO.title_highlight,
          DEFAULT_MANIFESTO.description,
          JSON.stringify(DEFAULT_MANIFESTO.pillars),
          DEFAULT_MANIFESTO.card_image,
          DEFAULT_MANIFESTO.card_badge,
          DEFAULT_MANIFESTO.card_subtitle,
          DEFAULT_MANIFESTO.card_title,
          DEFAULT_MANIFESTO.card_description,
          DEFAULT_MANIFESTO.catalog_button_text,
          DEFAULT_MANIFESTO.catalog_button_link,
          DEFAULT_MANIFESTO.whatsapp_number,
          DEFAULT_MANIFESTO.whatsapp_message,
        ],
      });
    }

    isManifestoTableInitialized = true;
  } catch (error) {
    console.error('Error initializing manifesto_settings table in Turso:', error);
  }
}

/**
 * Obtiene la configuración actual del manifiesto y asesoría
 */
export async function getManifestoSettings(): Promise<ManifestoData> {
  try {
    await initManifestoTable();

    const res = await turso.execute("SELECT * FROM manifesto_settings WHERE id = 'main' LIMIT 1");

    if (res.rows.length === 0) {
      return DEFAULT_MANIFESTO;
    }

    const row = res.rows[0] as any;
    let pillars: PillarItem[] = DEFAULT_MANIFESTO.pillars;

    try {
      if (row.pillars_json) {
        pillars = JSON.parse(String(row.pillars_json));
      }
    } catch (parseErr) {
      console.warn('Error parsing pillars_json, using default:', parseErr);
    }

    return {
      badge: String(row.badge || DEFAULT_MANIFESTO.badge),
      title_primary: String(row.title_primary || DEFAULT_MANIFESTO.title_primary),
      title_highlight: String(row.title_highlight || DEFAULT_MANIFESTO.title_highlight),
      description: String(row.description || DEFAULT_MANIFESTO.description),
      pillars,
      card_image: String(row.card_image || DEFAULT_MANIFESTO.card_image),
      card_badge: String(row.card_badge || DEFAULT_MANIFESTO.card_badge),
      card_subtitle: String(row.card_subtitle || DEFAULT_MANIFESTO.card_subtitle),
      card_title: String(row.card_title || DEFAULT_MANIFESTO.card_title),
      card_description: String(row.card_description || DEFAULT_MANIFESTO.card_description),
      catalog_button_text: String(row.catalog_button_text || DEFAULT_MANIFESTO.catalog_button_text),
      catalog_button_link: String(row.catalog_button_link || DEFAULT_MANIFESTO.catalog_button_link),
      whatsapp_number: String(row.whatsapp_number || DEFAULT_MANIFESTO.whatsapp_number),
      whatsapp_message: String(row.whatsapp_message || DEFAULT_MANIFESTO.whatsapp_message),
      updated_at: row.updated_at ? String(row.updated_at) : undefined,
    };
  } catch (error) {
    console.warn('Fallback a manifiesto por defecto debido a error en base de datos:', error);
    return DEFAULT_MANIFESTO;
  }
}

/**
 * Actualiza la configuración del manifiesto y asesoría
 */
export async function updateManifestoSettings(data: Partial<ManifestoData>): Promise<ManifestoData> {
  try {
    await initManifestoTable();

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
    if (data.pillars !== undefined) {
      updates.push('pillars_json = ?');
      args.push(JSON.stringify(data.pillars));
    }
    if (data.card_image !== undefined) {
      updates.push('card_image = ?');
      args.push(data.card_image.trim());
    }
    if (data.card_badge !== undefined) {
      updates.push('card_badge = ?');
      args.push(data.card_badge.trim());
    }
    if (data.card_subtitle !== undefined) {
      updates.push('card_subtitle = ?');
      args.push(data.card_subtitle.trim());
    }
    if (data.card_title !== undefined) {
      updates.push('card_title = ?');
      args.push(data.card_title.trim());
    }
    if (data.card_description !== undefined) {
      updates.push('card_description = ?');
      args.push(data.card_description.trim());
    }
    if (data.catalog_button_text !== undefined) {
      updates.push('catalog_button_text = ?');
      args.push(data.catalog_button_text.trim());
    }
    if (data.catalog_button_link !== undefined) {
      updates.push('catalog_button_link = ?');
      args.push(data.catalog_button_link.trim());
    }
    if (data.whatsapp_number !== undefined) {
      updates.push('whatsapp_number = ?');
      args.push(data.whatsapp_number.replace(/\D/g, ''));
    }
    if (data.whatsapp_message !== undefined) {
      updates.push('whatsapp_message = ?');
      args.push(data.whatsapp_message.trim());
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    args.push('main');

    await turso.execute({
      sql: `UPDATE manifesto_settings SET ${updates.join(', ')} WHERE id = ?`,
      args,
    });

    return await getManifestoSettings();
  } catch (error) {
    console.error('Error updating manifesto_settings in Turso:', error);
    throw error;
  }
}
