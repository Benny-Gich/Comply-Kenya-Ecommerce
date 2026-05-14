import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiCheck, FiLock } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Nyeri',
  'Meru', 'Kisii', 'Machakos', 'Kakamega', 'Embu', 'Garissa', 'Kitale',
  'Malindi', 'Lamu', 'Isiolo', 'Marsabit', 'Wajir', 'Mandera',
];

const STEPS = ['Shipping', 'Payment', 'Review'];

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const { user, addOrder } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [shipping, setShipping] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    county: 'Nairobi',
    notes: '',
  });

  const [payment, setPayment] = useState({ method: 'mpesa', mpesaPhone: user?.phone || '' });

  const delivery = total >= 10000 ? 0 : 500;
  const grandTotal = total + delivery;

  if (cart.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link to="/products" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(1);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePlaceOrder = () => {
    setLoading(true);
    setTimeout(() => {
      const order = addOrder({
        items: cart,
        shipping,
        payment,
        subtotal: total,
        delivery,
        total: grandTotal,
      });
      clearCart();
      setLoading(false);
      toast.success('Order placed successfully!');
      navigate(`/orders/${order.id}/track`);
    }, 1800);
  };

  return (
    <div className="container-custom py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      {/* Step indicator */}
      <div className="flex items-center mb-10">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i < step ? 'bg-primary-green text-white' :
                  i === step ? 'bg-primary-green text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                {i < step ? <FiCheck /> : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:inline ${i === step ? 'text-primary-green' : 'text-gray-500'}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 ${i < step ? 'bg-primary-green' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 0 – Shipping */}
          {step === 0 && (
            <form onSubmit={handleShippingSubmit} className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-5">Shipping Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name *</label>
                  <input className="input-field" required value={shipping.firstName} onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name *</label>
                  <input className="input-field" required value={shipping.lastName} onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input type="email" className="input-field" required value={shipping.email} onChange={(e) => setShipping({ ...shipping, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone *</label>
                  <input type="tel" className="input-field" required placeholder="07XXXXXXXX" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Delivery Address *</label>
                  <input className="input-field" required placeholder="Street, building, house/apt number" value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Town / City *</label>
                  <input className="input-field" required value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">County *</label>
                  <select className="input-field" value={shipping.county} onChange={(e) => setShipping({ ...shipping, county: e.target.value })}>
                    {COUNTIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Order Notes</label>
                  <textarea className="input-field" rows={2} placeholder="Any special instructions..." value={shipping.notes} onChange={(e) => setShipping({ ...shipping, notes: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn-primary mt-6">Continue to Payment</button>
            </form>
          )}

          {/* Step 1 – Payment */}
          {step === 1 && (
            <form onSubmit={handlePaymentSubmit} className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-5">Payment Method</h2>
              <div className="space-y-3 mb-6">
                {[
                  { id: 'mpesa', label: 'M-Pesa', desc: 'Pay via Safaricom M-Pesa STK push' },
                  { id: 'card', label: 'Card (Paystack)', desc: 'Visa, Mastercard, Debit cards' },
                  { id: 'bank', label: 'Bank Transfer', desc: 'Direct bank deposit – details sent by email' },
                  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives (Nairobi only)' },
                ].map((m) => (
                  <label key={m.id} className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${payment.method === m.id ? 'border-primary-green bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" value={m.id} checked={payment.method === m.id} onChange={() => setPayment({ ...payment, method: m.id })} className="mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-800">{m.label}</p>
                      <p className="text-sm text-gray-500">{m.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              {payment.method === 'mpesa' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">M-Pesa Phone Number *</label>
                  <input
                    type="tel"
                    className="input-field max-w-xs"
                    required
                    placeholder="07XXXXXXXX"
                    value={payment.mpesaPhone}
                    onChange={(e) => setPayment({ ...payment, mpesaPhone: e.target.value })}
                  />
                </div>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(0)} className="btn-secondary">Back</button>
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <FiLock size={14} /> Review Order
                </button>
              </div>
            </form>
          )}

          {/* Step 2 – Review */}
          {step === 2 && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-5">Review Your Order</h2>
              <div className="mb-5 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Shipping to</h3>
                <p className="text-sm text-gray-600">{shipping.firstName} {shipping.lastName}</p>
                <p className="text-sm text-gray-600">{shipping.address}, {shipping.city}, {shipping.county}</p>
                <p className="text-sm text-gray-600">{shipping.phone} · {shipping.email}</p>
              </div>
              <div className="mb-5 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-1">Payment</h3>
                <p className="text-sm text-gray-600 capitalize">{payment.method}{payment.method === 'mpesa' ? ` – ${payment.mpesaPhone}` : ''}</p>
              </div>
              <div className="space-y-2 mb-5">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.name} × {item.quantity}</span>
                    <span className="font-medium">KES {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary">Back</button>
                <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1">
                  {loading ? 'Placing Order...' : `Place Order – KES ${grandTotal.toLocaleString()}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-xl shadow p-5 sticky top-24">
            <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-gray-600">
                  <span className="truncate max-w-[160px]">{item.name} ×{item.quantity}</span>
                  <span>KES {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-1 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>KES {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>{delivery === 0 ? 'Free' : `KES ${delivery.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t">
                <span>Total</span><span>KES {grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
