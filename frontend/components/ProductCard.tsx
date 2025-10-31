import React from 'react';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useAppContext();
  const favorite = isFavorite(product._id);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (favorite) {
      removeFromFavorites(product._id);
    } else {
      addToFavorites(product);
    }
  };

  // "0 Price" Bug Fix Logic
  const showDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    // --- ⛔️ Shothik Fix: Duration barano holo (300ms -> 500ms) ---
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl group hover:scale-105">
      <Link to={`/product/${product._id}`} className="block">
        
        <div className="relative">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-96 object-cover" // "Lomba Pic View"
          />
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-gray-500 hover:text-red-500 transition-colors"
          >
            <Heart size={20} fill={favorite ? 'currentColor' : 'none'} className={favorite ? 'text-red-500' : ''} />
          </button>
          
          {showDiscount && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
              SALE
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-brand-accent">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{product.category}</p>
          
          <div className="flex items-baseline space-x-2">
            <p className="text-xl font-bold text-brand-dark">৳{product.price}</p>
            
            {showDiscount && (
              <p className="text-md text-gray-400 line-through">৳{product.originalPrice}</p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;