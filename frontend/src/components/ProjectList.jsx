import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Plus, Folder, X, Trash2 } from 'lucide-react';

const ProjectList = ({ workspaceId, onProjectSelect }) => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [newProjectName, setNewProjectName] = useState('');

    const { data: projects, isLoading } = useQuery({
        queryKey: ['projects', workspaceId],
        queryFn: async () => {
            const response = await api.get(`/workspaces/${workspaceId}/projects`);
            return response.data;
        },
    });

    const [createError, setCreateError] = useState('');

    const createMutation = useMutation({
        mutationFn: async (name) => {
            console.log(`[ProjectList] Creating project: ${name} in workspace: ${workspaceId}`);
            setCreateError('');
            return api.post(`/workspaces/${workspaceId}/projects`, {
                name,
                workspace_id: workspaceId
            });
        },
        onSuccess: () => {
            console.log(`[ProjectList] Project created successfully!`);
            queryClient.invalidateQueries(['projects', workspaceId]);
            setIsModalOpen(false);
            setNewProjectName('');
            setCreateError('');
        },
        onError: (err) => {
            console.error('[ProjectList] Create error:', err);
            setCreateError(err.response?.data?.detail || err.message || 'Failed to create project');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (projectId) => {
            return api.delete(`/workspaces/${workspaceId}/projects/${projectId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['projects', workspaceId]);
            setIsDeleteModalOpen(false);
            setProjectToDelete(null);
        },
    });

    const handleCreateProject = (e) => {
        e.preventDefault();
        if (newProjectName.trim()) {
            createMutation.mutate(newProjectName);
        }
    };

    const confirmDelete = (e, project) => {
        e.stopPropagation();
        setProjectToDelete(project);
        setIsDeleteModalOpen(true);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
                    <p className="text-slate-500 text-sm">Manage your workspace projects and tickets.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all font-medium"
                >
                    <Plus size={20} />
                    <span>New Project</span>
                </button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-slate-200/50 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            ) : !projects || projects.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-16 text-center">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Folder size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">No projects found</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">Start by creating your first project in this workspace to organize your work.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Create Project
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects?.map(project => (
                        <div
                            key={project.id}
                            onClick={() => onProjectSelect(project)}
                            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    <Folder size={24} />
                                </div>
                                <button
                                    onClick={(e) => confirmDelete(e, project)}
                                    className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    title="Delete Project"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">{project.name}</h3>
                            <p className="text-slate-500 text-sm">Open Kanban board</p>
                            <div className="absolute bottom-0 left-0 h-1 w-0 bg-blue-600 group-hover:w-full transition-all duration-500"></div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Project Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden text-slate-900 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="font-bold text-xl">New Project</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateProject} className="p-6">
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Project Name</label>
                                <input
                                    autoFocus
                                    type="text"
                                    className="w-full border-2 border-slate-100 rounded-xl p-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                    placeholder="e.g. Website Redesign, Mobile App"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    disabled={createMutation.isPending}
                                />
                                {createError && (
                                    <div className="mt-3 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 flex items-center gap-2">
                                        <div className="bg-red-500 rounded-full p-0.5 text-white">
                                            <X size={10} />
                                        </div>
                                        {createError}
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending || !newProjectName.trim()}
                                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
                                >
                                    {createMutation.isPending ? 'Creating...' : 'Create Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-red-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden text-slate-900 animate-in fade-in zoom-in duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="font-bold text-xl mb-2">Delete Project?</h3>
                            <p className="text-slate-500 mb-8">
                                Are you sure you want to delete <span className="font-semibold text-slate-900">"{projectToDelete?.name}"</span>?
                                This action cannot be undone and will delete all tickets.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsDeleteModalOpen(false);
                                        setProjectToDelete(null);
                                    }}
                                    className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => deleteMutation.mutate(projectToDelete?.id)}
                                    disabled={deleteMutation.isPending}
                                    className="flex-1 px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all disabled:opacity-50"
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

export default ProjectList;
