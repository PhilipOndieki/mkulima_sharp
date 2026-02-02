import { useState } from 'react';
import { doc, updateDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import { HiX, HiPlus, HiMinus } from 'react-icons/hi';

/**
 * StockEditModal Component
 * 
 * Modal for updating product stock quantity
 * 
 * @param {Object} props
 * @param {Object} props.product - Product object
 * @param {Object} props.variant - Variant object
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onUpdate - Update callback
 */
const StockEditModal = ({ product, variant, isOpen, onClose, onUpdate }) => {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(variant?.stockQuantity || 0);
  const [reason, setReason] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !product || !variant) return null;

  const currentStock = variant.stockQuantity || 0;
  const difference = quantity - currentStock;

  const handleIncrement = (amount) => {
    setQuantity(prev => Math.max(0, prev + amount));
  };

  const handleDecrement = (amount) => {
    setQuantity(prev => Math.max(0, prev - amount));
  };

  const handleSave = async () => {
    if (quantity === currentStock) {
      setError('Stock quantity unchanged');
      return;
    }

    if (!reason.trim()) {
      setError('Please provide a reason for this stock adjustment');
      return;
    }

    try {
      setUpdating(true);
      setError(null);

      // Find the variant index
      const variantIndex = product.variants.findIndex(v => v.id === variant.id);
      if (variantIndex === -1) {
        throw new Error('Variant not found');
      }

      // Update the variant with new stock quantity
      const updatedVariants = [...product.variants];
      updatedVariants[variantIndex] = {
        ...updatedVariants[variantIndex],
        stockQuantity: quantity,
        lastStockUpdate: serverTimestamp(),
        lastStockUpdateBy: user.uid
      };

      // Update product document
      const productRef = doc(db, 'products', product.id);
      await updateDoc(productRef, {
        variants: updatedVariants,
        updatedAt: serverTimestamp()
      });

      // Log stock movement (optional audit trail)
      try {
        await addDoc(collection(db, 'stockMovements'), {
          productId: product.id,
          productName: product.name,
          variantId: variant.id,
          variantName: variant.name,
          sku: variant.sku,
          type: 'adjustment',
          previousQuantity: currentStock,
          newQuantity: quantity,
          difference: difference,
          reason: reason.trim(),
          updatedBy: user.uid,
          updatedByEmail: user.email,
          createdAt: serverTimestamp()
        });
      } catch (logError) {
        console.error('Error logging stock movement:', logError);
        // Don't fail the main operation if logging fails
      }

      // Call update callback
      if (onUpdate) onUpdate();

      // Close modal
      onClose();

    } catch (err) {
      console.error('Error updating stock:', err);
      setError('Failed to update stock. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

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
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Update Stock
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <HiX className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Product Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{variant.name}</p>
                <p className="text-xs text-gray-500">SKU: {variant.sku}</p>
              </div>

              {/* Current Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Stock
                </label>
                <div className="text-3xl font-bold text-gray-900">
                  {currentStock}
                </div>
              </div>

              {/* Stock Adjustment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Stock Quantity
                </label>
                
                {/* Quick Adjust Buttons */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  <button
                    onClick={() => handleDecrement(10)}
                    className="px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                  >
                    -10
                  </button>
                  <button
                    onClick={() => handleDecrement(1)}
                    className="px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => handleIncrement(1)}
                    className="px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => handleIncrement(10)}
                    className="px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm"
                  >
                    +10
                  </button>
                </div>

                {/* Manual Input */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleDecrement(1)}
                    className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <HiMinus className="w-5 h-5 text-gray-700" />
                  </button>
                  
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                    min="0"
                    className="flex-1 text-center text-2xl font-bold px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  
                  <button
                    onClick={() => handleIncrement(1)}
                    className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <HiPlus className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Difference Indicator */}
              {difference !== 0 && (
                <div className={`p-3 rounded-lg ${
                  difference > 0 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <p className={`text-sm font-semibold ${
                    difference > 0 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {difference > 0 ? '+' : ''}{difference} units
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {difference > 0 ? 'Stock increase' : 'Stock decrease'}
                  </p>
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Adjustment *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., New stock delivery, Damage, Sale correction..."
                  rows={3}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose} disabled={updating}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                loading={updating}
                disabled={updating || quantity === currentStock || !reason.trim()}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StockEditModal;