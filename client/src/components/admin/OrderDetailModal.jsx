import { useState } from 'react';
import { doc, updateDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import { HiX, HiCheckCircle, HiClock } from 'react-icons/hi';
import clsx from 'clsx';

/**
 * OrderDetailModal Component
 * 
 * Displays full order details with admin actions
 * 
 * @param {Object} props
 * @param {Object} props.order - Order object
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onUpdate - Update callback after changes
 */
const OrderDetailModal = ({ order, isOpen, onClose, onUpdate }) => {
  const { user } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order?.status || 'pending');
  const [mpesaCode, setMpesaCode] = useState(order?.mpesaTransactionCode || '');
  const [adminNotes, setAdminNotes] = useState(order?.adminNotes || '');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (!isOpen || !order) return null;

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-700 border-amber-300',
      paid: 'bg-blue-100 text-blue-700 border-blue-300',
      processing: 'bg-purple-100 text-purple-700 border-purple-300',
      out_for_delivery: 'bg-indigo-100 text-indigo-700 border-indigo-300',
      delivered: 'bg-green-100 text-green-700 border-green-300',
      cancelled: 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Mark order as paid
   */
  const handleMarkAsPaid = async () => {
    if (!mpesaCode.trim()) {
      setError('Please enter M-Pesa transaction code');
      return;
    }

    try {
      setUpdating(true);
      setError(null);

      const orderRef = doc(db, 'orders', order.id);
      const updateData = {
        status: 'paid',
        paymentVerified: true,
        paymentVerifiedBy: user.uid,
        paymentVerifiedAt: serverTimestamp(),
        mpesaTransactionCode: mpesaCode.trim(),
        updatedAt: serverTimestamp(),
        statusHistory: arrayUnion({
          status: 'paid',
          timestamp: new Date().toISOString(),
          updatedBy: user.uid,
          updatedByEmail: user.email,
          note: 'Payment verified manually'
        })
      };

      await updateDoc(orderRef, updateData);

      setSuccess('Payment verified successfully!');
      setSelectedStatus('paid');
      
      // Call update callback
      if (onUpdate) onUpdate();

      setTimeout(() => {
        setSuccess(null);
      }, 3000);

    } catch (err) {
      console.error('Error marking as paid:', err);
      setError('Failed to update payment status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Update order status
   */
  const handleStatusUpdate = async () => {
    if (selectedStatus === order.status) {
      setError('Status unchanged');
      return;
    }

    try {
      setStatusUpdating(true);
      setError(null);

      const orderRef = doc(db, 'orders', order.id);
      const updateData = {
        status: selectedStatus,
        updatedAt: serverTimestamp(),
        statusHistory: arrayUnion({
          status: selectedStatus,
          timestamp: new Date().toISOString(),
          updatedBy: user.uid,
          updatedByEmail: user.email,
          note: `Status updated to ${selectedStatus.replace(/_/g, ' ')}`
        })
      };

      // If updating notes
      if (adminNotes.trim() !== (order.adminNotes || '')) {
        updateData.adminNotes = adminNotes.trim();
      }

      await updateDoc(orderRef, updateData);

      setSuccess('Order status updated successfully!');
      
      // Call update callback
      if (onUpdate) onUpdate();

      setTimeout(() => {
        setSuccess(null);
      }, 3000);

    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update order status. Please try again.');
    } finally {
      setStatusUpdating(false);
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
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Details
                </h2>
                <p className="text-sm text-gray-600">
                  #{order.id}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <HiX className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Success/Error Messages */}
              {success && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <div className="flex items-center">
                    <HiCheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Customer Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Customer Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <span className="ml-2 text-gray-900 font-medium">
                          {order.customerName || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2 text-gray-900">
                          {order.customerEmail || order.userId || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <span className="ml-2 text-gray-900">
                          {order.customerPhone || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Address:</span>
                        <span className="ml-2 text-gray-900">
                          {order.deliveryAddress || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Order Items ({order.items?.length || 0})
                    </h3>
                    <div className="space-y-3">
                      {order.items?.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start justify-between bg-white p-3 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">
                              {item.productName}
                            </p>
                            <p className="text-xs text-gray-600">
                              {item.variantName} × {item.quantity}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.sku}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 text-sm">
                              KES {item.subtotal?.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-600">
                              @ KES {item.unitPrice?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-primary-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Order Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-semibold text-gray-900">
                          KES {(order.subtotal || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="border-t border-primary-200 pt-2 flex justify-between">
                        <span className="font-bold text-gray-900">Total:</span>
                        <span className="font-bold text-primary-700 text-lg">
                          KES {(order.subtotal || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Order Status */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Order Status
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Status
                        </label>
                        <div className={clsx(
                          'inline-flex items-center px-4 py-2 rounded-lg border-2 font-semibold text-sm',
                          getStatusColor(order.status || 'pending')
                        )}>
                          {(order.status || 'pending').replace(/_/g, ' ').toUpperCase()}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Update Status
                        </label>
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="processing">Processing</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <Button
                        variant="primary"
                        fullWidth
                        onClick={handleStatusUpdate}
                        loading={statusUpdating}
                        disabled={statusUpdating || selectedStatus === order.status}
                      >
                        Update Status
                      </Button>
                    </div>
                  </div>

                  {/* Payment Verification */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Payment Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Payment Method:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {order.paymentMethod || 'M-Pesa'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Verified:</span>
                        {order.paymentVerified ? (
                          <span className="flex items-center text-green-600 font-semibold text-sm">
                            <HiCheckCircle className="w-4 h-4 mr-1" />
                            Yes
                          </span>
                        ) : (
                          <span className="flex items-center text-amber-600 font-semibold text-sm">
                            <HiClock className="w-4 h-4 mr-1" />
                            Pending
                          </span>
                        )}
                      </div>

                      {order.paymentVerified && order.paymentVerifiedAt && (
                        <div className="text-xs text-gray-600">
                          Verified on {formatDate(order.paymentVerifiedAt)}
                          {order.paymentVerifiedBy && (
                            <span className="block">
                              by {order.paymentVerifiedBy}
                            </span>
                          )}
                        </div>
                      )}

                      {!order.paymentVerified && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              M-Pesa Transaction Code
                            </label>
                            <input
                              type="text"
                              value={mpesaCode}
                              onChange={(e) => setMpesaCode(e.target.value)}
                              placeholder="Enter M-Pesa code"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                          </div>

                          <Button
                            variant="primary"
                            fullWidth
                            onClick={handleMarkAsPaid}
                            loading={updating}
                            disabled={updating || !mpesaCode.trim()}
                          >
                            Mark as Paid
                          </Button>
                        </>
                      )}

                      {order.mpesaTransactionCode && (
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <span className="text-xs text-gray-600">Transaction Code:</span>
                          <p className="font-mono font-semibold text-sm text-gray-900">
                            {order.mpesaTransactionCode}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Admin Notes */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Admin Notes
                    </h3>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add delivery instructions, special notes..."
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Order Timeline */}
                  {order.statusHistory && order.statusHistory.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Order Timeline
                      </h3>
                      <div className="space-y-3">
                        {order.statusHistory.map((history, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 text-sm"
                          >
                            <div className={clsx(
                              'w-2 h-2 rounded-full mt-1.5',
                              getStatusColor(history.status).split(' ')[0]
                            )} />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {history.status.replace(/_/g, ' ')}
                              </p>
                              <p className="text-xs text-gray-600">
                                {formatDate(history.timestamp)}
                              </p>
                              {history.note && (
                                <p className="text-xs text-gray-600 mt-1">
                                  {history.note}
                                </p>
                              )}
                              {history.updatedByEmail && (
                                <p className="text-xs text-gray-500">
                                  by {history.updatedByEmail}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Order Metadata */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Order Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="text-gray-900 font-mono">#{order.id.slice(0, 8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="text-gray-900">{formatDate(order.createdAt)}</span>
                      </div>
                      {order.updatedAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Updated:</span>
                          <span className="text-gray-900">{formatDate(order.updatedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailModal;