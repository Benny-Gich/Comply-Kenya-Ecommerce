const STORAGE_KEY = 'complyOrders';

export const readOrders = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

export const writeOrders = (orders) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};
