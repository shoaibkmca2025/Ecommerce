import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';
import AddProductPage from './pages/AddProductPage';

// Context
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProductsProvider } from './context/ProductsContext';

// Components
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const location = useLocation();
  
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
            <div className="app">
              <Header />
              <main className="main-content">
                <AnimatePresence mode="wait">
                  <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/admin/add-product" element={<AddProductPage />} />
                  </Routes>
                </AnimatePresence>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;