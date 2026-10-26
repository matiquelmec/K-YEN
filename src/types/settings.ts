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
  contact_phone: '+56 9 8535 0038',
  contact_whatsapp: '56985350038',
  instagram_url: 'https://www.instagram.com/casa.airaa?mdxt=MW11bHQ5dHpvZDl2NA%3D%3D',
  facebook_url: '',
  tiktok_url: '',
  pinterest_url: '',
  address: 'Santiago & Punta Arenas, Chile',
  announcement_text: 'Envíos rápidos a todo Chile vía Starken y Chilexpress',
};
