import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import orderService from '../../services/order.service';
import { HiX, HiCheck, HiExclamation } from 'react-icons/hi';

/**
 * OrderDetailsModal Component
 * 
 * Phase 2: Admin modal for viewing and managing order details
 * Allows admins to update order status and add internal notes
 */
const OrderDetailsModal = ({ isOpen, onClose, order, onOrderUpdated }) => {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order?.status || '');
  const [statusNote, setStatusNote] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (!isOpen || !order) return null;

  /**
   * Status options for the dropdown
   */
  const statusOptions = [
    { value: 'pending_confirmation', label: 'Pending Confirmation', color: 'yellow' },
    { value: 'confirmed', label: 'Confirmed', color: 'blue' },
    { value: 'processing', label: 'Processing', color: 'purple' },
    { value: 'out_for_delivery', label: 'Out for Delivery', color: 'indigo' },
    { value: 'delivered', label: 'Delivered', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' }
  ];

  /**
   * Handle status update
   */
  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === order.status) {
      setError('Please select a different status');
      return;
    }

    if (!statusNote.trim()) {
      setError('Please add a note explaining the status change');
      return;
    }

    try {
      setIsUpdating(true);
      setError(null);

      await orderService.updateOrderStatus(
        order.id,
        selectedStatus,
        statusNote,
        user.email
      );

      setSuccess('Order status updated successfully!');
      setStatusNote('');
      
      // Notify parent and refresh
      setTimeout(() => {
        onOrderUpdated();
        setSuccess(null);
      }, 1500);

    } catch (err) {
      console.error('❌ Error updating status:', err);
      setError('Failed to update order status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Handle add admin note
   */
  const handleAddNote = async () => {
    if (!adminNote.trim()) {
      setError('Please enter a note');
      return;
    }

    try {
      setIsUpdating(true);
      setError(null);

      await orderService.addAdminNote(order.id, adminNote, user.email);

      setSuccess('Note added successfully!');
      setAdminNote('');

      // Refresh order
      setTimeout(() => {
        onOrderUpdated();
        setSuccess(null);
      }, 1500);

    } catch (err) {
      console.error('❌ Error adding note:', err);
      setError('Failed to add note. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Format date
   */
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate();
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Get status badge
   */
  const getStatusBadge = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    if (!option) return null;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${option.color}-100 text-${option.color}-800`}>
        {option.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <p className="text-sm text-gray-600 mt-1">Order #{order.orderNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Messages */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3">
                <HiExclamation className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-start gap-3">
                <HiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-green-700">{success}</p>
              </div>
            )}

            {/* Order Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium text-gray-900">{order.customerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 text-gray-900">{order.customerEmail}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <span className="ml-2 text-gray-900">{order.customerPhone}</span>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Order Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2">{getStatusBadge(order.status)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <span className="ml-2 text-gray-900">{formatDate(order.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Delivery Address</h3>
              <div className="text-sm text-gray-700">
                <p>{order.deliveryAddress?.street}</p>
                <p>{order.deliveryAddress?.city}, {order.deliveryAddress?.county}</p>
                <p>{order.deliveryAddress?.postalCode}</p>
                {order.deliveryInstructions && (
                  <p className="mt-2 text-gray-600 italic">
                    Note: {order.deliveryInstructions}
                  </p>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Variant
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                        Qty
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items?.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt={item.productName}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <span className="font-medium text-gray-900">{item.productName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {item.variantName}
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">
                          KES {item.unitPrice?.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">
                          KES {item.subtotal?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Order Totals */}
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-900">
                      KES {order.subtotal?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span className="font-medium text-gray-900">
                      KES {order.deliveryFee?.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 flex justify-between">
                    <span className="font-bold text-gray-900">Total:</span>
                    <span className="font-bold text-gray-900 text-lg">
                      KES {order.total?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status History */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Status History</h3>
                <div className="space-y-3">
                  {order.statusHistory.map((history, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        {getStatusBadge(history.status)}
                        <span className="text-xs text-gray-500">
                          {formatDate(history.timestamp)}
                        </span>
                      </div>
                      {history.note && (
                        <p className="text-sm text-gray-700 mt-2">{history.note}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Updated by {history.updatedBy}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Notes */}
            {order.adminNotes && order.adminNotes.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Admin Notes</h3>
                <div className="space-y-2">
                  {order.adminNotes.map((note, index) => (
                    <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                      <p className="text-sm text-gray-700">{note.note}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {note.addedBy} • {formatDate(note.addedAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Update Status Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Update Order Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select status...</option>
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Update Note *
                  </label>
                  <textarea
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    className="input-field"
                    rows="3"
                    placeholder="Explain the reason for this status change..."
                  ></textarea>
                </div>

                <button
                  onClick={handleStatusUpdate}
                  disabled={isUpdating || !selectedStatus || !statusNote}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>

            {/* Add Admin Note Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Add Internal Note</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note (Internal Only)
                  </label>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="input-field"
                    rows="3"
                    placeholder="Add a private note about this order (not visible to customer)..."
                  ></textarea>
                </div>

                <button
                  onClick={handleAddNote}
                  disabled={isUpdating || !adminNote}
                  className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Adding...' : 'Add Note'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;