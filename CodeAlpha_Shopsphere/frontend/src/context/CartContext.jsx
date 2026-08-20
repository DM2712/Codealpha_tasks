import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'shopsphere_cart_items';
const COUPON_STORAGE_KEY = 'shopsphere_applied_coupon';

export const CartProvider = ({ children }) => {
  const { showToast } = useToast();
  
  // Load initial cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed to parse cart items from localStorage', e);
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save coupon to localStorage', e);
    }
  }, [appliedCoupon]);

  // Add Item to Cart
  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) return;
    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => String(item.id) === String(product.id));

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + qty;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        showToast(`Updated "${product.title}" quantity to ${newQty}`, 'success');
        return updated;
      } else {
        const newItem = {
          id: product.id,
          title: product.title,
          price: parseFloat(product.price),
          image: product.thumbnail || (product.images && product.images[0]) || '',
          category: product.category,
          stock: product.stock || 50,
          quantity: qty
        };
        showToast(`Added "${product.title}" to cart!`, 'success');
        return [...prev, newItem];
      }
    });
  };

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        String(item.id) === String(productId) ? { ...item, quantity: qty } : item
      )
    );
  };

  // Remove single item
  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const itemToRemove = prev.find((item) => String(item.id) === String(productId));
      if (itemToRemove) {
        showToast(`Removed "${itemToRemove.title}" from cart`, 'info');
      }
      return prev.filter((item) => String(item.id) !== String(productId));
    });
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(COUPON_STORAGE_KEY);
  };

  // Coupon handling
  const applyCoupon = (code) => {
    const trimmed = (code || '').trim().toUpperCase();
    if (!trimmed) return { success: false, message: 'Please enter a promo code' };

    if (trimmed === 'SHOPSPHERE10' || trimmed === 'CODEALPHA10') {
      const coupon = { code: trimmed, discountPercent: 10, name: '10% Off Entire Order' };
      setAppliedCoupon(coupon);
      showToast('Coupon "10% OFF" applied!', 'success');
      return { success: true, message: '10% discount applied!' };
    } else if (trimmed === 'VIP20') {
      const coupon = { code: trimmed, discountPercent: 20, name: 'VIP 20% Off' };
      setAppliedCoupon(coupon);
      showToast('VIP 20% discount applied!', 'success');
      return { success: true, message: '20% discount applied!' };
    } else {
      showToast('Invalid or expired coupon code', 'error');
      return { success: false, message: 'Invalid coupon code. Try SHOPSPHERE10' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Pricing calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const discount = useMemo(() => {
    if (!appliedCoupon || !appliedCoupon.discountPercent) return 0;
    return (subtotal * appliedCoupon.discountPercent) / 100;
  }, [subtotal, appliedCoupon]);

  const shippingFee = useMemo(() => {
    if (subtotal === 0) return 0;
    // Free shipping on orders over $50
    return subtotal >= 50 ? 0 : 9.99;
  }, [subtotal]);

  const tax = useMemo(() => {
    if (subtotal === 0) return 0;
    // 8% estimated sales tax
    return (subtotal - discount) * 0.08;
  }, [subtotal, discount]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discount + shippingFee + tax);
  }, [subtotal, discount, shippingFee, tax]);

  const itemCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        subtotal,
        discount,
        shippingFee,
        tax,
        total,
        appliedCoupon,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((prev) => !prev),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
