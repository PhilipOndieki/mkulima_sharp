import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import orderService from '../../services/order.service';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';
import { 
  HiSearch, 
  HiFilter,
  HiEye,
  HiRefresh
} from 'react-icons/hi';

/**
 * AdminOrders Page
 * 
 * Phase 2: Admin Order Management
 * View, filter, and manage all customer orders
 */
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Status options with counts
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    pending_confirmation: 0,
    confirmed: 0,
    processing: 0,
    out_for_delivery: 0,
    delivered: 0,
    cancelled: 0
  });

  /**
   * Fetch all orders
   */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const ordersData = await orderService.getAllOrders();
      setOrders(ordersData);
      setFilteredOrders(ordersData);

      // Calculate status counts
      const counts = {
        all: ordersData.length,
        pending_confirmation: ordersData.filter(o => o.status === 'pending_confirmation').length,
        confirmed: ordersData.filter(o => o.status === 'confirmed').length,
        processing: ordersData.filter(o => o.status === 'processing').length,
        out_for_delivery: ordersData.filter(o => o.status === 'out_for_delivery').length,
        delivered: ordersData.filter(o => o.status === 'delivered').length,
        cancelled: ordersData.filter(o => o.status === 'cancelled').length
      };
      setStatusCounts(counts);

      console.log(` Loaded ${ordersData.length} orders`);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Load orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  /**
   * Apply filters
   */
  useEffect(() => {
    let filtered = [...orders];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone.includes(searchTerm)
      );
    }

    // Filter by date
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(order => {
        const orderDate = order.createdAt?.toDate();
        if (!orderDate) return false;

        switch (dateFilter) {
          case 'today':
            return orderDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return orderDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchTerm, dateFilter]);

  /**
   * Handle view order details
   */
const handleViewOrder = useCallback((order) => {
  setSelectedOrder(order);
  setIsModalOpen(true);
}, []);

  /**
   * Handle order updated (from modal)
   */
  const handleOrderUpdated = () => {
    fetchOrders();
    setSuccess('Order updated successfully!');
    setTimeout(() => setSuccess(null), 3000);
  };

  /**
   * Get status badge classes
   */
  const getStatusBadge = (status) => {
    const badges = {
      pending_confirmation: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      out_for_delivery: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    const labels = {
      pending_confirmation: 'Pending Confirmation',
      confirmed: 'Confirmed',
      processing: 'Processing',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  /**
   * Format date
   */
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
            <p className="text-gray-600">
              {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            <HiRefresh className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6">
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="bg-white rounded-xl shadow-card p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {Object.entries({
              all: 'All Orders',
              pending_confirmation: 'Pending',
              confirmed: 'Confirmed',
              processing: 'Processing',
              out_for_delivery: 'Out for Delivery',
              delivered: 'Delivered',
              cancelled: 'Cancelled'
            }).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  statusFilter === key
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {statusCounts[key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl shadow-card p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
                placeholder="Search by order #, customer..."
              />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <HiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="input-field pl-10"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-end text-sm text-gray-600">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Order #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Items
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-primary-600">
                          {order.orderNumber}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.paymentMethod === 'cod' ? 'COD' : 'Paid'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {order.customerName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.customerPhone}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {order.items?.length || 0} items
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          KES {order.total?.toLocaleString() || '0'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="flex items-center gap-2 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium"
                        >
                          <HiEye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-card p-12 text-center">
            <div className="max-w-md mx-auto">
              <svg
                className="w-24 h-24 mx-auto text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all'
                  ? 'No orders match your filters. Try adjusting your search.'
                  : 'No orders have been placed yet.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onOrderUpdated={handleOrderUpdated}
      />
    </div>
  );
};

export default AdminOrders;