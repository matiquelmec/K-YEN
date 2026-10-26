import { memo } from 'react';

interface ProductPriceProps {
    price: number;
    originalPrice?: number | null | undefined;
    className?: string;
}

function ProductPrice({ price, originalPrice, className = '' }: ProductPriceProps) {
    return (
        <div className={`text-right ${className}`}>
            <div className='flex flex-col items-end'>
                {originalPrice && originalPrice > price && (
                    <span className='text-[11px] sm:text-xs text-stone-400 line-through font-light'>
                        ${originalPrice.toLocaleString('es-CL')}
                    </span>
                )}
                <div className='flex items-baseline gap-1'>
                    <span
                        className='font-serif text-lg sm:text-xl font-normal text-[#181716] tracking-tight'
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        ${price.toLocaleString('es-CL')}
                    </span>
                    <span className='text-[9px] font-sans uppercase tracking-widest text-stone-400 font-medium'>
                        CLP
                    </span>
                </div>
            </div>
        </div>
    );
}

export default memo(ProductPrice);
