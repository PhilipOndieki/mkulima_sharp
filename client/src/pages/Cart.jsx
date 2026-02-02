import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../components/cart/CartContext';
import AnimatedSection from '../components/common/AnimatedSection';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { HiTrash, HiShoppingCart, HiPlus, HiMinus } from 'react-icons/hi';

/**
 * Cart Item Component
 */
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [updating, setUpdating] = useState(false);

  /**
   * Handle quantity change with debouncing
   */
  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1 || isNaN(newQuantity)) return;

    try {
      setUpdating(true);
      setQuantity(newQuantity);
      await onUpdateQuantity(item.productId, item.variantId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      setQuantity(item.quantity); // Revert on error
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Handle remove with confirmation
   */
  const handleRemove = async () => {
    if (window.confirm(`Remove ${item.productName} (${item.variantName}) from cart?`)) {
      await onRemove(item.productId, item.variantId);
    }
  };

  // Determine if pricing changed at this quantity
  const willChangePricing = quantity === item.minWholesaleQty;
  const pricingChanged = item.quantity !== quantity && willChangePricing;

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow">
      {/* Product Image */}
      <div className="w-full sm:w-32 h-32 flex-shrink-0">
        <img
          src={item.imageUrl}
          alt={`${item.productName} - ${item.variantName}`}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {item.productName}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          {item.variantName}
        </p>
        <p className="text-xs text-gray-500 mb-3">
          SKU: {item.sku}
        </p>

        {/* Pricing Info */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Price:</span>
            <span className="text-lg font-bold text-primary-600">
              KES {item.unitPrice.toLocaleString()}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded-full font-semibold ${
                item.appliedPricing === 'wholesale'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {item.appliedPricing === 'wholesale' ? 'Wholesale' : 'Retail'}
            </span>
          </div>

          {/* Pricing threshold info */}
          {item.appliedPricing === 'retail' && item.wholesalePrice && (
            <div className="text-xs text-gray-500">
              Buy {item.minWholesaleQty}+ for KES {item.wholesalePrice.toLocaleString()} each
            </div>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || updating}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
              >
                <HiMinus className="w-4 h-4" />
              </button>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val > 0) {
                    setQuantity(val);
                  }
                }}
                onBlur={() => handleQuantityChange(quantity)}
                disabled={updating}
                className="w-16 text-center border-0 focus:outline-none focus:ring-0 text-sm font-semibold"
              />

              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={updating}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase quantity"
              >
                <HiPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pricing change indicator */}
          {pricingChanged && (
            <div className="text-xs text-amber-600 font-medium">
              Price will change!
            </div>
          )}
        </div>
      </div>

      {/* Item Actions */}
      <div className="flex sm:flex-col items-center justify-between sm:justify-start gap-4">
        {/* Subtotal */}
        <div className="text-right">
          <div className="text-sm text-gray-600 mb-1">Subtotal</div>
          <div className="text-xl font-bold text-gray-900">
            KES {item.subtotal.toLocaleString()}
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Remove item"
        >
          <HiTrash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

/**
 * Empty Cart Component
 */
const EmptyCart = () => (
  <div className="text-center py-16">
    <div className="max-w-md mx-auto">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <HiShoppingCart className="w-12 h-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Your Cart is Empty
      </h2>
      <p className="text-gray-600 mb-8">
        Add some products to get started with your order
      </p>
      <Link to="/products">
        <Button variant="primary" size="lg">
          Shop Products
        </Button>
      </Link>
    </div>
  </div>
);

/**
 * Cart Summary Component
 */
const CartSummary = ({ cart }) => {
  const navigate = useNavigate();

  return (
    <Card className="sticky top-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

      {/* Summary Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Total Items:</span>
          <span className="font-semibold">{cart.totalItems}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Subtotal:</span>
          <span className="font-semibold">KES {cart.subtotal.toLocaleString()}</span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total:</span>
            <span className="text-primary-600">
              KES {cart.subtotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="bg-primary-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-primary-900 mb-2 text-sm">
          Pricing Applied:
        </h3>
        <div className="space-y-1 text-xs text-primary-700">
          {cart.items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>{item.productName} ({item.variantName}):</span>
              <span className="font-semibold capitalize">
                {item.appliedPricing}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Button */}
      <Link to="/checkout">
        <Button 
          variant="primary" 
          size="lg" 
          fullWidth
        >
          Proceed to Checkout
        </Button>
      </Link>
      {/* Continue Shopping */}
      <Link to="/products">
        <Button variant="outline" size="md" fullWidth className="mt-3">
          Continue Shopping
        </Button>
      </Link>
    </Card>
  );
};

/**
 * Main Cart Page Component
 */
const Cart = () => {
  const { cart, updateQuantity, removeItem, clearCart, loading } = useCart();

  /**
   * Handle clear cart
   */
  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      await clearCart();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container-custom">
        {/* Page Header */}
        <AnimatedSection animation="fade-up">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
                Shopping Cart
              </h1>
              {cart.items.length > 0 && (
                <p className="text-gray-600">
                  You have {cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''} in your cart
                </p>
              )}
            </div>

            {/* Clear Cart Button */}
            {cart.items.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear Cart
              </button>
            )}
          </div>
        </AnimatedSection>

        {/* Cart Content */}
        {cart.items.length === 0 ? (
          <AnimatedSection animation="fade-up" delay={200}>
            <EmptyCart />
          </AnimatedSection>
        ) : (
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4 mb-8 lg:mb-0">
              {cart.items.map((item, index) => (
                <AnimatedSection
                  key={`${item.productId}-${item.variantId}`}
                  animation="fade-up"
                  delay={index * 100}
                >
                  <CartItem
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                </AnimatedSection>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <AnimatedSection animation="fade-up" delay={300}>
                <CartSummary cart={cart} />
              </AnimatedSection>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;