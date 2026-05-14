import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAdminOrders from '../../viewModels/useOrdersViewModel';
import { FiSearch, FiShoppingBag, FiRefreshCw } from 'react-icons/fi';

const ALL_STATUSES = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

const AdminOrders = () => {
    const { orders, refresh } = useAdminOrders();
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [lastRefreshed, setLastRefreshed] = useState(() => new Date());
    const [refreshing, setRefreshing] = useState(false);

    const doRefresh = () => {
        setRefreshing(true);
        refresh();
        setTimeout(() => {
            setLastRefreshed(new Date());
            setRefreshing(false);
        }, 300);
    };

    const filtered = orders.filter((o) => {
        const matchStatus = statusFilter === 'all' || o.status === statusFilter;
        const q = search.toLowerCase();
        const matchSearch =
            !q ||
            o.id.toLowerCase().includes(q) ||
            `${o.shipping?.firstName} ${o.shipping?.lastName}`.toLowerCase().includes(q) ||
            o.shipping?.email?.toLowerCase().includes(q) ||
            o.shipping?.phone?.includes(q);
        return matchStatus && matchSearch;
    });

    const formatDate = (iso) =>
        new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });

    const counts = ALL_STATUSES.reduce((acc, s) => {
        acc[s] = s === 'all' ? orders.length : orders.filter((o) => o.status === s).length;
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
                <div className="flex items-center gap-3">
                    {lastRefreshed && (
                        <span className="text-xs text-gray-400">
                            Last refreshed: {lastRefreshed.toLocaleTimeString('en-KE')}
                        </span>
                    )}
                    <button
                        onClick={doRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        <FiRefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by ID, name, email…"
                    className="input-field pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Status tabs */}
            <div className="flex flex-wrap gap-2">
                {ALL_STATUSES.map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${statusFilter === s
                            ? 'bg-primary-green text-white'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        {s === 'all' ? 'All' : s} ({counts[s]})
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <FiShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
                        <p>No orders match your filter.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3 text-left">Order ID</th>
                                    <th className="px-6 py-3 text-left">Customer</th>
                                    <th className="px-6 py-3 text-left">Date</th>
                                    <th className="px-6 py-3 text-left">Payment</th>
                                    <th className="px-6 py-3 text-right">Total</th>
                                    <th className="px-6 py-3 text-left">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-600 whitespace-nowrap">
                                            {order.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-800">
                                                {order.shipping?.firstName} {order.shipping?.lastName}
                                            </p>
                                            <p className="text-xs text-gray-400">{order.shipping?.phone}</p>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                            {formatDate(order.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 capitalize text-gray-600">
                                            {order.payment?.method || '—'}
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-gray-800 whitespace-nowrap">
                                            KES {(order.total || 0).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                to={`/admin/orders/${order.id}`}
                                                className="inline-block px-3 py-1 bg-primary-green text-white text-xs rounded-lg hover:bg-primary-dark transition-colors"
                                            >
                                                Manage
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <p className="text-sm text-gray-400">{filtered.length} order(s) shown</p>
        </div>
    );
};

export default AdminOrders;
