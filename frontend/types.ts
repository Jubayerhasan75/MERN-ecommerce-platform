// --- Product Type ---
export type Product = {
  _id: string; // Not 'id', it's '_id'
  name: string;
  price: number;
  originalPrice?: number; // Optional
  imageUrl: string;
  category: string;
  description: string;
  countInStock: number;
  colors: string[];
  sizes: string[];
  createdAt?: string; // Optional
  updatedAt?: string; // Optional
};

// --- Order Types ---
export type OrderItem = {
  name: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
  imageUrl: string;
  product: string; // Product ID
};

export type ShippingAddress = {
  address: string;
  city: string;
};

export type CustomerInfo = {
  name: string;
  phone: string;
  email: string;
};

export type Order = {
  _id: string;
  user: { _id: string; name: string; email: string; };
  customerInfo: CustomerInfo;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  totalPrice: number;
  
  // --- Payment Fields (This fixes the error) ---
  paymentMethod: string;
  transactionId?: string; // Optional
  isPaid: boolean;
  paidAt?: string; // Optional
  // ---

  isDelivered: boolean;
  deliveredAt?: string; // Optional
  createdAt: string;
};

// --- User Type ---
export type UserInfo = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
};

// --- Cart Type ---
export type CartItem = {
  product: Product;
  quantity: number;
  size: string;
  color: string;
};

// --- Context Type ---
export type AppContextType = {
  // Cart State
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  
  // Favorites State
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  
  // Auth State (One state for both)
  userInfo: UserInfo | null;
  login: (data: UserInfo) => void;
  logout: () => void;
};