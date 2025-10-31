import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';

// Category list
const CATEGORIES = ['All', 'Over Sized', 'Slim Fit'];

// Pagination settings
const PRODUCTS_PER_PAGE = 20; 

const CollectionPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');
  const [priceRange, setPriceRange] = useState(2000);
  const [sortBy, setSortBy] = useState('Recommended');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Unique color list ber kora
  const allColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach(product => {
      if (product.colors) {
        product.colors.forEach(color => colors.add(color));
      }
    });
    return ['All', ...Array.from(colors)];
  }, [products]);

  // Filter logic
  const filteredProducts = products
    .filter(product => 
      selectedCategory === 'All' || 
      (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase())
    )
    .filter(product =>
      selectedColor === 'All' ||
      (product.colors && product.colors.includes(selectedColor))
    )
    .filter(product => product.price <= priceRange);

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Price: Low to High') {
      return a.price - b.price;
    } else if (sortBy === 'Price: High to Low') {
      return b.price - a.price;
    }
    return 0;
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const productsForCurrentPage = sortedProducts.slice(startIndex, endIndex);

  // --- ⛔️ Shothik Fix (Bug #5): Page Change-er Shoy Scroll to Top ---
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      
      // Ei line-ti page-ke scroll kore shobar opore niye jabe
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // "smooth" effect-er jonno
      });
    }
  };
  // --- Pagination Logic Shesh ---

  if (loading) return <div className="p-20 text-center"><Loader2 size={48} className="animate-spin text-brand-accent" /></div>;
  if (error) return <div className="p-20 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* --- Filter Panel (Sidebar) --- */}
        <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit sticky top-24">
          <h2 className="text-2xl font-semibold mb-6">Filters</h2>
          
          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Category</h3>
            <div className="space-y-2">
              {CATEGORIES.map(category => (
                <div key={category} className="flex items-center">
                  <input
                    type="radio"
                    id={category}
                    name="category"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1); // Filter change korle 1st page-e ferot jabe
                    }}
                    className="h-4 w-4 text-brand-accent focus:ring-brand-accent border-gray-300"
                  />
                  <label htmlFor={category} className="ml-3 text-md text-gray-700">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Color</h3>
            <select
              value={selectedColor}
              onChange={(e) => {
                setSelectedColor(e.target.value);
                setCurrentPage(1); // Filter change korle 1st page-e ferot jabe
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent"
            >
              {allColors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Price Range</h3>
            <input
              type="range"
              min="300"
              max="2000"
              step="50"
              value={priceRange}
              onChange={(e) => {
                setPriceRange(Number(e.target.value));
                setCurrentPage(1); // Filter change korle 1st page-e ferot jabe
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-dark"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>৳300</span>
              <span>৳{priceRange}</span>
            </div>
          </div>

          {/* Sort By */}
          <div>
            <h3 className="text-lg font-medium mb-3">Sort by</h3>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1); // Filter change korle 1st page-e ferot jabe
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent"
            >
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* --- Product Grid --- */}
        <main className="lg:col-span-3">
          {productsForCurrentPage.length > 0 ? (
            <div>
              {/* Product Card-gulo ekhon ekhane show korbe */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                {productsForCurrentPage.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination Buttons */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-12">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  
                  <span className="text-md font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 text-xl py-20">
              No products match your criteria.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CollectionPage;