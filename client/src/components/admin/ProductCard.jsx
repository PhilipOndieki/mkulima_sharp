import { HiPencil, HiTrash, HiEye, HiEyeOff } from 'react-icons/hi';

/**
 * ProductCard Component for Admin
 * 
 * Displays product in admin grid with action buttons
 */
const ProductCard = ({ product, onEdit, onDelete, onToggleActive }) => {
  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-card-hover transition-shadow">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&h=600&fit=crop';
          }}
        />
        
        {/* Active/Inactive Badge */}
        <div className="absolute top-2 right-2">
          {product.isActive ? (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              Active
            </span>
          ) : (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              Inactive
            </span>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Variants Summary */}
        {product.hasVariants && product.variants && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">
              {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
            </p>
            <div className="flex flex-wrap gap-1">
              {product.variants.slice(0, 3).map((variant) => (
                <span
                  key={variant.id}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {variant.name}
                </span>
              ))}
              {product.variants.length > 3 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{product.variants.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
          {/* Edit Button */}
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors font-medium text-sm"
            title="Edit product"
          >
            <HiPencil className="w-4 h-4" />
            Edit
          </button>

          {/* Toggle Active Button */}
          <button
            onClick={() => onToggleActive(product)}
            className={`p-2 rounded-lg transition-colors ${
              product.isActive
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
            title={product.isActive ? 'Deactivate' : 'Activate'}
          >
            {product.isActive ? (
              <HiEyeOff className="w-5 h-5" />
            ) : (
              <HiEye className="w-5 h-5" />
            )}
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(product)}
            className="p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            title="Delete product"
          >
            <HiTrash className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;