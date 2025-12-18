import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UserStats } from '../types';

interface GameContextType {
    stats: UserStats;
    addXp: (amount: number) => void;
    removeXp: (amount: number) => void;
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
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [stats, setStats] = useState<UserStats>(() => {
        const saved = localStorage.getItem('questboard_stats');
        return saved ? JSON.parse(saved) : INITIAL_STATS;
    });

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

    const addXp = (amount: number) => {
        setStats(prev => {
            let { level, currentXp, nextLevelXp, totalXpEarned } = prev;

            currentXp += amount;
            totalXpEarned += amount;

            // Level up logic
            while (currentXp >= nextLevelXp) {
                currentXp -= nextLevelXp;
                level += 1;
                nextLevelXp = calculateNextLevelXp(level);
            }

            return { level, currentXp, nextLevelXp, totalXpEarned };
        });
    };

    const removeXp = (amount: number) => {
        setStats(prev => {
            let { level, currentXp, nextLevelXp, totalXpEarned } = prev;

            currentXp -= amount;
            totalXpEarned = Math.max(0, totalXpEarned - amount);

            // Level down logic if XP goes negative
            while (currentXp < 0 && level > 1) {
                level -= 1;
                const prevLevelXp = calculatePrevLevelXp(level);
                currentXp += prevLevelXp;
                nextLevelXp = calculateNextLevelXp(level);
            }

            // Ensure XP doesn't go below 0 at level 1
            if (level === 1 && currentXp < 0) {
                currentXp = 0;
            }

            return { level, currentXp, nextLevelXp, totalXpEarned };
        });
    };

    return (
        <GameContext.Provider value={{ stats, addXp, removeXp }}>
            {children}
        </GameContext.Provider>
    );
};
