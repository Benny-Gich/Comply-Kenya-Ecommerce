const SESSION_KEY = 'complyUser';
const USERS_KEY = 'complyUsers';

export const readUserSession = () => {
    try {
        const data = localStorage.getItem(SESSION_KEY);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
};

export const writeUserSession = (user) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const clearUserSession = () => {
    localStorage.removeItem(SESSION_KEY);
};

export const readUsers = () => {
    try {
        const data = localStorage.getItem(USERS_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

export const writeUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};
