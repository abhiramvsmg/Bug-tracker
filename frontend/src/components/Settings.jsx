import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, AppWindow, Loader2, Save, CheckCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';

const Settings = () => {
    const queryClient = useQueryClient();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    const { data: user, isLoading } = useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const response = await api.get('/auth/me');
            return response.data;
        },
    });

    useEffect(() => {
        if (user) {
            setFullName(user.full_name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const updateMutation = useMutation({
        mutationFn: async (data) => {
            return api.patch('/auth/me', null, { params: data });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['me']);
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
            setPassword('');
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        },
        onError: (err) => {
            setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to update settings' });
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
        }
    });

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        updateMutation.mutate({ full_name: fullName, email });
    };

    const handleUpdateSecurity = (e) => {
        e.preventDefault();
        if (password) {
            updateMutation.mutate({ password });
        }
    };

    if (isLoading) return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
    );

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                    <p className="text-slate-500">Manage your account and application preferences.</p>
                </div>
                {message.text && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.type === 'success' && <CheckCircle size={16} />}
                        {message.text}
                    </div>
                )}
            </header>

            <div className="space-y-6">
                <SettingsSection
                    title="Profile Information"
                    description="Update your personal details and contact information."
                    icon={<User size={20} className="text-blue-600" />}
                >
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full border-2 border-slate-100 rounded-xl p-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full border-2 border-slate-100 rounded-xl p-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={updateMutation.isPending}
                                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all font-bold disabled:opacity-50"
                            >
                                <Save size={18} />
                                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </SettingsSection>

                <SettingsSection
                    title="Security"
                    description="Change your password to keep your account secure."
                    icon={<Shield size={20} className="text-green-600" />}
                >
                    <form onSubmit={handleUpdateSecurity} className="space-y-4">
                        <div className="max-w-md">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                            <input
                                type="password"
                                className="w-full border-2 border-slate-100 rounded-xl p-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                            />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={updateMutation.isPending || !password}
                                className="flex items-center gap-2 bg-slate-800 text-white px-6 py-2.5 rounded-xl hover:bg-slate-900 shadow-lg shadow-slate-500/10 transition-all font-bold disabled:opacity-50"
                            >
                                <Shield size={18} />
                                {updateMutation.isPending ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </SettingsSection>
            </div>
        </div>
    );
};

const SettingsSection = ({ title, description, icon, children }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                    {icon}
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
                    <p className="text-sm text-slate-500">{description}</p>
                </div>
            </div>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

export default Settings;
