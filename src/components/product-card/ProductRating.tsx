import { memo } from 'react';
import { Star } from 'lucide-react';

interface ProductRatingProps {
    rating: number | null;
    reviewsCount: number;
}

function ProductRating({ rating, reviewsCount }: ProductRatingProps) {
    if (!rating) return null;

    return (
        <div className='flex items-center gap-2 mb-4'>
            <div className='flex items-center'>
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
            <span className='text-sm text-gray-600'>
                {rating} ({reviewsCount} reseñas)
            </span>
        </div>
    );
}

export default memo(ProductRating);
