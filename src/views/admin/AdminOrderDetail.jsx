import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useAdminOrders from '../../viewModels/useOrdersViewModel';
import toast from 'react-hot-toast';
import {
    FiArrowLeft, FiClock, FiCheckCircle, FiPackage, FiTruck, FiHome, FiXCircle,
} from 'react-icons/fi';

const STATUS_FLOW = [
    { key: 'pending', label: 'Pending', icon: FiClock, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { key: 'confirmed', label: 'Confirmed', icon: FiCheckCircle, color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { key: 'processing', label: 'Processing', icon: FiPackage, color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { key: 'shipped', label: 'Shipped', icon: FiTruck, color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { key: 'delivered', label: 'Delivered', icon: FiHome, color: 'bg-green-100 text-green-800 border-green-200' },
];

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

const NEXT_STATUS = {
    pending: 'confirmed',
    confirmed: 'processing',
    processing: 'shipped',
    shipped: 'delivered',
};

const NOTE_DEFAULTS = {
    confirmed: 'Order confirmed and payment verified by admin.',
    processing: 'Order is being packaged for dispatch.',
    shipped: 'Order dispatched via courier. Out for delivery.',
    delivered: 'Order successfully delivered to customer.',
    cancelled: 'Order has been cancelled.',
};

const AdminOrderDetail = () => {
    const { id } = useParams();
    const { orders, updateOrderStatus } = useAdminOrders();
    const navigate = useNavigate();

    const order = orders.find((o) => o.id === id);
    const [statusNote, setStatusNote] = useState('');
    const [updating, setUpdating] = useState(false);

    if (!order) {
        return (
            <div className="text-center py-20 text-gray-400">
                <p className="text-lg font-medium">Order not found.</p>
                <Link to="/admin/orders" className="text-primary-green hover:underline mt-2 inline-block">
                    ← Back to Orders
                </Link>
            </div>
        );
    }

    const nextStatus = NEXT_STATUS[order.status];
    const isFinal = order.status === 'delivered' || order.status === 'cancelled';

    const handleAdvance = () => {
        if (!nextStatus) return;
        setUpdating(true);
        setTimeout(() => {
            const note = statusNote.trim() || NOTE_DEFAULTS[nextStatus] || '';
            updateOrderStatus(order.id, nextStatus, note);
            toast.success(`Order moved to "${nextStatus}"`);
            setStatusNote('');
            setUpdating(false);
        }, 500);
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            setUpdating(true);
            setTimeout(() => {
                updateOrderStatus(order.id, 'cancelled', statusNote.trim() || NOTE_DEFAULTS.cancelled);
                toast.success('Order cancelled.');
                setStatusNote('');
                setUpdating(false);
            }, 400);
        }
    };

    const formatDate = (iso) =>
        new Date(iso).toLocaleString('en-KE', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });

    const currentStepIdx = STATUS_FLOW.findIndex((s) => s.key === order.status);

    return (
        <div className="space-y-6 max-w-5xl">
            {/* Back + Header */}
            <div className="flex items-center gap-3">
                <button onClick={() => navigate('/admin/orders')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                    <FiArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-800">{order.id}</h1>
                    <p className="text-sm text-gray-400">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <span className={`ml-auto px-3 py-1 rounded-full text-sm font-semibold capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                    {order.status}
                </span>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left column: order info */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Progress bar */}
                    {order.status !== 'cancelled' && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="font-semibold text-gray-700 mb-5">Order Progress</h2>
                            <div className="flex items-center">
                                {STATUS_FLOW.map((step, idx) => {
                                    const Icon = step.icon;
                                    const done = idx <= currentStepIdx;
                                    const active = idx === currentStepIdx;
                                    return (
                                        <React.Fragment key={step.key}>
                                            <div className="flex flex-col items-center flex-shrink-0">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${done ? 'bg-primary-green border-primary-green text-white' : 'bg-white border-gray-200 text-gray-400'} ${active ? 'ring-4 ring-green-100' : ''}`}>
                                                    <Icon size={18} />
                                                </div>
                                                <span className={`text-xs mt-1.5 text-center max-w-[56px] leading-tight ${done ? 'text-primary-green font-medium' : 'text-gray-400'}`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                            {idx < STATUS_FLOW.length - 1 && (
                                                <div className={`flex-1 h-0.5 mx-1 ${idx < currentStepIdx ? 'bg-primary-green' : 'bg-gray-200'}`} />
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Order Items */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="font-semibold text-gray-700 mb-4">Items Ordered</h2>
                        <div className="divide-y">
                            {(order.items || []).map((item) => (
                                <div key={item.id} className="flex items-center gap-4 py-3">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-400">{item.category} · Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-800">KES {(item.price * item.quantity).toLocaleString()}</p>
                                        <p className="text-xs text-gray-400">@ KES {item.price.toLocaleString()} each</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 border-t mt-2 space-y-1">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>KES {(order.subtotal || order.total || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Delivery</span>
                                <span>{order.delivery === 0 ? 'Free' : `KES ${order.delivery?.toLocaleString()}`}</span>
                            </div>
                            <div className="flex justify-between font-bold text-gray-800 pt-1 border-t">
                                <span>Total</span>
                                <span>KES {(order.total || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status History */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="font-semibold text-gray-700 mb-4">Status History</h2>
                        {(order.statusHistory && order.statusHistory.length > 0) ? (
                            <div className="relative pl-6">
                                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200" />
                                {[...order.statusHistory].reverse().map((event, idx) => (
                                    <div key={idx} className="relative mb-5 last:mb-0">
                                        <div className="absolute -left-4 top-1 w-3 h-3 rounded-full bg-primary-green border-2 border-white shadow" />
                                        <p className="text-xs text-gray-400">{formatDate(event.timestamp)}</p>
                                        <p className="font-medium text-gray-800 capitalize">{event.status}</p>
                                        {event.note && <p className="text-sm text-gray-500">{event.note}</p>}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">No history recorded.</p>
                        )}
                    </div>
                </div>

                {/* Right column: customer + actions */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="font-semibold text-gray-700 mb-4">Customer</h2>
                        <div className="space-y-1.5 text-sm">
                            <p className="font-medium text-gray-800 text-base">
                                {order.shipping?.firstName} {order.shipping?.lastName}
                            </p>
                            <p className="text-gray-500">{order.shipping?.email}</p>
                            <p className="text-gray-500">{order.shipping?.phone}</p>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="font-semibold text-gray-700 mb-3">Delivery Address</h2>
                        <div className="text-sm text-gray-600 space-y-0.5">
                            <p>{order.shipping?.address}</p>
                            <p>{order.shipping?.city}, {order.shipping?.county}</p>
                            {order.shipping?.notes && (
                                <p className="text-gray-400 italic mt-2">Note: {order.shipping.notes}</p>
                            )}
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="font-semibold text-gray-700 mb-3">Payment</h2>
                        <p className="text-sm text-gray-600 capitalize">{order.payment?.method || '—'}</p>
                        {order.payment?.method === 'mpesa' && order.payment?.mpesaPhone && (
                            <p className="text-sm text-gray-500">M-Pesa: {order.payment.mpesaPhone}</p>
                        )}
                    </div>

                    {/* Update Status */}
                    {!isFinal && (
                        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                            <h2 className="font-semibold text-gray-700">Update Status</h2>

                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">
                                    Internal Note (optional)
                                </label>
                                <textarea
                                    rows={2}
                                    className="input-field text-sm"
                                    placeholder={NOTE_DEFAULTS[nextStatus] || 'Add a note...'}
                                    value={statusNote}
                                    onChange={(e) => setStatusNote(e.target.value)}
                                />
                            </div>

                            {nextStatus && (
                                <button
                                    onClick={handleAdvance}
                                    disabled={updating}
                                    className="w-full btn-primary text-sm py-2.5 capitalize"
                                >
                                    {updating ? 'Updating...' : `Mark as "${nextStatus}" →`}
                                </button>
                            )}

                            <button
                                onClick={handleCancel}
                                disabled={updating}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
                            >
                                <FiXCircle size={16} /> Cancel Order
                            </button>
                        </div>
                    )}

                    {isFinal && (
                        <div className={`rounded-xl p-4 text-center text-sm font-medium border ${order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                            Order {order.status === 'delivered' ? 'successfully delivered ✓' : 'has been cancelled'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetail;
