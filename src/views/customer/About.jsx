import React from 'react';
import { Link } from 'react-router-dom';
import { FiAward, FiUsers, FiTruck, FiStar } from 'react-icons/fi';

const STATS = [
    { icon: FiUsers, value: '5,000+', label: 'Happy Customers' },
    { icon: FiAward, value: '10+ Years', label: 'Industry Experience' },
    { icon: FiTruck, value: '47 Counties', label: 'Nationwide Delivery' },
    { icon: FiStar, value: '4.8/5', label: 'Average Rating' },
];

const TEAM = [
    { name: 'James Mwangi', role: 'CEO & Founder', initials: 'JM' },
    { name: 'Grace Wanjiru', role: 'Head of Operations', initials: 'GW' },
    { name: 'Peter Otieno', role: 'Sales Director', initials: 'PO' },
    { name: 'Faith Kamau', role: 'Customer Experience', initials: 'FK' },
];

const About = () => {
    return (
        <div>
            {/* Hero */}
            <section className="bg-gradient-to-r from-primary-dark to-primary-green text-white py-20">
                <div className="container-custom text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">About Comply Kenya</h1>
                    <p className="text-xl text-gray-100 max-w-2xl mx-auto">
                        Kenya's leading supplier of premium wood products since 2014 — quality you can build on.
                    </p>
                </div>
            </section>

            {/* Story */}
            <section className="py-16">
                <div className="container-custom grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Comply Kenya was founded in 2014 with a simple mission: to provide builders, contractors, interior designers, and homeowners across Kenya with access to world-class wood products at fair prices.
                        </p>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Starting from a small warehouse in Nairobi's Industrial Area, we've grown to serve customers in all 47 counties. Our product range spans MDF boards, plywood, timber, doors, flooring, and hardware — all sourced from certified, sustainable suppliers.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Today, with over 5,000 satisfied customers and a team of passionate professionals, we continue to set the standard for quality and reliability in Kenya's wood products market.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {STATS.map(({ icon: Icon, value, label }) => (
                            <div key={label} className="bg-gray-50 rounded-2xl p-6 text-center">
                                <Icon className="text-3xl text-primary-green mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-800">{value}</p>
                                <p className="text-sm text-gray-500">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="py-16 bg-gray-50">
                <div className="container-custom text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission & Values</h2>
                    <div className="grid sm:grid-cols-3 gap-6">
                        {[
                            { title: 'Quality First', desc: 'Every product is inspected to meet international standards before it reaches you.' },
                            { title: 'Customer Focus', desc: 'Your project success is our success. We go the extra mile to deliver on time, every time.' },
                            { title: 'Sustainability', desc: 'We partner with certified sustainable suppliers to protect Kenya\'s forests for future generations.' },
                        ].map(({ title, desc }) => (
                            <div key={title} className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
                                <p className="text-gray-500 text-sm">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-16">
                <div className="container-custom">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Meet The Team</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {TEAM.map(({ name, role, initials }) => (
                            <div key={name} className="text-center">
                                <div className="w-20 h-20 bg-primary-green rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                                    {initials}
                                </div>
                                <p className="font-semibold text-gray-800">{name}</p>
                                <p className="text-sm text-gray-500">{role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-primary-green text-white text-center">
                <div className="container-custom">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
                    <p className="text-gray-100 mb-6 max-w-xl mx-auto">Browse our full catalogue of premium wood products and get them delivered right to your site.</p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Link to="/products" className="bg-white text-primary-green px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                            Shop Now
                        </Link>
                        <Link to="/contact" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-green transition">
                            Get a Quote
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
