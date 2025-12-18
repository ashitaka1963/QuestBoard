import React from 'react';
import '../styles/TabNavigation.css';

interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
}

interface TabNavigationProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, onTabChange }) => {
    return (
        <nav className="tab-navigation">
            <div className="tab-list">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => onTabChange(tab.id)}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                    >
                        {tab.icon && <span className="tab-icon">{tab.icon}</span>}
                        <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
            </div>
            <div className="tab-indicator" />
        </nav>
    );
};
