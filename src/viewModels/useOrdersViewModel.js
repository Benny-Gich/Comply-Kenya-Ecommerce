import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'complyOrders';

const readOrders = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
};

const saveOrders = (orders) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};

/**
 * Admin-specific hook that reads/writes orders directly from localStorage.
 * Never goes stale because it re-reads on every refresh and listens for
 * cross-tab storage events.
 */
const useAdminOrders = () => {
    const [orders, setOrders] = useState(() => readOrders());

    const refresh = useCallback(() => {
        setOrders(readOrders());
    }, []);

    // Keep in sync when another tab writes complyOrders
    useEffect(() => {
        const handler = (e) => {
            if (e.key === STORAGE_KEY) refresh();
        };
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, [refresh]);

    const updateOrderStatus = useCallback((orderId, newStatus, note = '') => {
        const current = readOrders();
        const updated = current.map((o) => {
            if (o.id !== orderId) return o;
            return {
                ...o,
                status: newStatus,
                statusHistory: [
                    ...(o.statusHistory || []),
                    { status: newStatus, timestamp: new Date().toISOString(), note },
                ],
            };
        });
        saveOrders(updated);
        setOrders(updated);
    }, []);

    return { orders, refresh, updateOrderStatus };
};

export default useAdminOrders;
