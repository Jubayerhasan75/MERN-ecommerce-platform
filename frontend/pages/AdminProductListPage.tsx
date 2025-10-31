import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { useAppContext } from '../context/AppContext';

const AdminProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { userInfo } = useAppContext(); // Token-er jonno userInfo
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- ⛔️ Shothik Fix: "Delete" button-er kaj ---
  const handleDelete = async (productId: string) => {
    // 1. Token check kora
    if (!userInfo || !userInfo.token || !window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      // 2. Delete request-er shathe Token pathano
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      setProducts(products.filter(p => p._id !== productId)); // List theke shoriye deya
      alert('Product deleted successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) return <div className="p-10 text-center"><Loader2 size={40} className="animate-spin" /></div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Products ({products.length})</h1>
        <Link
          to="/admin/product/new/edit" // "Add Product" button (ja kaj korche)
          className="inline-flex items-center px-4 py-2 bg-brand-dark text-white rounded-md hover:bg-gray-700"
        >
          <Plus size={20} className="mr-2" />
          Add New Product
        </Link>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product._id.substring(18)}...</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">৳{product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.countInStock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                  {/* --- ⛔️ Shothik Fix: "Edit" button-er link --- */}
                  <Link to={`/admin/product/edit/${product._id}`} className="text-blue-600 hover:text-blue-800">
                    <Edit size={18} className="inline" />
                  </Link>
                  {/* --- ⛔️ Shothik Fix: "Delete" button-er handler --- */}
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} className="inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductListPage;