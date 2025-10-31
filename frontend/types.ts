export interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  description: string;
  countInStock: number;
  colors?: string[];
  sizes?: string[];
 
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
}

export interface Order {
  _id: string;
  user: { _id: string; name: string; email: string; };
  orderItems: {
    name: string;
    quantity: number;
    size: string;
    color: string;
    price: number;
    imageUrl: string;
    product: string;
  }[];
  shippingAddress: { address: string; city: string; };
  customerInfo: { name: string; phone: string; };
  totalPrice: number;
  isDelivered: boolean;
  createdAt: string;
}

export interface AppContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;

  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  userInfo: UserInfo | null;
  loginUser: (userData: UserInfo) => void;
  logoutUser: () => void;
}