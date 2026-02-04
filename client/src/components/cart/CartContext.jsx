import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { cartService } from '../../services/cart.service';

const CartContext = createContext();

/**
 * Cart Provider Component
 */
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    subtotal: 0
  });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  
  const { user, isAuthenticated } = useAuth();

  /**
   * Load cart on mount and when user changes
   */
  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        
        if (isAuthenticated() && user?.uid) {
          // Authenticated user: sync cart
          const syncedCart = await cartService.syncCart(user.uid);
          setCart(syncedCart);
        } else {
          // Guest user: load from localStorage
          const localCart = cartService.getLocalCart();
          setCart(localCart);
        }
      } catch (error) {
        console.error('[CART CONTEXT] Error loading cart:', error);
        // Fallback to empty cart
        setCart(cartService.clearCart());
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user?.uid, isAuthenticated]);

  /**
   * Save cart to appropriate storage
   */
  const saveCart = useCallback(async (updatedCart) => {
    try {
      // Save to localStorage immediately
      cartService.saveLocalCart(updatedCart);
      
      // Save to Firestore if authenticated
      if (isAuthenticated() && user?.uid) {
        setSyncing(true);
        await cartService.saveFirestoreCart(user.uid, updatedCart);
        setSyncing(false);
      }
      
      setCart(updatedCart);
    } catch (error) {
      console.error('[CART CONTEXT] Error saving cart:', error);
      setSyncing(false);
    }
  }, [user?.uid, isAuthenticated]);

  /**
   * Add item to cart
   * 
   * @param {Object} product - Product object
   * @param {Object} variant - Variant object  
   * @param {number} quantity - Quantity to add
   * @returns {Promise<void>}
   */
  const addToCart = useCallback(async (product, variant, quantity = 1) => {
    try {
      console.log('[CART] Adding to cart:', { product: product.name, variant: variant.name, quantity });
      
      const updatedCart = cartService.addItem(cart, product, variant, quantity);
      await saveCart(updatedCart);
      
      // Optional: Show toast notification
      console.log(' Added to cart successfully');
      
      return { success: true };
    } catch (error) {
      console.error('[CART CONTEXT] Error adding to cart:', error);
      return { success: false, error: error.message };
    }
  }, [cart, saveCart]);

  /**
   * Update item quantity
   * 
   * @param {string} productId - Product ID
   * @param {string} variantId - Variant ID
   * @param {number} newQuantity - New quantity
   * @returns {Promise<void>}
   */
  const updateQuantity = useCallback(async (productId, variantId, newQuantity) => {
    try {
      console.log('[CART] Updating quantity:', { productId, variantId, newQuantity });
      
      if (newQuantity < 1) {
        throw new Error('Quantity must be at least 1');
      }
      
      const updatedCart = cartService.updateItemQuantity(cart, productId, variantId, newQuantity);
      await saveCart(updatedCart);
      
      console.log(' Quantity updated successfully');
      
      return { success: true };
    } catch (error) {
      console.error('[CART CONTEXT] Error updating quantity:', error);
      return { success: false, error: error.message };
    }
  }, [cart, saveCart]);

  /**
   * Remove item from cart
   * 
   * @param {string} productId - Product ID
   * @param {string} variantId - Variant ID
   * @returns {Promise<void>}
   */
  const removeItem = useCallback(async (productId, variantId) => {
    try {
      console.log('[CART] Removing item:', { productId, variantId });
      
      const updatedCart = cartService.removeItem(cart, productId, variantId);
      await saveCart(updatedCart);
      
      console.log(' Item removed successfully');
      
      return { success: true };
    } catch (error) {
      console.error('[CART CONTEXT] Error removing item:', error);
      return { success: false, error: error.message };
    }
  }, [cart, saveCart]);

  /**
   * Clear entire cart
   * 
   * @returns {Promise<void>}
   */
  const clearCart = useCallback(async () => {
    try {
      console.log('[CART] Clearing cart');
      
      const emptyCart = cartService.clearCart();
      await saveCart(emptyCart);
      
      console.log(' Cart cleared successfully');
      
      return { success: true };
    } catch (error) {
      console.error('[CART CONTEXT] Error clearing cart:', error);
      return { success: false, error: error.message };
    }
  }, [saveCart]);

  /**
   * Get item from cart
   * 
   * @param {string} productId - Product ID
   * @param {string} variantId - Variant ID
   * @returns {Object|null} Cart item or null
   */
  const getItem = useCallback((productId, variantId) => {
    return cart.items.find(
      item => item.productId === productId && item.variantId === variantId
    ) || null;
  }, [cart.items]);

  /**
   * Check if item is in cart
   * 
   * @param {string} productId - Product ID
   * @param {string} variantId - Variant ID
   * @returns {boolean}
   */
  const isInCart = useCallback((productId, variantId) => {
    return cart.items.some(
      item => item.productId === productId && item.variantId === variantId
    );
  }, [cart.items]);

  /**
   * Refresh cart (re-sync)
   */
  const refreshCart = useCallback(async () => {
    try {
      setLoading(true);
      
      if (isAuthenticated() && user?.uid) {
        const syncedCart = await cartService.syncCart(user.uid);
        setCart(syncedCart);
      } else {
        const localCart = cartService.getLocalCart();
        setCart(localCart);
      }
    } catch (error) {
      console.error('[CART CONTEXT] Error refreshing cart:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, isAuthenticated]);

  const value = {
    // State
    cart,
    loading,
    syncing,
    
    // Cart operations
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    
    // Utility functions
    getItem,
    isInCart,
    refreshCart,
    
    // Computed values
    isEmpty: cart.items.length === 0,
    itemCount: cart.totalItems,
    subtotal: cart.subtotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

/**
 * Custom hook to use cart context
 * 
 * @returns {Object} Cart context value
 * @throws {Error} If used outside CartProvider
 */
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  
  return context;
};

export default CartContext;