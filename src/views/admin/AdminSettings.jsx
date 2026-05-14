import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiKey, FiShield, FiEye, FiEyeOff, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import {
    getAdminAccounts,
    addAdminAccount,
    deleteAdminAccount,
    changeAdminPassword,
    getAdminSession,
} from '../../services/adminAuth.service';

const AdminSettings = () => {
    const session = getAdminSession();
    const [accounts, setAccounts] = useState([]);

    // Add account form
    const [showAddForm, setShowAddForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState('admin');
    const [showNewPwd, setShowNewPwd] = useState(false);
    const [addError, setAddError] = useState('');
    const [addLoading, setAddLoading] = useState(false);

    // Change password form
    const [changingId, setChangingId] = useState(null);
    const [currentPwd, setCurrentPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [showPwds, setShowPwds] = useState(false);
    const [pwdError, setPwdError] = useState('');

    useEffect(() => {
        setAccounts(getAdminAccounts());
    }, []);

    const refresh = () => setAccounts(getAdminAccounts());

    const handleAddAccount = (e) => {
        e.preventDefault();
        setAddError('');
        if (newPassword.length < 8) {
            setAddError('Password must be at least 8 characters.');
            return;
        }
        setAddLoading(true);
        setTimeout(() => {
            const err = addAdminAccount({ name: newName, email: newEmail, password: newPassword, role: newRole });
            if (err) {
                setAddError(err);
            } else {
                toast.success(`Admin account created for ${newEmail}`);
                setNewName(''); setNewEmail(''); setNewPassword(''); setNewRole('admin');
                setShowAddForm(false);
                refresh();
            }
            setAddLoading(false);
        }, 400);
    };

    const handleDelete = (account) => {
        if (account.id === session?.id) {
            toast.error("You can't delete your own account.");
            return;
        }
        if (!window.confirm(`Delete admin account for ${account.email}? This cannot be undone.`)) return;
        const err = deleteAdminAccount(account.id);
        if (err) {
            toast.error(err);
        } else {
            toast.success('Account deleted.');
            refresh();
        }
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        setPwdError('');
        if (newPwd.length < 8) { setPwdError('New password must be at least 8 characters.'); return; }
        if (newPwd !== confirmPwd) { setPwdError('Passwords do not match.'); return; }
        const err = changeAdminPassword(changingId, currentPwd, newPwd);
        if (err) {
            setPwdError(err);
        } else {
            toast.success('Password updated successfully.');
            setChangingId(null);
            setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
        }
    };

    const formatDate = (iso) =>
        new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <div className="space-y-8 max-w-3xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Admin Accounts</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage who can access the admin panel</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="btn-primary flex items-center gap-2 text-sm"
                >
                    <FiPlus size={16} />
                    {showAddForm ? 'Cancel' : 'Add Account'}
                </button>
            </div>

            {/* Add Account Form */}
            {showAddForm && (
                <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-primary-green border-opacity-30">
                    <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FiUser size={18} className="text-primary-green" /> New Admin Account
                    </h2>
                    <form onSubmit={handleAddAccount} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <input
                                    className="input-field"
                                    required
                                    placeholder="Jane Doe"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    required
                                    placeholder="jane@comply.co.ke"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password * (min 8 chars)</label>
                                <div className="relative">
                                    <input
                                        type={showNewPwd ? 'text' : 'password'}
                                        className="input-field pr-10"
                                        required
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button type="button" onClick={() => setShowNewPwd(!showNewPwd)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showNewPwd ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    className="input-field"
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value)}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="superadmin">Super Admin</option>
                                </select>
                            </div>
                        </div>
                        {addError && (
                            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{addError}</p>
                        )}
                        <button type="submit" className="btn-primary text-sm" disabled={addLoading}>
                            {addLoading ? 'Creating...' : 'Create Account'}
                        </button>
                    </form>
                </div>
            )}

            {/* Accounts List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b bg-gray-50">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        {accounts.length} account{accounts.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <div className="divide-y">
                    {accounts.map((account) => (
                        <div key={account.id} className="px-6 py-5">
                            <div className="flex items-start gap-4">
                                {/* Avatar */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${account.role === 'superadmin' ? 'bg-primary-dark' : 'bg-primary-green'}`}>
                                    {account.name[0].toUpperCase()}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-semibold text-gray-800">{account.name}</p>
                                        {account.role === 'superadmin' && (
                                            <span className="flex items-center gap-1 text-xs bg-gray-800 text-white px-2 py-0.5 rounded-full">
                                                <FiShield size={10} /> Super Admin
                                            </span>
                                        )}
                                        {account.id === session?.id && (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">You</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500">{account.email}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Created {formatDate(account.createdAt)}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => {
                                            setChangingId(changingId === account.id ? null : account.id);
                                            setCurrentPwd(''); setNewPwd(''); setConfirmPwd(''); setPwdError('');
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                                    >
                                        <FiKey size={13} /> Change Password
                                    </button>
                                    {account.id !== 'seed' && account.id !== session?.id && (
                                        <button
                                            onClick={() => handleDelete(account)}
                                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete account"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Change Password inline form */}
                            {changingId === account.id && (
                                <form
                                    onSubmit={handleChangePassword}
                                    className="mt-4 ml-14 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3"
                                >
                                    <p className="text-sm font-medium text-gray-700">Change password for {account.name}</p>
                                    <div className="grid sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">Current Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPwds ? 'text' : 'password'}
                                                    className="input-field text-sm pr-8"
                                                    required
                                                    value={currentPwd}
                                                    onChange={(e) => setCurrentPwd(e.target.value)}
                                                    placeholder="••••••••"
                                                />
                                                <button type="button" onClick={() => setShowPwds(!showPwds)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                                                    {showPwds ? <FiEyeOff size={13} /> : <FiEye size={13} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">New Password</label>
                                            <input
                                                type={showPwds ? 'text' : 'password'}
                                                className="input-field text-sm"
                                                required
                                                value={newPwd}
                                                onChange={(e) => setNewPwd(e.target.value)}
                                                placeholder="Min 8 chars"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">Confirm New Password</label>
                                            <input
                                                type={showPwds ? 'text' : 'password'}
                                                className="input-field text-sm"
                                                required
                                                value={confirmPwd}
                                                onChange={(e) => setConfirmPwd(e.target.value)}
                                                placeholder="Repeat password"
                                            />
                                        </div>
                                    </div>
                                    {pwdError && (
                                        <p className="text-red-500 text-xs">{pwdError}</p>
                                    )}
                                    <div className="flex gap-2">
                                        <button type="submit" className="btn-primary text-xs py-1.5 px-4">Update Password</button>
                                        <button type="button" onClick={() => setChangingId(null)} className="btn-secondary text-xs py-1.5 px-4">Cancel</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Info box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <p className="font-semibold mb-1">Note</p>
                <p>Admin accounts are stored locally in this browser. In a production deployment, replace this with server-side authentication (e.g. Firebase Auth, a backend API, or Supabase).</p>
            </div>
        </div>
    );
};

export default AdminSettings;
