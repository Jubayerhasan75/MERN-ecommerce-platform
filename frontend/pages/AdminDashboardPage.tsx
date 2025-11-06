import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShoppingBag, List, LogOut, LayoutDashboard } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  // Use the unified userInfo and logout
  const { userInfo, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to user login
  };

  return (
    <div className="flex">
      {/* Sidebar Navigation */}
      <nav className="w-64 min-h-screen bg-gray-800 text-white p-5">
        <h2 className="text-2xl font-bold mb-10 text-brand-primary">Admin Panel</h2>
        <ul className="space-y-4">
          <li>
            <Link to="/admin/dashboard" className="flex items-center p-2 rounded bg-gray-700">
              <LayoutDashboard size={18} className="mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/orders" className="flex items-center p-2 rounded hover:bg-gray-700">
              <ShoppingBag size={18} className="mr-3" />
              Orders
            </Link>
          </li>
          <li>
            <Link to="/admin/products" className="flex items-center p-2 rounded hover:bg-gray-700">
              <List size={18} className="mr-3" />
              Products
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className="flex items-center p-2 rounded hover:bg-gray-700">
              <User size={18} className="mr-3" />
              Users (Soon)
            </Link>
          </li>
        </ul>
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-2 rounded hover:bg-red-700 mt-10 text-red-300"
        >
          <LogOut size={18} className="mr-3" />
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Welcome, {userInfo?.name}!</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Total Sales</h3>
            <p className="text-3xl font-bold text-green-600">৳0</p>
            <p className="text-gray-500">(Stats coming soon)</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-gray-500">(Stats coming soon)</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Total Products</h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p className="text-gray-500">(Stats coming soon)</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;