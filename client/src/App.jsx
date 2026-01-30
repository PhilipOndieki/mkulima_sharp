import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute, { AdminRoute } from './components/ProtectedRoute';
import { CartProvider } from './components/cart/CartContext'; 
import Home from './pages/Home';

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

// Cart Page - NOW USING REAL CART
const Cart = lazy(() => import('./pages/Cart'));

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
      {/* WRAP ENTIRE APP WITH CART PROVIDER */}
      <CartProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes with Layout */}
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
                    <div className="min-h-screen container-custom py-12">
                      <h1 className="text-3xl font-bold mb-4">My Orders</h1>
                      <p className="text-gray-600">Order history and tracking coming soon...</p>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              {/* CART PAGE - NOW USES REAL CART DATA */}
              <Route 
                path="cart" 
                element={<Cart />}
              />
              
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
              
              {/* Admin Routes - Require Admin Role */}
              <Route 
                path="admin/*" 
                element={
                  <AdminRoute>
                    <div className="min-h-screen container-custom py-12">
                      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
                      <p className="text-gray-600">Admin dashboard coming soon...</p>
                      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-card">
                          <h3 className="font-bold text-lg mb-2">Manage Products</h3>
                          <p className="text-gray-600 text-sm">Add, edit, or remove products from catalog</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-card">
                          <h3 className="font-bold text-lg mb-2">Manage Orders</h3>
                          <p className="text-gray-600 text-sm">View and process customer orders</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-card">
                          <h3 className="font-bold text-lg mb-2">Manage Users</h3>
                          <p className="text-gray-600 text-sm">View users and assign roles</p>
                        </div>
                      </div>
                    </div>
                  </AdminRoute>
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
                      {/* Rest of privacy policy content */}
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
                      {/* Rest of terms content */}
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
                      {/* Rest of shipping policy content */}
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