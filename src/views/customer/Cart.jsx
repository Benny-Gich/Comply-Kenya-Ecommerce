import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import toast from 'react-hot-toast';

const Cart = () => {
    const { cart, total, removeFromCart, updateQuantity } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="container-custom py-20 text-center">
                <FiShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">Browse our products and add items to your cart.</p>
                <Link to="/products" className="btn-primary">Shop Now</Link>
            </div>
        );
    }

    const delivery = total >= 10000 ? 0 : 500;
    const grandTotal = total + delivery;

    return (
        <div className="container-custom py-10">
            <div className="flex items-center gap-3 mb-8">
                <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-primary-green">
                    <FiArrowLeft className="text-xl" />
                </button>
                <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
                <span className="bg-primary-green text-white text-sm rounded-full px-2 py-0.5">{cart.length}</span>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow p-4 flex gap-4">
                            <Link to={`/products/${item.id}`}>
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/96x96?text=Item'; }}
                                />
                            </Link>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs text-primary-green">{item.categoryName || item.category}</p>
                                        <Link to={`/products/${item.id}`} className="font-semibold text-gray-800 hover:text-primary-green">
                                            {item.name}
                                        </Link>
                                    </div>
                                    <button
                                        onClick={() => { removeFromCart(item.id); toast.success('Item removed'); }}
                                        className="text-red-400 hover:text-red-600 ml-2"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                        >−</button>
                                        <span className="px-3 py-1 font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                        >+</button>
                                    </div>
                                    <span className="font-bold text-primary-green">
                                        KES {(item.price * item.quantity).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div>
                    <div className="bg-white rounded-xl shadow p-6 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-800 mb-5">Order Summary</h2>
                        <div className="space-y-3 text-sm mb-5">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                                <span>KES {total.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery</span>
                                <span>{delivery === 0 ? <span className="text-green-600 font-medium">Free</span> : `KES ${delivery.toLocaleString()}`}</span>
                            </div>
                            {delivery > 0 && (
                                <p className="text-xs text-gray-400">Free delivery on orders above KES 10,000</p>
                            )}
                            <div className="border-t pt-3 flex justify-between font-bold text-gray-800 text-base">
                                <span>Total</span>
                                <span>KES {grandTotal.toLocaleString()}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/checkout')}
                            className="btn-primary w-full text-center"
                        >
                            Proceed to Checkout
                        </button>
                        <Link to="/products" className="block text-center mt-3 text-sm text-primary-green hover:underline">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
