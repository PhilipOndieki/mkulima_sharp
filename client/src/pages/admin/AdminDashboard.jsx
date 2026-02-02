import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import AnimatedSection from '../../components/common/AnimatedSection';
import StatCard from '../../components/admin/StatCard';
import Button from '../../components/common/Button';
import { 
  HiShoppingBag, 
  HiCurrencyDollar, 
  HiClock,
  HiExclamation,
  HiArrowRight
} from 'react-icons/hi';

/**
 * AdminDashboard Component
 * 
 * Main admin landing page with key metrics and recent orders
 */
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    todayOrders: 0,
    pendingPayments: 0,
    todayRevenue: 0,
    // lowStockItems: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get today's date at midnight
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTimestamp = Timestamp.fromDate(today);

      // Fetch today's orders
      const ordersRef = collection(db, 'orders');
      const todayQuery = query(
        ordersRef,
        where('createdAt', '>=', todayTimestamp),
        orderBy('createdAt', 'desc')
      );
      const todaySnapshot = await getDocs(todayQuery);
      const todayOrdersData = todaySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Calculate stats
      const todayOrdersCount = todayOrdersData.length;
      const pendingPaymentsCount = todayOrdersData.filter(
        order => order.status === 'pending' || !order.paymentVerified
      ).length;
      const todayRevenueTotal = todayOrdersData
        .filter(order => order.paymentVerified || order.status !== 'pending')
        .reduce((sum, order) => sum + (order.subtotal || 0), 0);

      // Fetch recent orders (last 10)
      const recentQuery = query(
        ordersRef,
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const recentSnapshot = await getDocs(recentQuery);
      const recentOrdersData = recentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

    //   // Fetch products for low stock count
    //   const productsRef = collection(db, 'products');
    //   const productsSnapshot = await getDocs(productsRef);
    //   let lowStockCount = 0;
      
    //   productsSnapshot.docs.forEach(doc => {
    //     const product = doc.data();
    //     if (product.variants) {
    //       product.variants.forEach(variant => {
    //         if ((variant.stockQuantity || 0) < (variant.lowStockThreshold || 10)) {
    //           lowStockCount++;
    //         }
    //       });
    //     }
    //   });

      setStats({
        todayOrders: todayOrdersCount,
        pendingPayments: pendingPaymentsCount,
        todayRevenue: todayRevenueTotal,
        // lowStockItems: lowStockCount,
      });
      setRecentOrders(recentOrdersData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-700',
      paid: 'bg-blue-100 text-blue-700',
      processing: 'bg-purple-100 text-purple-700',
      out_for_delivery: 'bg-indigo-100 text-indigo-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <AnimatedSection animation="fade-up">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Overview of your business performance
          </p>
        </div>
      </AnimatedSection>

      {/* Stats Grid */}
      <AnimatedSection animation="fade-up" delay={100}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Orders Today"
            value={stats.todayOrders}
            icon={HiShoppingBag}
            color="primary"
            loading={loading}
          />
          <StatCard
            title="Pending Payments"
            value={stats.pendingPayments}
            icon={HiClock}
            color="amber"
            loading={loading}
          />
          <StatCard
            title="Today's Revenue"
            value={`KES ${stats.todayRevenue.toLocaleString()}`}
            icon={HiCurrencyDollar}
            color="green"
            loading={loading}
          />
          {/* <StatCard
            title="Low Stock Items"
            value={stats.lowStockItems}
            icon={HiExclamation}
            color="red"
            loading={loading}
          /> */}
        </div>
      </AnimatedSection>

      {/* Quick Actions */}
      <AnimatedSection animation="fade-up" delay={200}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/admin/orders?filter=pending">
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 hover:border-amber-300 transition-colors cursor-pointer">
              <h3 className="font-semibold text-amber-900 mb-2">
                Verify Payments
              </h3>
              <p className="text-sm text-amber-700 mb-4">
                {stats.pendingPayments} orders awaiting verification
              </p>
              <div className="flex items-center text-amber-700 font-medium">
                <span>View Orders</span>
                <HiArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </Link>

          {/* <Link to="/admin/inventory">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 hover:border-red-300 transition-colors cursor-pointer">
              <h3 className="font-semibold text-red-900 mb-2">
                Check Inventory
              </h3>
              <p className="text-sm text-red-700 mb-4">
                {stats.lowStockItems} items running low
              </p>
              <div className="flex items-center text-red-700 font-medium">
                <span>View Inventory</span>
                <HiArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </Link> */}

          <Link to="/admin/orders">
            <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-6 hover:border-primary-300 transition-colors cursor-pointer">
              <h3 className="font-semibold text-primary-900 mb-2">
                All Orders
              </h3>
              <p className="text-sm text-primary-700 mb-4">
                Manage all customer orders
              </p>
              <div className="flex items-center text-primary-700 font-medium">
                <span>View Orders</span>
                <HiArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </Link>
        </div>
      </AnimatedSection>

      {/* Recent Orders */}
      <AnimatedSection animation="fade-up" delay={300}>
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <Link to="/admin/orders">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {order.customerEmail || order.userId || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        KES {(order.subtotal || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status || 'pending')}`}>
                          {(order.status || 'pending').replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <HiShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No orders yet</p>
            </div>
          )}
        </div>
      </AnimatedSection>
    </div>
  );
};

export default AdminDashboard;