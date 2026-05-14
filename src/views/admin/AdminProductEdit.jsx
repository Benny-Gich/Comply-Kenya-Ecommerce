import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import useAdminProducts from '../../viewModels/useProductsViewModel';
import { FiArrowLeft, FiPlus, FiTrash2, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EMPTY = {
    name: '', category: '', categoryName: '', price: '', originalPrice: '',
    image: '', stockQty: 0, inStock: true, description: '',
    specs: {}, variants: [],
};

const AdminProductEdit = () => {
    const { id } = useParams();
    const isNew = id === 'new';
    const navigate = useNavigate();
    const { products, categories, saveProduct } = useAdminProducts();

    const [form, setForm] = useState(EMPTY);
    const [specKey, setSpecKey] = useState('');
    const [specVal, setSpecVal] = useState('');
    const [variantLabel, setVariantLabel] = useState('');
    const [variantPrice, setVariantPrice] = useState('');
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isNew) {
            const product = products.find((p) => String(p.id) === String(id));
            if (product) {
                setForm({
                    ...product,
                    price: String(product.price),
                    originalPrice: String(product.originalPrice || ''),
                    specs: product.specs || {},
                    variants: product.variants || [],
                });
            } else {
                toast.error('Product not found');
                navigate('/admin/products');
            }
        }
    }, [id, isNew, products, navigate]);

    const set = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const handleCategoryChange = (catId) => {
        const cat = categories.find((c) => c.id === catId);
        setForm((prev) => ({ ...prev, category: catId, categoryName: cat?.name || catId }));
    };

    const addSpec = () => {
        if (!specKey.trim()) return;
        setForm((prev) => ({ ...prev, specs: { ...prev.specs, [specKey.trim()]: specVal.trim() } }));
        setSpecKey(''); setSpecVal('');
    };

    const removeSpec = (key) => {
        const s = { ...form.specs };
        delete s[key];
        setForm((prev) => ({ ...prev, specs: s }));
    };

    const addVariant = () => {
        if (!variantLabel.trim()) return;
        const variant = { label: variantLabel.trim(), price: variantPrice ? Number(variantPrice) : Number(form.price) };
        setForm((prev) => ({ ...prev, variants: [...prev.variants, variant] }));
        setVariantLabel(''); setVariantPrice('');
    };

    const removeVariant = (idx) => {
        setForm((prev) => ({ ...prev, variants: prev.variants.filter((_, i) => i !== idx) }));
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.category) e.category = 'Category is required';
        if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Enter a valid price';
        return e;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setSaving(true);
        const payload = {
            ...form,
            id: isNew ? undefined : form.id,
            price: Number(form.price),
            originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
            stockQty: Number(form.stockQty),
            inStock: Number(form.stockQty) > 0,
            rating: form.rating || 4.0,
            reviewCount: form.reviewCount || 0,
        };
        setTimeout(() => {
            saveProduct(payload);
            toast.success(isNew ? 'Product created!' : 'Product updated!');
            navigate('/admin/products');
        }, 400);
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-3">
                <Link to="/admin/products" className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
                    <FiArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{isNew ? 'New Product' : 'Edit Product'}</h1>
                    <p className="text-sm text-gray-500">{isNew ? 'Add a product to the catalog' : `Editing: ${form.name}`}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                    <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Basic Information</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                        <input
                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green/30 ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                            placeholder="e.g. MDF Board 18mm"
                            value={form.name}
                            onChange={(e) => set('name', e.target.value)}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                            <select
                                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green/30 ${errors.category ? 'border-red-400' : 'border-gray-200'}`}
                                value={form.category}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                            >
                                <option value="">Select category</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                            <input
                                type="number" min="0"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green/30"
                                value={form.stockQty}
                                onChange={(e) => set('stockQty', e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            rows={3}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green/30 resize-none"
                            placeholder="Product description..."
                            value={form.description}
                            onChange={(e) => set('description', e.target.value)}
                        />
                    </div>
                </section>

                {/* Pricing */}
                <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                    <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Pricing</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (KES) *</label>
                            <input
                                type="number" min="0"
                                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green/30 ${errors.price ? 'border-red-400' : 'border-gray-200'}`}
                                placeholder="e.g. 2500"
                                value={form.price}
                                onChange={(e) => set('price', e.target.value)}
                            />
                            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (KES) <span className="text-gray-400 font-normal">— optional</span></label>
                            <input
                                type="number" min="0"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green/30"
                                placeholder="e.g. 3000"
                                value={form.originalPrice}
                                onChange={(e) => set('originalPrice', e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {/* Image */}
                <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                    <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Image</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green/30"
                            placeholder="https://..."
                            value={form.image}
                            onChange={(e) => set('image', e.target.value)}
                        />
                    </div>
                    {form.image && (
                        <img src={form.image} alt="preview" className="w-24 h-24 rounded-lg object-cover border" onError={(e) => { e.target.style.display = 'none'; }} />
                    )}
                </section>

                {/* Variants */}
                <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                    <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Variants <span className="text-gray-400 font-normal normal-case">(e.g. sizes, grades)</span></h2>
                    <div className="flex gap-2">
                        <input
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green/30"
                            placeholder="Variant label (e.g. 18mm)"
                            value={variantLabel}
                            onChange={(e) => setVariantLabel(e.target.value)}
                        />
                        <input
                            type="number" min="0"
                            className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green/30"
                            placeholder="Price"
                            value={variantPrice}
                            onChange={(e) => setVariantPrice(e.target.value)}
                        />
                        <button type="button" onClick={addVariant} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
                            <FiPlus size={16} />
                        </button>
                    </div>
                    {form.variants.length > 0 && (
                        <div className="space-y-2">
                            {form.variants.map((v, i) => (
                                <div key={i} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                                    <span className="text-sm text-gray-700">{v.label}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-gray-800">KES {Number(v.price).toLocaleString()}</span>
                                        <button type="button" onClick={() => removeVariant(i)} className="text-red-400 hover:text-red-600">
                                            <FiTrash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Specs */}
                <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                    <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Specifications</h2>
                    <div className="flex gap-2">
                        <input
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                            placeholder="Key (e.g. Thickness)"
                            value={specKey}
                            onChange={(e) => setSpecKey(e.target.value)}
                        />
                        <input
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                            placeholder="Value (e.g. 18mm)"
                            value={specVal}
                            onChange={(e) => setSpecVal(e.target.value)}
                        />
                        <button type="button" onClick={addSpec} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
                            <FiPlus size={16} />
                        </button>
                    </div>
                    {Object.keys(form.specs).length > 0 && (
                        <div className="space-y-2">
                            {Object.entries(form.specs).map(([k, v]) => (
                                <div key={k} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                                    <span className="text-sm text-gray-500">{k}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-800">{v}</span>
                                        <button type="button" onClick={() => removeSpec(k)} className="text-red-400 hover:text-red-600">
                                            <FiTrash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Actions */}
                <div className="flex items-center gap-3 pb-6">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary-green text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-60"
                    >
                        <FiSave size={16} />
                        {saving ? 'Saving...' : isNew ? 'Create Product' : 'Save Changes'}
                    </button>
                    <Link to="/admin/products" className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default AdminProductEdit;
