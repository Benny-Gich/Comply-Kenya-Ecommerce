import React from 'react';
import Hero from '../../components/Home/Hero';
import FeaturedProducts from '../../components/Home/FeaturedProducts';
import CategoryGrid from '../../components/Home/CategoryGrid';
import Testimonials from '../../components/Home/Testimonials';
import WhatsAppChat from '../../components/Common/WhatsAppChat';

const Home = () => {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <CategoryGrid />
      <Testimonials />
      <WhatsAppChat />
    </>
  );
};

export default Home;