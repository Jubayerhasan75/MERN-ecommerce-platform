import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Upload } from 'lucide-react';
import { useAppContext } from '../context/AppContext';


interface ProductData {
  name: string;
  price: number;
  originalPrice?: number; 
  imageUrl: string;
  category: string;
  description: string;
  countInStock: number;
  colors: string[];
  sizes: string[];
}

const AdminProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userInfo } = useAppContext(); 

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [colors, setColors] = useState('');
  const [sizes, setSizes] = useState('');

  const [isNewProduct, setIsNewProduct] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);


  useEffect(() => {
    if (id) {
     
      setIsNewProduct(false);
      setLoading(true);
      const fetchProduct = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/products/${id}`);
          if (!response.ok) throw new Error('Product not found');
          const product = await response.json();
          
          setName(product.name);
          setPrice(product.price);
          setOriginalPrice(product.originalPrice || 0);
          setImageUrl(product.imageUrl);
          setCategory(product.category || '');
          setDescription(product.description || '');
          setCountInStock(product.countInStock || 0);
          setColors(product.colors ? product.colors.join(', ') : '');
          setSizes(product.sizes ? product.sizes.join(', ') : '');
          
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch product');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    } else {
    
      setIsNewProduct(true);
      setName('Sample Name');
      setPrice(850);
      setOriginalPrice(0);
      setCategory('Slim Fit');
      setDescription('Sample Description');
      setCountInStock(10);
      setColors('Black, White');
      setSizes('M, L, XL');
    }
  }, [id]);

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!userInfo || !userInfo.token) {
      setUploadError('You must be logged in as an admin to upload images.');
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    setUploadError(null);
    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Image upload failed');
      }
      setImageUrl(data.url);
      setUploading(false);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'An error occurred during upload');
      setUploading(false);
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo || !userInfo.token) {
      setError('You must be logged in as an admin.');
      return;
    }
    setLoading(true);
    setError(null);

    
    const productData: ProductData = {
      name,
      price: Number(price),
      imageUrl,
      category,
      description,
      countInStock: Number(countInStock),
      colors: colors.split(',').map(s => s.trim()).filter(Boolean),
      sizes: sizes.split(',').map(s => s.trim()).filter(Boolean),
    };

   
    if (originalPrice && Number(originalPrice) > Number(price)) {
      productData.originalPrice = Number(originalPrice);
    }
    

    try {
      let response;
      const apiConfig = {
        method: isNewProduct ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(productData),
      };

      if (isNewProduct) {
        response = await fetch('http://localhost:5000/api/products', apiConfig);
      } else {
        response = await fetch(`http://localhost:5000/api/products/${id}`, apiConfig);
      }
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || (isNewProduct ? 'Failed to create product' : 'Failed to update product'));
      }
      setLoading(false);
      alert(isNewProduct ? 'Product created successfully!' : 'Product updated successfully!');
      navigate('/admin/products');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };
  
  if (loading && !isNewProduct) return <div className="p-10 text-center"><Loader2 size={40} className="animate-spin" /></div>;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      <Link 
        to="/admin/products" 
        className="inline-flex items-center text-gray-600 hover:text-brand-dark mb-4"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Product List
      </Link>
      
      <h1 className="text-3xl font-bold mb-6">
        {isNewProduct ? 'Add New Product' : 'Edit Product'}
      </h1>

      <form onSubmit={submitHandler} className="bg-white p-6 md:p-8 rounded-lg shadow-md space-y-6">
        {error && <div className="text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (৳)</label>
            <input type="number" id="price" value={price} onChange={(e) => setPrice(Number(e.target.value))} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">Original Price (৳) (Optional)</label>
            <input type="number" id="originalPrice" value={originalPrice} onChange={(e) => setOriginalPrice(Number(e.target.value))} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
          </div>
           <div>
            <label htmlFor="countInStock" className="block text-sm font-medium text-gray-700">Count In Stock</label>
            <input type="number" id="countInStock" value={countInStock} onChange={(e) => setCountInStock(Number(e.target.value))} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" value={description} rows={4} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"></textarea>
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
          <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL (or upload below)" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md bg-gray-50" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Image File</label>
          <div className="mt-1 flex items-center space-x-4">
             <input
              type="file"
              id="image-upload"
              onChange={uploadFileHandler}
              className="block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:text-sm file:font-semibold
                         file:bg-brand-accent-light file:text-brand-dark
                         hover:file:bg-brand-accent-light/80"
            />
            {uploading && <Loader2 size={24} className="animate-spin text-brand-accent" />}
          </div>
          {uploadError && <div className="text-red-600 text-sm mt-2">{uploadError}</div>}
          {imageUrl && !uploading && (
            <div className="mt-4">
              <span className="block text-sm font-medium text-gray-700">Preview:</span>
              <img src={imageUrl} alt="Product Preview" className="w-24 h-24 object-cover rounded-md mt-2" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required placeholder="e.g. Over Sized, Slim Fit" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label htmlFor="colors" className="block text-sm font-medium text-gray-700">Colors (comma separated)</label>
            <input type="text" id="colors" value={colors} onChange={(e) => setColors(e.target.value)} placeholder="e.g. Black, White, Red" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
          </div>
           <div>
            <label htmlFor="sizes" className="block text-sm font-medium text-gray-700">Sizes (comma separated)</label>
            <input type="text" id="sizes" value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="e.g. S, M, L, XL" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-dark hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (isNewProduct ? 'Create Product' : 'Update Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductEditPage;