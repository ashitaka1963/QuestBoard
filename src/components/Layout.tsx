import React from 'react';
import { Header } from './Header';
import '../styles/Layout.css';

interface LayoutProps {
    children: React.ReactNode;
    onLoginClick?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onLoginClick }) => {
    return (
        <div className="app-layout">
            <Header onLoginClick={onLoginClick} />
            <main className="app-main">
                {children}
            </main>
        </div>
    );
};
