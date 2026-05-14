import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const NAV_LINKS = [
    { to: '/', label: 'Home', end: true },
    { to: '/products', label: 'Products' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
];

const Header = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate('/products?search=' + encodeURIComponent(searchQuery.trim()));
            setSearchQuery('');
            setMobileOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileOpen(false);
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container-custom">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="text-xl font-bold text-primary-green">Comply Kenya</Link>

                    <nav className="hidden md:flex items-center gap-6">
                        {NAV_LINKS.map(({ to, label, end }) => (
                            <NavLink key={to} to={to} end={end} className={({ isActive }) =>
                                'text-sm font-medium transition ' + (isActive ? 'text-primary-green' : 'text-gray-700 hover:text-primary-green')
                            }>{label}</NavLink>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-3">
                        <form onSubmit={handleSearch} className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..." className="text-sm px-3 py-1.5 outline-none w-44" />
                            <button type="submit" className="px-2 py-1.5 text-gray-500 hover:text-primary-green"><FiSearch size={16} /></button>
                        </form>
                        <Link to="/cart" className="relative text-gray-700 hover:text-primary-green transition">
                            <FiShoppingCart size={20} />
                            {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-primary-green text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
                        </Link>
                        {user ? (
                            <div className="flex items-center gap-2">
                                <Link to="/account" className="text-sm font-medium text-gray-700 hover:text-primary-green transition flex items-center gap-1"><FiUser size={16} />{user.name?.split(' ')[0]}</Link>
                                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition" title="Logout"><FiLogOut size={16} /></button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn-primary py-1.5 px-4 text-sm">Login</Link>
                        )}
                    </div>

                    <button className="md:hidden text-gray-700" onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>

                {mobileOpen && (
                    <div className="md:hidden border-t border-gray-100 py-4 space-y-3">
                        <form onSubmit={handleSearch} className="flex items-center border border-gray-200 rounded-lg overflow-hidden mx-1">
                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..." className="text-sm px-3 py-2 outline-none flex-1" />
                            <button type="submit" className="px-3 py-2 text-gray-500"><FiSearch size={16} /></button>
                        </form>
                        {NAV_LINKS.map(({ to, label, end }) => (
                            <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)}
                                className={({ isActive }) => 'block px-2 py-1.5 text-sm font-medium ' + (isActive ? 'text-primary-green' : 'text-gray-700')
                                }>{label}</NavLink>
                        ))}
                        <div className="flex items-center gap-4 px-2 pt-2 border-t border-gray-100">
                            <Link to="/cart" onClick={() => setMobileOpen(false)} className="relative text-gray-700">
                                <FiShoppingCart size={20} />
                                {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-primary-green text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
                            </Link>
                            {user ? (
                                <>
                                    <Link to="/account" onClick={() => setMobileOpen(false)} className="text-sm text-gray-700 flex items-center gap-1"><FiUser size={16} />{user.name?.split(' ')[0]}</Link>
                                    <button onClick={handleLogout} className="text-sm text-red-500 flex items-center gap-1"><FiLogOut size={14} />Logout</button>
                                </>
                            ) : (
                                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-primary-green">Login / Register</Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;