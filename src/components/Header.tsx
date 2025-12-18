import React from 'react';
import { useGame } from '../context/GameContext';
import { XPProgress } from './XPProgress';
import { SwordIcon } from './Icons';
import '../styles/Header.css';

export const Header: React.FC = () => {
    const { stats } = useGame();

    return (
        <header className="app-header">
            <div className="header-logo">
                <SwordIcon size={28} />
                <h1>QuestBoard</h1>
            </div>
            <div className="header-stats">
                <XPProgress
                    current={stats.currentXp}
                    max={stats.nextLevelXp}
                    level={stats.level}
                />
            </div>
        </header>
    );
};
