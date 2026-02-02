import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import orderService from '../services/order.service';
import Button from '../components/common/Button';
import { HiCheckCircle, HiShoppingBag, HiHome } from 'react-icons/hi';

/**
 * Order Confirmation Page
 * 
 * Shown after successful order placement
 */
const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get order details from location state
  const { orderId, orderNumber } = location.state || {};

  useEffect(() => {
    // Redirect if no order info
    if (!orderId || !orderNumber) {
      navigate('/');
      return;
    }

    // Fetch full order details
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await orderService.getOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, orderNumber, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Order not found</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-3xl">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <HiCheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600">
            Thank you for your order. We'll process it shortly.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-xl shadow-card p-8 mb-6">
          {/* Order Number */}
          <div className="text-center mb-8 pb-6 border-b border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Order Number</p>
            <p className="text-2xl font-bold text-primary-600">
              {order.orderNumber}
            </p>
          </div>

          {/* Order Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Delivery Address */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Delivery Address</h3>
              <p className="text-gray-700 text-sm">
                {order.deliveryAddress.street}<br />
                {order.deliveryAddress.city}, {order.deliveryAddress.county}<br />
                {order.deliveryAddress.postalCode && `${order.deliveryAddress.postalCode}`}
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Phone: {order.customerPhone}
              </p>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-amber-900">
                  Cash on Delivery
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Pay when you receive your order
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 pb-3 border-b border-gray-100 last:border-0"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {item.productName}
                    </h4>
                    <p className="text-sm text-gray-600">{item.variantName}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × KES {item.unitPrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      KES {item.subtotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Subtotal</span>
              <span>KES {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-3">
              <span>Delivery Fee</span>
              <span>KES {order.deliveryFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-300">
              <span>Total</span>
              <span className="text-primary-600">
                KES {order.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">What happens next?</h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="font-semibold mr-2">1.</span>
              <span>Our team will review and confirm your order within 24 hours</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">2.</span>
              <span>We'll prepare your items for delivery</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">3.</span>
              <span>You'll receive your order within 2-5 business days</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">4.</span>
              <span>Pay cash to our delivery agent when you receive your order</span>
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/orders" className="flex-1">
            <Button variant="primary" size="lg" fullWidth>
              <HiShoppingBag className="w-5 h-5 mr-2 inline" />
              Track My Order
            </Button>
          </Link>
          <Link to="/" className="flex-1">
            <Button variant="outline" size="lg" fullWidth>
              <HiHome className="w-5 h-5 mr-2 inline" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Questions about your order?{' '}
            <Link to="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;