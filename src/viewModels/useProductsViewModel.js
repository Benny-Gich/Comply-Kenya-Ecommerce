import { useState, useCallback } from 'react';
import { PRODUCTS, CATEGORIES } from '../models/products.model';

const STORAGE_KEY = 'complyAdminProducts';

const readProducts = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
        // First run: seed from static data
        const seed = PRODUCTS.map((p) => ({ ...p }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        return seed;
    } catch {
        return PRODUCTS.map((p) => ({ ...p }));
    }
};

const saveProducts = (products) =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));

const useAdminProducts = () => {
    const [products, setProducts] = useState(() => readProducts());

    const refresh = useCallback(() => setProducts(readProducts()), []);

    const saveProduct = useCallback((product) => {
        const current = readProducts();
        const isNew = !current.find((p) => p.id === product.id);
        const updated = isNew
            ? [...current, { ...product, id: Date.now() }]
            : current.map((p) => (p.id === product.id ? { ...product } : p));
        saveProducts(updated);
        setProducts(updated);
        return isNew ? { ...product, id: updated[updated.length - 1].id } : product;
    }, []);

    const deleteProduct = useCallback((id) => {
        const updated = readProducts().filter((p) => p.id !== id);
        saveProducts(updated);
        setProducts(updated);
    }, []);

    const updateStock = useCallback((id, qty) => {
        const updated = readProducts().map((p) =>
            p.id === id ? { ...p, stockQty: Number(qty), inStock: Number(qty) > 0 } : p
        );
        saveProducts(updated);
        setProducts(updated);
    }, []);

    return { products, categories: CATEGORIES, refresh, saveProduct, deleteProduct, updateStock };
};

export default useAdminProducts;
