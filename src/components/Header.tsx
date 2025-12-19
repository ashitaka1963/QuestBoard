import React from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { XPProgress } from './XPProgress';
import { SwordIcon, UserIcon, LogoutIcon } from './Icons';
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
                    <SwordIcon size={24} />
                    <h1>QuestBoard</h1>
                </div>
            </div>

            <div className="header-right">
                <div className="header-stats">
                    <XPProgress
                        current={stats.currentXp}
                        max={stats.nextLevelXp}
                        level={stats.level}
                    />
                </div>

                <div className="auth-status">
                    {user ? (
                        <div className="user-profile-badge">
                            <div className="user-avatar" title="冒険者プロフィール">
                                <UserIcon size={18} />
                            </div>
                            <div className="user-details">
                                <span className="user-rank">冒険者</span>
                                <span className="user-name">{user.email?.split('@')[0]}</span>
                            </div>
                            <button onClick={() => signOut()} className="logout-button" title="ログアウト">
                                <LogoutIcon size={18} />
                            </button>
                        </div>
                    ) : (
                        <button onClick={onLoginClick} className="auth-button login">ログイン</button>
                    )}
                </div>
            </div>
        </header>
    );
};
