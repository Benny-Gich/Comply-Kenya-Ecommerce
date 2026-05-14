import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useAdminOrders from '../../viewModels/useOrdersViewModel';
import {
    FiUsers, FiSearch, FiUser, FiShoppingBag, FiArrowLeft, FiMail,
    FiPhone, FiCalendar, FiTag, FiArrowRight,
} from 'react-icons/fi';

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

const readCustomers = () => {
    try { return JSON.parse(localStorage.getItem('complyUsers') || '[]'); } catch { return []; }
};

const segment = (totalSpent, orderCount) => {
    if (orderCount === 0) return { label: 'Inactive', color: 'bg-gray-100 text-gray-500' };
    if (totalSpent >= 50000 || orderCount >= 10) return { label: 'VIP', color: 'bg-yellow-100 text-yellow-700' };
    if (totalSpent >= 20000 || orderCount >= 5) return { label: 'Loyal', color: 'bg-green-100 text-green-700' };
    if (orderCount >= 2) return { label: 'Regular', color: 'bg-blue-100 text-blue-700' };
    return { label: 'New', color: 'bg-purple-100 text-purple-700' };
};

// ─────────────────────────────── Customer Detail ────────────────────────────

const CustomerDetail = () => {
    const { id } = useParams();
    const { orders } = useAdminOrders();

    const customers = readCustomers();
    const customer = customers.find((c) => String(c.id) === String(id));
    const customerOrders = orders.filter((o) => String(o.userId) === String(id));
    const totalSpent = customerOrders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);
    const seg = segment(totalSpent, customerOrders.length);

    if (!customer) {
        return (
            <div className="text-center py-16 text-gray-400">
                <FiUser size={40} className="mx-auto mb-3 opacity-30" />
                <p>Customer not found.</p>
                <Link to="/admin/customers" className="text-primary-green text-sm mt-3 inline-block hover:underline">Back to customers</Link>
            </div>
        );
    }

    const formatDate = (iso) => new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-3">
                <Link to="/admin/customers" className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"><FiArrowLeft size={18} /></Link>
                <h1 className="text-2xl font-bold text-gray-800">Customer Profile</h1>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-wrap gap-6 items-start">
                <div className="w-14 h-14 rounded-full bg-primary-green flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {customer.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-lg font-semibold text-gray-800">{customer.name}</h2>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${seg.color}`}>{seg.label}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5"><FiMail size={13} />{customer.email}</span>
                        {customer.phone && <span className="flex items-center gap-1.5"><FiPhone size={13} />{customer.phone}</span>}
                        <span className="flex items-center gap-1.5"><FiCalendar size={13} />Joined {formatDate(customer.createdAt)}</span>
                    </div>
                </div>
                <div className="flex gap-6">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-primary-green">{customerOrders.length}</p>
                        <p className="text-xs text-gray-400">Orders</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-primary-green">KES {totalSpent.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">Total Spent</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-primary-green">
                            {customerOrders.length > 0 ? `KES ${Math.round(totalSpent / customerOrders.length).toLocaleString()}` : '—'}
                        </p>
                        <p className="text-xs text-gray-400">Avg. Order</p>
                    </div>
                </div>
            </div>

            {/* Order History */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b">
                    <h3 className="font-semibold text-gray-800">Order History</h3>
                </div>
                {customerOrders.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        <FiShoppingBag size={32} className="mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No orders yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3 text-left">Order ID</th>
                                    <th className="px-6 py-3 text-left">Date</th>
                                    <th className="px-6 py-3 text-left">Items</th>
                                    <th className="px-6 py-3 text-right">Total</th>
                                    <th className="px-6 py-3 text-left">Status</th>
                                    <th className="px-6 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {customerOrders.map((o) => (
                                    <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-3 font-mono text-xs text-gray-600">{o.id}</td>
                                        <td className="px-6 py-3 text-gray-500">{formatDate(o.createdAt)}</td>
                                        <td className="px-6 py-3 text-gray-600">{o.items?.length || 0} item(s)</td>
                                        <td className="px-6 py-3 text-right font-semibold text-gray-800">KES {o.total?.toLocaleString()}</td>
                                        <td className="px-6 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-600'}`}>
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <Link to={`/admin/orders/${o.id}`} className="text-xs text-primary-green hover:underline">View →</Link>
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

// ─────────────────────────────── Customers List ─────────────────────────────

const AdminCustomers = () => {
    const { orders } = useAdminOrders();
    const [search, setSearch] = useState('');
    const [segmentFilter, setSegmentFilter] = useState('all');

    const customers = readCustomers();

    const enriched = useMemo(() => customers.map((c) => {
        const co = orders.filter((o) => String(o.userId) === String(c.id));
        const spent = co.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);
        const seg = segment(spent, co.length);
        const lastOrder = co.length > 0 ? co.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] : null;
        return { ...c, orderCount: co.length, totalSpent: spent, segment: seg, lastOrder };
    }), [customers, orders]); // eslint-disable-line react-hooks/exhaustive-deps

    const filtered = enriched.filter((c) => {
        const q = search.toLowerCase();
        const matchSearch = !q || c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.phone?.includes(q);
        const matchSeg = segmentFilter === 'all' || c.segment.label.toLowerCase() === segmentFilter;
        return matchSearch && matchSeg;
    });

    const segCounts = useMemo(() => {
        const counts = { all: enriched.length };
        ['vip', 'loyal', 'regular', 'new', 'inactive'].forEach((s) => {
            counts[s] = enriched.filter((c) => c.segment.label.toLowerCase() === s).length;
        });
        return counts;
    }, [enriched]);

    const formatDate = (iso) => new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
                <p className="text-sm text-gray-500 mt-0.5">{customers.length} registered customers</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    { label: 'Total', value: segCounts.all, color: 'text-gray-800' },
                    { label: 'VIP', value: segCounts.vip, color: 'text-yellow-600' },
                    { label: 'Loyal', value: segCounts.loyal, color: 'text-green-600' },
                    { label: 'Regular', value: segCounts.regular, color: 'text-blue-600' },
                    { label: 'New', value: segCounts.new, color: 'text-purple-600' },
                ].map(({ label, value, color }) => (
                    <div key={label} className="bg-white rounded-xl shadow-sm p-4 text-center">
                        <p className={`text-2xl font-bold ${color}`}>{value}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-48">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-green/30"
                        placeholder="Search by name, email, phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
                    {[['all', `All (${segCounts.all})`], ['vip', `VIP (${segCounts.vip})`], ['loyal', `Loyal (${segCounts.loyal})`], ['regular', `Regular (${segCounts.regular})`], ['new', `New (${segCounts.new})`]].map(([v, l]) => (
                        <button key={v} onClick={() => setSegmentFilter(v)}
                            className={`px-3 py-2 transition-colors text-xs ${segmentFilter === v ? 'bg-primary-green text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                        >{l}</button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <FiUsers size={40} className="mx-auto mb-3 opacity-30" />
                        <p>{customers.length === 0 ? 'No customers have registered yet.' : 'No customers match your search.'}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3 text-left">Customer</th>
                                    <th className="px-6 py-3 text-left">Segment</th>
                                    <th className="px-6 py-3 text-center">Orders</th>
                                    <th className="px-6 py-3 text-right">Total Spent</th>
                                    <th className="px-6 py-3 text-left">Last Order</th>
                                    <th className="px-6 py-3 text-left">Joined</th>
                                    <th className="px-6 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary-green/10 text-primary-green flex items-center justify-center font-bold text-sm flex-shrink-0">
                                                    {c.name?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{c.name}</p>
                                                    <p className="text-xs text-gray-400">{c.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.segment.color}`}>
                                                <FiTag size={10} />{c.segment.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center font-semibold text-gray-700">{c.orderCount}</td>
                                        <td className="px-6 py-4 text-right font-semibold text-gray-800">
                                            {c.totalSpent > 0 ? `KES ${c.totalSpent.toLocaleString()}` : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {c.lastOrder ? formatDate(c.lastOrder.createdAt) : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">{formatDate(c.createdAt)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Link to={`/admin/customers/${c.id}`} className="text-xs text-primary-green hover:underline flex items-center gap-1 justify-end">
                                                View <FiArrowRight size={11} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <p className="text-xs text-gray-400 text-right">{filtered.length} of {customers.length} customers shown</p>
        </div>
    );
};

export { CustomerDetail };
export default AdminCustomers;
