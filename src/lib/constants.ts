// Constantes de la aplicación Casa Aira Boutique

export const SITE_CONFIG = {
  name: 'Casa Aira',
  description: 'Vestidos de fiesta y ocasiones especiales seleccionados para todas las tallas (XS a 6XL)',
  url: 'https://casaaira.cl',
  ogImage: 'https://casaaira.cl/brand/manifesto-editorial.webp',
  links: {
    instagram: 'https://www.instagram.com/casa.airaa?mdxt=MW11bHQ5dHpvZDl2NA%3D%3D',
    whatsapp: 'https://api.whatsapp.com/send?phone=56985350038',
  },
};

export const NAVIGATION_ITEMS = [
  { name: 'Catálogo', href: '/catalogo' },
  { name: 'Brisa & Calipso', href: '/catalogo?category=veraniego' },
  { name: 'Solsticio Dorado', href: '/catalogo?category=gotico' },
  { name: 'Rosa de Alba', href: '/catalogo?category=primaveral' },
  { name: 'Nuestra Historia', href: '/#historia' },
];

export const CATEGORIES = [
  { id: 'veraniego', name: 'Brisa & Calipso', description: 'Frescura, movimiento y ligereza en tonos turquesa y esmeralda' },
  { id: 'gotico', name: 'Solsticio Dorado', description: 'Gala, sobriedad y acentos dorados para noches inolvidables' },
  { id: 'primaveral', name: 'Rosa de Alba', description: 'Romanticismo floral, suavidad y celebración primaveral' },
];

export const SIZES = [
  'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'
];

export const COLORS = [
  { name: 'Calipso', hex: '#1D707F', class: 'bg-[#1D707F]' },
  { name: 'Oro', hex: '#BFA15F', class: 'bg-[#BFA15F]' },
  { name: 'Rosa', hex: '#F8BBD9', class: 'bg-[#F8BBD9]' },
  { name: 'Negro', hex: '#181716', class: 'bg-[#181716]' },
  { name: 'Blanco', hex: '#FAF8F5', class: 'bg-[#FAF8F5]' },
  { name: 'Rojo', hex: '#B2583C', class: 'bg-[#B2583C]' },
  { name: 'Azul', hex: '#03839B', class: 'bg-[#03839B]' },
  { name: 'Verde', hex: '#16A34A', class: 'bg-[#16A34A]' },
];
