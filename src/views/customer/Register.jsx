import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Full name is required';
        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email';
        if (!form.phone.match(/^0[17]\d{8}$/)) e.phone = 'Enter a valid Kenyan phone number';
        if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
        if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
        return e;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setLoading(true);
        setTimeout(() => {
            register({ name: form.name, email: form.email, phone: form.phone });
            toast.success('Account created! Welcome to Comply Kenya.');
            navigate('/account');
            setLoading(false);
        }, 1000);
    };

    const field = (key) => ({
        value: form[key],
        onChange: (e) => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: '' }); },
    });

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
                    <p className="text-gray-500 mt-2">Join thousands of happy Comply Kenya customers</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <div className="relative">
                            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" className="input-field pl-10" placeholder="John Kamau" required {...field('name')} />
                        </div>
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Email Address</label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="email" className="input-field pl-10" placeholder="you@example.com" required {...field('email')} />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Phone Number</label>
                        <div className="relative">
                            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="tel" className="input-field pl-10" placeholder="07XXXXXXXX" required {...field('phone')} />
                        </div>
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type={showPw ? 'text' : 'password'} className="input-field pl-10 pr-10" placeholder="Min. 8 characters" required {...field('password')} />
                            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                {showPw ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    {/* Confirm */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Confirm Password</label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type={showPw ? 'text' : 'password'} className="input-field pl-10" placeholder="Repeat password" required {...field('confirm')} />
                        </div>
                        {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-green font-semibold hover:underline">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
