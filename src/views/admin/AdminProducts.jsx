import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAdminProducts from '../../viewModels/useProductsViewModel';
import {
    FiSearch, FiPlus, FiEdit2, FiTrash2, FiPackage, FiAlertTriangle,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const STOCK_THRESHOLD = 20;

const AdminProducts = () => {
    const { products, categories, deleteProduct } = useAdminProducts();
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');

    const filtered = products.filter((p) => {
        const q = search.toLowerCase();
        const matchSearch = !q || p.name.toLowerCase().includes(q) || p.category.includes(q);
        const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
        const matchStock =
            stockFilter === 'all' ||
            (stockFilter === 'in' && p.inStock) ||
            (stockFilter === 'low' && p.stockQty <= STOCK_THRESHOLD && p.inStock) ||
            (stockFilter === 'out' && !p.inStock);
        return matchSearch && matchCat && matchStock;
    });

    const handleDelete = (p) => {
        if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
        deleteProduct(p.id);
        toast.success('Product deleted');
    };

    const stockBadge = (p) => {
        if (!p.inStock || p.stockQty === 0) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Out of stock</span>;
        if (p.stockQty <= STOCK_THRESHOLD) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Low ({p.stockQty})</span>;
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">In stock ({p.stockQty})</span>;
    };

    const counts = {
        all: products.length,
        in: products.filter((p) => p.inStock && p.stockQty > STOCK_THRESHOLD).length,
        low: products.filter((p) => p.stockQty <= STOCK_THRESHOLD && p.inStock).length,
        out: products.filter((p) => !p.inStock || p.stockQty === 0).length,
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{products.length} products in catalog</p>
                </div>
                <Link to="/admin/products/new" className="flex items-center gap-2 px-4 py-2 bg-primary-green text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                    <FiPlus size={16} /> Add Product
                </Link>
            </div>

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
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green/30"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
                    {[['all', `All (${counts.all})`], ['in', `In Stock (${counts.in})`], ['low', `Low (${counts.low})`], ['out', `Out (${counts.out})`]].map(([v, label]) => (
                        <button
                            key={v}
                            onClick={() => setStockFilter(v)}
                            className={`px-3 py-2 transition-colors ${stockFilter === v ? 'bg-primary-green text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
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
                                    <th className="px-6 py-3 text-right">Price</th>
                                    <th className="px-6 py-3 text-left">Stock</th>
                                    <th className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" onError={(e) => { e.target.style.display = 'none'; }} />
                                                <div>
                                                    <p className="font-medium text-gray-800 line-clamp-1">{p.name}</p>
                                                    {p.originalPrice && (
                                                        <p className="text-xs text-gray-400 line-through">KES {p.originalPrice?.toLocaleString()}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 capitalize">{p.categoryName || p.category}</td>
                                        <td className="px-6 py-4 text-right font-semibold text-gray-800">
                                            KES {p.price?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {stockBadge(p)}
                                                {p.stockQty <= STOCK_THRESHOLD && p.stockQty > 0 && (
                                                    <FiAlertTriangle size={13} className="text-yellow-500" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    to={`/admin/products/${p.id}/edit`}
                                                    className="p-1.5 text-gray-500 hover:text-primary-green hover:bg-green-50 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 size={15} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(p)}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <p className="text-xs text-gray-400 text-right">{filtered.length} of {products.length} products shown</p>
        </div>
    );
};

export default AdminProducts;
