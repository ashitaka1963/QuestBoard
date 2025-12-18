import React from 'react';
import { useGame } from '../context/GameContext';
import { useTasks } from '../context/TaskContext';
import { TrophyIcon, FlameIcon, CheckIcon } from './Icons';
import '../styles/DashboardView.css';

export const DashboardView: React.FC = () => {
    const { stats } = useGame();
    const { tasks } = useTasks();

    // Calculate weekly stats (mock implementation for now since we don't track history efficiently yet)
    // Ideally we would aggregate stats from completed tasks history
    // For now, let's show simple stats based on current state

    const completedTasks = tasks.filter(t => t.status === 'done');
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

    // Helper to get day name
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    const today = new Date().getDay();

    // Mock data for the weekly chart (visual only for prototype)
    const weeklyData = [
        { day: days[(today + 1) % 7], value: 30 },
        { day: days[(today + 2) % 7], value: 45 },
        { day: days[(today + 3) % 7], value: 20 },
        { day: days[(today + 4) % 7], value: 60 },
        { day: days[(today + 5) % 7], value: 40 },
        { day: days[(today + 6) % 7], value: 80 },
        { day: days[today], value: stats.currentXp > 100 ? 100 : stats.currentXp, isToday: true },
    ];

    return (
        <section className="dashboard-view">
            <h2 className="dashboard-title">
                <TrophyIcon size={24} /> 冒険の記録
            </h2>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon xp">XP</div>
                    <div className="stat-value">{stats.totalXpEarned.toLocaleString()}</div>
                    <div className="stat-label">総獲得経験値</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon quests"><CheckIcon size={20} /></div>
                    <div className="stat-value">{stats.questsCompleted}</div>
                    <div className="stat-label">クリアクエスト数</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon rate">%</div>
                    <div className="stat-value">{completionRate}%</div>
                    <div className="stat-label">クエスト完了率</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon level">Lv</div>
                    <div className="stat-value">{stats.level}</div>
                    <div className="stat-label">現在のレベル</div>
                </div>
            </div>

            <div className="chart-section">
                <h3>週間アクティビティ (獲得XP)</h3>
                <div className="bar-chart">
                    {weeklyData.map((data, index) => (
                        <div key={index} className={`chart-col ${data.isToday ? 'today' : ''}`}>
                            <div className="bar-track">
                                <div
                                    className="bar-fill"
                                    style={{ height: `${data.value}%` }}
                                    title={`${data.value} XP`}
                                />
                            </div>
                            <span className="chart-label">{data.day}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="motivation-quote">
                <FlameIcon size={20} />
                <p>
                    「小さな一歩の積み重ねが、偉大な冒険への道となる。」
                </p>
            </div>
        </section>
    );
};
