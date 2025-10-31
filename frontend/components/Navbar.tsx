import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, User, Menu, X, LayoutDashboard, LogOut, UserCircle } from 'lucide-react'; // Added UserCircle
import { useAppContext } from '../context/AppContext';

const Navbar: React.FC = () => {
  // --- ⛔️ Use userInfo and logoutUser ---
  const { cart, favorites, userInfo, logoutUser } = useAppContext();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const favoritesCount = favorites.length;

  const linkClasses = "text-gray-800 hover:text-brand-accent transition-colors duration-300";
  const activeLinkClasses = "text-brand-accent font-semibold";

  const handleLogout = () => {
    logoutUser();
    setIsUserDropdownOpen(false);
    navigate('/login'); // Send everyone to login page after logout
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = (
    <>
      <NavLink to="/" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Home</NavLink>
      <NavLink to="/collection" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Collection</NavLink>
      <NavLink to="/offers" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Offers</NavLink>
      <NavLink to="/contact" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Contact</NavLink>
    </>
  );

  return (
    <header className="bg-stone-100 shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink to="/" className="text-2xl font-bold text-brand-dark tracking-wider">
              Johan'S Hub
            </NavLink>
          </div>
          {/* Desktop Nav Links */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks}
          </div>
          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Favorites */}
              <NavLink to="/favorites" className={({ isActive }) => `relative text-gray-600 hover:text-brand-accent transition-colors duration-300 ${isActive ? 'text-brand-accent' : ''}`}>
                <Heart size={24} />
                {favoritesCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{favoritesCount}</span>
                )}
              </NavLink>

              {/* --- ⛔️ User Icon Logic Updated --- */}
              <div className="relative" ref={dropdownRef}>
                {userInfo ? (
                  // If logged in (Admin or User)
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="text-gray-600 hover:text-brand-accent transition-colors duration-300"
                  >
                    <User size={24} />
                  </button>
                ) : (
                  // If logged out
                  <NavLink to="/login" className={({ isActive }) => `text-gray-600 hover:text-brand-accent transition-colors duration-300 ${isActive ? 'text-brand-accent' : ''}`}>
                    <User size={24} /> {/* Link to general login page */}
                  </NavLink>
                )}

                {/* --- Dropdown Menu (Handles both Admin and User) --- */}
                {userInfo && isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      Signed in as <br />
                      <strong className="truncate">{userInfo.name}</strong>
                    </div>
                    {userInfo.isAdmin ? (
                      // Admin Links
                      <NavLink
                        to="/admin/dashboard"
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <LayoutDashboard size={16} className="mr-2" />
                        Dashboard
                      </NavLink>
                    ) : (
                      // Regular User Links
                      <NavLink
                        to="/profile"
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <UserCircle size={16} className="mr-2" />
                        Profile
                      </NavLink>
                    )}
                    {/* Logout Button (Common) */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
              {/* --- User Icon Logic End --- */}

              {/* Cart */}
              <NavLink to="/checkout" className={({ isActive }) => `relative text-gray-600 hover:text-brand-accent transition-colors duration-300 ${isActive ? 'text-brand-accent' : ''}`}>
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span>
                )}
              </NavLink>
            </div> {/* End Desktop Icons */}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div> {/* End Icons container */}
        </div> {/* End flex justify-between */}
      </nav>

      {/* --- Mobile Menu --- */}
      {isMenuOpen && (
        <div className="md:hidden bg-stone-100 border-t border-stone-200">
          <div className="px-4 pt-2 pb-4 space-y-2 flex flex-col items-center">
            {navLinks}
            <div className="flex items-center space-x-6 pt-4">
              {/* Mobile Favorites */}
              <NavLink to="/favorites" className={({ isActive }) => `relative text-gray-600 hover:text-brand-accent transition-colors duration-300 ${isActive ? 'text-brand-accent' : ''}`} onClick={() => setIsMenuOpen(false)}>
                <Heart size={24} />
                 {/* Count removed for simplicity */}
              </NavLink>

              {/* --- Mobile User Icon Logic --- */}
              {userInfo ? (
                 userInfo.isAdmin ? (
                     <NavLink to="/admin/dashboard" className={({ isActive }) => `text-gray-600 hover:text-brand-accent ${isActive ? 'text-brand-accent' : ''}`} onClick={() => setIsMenuOpen(false)}>
                        <User size={24} /> (Admin)
                     </NavLink>
                 ) : (
                     <NavLink to="/profile" className={({ isActive }) => `text-gray-600 hover:text-brand-accent ${isActive ? 'text-brand-accent' : ''}`} onClick={() => setIsMenuOpen(false)}>
                        <User size={24} /> (Profile)
                     </NavLink>
                 )
              ) : (
                <NavLink to="/login" className={({ isActive }) => `text-gray-600 hover:text-brand-accent ${isActive ? 'text-brand-accent' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  <User size={24} /> (Login)
                </NavLink>
              )}
             {/* Mobile Logout (Show if logged in) */}
             {userInfo && (
                 <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-red-600 hover:text-red-800">
                    <LogOut size={24} />
                 </button>
             )}

              {/* Mobile Cart */}
              <NavLink to="/checkout" className={({ isActive }) => `relative text-gray-600 hover:text-brand-accent ${isActive ? 'text-brand-accent' : ''}`} onClick={() => setIsMenuOpen(false)}>
                <ShoppingCart size={24} />
                 {/* Count removed for simplicity */}
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;