import { memo } from 'react';

interface ProductBadgesProps {
    isNew?: boolean | undefined;
    isSale?: boolean | undefined;
    hasLargeSizes?: boolean | undefined;
}

function ProductBadges({ isNew, isSale, hasLargeSizes }: ProductBadgesProps) {
    if (!isNew && !isSale && !hasLargeSizes) return null;

    return (
        <div className='absolute top-4 left-4 flex flex-col gap-1.5 z-10'>
            {isNew && (
                <span className='px-2.5 py-1 bg-[#181716] text-[#FAF8F5] text-[9px] font-semibold tracking-[0.2em] uppercase'>
                    NUEVO
                </span>
            )}
            {isSale && (
                <span className='px-2.5 py-1 bg-blush-600 text-white text-[9px] font-semibold tracking-[0.2em] uppercase'>
                    OFERTA
                </span>
            )}
            {hasLargeSizes && (
                <span className='px-2.5 py-1 bg-calypso-700 text-white text-[9px] font-semibold tracking-[0.2em] uppercase'>
                    CURVAS LIBRES
                </span>
            )}
        </div>
    );
}

export default memo(ProductBadges);
