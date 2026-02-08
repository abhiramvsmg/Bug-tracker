import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { ChevronLeft, Plus, X, AlertCircle, RefreshCw, GripVertical, Trash2 } from 'lucide-react';
import SortableTicket from './SortableTicket';

const COLUMNS = [
    { id: 'backlog', title: 'Backlog' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
];

const DroppableColumn = ({ column, tickets, onAdd, onDelete, onSelect }) => {
    const { setNodeRef } = useDroppable({
        id: column.id,
    });

    return (
        <div
            ref={setNodeRef}
            className="flex flex-col w-80 bg-slate-100 rounded-xl p-4 min-h-[500px]"
        >
            <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="font-bold text-slate-700 uppercase text-sm tracking-wider">
                    {column.title} <span className="ml-2 bg-slate-200 px-2 py-0.5 rounded-full text-xs">{tickets.length}</span>
                </h3>
                <button
                    onClick={() => onAdd(column.id)}
                    className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 rounded"
                >
                    <Plus size={18} />
                </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto min-h-0">
                <SortableContext items={tickets.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tickets.map(ticket => (
                        <SortableTicket
                            key={ticket.id}
                            ticket={ticket}
                            onDelete={() => onDelete(ticket.id)}
                            onSelect={onSelect}
                        />
                    ))}
                </SortableContext>

                {tickets.length === 0 && (
                    <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs text-center p-4">
                        Drop tickets here
                    </div>
                )}
            </div>
        </div>
    );
};

const KanbanBoard = ({ project, onBack }) => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTicketTitle, setNewTicketTitle] = useState('');
    const [newTicketStatus, setNewTicketStatus] = useState('backlog');
    const [newTicketAssignee, setNewTicketAssignee] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [filterPriority, setFilterPriority] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [commentText, setCommentText] = useState('');

    const { data: tickets, isLoading, isError, refetch, isFetching, error } = useQuery({
        queryKey: ['tickets', project?.id],
        queryFn: async () => {
            if (!project?.id) return [];
            const response = await api.get(`/projects/${project.id}/tickets/`);
            return response.data;
        },
        refetchInterval: 5000,
        retry: 3,
        enabled: !!project?.id,
        staleTime: 10000,
    });

    const { data: members } = useQuery({
        queryKey: ['members', project?.workspace_id],
        queryFn: async () => {
            const response = await api.get(`/workspaces/${project.workspace_id}/members`);
            return response.data;
        },
        enabled: !!project?.workspace_id
    });

    const updateMutation = useMutation({
        mutationFn: async ({ ticketId, status }) => {
            return api.patch(`/projects/${project.id}/tickets/${ticketId}`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tickets', project.id]);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (ticketId) => {
            return api.delete(`/projects/${project.id}/tickets/${ticketId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tickets', project.id]);
            if (selectedTicket?.id === ticketId) setSelectedTicket(null);
        },
    });

    const createMutation = useMutation({
        mutationFn: async ({ title, status, assignee_id }) => {
            return api.post(`/projects/${project.id}/tickets/`, {
                title,
                status,
                project_id: project.id,
                assignee_id: assignee_id || null
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tickets', project.id]);
            setIsModalOpen(false);
            setNewTicketTitle('');
            setNewTicketAssignee('');
        },
    });

    const commentMutation = useMutation({
        mutationFn: async ({ content, parent_id = null }) => {
            return api.post(`/projects/${project.id}/tickets/${selectedTicket.id}/comments`, {
                content,
                ticket_id: selectedTicket.id,
                parent_id
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tickets', project.id]);
            setCommentText('');
        }
    });

    const uploadMutation = useMutation({
        mutationFn: async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            return api.post(`/projects/${project.id}/tickets/${selectedTicket.id}/attachments`, formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tickets', project.id]);
        }
    });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;

        const ticketId = active.id;
        let newStatus = over.id;

        if (!COLUMNS.some(col => col.id === newStatus)) {
            const overTicket = tickets?.find(t => t.id === newStatus);
            if (overTicket) newStatus = overTicket.status;
        }

        if (COLUMNS.some(col => col.id === newStatus)) {
            const activeTicket = tickets?.find(t => t.id === ticketId);
            if (activeTicket && activeTicket.status !== newStatus) {
                updateMutation.mutate({ ticketId, status: newStatus });
            }
        }
    };

    const handleCreateTicket = (e) => {
        e.preventDefault();
        if (newTicketTitle.trim()) {
            createMutation.mutate({
                title: newTicketTitle,
                status: newTicketStatus,
                assignee_id: newTicketAssignee ? parseInt(newTicketAssignee) : null
            });
        }
    };

    const openCreateModal = (status) => {
        setNewTicketStatus(status);
        setIsModalOpen(true);
    };

    const filteredTickets = (tickets || []).filter(ticket => {
        const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
        const matchesType = filterType === 'all' || ticket.ticket_type === filterType;
        return matchesSearch && matchesPriority && matchesType;
    });

    const handleComment = (e, parentId = null) => {
        e.preventDefault();
        if (commentText.trim()) {
            commentMutation.mutate({ content: commentText, parent_id: parentId });
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) uploadMutation.mutate(file);
    };

    if (isLoading && !tickets) {
        return (
            <div className="p-8 h-full flex flex-col bg-slate-50">
                <div className="h-12 w-48 bg-slate-200 animate-pulse rounded-lg mb-8"></div>
                <div className="flex gap-6 overflow-x-auto pb-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-80 h-[500px] bg-slate-200/50 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (isError && !tickets) {
        return (
            <div className="p-8 h-full flex items-center justify-center bg-slate-50">
                <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-red-100 max-w-md">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Connection Lost</h2>
                    <p className="text-slate-500 mb-4 text-sm">We're having trouble reaching the server. Please check your connection.</p>
                    <button onClick={() => refetch()} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 mx-auto font-medium transition-all">
                        <RefreshCw size={18} />
                        Try to Reconnect
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 h-full flex flex-col bg-slate-50 relative">
            {(isFetching || isError) && (
                <div className="absolute top-4 right-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm z-10 transition-all bg-white">
                    {isError ? <div className="flex items-center gap-2 text-red-500"><AlertCircle size={10} /> Offline (Sync failed)</div> :
                        <div className="flex items-center gap-2 text-blue-500 animate-pulse"><RefreshCw size={10} className="animate-spin" /> Syncing...</div>}
                </div>
            )}

            <div className="flex flex-col gap-6 mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-2 hover:bg-white hover:shadow-md rounded-full transition-all text-slate-600">
                            <ChevronLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">{project?.name || 'Project'}</h1>
                            <p className="text-slate-500 text-sm">Board View</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex-1 min-w-[200px]">
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            className="w-full px-4 py-2 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-3 py-2 border rounded-lg text-sm bg-slate-50"
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                    >
                        <option value="all">Priority: All</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                    <select
                        className="px-3 py-2 border rounded-lg text-sm bg-slate-50"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">Type: All</option>
                        <option value="bug">Bug</option>
                        <option value="task">Task</option>
                        <option value="feature">Feature</option>
                    </select>
                </div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-6 flex-1 min-h-0 overflow-x-auto pb-4">
                    {COLUMNS.map(column => (
                        <DroppableColumn
                            key={column.id}
                            column={column}
                            tickets={filteredTickets.filter(t => t.status === column.id)}
                            onAdd={openCreateModal}
                            onDelete={(id) => deleteMutation.mutate(id)}
                            onSelect={setSelectedTicket}
                        />
                    ))}
                </div>
            </DndContext>

            {selectedTicket && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden text-slate-900 flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b">
                            <div className="flex items-center gap-3">
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-bold uppercase">BT-{selectedTicket.id}</span>
                                <h3 className="font-bold text-xl">{selectedTicket.title}</h3>
                            </div>
                            <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto p-8 grid grid-cols-3 gap-8">
                            <div className="col-span-2 space-y-8">
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-widest">Description</h4>
                                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedTicket.description || 'No description provided.'}</p>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest">Threaded Comments</h4>
                                    <div className="space-y-4 mb-6">
                                        {selectedTicket.comments?.length === 0 ? <p className="text-xs italic text-slate-400">No comments yet.</p> :
                                            selectedTicket.comments.map(comment => (
                                                <div key={comment.id} className="bg-slate-50 p-4 rounded-xl">
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-sm font-bold">{comment.author?.full_name || comment.author?.email}</span>
                                                        <span className="text-[10px] text-slate-400">{new Date(comment.created_at).toLocaleString()}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-600">{comment.content}</p>
                                                </div>
                                            ))}
                                    </div>
                                    <form onSubmit={handleComment} className="flex gap-2">
                                        <input
                                            type="text"
                                            className="flex-1 border-2 border-slate-100 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500"
                                            placeholder="Write a comment..."
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                        />
                                        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold">Post</button>
                                    </form>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest">Details</h4>
                                    <div className="space-y-4">
                                        <DetailItem label="Status" value={selectedTicket.status} color="bg-orange-50 text-orange-600" />
                                        <DetailItem label="Priority" value={selectedTicket.priority} color="bg-red-50 text-red-600" />
                                        <DetailItem label="Type" value={selectedTicket.ticket_type} color="bg-purple-50 text-purple-600" />
                                        <DetailItem label="Assignee" value={selectedTicket.assignee?.full_name || 'Unassigned'} color="bg-slate-200 text-slate-700" />
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest">Attachments</h4>
                                    <div className="space-y-2 mb-4">
                                        {selectedTicket.attachments?.length === 0 ? <p className="text-[10px] italic text-slate-400">No files uploaded.</p> :
                                            selectedTicket.attachments.map(att => (
                                                <a key={att.id} href={att.file_url} target="_blank" className="block text-xs text-blue-600 hover:underline">{att.file_name}</a>
                                            ))}
                                    </div>
                                    <label className="block">
                                        <span className="sr-only">Choose screenshot</span>
                                        <input type="file" className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" onChange={handleFileUpload} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden text-slate-900 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="font-bold text-xl">New Ticket</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateTicket} className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Ticket Title</label>
                                <input
                                    autoFocus
                                    type="text"
                                    className="w-full border-2 border-slate-100 rounded-xl p-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                    placeholder="What needs to be done?"
                                    value={newTicketTitle}
                                    onChange={(e) => setNewTicketTitle(e.target.value)}
                                    disabled={createMutation.isPending}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                                    <select
                                        className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none"
                                        value={newTicketStatus}
                                        onChange={(e) => setNewTicketStatus(e.target.value)}
                                        disabled={createMutation.isPending}
                                    >
                                        {COLUMNS.map(col => (
                                            <option key={col.id} value={col.id}>{col.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Assign To</label>
                                    <select
                                        className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none"
                                        value={newTicketAssignee}
                                        onChange={(e) => setNewTicketAssignee(e.target.value)}
                                        disabled={createMutation.isPending}
                                    >
                                        <option value="">Unassigned</option>
                                        {members?.map(member => (
                                            <option key={member.id} value={member.id}>{member.full_name || member.email}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending || !newTicketTitle.trim()}
                                    className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
                                >
                                    {createMutation.isPending ? 'Creating...' : 'Create Ticket'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailItem = ({ label, value, color }) => (
    <div className="flex justify-between items-center text-xs">
        <span className="text-slate-500 font-medium">{label}</span>
        <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${color}`}>{value}</span>
    </div>
);

export default KanbanBoard;
