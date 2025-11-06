import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppContextType, CartItem, Product, UserInfo } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext<AppContextType | undefined>(undefined);

type State = {
  cart: CartItem[];
  favorites: Product[];
  userInfo: UserInfo | null;
};

type Action =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string; size: string; color: string } }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; size: string; color: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_FAVORITE'; payload: Product }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'USER_LOGIN'; payload: UserInfo }
  | { type: 'USER_LOGOUT' };

const appReducer = (state: State, action: Action): State => {
  switch (action.type) {
    // ... (Cart cases)
    case 'ADD_TO_CART': {
      const newItem = action.payload;
      const existItem = state.cart.find(
        (x) =>
          x.product._id === newItem.product._id &&
          x.size === newItem.size &&
          x.color === newItem.color
      );
      if (existItem) {
        return {
          ...state,
          cart: state.cart.map((x) =>
            x.product._id === existItem.product._id &&
            x.size === existItem.size &&
            x.color === existItem.color
              ? { ...x, quantity: x.quantity + newItem.quantity }
              : x
          ),
        };
      } else {
        return { ...state, cart: [...state.cart, newItem] };
      }
    }
    case 'REMOVE_FROM_CART': {
      const { productId, size, color } = action.payload;
      return {
        ...state,
        cart: state.cart.filter(
          (x) => !(x.product._id === productId && x.size === size && x.color === color)
        ),
      };
    }
    case 'UPDATE_CART_QUANTITY': {
      const { productId, size, color, quantity } = action.payload;
      if (quantity <= 0) {
        // Remove if quantity is 0 or less
        return {
          ...state,
          cart: state.cart.filter(
            (x) => !(x.product._id === productId && x.size === size && x.color === color)
          ),
        };
      }
      return {
        ...state,
        cart: state.cart.map((x) =>
          x.product._id === productId && x.size === size && x.color === color
            ? { ...x, quantity }
            : x
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    
    // ... (Favorites cases)
    case 'ADD_FAVORITE':
      return { ...state, favorites: [...state.favorites, action.payload] };
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter((p) => p._id !== action.payload),
      };

    // ... (Auth cases)
    case 'USER_LOGIN':
      return { ...state, userInfo: action.payload };
    case 'USER_LOGOUT':
      return { ...state, userInfo: null, cart: [], favorites: [] }; // Clear everything on logout
      
    default:
      return state;
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [storedCart, setStoredCart] = useLocalStorage<CartItem[]>('cart', []);
  const [storedFavorites, setStoredFavorites] = useLocalStorage<Product[]>('favorites', []);
  const [storedUser, setStoredUser] = useLocalStorage<UserInfo | null>('userInfo', null);

  const initialState: State = {
    cart: storedCart || [],
    favorites: storedFavorites || [],
    userInfo: storedUser || null,
  };

  const [state, dispatch] = useReducer(appReducer, initialState);

  // --- Cart Actions ---
  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
    setStoredCart(state.cart); // This might be slightly delayed, but works
  };
  const removeFromCart = (productId: string, size: string, color: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId, size, color } });
    setStoredCart(state.cart);
  };
  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, size, color, quantity } });
    setStoredCart(state.cart);
  };
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    setStoredCart([]);
  };

  // --- Favorites Actions ---
  const addFavorite = (product: Product) => {
    dispatch({ type: 'ADD_FAVORITE', payload: product });
    setStoredFavorites(state.favorites);
  };
  const removeFavorite = (productId: string) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: productId });
    setStoredFavorites(state.favorites);
  };
  const isFavorite = (productId: string) => {
    return state.favorites.some((p) => p._id === productId);
  };

  // --- Auth Actions ---
  const login = (data: UserInfo) => {
    dispatch({ type: 'USER_LOGIN', payload: data });
    setStoredUser(data);
  };
  const logout = () => {
    dispatch({ type: 'USER_LOGOUT' });
    setStoredUser(null);
    setStoredCart([]);
    setStoredFavorites([]);
  };

  // Update localStorage whenever state changes
  React.useEffect(() => {
    setStoredCart(state.cart);
  }, [state.cart, setStoredCart]);

  React.useEffect(() => {
    setStoredFavorites(state.favorites);
  }, [state.favorites, setStoredFavorites]);
  
  React.useEffect(() => {
    setStoredUser(state.userInfo);
  }, [state.userInfo, setStoredUser]);


  return (
    <AppContext.Provider
      value={{
        cart: state.cart,
        favorites: state.favorites,
        userInfo: state.userInfo,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addFavorite,
        removeFavorite,
        isFavorite,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};