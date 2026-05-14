import React, { useState, useMemo } from 'react';
import useAdminOrders from '../../viewModels/useOrdersViewModel';
import { FiTrendingUp, FiShoppingBag, FiDollarSign, FiUsers, FiRepeat, FiBarChart2 } from 'react-icons/fi';

const RANGES = [
    { label: '7 days', days: 7 },
    { label: '30 days', days: 30 },
    { label: '90 days', days: 90 },
    { label: 'All time', days: Infinity },
];

const readCustomers = () => {
    try { return JSON.parse(localStorage.getItem('complyUsers') || '[]'); } catch { return []; }
};

const fmt = (n) => n?.toLocaleString('en-KE') || '0';
const fmtKES = (n) => `KES ${fmt(n)}`;

const MetricCard = ({ icon: Icon, label, value, sub, color }) => (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-start gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
            <Icon size={20} />
        </div>
        <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
            <p className="text-xl font-bold text-gray-800 mt-0.5">{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
    </div>
);

const BarChart = ({ data, valueKey, labelKey, color = 'bg-primary-green', formatValue }) => {
    const max = Math.max(...data.map((d) => d[valueKey]), 1);
    return (
        <div className="space-y-2">
            {data.map((d, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="w-32 text-xs text-gray-500 truncate text-right flex-shrink-0">{d[labelKey]}</span>
                    <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
                        <div
                            className={`h-full ${color} rounded transition-all flex items-center pl-2`}
                            style={{ width: `${Math.max(4, (d[valueKey] / max) * 100)}%` }}
                        >
                            <span className="text-xs text-white font-medium whitespace-nowrap">
                                {formatValue ? formatValue(d[valueKey]) : d[valueKey]}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const AdminAnalytics = () => {
    const { orders } = useAdminOrders();
    const [rangeIdx, setRangeIdx] = useState(1); // default 30 days
    const range = RANGES[rangeIdx];

    const customers = readCustomers();

    const filtered = useMemo(() => {
        if (range.days === Infinity) return orders;
        const cutoff = new Date(Date.now() - range.days * 86400 * 1000);
        return orders.filter((o) => new Date(o.createdAt) >= cutoff);
    }, [orders, range.days]);

    const active = filtered.filter((o) => o.status !== 'cancelled');

    const metrics = useMemo(() => {
        const revenue = active.reduce((s, o) => s + (o.total || 0), 0);
        const avgOrder = active.length > 0 ? Math.round(revenue / active.length) : 0;
        const delivered = active.filter((o) => o.status === 'delivered').length;
        const convRate = active.length > 0 ? Math.round((delivered / active.length) * 100) : 0;
        return { revenue, avgOrder, delivered, convRate, total: filtered.length, cancelled: filtered.filter((o) => o.status === 'cancelled').length };
    }, [active, filtered]);

    // Revenue by day (last N days or grouped monthly)
    const revenueByPeriod = useMemo(() => {
        const buckets = {};
        const days = range.days === Infinity ? null : range.days;
        active.forEach((o) => {
            const d = new Date(o.createdAt);
            const key = days && days <= 30
                ? d.toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })
                : d.toLocaleDateString('en-KE', { month: 'short', year: '2-digit' });
            buckets[key] = (buckets[key] || 0) + (o.total || 0);
        });
        return Object.entries(buckets)
            .map(([date, revenue]) => ({ date, revenue }))
            .slice(-12); // last 12 buckets
    }, [active, range.days]);

    // Orders by status
    const byStatus = useMemo(() => {
        const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
        return statuses.map((s) => ({
            status: s,
            count: filtered.filter((o) => o.status === s).length,
        })).filter((s) => s.count > 0);
    }, [filtered]);

    // Top products by revenue
    const topProducts = useMemo(() => {
        const map = {};
        active.forEach((o) => {
            (o.items || []).forEach((item) => {
                if (!map[item.name]) map[item.name] = { name: item.name, revenue: 0, units: 0 };
                map[item.name].revenue += (item.price || 0) * (item.quantity || 1);
                map[item.name].units += item.quantity || 1;
            });
        });
        return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 6);
    }, [active]);

    // Status color map for status chart
    const statusBarColor = {
        pending: 'bg-yellow-400', confirmed: 'bg-blue-400', processing: 'bg-purple-400',
        shipped: 'bg-indigo-400', delivered: 'bg-green-500', cancelled: 'bg-red-400',
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Sales performance and trends</p>
                </div>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
                    {RANGES.map(({ label }, i) => (
                        <button key={i} onClick={() => setRangeIdx(i)}
                            className={`px-4 py-2 transition-colors ${rangeIdx === i ? 'bg-primary-green text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                        >{label}</button>
                    ))}
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <MetricCard icon={FiDollarSign} label="Revenue" value={fmtKES(metrics.revenue)} color="bg-green-50 text-green-600" />
                <MetricCard icon={FiShoppingBag} label="Orders" value={fmt(metrics.total)} sub={`${metrics.cancelled} cancelled`} color="bg-blue-50 text-blue-600" />
                <MetricCard icon={FiTrendingUp} label="Avg Order" value={fmtKES(metrics.avgOrder)} color="bg-indigo-50 text-indigo-600" />
                <MetricCard icon={FiRepeat} label="Conversion" value={`${metrics.convRate}%`} sub="placed → delivered" color="bg-purple-50 text-purple-600" />
                <MetricCard icon={FiUsers} label="Customers" value={fmt(customers.length)} color="bg-yellow-50 text-yellow-600" />
                <MetricCard icon={FiBarChart2} label="Delivered" value={fmt(metrics.delivered)} color="bg-emerald-50 text-emerald-600" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Revenue Trend */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="font-semibold text-gray-800 mb-4">Revenue Trend</h2>
                    {revenueByPeriod.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">No data for this period.</p>
                    ) : (
                        <BarChart
                            data={revenueByPeriod}
                            valueKey="revenue"
                            labelKey="date"
                            color="bg-primary-green"
                            formatValue={(v) => `KES ${(v / 1000).toFixed(0)}k`}
                        />
                    )}
                </div>

                {/* Orders by Status */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="font-semibold text-gray-800 mb-4">Orders by Status</h2>
                    {byStatus.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">No orders in this period.</p>
                    ) : (
                        <div className="space-y-2">
                            {byStatus.map(({ status, count }) => {
                                const pct = Math.round((count / filtered.length) * 100);
                                return (
                                    <div key={status} className="flex items-center gap-3 text-sm">
                                        <span className="w-20 text-xs text-gray-500 capitalize">{status}</span>
                                        <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
                                            <div
                                                className={`h-full ${statusBarColor[status] || 'bg-gray-400'} rounded transition-all flex items-center pl-2`}
                                                style={{ width: `${Math.max(8, pct)}%` }}
                                            >
                                                <span className="text-xs text-white font-medium">{count}</span>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400 w-10 text-right">{pct}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="font-semibold text-gray-800 mb-4">Top Products by Revenue</h2>
                {topProducts.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">No sales data yet.</p>
                ) : (
                    <BarChart
                        data={topProducts}
                        valueKey="revenue"
                        labelKey="name"
                        color="bg-indigo-500"
                        formatValue={(v) => `KES ${(v / 1000).toFixed(1)}k`}
                    />
                )}
                {topProducts.length > 0 && (
                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-xs text-gray-500 uppercase border-t">
                                <tr>
                                    <th className="py-2 pr-4 text-left">Product</th>
                                    <th className="py-2 px-4 text-right">Units Sold</th>
                                    <th className="py-2 pl-4 text-right">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {topProducts.map((p, i) => (
                                    <tr key={i}>
                                        <td className="py-2 pr-4 font-medium text-gray-700">{p.name}</td>
                                        <td className="py-2 px-4 text-right text-gray-600">{p.units}</td>
                                        <td className="py-2 pl-4 text-right font-semibold text-gray-800">KES {p.revenue.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Segmentation Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="font-semibold text-gray-800 mb-4">Customer Segmentation</h2>
                {customers.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">No registered customers yet.</p>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'VIP', desc: '≥ KES 50k or 10+ orders', color: 'border-yellow-300 bg-yellow-50', textColor: 'text-yellow-700' },
                            { label: 'Loyal', desc: '≥ KES 20k or 5+ orders', color: 'border-green-300 bg-green-50', textColor: 'text-green-700' },
                            { label: 'Regular', desc: '2+ orders', color: 'border-blue-300 bg-blue-50', textColor: 'text-blue-700' },
                            { label: 'New', desc: '1 order', color: 'border-purple-300 bg-purple-50', textColor: 'text-purple-700' },
                        ].map(({ label, desc, color, textColor }) => {
                            const allCustomers = readCustomers();
                            const count = allCustomers.filter((c) => {
                                const co = orders.filter((o) => String(o.userId) === String(c.id) && o.status !== 'cancelled');
                                const spent = co.reduce((s, o) => s + (o.total || 0), 0);
                                const seg = (() => {
                                    if (co.length === 0) return 'Inactive';
                                    if (spent >= 50000 || co.length >= 10) return 'VIP';
                                    if (spent >= 20000 || co.length >= 5) return 'Loyal';
                                    if (co.length >= 2) return 'Regular';
                                    return 'New';
                                })();
                                return seg === label;
                            }).length;
                            return (
                                <div key={label} className={`border-2 ${color} rounded-xl p-4`}>
                                    <p className={`text-2xl font-bold ${textColor}`}>{count}</p>
                                    <p className={`text-sm font-semibold ${textColor}`}>{label}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAnalytics;
