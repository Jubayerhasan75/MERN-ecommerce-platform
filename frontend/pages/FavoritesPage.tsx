import React from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { HeartOff } from 'lucide-react';

const FavoritesPage: React.FC = () => {
  const { favorites } = useAppContext();

  return (
    <div className="container mx-auto px-4 py-12 min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-8">My Favorites</h1>
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-500 h-64">
          <HeartOff size={48} className="mb-4" />
          <p className="text-xl">You have no favorite items yet.</p>
          <p>Click the heart on any product to save it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {favorites.map((product) => (
            // This is the fix: Use product._id, not product.id
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;