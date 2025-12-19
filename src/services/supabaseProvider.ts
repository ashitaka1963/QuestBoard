import { supabase } from '../lib/supabase';
import type { StorageProvider } from './storage';
import type { Task, Category, UserStats } from '../types';

export class SupabaseProvider implements StorageProvider {
    private async getUserId() {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.user?.id;
    }

    async getTasks(): Promise<Task[]> {
        const userId = await this.getUserId();
        if (!userId) return [];

        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tasks from Supabase:', error);
            return [];
        }

        return data.map(t => ({
            id: t.id,
            title: t.title,
            description: t.description,
            dueDate: t.due_date,
            priority: t.priority,
            status: t.status,
            xp: t.xp,
            categoryId: t.category_id,
            tags: t.tags || [],
            subtasks: typeof t.subtasks === 'string' ? JSON.parse(t.subtasks) : (t.subtasks || []),
            createdAt: t.created_at,
            completedAt: t.completed_at
        })) as Task[];
    }

    async saveTasks(tasks: Task[]): Promise<void> {
        const userId = await this.getUserId();
        if (!userId) return;

        const { error } = await supabase
            .from('tasks')
            .upsert(tasks.map(t => ({
                id: t.id,
                user_id: userId,
                title: t.title,
                description: t.description,
                due_date: t.dueDate || null, // Convert empty string to null
                priority: t.priority,
                status: t.status,
                xp: t.xp,
                category_id: t.categoryId,
                tags: t.tags,
                subtasks: t.subtasks,
                created_at: t.createdAt,
                completed_at: t.completedAt || null // Also convert empty string to null
            })));

        if (error) console.error('Error saving tasks to Supabase:', error);
    }

    async getCategories(): Promise<Category[]> {
        const userId = await this.getUserId();
        if (!userId) return [];

        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching categories from Supabase:', error);
            return [];
        }
        return data as Category[];
    }

    async saveCategories(categories: Category[]): Promise<void> {
        const userId = await this.getUserId();
        if (!userId) return;

        const { error } = await supabase
            .from('categories')
            .upsert(categories.map(c => ({
                id: c.id,
                name: c.name,
                type: c.type,
                user_id: userId
            })));

        if (error) console.error('Error saving categories to Supabase:', error);
    }

    async getStats(): Promise<UserStats | null> {
        const userId = await this.getUserId();
        if (!userId) return null;

        const { data, error } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching stats from Supabase:', error);
            return null;
        }

        if (!data) return null;

        return {
            level: data.level,
            currentXp: data.current_xp,
            nextLevelXp: data.next_level_xp,
            totalXpEarned: data.total_xp_earned,
            questsCompleted: data.quests_completed,
            unlockedAchievements: data.unlocked_achievements || []
        };
    }

    async saveStats(stats: UserStats): Promise<void> {
        const userId = await this.getUserId();
        if (!userId) return;

        const { error } = await supabase
            .from('user_stats')
            .upsert({
                user_id: userId,
                level: stats.level,
                current_xp: stats.currentXp,
                next_level_xp: stats.nextLevelXp,
                total_xp_earned: stats.totalXpEarned,
                quests_completed: stats.questsCompleted,
                unlocked_achievements: stats.unlockedAchievements,
                updated_at: new Date().toISOString()
            });

        if (error) console.error('Error saving stats to Supabase:', error);
    }
}
