// Social authentication helpers (Google & Apple via Firebase)
// Used by both the customer and admin login pages.

import { signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '../config/firebase';

/**
 * Resolves a Firebase User into a plain profile object.
 * Handles both Google and Apple providers.
 */
const profileFromFirebaseUser = (firebaseUser) => {
    const { uid, displayName, email, photoURL, providerData } = firebaseUser;
    // Apple may send displayName only on the first sign-in; fall back to email prefix.
    const name = displayName || (email ? email.split('@')[0].replace(/[._]/g, ' ') : 'User');
    return { firebaseUid: uid, name, email, photoURL: photoURL || null, provider: providerData[0]?.providerId };
};

/**
 * Upsert a social-auth profile into the complyUsers localStorage list.
 * Returns the stored user object (with a stable local id).
 */
const upsertCustomerAccount = (profile) => {
    const users = JSON.parse(localStorage.getItem('complyUsers') || '[]');
    const existing = users.find((u) => u.email?.toLowerCase() === profile.email?.toLowerCase());
    if (existing) {
        // Refresh name/photo in case they changed on the provider side
        const updated = { ...existing, name: profile.name, photoURL: profile.photoURL, firebaseUid: profile.firebaseUid };
        const newList = users.map((u) => u.email?.toLowerCase() === profile.email?.toLowerCase() ? updated : u);
        localStorage.setItem('complyUsers', JSON.stringify(newList));
        return updated;
    }
    const newUser = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        phone: '',
        ...profile,
    };
    localStorage.setItem('complyUsers', JSON.stringify([...users, newUser]));
    return newUser;
};

// ─── Customer social sign-in ─────────────────────────────────────────────────

/**
 * Initiates a Google redirect sign-in for customers.
 * The page will navigate away; call resolveCustomerRedirectResult on return.
 */
export const customerSignInWithGoogle = () => signInWithRedirect(auth, googleProvider);

/**
 * Initiates an Apple redirect sign-in for customers.
 */
export const customerSignInWithApple = () => signInWithRedirect(auth, appleProvider);

/**
 * Call on Login page mount. Returns the stored user object if returning from
 * a social redirect, or null if no redirect is pending.
 */
export const resolveCustomerRedirectResult = async () => {
    const result = await getRedirectResult(auth);
    if (!result) return null;
    const profile = profileFromFirebaseUser(result.user);
    return upsertCustomerAccount(profile);
};

// ─── Admin social sign-in ────────────────────────────────────────────────────

const getAdminAccounts = () => {
    try { return JSON.parse(localStorage.getItem('complyAdminAccounts') || '[]'); } catch { return []; }
};

/**
 * Initiates a Google redirect sign-in for admins.
 */
export const adminSignInWithGoogle = () => signInWithRedirect(auth, googleProvider);

/**
 * Initiates an Apple redirect sign-in for admins.
 */
export const adminSignInWithApple = () => signInWithRedirect(auth, appleProvider);

/**
 * Call on AdminLogin page mount. Returns the admin account if returning from
 * a social redirect AND the email matches an existing admin account.
 * Returns null if no redirect is pending; throws if email is not an admin.
 */
export const resolveAdminRedirectResult = async () => {
    const result = await getRedirectResult(auth);
    if (!result) return null;
    const email = result.user.email?.toLowerCase();
    const accounts = getAdminAccounts();
    const account = accounts.find((a) => a.email.toLowerCase() === email);
    if (!account) throw new Error(`No admin account found for ${email}. Contact your super admin.`);
    return account;
};
