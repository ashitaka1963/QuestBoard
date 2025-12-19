import React from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { XPProgress } from './XPProgress';
import { SwordIcon } from './Icons';
import '../styles/Header.css';

interface HeaderProps {
    onLoginClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
    const { stats } = useGame();
    const { user, signOut } = useAuth();

    return (
        <header className="app-header">
            <div className="header-left">
                <div className="header-logo">
                    <SwordIcon size={28} />
                    <h1>QuestBoard</h1>
                </div>

                <div className="auth-status">
                    {user ? (
                        <div className="user-info">
                            <span className="user-email">{user.email?.split('@')[0]}</span>
                            <button onClick={() => signOut()} className="auth-button">ログアウト</button>
                        </div>
                    ) : (
                        <button onClick={onLoginClick} className="auth-button login">ログイン</button>
                    )}
                </div>
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
