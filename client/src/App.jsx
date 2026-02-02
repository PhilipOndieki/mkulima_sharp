import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute, { AdminRoute } from './components/ProtectedRoute';
import { CartProvider } from './components/cart/CartContext'; 
import Home from './pages/Home';

// Admin Components (NOT lazy loaded for better admin UX)
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
// Lazy load other pages for better performance
import { lazy, Suspense } from 'react';

// Public Pages
const Products = lazy(() => import('./pages/Products'));
const Academy = lazy(() => import('./pages/Academy'));
const BusinessBuilder = lazy(() => import('./pages/BusinessBuilder'));
const Services = lazy(() => import('./pages/Services'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Help = lazy(() => import('./pages/Help'));

// Authentication Pages
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

// Cart Page
const Cart = lazy(() => import('./pages/Cart'));

// Order Pages
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <CartProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/*
                ============================================
                ADMIN ROUTES (Separate from public layout)
                ============================================
                */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
            </Route>

            {/*
                ============================================
                PUBLIC ROUTES (With public navbar/footer)
                ============================================
                */}
            <Route path="/" element={<Layout />}>
              {/* Home */}
              <Route index element={<Home />} />
              
              {/* Public Pages */}
              <Route path="products" element={<Products />} />
              <Route path="academy" element={<Academy />} />
              <Route path="business-builder" element={<BusinessBuilder />} />
              <Route path="services" element={<Services />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="help" element={<Help />} />
              
              {/* Authentication Routes */}
              <Route path="login" element={<Login />} />

              {/* Protected Routes - Require Authentication */}
              <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="order-confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
              <Route path="my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
              <Route path="my-orders/:orderId" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
              <Route 
                path="dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="orders" 
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                } 
              />

              {/* Checkout Pages */}
              <Route 
                path="checkout" 
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="order-confirmation" 
                element={
                  <ProtectedRoute>
                    <OrderConfirmation />
                  </ProtectedRoute>
                } 
              />
              {/* Cart Page */}
              <Route path="cart" element={<Cart />} />
              
              <Route 
                path="settings" 
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen container-custom py-12">
                      <h1 className="text-3xl font-bold mb-4">Account Settings</h1>
                      <p className="text-gray-600">Account settings coming soon...</p>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              {/* Legal Pages */}
              <Route 
                path="privacy-policy" 
                element={
                  <div className="min-h-screen container-custom py-12">
                    <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
                    <div className="prose max-w-none">
                      <p className="text-gray-600 mb-4">
                        Last updated: January 2026
                      </p>
                      <p className="text-gray-700">
                        At Mkulima Sharp, we take your privacy seriously. This Privacy Policy 
                        explains how we collect, use, disclose, and safeguard your information 
                        when you use our platform.
                      </p>
                    </div>
                  </div>
                } 
              />
              
              <Route 
                path="terms-of-service" 
                element={
                  <div className="min-h-screen container-custom py-12">
                    <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
                    <div className="prose max-w-none">
                      <p className="text-gray-600 mb-4">
                        Last updated: January 2026
                      </p>
                      <p className="text-gray-700">
                        Please read these Terms of Service carefully before using Mkulima Sharp.
                      </p>
                    </div>
                  </div>
                } 
              />
              
              <Route 
                path="shipping-policy" 
                element={
                  <div className="min-h-screen container-custom py-12">
                    <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>
                    <div className="prose max-w-none">
                      <p className="text-gray-600 mb-4">
                        Last updated: January 2026
                      </p>
                      <h2 className="text-2xl font-bold mt-8 mb-4">Delivery Areas</h2>
                      <p className="text-gray-700">
                        We currently deliver to all counties in Kenya. Delivery times may vary 
                        depending on your location.
                      </p>
                    </div>
                  </div>
                } 
              />


              
              {/* 404 Page */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center container-custom">
                  <div className="text-center">
                    <h1 className="text-6xl font-display font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-8">Page not found</p>
                    <a href="/" className="btn-primary inline-block">
                      Return Home
                    </a>
                  </div>
                </div>
              } />
            </Route>
          </Routes>
        </Suspense>
      </CartProvider>
    </Router>
  );
}

export default App;