import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';

const SortableTicket = ({ ticket, onDelete, onSelect }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: ticket.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 'auto',
    };

    const priorityColors = {
        low: 'bg-slate-100 text-slate-500',
        medium: 'bg-blue-50 text-blue-600',
        high: 'bg-orange-50 text-orange-600',
        critical: 'bg-red-50 text-red-600',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={() => onSelect(ticket)}
            className="group bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <div {...listeners} {...attributes} className="cursor-grab text-slate-300 hover:text-slate-500 p-1 hover:bg-slate-50 rounded">
                        <GripVertical size={14} />
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${priorityColors[ticket.priority] || 'bg-slate-100'}`}>
                        {ticket.priority || 'MED'}
                    </span>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="text-slate-300 hover:text-red-500 p-1 hover:bg-red-50 rounded transition-all opacity-0 group-hover:opacity-100"
                    title="Delete Ticket"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{ticket.ticket_type || 'task'}</span>
            <h4 className="font-bold text-slate-900 text-sm mb-1 leading-tight">{ticket.title}</h4>
            <p className="text-slate-500 text-[11px] line-clamp-2 leading-relaxed mb-4">{ticket.description || 'No description'}</p>

            <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-50">
                <span className="text-[9px] font-bold text-slate-300">BT-{ticket.id}</span>
                {ticket.assignee && (
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                            {(ticket.assignee.full_name || ticket.assignee.email)[0].toUpperCase()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SortableTicket;
