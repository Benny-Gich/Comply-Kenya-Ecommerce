import React, { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            toast.success('Message sent! We\'ll get back to you within 24 hours.');
            setForm({ name: '', email: '', phone: '', subject: '', message: '' });
            setLoading(false);
        }, 1200);
    };

    const f = (key) => ({
        value: form[key],
        onChange: (e) => setForm({ ...form, [key]: e.target.value }),
    });

    return (
        <div>
            {/* Hero */}
            <section className="bg-gradient-to-r from-primary-dark to-primary-green text-white py-16">
                <div className="container-custom text-center">
                    <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
                    <p className="text-gray-100 text-lg">We're here to help. Reach us by phone, email, or the form below.</p>
                </div>
            </section>

            <section className="py-16">
                <div className="container-custom grid lg:grid-cols-3 gap-10">
                    {/* Info */}
                    <div className="space-y-6">
                        {[
                            {
                                icon: FiPhone,
                                title: 'Phone',
                                lines: ['+254 700 000 000', '+254 722 000 000'],
                                href: 'tel:+254700000000',
                            },
                            {
                                icon: FiMail,
                                title: 'Email',
                                lines: ['info@complykenya.co.ke', 'sales@complykenya.co.ke'],
                                href: 'mailto:info@complykenya.co.ke',
                            },
                            {
                                icon: FiMapPin,
                                title: 'Location',
                                lines: ['Plot 45, Industrial Area Road', 'Nairobi, Kenya'],
                            },
                            {
                                icon: FiClock,
                                title: 'Working Hours',
                                lines: ['Mon – Fri: 8:00 AM – 6:00 PM', 'Sat: 9:00 AM – 4:00 PM'],
                            },
                        ].map(({ icon: Icon, title, lines, href }) => (
                            <div key={title} className="flex gap-4">
                                <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Icon className="text-primary-green text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
                                    {lines.map((line, i) => (
                                        <p key={i} className="text-gray-500 text-sm">
                                            {href && i === 0 ? <a href={href} className="hover:text-primary-green transition">{line}</a> : line}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
                            <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Your Name *</label>
                                    <input className="input-field" required placeholder="John Kamau" {...f('name')} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email Address *</label>
                                    <input type="email" className="input-field" required placeholder="you@example.com" {...f('email')} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                                    <input type="tel" className="input-field" placeholder="07XXXXXXXX" {...f('phone')} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Subject *</label>
                                    <select className="input-field" required {...f('subject')}>
                                        <option value="">Select subject</option>
                                        <option>Product Enquiry</option>
                                        <option>Bulk Order Request</option>
                                        <option>Order Issue</option>
                                        <option>Delivery Enquiry</option>
                                        <option>General Enquiry</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-5">
                                <label className="block text-sm font-medium mb-1">Message *</label>
                                <textarea
                                    className="input-field"
                                    rows={5}
                                    required
                                    placeholder="Describe your inquiry in detail..."
                                    {...f('message')}
                                />
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                                <FiSend size={15} />
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Map placeholder */}
            <section className="h-64 bg-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <FiMapPin className="text-4xl mx-auto mb-2" />
                    <p>Industrial Area, Nairobi — Google Maps embed here</p>
                </div>
            </section>
        </div>
    );
};

export default Contact;
