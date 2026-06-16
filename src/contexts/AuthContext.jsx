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
        // Ensure user is persisted in the accounts list (for admin customer view)
        const users = JSON.parse(localStorage.getItem('complyUsers') || '[]');
        const exists = users.find((u) => u.email === userData.email);
        if (!exists) {
            localStorage.setItem('complyUsers', JSON.stringify([...users, userData]));
        }
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
        // Keep complyUsers in sync
        const users = JSON.parse(localStorage.getItem('complyUsers') || '[]');
        const updatedUsers = users.map((u) => u.id === updated.id ? { ...u, ...updates } : u);
        localStorage.setItem('complyUsers', JSON.stringify(updatedUsers));
    };

    /** Admin utility: set a new password for any customer by id. */
    const adminResetCustomerPassword = (customerId, newPassword) => {
        const users = JSON.parse(localStorage.getItem('complyUsers') || '[]');
        const updated = users.map((u) => String(u.id) === String(customerId) ? { ...u, password: newPassword } : u);
        localStorage.setItem('complyUsers', JSON.stringify(updated));
    };

    /** Admin utility: update profile details for any customer by id. */
    const adminUpdateCustomer = (customerId, updates) => {
        const users = JSON.parse(localStorage.getItem('complyUsers') || '[]');
        const updated = users.map((u) => String(u.id) === String(customerId) ? { ...u, ...updates } : u);
        localStorage.setItem('complyUsers', JSON.stringify(updated));
        // Keep active session in sync if admin edits the logged-in user
        if (user && String(user.id) === String(customerId)) {
            const refreshed = { ...user, ...updates };
            setUser(refreshed);
            localStorage.setItem('complyUser', JSON.stringify(refreshed));
        }
    };

    const refreshOrders = () => {
        try {
            const savedOrders = localStorage.getItem('complyOrders');
            if (savedOrders) setOrders(JSON.parse(savedOrders));
        } catch { }
    };

    return (
        <AuthContext.Provider value={{ user, orders, login, register, logout, addOrder, updateOrderStatus, updateProfile, adminResetCustomerPassword, adminUpdateCustomer, refreshOrders }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
