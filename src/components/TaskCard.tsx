import React, { useState } from 'react';
import type { Task } from '../types';
import { useGame } from '../context/GameContext';
import { useTasks } from '../context/TaskContext';
import { CheckIcon, FolderIcon, CalendarIcon, StarIcon, DeleteIcon } from './Icons';
import '../styles/TaskCard.css';

interface TaskCardProps {
    task: Task;
    onEdit?: (task: Task) => void;
    categoryName?: string;
    onContextMenu?: (e: React.MouseEvent, task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, categoryName, onContextMenu }) => {
    const { addXp, removeXp } = useGame();
    const { toggleTaskStatus, deleteTask } = useTasks();
    const [showStamp, setShowStamp] = useState(false);

    const handleToggleComplete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (task.status === 'done') {
            // Revert to incomplete - deduct XP
            toggleTaskStatus(task.id, 'todo');
            removeXp(task.xp);
        } else {
            // Show stamp animation first
            setShowStamp(true);

            // Hide stamp after animation
            setTimeout(() => setShowStamp(false), 1000);

            // Delay status update to allow animation to play before task is filtered out
            setTimeout(() => {
                toggleTaskStatus(task.id, 'done');
                addXp(task.xp);
            }, 600);
        }
    };

    const getPriorityClass = () => {
        return `priority-${task.priority}`;
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
    };

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    const isOverdue = task.dueDate && task.status !== 'done' && task.dueDate.split('T')[0] < today;
    const isDueToday = task.dueDate && task.status !== 'done' && task.dueDate.split('T')[0] === today;

    return (
        <div
            className={`task-card ${task.status === 'done' ? 'completed' : ''} ${isOverdue ? 'overdue' : ''} ${isDueToday ? 'due-today' : ''}`}
            onContextMenu={(e) => {
                if (onContextMenu) {
                    e.preventDefault();
                    onContextMenu(e, task);
                }
            }}
        >
            <div className="task-card-header">
                <button
                    className={`checkbox ${task.status === 'done' ? 'checked' : ''}`}
                    onClick={handleToggleComplete}
                    aria-label={task.status === 'done' ? 'Mark as incomplete' : 'Complete task'}
                >
                    {task.status === 'done' && <CheckIcon size={14} />}
                </button>
                <div
                    className="task-info clickable"
                    onClick={() => onEdit?.(task)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onEdit?.(task)}
                >
                    <h3 className="task-title">{task.title}</h3>
                    {task.description && (
                        <p className="task-description">{task.description}</p>
                    )}
                </div>
                <div className={`priority-indicator ${getPriorityClass()}`} />
            </div>

            <div className="task-card-footer" onClick={() => onEdit?.(task)}>
                <div className="task-meta">
                    {categoryName && (
                        <span className={`category-badge category-${task.categoryId}`}>
                            <FolderIcon size={12} />
                            {categoryName}
                        </span>
                    )}
                    {task.dueDate && (
                        <span className={`due-date ${isOverdue ? 'overdue' : ''} ${isDueToday ? 'due-today' : ''}`}>
                            <CalendarIcon size={12} />
                            {formatDate(task.dueDate)}
                        </span>
                    )}
                    <span className="xp-badge">
                        <StarIcon size={10} />
                        +{task.xp} XP
                    </span>
                </div>
            </div>

            {task.subtasks.length > 0 && (
                <div className="subtasks-progress">
                    <span className="subtask-count">
                        {task.subtasks.filter(s => s.isCompleted).length}/{task.subtasks.length} subtasks
                    </span>
                </div>
            )}

            <div className="task-actions">
                <button
                    className="action-btn delete"
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                    }}
                >
                    <DeleteIcon size={16} />
                </button>
            </div>
            {showStamp && (
                <div className="completion-stamp">
                    <div className="stamp-content">完了</div>
                </div>
            )}
        </div>
    );
};
