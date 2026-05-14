import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getFeaturedProducts } from '../../models/products.model';
import ProductCard from '../Products/ProductCard';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        setProducts(getFeaturedProducts());
    }, []);

    return (
        <section className="py-16 bg-white">
            <div className="container-custom">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
                        <p className="text-gray-500 mt-1">Handpicked top quality items</p>
                    </div>
                    <Link to="/products" className="text-primary-green font-medium text-sm hover:underline">
                        View All →
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
