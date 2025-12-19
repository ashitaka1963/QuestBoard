import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UserStats, Achievement } from '../types';
import { storage } from '../services';

export const ACHIEVEMENTS: Achievement[] = [
    { id: 'first_blood', title: '冒険の始まり', description: '初めてクエストを完了する', icon: '🔰', requirement: 1, type: 'quest_count' },
    { id: 'quest_novice', title: '駆け出し冒険者', description: 'クエストを5回完了する', icon: '🗡️', requirement: 5, type: 'quest_count' },
    { id: 'quest_veteran', title: '熟練の冒険者', description: 'クエストを20回完了する', icon: '⚔️', requirement: 20, type: 'quest_count' },
    { id: 'level_5', title: '一人前', description: 'レベル5に到達する', icon: '⭐', requirement: 5, type: 'level' },
    { id: 'level_10', title: '英雄の兆し', description: 'レベル10に到達する', icon: '👑', requirement: 10, type: 'level' },
    { id: 'quest_master', title: '伝説の勇者', description: 'クエストを50回完了する', icon: '🐉', requirement: 50, type: 'quest_count' },
];

interface GameContextType {
    stats: UserStats;
    addXp: (amount: number) => void;
    removeXp: (amount: number) => void;
    incrementQuestCount: () => void;
    decrementQuestCount: () => void;
    recentUnlocks: Achievement[];
    clearRecentUnlocks: () => void;
    isLoading: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};

const INITIAL_STATS: UserStats = {
    level: 1,
    currentXp: 0,
    nextLevelXp: 100,
    totalXpEarned: 0,
    questsCompleted: 0,
    unlockedAchievements: [],
};

import { useAuth } from './AuthContext';

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
    const [isLoading, setIsLoading] = useState(true);
    const [recentUnlocks, setRecentUnlocks] = useState<Achievement[]>([]);

    // Load data
    useEffect(() => {
        const loadStats = async () => {
            setIsLoading(true);
            try {
                const loadedStats = await storage.getStats();
                if (loadedStats) {
                    setStats({
                        ...INITIAL_STATS,
                        ...loadedStats,
                        unlockedAchievements: Array.isArray(loadedStats.unlockedAchievements) ? loadedStats.unlockedAchievements : [],
                        questsCompleted: typeof loadedStats.questsCompleted === 'number' ? loadedStats.questsCompleted : 0
                    });
                } else {
                    setStats(INITIAL_STATS);
                }
            } catch (error) {
                console.error('Failed to load stats:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadStats();
    }, [user]);

    // Save data
    useEffect(() => {
        if (!isLoading) {
            storage.saveStats(stats);
        }
    }, [stats, isLoading]);

    const calculateNextLevelXp = (level: number) => {
        return Math.floor(100 * (level * 1.2));
    };

    const calculatePrevLevelXp = (level: number) => {
        if (level <= 1) return 100;
        return Math.floor(100 * ((level - 1) * 1.2));
    };

    const checkAchievements = (currentStats: UserStats, newUnlocks: string[] = []) => {
        const newlyUnlocked: Achievement[] = [];
        const unlockedIds = [...currentStats.unlockedAchievements, ...newUnlocks];

        ACHIEVEMENTS.forEach(achievement => {
            if (unlockedIds.includes(achievement.id)) return;

            let isUnlocked = false;
            if (achievement.type === 'level' && currentStats.level >= achievement.requirement) {
                isUnlocked = true;
            } else if (achievement.type === 'quest_count' && currentStats.questsCompleted >= achievement.requirement) {
                isUnlocked = true;
            }

            if (isUnlocked) {
                newlyUnlocked.push(achievement);
            }
        });

        return newlyUnlocked;
    };

    const addXp = (amount: number) => {
        setStats(prev => {
            let { level, currentXp, nextLevelXp, totalXpEarned, questsCompleted, unlockedAchievements } = prev;

            currentXp += amount;
            totalXpEarned += amount;

            while (currentXp >= nextLevelXp) {
                currentXp -= nextLevelXp;
                level += 1;
                nextLevelXp = calculateNextLevelXp(level);
            }

            const newStats = { level, currentXp, nextLevelXp, totalXpEarned, questsCompleted, unlockedAchievements };
            const newUnlocks = checkAchievements(newStats);

            if (newUnlocks.length > 0) {
                setRecentUnlocks(curr => [...curr, ...newUnlocks]);
                newStats.unlockedAchievements = [...unlockedAchievements, ...newUnlocks.map(a => a.id)];
            }

            return newStats;
        });
    };

    const removeXp = (amount: number) => {
        setStats(prev => {
            let { level, currentXp, nextLevelXp, totalXpEarned, questsCompleted, unlockedAchievements } = prev;

            currentXp -= amount;
            totalXpEarned = Math.max(0, totalXpEarned - amount);

            while (currentXp < 0 && level > 1) {
                level -= 1;
                const prevLevelXp = calculatePrevLevelXp(level);
                currentXp += prevLevelXp;
                nextLevelXp = calculateNextLevelXp(level);
            }

            if (level === 1 && currentXp < 0) {
                currentXp = 0;
            }

            return { level, currentXp, nextLevelXp, totalXpEarned, questsCompleted, unlockedAchievements };
        });
    };

    const incrementQuestCount = () => {
        setStats(prev => {
            const newCount = prev.questsCompleted + 1;
            const newStats = { ...prev, questsCompleted: newCount };

            const newUnlocks = checkAchievements(newStats);
            if (newUnlocks.length > 0) {
                setRecentUnlocks(curr => [...curr, ...newUnlocks]);
                newStats.unlockedAchievements = [...prev.unlockedAchievements, ...newUnlocks.map(a => a.id)];
            }

            return newStats;
        });
    };

    const decrementQuestCount = () => {
        setStats(prev => ({
            ...prev,
            questsCompleted: Math.max(0, prev.questsCompleted - 1)
        }));
    };

    const clearRecentUnlocks = () => {
        setRecentUnlocks([]);
    };

    return (
        <GameContext.Provider value={{ stats, addXp, removeXp, incrementQuestCount, decrementQuestCount, recentUnlocks, clearRecentUnlocks, isLoading }}>
            {children}
        </GameContext.Provider>
    );
};
