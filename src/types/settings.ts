export interface StoreSettings {
  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  pinterest_url?: string | undefined;
  address?: string | undefined;
  announcement_text?: string | undefined;
  updated_at?: string | undefined;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  contact_email: 'contacto@kuyenchile.cl',
  contact_phone: '+56 9 1234 5678',
  contact_whatsapp: '56912345678',
  instagram_url: 'https://instagram.com/casaaira_oficial',
  facebook_url: 'https://facebook.com/casaaira.oficial',
  tiktok_url: 'https://tiktok.com/@casaaira_oficial',
  pinterest_url: 'https://pinterest.com/casaaira_oficial',
  address: 'Santiago & Punta Arenas, Chile',
  announcement_text: 'Envíos rápidos a todo Chile vía Starken y Chilexpress',
};
