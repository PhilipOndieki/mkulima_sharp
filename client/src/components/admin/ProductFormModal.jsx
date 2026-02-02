import { useState, useEffect } from 'react';
import { HiX, HiPlus, HiTrash } from 'react-icons/hi';
import Button from '../common/Button';

/**
 * ProductFormModal Component
 * 
 * Modal form for adding/editing products with variant management
 */
const ProductFormModal = ({ isOpen, onClose, onSubmit, product, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    imageUrl: '',
    unit: 'piece',
    minWholesaleQty: 10,
    hasVariants: true,
    variants: [
      {
        id: `var_${Date.now()}`,
        name: '',
        sku: '',
        retailPrice: '',
        wholesalePrice: '',
        inStock: true,
        stockQuantity: 0
      }
    ]
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  // Categories from your existing products
  const categories = [
    'Feeders',
    'Drinkers',
    'Brooding Equipment',
    'Automatic Incubators',
    'Cages & Mesh'
  ];

  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        unit: product.unit || 'piece',
        minWholesaleQty: product.minWholesaleQty || 10,
        hasVariants: product.hasVariants !== false,
        variants: product.variants || [
          {
            id: `var_${Date.now()}`,
            name: '',
            sku: '',
            retailPrice: '',
            wholesalePrice: '',
            inStock: true,
            stockQuantity: 0
          }
        ]
      });
      setImagePreview(product.imageUrl || '');
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        category: '',
        description: '',
        imageUrl: '',
        unit: 'piece',
        minWholesaleQty: 10,
        hasVariants: true,
        variants: [
          {
            id: `var_${Date.now()}`,
            name: '',
            sku: '',
            retailPrice: '',
            wholesalePrice: '',
            inStock: true,
            stockQuantity: 0
          }
        ]
      });
      setImagePreview('');
    }
    setErrors({});
  }, [product, isOpen]);

  // Handle image URL change with preview
  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, imageUrl: url });
    setImagePreview(url);
  };

  // Handle variant field change
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value
    };
    setFormData({ ...formData, variants: updatedVariants });
  };

  // Add new variant
  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        {
          id: `var_${Date.now()}`,
          name: '',
          sku: '',
          retailPrice: '',
          wholesalePrice: '',
          inStock: true,
          stockQuantity: 0
        }
      ]
    });
  };

  // Remove variant (only if more than 1 variant exists)
  const removeVariant = (index) => {
    if (formData.variants.length > 1) {
      const updatedVariants = formData.variants.filter((_, i) => i !== index);
      setFormData({ ...formData, variants: updatedVariants });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    }

    // Validate variants
    formData.variants.forEach((variant, index) => {
      if (!variant.name.trim()) {
        newErrors[`variant_${index}_name`] = 'Variant name is required';
      }
      if (!variant.sku.trim()) {
        newErrors[`variant_${index}_sku`] = 'SKU is required';
      }
      if (!variant.retailPrice || variant.retailPrice <= 0) {
        newErrors[`variant_${index}_retailPrice`] = 'Valid retail price required';
      }
      if (!variant.wholesalePrice || variant.wholesalePrice <= 0) {
        newErrors[`variant_${index}_wholesalePrice`] = 'Valid wholesale price required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prepare data for submission
    const submitData = {
      ...formData,
      variants: formData.variants.map(variant => ({
        ...variant,
        retailPrice: parseFloat(variant.retailPrice),
        wholesalePrice: parseFloat(variant.wholesalePrice),
        stockQuantity: parseInt(variant.stockQuantity) || 0
      }))
    };

    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                {product ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <HiX className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Standard Poultry Feeders"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select category...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-600 text-sm mt-1">{errors.category}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="textarea-field"
                    placeholder="Brief description of the product..."
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={handleImageUrlChange}
                    className="input-field"
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors.imageUrl && (
                    <p className="text-red-600 text-sm mt-1">{errors.imageUrl}</p>
                  )}
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                        onError={() => setImagePreview('')}
                      />
                    </div>
                  )}
                </div>

                {/* Unit & Min Wholesale Qty */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="input-field"
                      placeholder="piece, bag, unit..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Wholesale Qty
                    </label>
                    <input
                      type="number"
                      value={formData.minWholesaleQty}
                      onChange={(e) => setFormData({ ...formData, minWholesaleQty: parseInt(e.target.value) })}
                      className="input-field"
                      min="1"
                    />
                  </div>
                </div>

                {/* Variants Section */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Variants ({formData.variants.length})
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addVariant}
                      className="flex items-center gap-2"
                    >
                      <HiPlus className="w-4 h-4" />
                      Add Variant
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {formData.variants.map((variant, index) => (
                      <div
                        key={variant.id}
                        className="bg-gray-50 rounded-lg p-4 relative"
                      >
                        {/* Remove button (only if more than 1 variant) */}
                        {formData.variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="absolute top-2 right-2 p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <HiTrash className="w-5 h-5" />
                          </button>
                        )}

                        <h4 className="font-medium text-gray-900 mb-3">
                          Variant {index + 1}
                        </h4>

                        <div className="grid grid-cols-2 gap-4">
                          {/* Variant Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Name *
                            </label>
                            <input
                              type="text"
                              value={variant.name}
                              onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                              className="input-field"
                              placeholder="e.g., 12 KG"
                            />
                            {errors[`variant_${index}_name`] && (
                              <p className="text-red-600 text-xs mt-1">
                                {errors[`variant_${index}_name`]}
                              </p>
                            )}
                          </div>

                          {/* SKU */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              SKU *
                            </label>
                            <input
                              type="text"
                              value={variant.sku}
                              onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                              className="input-field"
                              placeholder="e.g., FEED-STD-12KG"
                            />
                            {errors[`variant_${index}_sku`] && (
                              <p className="text-red-600 text-xs mt-1">
                                {errors[`variant_${index}_sku`]}
                              </p>
                            )}
                          </div>

                          {/* Retail Price */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Retail Price (KES) *
                            </label>
                            <input
                              type="number"
                              value={variant.retailPrice}
                              onChange={(e) => handleVariantChange(index, 'retailPrice', e.target.value)}
                              className="input-field"
                              min="0"
                              step="0.01"
                              placeholder="750"
                            />
                            {errors[`variant_${index}_retailPrice`] && (
                              <p className="text-red-600 text-xs mt-1">
                                {errors[`variant_${index}_retailPrice`]}
                              </p>
                            )}
                          </div>

                          {/* Wholesale Price */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Wholesale Price (KES) *
                            </label>
                            <input
                              type="number"
                              value={variant.wholesalePrice}
                              onChange={(e) => handleVariantChange(index, 'wholesalePrice', e.target.value)}
                              className="input-field"
                              min="0"
                              step="0.01"
                              placeholder="600"
                            />
                            {errors[`variant_${index}_wholesalePrice`] && (
                              <p className="text-red-600 text-xs mt-1">
                                {errors[`variant_${index}_wholesalePrice`]}
                              </p>
                            )}
                          </div>

                          {/* Stock Quantity */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Stock Quantity
                            </label>
                            <input
                              type="number"
                              value={variant.stockQuantity}
                              onChange={(e) => handleVariantChange(index, 'stockQuantity', e.target.value)}
                              className="input-field"
                              min="0"
                              placeholder="100"
                            />
                          </div>

                          {/* In Stock Checkbox */}
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`inStock_${index}`}
                              checked={variant.inStock}
                              onChange={(e) => handleVariantChange(index, 'inStock', e.target.checked)}
                              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <label
                              htmlFor={`inStock_${index}`}
                              className="ml-2 text-sm text-gray-700"
                            >
                              In Stock
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={loading}
                disabled={loading}
              >
                {product ? 'Update Product' : 'Add Product'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductFormModal;