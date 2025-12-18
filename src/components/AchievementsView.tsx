import React from 'react';
import { useGame, ACHIEVEMENTS } from '../context/GameContext';
import '../styles/AchievementsView.css';

export const AchievementsView: React.FC = () => {
    const { stats } = useGame();

    return (
        <section className="achievements-view">
            <h2 className="section-title">🏆 実績</h2>
            <div className="achievements-grid">
                {ACHIEVEMENTS.map(achievement => {
                    const isUnlocked = stats.unlockedAchievements.includes(achievement.id);

                    return (
                        <div key={achievement.id} className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
                            <div className="achievement-icon">
                                {isUnlocked ? achievement.icon : '?'}
                            </div>
                            <div className="achievement-content">
                                <h3>{isUnlocked ? achievement.title : '???'}</h3>
                                <p>{isUnlocked ? achievement.description : '条件を満たして解除しよう'}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
