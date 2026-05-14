import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;