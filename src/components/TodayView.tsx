import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from './TaskCard';
import { ScrollIcon, DragIcon } from './Icons';
import type { Task } from '../types';
import '../styles/TodayView.css';

interface TodayViewProps {
    onEditTask?: (task: Task) => void;
    onTaskContextMenu?: (e: React.MouseEvent, task: Task) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({ onEditTask, onTaskContextMenu }) => {
    const { tasks, categories, reorderTasks } = useTasks();
    const [showCompleted, setShowCompleted] = useState(false);
    const [draggedId, setDraggedId] = useState<string | null>(null);

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    // All tasks due today (including completed)
    const allTodayTasks = tasks.filter(task => {
        const taskDate = task.dueDate?.split('T')[0];
        return taskDate === today;
    });

    // Separate incomplete and completed tasks
    const incompleteTasks = allTodayTasks.filter(task => task.status !== 'done');
    const completedTasks = allTodayTasks.filter(task => task.status === 'done');

    // Display tasks based on toggle
    const displayTasks = showCompleted
        ? [...incompleteTasks, ...completedTasks]
        : incompleteTasks;

    // Completed tasks count
    const completedCount = completedTasks.length;
    const totalCount = allTodayTasks.length;
    const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    // Get category name helper
    const getCategoryName = (categoryId: string) => {
        const category = categories.find(c => c.id === categoryId);
        return category?.name || categoryId;
    };

    // Drag and drop handlers (only for incomplete tasks)
    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        setDraggedId(taskId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, taskId: string) => {
        e.preventDefault();
        if (draggedId && draggedId !== taskId) {
            // Highlight drop target
            e.currentTarget.classList.add('drag-over');
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.currentTarget.classList.remove('drag-over');
    };

    const handleDrop = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');

        if (draggedId && draggedId !== targetId) {
            const currentOrder = incompleteTasks.map(t => t.id);
            const draggedIndex = currentOrder.indexOf(draggedId);
            const targetIndex = currentOrder.indexOf(targetId);

            if (draggedIndex !== -1 && targetIndex !== -1) {
                // Remove dragged item and insert at new position
                currentOrder.splice(draggedIndex, 1);
                currentOrder.splice(targetIndex, 0, draggedId);
                reorderTasks(currentOrder);
            }
        }
        setDraggedId(null);
    };

    const handleDragEnd = () => {
        setDraggedId(null);
    };

    return (
        <section className="today-view">
            <div className="section-header">
                <h2><ScrollIcon size={20} /> 今日の予定</h2>
                <span className="task-count">{completedCount}/{totalCount} 完了</span>
            </div>

            {totalCount > 0 && (
                <div className="today-progress">
                    <div className="today-progress-bar">
                        <div
                            className="today-progress-fill"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            )}

            {completedCount > 0 && (
                <label className="show-completed-toggle">
                    <input
                        type="checkbox"
                        checked={showCompleted}
                        onChange={(e) => setShowCompleted(e.target.checked)}
                    />
                    <span>完了したタスクを表示</span>
                </label>
            )}

            {displayTasks.length === 0 ? (
                <div className="empty-state">
                    <p>{totalCount > 0 ? '🎉 今日のタスクは全て完了！' : '📝 今日のタスクはありません'}</p>
                </div>
            ) : (
                <div className="today-tasks-list">
                    {displayTasks.map(task => (
                        <div
                            key={task.id}
                            className={`draggable-task-wrapper ${task.status !== 'done' ? 'draggable' : ''} ${draggedId === task.id ? 'dragging' : ''}`}
                            draggable={task.status !== 'done'}
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            onDragOver={(e) => task.status !== 'done' ? handleDragOver(e, task.id) : undefined}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => task.status !== 'done' ? handleDrop(e, task.id) : undefined}
                            onDragEnd={handleDragEnd}
                        >
                            {task.status !== 'done' && (
                                <span className="drag-handle"><DragIcon size={16} /></span>
                            )}
                            <TaskCard
                                task={task}
                                onEdit={onEditTask}
                                categoryName={getCategoryName(task.categoryId)}
                                onContextMenu={onTaskContextMenu}
                            />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};
