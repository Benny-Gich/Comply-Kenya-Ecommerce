import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('complyUser');
        const savedOrders = localStorage.getItem('complyOrders');
        if (saved) setUser(JSON.parse(saved));
        if (savedOrders) setOrders(JSON.parse(savedOrders));

        // Sync orders when another tab writes to localStorage
        const handleStorage = (e) => {
            if (e.key === 'complyOrders') {
                try {
                    setOrders(JSON.parse(e.newValue || '[]'));
                } catch { }
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('complyUser', JSON.stringify(userData));
    };

    const register = (userData) => {
        const newUser = { ...userData, id: Date.now(), createdAt: new Date().toISOString() };
        setUser(newUser);
        localStorage.setItem('complyUser', JSON.stringify(newUser));
        // Persist to accounts list so login can find the same user
        const users = JSON.parse(localStorage.getItem('complyUsers') || '[]');
        if (!users.find((u) => u.email === newUser.email)) {
            localStorage.setItem('complyUsers', JSON.stringify([...users, newUser]));
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('complyUser');
    };

    const addOrder = (order) => {
        const newOrder = {
            ...order,
            userId: user?.id,
            id: `ORD-${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: 'pending',
            statusHistory: [{ status: 'pending', timestamp: new Date().toISOString(), note: 'Order placed by customer' }],
        };
        // Always read fresh from localStorage to avoid stale-closure overwrite
        const current = JSON.parse(localStorage.getItem('complyOrders') || '[]');
        const updated = [newOrder, ...current];
        setOrders(updated);
        localStorage.setItem('complyOrders', JSON.stringify(updated));
        return newOrder;
    };

    const updateOrderStatus = (orderId, newStatus, note = '') => {
        // Always read fresh from localStorage to avoid stale-closure overwrite
        const current = JSON.parse(localStorage.getItem('complyOrders') || '[]');
        const updated = current.map((o) => {
            if (o.id !== orderId) return o;
            const history = o.statusHistory || [];
            return {
                ...o,
                status: newStatus,
                statusHistory: [
                    ...history,
                    { status: newStatus, timestamp: new Date().toISOString(), note },
                ],
            };
        });
        setOrders(updated);
        localStorage.setItem('complyOrders', JSON.stringify(updated));
    };

    const updateProfile = (updates) => {
        const updated = { ...user, ...updates };
        setUser(updated);
        localStorage.setItem('complyUser', JSON.stringify(updated));
    };

    const refreshOrders = () => {
        try {
            const savedOrders = localStorage.getItem('complyOrders');
            if (savedOrders) setOrders(JSON.parse(savedOrders));
        } catch { }
    };

    return (
        <AuthContext.Provider value={{ user, orders, login, register, logout, addOrder, updateOrderStatus, updateProfile, refreshOrders }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
