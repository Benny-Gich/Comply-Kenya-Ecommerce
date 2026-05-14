import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiPackage, FiCheckCircle, FiClock, FiTruck, FiHome } from 'react-icons/fi';
import { motion } from 'framer-motion';

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: FiClock },
  { key: 'confirmed', label: 'Confirmed', icon: FiCheckCircle },
  { key: 'processing', label: 'Processing', icon: FiPackage },
  { key: 'shipped', label: 'Shipped', icon: FiTruck },
  { key: 'delivered', label: 'Delivered', icon: FiHome },
];

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const findOrder = (id) => {
  try {
    const orders = JSON.parse(localStorage.getItem('complyOrders') || '[]');
    return orders.find((o) => o.id === id) || null;
  } catch {
    return null;
  }
};

const OrderTracking = () => {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState(orderId || '');
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Auto-track if orderId supplied via URL
  useEffect(() => {
    if (orderId) {
      const found = findOrder(orderId);
      if (found) setOrder(found);
      else setNotFound(true);
    }
  }, [orderId]);

  const handleTrackOrder = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setNotFound(false);
    setTimeout(() => {
      const found = findOrder(trackingNumber.trim());
      if (found) {
        setOrder(found);
      } else {
        setNotFound(true);
        setOrder(null);
      }
      setIsLoading(false);
    }, 600);
  };

  const currentStepIndex = order
    ? STATUS_STEPS.findIndex((s) => s.key === order.status)
    : -1;

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleString('en-KE', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>

      {!order ? (
        <form onSubmit={handleTrackOrder} className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="block text-sm font-medium mb-2">
              Order Number / Tracking ID
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="input-field mb-2"
              placeholder="e.g., ORD-1234567890"
              required
            />
            {notFound && (
              <p className="text-red-500 text-sm mb-2">Order not found. Please check the order ID.</p>
            )}
            <button
              type="submit"
              className="btn-primary w-full mt-3"
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Track Order'}
            </button>
          </div>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          {/* Header */}
          <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="text-xl font-bold text-gray-800">{order.id}</p>
              <p className="text-sm text-gray-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
              {order.status}
            </span>
          </div>

          {/* Progress Steps */}
          {order.status !== 'cancelled' && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="font-semibold text-gray-700 mb-6">Order Progress</h2>
              <div className="flex items-center">
                {STATUS_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const done = idx <= currentStepIndex;
                  const active = idx === currentStepIndex;
                  return (
                    <React.Fragment key={step.key}>
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${done ? 'bg-primary-green border-primary-green text-white' : 'bg-white border-gray-200 text-gray-400'} ${active ? 'ring-4 ring-green-100' : ''}`}>
                          <Icon size={18} />
                        </div>
                        <span className={`text-xs mt-2 text-center max-w-[60px] leading-tight ${done ? 'text-primary-green font-medium' : 'text-gray-400'}`}>
                          {step.label}
                        </span>
                      </div>
                      {idx < STATUS_STEPS.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1 ${idx < currentStepIndex ? 'bg-primary-green' : 'bg-gray-200'}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}

          {/* Status History */}
          <div className="bg-white rounded-xl shadow p-6">
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
              <p className="text-gray-500 text-sm">No status history available.</p>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-semibold text-gray-700 mb-4">Order Items</h2>
            <div className="divide-y">
              {(order.items || []).map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 gap-4">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">KES {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t mt-2 flex justify-between font-bold text-gray-800">
              <span>Total</span>
              <span>KES {(order.total || 0).toLocaleString()}</span>
            </div>
          </div>

          {/* Delivery Address */}
          {order.shipping && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="font-semibold text-gray-700 mb-3">Delivery Address</h2>
              <p className="text-gray-800">{order.shipping.firstName} {order.shipping.lastName}</p>
              <p className="text-gray-600 text-sm">{order.shipping.address}, {order.shipping.city}, {order.shipping.county}</p>
              <p className="text-gray-600 text-sm">{order.shipping.phone}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button onClick={() => { setOrder(null); setTrackingNumber(''); }} className="btn-secondary">
              ← Track Another Order
            </button>
            <Link to="/orders" className="btn-primary">View All Orders</Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OrderTracking;