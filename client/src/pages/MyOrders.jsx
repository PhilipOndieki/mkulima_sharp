import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import orderService from '../services/order.service';
import { 
  HiSearch, 
  HiEye,
  HiShoppingBag
} from 'react-icons/hi';

/**
 * MyOrders Page
 * 
 * Phase 3: Customer Order Tracking
 * View order history and track order status
 */
const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Status counts
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
   * Fetch user's orders
   */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const ordersData = await orderService.getUserOrders(user.uid);
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

      console.log(` Loaded ${ordersData.length} orders for user`);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load your orders. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Load orders on mount
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

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
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchTerm]);

  /**
   * Handle view order details
   */
  const handleViewOrder = (orderId) => {
    navigate(`/my-orders/${orderId}`);
  };

  /**
   * Get status badge
   */
  const getStatusBadge = (status) => {
    const badges = {
      pending_confirmation: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Confirmation' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Confirmed' },
      processing: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Processing' },
      out_for_delivery: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Out for Delivery' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' }
    };

    const badge = badges[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
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
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
          </p>
        </div>

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

        {/* Search */}
        <div className="bg-white rounded-xl shadow-card p-4 mb-6">
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
              placeholder="Search by order number..."
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  {/* Order Number & Date */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {order.items?.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-8 h-8 object-cover rounded"
                          />
                        )}
                        <span className="text-sm text-gray-700">
                          {item.productName} × {item.quantity}
                        </span>
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <div className="flex items-center px-3 py-1 bg-gray-100 rounded-lg">
                        <span className="text-sm text-gray-600">
                          +{order.items.length - 3} more
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Order Total & Action */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-xl font-bold text-gray-900">
                      KES {order.total?.toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handleViewOrder(order.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    <HiEye className="w-5 h-5" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-card p-12 text-center">
            <div className="max-w-md mx-auto">
              <HiShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? 'No orders match your filters.'
                  : "You haven't placed any orders yet."}
              </p>
              <button
                onClick={() => navigate('/products')}
                className="btn-primary"
              >
                Start Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;