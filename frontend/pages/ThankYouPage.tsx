import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Order } from '../types';
import { Loader2, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../constants'; // <-- Import korun
import { useAppContext } from '../context/AppContext';

const ThankYouPage: React.FC = () => {
  const { id: orderId } = useParams<{ id: string }>();
  const { userInfo } = useAppContext();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId || !userInfo) {
      setError('No order ID or user info found.');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        // Use API_BASE_URL
        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Order not found');
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, userInfo]);

  if (loading) return <div className="p-10 text-center"><Loader2 size={40} className="animate-spin" /></div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!order) return <div className="p-10 text-center text-gray-500">Order details not found.</div>;

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="w-full max-w-2xl bg-white p-8 md:p-12 rounded-lg shadow-md text-center">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Thank You, {order.customerInfo.name}!</h1>
        <p className="text-lg text-gray-700 mb-6">Your order has been placed successfully.</p>
        
        <div className="bg-gray-50 p-6 rounded-md text-left space-y-3">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Total Amount:</strong> <span className="font-bold text-xl">৳{order.totalPrice}</span></p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          {order.paymentMethod === 'Manual Payment' && (
            <div className="p-3 bg-yellow-100 text-yellow-800 rounded-md text-sm">
              Your payment is under review. We will verify your Transaction ID and confirm your order shortly.
            </div>
          )}
          {order.paymentMethod === 'Cash on Delivery' && (
            <div className="p-3 bg-blue-100 text-blue-800 rounded-md text-sm">
              Please keep the exact amount ready to pay upon delivery.
            </div>
          )}
        </div>

        <div className="mt-8">
          <Link to="/profile" className="px-6 py-3 bg-brand-dark text-white font-semibold rounded-md hover:bg-gray-700 transition-colors">
            View Order History
          </Link>
          <Link to="/collection" className="ml-4 px-6 py-3 bg-gray-100 text-gray-800 font-semibold rounded-md hover:bg-gray-200 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;