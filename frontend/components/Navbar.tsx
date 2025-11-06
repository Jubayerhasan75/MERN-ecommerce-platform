import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Heart, Search, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Navbar: React.FC = () => {
  const { cart, userInfo, logout } = useAppContext(); // This is the fix: Use 'logout'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout(); // This is the fix: Call 'logout()'
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="text-3xl font-bold text-brand-dark">
            Johan's Hub
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-brand-dark">Home</Link>
            <Link to="/collection" className="text-gray-600 hover:text-brand-dark">Collection</Link>
            <Link to="/about" className="text-gray-600 hover:text-brand-dark">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-brand-dark">Contact</Link>
          </div>

          {/* Icons & Auth */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-brand-dark p-2 hidden md:block">
              <Search size={20} />
            </button>
            <Link to="/favorites" className="text-gray-600 hover:text-brand-dark p-2">
              <Heart size={20} />
            </Link>
            <Link to="/cart" className="relative text-gray-600 hover:text-brand-dark p-2">
              <ShoppingCart size={20} />
              {totalCartItems > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </Link>
            
            {userInfo ? (
              <div className="relative group hidden md:block">
                <Link to="/profile" className="flex items-center text-gray-600 hover:text-brand-dark p-2">
                  <User size={20} />
                  <span className="ml-2">{userInfo.name.split(' ')[0]}</span>
                </Link>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible">
                  <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User size={16} className="mr-2" /> Profile
                  </Link>
                  {userInfo.isAdmin && (
                    <Link to="/admin/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <LayoutDashboard size={16} className="mr-2" /> Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut size={16} className="mr-2" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden md:block text-gray-600 hover:text-brand-dark p-2">
                <User size={20} />
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-600 hover:text-brand-dark p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full z-40">
          <div className="px-4 py-2 space-y-2">
            <Link to="/" className="block py-2 text-gray-600 hover:text-brand-dark">Home</Link>
            <Link to="/collection" className="block py-2 text-gray-600 hover:text-brand-dark">Collection</Link>
            <Link to="/about" className="block py-2 text-gray-600 hover:text-brand-dark">About</Link>
            <Link to="/contact" className="block py-2 text-gray-600 hover:text-brand-dark">Contact</Link>
            
            <div className="border-t my-2"></div>
            
            {userInfo ? (
              <>
                <Link to="/profile" className="block py-2 text-gray-600 hover:text-brand-dark">Profile</Link>
                {userInfo.isAdmin && (
                  <Link to="/admin/dashboard" className="block py-2 text-gray-600 hover:text-brand-dark">Admin Dashboard</Link>
                )}
                <button onClick={handleLogout} className="w-full text-left py-2 text-red-500 hover:text-red-700">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="block py-2 text-gray-600 hover:text-brand-dark">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;