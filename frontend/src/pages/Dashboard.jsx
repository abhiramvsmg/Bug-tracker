import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ProjectList from '../components/ProjectList';
import KanbanBoard from '../components/KanbanBoard';
import Overview from '../components/Overview';
import Settings from '../components/Settings';
import { Plus } from 'lucide-react';

const Dashboard = () => {
    const [selectedWorkspace, setSelectedWorkspace] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [activeView, setActiveView] = useState('overview');

    console.log('[Dashboard] State:', { workspace: selectedWorkspace?.id, project: selectedProject?.id, view: activeView });

    const renderContent = () => {
        if (!selectedWorkspace && activeView !== 'settings') {
            return (
                <div className="flex items-center justify-center h-full text-slate-500 bg-white m-8 rounded-2xl border-2 border-dashed border-slate-100 p-12 text-center">
                    <div>
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Welcome to BugTracker</h2>
                        <p className="max-w-xs mx-auto">Please select or create a workspace from the sidebar to start managing your projects.</p>
                    </div>
                </div>
            );
        }

        switch (activeView) {
            case 'settings':
                return <Settings />;
            case 'overview':
                return <Overview workspaceId={selectedWorkspace.id} />;
            case 'projects':
                if (selectedProject) {
                    return (
                        <KanbanBoard
                            project={selectedProject}
                            onBack={() => setSelectedProject(null)}
                        />
                    );
                }
                return (
                    <ProjectList
                        workspaceId={selectedWorkspace.id}
                        onProjectSelect={setSelectedProject}
                    />
                );
            default:
                return <Overview workspaceId={selectedWorkspace.id} />;
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans antialiased text-slate-900">
            <Sidebar
                currentWorkspace={selectedWorkspace}
                onWorkspaceSelect={(workspace) => {
                    setSelectedWorkspace(workspace);
                    setSelectedProject(null);
                    // Stay on projects view if workspace is changed, or move to overview
                    if (activeView !== 'projects' && activeView !== 'settings') {
                        setActiveView('overview');
                    }
                }}
                activeView={activeView}
                onViewChange={(view) => {
                    setActiveView(view);
                    setSelectedProject(null);
                }}
            />

            <main className="flex-1 overflow-auto relative">
                {renderContent()}
            </main>
        </div>
    );
};

export default Dashboard;
