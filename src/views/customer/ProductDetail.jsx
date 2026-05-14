import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiCheck, FiPackage, FiTruck } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { getProductById, PRODUCTS } from '../../models/products.model';
import { useCart } from '../../contexts/CartContext';
import ProductCard from '../../components/Products/ProductCard';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const product = getProductById(id);

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    if (!product) {
        return (
            <div className="container-custom py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
                <Link to="/products" className="btn-primary">Browse Products</Link>
            </div>
        );
    }

    const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        toast.success(`${product.name} added to cart!`);
    };

    const handleBuyNow = () => {
        addToCart(product, quantity);
        navigate('/cart');
    };

    return (
        <div className="container-custom py-10">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
                <Link to="/" className="hover:text-primary-green">Home</Link>
                <span>/</span>
                <Link to="/products" className="hover:text-primary-green">Products</Link>
                <span>/</span>
                <Link to={`/products?category=${product.category}`} className="hover:text-primary-green">{product.categoryName}</Link>
                <span>/</span>
                <span className="text-gray-800 truncate max-w-xs">{product.name}</span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-10 mb-16">
                {/* Images */}
                <div>
                    <motion.div
                        key={selectedImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-gray-100 rounded-2xl overflow-hidden mb-3"
                    >
                        <img
                            src={product.images[selectedImage]}
                            alt={product.name}
                            className="w-full h-96 object-cover"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/600x500?text=' + encodeURIComponent(product.name); }}
                        />
                    </motion.div>
                    {product.images.length > 1 && (
                        <div className="flex gap-2">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${idx === selectedImage ? 'border-primary-green' : 'border-transparent'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div>
                    <p className="text-sm text-primary-green font-medium mb-1">{product.categoryName}</p>
                    <h1 className="text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <FiStar key={i} className={i < Math.floor(product.rating) ? 'fill-current' : ''} />
                            ))}
                        </div>
                        <span className="text-sm text-gray-500">{product.rating} ({product.reviewCount} reviews)</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-3 mb-5">
                        <span className="text-3xl font-bold text-primary-green">KES {product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                            <>
                                <span className="text-lg text-gray-400 line-through">KES {product.originalPrice.toLocaleString()}</span>
                                <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-0.5 rounded">
                                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                                </span>
                            </>
                        )}
                    </div>

                    {/* Stock */}
                    <div className="flex items-center gap-2 mb-6">
                        {product.inStock ? (
                            <>
                                <FiCheck className="text-green-500" />
                                <span className="text-green-600 font-medium">In Stock ({product.stockQty} available)</span>
                            </>
                        ) : (
                            <span className="text-red-500 font-medium">Out of Stock</span>
                        )}
                    </div>

                    {/* Quantity + CTA */}
                    {product.inStock && (
                        <>
                            <div className="flex items-center gap-4 mb-4">
                                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                                    >−</button>
                                    <span className="px-4 py-2 font-semibold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity((q) => Math.min(product.stockQty, q + 1))}
                                        className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                                    >+</button>
                                </div>
                            </div>
                            <div className="flex gap-3 mb-6">
                                <button onClick={handleAddToCart} className="btn-secondary flex items-center gap-2 flex-1">
                                    <FiShoppingCart /> Add to Cart
                                </button>
                                <button onClick={handleBuyNow} className="btn-primary flex-1">
                                    Buy Now
                                </button>
                            </div>
                        </>
                    )}

                    {/* Trust badges */}
                    <div className="grid grid-cols-2 gap-3 border-t pt-5">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiTruck className="text-primary-green text-xl flex-shrink-0" />
                            <span>Nationwide delivery across all 47 counties</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiPackage className="text-primary-green text-xl flex-shrink-0" />
                            <span>Secure packaging & bulk order discounts available</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-12">
                <div className="flex border-b mb-6">
                    {['description', 'specifications', 'reviews'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-medium capitalize transition border-b-2 -mb-px ${activeTab === tab ? 'border-primary-green text-primary-green' : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === 'description' && (
                    <p className="text-gray-600 leading-relaxed max-w-3xl">{product.description}</p>
                )}

                {activeTab === 'specifications' && (
                    <div className="max-w-xl">
                        <table className="w-full text-sm">
                            <tbody>
                                {Object.entries(product.specs).map(([key, val]) => (
                                    <tr key={key} className="border-b">
                                        <td className="py-3 pr-4 font-medium text-gray-700 w-40">{key}</td>
                                        <td className="py-3 text-gray-600">{val}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary-green">{product.rating}</div>
                                <div className="flex text-yellow-400 justify-center mt-1">
                                    {[...Array(5)].map((_, i) => <FiStar key={i} className={i < Math.floor(product.rating) ? 'fill-current' : ''} />)}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">{product.reviewCount} reviews</div>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm">Full review system coming soon.</p>
                    </div>
                )}
            </div>

            {/* Related Products */}
            {related.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {related.map((p) => <ProductCard key={p.id} product={p} />)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
