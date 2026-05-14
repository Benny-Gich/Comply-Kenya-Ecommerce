import React from 'react';
import { Link } from 'react-router-dom';
import useAdminOrders from '../../viewModels/useOrdersViewModel';
import useAdminProducts from '../../viewModels/useProductsViewModel';
import {
    FiShoppingBag, FiClock, FiTruck, FiCheckCircle, FiDollarSign, FiArrowRight,
    FiPackage, FiAlertTriangle, FiBarChart2, FiUsers, FiLayers,
} from 'react-icons/fi';

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon size={22} />
        </div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const AdminDashboard = () => {
    const { orders } = useAdminOrders();
    const { products } = useAdminProducts();

    const customers = (() => { try { return JSON.parse(localStorage.getItem('complyUsers') || '[]'); } catch { return []; } })();

    const total = orders.length;
    const pending = orders.filter((o) => o.status === 'pending').length;
    const processing = orders.filter((o) => ['confirmed', 'processing'].includes(o.status)).length;
    const shipped = orders.filter((o) => o.status === 'shipped').length;
    const delivered = orders.filter((o) => o.status === 'delivered').length;
    const revenue = orders
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.total || 0), 0);

    const lowStockCount = products.filter((p) => p.stockQty <= 20 && p.stockQty > 0).length;
    const outOfStockCount = products.filter((p) => p.stockQty === 0 || !p.inStock).length;

    const recent = [...orders].slice(0, 8);

    const formatDate = (iso) =>
        new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Store overview — orders, revenue, stock and customers</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <StatCard icon={FiShoppingBag} label="Total Orders" value={total} color="bg-blue-50 text-blue-600" />
                <StatCard icon={FiDollarSign} label="Total Revenue" value={`KES ${revenue.toLocaleString()}`} color="bg-green-50 text-green-600" />
                <StatCard icon={FiClock} label="Pending" value={pending} color="bg-yellow-50 text-yellow-600" />
                <StatCard icon={FiShoppingBag} label="Processing" value={processing} color="bg-purple-50 text-purple-600" />
                <StatCard icon={FiTruck} label="Shipped" value={shipped} color="bg-indigo-50 text-indigo-600" />
                <StatCard icon={FiCheckCircle} label="Delivered" value={delivered} color="bg-emerald-50 text-emerald-600" />
            </div>

            {/* Quick Links */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link to="/admin/analytics" className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                        <FiBarChart2 size={18} />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">Analytics</p>
                        <p className="text-xs text-gray-400">Revenue & trends</p>
                    </div>
                    <FiArrowRight size={14} className="text-gray-300 group-hover:text-primary-green transition-colors" />
                </Link>
                <Link to="/admin/products" className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                        <FiLayers size={18} />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">Products</p>
                        <p className="text-xs text-gray-400">{products.length} in catalog</p>
                    </div>
                    <FiArrowRight size={14} className="text-gray-300 group-hover:text-primary-green transition-colors" />
                </Link>
                <Link to="/admin/inventory" className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow flex items-center gap-4 group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${outOfStockCount > 0 ? 'bg-red-50 text-red-500' : lowStockCount > 0 ? 'bg-yellow-50 text-yellow-500' : 'bg-green-50 text-green-600'}`}>
                        {outOfStockCount > 0 ? <FiAlertTriangle size={18} /> : <FiPackage size={18} />}
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">Inventory</p>
                        <p className="text-xs text-gray-400">
                            {outOfStockCount > 0 ? `${outOfStockCount} out of stock` : lowStockCount > 0 ? `${lowStockCount} low stock` : 'All stocked'}
                        </p>
                    </div>
                    <FiArrowRight size={14} className="text-gray-300 group-hover:text-primary-green transition-colors" />
                </Link>
                <Link to="/admin/customers" className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center">
                        <FiUsers size={18} />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">Customers</p>
                        <p className="text-xs text-gray-400">{customers.length} registered</p>
                    </div>
                    <FiArrowRight size={14} className="text-gray-300 group-hover:text-primary-green transition-colors" />
                </Link>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="font-semibold text-gray-800">Recent Orders</h2>
                    <Link to="/admin/orders" className="text-sm text-primary-green hover:underline flex items-center gap-1">
                        View all <FiArrowRight size={14} />
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <FiShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
                        <p>No orders yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3 text-left">Order ID</th>
                                    <th className="px-6 py-3 text-left">Customer</th>
                                    <th className="px-6 py-3 text-left">Date</th>
                                    <th className="px-6 py-3 text-left">Items</th>
                                    <th className="px-6 py-3 text-right">Total</th>
                                    <th className="px-6 py-3 text-left">Status</th>
                                    <th className="px-6 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recent.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-600">{order.id}</td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-800">
                                                {order.shipping?.firstName} {order.shipping?.lastName}
                                            </p>
                                            <p className="text-xs text-gray-400">{order.shipping?.email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{formatDate(order.createdAt)}</td>
                                        <td className="px-6 py-4 text-gray-600">{order.items?.length || 0} item(s)</td>
                                        <td className="px-6 py-4 text-right font-semibold">KES {(order.total || 0).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                to={`/admin/orders/${order.id}`}
                                                className="text-primary-green hover:underline text-xs font-medium"
                                            >
                                                Manage →
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
