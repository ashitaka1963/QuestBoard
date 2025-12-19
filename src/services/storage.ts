import type { Task, Category, UserStats } from '../types';

export interface StorageProvider {
    // Tasks
    getTasks(): Promise<Task[]>;
    saveTasks(tasks: Task[]): Promise<void>;

    // Categories
    getCategories(): Promise<Category[]>;
    saveCategories(categories: Category[]): Promise<void>;

    // Stats
    getStats(): Promise<UserStats | null>;
    saveStats(stats: UserStats): Promise<void>;
}
