import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Product } from '../types';
import { useAppContext } from '../context/AppContext';
import { Loader2, ArrowLeft, Upload } from 'lucide-react';
import { API_BASE_URL } from '../constants'; // <-- Import korun

const AdminProductEditPage: React.FC = () => {
  const { id: productId } = useParams<{ id: string }>();
  const isCreating = productId === 'new';
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('Over Sized');
  const [description, setDescription] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [colors, setColors] = useState(''); // Comma-separated string
  const [sizes, setSizes] = useState(''); // Comma-separated string

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { userInfo } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isCreating && productId) {
      setLoading(true);
      const fetchProduct = async () => {
        try {
          // Use API_BASE_URL
          const response = await fetch(`${API_BASE_URL}/api/products/${productId}`);
          if (!response.ok) {
            throw new Error('Product not found');
          }
          const data: Product = await response.json();
          setName(data.name);
          setPrice(data.price);
          setOriginalPrice(data.originalPrice || 0);
          setImageUrl(data.imageUrl);
          setCategory(data.category);
          setDescription(data.description);
          setCountInStock(data.countInStock);
          setColors(data.colors.join(', '));
          setSizes(data.sizes.join(', '));
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [productId, isCreating]);

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      // Use API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userInfo!.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Image upload failed');
      }

      setImageUrl(data.imageUrl);
      setUploading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setUploading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const productData = {
      name,
      price: Number(price),
      originalPrice: (originalPrice && Number(originalPrice) > Number(price)) ? Number(originalPrice) : undefined,
      imageUrl,
      category,
      description,
      countInStock: Number(countInStock),
      colors: colors.split(',').map(s => s.trim()).filter(Boolean),
      sizes: sizes.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      const url = isCreating 
        ? `${API_BASE_URL}/api/products` 
        : `${API_BASE_URL}/api/products/${productId}`;
        
      const method = isCreating ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo!.token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${isCreating ? 'create' : 'update'} product`);
      }

      setLoading(false);
      navigate('/admin/products');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };
  
  if (loading && !isCreating) return <div className="p-10 text-center"><Loader2 size={40} className="animate-spin" /></div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link 
        to="/admin/products" 
        className="inline-flex items-center text-gray-600 hover:text-brand-dark mb-4"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Product List
      </Link>

      <h1 className="text-3xl font-bold mb-6">
        {isCreating ? 'Add New Product' : 'Edit Product'}
      </h1>

      {error && (
        <div className="p-4 mb-4 text-center text-red-800 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-dark focus:border-brand-dark"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Sale Price (৳)</label>
            <input
              type="number"
              id="price"
              required
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-dark focus:border-brand-dark"
            />
          </div>
          <div>
            <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">Original Price (৳)</label>
            <input
              type="number"
              id="originalPrice"
              value={originalPrice || ''}
              onChange={(e) => setOriginalPrice(Number(e.target.value))}
              placeholder="e.g., 800 (must be > Sale Price)"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-dark focus:border-brand-dark"
            />
          </div>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="text"
            id="image"
            required
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Or upload one below"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-dark focus:border-brand-dark"
          />
        </div>

        <div>
          <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700">Upload Image</label>
          <div className="mt-1 flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm">
            <input
              type="file"
              id="image-upload"
              onChange={uploadFileHandler}
              className="w-full"
            />
            {uploading && <Loader2 size={20} className="animate-spin" />}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-dark focus:border-brand-dark"
            >
              <option value="Over Sized">Over Sized</option>
              <option value="Slim Fit">Slim Fit</option>
              <option value="Regular Fit">Regular Fit</option>
            </select>
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Count In Stock</label>
            <input
              type="number"
              id="stock"
              required
              value={countInStock}
              onChange={(e) => setCountInStock(Number(e.target.value))}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-dark focus:border-brand-dark"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-dark focus:border-brand-dark"
          />
        </div>

        <div>
          <label htmlFor="sizes" className="block text-sm font-medium text-gray-700">Sizes</label>
          <input
            type="text"
            id="sizes"
            value={sizes}
            onChange={(e) => setSizes(e.target.value)}
            placeholder="e.g., S, M, L, XL"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-dark focus:border-brand-dark"
          />
          <p className="text-xs text-gray-500 mt-1">Please use comma (,) to separate sizes.</p>
        </div>

        <div>
          <label htmlFor="colors" className="block text-sm font-medium text-gray-700">Colors</label>
          <input
            type="text"
            id="colors"
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            placeholder="e.g., Black, White, Red"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-dark focus:border-brand-dark"
          />
          <p className="text-xs text-gray-500 mt-1">Please use comma (,) to separate colors.</p>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-dark hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : (isCreating ? 'Create Product' : 'Update Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductEditPage;