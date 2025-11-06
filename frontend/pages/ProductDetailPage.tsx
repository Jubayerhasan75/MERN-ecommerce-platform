import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { Loader2, Heart, ShoppingCart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { API_BASE_URL } from '../constants'; // <-- Import korun

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectionError, setSelectionError] = useState<string>('');

  const { addToCart, addFavorite, removeFavorite, isFavorite } = useAppContext();
  const isFav = product ? isFavorite(product._id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Use API_BASE_URL
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const validateSelection = () => {
    if (!selectedSize) {
      setSelectionError('Please select a size.');
      return false;
    }
    if (!selectedColor) {
      setSelectionError('Please select a color.');
      return false;
    }
    setSelectionError('');
    return true;
  };

  const handleAddToCart = () => {
    if (product && validateSelection()) {
      addToCart({
        product,
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
      });
    }
  };

  const handleOrderNow = () => {
    if (product && validateSelection()) {
      addToCart({
        product,
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
      });
      navigate('/checkout');
    }
  };
  
  const handleFavoriteClick = () => {
    if (product) {
      if (isFav) {
        removeFavorite(product._id);
      } else {
        addFavorite(product);
      }
    }
  };

  if (loading) return <div className="p-10 text-center"><Loader2 size={40} className="animate-spin" /></div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!product) return <div className="p-10 text-center text-gray-500">Product not found.</div>;

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="flex items-baseline space-x-3">
            <p className="text-3xl font-bold text-brand-dark">৳{product.price}</p>
            {hasDiscount && (
              <p className="text-xl text-gray-500 line-through">
                ৳{product.originalPrice}
              </p>
            )}
          </div>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
          <div className="border-t pt-4">
            <span className="font-semibold">Availability: </span>
            <span className={product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}>
              {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          <div className="space-y-2">
            <label className="text-lg font-semibold">Size:</label>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-md ${
                    selectedSize === size
                      ? 'bg-brand-dark text-white border-brand-dark'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-lg font-semibold">Color:</label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 border rounded-md ${
                    selectedColor === color
                      ? 'bg-brand-dark text-white border-brand-dark'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
          {selectionError && (
            <div className="text-red-500 text-sm">{selectionError}</div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleOrderNow}
              disabled={product.countInStock === 0}
              className="flex-1 px-6 py-3 bg-brand-primary text-gray-900 font-semibold rounded-md hover:bg-opacity-80 transition-colors disabled:opacity-50"
            >
              Order Now
            </button>
            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className="flex-1 px-6 py-3 bg-brand-dark text-white font-semibold rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
            <button
              onClick={handleFavoriteClick}
              className="p-3 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              <Heart size={24} className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-500'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;