import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Order, OrderItem, ShippingAddress, CustomerInfo } from '../types';
import { Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../constants'; // <-- Import korun

const CheckoutPage: React.FC = () => {
  const { cart, clearCart, userInfo } = useAppContext();
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState<Omit<CustomerInfo, 'email'>>({
    name: userInfo?.name || '',
    phone: '',
  });
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    address: '',
    city: 'Dhaka',
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [transactionId, setTransactionId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingCost = 60;
  const totalPrice = subtotal + shippingCost;

  if (cart.length === 0 && !loading) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'Manual Payment' && !transactionId) {
      setError('Please provide a Transaction ID (TrxID) for manual payment.');
      return;
    }
    if (!userInfo) {
      setError('You must be logged in to place an order.');
      navigate('/login?redirect=/checkout');
      return;
    }

    setLoading(true);
    setError(null);

    const orderItems: OrderItem[] = cart.map(item => ({
      name: item.product.name,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      price: item.product.price,
      imageUrl: item.product.imageUrl,
      product: item.product._id,
    }));
    
    const fullCustomerInfo: CustomerInfo = {
      ...customerInfo,
      email: userInfo.email,
    };

    const orderData = {
      orderItems,
      shippingAddress,
      customerInfo: fullCustomerInfo,
      paymentMethod,
      transactionId: paymentMethod === 'Manual Payment' ? transactionId : undefined,
      totalPrice,
    };

    try {
      // Use API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(orderData),
      });

      const newOrder: Order | { message: string } = await response.json();

      if (!response.ok) {
        throw new Error((newOrder as { message: string }).message || 'Failed to create order');
      }

      clearCart();
      navigate(`/thankyou/${(newOrder as Order)._id}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
      {error && (
        <div className="p-4 mb-4 text-center text-red-800 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Left Side: Shipping & Payment */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">1. Customer Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">2. Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Full Address (Street, Area)</label>
                  <input
                    type="text"
                    id="address"
                    required
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    id="city"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">3. Payment Method</h2>
              <div className="space-y-4">
                <div 
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`p-4 border rounded-md cursor-pointer ${paymentMethod === 'Cash on Delivery' ? 'border-brand-dark ring-2 ring-brand-dark' : 'border-gray-300'}`}
                >
                  <label className="flex items-center">
                    <input type="radio" name="paymentMethod" value="Cash on Delivery" checked={paymentMethod === 'Cash on Delivery'} onChange={() => {}} className="mr-3" />
                    Cash on Delivery
                  </label>
                </div>
                
                <div 
                  onClick={() => setPaymentMethod('Manual Payment')}
                  className={`p-4 border rounded-md cursor-pointer ${paymentMethod === 'Manual Payment' ? 'border-brand-dark ring-2 ring-brand-dark' : 'border-gray-300'}`}
                >
                  <label className="flex items-center">
                    <input type="radio" name="paymentMethod" value="Manual Payment" checked={paymentMethod === 'Manual Payment'} onChange={() => {}} className="mr-3" />
                    Bkash / Nagad
                  </label>
                  {paymentMethod === 'Manual Payment' && (
                    <div className="mt-4 space-y-3 text-sm text-gray-700">
                      <p>Please send <strong>৳{totalPrice}</strong> to this number: <strong>017XXXXXXXX</strong> (Bkash/Nagad Personal)</p>
                      <p>Then enter the <strong>Transaction ID (TrxID)</strong> below:</p>
                      <input
                        type="text"
                        placeholder="TrxID"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-dark focus:border-brand-dark"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="h-fit sticky top-24">
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.map(item => (
                  <div key={`${item.product._id}-${item.size}-${item.color}`} className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center space-x-3">
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 rounded object-cover" />
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">{item.size}, {item.color} (x{item.quantity})</p>
                      </div>
                    </div>
                    <p className="font-medium">৳{item.product.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>৳{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>৳{shippingCost}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>৳{totalPrice}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 px-6 py-3 bg-brand-dark text-white font-semibold rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;