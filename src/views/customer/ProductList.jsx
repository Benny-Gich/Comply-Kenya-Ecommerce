import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiGrid, FiList, FiX } from 'react-icons/fi';
import { PRODUCTS, CATEGORIES } from '../../models/products.model';
import ProductCard from '../../components/Products/ProductCard';

const SORT_OPTIONS = [
    { value: 'default', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Best Rated' },
    { value: 'name', label: 'Name A-Z' },
];

const ProductList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('default');
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 20000]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [inStockOnly, setInStockOnly] = useState(false);

    const searchQuery = searchParams.get('search') || '';
    const categoryParam = searchParams.get('category') || '';

    useEffect(() => {
        if (categoryParam) {
            setSelectedCategories([categoryParam]);
        }
    }, [categoryParam]);

    const filtered = useMemo(() => {
        let result = [...PRODUCTS];

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.categoryName.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q)
            );
        }

        if (selectedCategories.length > 0) {
            result = result.filter((p) => selectedCategories.includes(p.category));
        }

        result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

        if (inStockOnly) {
            result = result.filter((p) => p.inStock);
        }

        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                break;
        }

        return result;
    }, [searchQuery, selectedCategories, priceRange, inStockOnly, sortBy]);

    const toggleCategory = (catId) => {
        setSelectedCategories((prev) =>
            prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
        );
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setPriceRange([0, 20000]);
        setInStockOnly(false);
        setSearchParams({});
    };

    const hasActiveFilters = selectedCategories.length > 0 || priceRange[1] < 20000 || priceRange[0] > 0 || inStockOnly || searchQuery;

    return (
        <div className="container-custom py-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        {searchQuery ? `Results for "${searchQuery}"` : 'All Products'}
                    </h1>
                    <p className="text-gray-500 mt-1">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="input-field py-2 w-48"
                    >
                        {SORT_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                    {/* View toggle */}
                    <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 ${viewMode === 'grid' ? 'bg-primary-green text-white' : 'bg-white text-gray-600'}`}
                        >
                            <FiGrid />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 ${viewMode === 'list' ? 'bg-primary-green text-white' : 'bg-white text-gray-600'}`}
                        >
                            <FiList />
                        </button>
                    </div>
                    {/* Mobile filter toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 btn-secondary py-2 md:hidden"
                    >
                        <FiFilter /> Filters
                    </button>
                </div>
            </div>

            <div className="flex gap-8">
                {/* Sidebar Filters */}
                <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-64 flex-shrink-0`}>
                    <div className="bg-white rounded-xl shadow p-5 sticky top-24">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-gray-800">Filters</h3>
                            {hasActiveFilters && (
                                <button onClick={clearFilters} className="text-sm text-primary-green hover:underline flex items-center gap-1">
                                    <FiX size={14} /> Clear all
                                </button>
                            )}
                        </div>

                        {/* Categories */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Category</h4>
                            <div className="space-y-2">
                                {CATEGORIES.map((cat) => (
                                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(cat.id)}
                                            onChange={() => toggleCategory(cat.id)}
                                            className="accent-primary-green"
                                        />
                                        <span className="text-sm text-gray-700">{cat.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Max Price</h4>
                            <input
                                type="range"
                                min={0}
                                max={20000}
                                step={500}
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                className="w-full accent-primary-green"
                            />
                            <div className="flex justify-between text-sm text-gray-500 mt-1">
                                <span>KES 0</span>
                                <span>KES {priceRange[1].toLocaleString()}</span>
                            </div>
                        </div>

                        {/* In Stock */}
                        <div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={inStockOnly}
                                    onChange={(e) => setInStockOnly(e.target.checked)}
                                    className="accent-primary-green"
                                />
                                <span className="text-sm text-gray-700 font-medium">In stock only</span>
                            </label>
                        </div>
                    </div>
                </aside>

                {/* Product Grid / List */}
                <div className="flex-1">
                    {filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">No products match your filters.</p>
                            <button onClick={clearFilters} className="btn-primary mt-4">Clear Filters</button>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filtered.map((product) => (
                                <div key={product.id} className="bg-white rounded-xl shadow p-4 flex gap-4">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-primary-green font-medium">{product.categoryName}</p>
                                        <h3 className="font-semibold text-gray-800 mt-1">{product.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="text-lg font-bold text-primary-green">KES {product.price.toLocaleString()}</span>
                                            <span className={`text-xs px-2 py-1 rounded-full ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
