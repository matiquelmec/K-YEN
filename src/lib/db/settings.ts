import { turso } from './turso';
import { DEFAULT_STORE_SETTINGS, type StoreSettings } from '@/types/settings';
export { DEFAULT_STORE_SETTINGS, type StoreSettings };

let isSettingsTableInitialized = false;

/**
 * Inicializa la tabla store_settings de forma idempotente y siembra los datos por defecto
 */
export async function initSettingsTable(): Promise<void> {
  if (isSettingsTableInitialized) return;

  try {
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS store_settings (
        id TEXT PRIMARY KEY,
        contact_email TEXT NOT NULL,
        contact_phone TEXT NOT NULL,
        contact_whatsapp TEXT NOT NULL,
        instagram_url TEXT NOT NULL,
        facebook_url TEXT NOT NULL,
        tiktok_url TEXT NOT NULL,
        pinterest_url TEXT,
        address TEXT,
        announcement_text TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const countRes = await turso.execute('SELECT COUNT(*) as count FROM store_settings');
    const count = Number(countRes.rows[0]?.count || 0);

    if (count === 0) {
      await turso.execute({
        sql: `
          INSERT INTO store_settings (
            id, contact_email, contact_phone, contact_whatsapp,
            instagram_url, facebook_url, tiktok_url, pinterest_url,
            address, announcement_text
          ) VALUES (
            'main', ?, ?, ?, ?, ?, ?, ?, ?, ?
          )
        `,
        args: [
          DEFAULT_STORE_SETTINGS.contact_email,
          DEFAULT_STORE_SETTINGS.contact_phone,
          DEFAULT_STORE_SETTINGS.contact_whatsapp,
          DEFAULT_STORE_SETTINGS.instagram_url,
          DEFAULT_STORE_SETTINGS.facebook_url,
          DEFAULT_STORE_SETTINGS.tiktok_url,
          DEFAULT_STORE_SETTINGS.pinterest_url || null,
          DEFAULT_STORE_SETTINGS.address || null,
          DEFAULT_STORE_SETTINGS.announcement_text || null,
        ],
      });
    }

    isSettingsTableInitialized = true;
  } catch (error) {
    console.error('Error initializing store_settings table in Turso:', error);
  }
}

/**
 * Obtiene la configuración actual de la tienda, contacto y redes
 */
export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    await initSettingsTable();

    const res = await turso.execute("SELECT * FROM store_settings WHERE id = 'main' LIMIT 1");

    if (res.rows.length === 0) {
      return DEFAULT_STORE_SETTINGS;
    }

    const row = res.rows[0] as any;

    return {
      contact_email: String(row.contact_email || DEFAULT_STORE_SETTINGS.contact_email),
      contact_phone: String(row.contact_phone || DEFAULT_STORE_SETTINGS.contact_phone),
      contact_whatsapp: String(row.contact_whatsapp || DEFAULT_STORE_SETTINGS.contact_whatsapp),
      instagram_url: String(row.instagram_url || DEFAULT_STORE_SETTINGS.instagram_url),
      facebook_url: String(row.facebook_url || DEFAULT_STORE_SETTINGS.facebook_url),
      tiktok_url: String(row.tiktok_url || DEFAULT_STORE_SETTINGS.tiktok_url),
      pinterest_url: row.pinterest_url ? String(row.pinterest_url) : DEFAULT_STORE_SETTINGS.pinterest_url,
      address: row.address ? String(row.address) : DEFAULT_STORE_SETTINGS.address,
      announcement_text: row.announcement_text ? String(row.announcement_text) : DEFAULT_STORE_SETTINGS.announcement_text,
      updated_at: row.updated_at ? String(row.updated_at) : undefined,
    };
  } catch (error) {
    console.warn('Fallback a store_settings por defecto debido a error en base de datos:', error);
    return DEFAULT_STORE_SETTINGS;
  }
}

/**
 * Actualiza la configuración de la tienda, contacto y redes
 */
export async function updateStoreSettings(data: Partial<StoreSettings>): Promise<StoreSettings> {
  try {
    await initSettingsTable();

    const updates: string[] = [];
    const args: any[] = [];

    if (data.contact_email !== undefined) {
      updates.push('contact_email = ?');
      args.push(data.contact_email.trim().toLowerCase());
    }
    if (data.contact_phone !== undefined) {
      updates.push('contact_phone = ?');
      args.push(data.contact_phone.trim());
    }
    if (data.contact_whatsapp !== undefined) {
      updates.push('contact_whatsapp = ?');
      args.push(data.contact_whatsapp.replace(/\D/g, ''));
    }
    if (data.instagram_url !== undefined) {
      updates.push('instagram_url = ?');
      args.push(data.instagram_url.trim());
    }
    if (data.facebook_url !== undefined) {
      updates.push('facebook_url = ?');
      args.push(data.facebook_url.trim());
    }
    if (data.tiktok_url !== undefined) {
      updates.push('tiktok_url = ?');
      args.push(data.tiktok_url.trim());
    }
    if (data.pinterest_url !== undefined) {
      updates.push('pinterest_url = ?');
      args.push(data.pinterest_url.trim());
    }
    if (data.address !== undefined) {
      updates.push('address = ?');
      args.push(data.address.trim());
    }
    if (data.announcement_text !== undefined) {
      updates.push('announcement_text = ?');
      args.push(data.announcement_text.trim());
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    args.push('main');

    await turso.execute({
      sql: `UPDATE store_settings SET ${updates.join(', ')} WHERE id = ?`,
      args,
    });

    return await getStoreSettings();
  } catch (error) {
    console.error('Error updating store_settings in Turso:', error);
    throw error;
  }
}
