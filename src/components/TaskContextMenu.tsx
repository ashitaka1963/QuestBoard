import React, { useEffect, useRef } from 'react';
import { CalendarIcon } from './Icons';
import '../styles/TaskContextMenu.css';

interface TaskContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    onSelectDate: (dateType: 'today' | 'tomorrow' | 'next-week') => void;
}

export const TaskContextMenu: React.FC<TaskContextMenuProps> = ({ x, y, onClose, onSelectDate }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleScroll = () => {
            onClose();
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('scroll', handleScroll, true);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('scroll', handleScroll, true);
        };
    }, [onClose]);

    // Adjust position if it goes off screen
    const style: React.CSSProperties = {
        top: y,
        left: x,
    };

    return (
        <div className="task-context-menu" ref={menuRef} style={style}>
            <div className="menu-header">
                <CalendarIcon size={14} />
                <span>期限を変更</span>
            </div>
            <div className="menu-divider" />
            <button className="menu-item" onClick={() => onSelectDate('today')}>
                今日
            </button>
            <button className="menu-item" onClick={() => onSelectDate('tomorrow')}>
                明日
            </button>
            <button className="menu-item" onClick={() => onSelectDate('next-week')}>
                来週
            </button>
        </div>
    );
};
