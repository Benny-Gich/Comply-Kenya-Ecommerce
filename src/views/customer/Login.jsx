import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { customerSignInWithGoogle, customerSignInWithApple, resolveCustomerRedirectResult } from '../../services/socialAuth.service';
import toast from 'react-hot-toast';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/account';

    const [form, setForm] = useState({ email: '', password: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState('');

    // Handle return from Google/Apple redirect
    useEffect(() => {
        resolveCustomerRedirectResult()
            .then((userData) => {
                if (!userData) return;
                login(userData);
                const pending = localStorage.getItem('complyLoginFrom') || '/account';
                localStorage.removeItem('complyLoginFrom');
                toast.success('Welcome to Comply Kenya!');
                navigate(pending, { replace: true });
            })
            .catch((err) => toast.error(err.message || 'Sign-in failed. Please try again.'));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSocialSignIn = (provider) => {
        // Store destination so we can navigate there after the redirect returns
        localStorage.setItem('complyLoginFrom', from);
        setSocialLoading(provider);
        const signIn = provider === 'google' ? customerSignInWithGoogle : customerSignInWithApple;
        signIn().catch((err) => {
            setSocialLoading('');
            toast.error(err.message || 'Sign-in failed. Please try again.');
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('complyUsers') || '[]');
            const found = users.find((u) => u.email.toLowerCase() === form.email.toLowerCase());
            if (!found) {
                toast.error('No account found with that email. Please register first.');
                setLoading(false);
                return;
            }
            if (found.password && found.password !== form.password) {
                toast.error('Incorrect password. Please try again.');
                setLoading(false);
                return;
            }
            login(found);
            toast.success('Welcome back!');
            navigate(from, { replace: true });
            setLoading(false);
        }, 600);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
                    <p className="text-gray-500 mt-2">Sign in to your Comply Kenya account</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-5">
                    {/* Social sign-in */}
                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={() => handleSocialSignIn('google')}
                            disabled={!!socialLoading}
                            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            {socialLoading === 'google' ? (
                                <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                            ) : (
                                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                            )}
                            Continue with Google
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocialSignIn('apple')}
                            disabled={!!socialLoading}
                            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-50"
                        >
                            {socialLoading === 'apple' ? (
                                <span className="w-5 h-5 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
                            ) : (
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                            )}
                            Continue with Apple
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <hr className="flex-1 border-gray-200" />
                        <span className="text-xs text-gray-400">or sign in with email</span>
                        <hr className="flex-1 border-gray-200" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                required
                                className="input-field pl-10"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPw ? 'text' : 'password'}
                                required
                                className="input-field pl-10 pr-10"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                {showPw ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                        <div className="text-right mt-1">
                            <Link to="/forgot-password" className="text-sm text-primary-green hover:underline">Forgot password?</Link>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full">
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-green font-semibold hover:underline">Create one</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
