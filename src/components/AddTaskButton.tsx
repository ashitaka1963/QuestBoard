import React from 'react';
import { PlusIcon } from './Icons';
import '../styles/AddTaskButton.css';

interface AddTaskButtonProps {
    onClick: () => void;
}

export const AddTaskButton: React.FC<AddTaskButtonProps> = ({ onClick }) => {
    return (
        <button className="add-task-btn" onClick={onClick} aria-label="Add new task">
            <PlusIcon size={24} />
        </button>
    );
};
