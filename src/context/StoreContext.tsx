import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant } from '../data/products';
import { Order, OrderStatus, mockOrders, mockPayments, Payment } from '../data/adminData';

export interface CartItem extends Product {
  cartItemId: string;
  quantity: number;
  selectedVariant?: ProductVariant;
}

interface StoreContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;

  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Admin state
  isAdmin: boolean;
  adminLogin: (email: string, password: string) => boolean;
  adminLogout: () => void;

  // Admin: Orders
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderTracking: (orderId: string, trackingNumber: string) => void;

  // Admin: Payments
  payments: Payment[];

  // Admin: Discounts (productId -> discount percentage)
  discounts: Record<string, number>;
  setProductDiscount: (productId: string, discount: number) => void;
  removeProductDiscount: (productId: string) => void;

  // Admin: Products (admin-added products)
  adminProducts: Product[];
  addAdminProduct: (product: Product) => void;
  updateAdminProduct: (product: Product) => void;
  deleteAdminProduct: (productId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const ADMIN_EMAIL = 'admin@admin.com';
const ADMIN_PASSWORD = 'Admin@123';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Admin states
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return (localStorage.getItem('douvere_admin') || localStorage.getItem('prabha_admin')) === 'true';
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('douvere_orders') || localStorage.getItem('prabha_orders');
    return saved ? JSON.parse(saved) : mockOrders;
  });
  const [payments] = useState<Payment[]>(mockPayments);
  const [discounts, setDiscounts] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('douvere_discounts') || localStorage.getItem('prabha_discounts');
    return saved ? JSON.parse(saved) : {
      '1': 20,
      '3': 15,
      '11': 25,
      '12': 10,
    };
  });
  const [adminProducts, setAdminProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('douvere_admin_products') || localStorage.getItem('prabha_admin_products');
    return saved ? JSON.parse(saved) : [];
  });

  // Load from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('douvere_cart') || localStorage.getItem('prabha_cart');
    const savedWishlist = localStorage.getItem('douvere_wishlist') || localStorage.getItem('prabha_wishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('douvere_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('douvere_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('douvere_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('douvere_discounts', JSON.stringify(discounts));
  }, [discounts]);

  useEffect(() => {
    localStorage.setItem('douvere_admin_products', JSON.stringify(adminProducts));
  }, [adminProducts]);

  const addToCart = (product: Product, quantity = 1, variant?: ProductVariant) => {
    setCart(prev => {
      const cartItemId = variant ? `${product.id}-${variant.id}` : product.id;
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, cartItemId, quantity, selectedVariant: variant }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.cartItemId === cartItemId ? { ...item, quantity } : item
    ));
  };

  const addToWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.some(item => item.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  // Admin functions
  const adminLogin = (email: string, password: string): boolean => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem('douvere_admin', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('douvere_admin');
    localStorage.removeItem('prabha_admin');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { ...order, status, updatedAt: new Date().toISOString() }
        : order
    ));
  };

  const updateOrderTracking = (orderId: string, trackingNumber: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { ...order, trackingNumber, updatedAt: new Date().toISOString() }
        : order
    ));
  };

  const setProductDiscount = (productId: string, discount: number) => {
    setDiscounts(prev => ({ ...prev, [productId]: discount }));
  };

  const removeProductDiscount = (productId: string) => {
    setDiscounts(prev => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  const addAdminProduct = (product: Product) => {
    setAdminProducts(prev => [...prev, product]);
  };

  const updateAdminProduct = (product: Product) => {
    setAdminProducts(prev => prev.map(p => p.id === product.id ? product : p));
  };

  const deleteAdminProduct = (productId: string) => {
    setAdminProducts(prev => prev.filter(p => p.id !== productId));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <StoreContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      cartTotal,
      cartCount,
      isCartOpen,
      setIsCartOpen,
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      isAdmin,
      adminLogin,
      adminLogout,
      orders,
      updateOrderStatus,
      updateOrderTracking,
      payments,
      discounts,
      setProductDiscount,
      removeProductDiscount,
      adminProducts,
      addAdminProduct,
      updateAdminProduct,
      deleteAdminProduct,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
