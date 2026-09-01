export interface PillarItem {
  number: string;
  title: string;
  description: string;
}

export interface ManifestoData {
  badge: string;
  title_primary: string;
  title_highlight: string;
  description: string;
  pillars: PillarItem[];
  // Advisory Card (Right Column)
  card_image: string;
  card_badge: string;
  card_subtitle: string;
  card_title: string;
  card_description: string;
  catalog_button_text: string;
  catalog_button_link: string;
  whatsapp_number: string;
  whatsapp_message: string;
  updated_at?: string | undefined;
}

export const DEFAULT_MANIFESTO: ManifestoData = {
  badge: 'NUESTRO COMPROMISO',
  title_primary: 'No fabricamos en masa;',
  title_highlight: 'elegimos cada vestido pensando en ti.',
  description:
    'En Casa Aira buscamos, tocamos y probamos vestidos de distintos talleres para traerte solo lo mejor: telas suaves, caídas hermosas y calce favorecedor desde la talla XS hasta la 6XL. Hacemos el trabajo de selección por ti para que solo te preocupes de lucir increíble.',
  pillars: [
    {
      number: '01.',
      title: 'Telas & Suavidad',
      description: 'Revisamos costuras, frescura y que la tela tenga una linda caída.',
    },
    {
      number: '02.',
      title: 'Calce Real',
      description: 'Probamos que cada corte favorezca y te permita moverte con libertad.',
    },
    {
      number: '03.',
      title: 'Pocas Unidades',
      description: 'Traemos stock limitado para que tu vestido sea único y especial.',
    },
  ],
  card_image: '/brand/manifesto-editorial.webp',
  card_badge: 'SELECCIÓN EXCLUSIVA',
  card_subtitle: 'ATENCIÓN & ASESORÍA',
  card_title: '¿Dudas con tu talla o el modelo?',
  card_description:
    'Queremos que compres con total tranquilidad. Escríbenos por WhatsApp y te ayudamos a revisar medidas, telas y disponibilidad para que aciertes a la primera.',
  catalog_button_text: 'Ver Catálogo',
  catalog_button_link: '/catalogo',
  whatsapp_number: '56912345678',
  whatsapp_message: 'Hola Casa Aira, me gustaría asesoría con la talla de un vestido',
};
