// Shared admin authentication utility
// Admin accounts are stored in localStorage under 'complyAdminAccounts'
// The seed account is created on first use so there's always a way in.

const STORAGE_KEY = 'complyAdminAccounts';
const SESSION_KEY = 'complyAdminAuth';

const SEED_ACCOUNT = {
    id: 'seed',
    name: 'Super Admin',
    email: 'admin@comply.co.ke',
    password: 'comply2024',
    role: 'superadmin',
    createdAt: new Date(0).toISOString(),
};

/** Return all admin accounts, initialising with the seed if empty. */
export const getAdminAccounts = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const accounts = raw ? JSON.parse(raw) : [];
        if (accounts.length === 0) {
            // First run – persist the seed account
            localStorage.setItem(STORAGE_KEY, JSON.stringify([SEED_ACCOUNT]));
            return [SEED_ACCOUNT];
        }
        return accounts;
    } catch {
        return [SEED_ACCOUNT];
    }
};

const saveAccounts = (accounts) =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));

/** Verify credentials. Returns the account object or null. */
export const verifyAdmin = (email, password) => {
    const accounts = getAdminAccounts();
    return (
        accounts.find(
            (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
        ) || null
    );
};

/** Start a session for the given account. */
export const startAdminSession = (account) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: account.id, email: account.email, name: account.name, role: account.role }));
};

/** Return the current session account or null. */
export const getAdminSession = () => {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

/** Clear the current session. */
export const clearAdminSession = () => localStorage.removeItem(SESSION_KEY);

/** Add a new admin account. Returns error string or null on success. */
export const addAdminAccount = ({ name, email, password, role = 'admin' }) => {
    const accounts = getAdminAccounts();
    if (accounts.find((a) => a.email.toLowerCase() === email.toLowerCase())) {
        return 'An account with this email already exists.';
    }
    const newAccount = {
        id: `admin-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        createdAt: new Date().toISOString(),
    };
    saveAccounts([...accounts, newAccount]);
    return null;
};

/** Delete an account by id. Superadmin seed cannot be deleted. */
export const deleteAdminAccount = (id) => {
    if (id === 'seed') return 'Cannot delete the super admin account.';
    const accounts = getAdminAccounts().filter((a) => a.id !== id);
    saveAccounts(accounts);
    return null;
};

/** Change password for an account. */
export const changeAdminPassword = (id, currentPassword, newPassword) => {
    const accounts = getAdminAccounts();
    const idx = accounts.findIndex((a) => a.id === id);
    if (idx === -1) return 'Account not found.';
    if (accounts[idx].password !== currentPassword) return 'Current password is incorrect.';
    accounts[idx] = { ...accounts[idx], password: newPassword };
    saveAccounts(accounts);
    return null;
};
