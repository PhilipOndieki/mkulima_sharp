import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Cart storage keys
const CART_STORAGE_KEY = 'mkulima-cart';
const CART_VERSION = '1.0';

/**
 * Calculate unit price based on quantity
 * Rule: quantity < 10 → Retail Price, quantity ≥ 10 → Wholesale Price
 * 
 * @param {Object} variant - Product variant
 * @param {number} quantity - Item quantity
 * @returns {Object} { price, type }
 */
const calculateUnitPrice = (variant, quantity) => {
  const minWholesaleQty = 10; // Standard wholesale threshold
  
  if (quantity >= minWholesaleQty && variant.wholesalePrice) {
    return {
      price: variant.wholesalePrice,
      type: 'wholesale'
    };
  }
  
  return {
    price: variant.retailPrice,
    type: 'retail'
  };
};

/**
 * Calculate cart totals
 * 
 * @param {Array} items - Cart items
 * @returns {Object} { totalItems, subtotal }
 */
const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  
  return { totalItems, subtotal };
};

/**
 * Validate cart item
 * 
 * @param {Object} item - Cart item
 * @returns {boolean} Is valid
 */
const validateCartItem = (item) => {
  if (!item.productId || !item.variantId) {
    console.error('[CART SERVICE] Invalid item: missing productId or variantId', item);
    return false;
  }
  
  if (!item.quantity || item.quantity < 1) {
    console.error('[CART SERVICE] Invalid item: invalid quantity', item);
    return false;
  }
  
  if (!item.unitPrice || item.unitPrice <= 0) {
    console.error('[CART SERVICE] Invalid item: invalid price', item);
    return false;
  }
  
  return true;
};

/**
 * Create cart item object
 * 
 * @param {Object} product - Product object
 * @param {Object} variant - Variant object
 * @param {number} quantity - Quantity
 * @returns {Object} Cart item
 */
const createCartItem = (product, variant, quantity = 1) => {
  const pricing = calculateUnitPrice(variant, quantity);
  
  return {
    productId: product.id,
    variantId: variant.id,
    productName: product.name,
    variantName: variant.name,
    sku: variant.sku,
    quantity,
    unitPrice: pricing.price,
    subtotal: pricing.price * quantity,
    imageUrl: product.imageUrl,
    appliedPricing: pricing.type,
    wholesalePrice: variant.wholesalePrice,
    retailPrice: variant.retailPrice,
    minWholesaleQty: product.minWholesaleQty || 10
  };
};

/**
 * Recalculate cart item pricing based on quantity
 * 
 * @param {Object} item - Cart item
 * @param {number} newQuantity - New quantity
 * @returns {Object} Updated cart item
 */
const recalculateItemPricing = (item, newQuantity) => {
  const pricing = calculateUnitPrice(
    { 
      wholesalePrice: item.wholesalePrice, 
      retailPrice: item.retailPrice 
    }, 
    newQuantity
  );
  
  return {
    ...item,
    quantity: newQuantity,
    unitPrice: pricing.price,
    subtotal: pricing.price * newQuantity,
    appliedPricing: pricing.type
  };
};

/**
 * Cart Service
 */
export const cartService = {
  /**
   * Get cart from localStorage
   * 
   * @returns {Object} Cart data
   */
  getLocalCart: () => {
    try {
      const cartJson = localStorage.getItem(CART_STORAGE_KEY);
      
      if (!cartJson) {
        return {
          items: [],
          totalItems: 0,
          subtotal: 0,
          version: CART_VERSION
        };
      }
      
      const cart = JSON.parse(cartJson);
      
      // Version check
      if (cart.version !== CART_VERSION) {
        console.warn('[CART SERVICE] Cart version mismatch, resetting cart');
        return {
          items: [],
          totalItems: 0,
          subtotal: 0,
          version: CART_VERSION
        };
      }
      
      return cart;
    } catch (error) {
      console.error('[CART SERVICE] Error reading local cart:', error);
      return {
        items: [],
        totalItems: 0,
        subtotal: 0,
        version: CART_VERSION
      };
    }
  },
  
  /**
   * Save cart to localStorage
   * 
   * @param {Object} cartData - Cart data
   * @returns {boolean} Success status
   */
  saveLocalCart: (cartData) => {
    try {
      const cart = {
        ...cartData,
        version: CART_VERSION,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      return true;
    } catch (error) {
      console.error('[CART SERVICE] Error saving local cart:', error);
      return false;
    }
  },
  
  /**
   * Get cart from Firestore
   * 
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Cart data or null
   */
  getFirestoreCart: async (userId) => {
    try {
      if (!userId) return null;
      
      const cartRef = doc(db, 'carts', userId);
      const cartDoc = await getDoc(cartRef);
      
      if (cartDoc.exists()) {
        return {
          ...cartDoc.data(),
          id: cartDoc.id
        };
      }
      
      return null;
    } catch (error) {
      console.error('[CART SERVICE] Error getting Firestore cart:', error);
      return null;
    }
  },
  
  /**
   * Save cart to Firestore
   * 
   * @param {string} userId - User ID
   * @param {Object} cartData - Cart data
   * @returns {Promise<boolean>} Success status
   */
  saveFirestoreCart: async (userId, cartData) => {
    try {
      if (!userId) return false;
      
      const cartRef = doc(db, 'carts', userId);
      const cart = {
        userId,
        items: cartData.items,
        totalItems: cartData.totalItems,
        subtotal: cartData.subtotal,
        version: CART_VERSION,
        updatedAt: serverTimestamp()
      };
      
      await setDoc(cartRef, cart, { merge: true });
      return true;
    } catch (error) {
      console.error('[CART SERVICE] Error saving Firestore cart:', error);
      return false;
    }
  },
  
  /**
   * Merge local cart with Firestore cart
   * Strategy: Firestore takes precedence, add local-only items
   * 
   * @param {Object} localCart - Local cart data
   * @param {Object} firestoreCart - Firestore cart data
   * @returns {Object} Merged cart
   */
  mergeCartData: (localCart, firestoreCart) => {
    if (!firestoreCart || !firestoreCart.items) {
      return localCart;
    }
    
    if (!localCart || !localCart.items) {
      return firestoreCart;
    }
    
    // Start with Firestore items
    const mergedItems = [...firestoreCart.items];
    const firestoreItemKeys = new Set(
      firestoreCart.items.map(item => `${item.productId}-${item.variantId}`)
    );
    
    // Add local items that don't exist in Firestore
    for (const localItem of localCart.items) {
      const itemKey = `${localItem.productId}-${localItem.variantId}`;
      if (!firestoreItemKeys.has(itemKey)) {
        mergedItems.push(localItem);
      }
    }
    
    const totals = calculateTotals(mergedItems);
    
    return {
      items: mergedItems,
      ...totals,
      version: CART_VERSION
    };
  },
  
  /**
   * Sync cart between localStorage and Firestore
   * 
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Synced cart
   */
  syncCart: async (userId) => {
    try {
      const localCart = cartService.getLocalCart();
      
      if (!userId) {
        // User not authenticated, use local cart only
        return localCart;
      }
      
      const firestoreCart = await cartService.getFirestoreCart(userId);
      const mergedCart = cartService.mergeCartData(localCart, firestoreCart);
      
      // Save merged cart to both stores
      cartService.saveLocalCart(mergedCart);
      await cartService.saveFirestoreCart(userId, mergedCart);
      
      console.log('[CART SERVICE] Cart synced successfully');
      return mergedCart;
    } catch (error) {
      console.error('[CART SERVICE] Error syncing cart:', error);
      return cartService.getLocalCart();
    }
  },
  
  /**
   * Add item to cart
   * 
   * @param {Object} cart - Current cart
   * @param {Object} product - Product object
   * @param {Object} variant - Variant object
   * @param {number} quantity - Quantity to add
   * @returns {Object} Updated cart
   */
  addItem: (cart, product, variant, quantity = 1) => {
    try {
      const items = [...cart.items];
      
      // Check if item already exists
      const existingItemIndex = items.findIndex(
        item => item.productId === product.id && item.variantId === variant.id
      );
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const existingItem = items[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;
        items[existingItemIndex] = recalculateItemPricing(existingItem, newQuantity);
      } else {
        // Add new item
        const newItem = createCartItem(product, variant, quantity);
        
        if (!validateCartItem(newItem)) {
          throw new Error('Invalid cart item');
        }
        
        items.push(newItem);
      }
      
      const totals = calculateTotals(items);
      
      return {
        items,
        ...totals,
        version: CART_VERSION
      };
    } catch (error) {
      console.error('[CART SERVICE] Error adding item:', error);
      throw error;
    }
  },
  
  /**
   * Update item quantity
   * 
   * @param {Object} cart - Current cart
   * @param {string} productId - Product ID
   * @param {string} variantId - Variant ID
   * @param {number} newQuantity - New quantity
   * @returns {Object} Updated cart
   */
  updateItemQuantity: (cart, productId, variantId, newQuantity) => {
    try {
      if (newQuantity < 1) {
        throw new Error('Quantity must be at least 1');
      }
      
      const items = cart.items.map(item => {
        if (item.productId === productId && item.variantId === variantId) {
          return recalculateItemPricing(item, newQuantity);
        }
        return item;
      });
      
      const totals = calculateTotals(items);
      
      return {
        items,
        ...totals,
        version: CART_VERSION
      };
    } catch (error) {
      console.error('[CART SERVICE] Error updating quantity:', error);
      throw error;
    }
  },
  
  /**
   * Remove item from cart
   * 
   * @param {Object} cart - Current cart
   * @param {string} productId - Product ID
   * @param {string} variantId - Variant ID
   * @returns {Object} Updated cart
   */
  removeItem: (cart, productId, variantId) => {
    try {
      const items = cart.items.filter(
        item => !(item.productId === productId && item.variantId === variantId)
      );
      
      const totals = calculateTotals(items);
      
      return {
        items,
        ...totals,
        version: CART_VERSION
      };
    } catch (error) {
      console.error('[CART SERVICE] Error removing item:', error);
      throw error;
    }
  },
  
  /**
   * Clear cart
   * 
   * @returns {Object} Empty cart
   */
  clearCart: () => {
    return {
      items: [],
      totalItems: 0,
      subtotal: 0,
      version: CART_VERSION
    };
  },
  
  /**
   * Calculate item price based on quantity (utility export)
   */
  calculateItemPrice: calculateUnitPrice,
  
  /**
   * Calculate cart totals (utility export)
   */
  calculateTotals
};

export default cartService;