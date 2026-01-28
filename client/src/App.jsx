import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute, { AdminRoute } from './components/ProtectedRoute';
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

// Admin Pages (to be created)
// const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

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
            
            <Route 
              path="cart" 
              element={
                <div className="min-h-screen container-custom py-12">
                  <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
                  <p className="text-gray-600">Shopping cart functionality coming soon...</p>
                </div>
              } 
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
                    <h2 className="text-2xl font-bold mt-8 mb-4">Information We Collect</h2>
                    <p className="text-gray-700">
                      We collect information that you provide directly to us when you:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li>Create an account (name, email, profile picture from Google)</li>
                      <li>Place an order (delivery address, phone number)</li>
                      <li>Contact us (email, message content)</li>
                    </ul>
                    <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Your Information</h2>
                    <p className="text-gray-700">
                      We use your information to:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li>Process and fulfill your orders</li>
                      <li>Communicate with you about your orders</li>
                      <li>Improve our services</li>
                      <li>Send you marketing communications (with your consent)</li>
                    </ul>
                    <h2 className="text-2xl font-bold mt-8 mb-4">Data Security</h2>
                    <p className="text-gray-700">
                      We implement appropriate security measures to protect your personal 
                      information. All data is encrypted in transit and at rest using 
                      industry-standard protocols.
                    </p>
                    <h2 className="text-2xl font-bold mt-8 mb-4">Your Rights</h2>
                    <p className="text-gray-700">
                      You have the right to:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li>Access your personal data</li>
                      <li>Correct inaccurate data</li>
                      <li>Request deletion of your data</li>
                      <li>Object to data processing</li>
                      <li>Export your data</li>
                    </ul>
                    <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
                    <p className="text-gray-700">
                      If you have questions about this Privacy Policy, please contact us at:
                      <br />
                      Email: info@mkulimasharp.co.ke
                      <br />
                      Phone: +254 700 000 000
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
                    <h2 className="text-2xl font-bold mt-8 mb-4">Acceptance of Terms</h2>
                    <p className="text-gray-700">
                      By accessing and using this platform, you accept and agree to be bound 
                      by these Terms and our Privacy Policy.
                    </p>
                    <h2 className="text-2xl font-bold mt-8 mb-4">Use of Service</h2>
                    <p className="text-gray-700">
                      You agree to use Mkulima Sharp only for lawful purposes and in accordance 
                      with these Terms. You must not use our service:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li>In any way that violates applicable laws or regulations</li>
                      <li>To transmit any harmful or malicious code</li>
                      <li>To impersonate or attempt to impersonate another person</li>
                      <li>To engage in any fraudulent activity</li>
                    </ul>
                    <h2 className="text-2xl font-bold mt-8 mb-4">Orders and Payments</h2>
                    <p className="text-gray-700">
                      All orders are subject to acceptance and availability. We reserve the 
                      right to refuse or cancel any order. Prices are subject to change 
                      without notice.
                    </p>
                    <h2 className="text-2xl font-bold mt-8 mb-4">Intellectual Property</h2>
                    <p className="text-gray-700">
                      All content on this platform, including text, graphics, logos, and 
                      software, is the property of Mkulima Sharp and protected by copyright 
                      and other intellectual property laws.
                    </p>
                    <h2 className="text-2xl font-bold mt-8 mb-4">Limitation of Liability</h2>
                    <p className="text-gray-700">
                      Mkulima Sharp shall not be liable for any indirect, incidental, special, 
                      consequential, or punitive damages resulting from your use of or inability 
                      to use the service.
                    </p>
                    <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
                    <p className="text-gray-700">
                      If you have questions about these Terms, please contact us at:
                      <br />
                      Email: info@mkulimasharp.co.ke
                      <br />
                      Phone: +254 700 000 000
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
                    <h2 className="text-2xl font-bold mt-8 mb-4">Delivery Times</h2>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li>Nairobi and surrounding areas: 1-2 business days</li>
                      <li>Major cities: 2-3 business days</li>
                      <li>Rural areas: 3-5 business days</li>
                    </ul>
                    <h2 className="text-2xl font-bold mt-8 mb-4">Shipping Costs</h2>
                    <p className="text-gray-700">
                      Shipping costs are calculated based on distance and order size. 
                      Free shipping on orders over KES 10,000.
                    </p>
                    <h2 className="text-2xl font-bold mt-8 mb-4">Order Tracking</h2>
                    <p className="text-gray-700">
                      Once your order is dispatched, you will receive tracking information 
                      via SMS and email.
                    </p>
                    <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
                    <p className="text-gray-700">
                      For shipping inquiries, contact us at:
                      <br />
                      Email: info@mkulimasharp.co.ke
                      <br />
                      Phone: +254 700 000 000
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
    </Router>
  );
}

export default App;