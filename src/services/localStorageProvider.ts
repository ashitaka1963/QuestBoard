import type { StorageProvider } from './storage';
import type { Task, Category, UserStats } from '../types';

export class LocalStorageProvider implements StorageProvider {
    private readonly TASKS_KEY = 'questboard_tasks';
    private readonly CATEGORIES_KEY = 'questboard_categories';
    private readonly STATS_KEY = 'questboard_stats';

    async getTasks(): Promise<Task[]> {
        const saved = localStorage.getItem(this.TASKS_KEY);
        return saved ? JSON.parse(saved) : [];
    }

    async saveTasks(tasks: Task[]): Promise<void> {
        localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
    }

    async getCategories(): Promise<Category[]> {
        const saved = localStorage.getItem(this.CATEGORIES_KEY);
        return saved ? JSON.parse(saved) : [];
    }

    async saveCategories(categories: Category[]): Promise<void> {
        localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
    }

    async getStats(): Promise<UserStats | null> {
        const saved = localStorage.getItem(this.STATS_KEY);
        return saved ? JSON.parse(saved) : null;
    }

    async saveStats(stats: UserStats): Promise<void> {
        localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
    }
}
