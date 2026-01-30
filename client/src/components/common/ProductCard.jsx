import { useState } from 'react';
import { useCart } from '../cart/CartContext';
import Button from './Button';

const ProductCard = ({ product }) => {
  const { addToCart, getItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0] || null
  );
  const [adding, setAdding] = useState(false);
  
  // Check if product is in cart
  const cartItem = selectedVariant ? getItem(product.id, selectedVariant.id) : null;
  const inCart = cartItem !== null;

  /**
   * Handle add to cart
   */
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedVariant || adding) return;
    
    try {
      setAdding(true);
      const result = await addToCart(product, selectedVariant, 1);
      
      if (result.success) {
        // Optional: Show success toast
        console.log(`✅ Added ${product.name} (${selectedVariant.name}) to cart`);
      } else {
        console.error('❌ Failed to add to cart:', result.error);
      }
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
    } finally {
      setAdding(false);
    }
  };

  /**
   * Handle variant change
   */
  const handleVariantChange = (e) => {
    e.stopPropagation();
    const variantId = e.target.value;
    const variant = product.variants.find(v => v.id === variantId);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  if (!selectedVariant) {
    return null; // Product has no variants
  }

  return (
    <div 
      className="product-card block bg-white rounded-xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover"
      onClick={handleAddToCart}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleAddToCart(e);
        }
      }}
    >
      {/* Product Image */}
      <div className="relative h-48 md:h-56 overflow-hidden bg-gray-100">
        <img 
          src={product.imageUrl} 
          alt={`${product.name} - ${selectedVariant.name}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          loading="lazy"
        />
        
        {/* Badge: In Cart */}
        {inCart && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            In Cart ({cartItem.quantity})
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
          {product.category}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 md:p-5">
        {/* Product Name */}
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Variant Selector (if multiple variants) */}
        {product.hasVariants && product.variants.length > 1 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Size/Type
            </label>
            <select
              value={selectedVariant.id}
              onChange={handleVariantChange}
              onClick={(e) => e.stopPropagation()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              {product.variants.map(variant => (
                <option key={variant.id} value={variant.id}>
                  {variant.name} - KES {variant.retailPrice.toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Pricing Display */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold text-primary-600">
              KES {selectedVariant.retailPrice.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">/ {product.unit}</span>
          </div>
          
          {/* Wholesale Price Display */}
          {selectedVariant.wholesalePrice && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Wholesale (10+):</span>
              <span className="font-semibold text-primary-700">
                KES {selectedVariant.wholesalePrice.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* SKU Display */}
        {selectedVariant.sku && (
          <div className="text-xs text-gray-500 mb-4">
            SKU: {selectedVariant.sku}
          </div>
        )}

        {/* Add to Cart Button */}
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={handleAddToCart}
          disabled={adding}
          loading={adding}
          className="relative"
        >
          {adding ? (
            'Adding...'
          ) : inCart ? (
            <>
              <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Add More
            </>
          ) : (
            <>
              <svg className="w-5 h-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;