import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { LayoutDashboard, FolderKanban, Settings, LogOut, Plus, X, Trash2, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ currentWorkspace, onWorkspaceSelect, activeView, onViewChange }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteError, setInviteError] = useState('');

    const { data: workspaces, isLoading } = useQuery({
        queryKey: ['workspaces'],
        queryFn: async () => {
            const response = await api.get('/workspaces/');
            return response.data;
        },
    });

    const [workspaceError, setWorkspaceError] = useState('');

    const createMutation = useMutation({
        mutationFn: async (name) => {
            setWorkspaceError('');
            return api.post('/workspaces/', { name });
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries(['workspaces']);
            setIsModalOpen(false);
            setNewWorkspaceName('');
            setWorkspaceError('');

            // Automatically select the new workspace
            if (response.data) {
                onWorkspaceSelect(response.data);
            }
        },
        onError: (error) => {
            setWorkspaceError(error.response?.data?.detail || 'Failed to create workspace');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (workspaceId) => {
            return api.delete(`/workspaces/${workspaceId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['workspaces']);
            setIsDeleteModalOpen(false);
            onWorkspaceSelect(null);
        },
    });

    const inviteMutation = useMutation({
        mutationFn: async ({ workspaceId, email }) => {
            return api.post(`/workspaces/${workspaceId}/members`, { email });
        },
        onSuccess: () => {
            setInviteEmail('');
            setIsInviteModalOpen(false);
            setInviteError('');
            alert('User invited successfully!');
        },
        onError: (error) => {
            setInviteError(error.response?.data?.detail || 'Failed to invite user');
        }
    });

    const handleInvite = (e) => {
        e.preventDefault();
        if (inviteEmail.trim() && currentWorkspace) {
            inviteMutation.mutate({ workspaceId: currentWorkspace.id, email: inviteEmail });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleCreateWorkspace = (e) => {
        e.preventDefault();
        if (newWorkspaceName.trim()) {
            createMutation.mutate(newWorkspaceName);
        }
    };

    return (
        <div className="w-64 bg-slate-900 h-screen text-white flex flex-col p-4 shadow-xl">
            <div className="text-xl font-bold mb-8 p-2 border-b border-slate-700 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-sm">BT</div>
                BugTracker
            </div>

            <div className="mb-8">
                <div className="flex justify-between items-center px-2 mb-2">
                    <label className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Workspace</label>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded"
                        title="New Workspace"
                    >
                        <Plus size={16} />
                    </button>
                </div>
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <select
                            className="flex-1 bg-slate-800 border-none rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 cursor-pointer text-slate-200 hover:bg-slate-700 transition-colors"
                            value={currentWorkspace?.id || ''}
                            onChange={(e) => {
                                const workspace = workspaces?.find(w => w.id === parseInt(e.target.value));
                                onWorkspaceSelect(workspace);
                            }}
                        >
                            <option value="">Select Workspace</option>
                            {workspaces?.map(w => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                            ))}
                        </select>
                        {currentWorkspace && (
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                title="Delete Workspace"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-1">
                <NavItem
                    icon={<LayoutDashboard size={20} />}
                    label="Overview"
                    active={activeView === 'overview'}
                    onClick={() => onViewChange('overview')}
                />
                <NavItem
                    icon={<FolderKanban size={20} />}
                    label="Projects"
                    active={activeView === 'projects'}
                    onClick={() => onViewChange('projects')}
                />
                <NavItem
                    icon={<Settings size={20} />}
                    label="Settings"
                    active={activeView === 'settings'}
                    onClick={() => onViewChange('settings')}
                />
                {currentWorkspace && (
                    <NavItem
                        icon={<UserPlus size={20} />}
                        label="Invite Team"
                        active={activeView === 'members'}
                        onClick={() => setIsInviteModalOpen(true)}
                    />
                )}
            </nav>

            <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors mt-auto"
            >
                <LogOut size={20} />
                <span>Logout</span>
            </button>

            {/* Workspace Creation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden text-slate-900 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="font-bold text-lg">New Workspace</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateWorkspace} className="p-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Workspace Name</label>
                                <input
                                    autoFocus
                                    type="text"
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    placeholder="e.g. Engineering, Marketing"
                                    value={newWorkspaceName}
                                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                                    disabled={createMutation.isPending}
                                />
                                {workspaceError && <p className="text-red-500 text-xs mt-1">{workspaceError}</p>}
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending || !newWorkspaceName.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {createMutation.isPending ? 'Creating...' : 'Create Workspace'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Invite Modal */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden text-slate-900 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="font-bold text-lg">Invite Teammate</h3>
                            <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleInvite} className="p-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input
                                    autoFocus
                                    type="email"
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    placeholder="teammate@example.com"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    disabled={inviteMutation.isPending}
                                />
                                {inviteError && <p className="text-red-500 text-xs mt-1">{inviteError}</p>}
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsInviteModalOpen(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={inviteMutation.isPending || !inviteEmail.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {inviteMutation.isPending ? 'Inviting...' : 'Send Invite'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Workspace Deletion Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-red-900/20 backdrop-blur-sm flex items-center justify-center z-[60] p-4 text-slate-900">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="font-bold text-xl mb-2 text-slate-900">Delete Workspace?</h3>
                            <p className="text-slate-500 mb-8">
                                Are you sure you want to delete <span className="font-semibold text-slate-900">"{currentWorkspace?.name}"</span>?
                                <br />
                                <span className="text-red-500 text-sm font-medium">This will permanently remove all its projects and tickets.</span>
                            </p>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => deleteMutation.mutate(currentWorkspace.id)}
                                    disabled={deleteMutation.isPending}
                                    className="flex-1 px-4 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all disabled:opacity-50"
                                >
                                    {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const NavItem = ({ icon, label, active, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 translate-x-1' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
    >
        {icon}
        <span className="font-medium text-sm">{label}</span>
    </div>
);

export default Sidebar;
