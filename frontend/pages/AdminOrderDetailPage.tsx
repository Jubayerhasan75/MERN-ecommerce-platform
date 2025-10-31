import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  AlertTriangle, // Icon for 'Not Paid'
  Hash // Icon for TrxID
} from 'lucide-react';
import { Order } from '../types';
import { useAppContext } from '../context/AppContext';

const AdminOrderDetailPage: React.FC = () => {
  const { id: orderId } = useParams<{ id: string }>();
  const { userInfo } = useAppContext();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deliverLoading, setDeliverLoading] = useState(false);
  const [deliverError, setDeliverError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!userInfo || !orderId) {
      navigate('/login');
      return;
    }
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
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
  }, [orderId, userInfo, navigate]);

  const handleMarkAsDelivered = async () => {
    if (!userInfo || !userInfo.token || !order) return;

    // --- New Confirmation Step ---
    // If the order is 'Manual Payment' and not yet paid, warn the admin.
    if (order.paymentMethod === 'Manual Payment' && !order.isPaid) {
      if (!window.confirm('This is a Manual Payment order. Have you verified the Transaction ID and received the payment?')) {
        return; // Admin clicked "Cancel", so we stop.
      }
    }

    setDeliverLoading(true);
    setDeliverError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${order._id}/deliver`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
        },
      });
      const updatedOrder = await response.json();
      if (!response.ok) {
        throw new Error(updatedOrder.message || 'Failed to mark as delivered');
      }
      setOrder(updatedOrder); // Refresh order state
      setDeliverLoading(false);
    } catch (err) {
      setDeliverError(err instanceof Error ? err.message : 'An error occurred');
      setDeliverLoading(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!userInfo || !userInfo.token || !order) return;

    if (window.confirm('Are you sure you want to permanently delete this order? This action cannot be undone.')) {
      setDeleteLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/orders/${order._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${userInfo.token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to delete order');
        }
        
        setDeleteLoading(false);
        alert('Order deleted successfully.');
        navigate('/admin/orders'); // Go back to the order list

      } catch (err) {
        alert(err instanceof Error ? err.message : 'An error occurred');
        setDeleteLoading(false);
      }
    }
  };

  if (loading) return <div className="p-10 text-center"><Loader2 size={40} className="animate-spin" /></div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!order) return <div className="p-10 text-center text-gray-500">Order not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-5xl">
      {userInfo?.isAdmin && (
        <Link 
          to="/admin/orders" 
          className="inline-flex items-center text-gray-600 hover:text-brand-dark mb-4"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Order List
        </Link>
      )}

      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Order Details</h1>
      <p className="text-sm text-gray-500 mb-4">Order ID: {order._id}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1: Order Items & Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shipping Details */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {order.customerInfo.name}</p>
              <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
              <p><strong>Email:</strong> {order.user.email}</p>
              <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}</p>
            </div>
          </div>

          {/* --- ✅ NEW: Payment Details Section --- */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            <div className="space-y-2">
              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
              
              {/* Only show TrxID if it's a Manual Payment */}
              {order.paymentMethod === 'Manual Payment' && (
                <div className="flex items-center space-x-2 pt-2">
                  <Hash size={18} className="text-gray-600" />
                  <strong className="text-gray-800">Transaction ID:</strong>
                  <span className="font-mono text-md bg-gray-100 px-2 py-1 rounded">
                    {order.transactionId || 'Not Provided'}
                  </span>
                </div>
              )}

              {/* Payment Status (Paid/Unpaid) */}
              <div className="flex items-center space-x-2 pt-2">
                {order.isPaid ? (
                  <span className="flex items-center text-green-600 font-medium">
                    <CheckCircle size={18} className="mr-1" /> Payment Verified
                  </span>
                ) : (
                  <span className="flex items-center text-red-600 font-medium">
                    <AlertTriangle size={18} className="mr-1" /> Payment Not Verified
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Order Items */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems.map(item => (
                <div key={item.product} className="flex items-center space-x-4 border-b pb-4 last:border-b-0">
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Size: {item.size}, Color: {item.color}</p>
                  </div>
                  <div className="text-right">
                    <p>{item.quantity} x ৳{item.price}</p>
                    <p className="font-semibold">৳{item.quantity * item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Order Summary & Actions */}
        <div className="lg:col-span-1 h-fit sticky top-24">
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between">
              <span>Total Price</span>
              <span className="font-bold text-xl">৳{order.totalPrice}</span>
            </div>
            
            {/* Delivery Status */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Delivery Status</h3>
              {order.isDelivered ? (
                <div className="flex items-center text-green-600 bg-green-50 p-3 rounded-md">
                  <CheckCircle size={20} className="mr-2" />
                  Delivered
                </div>
              ) : (
                <div className="flex items-center text-yellow-600 bg-yellow-50 p-3 rounded-md">
                  <XCircle size={20} className="mr-2" />
                  Pending
                </div>
              )}
            </div>

            {/* "Mark as Delivered" Button */}
            {userInfo?.isAdmin && !order.isDelivered && (
              <div className="border-t pt-4">
                {deliverError && <div className="text-red-600 text-sm mb-2">{deliverError}</div>}
                <button
                  onClick={handleMarkAsDelivered}
                  disabled={deliverLoading}
                  className="w-full px-4 py-3 bg-brand-dark text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {deliverLoading ? <Loader2 size={20} className="animate-spin" /> : 'Mark as Delivered (and Paid)'}
                </button>
              </div>
            )}
            
            {/* "Delete Order" Button */}
            {userInfo?.isAdmin && (
              <div className="border-t pt-4">
                <button
                  onClick={handleDeleteOrder}
                  disabled={deleteLoading}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex justify-center items-center"
                >
                  {deleteLoading ? <Loader2 size={20} className="animate-spin" /> : 'Delete This Order'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;