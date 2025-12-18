import React from 'react';
import '../styles/XPProgress.css';

interface XPProgressProps {
    current: number;
    max: number;
    level: number;
}

export const XPProgress: React.FC<XPProgressProps> = ({ current, max, level }) => {
    const percentage = Math.min((current / max) * 100, 100);

    return (
        <div className="xp-container">
            <div className="level-badge">
                <span className="level-label">LVL</span>
                <span className="level-value">{level}</span>
            </div>
            <div className="progress-bar-wrapper">
                <div className="xp-text">
                    {current} / {max} XP
                </div>
                <div className="progress-bar-bg">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
