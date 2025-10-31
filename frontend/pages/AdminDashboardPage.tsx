import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ShoppingBag, Package, Users } from 'lucide-react'; // নতুন আইকন

const AdminDashboardPage: React.FC = () => {
  const { adminUserInfo, logoutAdmin } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        {adminUserInfo && (
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 hidden sm:block">
              Welcome, <span className="font-semibold">{adminUserInfo.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {}
        <NavLink 
          to="/admin/products" 
          className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <Package size={48} className="text-brand-accent mb-4" />
          <h2 className="text-2xl font-semibold">Manage Products</h2>
          <p className="text-gray-600">View, create, edit, and delete products</p>
        </NavLink>

        {}
        <NavLink 
          to="/admin/orders"
          className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <ShoppingBag size={48} className="text-blue-500 mb-4" />
          <h2 className="text-2xl font-semibold">Manage Orders</h2>
          <p className="text-gray-600">View and process customer orders</p>
        </NavLink>

        {}
        <NavLink 
          to="/admin/users"
          className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <Users size={48} className="text-green-500 mb-4" />
          <h2 className="text-2xl font-semibold">Manage Users</h2>
          <p className="text-gray-600">View and manage users</p>
        </NavLink>

      </div>
      {}
    </div>
  );
};

export default AdminDashboardPage;