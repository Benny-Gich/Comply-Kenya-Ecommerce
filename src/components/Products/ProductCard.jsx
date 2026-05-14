import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
    };

    return (
        <Link to={`/products/${product.id}`} className="product-card group block">
            <div className="relative overflow-hidden rounded-t-xl bg-gray-100 aspect-square">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                        🪵
                    </div>
                )}
                {product.badge && (
                    <span className="absolute top-2 left-2 bg-primary-green text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                        {product.badge}
                    </span>
                )}
            </div>

            <div className="p-4">
                <p className="text-xs text-gray-500 mb-1 capitalize">{product.category?.replace('-', ' ')}</p>
                <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-1 line-clamp-2">{product.name}</h3>

                {product.rating && (
                    <div className="flex items-center gap-1 mb-2">
                        <FiStar size={12} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-gray-500">{product.rating} ({product.reviews ?? 0})</span>
                    </div>
                )}

                <div className="flex items-center justify-between mt-2">
                    <div>
                        <span className="text-primary-green font-bold text-sm">
                            KSh {product.price?.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                            <span className="text-gray-400 text-xs line-through ml-1">
                                KSh {product.originalPrice?.toLocaleString()}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="p-2 rounded-lg bg-primary-green text-white hover:bg-primary-dark transition"
                        title="Add to cart"
                    >
                        <FiShoppingCart size={14} />
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
