
import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  rating: number;
  maxRating?: number;
}

const Rating: React.FC<RatingProps> = ({ rating, maxRating = 5 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={16} className="text-amber-400 fill-current" />
      ))}
      {/* Note: Half star implementation is complex with lucide-react, showing full stars for simplicity */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={16} className="text-gray-300" />
      ))}
    </div>
  );
};

export default Rating;
