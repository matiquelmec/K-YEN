export const getCategoryColor = (category: string) => {
    switch (category) {
        case 'gotico':
            return 'from-gothic-600 to-sensual-600';
        case 'primaveral':
            return 'from-spring-500 to-earth-500';
        case 'veraniego':
            return 'from-earth-500 to-sensual-500';
        default:
            return 'from-earth-600 to-sensual-600';
    }
};

export const getCategoryName = (category: string) => {
    switch (category) {
        case 'gotico':
            return 'Luna Nueva';
        case 'primaveral':
            return 'Eclipse Floral';
        case 'veraniego':
            return 'Solsticio';
        default:
            return category;
    }
};

export const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
        Negro: 'bg-black',
        Borgoña: 'bg-red-900',
        'Azul Medianoche': 'bg-blue-900',
        'Rosa Suave': 'bg-pink-300',
        'Verde Menta': 'bg-green-300',
        Lavanda: 'bg-purple-300',
        Dorado: 'bg-yellow-500',
        Coral: 'bg-orange-400',
        Turquesa: 'bg-teal-400',
        Tierra: 'bg-amber-700',
        Cobre: 'bg-orange-800',
        Óxido: 'bg-red-800',
        'Azul Océano': 'bg-blue-600',
        'Verde Agua': 'bg-cyan-400',
        'Blanco Espuma': 'bg-white border-gray-300',
        'Verde Bosque': 'bg-green-800',
        'Rosa Salvaje': 'bg-pink-600',
        Violeta: 'bg-purple-600',
    };
    return colorMap[color] || 'bg-gray-400';
};
