import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../components/cart/CartContext';
import orderService from '../services/order.service';
import Button from '../components/common/Button';
import { HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';

/**
 * Checkout Page
 * 
 * Phase 1: Basic Checkout with Cash on Delivery
 * Now supports guest checkout - auth required only at order submission
 */
const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { cart, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Delivery form state
  const [deliveryData, setDeliveryData] = useState({
    name: '',
    email: '',
    street: '',
    city: '',
    county: '',
    postalCode: '',
    phone: '',
    instructions: ''
  });

  // Kenya counties for dropdown
  const kenyanCounties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu',
    'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho',
    'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale',
    'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera', 'Marsabit',
    'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 'Nakuru',
    'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu',
    'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia',
    'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
  ];

  // Check if cart is empty and redirect
  useEffect(() => {
    if (cart.items.length === 0) {
      navigate('/cart');
      return;
    }
  }, [cart.items.length, navigate]);

  // Pre-fill form with user data if authenticated
  useEffect(() => {
    if (isAuthenticated() && user) {
      setDeliveryData(prev => ({
        ...prev,
        name: user.displayName || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        street: user.address || prev.street
      }));
    }
  }, [user, isAuthenticated]);

  // Calculate delivery fee based on county
  const calculateDeliveryFee = (county) => {
    const nairobiRegion = ['Nairobi', 'Kiambu', 'Kajiado', 'Machakos'];
    return nairobiRegion.includes(county) ? 500 : 1000;
  };

  const deliveryFee = deliveryData.county ? calculateDeliveryFee(deliveryData.county) : 0;
  const total = cart.subtotal + deliveryFee;

  /**
   * Handle form input change
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Validate delivery form
   */
  const validateForm = () => {
    if (!deliveryData.name.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!deliveryData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!deliveryData.street.trim()) {
      setError('Street address is required');
      return false;
    }
    if (!deliveryData.city.trim()) {
      setError('City is required');
      return false;
    }
    if (!deliveryData.county) {
      setError('County is required');
      return false;
    }
    if (!deliveryData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }

    // Validate phone number format
    const phoneRegex = /^(\+254|254|0)[17]\d{8}$/;
    if (!phoneRegex.test(deliveryData.phone.replace(/\s/g, ''))) {
      setError('Please enter a valid Kenyan phone number');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(deliveryData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  /**
   * Handle place order
   */
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate form first
    if (!validateForm()) {
      return;
    }

    // Check authentication - prompt if not logged in
    if (!isAuthenticated()) {
      // Save form data to session storage
      sessionStorage.setItem('pendingCheckoutData', JSON.stringify({
        deliveryData,
        cartItems: cart.items,
        cartSubtotal: cart.subtotal
      }));
      
      // Show auth prompt instead of immediate redirect
      setShowAuthPrompt(true);
      return;
    }

    // User is authenticated - proceed with order
    await submitOrder();
  };

  /**
   * Submit order to database
   */
  const submitOrder = async () => {
    try {
      setLoading(true);

      // Create order
      const order = await orderService.createOrder({
        userId: user.uid,
        customerName: deliveryData.name,
        customerEmail: deliveryData.email,
        customerPhone: deliveryData.phone,
        cartItems: cart.items,
        cartSubtotal: cart.subtotal,
        deliveryAddress: {
          street: deliveryData.street,
          city: deliveryData.city,
          county: deliveryData.county,
          postalCode: deliveryData.postalCode || ''
        },
        deliveryMethod: 'standard',
        deliveryInstructions: deliveryData.instructions,
        paymentMethod: 'cod'
      });

      console.log(' Order created:', order.orderNumber);

      // Clear cart
      await clearCart();

      // Clear any saved checkout data
      sessionStorage.removeItem('pendingCheckoutData');

      // Redirect to confirmation page
      navigate('/order-confirmation', {
        state: { orderId: order.id, orderNumber: order.orderNumber }
      });
    } catch (err) {
      console.error('Order creation failed:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle redirect to login
   */
  const handleLoginRedirect = () => {
    navigate('/login', { 
      state: { 
        from: { pathname: '/checkout' },
        message: 'Please sign in to complete your order'
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Review your order and complete delivery details</p>
        </div>

        {/* Auth Prompt Modal */}
        {showAuthPrompt && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={() => setShowAuthPrompt(false)}
              ></div>

              {/* Modal */}
              <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 mb-4">
                    <HiExclamationCircle className="h-6 w-6 text-primary-600" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Sign In Required
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    Please sign in to complete your order and track your delivery.
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={handleLoginRedirect}
                      className="w-full btn-primary"
                    >
                      Sign In to Continue
                    </button>
                    
                    <button
                      onClick={() => setShowAuthPrompt(false)}
                      className="w-full btn-secondary"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <HiExclamationCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address Form */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Delivery Information
              </h2>

              <form className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={deliveryData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., John Doe"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={deliveryData.email}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., john@example.com"
                    required
                  />
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={deliveryData.street}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., 123 Kenyatta Avenue"
                    required
                  />
                </div>

                {/* City & County */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City/Town *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={deliveryData.city}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="e.g., Nairobi"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      County *
                    </label>
                    <select
                      name="county"
                      value={deliveryData.county}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select county...</option>
                      {kenyanCounties.map(county => (
                        <option key={county} value={county}>
                          {county}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Postal Code & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code (Optional)
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={deliveryData.postalCode}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="e.g., 00100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={deliveryData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="+254 712 345 678"
                      required
                    />
                  </div>
                </div>

                {/* Delivery Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Instructions (Optional)
                  </label>
                  <textarea
                    name="instructions"
                    value={deliveryData.instructions}
                    onChange={handleInputChange}
                    rows={3}
                    className="textarea-field"
                    placeholder="e.g., Call on arrival, gate code is 1234"
                  />
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Payment Method
              </h2>

              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                <div className="flex items-start">
                  <HiCheckCircle className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-1">
                      Cash on Delivery (COD)
                    </h3>
                    <p className="text-sm text-amber-700">
                      Pay with cash when your order is delivered. Our delivery agent will collect payment upon delivery.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                More payment methods (M-Pesa, Bank Transfer) coming soon!
              </p>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-card p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Order Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {item.productName}
                      </h4>
                      <p className="text-xs text-gray-600">{item.variantName}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} × KES {item.unitPrice.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      KES {item.subtotal.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({cart.totalItems} items)</span>
                  <span className="font-semibold">
                    KES {cart.subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">
                    {deliveryData.county ? (
                      `KES ${deliveryFee.toLocaleString()}`
                    ) : (
                      <span className="text-gray-400">Select county</span>
                    )}
                  </span>
                </div>

                {deliveryData.county && (
                  <p className="text-xs text-gray-500">
                    {calculateDeliveryFee(deliveryData.county) === 500
                      ? 'Nairobi region delivery'
                      : 'Other counties delivery'}
                  </p>
                )}

                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-primary-600">
                    KES {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handlePlaceOrder}
                loading={loading}
                disabled={loading || !deliveryData.county}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </Button>

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center text-xs text-gray-600 mb-2">
                  <HiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center text-xs text-gray-600 mb-2">
                  <HiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Quality products guaranteed</span>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <HiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Fast & reliable delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;