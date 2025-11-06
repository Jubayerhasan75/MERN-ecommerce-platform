import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import homeImg from '../assets/home.png'; // This line will now work

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        // Get only the first 4 products for the homepage
        setProducts(data.slice(0, 4));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[80vh] bg-gray-900 text-white">
        <img
          src={homeImg}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">New Collection is Here</h1>
          <p className="text-lg md:text-xl mb-8">Discover the latest trends in T-shirts.</p>
          <a
            href="/collection"
            className="px-8 py-3 bg-brand-primary text-gray-900 font-semibold rounded-md hover:bg-opacity-80 transition-colors"
          >
            Shop Now
          </a>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Featured Products</h2>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 size={40} className="animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              // This is the fix: Use product._id, not product.id
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;