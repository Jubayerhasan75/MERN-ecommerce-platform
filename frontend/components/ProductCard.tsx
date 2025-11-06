import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { Heart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // This is the fix: Use the new function names
  const { addFavorite, removeFavorite, isFavorite } = useAppContext();
  const isFav = isFavorite(product._id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFav) {
      removeFavorite(product._id);
    } else {
      addFavorite(product);
    }
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-1 group">
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md z-10"
          >
            <Heart size={20} className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-500'} />
          </button>
          {hasDiscount && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
              SALE
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
          <div className="flex items-baseline space-x-2 mt-2">
            <p className="text-xl font-bold text-brand-dark">৳{product.price}</p>
            {hasDiscount && (
              <p className="text-sm text-gray-500 line-through">
                ৳{product.originalPrice}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;