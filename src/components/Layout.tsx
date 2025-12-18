import React from 'react';
import { Header } from './Header';
import '../styles/Layout.css';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="app-layout">
            <Header />
            <main className="app-main">
                {children}
            </main>
        </div>
    );
};
