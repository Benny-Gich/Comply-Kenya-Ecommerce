import { PRODUCTS } from '../models/products.model';

const STORAGE_KEY = 'complyAdminProducts';

export const readProducts = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : PRODUCTS;
    } catch {
        return PRODUCTS;
    }
};

export const writeProducts = (products) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};
