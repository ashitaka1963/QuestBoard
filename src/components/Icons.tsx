import React from 'react';
import '../styles/Icons.css';

// Sword icon for header/logo
export const SwordIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="icon icon-sword">
        <path d="M19.5 2L21 3.5L18.5 6L15.5 3L18 0.5L19.5 2Z" fill="currentColor" />
        <path d="M17 7L6 18L5 19L3 21L2 20L4 18L5 17L16 6L17 7Z" fill="currentColor" />
        <path d="M6 18L5 19L3 21L2 20L4 18L5 17L6 18Z" fill="currentColor" opacity="0.7" />
    </svg>
);

// Shield/star icon for XP
export const StarIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="icon icon-star">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
    </svg>
);

// Quest scroll icon
export const ScrollIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="icon icon-scroll">
        <path d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M7 7H17M7 11H17M7 15H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

// Folder icon for categories  
export const FolderIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="icon icon-folder">
        <path d="M3 6C3 4.9 3.9 4 5 4H9L11 6H19C20.1 6 21 6.9 21 8V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Calendar icon
export const CalendarIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="icon icon-calendar">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

// Checkmark icon
export const CheckIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="icon icon-check">
        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Edit (pencil) icon
export const EditIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="icon icon-edit">
        <path d="M11 4H4C2.9 4 2 4.9 2 6V20C2 21.1 2.9 22 4 22H18C19.1 22 20 21.1 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M18.5 2.5C19.3 1.7 20.7 1.7 21.5 2.5C22.3 3.3 22.3 4.7 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" fill="currentColor" />
    </svg>
);

// Delete (trash) icon
export const DeleteIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="icon icon-delete">
        <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 6V4C8 3.4 8.4 3 9 3H15C15.6 3 16 3.4 16 4V6M19 6V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

// Plus icon
export const PlusIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="icon icon-plus">
        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
);

// Drag handle icon
export const DragIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="icon icon-drag">
        <circle cx="9" cy="6" r="1.5" fill="currentColor" />
        <circle cx="15" cy="6" r="1.5" fill="currentColor" />
        <circle cx="9" cy="12" r="1.5" fill="currentColor" />
        <circle cx="15" cy="12" r="1.5" fill="currentColor" />
        <circle cx="9" cy="18" r="1.5" fill="currentColor" />
        <circle cx="15" cy="18" r="1.5" fill="currentColor" />
    </svg>
);

// Trophy icon for completed
export const TrophyIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="icon icon-trophy">
        <path d="M12 15C15.3 15 18 12.3 18 9V3H6V9C6 12.3 8.7 15 12 15Z" fill="currentColor" />
        <path d="M18 5H21V8C21 9.7 19.7 11 18 11V5Z" fill="currentColor" opacity="0.7" />
        <path d="M6 5H3V8C3 9.7 4.3 11 6 11V5Z" fill="currentColor" opacity="0.7" />
        <path d="M9 18H15V21H9V18Z" fill="currentColor" />
        <path d="M12 15V18" stroke="currentColor" strokeWidth="2" />
    </svg>
);

// Inbox icon
export const InboxIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="icon icon-inbox">
        <path d="M22 12H16L14 15H10L8 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M5.45 5.11L2 12V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V12L18.55 5.11C18.21 4.43 17.52 4 16.76 4H7.24C6.48 4 5.79 4.43 5.45 5.11Z" stroke="currentColor" strokeWidth="2" />
    </svg>
);

// Flame icon for motivation/streak
export const FlameIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="icon icon-flame">
        <path d="M12 23C16.4183 23 20 19.4183 20 15C20 10 16 8 16 8C16 8 17.5 11 16 13C16 13 18.5 10 14 5C14 5 15.5 8 13 9.5C13 9.5 14.5 9 13 7C13 7 9.5 10 9.5 13C9.5 14.5 11 15 11 15C11 15 8 15 8 17C8 20.3137 10.6863 23 12 23Z" fill="currentColor" />
        <path d="M12 19C13.1046 19 14 18.1046 14 17C14 15.8954 13.1046 15 12 15C10.8954 15 10 15.8954 10 17C10 18.1046 10.8954 19 12 19Z" fill="currentColor" style={{ mixBlendMode: 'screen', opacity: 0.5 }} />
    </svg>
);
// User icon
export const UserIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="icon icon-user">
        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
// Logout icon
export const LogoutIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="icon icon-logout">
        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
// Close/X icon
export const CloseIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="icon icon-close">
        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
