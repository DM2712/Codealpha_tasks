import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { CartDrawer } from './components/cart/CartDrawer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthWall } from './components/auth/AuthWall';

// Lazy-loaded pages for instant initial paint & code-splitting
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const CatalogPage = lazy(() => import('./pages/CatalogPage').then(m => ({ default: m.CatalogPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const CartPage = lazy(() => import('./pages/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage').then(m => ({ default: m.OrderConfirmationPage })));
const MyOrdersPage = lazy(() => import('./pages/MyOrdersPage').then(m => ({ default: m.MyOrdersPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const ReturnPolicyPage = lazy(() => import('./pages/ReturnPolicyPage').then(m => ({ default: m.ReturnPolicyPage })));
const HelpPage = lazy(() => import('./pages/HelpPage').then(m => ({ default: m.HelpPage })));

// Ultra-lightweight route fallback component
const RouteLoadingFallback = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center py-16">
    <div className="flex items-center gap-3 text-primary font-bold text-sm">
      <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
      <span className="text-secondary text-xs font-semibold">Loading view...</span>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <AuthWall>
            <CartProvider>
              <div className="flex flex-col min-h-screen bg-background text-on-surface">
                {/* Sticky Top Navbar */}
                <Navbar />

                {/* Slide-out Cart Drawer */}
                <CartDrawer />

                {/* Main Content Area */}
                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/products" element={<CatalogPage />} />
                      <Route path="/products/:id" element={<ProductDetailPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      
                      {/* Protected Customer Routes */}
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute>
                            <CheckoutPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/order-confirmation/:id"
                        element={<OrderConfirmationPage />}
                      />
                      <Route
                        path="/orders"
                        element={
                          <ProtectedRoute>
                            <MyOrdersPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <ProfilePage />
                          </ProtectedRoute>
                        }
                      />
                      
                      {/* Admin Route */}
                      <Route path="/admin" element={<AdminDashboardPage />} />

                      {/* Legal & Help Public Routes */}
                      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                      <Route path="/return-policy" element={<ReturnPolicyPage />} />
                      <Route path="/help" element={<HelpPage />} />

                      {/* Fallback */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </main>

                {/* Footer */}
                <Footer />

                {/* Mobile Bottom Navigation Bar */}
                <MobileBottomNav />
              </div>
            </CartProvider>
          </AuthWall>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
