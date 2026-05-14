import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import ProductList from './components/Products/ProductList';
import ProductDetail from './components/Products/ProductDetail';
import Cart from './components/Cart/Cart';
import Checkout from './components/Cart/Checkout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AccountDashboard from './components/Auth/AccountDashboard';
import OrderTracking from './components/Orders/OrderTracking';
import OrderHistory from './components/Orders/OrderHistory';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<AccountDashboard />} />
        <Route path="/orders/:id/track" element={<OrderTracking />} />
        <Route path="/orders" element={<OrderHistory />} />
      </Routes>
    </Layout>
  );
}

export default App;