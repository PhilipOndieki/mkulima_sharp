import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AnimatedSection from '../components/common/AnimatedSection';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { 
  HiShoppingBag, 
  HiAcademicCap, 
  HiTruck,
  HiUser,
  HiCog,
  HiChartBar
} from 'react-icons/hi';

/**
 * Dashboard Page Component
 * 
 * User dashboard with profile summary, recent orders, and quick actions
 * Mobile-first responsive design
 */
const Dashboard = () => {
  const { user, isAdmin, refreshUser } = useAuth();
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch recent orders
    const fetchOrders = async () => {
      try {
        // TODO: Implement order fetching from Firestore
        // For now, show placeholder data
        setRecentOrders([
          {
            id: '1',
            date: '2026-01-20',
            total: 15000,
            status: 'delivered',
            items: 3
          },
          {
            id: '2',
            date: '2026-01-15',
            total: 8500,
            status: 'in_transit',
            items: 2
          }
        ]);
      } catch (error) {
        console.error('[Dashboard] Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-amber-100 text-amber-700',
      processing: 'bg-blue-100 text-blue-700',
      in_transit: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };

    const labels = {
      pending: 'Pending',
      processing: 'Processing',
      in_transit: 'In Transit',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container-custom">
        {/* Welcome Header */}
        <AnimatedSection animation="fade-up">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 md:p-8 text-white mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
                  Welcome back, {user?.displayName?.split(' ')[0] || 'Farmer'}!
                </h1>
                <p className="text-primary-100">
                  {user?.email}
                </p>
                {isAdmin() && (
                  <div className="mt-4">
                    <span className="bg-white text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Administrator
                    </span>
                  </div>
                )}
              </div>
              <div className="hidden md:block">
                <img 
                  src={user?.photoURL || '/default-avatar.png'} 
                  alt={user?.displayName || 'User'}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                  }}
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Quick Actions */}
        <AnimatedSection animation="fade-up" delay={200}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            <Link to="/products">
              <Card hover className="h-full">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HiShoppingBag className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">Shop Products</h3>
                    <p className="text-sm text-gray-600">Browse chicks, feeds & equipment</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link to="/academy">
              <Card hover className="h-full">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HiAcademicCap className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">Learn & Grow</h3>
                    <p className="text-sm text-gray-600">Access training materials</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link to="/orders">
              <Card hover className="h-full">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HiTruck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">Track Orders</h3>
                    <p className="text-sm text-gray-600">View delivery status</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <AnimatedSection animation="fade-up" delay={300}>
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                  <Link to="/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View All
                  </Link>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  </div>
                ) : recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div 
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-semibold text-gray-900">
                              Order #{order.id}
                            </span>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-sm text-gray-600">
                            {order.items} {order.items === 1 ? 'item' : 'items'} • {order.date}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-bold text-gray-900">
                            KES {order.total.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <HiShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No orders yet</p>
                    <Link to="/products">
                      <Button variant="primary">Start Shopping</Button>
                    </Link>
                  </div>
                )}
              </Card>
            </AnimatedSection>
          </div>

          {/* Account Summary */}
          <div>
            <AnimatedSection animation="fade-up" delay={400}>
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Account</h2>
                
                <div className="space-y-4">
                  <Link 
                    to="/profile"
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <HiUser className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">Profile Settings</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>

                  <Link 
                    to="/orders"
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <HiTruck className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">Order History</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>

                  <Link 
                    to="/settings"
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <HiCog className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">Settings</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>

                  {isAdmin() && (
                    <Link 
                      to="/admin"
                      className="flex items-center justify-between p-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <HiChartBar className="w-5 h-5 text-primary-600" />
                        <span className="text-primary-700 font-medium">Admin Dashboard</span>
                      </div>
                      <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <p className="mb-1"><strong>Member since:</strong></p>
                    <p>{new Date(user?.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                </div>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;