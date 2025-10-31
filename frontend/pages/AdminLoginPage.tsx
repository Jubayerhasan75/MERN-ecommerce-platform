import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext'; // <-- ১. AppContext ইম্পোর্ট করুন

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // --- ⛔️ পরিবর্তন এখানে ---
  // AppContext থেকে loginAdmin এবং adminUserInfo ফাংশনটি নিন
  const { loginAdmin, adminUserInfo } = useAppContext(); 
  // --- পরিবর্তন শেষ ---

  // এই Effect-টি চেক করবে ইউজার আগে থেকেই লগইন করা আছে কি না
  useEffect(() => {
    if (adminUserInfo) {
      // যদি লগইন করা থাকে, তাকে '/admin/dashboard' পেজে পাঠিয়ে দিন
      navigate('/admin/dashboard');
    }
  }, [adminUserInfo, navigate]); // adminUserInfo বা navigate পরিবর্তন হলে এটি রান হবে

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // ব্যাকএন্ডে লগইন রিকোয়েস্ট পাঠান
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // --- ⛔️ পরিবর্তন এখানে ---
      // ৩. localStorage-এর বদলে Context-এর loginAdmin ফাংশন কল করুন
      // useLocalStorage হুকটি নিজে থেকেই এটি localStorage-এ সেভ করে নেবে
      loginAdmin(data); 
      // --- পরিবর্তন শেষ ---

      navigate('/admin/dashboard'); // ৪. ড্যাশবোর্ডে পাঠান

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // --- (নিচের JSX কোডটি অপরিবর্তিত আছে) ---
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Admin Login
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
            />
          </div>
          
          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-brand-dark rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;