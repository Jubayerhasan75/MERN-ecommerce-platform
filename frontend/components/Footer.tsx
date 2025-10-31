import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom'; // <-- ১. Link ইম্পোর্ট করুন

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Johan'S Hub</h3>
            <p className="text-sm">Premium T-Shirts for the modern man. Comfort, simplicity, and class in every thread.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            {/* --- ⛔️ পরিবর্তন এখানে --- */}
            <ul className="space-y-2 text-sm">
              <li><Link to="/collection" className="hover:text-brand-accent transition-colors">Collection</Link></li>
              <li><Link to="/about" className="hover:text-brand-accent transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-brand-accent transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-brand-accent transition-colors">FAQs</Link></li>
            </ul>
            {/* --- পরিবর্তন শেষ --- */}
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Customer Service</h4>
            {/* --- ⛔️ পরিবর্তন এখানে --- */}
            <ul className="space-y-2 text-sm">
              <li><Link to="/shipping" className="hover:text-brand-accent transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-accent transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand-accent transition-colors">Terms of Service</Link></li>
            </ul>
            {/* --- পরিবর্তন শেষ --- */}
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {/* সোশ্যাল মিডিয়া লিঙ্ক 'a' ট্যাগেই থাকবে, কারণ এগুলো বাইরের লিঙ্ক */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors"><Facebook size={20} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors"><Instagram size={20} /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors"><Twitter size={20} /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Johan'S Hub. All Rights Reserved. A premium Bangladeshi brand.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;