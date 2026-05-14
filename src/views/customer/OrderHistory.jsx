import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiExternalLink } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

const OrderHistory = () => {
    const { user, orders } = useAuth();

    if (!user) {
        return (
            <div className="container-custom py-20 text-center">
                <p className="text-gray-500 mb-4">Please sign in to view your orders.</p>
                <Link to="/login" className="btn-primary">Sign In</Link>
            </div>
        );
    }

    return (
        <div className="container-custom py-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Order History</h1>

            {orders.length === 0 ? (
                <div className="text-center py-20">
                    <FiShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-2">No orders yet</p>
                    <p className="text-gray-400 text-sm mb-6">Your completed orders will appear here.</p>
                    <Link to="/products" className="btn-primary">Start Shopping</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl shadow p-5">
                            <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
                                <div>
                                    <p className="font-bold text-gray-800 text-lg">{order.id}</p>
                                    <p className="text-sm text-gray-500">
                                        Placed on {new Date(order.createdAt).toLocaleDateString('en-KE', {
                                            year: 'numeric', month: 'long', day: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div className="flex items-start sm:items-center gap-3">
                                    <span className={`text-xs px-3 py-1.5 rounded-full font-semibold capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                                        {order.status}
                                    </span>
                                    <Link
                                        to={`/orders/${order.id}/track`}
                                        className="text-sm text-primary-green hover:underline flex items-center gap-1"
                                    >
                                        Track <FiExternalLink size={13} />
                                    </Link>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {order.items?.map((item, i) => (
                                    <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">
                                        {item.name} ×{item.quantity}
                                    </span>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-center pt-3 border-t">
                                <div className="text-sm text-gray-500">
                                    {order.shipping?.city && <span>Delivered to {order.shipping.city}, {order.shipping.county}</span>}
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400">Total</p>
                                    <p className="font-bold text-primary-green">KES {order.total?.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
