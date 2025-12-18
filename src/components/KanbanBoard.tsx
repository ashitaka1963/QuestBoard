import React from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from './TaskCard';
import type { Task } from '../types';
import '../styles/KanbanBoard.css';

interface KanbanBoardProps {
    onEditTask?: (task: Task) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ onEditTask }) => {
    const { tasks, categories, moveTask } = useTasks();

    const getTasksByCategory = (categoryId: string) => {
        return tasks.filter(task => task.categoryId === categoryId && task.status !== 'done');
    };

    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        e.dataTransfer.setData('taskId', taskId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, categoryId: string) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) {
            moveTask(taskId, categoryId);
        }
    };

    return (
        <section className="kanban-board">
            <div className="section-header">
                <h2>📁 カテゴリ</h2>
            </div>

            <div className="kanban-columns">
                {categories.map(category => (
                    <div
                        key={category.id}
                        className="kanban-column"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, category.id)}
                    >
                        <div className="column-header">
                            <h3>{category.name}</h3>
                            <span className="column-count">
                                {getTasksByCategory(category.id).length}
                            </span>
                        </div>
                        <div className="column-tasks">
                            {getTasksByCategory(category.id).map(task => (
                                <div
                                    key={task.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, task.id)}
                                    className="draggable-task"
                                >
                                    <TaskCard task={task} onEdit={onEditTask} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
