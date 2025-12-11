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
                {originalPrice && (
                    <span className='text-sm text-gray-500 line-through'>
                        ${originalPrice.toLocaleString('es-CL')}
                    </span>
                )}
                <span className='font-display text-3xl font-bold text-gradient-sensual'>
                    ${price.toLocaleString('es-CL')}
                </span>
            </div>
        </div>
    );
}

export default memo(ProductPrice);
