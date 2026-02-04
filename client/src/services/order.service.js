import { 
  collection, 
  addDoc, 
  updateDoc, 
  getDoc,
  getDocs,
  doc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Order Service
 * 
 * Handles all order-related Firestore operations
 */

/**
 * Generate unique order number
 * Format: MS-YYYY-NNNN
 */
const generateOrderNumber = async () => {
  const year = new Date().getFullYear();
  const ordersRef = collection(db, 'orders');
  const q = query(
    ordersRef,
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  const count = snapshot.size + 1;
  const orderNumber = `MS-${year}-${String(count).padStart(4, '0')}`;
  
  return orderNumber;
};

/**
 * Calculate delivery fee based on county
 */
const calculateDeliveryFee = (county) => {
  // Nairobi and surrounding counties
  const nairobiRegion = ['Nairobi', 'Kiambu', 'Kajiado', 'Machakos'];
  
  if (nairobiRegion.includes(county)) {
    return 500; // KES 500 for Nairobi region
  }
  
  return 1000; // KES 1000 for other counties
};

export const orderService = {
  /**
   * Create new order
   * 
   * @param {Object} orderData - Order information
   * @returns {Promise<Object>} Created order
   */
  createOrder: async (orderData) => {
    try {
      const {
        userId,
        customerName,
        customerEmail,
        customerPhone,
        cartItems,
        cartSubtotal,
        deliveryAddress,
        deliveryMethod = 'standard',
        deliveryInstructions = '',
        paymentMethod = 'cod'
      } = orderData;

      // Generate order number
      const orderNumber = await generateOrderNumber();

      // Calculate delivery fee
      const deliveryFee = calculateDeliveryFee(deliveryAddress.county);

      // Calculate total
      const total = cartSubtotal + deliveryFee;

      // Create order document
      const order = {
        // Order Identification
        orderNumber,
        
        // Customer Information
        userId,
        customerName,
        customerEmail,
        customerPhone,
        
        // Order Items (snapshot of cart)
        items: cartItems.map(item => ({
          productId: item.productId,
          productName: item.productName,
          variantId: item.variantId,
          variantName: item.variantName,
          sku: item.sku,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
          appliedPricing: item.appliedPricing,
          imageUrl: item.imageUrl
        })),
        
        // Pricing
        subtotal: cartSubtotal,
        deliveryFee,
        total,
        
        // Delivery Information
        deliveryAddress,
        deliveryMethod,
        deliveryInstructions,
        
        // Payment Information
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
        
        // Order Status
        status: 'pending_confirmation', // COD orders need admin confirmation
        
        // Status History
        statusHistory: [
          {
            status: 'pending_confirmation',
            timestamp: Timestamp.now(),
            updatedBy: 'customer',
            note: 'Order placed'
          }
        ],
        
        // Admin Notes
        adminNotes: [],
        
        // Timestamps
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        confirmedAt: null,
        deliveredAt: null,
        cancelledAt: null
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'orders'), order);

      console.log(' Order created:', docRef.id);

      return {
        id: docRef.id,
        ...order
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order. Please try again.');
    }
  },

  /**
   * Get order by ID
   * 
   * @param {string} orderId - Order ID
   * @returns {Promise<Object|null>} Order data
   */
  getOrderById: async (orderId) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const orderDoc = await getDoc(orderRef);

      if (orderDoc.exists()) {
        return {
          id: orderDoc.id,
          ...orderDoc.data()
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  /**
   * Get orders by user ID
   * 
   * @param {string} userId - User ID
   * @returns {Promise<Array>} User orders
   */
  getUserOrders: async (userId) => {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const orders = [];

      querySnapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return orders;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  /**
   * Get all orders (Admin only)
   * 
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} All orders
   */
  getAllOrders: async (filters = {}) => {
    try {
      const ordersRef = collection(db, 'orders');
      let q = query(ordersRef, orderBy('createdAt', 'desc'));

      // Apply status filter
      if (filters.status && filters.status !== 'all') {
        q = query(
          ordersRef,
          where('status', '==', filters.status),
          orderBy('createdAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      const orders = [];

      querySnapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return orders;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  },

  /**
   * Update order status
   * 
   * @param {string} orderId - Order ID
   * @param {string} newStatus - New status
   * @param {string} updatedBy - User ID who updated
   * @param {string} note - Optional note
   * @returns {Promise<void>}
   */
  updateOrderStatus: async (orderId, newStatus, updatedBy, note = '') => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const orderDoc = await getDoc(orderRef);

      if (!orderDoc.exists()) {
        throw new Error('Order not found');
      }

      const currentOrder = orderDoc.data();
      const statusHistory = currentOrder.statusHistory || [];

      // Add new status to history
      statusHistory.push({
        status: newStatus,
        timestamp: Timestamp.now(),
        updatedBy,
        note: note || `Status changed to ${newStatus}`
      });

      // Prepare update data
      const updates = {
        status: newStatus,
        statusHistory,
        updatedAt: serverTimestamp()
      };

      // Set confirmation timestamp if confirming
      if (newStatus === 'confirmed' && !currentOrder.confirmedAt) {
        updates.confirmedAt = serverTimestamp();
      }

      // Set delivery timestamp if delivered
      if (newStatus === 'delivered' && !currentOrder.deliveredAt) {
        updates.deliveredAt = serverTimestamp();
      }

      // Set cancelled timestamp if cancelled
      if (newStatus === 'cancelled' && !currentOrder.cancelledAt) {
        updates.cancelledAt = serverTimestamp();
      }

      await updateDoc(orderRef, updates);

      console.log(' Order status updated:', orderId, newStatus);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  /**
   * Add admin note to order
   * 
   * @param {string} orderId - Order ID
   * @param {string} note - Admin note
   * @param {string} adminId - Admin user ID
   * @returns {Promise<void>}
   */
  addAdminNote: async (orderId, note, adminId) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const orderDoc = await getDoc(orderRef);

      if (!orderDoc.exists()) {
        throw new Error('Order not found');
      }

      const currentOrder = orderDoc.data();
      const adminNotes = currentOrder.adminNotes || [];

      adminNotes.push({
        note,
        addedBy: adminId,
        addedAt: Timestamp.now()
      });

      await updateDoc(orderRef, {
        adminNotes,
        updatedAt: serverTimestamp()
      });

      console.log(' Admin note added to order:', orderId);
    } catch (error) {
      console.error('Error adding admin note:', error);
      throw error;
    }
  },

  /**
   * Cancel order
   * 
   * @param {string} orderId - Order ID
   * @param {string} cancelledBy - User ID who cancelled
   * @param {string} reason - Cancellation reason
   * @returns {Promise<void>}
   */
  cancelOrder: async (orderId, cancelledBy, reason = 'Cancelled by customer') => {
    try {
      await orderService.updateOrderStatus(
        orderId,
        'cancelled',
        cancelledBy,
        reason
      );

      console.log(' Order cancelled:', orderId);
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  },

  /**
   * Get order statistics (for dashboard)
   * 
   * @returns {Promise<Object>} Order statistics
   */
  getOrderStats: async () => {
    try {
      const ordersRef = collection(db, 'orders');
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get all orders
      const allOrdersQuery = await getDocs(ordersRef);
      const allOrders = [];
      allOrdersQuery.forEach(doc => {
        allOrders.push({ id: doc.id, ...doc.data() });
      });

      // Calculate stats
      const todayOrders = allOrders.filter(order => {
        const orderDate = order.createdAt?.toDate();
        return orderDate >= today;
      });

      const pendingConfirmation = allOrders.filter(
        order => order.status === 'pending_confirmation'
      ).length;

      const processing = allOrders.filter(
        order => order.status === 'processing'
      ).length;

      const outForDelivery = allOrders.filter(
        order => order.status === 'out_for_delivery'
      ).length;

      const todayRevenue = todayOrders.reduce(
        (sum, order) => sum + (order.total || 0),
        0
      );

      return {
        todayOrders: todayOrders.length,
        pendingConfirmation,
        processing,
        outForDelivery,
        todayRevenue,
        totalOrders: allOrders.length
      };
    } catch (error) {
      console.error('Error fetching order stats:', error);
      return {
        todayOrders: 0,
        pendingConfirmation: 0,
        processing: 0,
        outForDelivery: 0,
        todayRevenue: 0,
        totalOrders: 0
      };
    }
  }
};

export default orderService;