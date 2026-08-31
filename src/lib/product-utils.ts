export const CASA_AIRA_CATEGORIES = [
    {
        id: 'veraniego',
        aliases: ['brisa-calipso', 'verano', 'playa'],
        name: 'Brisa & Calipso',
        subtitle: 'LÍNEA VERANO & PLAYA',
        tag: 'Verano & Playa',
        color: 'from-calypso-600 to-teal-700',
        badgeColor: 'bg-calypso-600',
    },
    {
        id: 'gotico',
        aliases: ['solsticio-dorado', 'fiesta', 'gala'],
        name: 'Solsticio Dorado',
        subtitle: 'LÍNEA FIESTA & GALA',
        tag: 'Fiesta & Gala',
        color: 'from-gold-600 to-amber-700',
        badgeColor: 'bg-gold-500',
    },
    {
        id: 'primaveral',
        aliases: ['rosa-alba', 'romance', 'coctel', 'cocktail'],
        name: 'Rosa de Alba',
        subtitle: 'LÍNEA ROMANCE & CÓCTEL',
        tag: 'Romance & Cóctel',
        color: 'from-rose-500 to-pink-600',
        badgeColor: 'bg-rose-400',
    },
];

export const normalizeCategorySlug = (category?: string | null): string => {
    if (!category) return 'all';
    const clean = category.toLowerCase().trim();
    for (const cat of CASA_AIRA_CATEGORIES) {
        if (cat.id === clean || cat.aliases.includes(clean)) {
            return cat.id;
        }
    }
    return clean;
};

export const getCategoryColor = (category: string) => {
    const normalized = normalizeCategorySlug(category);
    switch (normalized) {
        case 'veraniego':
            return 'from-calypso-600 to-teal-700';
        case 'gotico':
            return 'from-gold-600 to-amber-700';
        case 'primaveral':
            return 'from-rose-500 to-pink-600';
        default:
            return 'from-stone-800 to-stone-900';
    }
};

export const getCategoryName = (category: string) => {
    const normalized = normalizeCategorySlug(category);
    switch (normalized) {
        case 'veraniego':
            return 'Brisa & Calipso';
        case 'gotico':
            return 'Solsticio Dorado';
        case 'primaveral':
            return 'Rosa de Alba';
        case 'all':
            return 'Todas las Colecciones';
        default:
            return category || 'Colección Especial';
    }
};

export const PRODUCT_COLORS: { [key: string]: string } = {
    'Negro': 'bg-black',
    'Blanco': 'bg-white border-stone-300',
    'Calipso': 'bg-calypso-600',
    'Dorado': 'bg-gold-500',
    'Borgoña': 'bg-red-900',
    'Azul Medianoche': 'bg-blue-900',
    'Rosa Suave': 'bg-pink-300',
    'Verde Menta': 'bg-green-300',
    'Lavanda': 'bg-purple-300',
    'Coral': 'bg-orange-400',
    'Turquesa': 'bg-teal-400',
    'Tierra': 'bg-amber-700',
    'Cobre': 'bg-orange-800',
    'Óxido': 'bg-red-800',
    'Azul Océano': 'bg-blue-600',
    'Verde Agua': 'bg-cyan-400',
    'Blanco Espuma': 'bg-white border-gray-300',
    'Verde Bosque': 'bg-green-800',
    'Rosa Salvaje': 'bg-pink-600',
    'Violeta': 'bg-purple-600',
    'Rojo': 'bg-red-600',
    'Gris': 'bg-gray-500',
    'Plata': 'bg-gray-300',
    'Marfil': 'bg-orange-50',
};

export const AVAILABLE_COLORS = Object.keys(PRODUCT_COLORS);

export const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'];

export const getColorClass = (color: string) => {
    return PRODUCT_COLORS[color] || 'bg-gray-400';
};
