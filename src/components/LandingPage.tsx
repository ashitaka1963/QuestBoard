import React, { useState } from 'react';
import { SwordIcon } from './Icons';
import { AuthModal } from './AuthModal';
import '../styles/LandingPage.css';

export const LandingPage: React.FC = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    return (
        <div className="landing-page">
            <div className="landing-overlay"></div>
            <div className="landing-content">
                <div className="landing-logo">
                    <SwordIcon size={80} />
                </div>
                <h1 className="landing-title">QuestBoard</h1>
                <p className="landing-subtitle">タスクをクエストに変え、日常を冒険にしよう。</p>

                <div className="landing-actions">
                    <button
                        className="btn-guild-enter"
                        onClick={() => setIsAuthModalOpen(true)}
                    >
                        ギルドに入る (ログイン / 登録)
                    </button>
                    <p className="landing-note">
                        ※ データの同期にはアカウント作成が必要です
                    </p>
                </div>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />

            <footer className="landing-footer">
                &copy; 2025 QuestBoard - Your Daily Adventure
            </footer>
        </div>
    );
};
