import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Task, Category, Status } from '../types';
import { useGame } from './GameContext';

interface TaskContextType {
    tasks: Task[];
    categories: Category[];
    addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    moveTask: (taskId: string, categoryId: string) => void;
    toggleTaskStatus: (taskId: string, status: Status) => void;
    reorderTasks: (taskIds: string[]) => void;
    addCategory: (name: string) => string;
    deleteCategory: (categoryId: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
};

const INITIAL_CATEGORIES: Category[] = [
    { id: 'inbox', name: 'Inbox', type: 'system' },
    { id: 'work', name: 'Work', type: 'custom' },
    { id: 'personal', name: 'Personal', type: 'custom' },
    { id: 'health', name: 'Health', type: 'custom' },
    { id: 'learning', name: 'Learning', type: 'custom' },
];

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { incrementQuestCount, decrementQuestCount } = useGame();

    const [tasks, setTasks] = useState<Task[]>(() => {
        const saved = localStorage.getItem('questboard_tasks');
        return saved ? JSON.parse(saved) : [];
    });

    const [categories, setCategories] = useState<Category[]>(() => {
        const saved = localStorage.getItem('questboard_categories');
        return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    });

    useEffect(() => {
        localStorage.setItem('questboard_tasks', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        localStorage.setItem('questboard_categories', JSON.stringify(categories));
    }, [categories]);

    const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
        const newTask: Task = {
            ...taskData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };
        setTasks(prev => [...prev, newTask]);
    };

    const updateTask = (id: string, updates: Partial<Task>) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const deleteTask = (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const moveTask = (taskId: string, categoryId: string) => {
        updateTask(taskId, { categoryId });
    };



    const toggleTaskStatus = (taskId: string, status: Status) => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            if (task.status !== 'done' && status === 'done') {
                incrementQuestCount();
            } else if (task.status === 'done' && status !== 'done') {
                decrementQuestCount();
            }
        }
        updateTask(taskId, { status });
    };

    const reorderTasks = (taskIds: string[]) => {
        setTasks(prev => {
            // Create a map for quick lookup
            const taskMap = new Map(prev.map(t => [t.id, t]));
            // Build new array with reordered tasks first, then others
            const reorderedTasks: Task[] = [];
            const otherTasks: Task[] = [];

            // Add tasks in the new order
            taskIds.forEach(id => {
                const task = taskMap.get(id);
                if (task) {
                    reorderedTasks.push(task);
                    taskMap.delete(id);
                }
            });

            // Add remaining tasks
            prev.forEach(t => {
                if (taskMap.has(t.id)) {
                    otherTasks.push(t);
                }
            });

            return [...reorderedTasks, ...otherTasks];
        });
    };

    const addCategory = (name: string) => {
        const newId = `cat_${crypto.randomUUID().split('-')[0]}`;
        const newCategory: Category = {
            id: newId,
            name: name,
            type: 'custom'
        };
        setCategories(prev => [...prev, newCategory]);
        return newId;
    };

    const deleteCategory = (categoryId: string) => {
        const category = categories.find(c => c.id === categoryId);
        if (category?.type === 'system') return;

        setTasks(prev => prev.map(t =>
            t.categoryId === categoryId ? { ...t, categoryId: 'inbox' } : t
        ));
        setCategories(prev => prev.filter(c => c.id !== categoryId));
    };

    return (
        <TaskContext.Provider value={{ tasks, categories, addTask, updateTask, deleteTask, moveTask, toggleTaskStatus, reorderTasks, addCategory, deleteCategory }}>
            {children}
        </TaskContext.Provider>
    );
};
