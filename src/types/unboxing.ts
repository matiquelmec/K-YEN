export interface UnboxingFeature {
  id: string;
  icon: 'sparkles' | 'shield' | 'package' | 'heart';
  title: string;
  description: string;
  color: 'calypso' | 'gold' | 'blush' | 'stone';
}

export interface UnboxingData {
  badge: string;
  title_primary: string;
  title_highlight: string;
  description: string;
  image: string;
  image_badge: string;
  features: UnboxingFeature[];
  updated_at?: string | undefined;
}

export const DEFAULT_UNBOXING: UnboxingData = {
  badge: 'UN DETALLE ESPECIAL',
  title_primary: 'La emoción de recibir',
  title_highlight: 'tu nuevo vestido.',
  description:
    'Queremos que abrir tu paquete sea un momento lindo para ti. Cada pedido se prepara con cariño: envuelto en papel de seda, con un aroma suave y protegido para que llegue impecable a tus manos.',
  image: '/brand/unboxing-packaging.webp',
  image_badge: 'EXPERIENCIA BOUTIQUE',
  features: [
    {
      id: 'aroma',
      icon: 'sparkles',
      title: 'Aroma Delicado',
      description: 'Un toque de fragancia suave y fresca al abrirlo.',
      color: 'calypso',
    },
    {
      id: 'empaque',
      icon: 'shield',
      title: 'Empaque Seguro',
      description: 'Protegido para viajar por Starken o Chilexpress.',
      color: 'gold',
    },
    {
      id: 'bolsa',
      icon: 'package',
      title: 'Bolsa Boutique',
      description: 'Práctica y bonita para guardar o regalar.',
      color: 'blush',
    },
    {
      id: 'acompanamiento',
      icon: 'heart',
      title: 'Acompañamiento 1 a 1',
      description: 'Te avisamos del envío y te ayudamos si necesitas cambio.',
      color: 'stone',
    },
  ],
};
