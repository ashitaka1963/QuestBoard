import React from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from './TaskCard';
import { PlusIcon, DeleteIcon } from './Icons';
import type { Task } from '../types';
import '../styles/AllQuestsView.css';

interface AllQuestsViewProps {
    onEditTask?: (task: Task) => void;
    onAddTask?: (categoryId: string) => void;
    onTaskContextMenu?: (e: React.MouseEvent, task: Task) => void;
}

export const AllQuestsView: React.FC<AllQuestsViewProps> = ({ onEditTask, onAddTask, onTaskContextMenu }) => {
    const { tasks, categories, deleteCategory, updateTask } = useTasks();
    const [showEmpty, setShowEmpty] = React.useState(false);
    const [draggedTaskId, setDraggedTaskId] = React.useState<string | null>(null);
    const [dragOverCategoryId, setDragOverCategoryId] = React.useState<string | null>(null);

    // Only incomplete tasks
    const incompleteTasks = tasks.filter(task => task.status !== 'done');
    const totalCount = incompleteTasks.length;

    // Helper to sort tasks
    const sortTasks = (tasksToSort: Task[]) => {
        return [...tasksToSort].sort((a, b) => {
            // High priority first
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            // Earlier due date first
            if (a.dueDate && b.dueDate) {
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            }
            if (a.dueDate) return -1;
            if (b.dueDate) return 1;
            return 0;
        });
    };

    const handleDeleteCategory = (categoryId: string, categoryName: string) => {
        if (window.confirm(`カテゴリ「${categoryName}」を削除しますか？\n含まれるタスクはInboxに移動されます。`)) {
            deleteCategory(categoryId);
        }
    };

    // Drag and Drop Handlers
    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        setDraggedTaskId(taskId);
        e.dataTransfer.effectAllowed = 'move';
        // Set invisible drag image if desired, or let browser handle it
    };

    const handleDragOver = (e: React.DragEvent, categoryId: string) => {
        e.preventDefault(); // Necessary to allow dropping
        e.dataTransfer.dropEffect = 'move';

        if (dragOverCategoryId !== categoryId) {
            setDragOverCategoryId(categoryId);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        // Only clear if leaving the drop zone completely, not entering a child
        // This simple check might flicker, but for now it's okay combined with setDragOverCategoryId
    };

    const handleDrop = (e: React.DragEvent, targetCategoryId: string) => {
        e.preventDefault();
        setDragOverCategoryId(null);

        if (draggedTaskId) {
            const task = tasks.find(t => t.id === draggedTaskId);
            if (task && task.categoryId !== targetCategoryId) {
                updateTask(draggedTaskId, { categoryId: targetCategoryId });
            }
        }
        setDraggedTaskId(null);
    };

    const hasAnyTasks = totalCount > 0;

    return (
        <section className="all-quests-view">
            <div className="quests-header">
                <div className="quests-title">
                    <h2>📜 クエスト一覧</h2>
                    <div className="header-controls">
                        <label className="show-empty-toggle">
                            <input
                                type="checkbox"
                                checked={showEmpty}
                                onChange={(e) => setShowEmpty(e.target.checked)}
                            />
                            <span>空のカテゴリを表示</span>
                        </label>
                        <span className="quest-count">{totalCount} クエスト</span>
                    </div>
                </div>
            </div>

            {!hasAnyTasks && !showEmpty ? (
                <div className="empty-state">
                    <p>🗡️ クエストがありません</p>
                    <p className="empty-hint">新しいクエストを追加しましょう！</p>
                </div>
            ) : (
                <div className="category-groups" onDragLeave={() => setDragOverCategoryId(null)}>
                    {categories.map(category => {
                        const categoryTasks = incompleteTasks.filter(t => t.categoryId === category.id);
                        if (categoryTasks.length === 0 && !showEmpty && dragOverCategoryId !== category.id) return null;

                        const sortedCategoryTasks = sortTasks(categoryTasks);
                        const isDragOver = dragOverCategoryId === category.id;

                        return (
                            <div
                                key={category.id}
                                className={`category-section ${isDragOver ? 'drag-over' : ''}`}
                                onDragOver={(e) => handleDragOver(e, category.id)}
                                onDrop={(e) => handleDrop(e, category.id)}
                            >
                                <h3 className={`category-header-title category-text-${category.id}`}>
                                    {category.name}
                                    <span className="category-count">{categoryTasks.length}</span>
                                    {category.type === 'custom' && (
                                        <button
                                            className="delete-category-btn"
                                            onClick={() => handleDeleteCategory(category.id, category.name)}
                                            title="削除(Inboxへ移動)"
                                        >
                                            <DeleteIcon size={14} />
                                        </button>
                                    )}
                                </h3>
                                <div className="quests-list">
                                    {categoryTasks.length > 0 ? (
                                        sortedCategoryTasks.map(task => (
                                            <div
                                                key={task.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, task.id)}
                                                className={`draggable-task-wrapper ${draggedTaskId === task.id ? 'dragging' : ''}`}
                                            >
                                                <TaskCard
                                                    task={task}
                                                    onEdit={onEditTask}
                                                    onContextMenu={onTaskContextMenu}
                                                // categoryName is redundant here as it's grouped by category header
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="empty-category-message">
                                            {isDragOver ? 'ここへ移動' : 'クエストはありません'}
                                        </div>
                                    )}
                                </div>
                                <button
                                    className="quick-add-btn"
                                    onClick={() => onAddTask?.(category.id)}
                                    aria-label={`Add task to ${category.name}`}
                                >
                                    <PlusIcon size={16} />
                                    <span>追加</span>
                                </button>
                            </div>
                        );
                    })}

                    {/* Handle tasks with unknown categories just in case */}
                    {incompleteTasks.filter(t => !categories.find(c => c.id === t.categoryId)).length > 0 && (
                        <div className="category-section">
                            <h3 className="category-header-title">
                                その他
                                <span className="category-count">
                                    {incompleteTasks.filter(t => !categories.find(c => c.id === t.categoryId)).length}
                                </span>
                            </h3>
                            <div className="quests-list">
                                {sortTasks(incompleteTasks.filter(t => !categories.find(c => c.id === t.categoryId))).map(task => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onEdit={onEditTask}
                                        onContextMenu={onTaskContextMenu}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};
