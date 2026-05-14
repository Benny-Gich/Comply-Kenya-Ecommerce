import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section className="bg-gradient-to-r from-primary-dark to-primary-green text-white py-20 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white opacity-5 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white opacity-5 rounded-full" />
            <div className="container-custom relative z-10">
                <div className="max-w-2xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1 rounded-full mb-4">
                            Kenya's #1 Wood Products Supplier
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                            Premium Wood Products <br />Delivered Nationwide
                        </h1>
                        <p className="text-white/80 text-lg mb-8 max-w-xl">
                            MDF boards, plywood, doors, flooring, timber and hardware. Quality you can trust, prices that work for you. Delivered to all 47 counties.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/products" className="bg-white text-primary-green font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition shadow-md">Shop Now</Link>
                            <Link to="/contact" className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition">Get a Quote</Link>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }} className="flex flex-wrap gap-8 mt-12">
                        {[{ label: '10,000+', desc: 'Products Sold' }, { label: '47', desc: 'Counties Served' }, { label: '500+', desc: 'Happy Clients' }].map(({ label, desc }) => (
                            <div key={desc}><p className="text-2xl font-bold">{label}</p><p className="text-white/70 text-sm">{desc}</p></div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;