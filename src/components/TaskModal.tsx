import React, { useState, useEffect } from 'react';
import type { Task, Priority, Status } from '../types';
import { useTasks } from '../context/TaskContext';
import '../styles/TaskModal.css';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingTask?: Task | null;
    initialCategoryId?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, editingTask, initialCategoryId }) => {
    const { addTask, updateTask, addCategory, categories } = useTasks();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState<Priority>('medium');
    const [categoryId, setCategoryId] = useState('inbox');
    const [xp, setXp] = useState(10);

    // New category state
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title);
            setDescription(editingTask.description || '');
            setDueDate(editingTask.dueDate?.split('T')[0] || '');
            setPriority(editingTask.priority);
            setCategoryId(editingTask.categoryId);
            setXp(editingTask.xp);
        } else {
            resetForm();
        }
    }, [editingTask, isOpen, initialCategoryId]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setDueDate(''); // Default to empty for new tasks
        setPriority('medium');
        setCategoryId(initialCategoryId || 'inbox');
        setXp(10);
        setIsCreatingCategory(false);
        setNewCategoryName('');
    };

    const handleCreateCategory = () => {
        if (!newCategoryName.trim()) return;
        const newId = addCategory(newCategoryName.trim());
        setCategoryId(newId);
        setIsCreatingCategory(false);
        setNewCategoryName('');
    };

    // Quick date helper functions
    const getDateString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const setToday = () => {
        setDueDate(getDateString(new Date()));
    };

    const setTomorrow = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setDueDate(getDateString(tomorrow));
    };

    const setNextWeek = () => {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        setDueDate(getDateString(nextWeek));
    };

    const clearDate = () => {
        setDueDate('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) return;

        const taskData = {
            title: title.trim(),
            description: description.trim(),
            dueDate: dueDate, // Save as YYYY-MM-DD string directly
            priority,
            tags: editingTask?.tags || [],
            subtasks: editingTask?.subtasks || [],
            status: (editingTask?.status || 'todo') as Status,
            xp,
            categoryId,
        };

        if (editingTask) {
            updateTask(editingTask.id, taskData);
        } else {
            addTask(taskData);
        }

        onClose();
    };

    const DIFFICULTY_LEVELS = [
        { value: 10, label: 'EASY - 10 XP' },
        { value: 30, label: 'NORMAL - 30 XP' },
        { value: 50, label: 'HARD - 50 XP' },
    ];

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{editingTask ? 'タスクを編集' : '新しいクエスト'}</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">タイトル *</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="タスク名を入力..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">詳細</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="タスクの詳細..."
                            rows={3}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="dueDate">期限</label>
                            <div className="date-input-wrapper">
                                <input
                                    id="dueDate"
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                />
                                {dueDate && (
                                    <button
                                        type="button"
                                        className="clear-date-btn"
                                        onClick={clearDate}
                                        aria-label="Clear date"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                            <div className="quick-date-buttons">
                                <button type="button" className="quick-date-btn" onClick={setToday}>
                                    今日
                                </button>
                                <button type="button" className="quick-date-btn" onClick={setTomorrow}>
                                    明日
                                </button>
                                <button type="button" className="quick-date-btn" onClick={setNextWeek}>
                                    来週
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="priority">優先度</label>
                            <select
                                id="priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as Priority)}
                            >
                                <option value="low">低</option>
                                <option value="medium">中</option>
                                <option value="high">高</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">カテゴリ</label>
                            {isCreatingCategory ? (
                                <div className="new-category-input">
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        placeholder="カテゴリ名..."
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleCreateCategory();
                                            }
                                        }}
                                    />
                                    <button type="button" onClick={handleCreateCategory}>追加</button>
                                    <button type="button" onClick={() => setIsCreatingCategory(false)}>✕</button>
                                </div>
                            ) : (
                                <select
                                    id="category"
                                    value={categoryId}
                                    onChange={(e) => {
                                        if (e.target.value === '__NEW__') {
                                            setIsCreatingCategory(true);
                                        } else {
                                            setCategoryId(e.target.value);
                                        }
                                    }}
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                    <option value="__NEW__">+ 新しいカテゴリを作成...</option>
                                </select>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="xp">難易度 (獲得XP)</label>
                            <select
                                id="xp"
                                value={xp}
                                onChange={(e) => setXp(Number(e.target.value))}
                            >
                                {DIFFICULTY_LEVELS.map(level => (
                                    <option key={level.value} value={level.value}>
                                        {level.label}
                                    </option>
                                ))}
                                {!DIFFICULTY_LEVELS.some(l => l.value === xp) && (
                                    <option value={xp}>カスタム ({xp} XP)</option>
                                )}
                            </select>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            キャンセル
                        </button>
                        <button type="submit" className="btn-primary">
                            {editingTask ? '更新' : 'クエスト開始！'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
