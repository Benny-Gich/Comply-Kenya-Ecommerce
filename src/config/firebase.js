// ─── Firebase Configuration ──────────────────────────────────────────────────
// Replace the placeholder values below with your actual Firebase project config.
// Get these from: Firebase Console → Project Settings → Your Apps → Web app config.
//
// You also need to enable the following providers in:
//   Firebase Console → Authentication → Sign-in method
//     ✅ Google
//     ✅ Apple  (requires Apple Developer account + Service ID)

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyBDYFmEPxRrbyhIDBbntVbokAojVmDiPcI',
    authDomain: 'complykenyaecommerce.firebaseapp.com',
    projectId: 'complykenyaecommerce',
    storageBucket: 'complykenyaecommerce.firebasestorage.app',
    messagingSenderId: '162672401093',
    appId: '1:162672401093:web:762a9e098a287d64f9eeac',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

export default app;
