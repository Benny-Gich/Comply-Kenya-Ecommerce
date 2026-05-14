import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiShoppingBag, FiSettings, FiLogOut, FiEdit2, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

const AccountDashboard = () => {
    const { user, orders, logout, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState('overview');
    const [editMode, setEditMode] = useState(false);
    const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '' });

    if (!user) {
        return (
            <div className="container-custom py-20 text-center">
                <p className="text-gray-500 mb-4">Please sign in to view your account.</p>
                <Link to="/login" className="btn-primary">Sign In</Link>
            </div>
        );
    }

    const handleSaveProfile = () => {
        updateProfile(profile);
        setEditMode(false);
        toast.success('Profile updated!');
    };

    const handleLogout = () => {
        logout();
        toast.success('Signed out');
        navigate('/');
    };

    const recentOrders = orders.filter((o) => o.userId === user.id).slice(0, 5);
    const userOrders = orders.filter((o) => o.userId === user.id);

    const TABS = [
        { id: 'overview', label: 'Overview', icon: FiUser },
        { id: 'orders', label: 'Orders', icon: FiShoppingBag },
        { id: 'profile', label: 'Profile', icon: FiSettings },
    ];

    return (
        <div className="container-custom py-10">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow p-5">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                            <div className="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                            </div>
                        </div>
                        <nav className="space-y-1">
                            {TABS.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setTab(id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${tab === id ? 'bg-primary-green text-white' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon size={16} /> {label}
                                </button>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition"
                            >
                                <FiLogOut size={16} /> Sign Out
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Overview */}
                    {tab === 'overview' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome, {user.name.split(' ')[0]}!</h2>
                            <div className="grid sm:grid-cols-3 gap-4 mb-8">
                                <div className="bg-white rounded-xl shadow p-5 text-center">
                                    <p className="text-3xl font-bold text-primary-green">{userOrders.length}</p>
                                    <p className="text-gray-500 text-sm mt-1">Total Orders</p>
                                </div>
                                <div className="bg-white rounded-xl shadow p-5 text-center">
                                    <p className="text-3xl font-bold text-primary-green">
                                        {userOrders.filter((o) => o.status === 'delivered').length}
                                    </p>
                                    <p className="text-gray-500 text-sm mt-1">Delivered</p>
                                </div>
                                <div className="bg-white rounded-xl shadow p-5 text-center">
                                    <p className="text-3xl font-bold text-primary-green">
                                        KES {userOrders.reduce((s, o) => s + (o.total || 0), 0).toLocaleString()}
                                    </p>
                                    <p className="text-gray-500 text-sm mt-1">Total Spent</p>
                                </div>
                            </div>

                            {recentOrders.length > 0 ? (
                                <div className="bg-white rounded-xl shadow p-5">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-gray-800">Recent Orders</h3>
                                        <button onClick={() => setTab('orders')} className="text-sm text-primary-green hover:underline">View all</button>
                                    </div>
                                    <div className="space-y-3">
                                        {recentOrders.map((order) => (
                                            <div key={order.id} className="flex justify-between items-center py-2 border-b last:border-0">
                                                <div>
                                                    <p className="font-medium text-sm text-gray-800">{order.id}</p>
                                                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                                                        {order.status}
                                                    </span>
                                                    <p className="text-sm font-bold text-gray-800 mt-1">KES {order.total?.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow p-10 text-center">
                                    <FiShoppingBag className="text-5xl text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No orders yet</p>
                                    <Link to="/products" className="btn-primary mt-4 inline-block">Start Shopping</Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Orders */}
                    {tab === 'orders' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
                            {userOrders.length === 0 ? (
                                <div className="bg-white rounded-xl shadow p-10 text-center">
                                    <p className="text-gray-500">No orders yet.</p>
                                    <Link to="/products" className="btn-primary mt-4 inline-block">Browse Products</Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {userOrders.map((order) => (
                                        <div key={order.id} className="bg-white rounded-xl shadow p-5">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <p className="font-bold text-gray-800">{order.id}</p>
                                                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                                                </div>
                                                <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600 mb-3">
                                                {order.items?.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-primary-green">KES {order.total?.toLocaleString()}</span>
                                                <Link to={`/orders/${order.id}/track`} className="text-sm text-primary-green hover:underline">Track Order →</Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Profile */}
                    {tab === 'profile' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
                                {!editMode ? (
                                    <button onClick={() => setEditMode(true)} className="btn-secondary flex items-center gap-2 py-2">
                                        <FiEdit2 size={14} /> Edit
                                    </button>
                                ) : (
                                    <button onClick={handleSaveProfile} className="btn-primary flex items-center gap-2 py-2">
                                        <FiCheck size={14} /> Save
                                    </button>
                                )}
                            </div>
                            <div className="bg-white rounded-xl shadow p-6 space-y-4">
                                {[
                                    { label: 'Full Name', key: 'name', type: 'text' },
                                    { label: 'Email Address', key: 'email', type: 'email' },
                                    { label: 'Phone Number', key: 'phone', type: 'tel' },
                                ].map(({ label, key, type }) => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                        {editMode ? (
                                            <input
                                                type={type}
                                                className="input-field"
                                                value={profile[key]}
                                                onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                                            />
                                        ) : (
                                            <p className="text-gray-800 py-2 px-3 bg-gray-50 rounded-lg">{user[key] || '—'}</p>
                                        )}
                                    </div>
                                ))}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                                    <p className="text-gray-800 py-2 px-3 bg-gray-50 rounded-lg">
                                        {new Date(user.createdAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountDashboard;
