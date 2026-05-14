import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from '../components/Layout/Layout';

// Customer views
import Home from '../views/customer/Home';
import ProductList from '../views/customer/ProductList';
import ProductDetail from '../views/customer/ProductDetail';
import Cart from '../views/customer/Cart';
import Checkout from '../views/customer/Checkout';
import Login from '../views/customer/Login';
import Register from '../views/customer/Register';
import AccountDashboard from '../views/customer/AccountDashboard';
import OrderTracking from '../views/customer/OrderTracking';
import OrderHistory from '../views/customer/OrderHistory';
import About from '../views/customer/About';
import Contact from '../views/customer/Contact';

// Admin views
import AdminLogin from '../views/admin/AdminLogin';
import AdminLayout from '../views/admin/AdminLayout';
import AdminDashboard from '../views/admin/AdminDashboard';
import AdminOrders from '../views/admin/AdminOrders';
import AdminOrderDetail from '../views/admin/AdminOrderDetail';
import AdminProducts from '../views/admin/AdminProducts';
import AdminProductEdit from '../views/admin/AdminProductEdit';
import AdminInventory from '../views/admin/AdminInventory';
import AdminCustomers, { CustomerDetail } from '../views/admin/AdminCustomers';
import AdminAnalytics from '../views/admin/AdminAnalytics';
import AdminSettings from '../views/admin/AdminSettings';

function CustomerApp() {
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
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </Layout>
    );
}

const AppRouter = () => {
    return (
        <Routes>
            {/* Admin routes — no customer layout */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="orders/:id" element={<AdminOrderDetail />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/:id/edit" element={<AdminProductEdit />} />
                <Route path="inventory" element={<AdminInventory />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="customers/:id" element={<CustomerDetail />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="settings" element={<AdminSettings />} />
            </Route>
            {/* Customer routes */}
            <Route path="*" element={<CustomerApp />} />
        </Routes>
    );
};

export default AppRouter;
