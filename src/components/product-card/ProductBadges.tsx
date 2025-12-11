import { memo } from 'react';

interface ProductBadgesProps {
    isNew?: boolean | undefined;
    isSale?: boolean | undefined;
    hasLargeSizes?: boolean | undefined;
}

function ProductBadges({ isNew, isSale, hasLargeSizes }: ProductBadgesProps) {
    if (!isNew && !isSale && !hasLargeSizes) return null;

    return (
        <div className='absolute top-4 left-4 flex flex-col gap-2'>
            {isNew && (
                <span className='px-3 py-1 bg-spring-500 text-white text-xs font-semibold rounded-full shadow-sm'>
                    Nuevo
                </span>
            )}
            {isSale && (
                <span className='px-3 py-1 bg-sensual-500 text-white text-xs font-semibold rounded-full shadow-sm'>
                    Oferta
                </span>
            )}
            {hasLargeSizes && (
                <span className='px-3 py-1 bg-earth-600 text-white text-xs font-semibold rounded-full shadow-sm'>
                    Tallas Grandes
                </span>
            )}
        </div>
    );
}

export default memo(ProductBadges);
