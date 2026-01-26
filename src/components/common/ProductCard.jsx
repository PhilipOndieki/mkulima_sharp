import { Link } from 'react-router-dom';
import Button from './Button';
import clsx from 'clsx';

/**
 * ProductCard Component
 * Mobile-optimized product display with full-width on mobile, grid on desktop
 * 
 * @param {Object} props
 * @param {Object} props.product - Product data
 * @param {string} props.product.id - Product ID
 * @param {string} props.product.name - Product name
 * @param {string} props.product.description - Short description
 * @param {number} props.product.price - Product price
 * @param {string} props.product.imageUrl - Product image URL
 * @param {string} props.product.category - Product category
 * @param {Function} props.onAddToCart - Add to cart handler
 */
const ProductCard = ({ product, onAddToCart }) => {
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <Link 
      to={`/products/${product.id}`}
      className="product-card block"
    >
      {/* Product Image */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img 
          src={product.imageUrl || '/placeholder-product.jpg'} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          loading="lazy"
        />
        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Low Stock
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Out of Stock
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 md:p-5">
        {/* Category Badge */}
        <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full mb-2">
          {product.category}
        </span>

        {/* Product Name */}
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Price and Action */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-2xl font-bold text-primary-600">
              KES {product.price?.toLocaleString()}
            </span>
            {product.unit && (
              <span className="text-sm text-gray-500 ml-1">
                /{product.unit}
              </span>
            )}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="whitespace-nowrap"
          >
            {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
