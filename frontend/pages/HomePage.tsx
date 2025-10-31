import React, { useState, useEffect } from 'react'; // <-- useState, useEffect ইম্পোর্ট করুন
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
// import { products } from '../data/products'; // <-- এই পুরনো লাইনটি ডিলিট করুন
import { fetchProducts } from '../data/products'; // <-- এই নতুন লাইনটি অ্যাড করুন
import { Product } from '../types'; // <-- Product টাইপ ইম্পোর্ট করুন
import homeImg from '../assets/home.png'; 

const HomePage: React.FC = () => {
  // --- নতুন কোড শুরু ---
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const data = await fetchProducts(); // ব্যাকএন্ড থেকে ডেটা আনুন
      setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, []);
  // --- নতুন কোড শেষ ---

  // এই লাইনটি এখন state থেকে ডেটা নিচ্ছে, যা সঠিক
  const featuredProducts = products.slice(0, 5);

  return (
    <div>
      {/* Hero Section (এটি অপরিবর্তিত থাকবে) */}
      <section
        className="relative h-[60vh] md:h-[80vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: `url(${homeImg})` }} 
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center p-4">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4 tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Up to 70% OFF on Premium T-Shirts
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Starts from ৳300 only!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link to="/collection">
              <button className="bg-brand-accent text-white font-semibold py-3 px-8 rounded-lg text-lg hover:bg-brand-accent-dark transition-colors duration-300 transform hover:scale-105">
                Shop Now
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Main Collection Section (এখানে সামান্য পরিবর্তন হয়েছে) */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-10">Main Collection</h2>
          
          {/* --- পরিবর্তন শুরু --- */}
          {/* ডেটা লোড হওয়ার সময় একটি মেসেজ দেখান */}
          {loading ? (
            <div className="text-center">Loading products...</div>
          ) : (
            // ডেটা লোড হওয়ার পর প্রোডাক্ট দেখান
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          {/* --- পরিবর্তন শেষ --- */}

          <div className="text-center mt-12">
            <Link to="/collection">
              <button className="bg-brand-dark text-white font-semibold py-3 px-8 rounded-lg hover:bg-gray-700 transition-colors duration-300">
                View All Products
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;