import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import orderService from '../services/order.service';
import OrderTimeline from '../components/customer/OrderTimeline';
import { 
  HiArrowLeft, 
  HiLocationMarker,
  HiPhone,
  HiMail,
  HiX
} from 'react-icons/hi';

/**
 * OrderDetails Page
 * 
 * Phase 3: Customer Order Details
 * Detailed view of a single order with timeline and cancel option
 */
const OrderDetails = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  /**
   * Fetch order details
   */
  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      const orderData = await orderService.getOrderById(orderId);

      // Verify this order belongs to the current user
      if (orderData.userId !== user.uid) {
        navigate('/my-orders');
        return;
      }

      setOrder(orderData);
      console.log('✅ Loaded order:', orderData.orderNumber);
    } catch (err) {
      console.error('❌ Error fetching order:', err);
      setError('Failed to load order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && orderId) {
      fetchOrder();
    }
  }, [user, orderId]);

  /**
   * Handle cancel order
   */
  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    try {
      setIsCancelling(true);

      await orderService.cancelOrder(orderId, cancelReason, user.email);

      // Refresh order
      await fetchOrder();
      setShowCancelModal(false);
      setCancelReason('');

    } catch (err) {
      console.error('❌ Error cancelling order:', err);
      alert('Failed to cancel order. Please contact support.');
    } finally {
      setIsCancelling(false);
    }
  };

  /**
   * Check if order can be cancelled
   */
  const canCancelOrder = () => {
    if (!order) return false;
    return ['pending_confirmation', 'confirmed'].includes(order.status);
  };

  /**
   * Format date
   */
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Get status badge
   */
  const getStatusBadge = (status) => {
    const badges = {
      pending_confirmation: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Confirmation' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Confirmed' },
      processing: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Processing' },
      out_for_delivery: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Out for Delivery' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' }
    };

    const badge = badges[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };

    return (
      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This order does not exist.'}</p>
          <Link to="/my-orders" className="btn-primary">
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Back Button */}
        <Link
          to="/my-orders"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 font-medium"
        >
          <HiArrowLeft className="w-5 h-5" />
          Back to My Orders
        </Link>

        {/* Order Header */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-600">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {getStatusBadge(order.status)}
              {canCancelOrder() && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="mb-6">
          <OrderTimeline order={order} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
              
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                    {/* Product Image */}
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.variantName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">
                        KES {item.unitPrice?.toLocaleString()} each
                      </p>
                      <p className="font-semibold text-gray-900">
                        KES {item.subtotal?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span className="font-medium">
                      KES {order.subtotal?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery Fee:</span>
                    <span className="font-medium">
                      KES {order.deliveryFee?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span>KES {order.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Info */}
          <div className="space-y-6">
            {/* Delivery Information */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <HiLocationMarker className="w-5 h-5 text-primary-600" />
                Delivery Address
              </h2>
              <div className="text-gray-700 space-y-1">
                <p className="font-medium">{order.customerName}</p>
                <p>{order.deliveryAddress?.street}</p>
                <p>{order.deliveryAddress?.city}</p>
                <p>{order.deliveryAddress?.county}</p>
                <p>{order.deliveryAddress?.postalCode}</p>
              </div>
              {order.deliveryInstructions && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Delivery Instructions:
                  </p>
                  <p className="text-sm text-blue-700">
                    {order.deliveryInstructions}
                  </p>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <HiPhone className="w-5 h-5 text-primary-600" />
                  <span>{order.customerPhone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <HiMail className="w-5 h-5 text-primary-600" />
                  <span>{order.customerEmail}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Payment Method
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  order.paymentStatus === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-primary-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-700 mb-4">
                Contact our support team if you have any questions about your order.
              </p>
              <Link
                to="/contact"
                className="btn-primary w-full text-center"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowCancelModal(false)}
          ></div>

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Cancel Order</h2>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <HiX className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to cancel order <strong>#{order.orderNumber}</strong>?
                </p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Cancellation *
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="input-field"
                    rows="4"
                    placeholder="Please tell us why you're cancelling this order..."
                  ></textarea>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 btn-secondary"
                  disabled={isCancelling}
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isCancelling || !cancelReason}
                >
                  {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;