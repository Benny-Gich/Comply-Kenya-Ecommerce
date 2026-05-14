import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    FiGrid, FiShoppingBag, FiLogOut, FiMenu, FiExternalLink, FiSettings,
    FiPackage, FiBarChart2, FiUsers, FiLayers,
} from 'react-icons/fi';
import { getAdminSession, clearAdminSession } from '../../services/adminAuth.service';

const NAV_GROUPS = [
    {
        label: 'Overview',
        items: [
            { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
            { to: '/admin/analytics', label: 'Analytics', icon: FiBarChart2, end: false },
        ],
    },
    {
        label: 'Catalog',
        items: [
            { to: '/admin/products', label: 'Products', icon: FiLayers, end: false },
            { to: '/admin/inventory', label: 'Inventory', icon: FiPackage, end: false },
        ],
    },
    {
        label: 'Operations',
        items: [
            { to: '/admin/orders', label: 'Orders', icon: FiShoppingBag, end: false },
            { to: '/admin/customers', label: 'Customers', icon: FiUsers, end: false },
        ],
    },
    {
        label: 'System',
        items: [
            { to: '/admin/settings', label: 'Settings', icon: FiSettings, end: false },
        ],
    },
];

const AdminLayout = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const session = getAdminSession();
    if (!session) {
        navigate('/admin/login', { replace: true });
        return null;
    }

    const handleLogout = () => {
        clearAdminSession();
        navigate('/admin/login');
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Brand */}
            <div className="px-6 py-5 border-b border-gray-700">
                <p className="text-xs text-gray-400 uppercase tracking-widest">Admin Panel</p>
                <p className="text-white font-bold text-lg leading-tight">Comply Kenya</p>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-4">
                {NAV_GROUPS.map(({ label, items }) => (
                    <div key={label}>
                        <p className="text-xs text-gray-500 uppercase tracking-widest px-4 mb-1">{label}</p>
                        {items.map(({ to, label: itemLabel, icon: Icon, end }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={end}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-primary-green text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`
                                }
                            >
                                <Icon size={18} />
                                {itemLabel}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            {/* Footer actions */}
            <div className="px-4 py-4 border-t border-gray-700 space-y-1">
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                    <FiExternalLink size={18} /> View Store
                </a>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-red-700 hover:text-white transition-colors"
                >
                    <FiLogOut size={18} /> Logout
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-gray-800 flex-shrink-0">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <aside className="relative w-64 h-full bg-gray-800 flex flex-col shadow-xl">
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
                    <button
                        className="lg:hidden p-1 rounded text-gray-600"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <FiMenu size={22} />
                    </button>
                    <div className="hidden lg:block" />
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-green text-white flex items-center justify-center text-sm font-bold">
                            {session.name ? session.name[0].toUpperCase() : 'A'}
                        </div>
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-medium text-gray-700 leading-tight">{session.name}</p>
                            <p className="text-xs text-gray-400 capitalize">{session.role}</p>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
