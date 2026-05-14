import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Footer = () => {
    const [email, setEmail] = useState('');

    const handleNewsletter = (e) => {
        e.preventDefault();
        toast.success('Subscribed! Check your email for confirmation.');
        setEmail('');
    };

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <span className="text-xl font-bold text-white">Comply Kenya</span>
                        </Link>
                        <p className="text-sm leading-relaxed mb-4">
                            Your trusted supplier for premium wood products — MDF boards, plywood, doors, flooring, and more. Delivered to all 47 counties.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { Icon: FiFacebook, href: 'https://facebook.com' },
                                { Icon: FiTwitter, href: 'https://twitter.com' },
                                { Icon: FiInstagram, href: 'https://instagram.com' },
                                { Icon: FiYoutube, href: 'https://youtube.com' },
                            ].map(({ Icon, href }, i) => (
                                <a
                                    key={i}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary-green transition"
                                >
                                    <Icon size={14} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/products', label: 'Products' },
                                { to: '/products?category=mdf-boards', label: 'MDF Boards' },
                                { to: '/products?category=plywood', label: 'Plywood' },
                                { to: '/products?category=doors', label: 'Doors' },
                                { to: '/products?category=flooring', label: 'Flooring' },
                                { to: '/about', label: 'About Us' },
                                { to: '/contact', label: 'Contact' },
                            ].map(({ to, label }) => (
                                <li key={to + label}>
                                    <Link to={to} className="hover:text-primary-green transition">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Customer Service</h4>
                        <ul className="space-y-2 text-sm">
                            {[
                                { to: '/account', label: 'My Account' },
                                { to: '/orders', label: 'Order History' },
                                { to: '/cart', label: 'Shopping Cart' },
                                { to: '/orders/track', label: 'Track Order' },
                                { to: '/contact', label: 'Returns & Refunds' },
                                { to: '/contact', label: 'Bulk Orders' },
                            ].map(({ to, label }) => (
                                <li key={label}>
                                    <Link to={to} className="hover:text-primary-green transition">{label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact + Newsletter */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Get In Touch</h4>
                        <ul className="space-y-3 text-sm mb-5">
                            <li className="flex items-start gap-2">
                                <FiMapPin className="mt-0.5 flex-shrink-0 text-primary-green" />
                                <span>Industrial Area, Nairobi, Kenya</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <FiPhone className="flex-shrink-0 text-primary-green" />
                                <a href="tel:+254700000000" className="hover:text-primary-green transition">+254 700 000 000</a>
                            </li>
                            <li className="flex items-center gap-2">
                                <FiMail className="flex-shrink-0 text-primary-green" />
                                <a href="mailto:info@complykenya.co.ke" className="hover:text-primary-green transition">info@complykenya.co.ke</a>
                            </li>
                        </ul>

                        <h4 className="text-white font-semibold mb-3 text-sm">Newsletter</h4>
                        <form onSubmit={handleNewsletter} className="flex gap-2">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email"
                                className="flex-1 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-primary-green"
                            />
                            <button type="submit" className="bg-primary-green text-white px-3 py-2 rounded-lg hover:bg-primary-dark transition text-sm font-medium">
                                Go
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-800">
                <div className="container-custom py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Comply Kenya Ltd. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link to="/privacy" className="hover:text-gray-300 transition">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-gray-300 transition">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
