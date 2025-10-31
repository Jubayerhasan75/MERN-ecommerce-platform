import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import ProductDetailPage from './pages/ProductDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import CheckoutPage from './pages/CheckoutPage';
import ThankYouPage from './pages/ThankYouPage';
import { AppProvider } from './context/AppContext';

// Admin Imports
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminRoute from './components/AdminRoute';
import AdminProductListPage from './pages/AdminProductListPage';
import AdminProductEditPage from './pages/AdminProductEditPage';
import AdminOrderListPage from './pages/AdminOrderListPage'; // ⛔️ Notun Import
import AdminOrderDetailPage from './pages/AdminOrderDetailPage'; // ⛔️ Notun Import

// Auth Imports
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

// Shomadhan: Admin User List Page-er jonno placeholder
const AdminUserListPage = () => <div className="p-10 text-center text-xl">Admin Users Page - Coming Soon!</div>;

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen bg-stone-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* --- Public User Routes --- */}
              <Route path="/" element={<HomePage />} />
              <Route path="/collection" element={<CollectionPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/thankyou" element={<ThankYouPage />} />
              <Route path="/offers" element={<div className="p-10 text-center text-xl">Offers Page - Coming Soon!</div>} />
              <Route path="/contact" element={<div className="p-10 text-center text-xl">Contact Page - Coming Soon!</div>} />

              {/* --- Auth Routes --- */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin/login" element={<LoginPage />} />

              {/* --- Protected User Routes --- */}
              <Route path="" element={<ProtectedRoute />}>
                 <Route path="/profile" element={<ProfilePage />} />
                 {/* ⛔️ User ebong Admin ubhoye-i nijer Order ID diye details dekhte parbe */}
                 <Route path="/order/:id" element={<AdminOrderDetailPage />} /> 
              </Route>

              {/* --- Protected Admin Routes --- */}
              <Route path="" element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/products" element={<AdminProductListPage />} />
                <Route path="/admin/product/edit/:id" element={<AdminProductEditPage />} />
                <Route path="/admin/product/new/edit" element={<AdminProductEditPage />} />
                
                {/* --- ⛔️ Shothik Fix: Admin Order Route-gulo add kora holo --- */}
                <Route path="/admin/orders" element={<AdminOrderListPage />} />
                <Route path="/admin/order/:id" element={<AdminOrderDetailPage />} /> 
                
                <Route path="/admin/users" element={<AdminUserListPage />} />
              </Route>

            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </AppProvider>
  );
}

export default App;