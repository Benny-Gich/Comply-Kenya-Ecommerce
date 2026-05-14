import React from 'react';

const testimonials = [
    {
        id: 1,
        name: 'James Mwangi',
        role: 'Interior Designer',
        text: 'Comply Kenya delivers top-quality MDF boards consistently. My go-to supplier for all my interior projects.',
        rating: 5,
    },
    {
        id: 2,
        name: 'Sarah Kamau',
        role: 'Contractor',
        text: 'Fast delivery across Nairobi and competitive pricing. Highly recommend their plywood range.',
        rating: 5,
    },
    {
        id: 3,
        name: 'Peter Ochieng',
        role: 'Homeowner',
        text: 'Ordered flooring for my home and the quality exceeded expectations. Great customer support too!',
        rating: 4,
    },
];

const StarRating = ({ rating }) => (
    <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>
                ★
            </span>
        ))}
    </div>
);

const Testimonials = () => {
    return (
        <section className="py-16 bg-white">
            <div className="container-custom">
                <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
                    What Our Customers Say
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                        <div key={t.id} className="bg-gray-50 rounded-xl p-6 shadow-sm">
                            <StarRating rating={t.rating} />
                            <p className="text-gray-600 mb-4 italic">"{t.text}"</p>
                            <div>
                                <p className="font-semibold text-gray-800">{t.name}</p>
                                <p className="text-sm text-gray-500">{t.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
