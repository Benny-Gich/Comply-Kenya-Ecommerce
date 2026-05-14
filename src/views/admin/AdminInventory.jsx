import React, { useState } from 'react';
import useAdminProducts from '../../viewModels/useProductsViewModel';
import { FiSearch, FiPackage, FiAlertTriangle, FiAlertCircle, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';

const LOW_THRESHOLD = 20;
const CRITICAL_THRESHOLD = 5;

const AdminInventory = () => {
    const { products, categories, updateStock, refresh } = useAdminProducts();
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');
    const [editingId, setEditingId] = useState(null);
    const [editQty, setEditQty] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const filtered = products.filter((p) => {
        const q = search.toLowerCase();
        const matchSearch = !q || p.name.toLowerCase().includes(q);
        const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
        const matchStock =
            stockFilter === 'all' ||
            (stockFilter === 'critical' && p.stockQty <= CRITICAL_THRESHOLD) ||
            (stockFilter === 'low' && p.stockQty > CRITICAL_THRESHOLD && p.stockQty <= LOW_THRESHOLD) ||
            (stockFilter === 'healthy' && p.stockQty > LOW_THRESHOLD);
        return matchSearch && matchCat && matchStock;
    });

    const totals = {
        all: products.length,
        critical: products.filter((p) => p.stockQty <= CRITICAL_THRESHOLD).length,
        low: products.filter((p) => p.stockQty > CRITICAL_THRESHOLD && p.stockQty <= LOW_THRESHOLD).length,
        healthy: products.filter((p) => p.stockQty > LOW_THRESHOLD).length,
        totalUnits: products.reduce((s, p) => s + (p.stockQty || 0), 0),
    };

    const startEdit = (p) => {
        setEditingId(p.id);
        setEditQty(String(p.stockQty));
    };

    const saveEdit = (id) => {
        const qty = parseInt(editQty, 10);
        if (isNaN(qty) || qty < 0) { toast.error('Invalid quantity'); return; }
        updateStock(id, qty);
        toast.success('Stock updated');
        setEditingId(null);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        refresh();
        setTimeout(() => setRefreshing(false), 400);
    };

    const stockLevel = (qty) => {
        if (qty <= CRITICAL_THRESHOLD) return { label: 'Critical', color: 'text-red-600 bg-red-50', bar: 'bg-red-500', icon: FiAlertCircle, width: Math.max(5, (qty / LOW_THRESHOLD) * 30) };
        if (qty <= LOW_THRESHOLD) return { label: 'Low', color: 'text-yellow-600 bg-yellow-50', bar: 'bg-yellow-400', icon: FiAlertTriangle, width: (qty / LOW_THRESHOLD) * 60 };
        return { label: 'Healthy', color: 'text-green-600 bg-green-50', bar: 'bg-green-500', icon: FiCheckCircle, width: Math.min(100, (qty / 200) * 100) };
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Monitor and manage stock levels</p>
                </div>
                <button
                    onClick={handleRefresh}
                    className={`flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors ${refreshing ? 'opacity-60' : ''}`}
                >
                    <FiRefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /> Refresh
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-1">
                        <FiPackage size={16} className="text-blue-500" />
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Total SKUs</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{totals.all}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{totals.totalUnits.toLocaleString()} total units</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5 cursor-pointer hover:ring-2 hover:ring-red-200 transition" onClick={() => setStockFilter('critical')}>
                    <div className="flex items-center gap-2 mb-1">
                        <FiAlertCircle size={16} className="text-red-500" />
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Critical</p>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{totals.critical}</p>
                    <p className="text-xs text-gray-400 mt-0.5">≤ {CRITICAL_THRESHOLD} units</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5 cursor-pointer hover:ring-2 hover:ring-yellow-200 transition" onClick={() => setStockFilter('low')}>
                    <div className="flex items-center gap-2 mb-1">
                        <FiAlertTriangle size={16} className="text-yellow-500" />
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Low Stock</p>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">{totals.low}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{CRITICAL_THRESHOLD + 1}–{LOW_THRESHOLD} units</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5 cursor-pointer hover:ring-2 hover:ring-green-200 transition" onClick={() => setStockFilter('healthy')}>
                    <div className="flex items-center gap-2 mb-1">
                        <FiCheckCircle size={16} className="text-green-500" />
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Healthy</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{totals.healthy}</p>
                    <p className="text-xs text-gray-400 mt-0.5">&gt; {LOW_THRESHOLD} units</p>
                </div>
            </div>

            {/* Alerts Banner */}
            {totals.critical > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <FiAlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-red-700">Stock Alert: {totals.critical} product{totals.critical > 1 ? 's' : ''} critically low</p>
                        <p className="text-xs text-red-500 mt-0.5">These products have ≤ {CRITICAL_THRESHOLD} units remaining. Restock immediately.</p>
                    </div>
                    <button onClick={() => setStockFilter('critical')} className="ml-auto text-xs text-red-600 underline whitespace-nowrap">View all</button>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-48">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-green/30"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="all">All Categories</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
                    {[['all', 'All'], ['critical', 'Critical'], ['low', 'Low'], ['healthy', 'Healthy']].map(([v, l]) => (
                        <button key={v} onClick={() => setStockFilter(v)}
                            className={`px-3 py-2 transition-colors ${stockFilter === v ? 'bg-primary-green text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                        >{l}</button>
                    ))}
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <FiPackage size={40} className="mx-auto mb-3 opacity-30" />
                        <p>No products match your filters.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3 text-left">Product</th>
                                    <th className="px-6 py-3 text-left">Category</th>
                                    <th className="px-6 py-3 text-left w-48">Stock Level</th>
                                    <th className="px-6 py-3 text-center">Units</th>
                                    <th className="px-6 py-3 text-center">Status</th>
                                    <th className="px-6 py-3 text-center">Adjust</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((p) => {
                                    const level = stockLevel(p.stockQty);
                                    const Icon = level.icon;
                                    return (
                                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover bg-gray-100" onError={(e) => { e.target.style.display = 'none'; }} />
                                                    <p className="font-medium text-gray-800 line-clamp-1">{p.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{p.categoryName || p.category}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all ${level.bar}`}
                                                            style={{ width: `${level.width}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center font-semibold text-gray-800">{p.stockQty}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${level.color}`}>
                                                    <Icon size={11} /> {level.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {editingId === p.id ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <input
                                                            type="number" min="0"
                                                            className="w-20 border border-primary-green rounded px-2 py-1 text-sm text-center focus:outline-none"
                                                            value={editQty}
                                                            onChange={(e) => setEditQty(e.target.value)}
                                                            onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(p.id); if (e.key === 'Escape') setEditingId(null); }}
                                                            autoFocus
                                                        />
                                                        <button onClick={() => saveEdit(p.id)} className="text-xs px-2 py-1 bg-primary-green text-white rounded hover:bg-primary-dark">Save</button>
                                                        <button onClick={() => setEditingId(null)} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200">✕</button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => startEdit(p)}
                                                        className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
                                                    >
                                                        Update
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminInventory;
