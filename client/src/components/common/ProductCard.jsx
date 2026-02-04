import { useState } from 'react';
import { useCart } from '../cart/CartContext';
import Button from './Button';
import ProductPriceDisplay from './ProductPriceDisplay';
import ChickenPriceSelector from './ChickenPriceSelector';

const ProductCard = ({ product }) => {
  const { addToCart, getItem } = useCart();
  
  // State for chicken products
  const [selectedAge, setSelectedAge] = useState(
    product.priceByAge ? Object.keys(product.priceByAge)[0] : null
  );
  const [chickenQuantity, setChickenQuantity] = useState(50); // Chickens: min 50
  
  const [adding, setAdding] = useState(false);
  
  // Determine product type
  const isChicken = product.category === 'Chickens' && product.priceByAge;
  
  // Check if product is in cart (using product.id as both IDs since no variants)
  const cartItem = getItem(product.id, product.id);
  const inCart = cartItem !== null;

  /**
   * Handle Add to Cart - Equipment Products
   */
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (adding) return;
    
    try {
      setAdding(true);
      
      // Create pseudo-variant object for cart compatibility
      // (Cart service still expects variant format, but we're using product data)
      const pseudoVariant = {
        id: product.id,
        name: product.name,
        sku: product.sku || `SKU-${product.id}`,
        wholesalePrice: product.wholesalePrice,
        retailPrice: product.price,
        inStock: product.inStock !== false,
        stockQuantity: product.stockQuantity || 100
      };
      
      const result = await addToCart(product, pseudoVariant, 1);
      
      if (result.success) {
        console.log(` Added ${product.name} to cart`);
      } else {
        console.error('Failed to add to cart:', result.error);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAdding(false);
    }
  };

  /**
   * Handle Add to Cart - Chicken Products
   */
  const handleAddChickenToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (adding || !selectedAge) return;
    
    try {
      setAdding(true);
      
      // Create pseudo-variant for chicken with selected age
      const chickenPrice = product.priceByAge[selectedAge];
      const chickenVariant = {
        id: `${product.id}-${selectedAge}`,
        name: `${product.name} - ${selectedAge}`,
        sku: `${product.sku || product.id}-${selectedAge}`,
        wholesalePrice: chickenPrice,
        retailPrice: chickenPrice,
        inStock: product.inStock !== false,
        stockQuantity: product.stockQuantity || 1000
      };
      
      const result = await addToCart(product, chickenVariant, chickenQuantity);
      
      if (result.success) {
        console.log(`Added ${chickenQuantity} ${product.name} (${selectedAge}) to cart`);
      } else {
        console.error('Failed to add to cart:', result.error);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAdding(false);
    }
  };

  /**
   * Handle age selection for chickens
   */
  const handleAgeSelect = (age, price) => {
    setSelectedAge(age);
    console.log(`Selected ${age} at ${price} KSh`);
  };

  return (
    <div 
      className="product-card block bg-white rounded-xl shadow-card overflow-hidden 
                 transition-all duration-300 hover:shadow-card-hover"
    >
      {/* Product Image */}
      <div className="relative h-48 md:h-56 overflow-hidden bg-gray-100">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&h=600&fit=crop';
          }}
        />
        
        {/* In Cart Badge */}
        {inCart && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1.5 
                          rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            In Cart ({cartItem?.quantity})
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 
                        rounded-full text-xs font-medium text-gray-700 shadow-md">
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

        {/* CHICKEN PRODUCTS: Age-based pricing with selector */}
        {isChicken && (
          <div className="mb-4">
            <ChickenPriceSelector
              priceByAge={product.priceByAge}
              onAgeSelect={handleAgeSelect}
              selectedAge={selectedAge}
              currency="KSh"
              minOrderQty={50}
            />
            
            {/* Quantity Selector for Chickens */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity (minimum 50 chicks)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setChickenQuantity(Math.max(50, chickenQuantity - 10))}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center 
                             justify-center text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                
                <input
                  type="number"
                  min="50"
                  step="10"
                  value={chickenQuantity}
                  onChange={(e) => setChickenQuantity(Math.max(50, parseInt(e.target.value) || 50))}
                  className="flex-1 px-4 py-2 text-center border-2 border-gray-300 rounded-lg 
                             focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20 
                             transition-all font-semibold text-lg"
                />
                
                <button
                  type="button"
                  onClick={() => setChickenQuantity(chickenQuantity + 10)}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center 
                             justify-center text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EQUIPMENT PRODUCTS: Dual/Single pricing display */}
        {!isChicken && (
          <div className="mb-4">
            <ProductPriceDisplay
              price={product.price}
              wholesalePrice={product.wholesalePrice}
              showSavings={true}
              currency="KSh"
              size="medium"
            />
          </div>
        )}

        {/* SKU Display (Equipment only) */}
        {!isChicken && product.sku && (
          <div className="text-xs text-gray-500 mb-4 font-mono">
            SKU: {product.sku}
          </div>
        )}

        {/* Add to Cart Button */}
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={isChicken ? handleAddChickenToCart : handleAddToCart}
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