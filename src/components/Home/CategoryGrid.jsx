import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
    { name: 'MDF Boards', icon: '🪵', slug: 'mdf-boards' },
    { name: 'Plywood', icon: '📦', slug: 'plywood' },
    { name: 'Doors', icon: '🚪', slug: 'doors' },
    { name: 'Flooring', icon: '🏠', slug: 'flooring' },
    { name: 'Timber', icon: '🌲', slug: 'timber' },
    { name: 'Hardware', icon: '🔧', slug: 'hardware' },
];

const CategoryGrid = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container-custom">
                <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
                    Shop by Category
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((cat) => (
                        <Link
                            key={cat.slug}
                            to={`/products?category=${cat.slug}`}
                            className="flex flex-col items-center p-6 bg-white rounded-xl shadow hover:shadow-md hover:-translate-y-1 transition-all"
                        >
                            <span className="text-4xl mb-3">{cat.icon}</span>
                            <span className="text-sm font-medium text-gray-700 text-center">{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
