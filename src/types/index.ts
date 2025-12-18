export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'done';

export interface SubTask {
    id: string;
    title: string;
    isCompleted: boolean;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    dueDate: string; // ISO String
    priority: Priority;
    tags: string[];
    subtasks: SubTask[];
    status: Status;
    xp: number; // XP awarded upon completion
    categoryId: string;
    createdAt: string;
    completedAt?: string;
}

export interface Category {
    id: string;
    name: string;
    type: 'system' | 'custom'; // 'system' for Inbox, etc.
}

export interface UserStats {
    level: number;
    currentXp: number;
    nextLevelXp: number;
    totalXpEarned: number;
}
