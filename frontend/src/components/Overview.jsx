import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { BarChart3, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const Overview = ({ workspaceId }) => {
    const { data: projects } = useQuery({
        queryKey: ['projects', workspaceId],
        queryFn: async () => {
            const response = await api.get(`/workspaces/${workspaceId}/projects`);
            return response.data;
        },
        enabled: !!workspaceId
    });

    const { data: statsData, isLoading: isStatsLoading } = useQuery({
        queryKey: ['workspace-stats', workspaceId],
        queryFn: async () => {
            const response = await api.get(`/workspaces/${workspaceId}/stats`);
            return response.data;
        },
        enabled: !!workspaceId
    });

    const stats = [
        { label: 'Active Projects', value: statsData?.project_count || 0, icon: <BarChart3 className="text-blue-600" />, color: 'bg-blue-50' },
        { label: 'Total Tickets', value: statsData?.total_tickets || 0, icon: <AlertCircle className="text-purple-600" />, color: 'bg-purple-50' },
        { label: 'Completed', value: statsData?.status_counts?.done || 0, icon: <CheckCircle2 className="text-green-600" />, color: 'bg-green-50' },
        { label: 'In Progress', value: statsData?.status_counts?.in_progress || 0, icon: <Clock className="text-orange-600" />, color: 'bg-orange-50' },
    ];

    if (isStatsLoading) {
        return (
            <div className="p-8 animate-pulse bg-slate-50">
                <div className="h-8 w-48 bg-slate-200 rounded mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Workspace Overview</h1>
                <p className="text-slate-500">Track your workspace progress and team activity.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-bold text-slate-900 mb-4 text-lg">Recent Projects</h3>
                {!projects || projects.length === 0 ? (
                    <p className="text-slate-500 text-sm italic">No projects created yet.</p>
                ) : (
                    <div className="space-y-4">
                        {projects.slice(0, 5).map(project => (
                            <div key={project.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded flex items-center justify-center font-bold">
                                        {project.name[0]}
                                    </div>
                                    <span className="font-medium text-slate-700">{project.name}</span>
                                </div>
                                <span className="text-xs text-slate-400">{new Date(project.created_at).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Overview;
