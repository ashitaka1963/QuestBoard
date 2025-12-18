import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UserStats, Achievement } from '../types';

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
    recentUnlocks: Achievement[]; // For notifications
    clearRecentUnlocks: () => void;
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

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [stats, setStats] = useState<UserStats>(() => {
        const saved = localStorage.getItem('questboard_stats');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Migration for old data
            return {
                ...INITIAL_STATS,
                ...parsed,
                // Ensure array exists
                unlockedAchievements: Array.isArray(parsed.unlockedAchievements) ? parsed.unlockedAchievements : [],
                questsCompleted: typeof parsed.questsCompleted === 'number' ? parsed.questsCompleted : 0
            };
        }
        return INITIAL_STATS;
    });

    const [recentUnlocks, setRecentUnlocks] = useState<Achievement[]>([]);

    useEffect(() => {
        localStorage.setItem('questboard_stats', JSON.stringify(stats));
    }, [stats]);

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

            // Level up logic
            while (currentXp >= nextLevelXp) {
                currentXp -= nextLevelXp;
                level += 1;
                nextLevelXp = calculateNextLevelXp(level);
            }

            // Check level achievements
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

            // Level down logic
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
        <GameContext.Provider value={{ stats, addXp, removeXp, incrementQuestCount, decrementQuestCount, recentUnlocks, clearRecentUnlocks }}>
            {children}
        </GameContext.Provider>
    );
};
