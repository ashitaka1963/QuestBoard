import { useState } from 'react';
import { GameProvider } from './context/GameContext';
import { TaskProvider, useTasks } from './context/TaskContext';
import { Layout } from './components/Layout';
import { TabNavigation } from './components/TabNavigation';
import { TodayView } from './components/TodayView';
import { AllQuestsView } from './components/AllQuestsView';
import { TaskModal } from './components/TaskModal';
import { AddTaskButton } from './components/AddTaskButton';
import { TaskContextMenu } from './components/TaskContextMenu';
import type { Task } from './types';
import './App.css';

const TABS = [
  { id: 'today', label: '受注クエスト', icon: '⚔️' },
  { id: 'all', label: 'クエスト一覧', icon: '📜' },
];

interface MenuState {
  x: number;
  y: number;
  taskId: string;
}

function AppContent() {
  const { updateTask } = useTasks();
  const [activeTab, setActiveTab] = useState('today');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [targetCategoryId, setTargetCategoryId] = useState<string | undefined>(undefined);
  const [menuState, setMenuState] = useState<MenuState | null>(null);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTargetCategoryId(undefined);
    setIsModalOpen(true);
    setMenuState(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setTargetCategoryId(undefined);
  };

  const handleOpenNewTask = (categoryId?: string) => {
    setEditingTask(null);
    setTargetCategoryId(typeof categoryId === 'string' ? categoryId : undefined);
    setIsModalOpen(true);
    setMenuState(null);
  };

  const handleContextMenu = (e: React.MouseEvent, task: Task) => {
    e.preventDefault();
    setMenuState({
      x: e.clientX,
      y: e.clientY,
      taskId: task.id,
    });
  };

  const handleCloseMenu = () => {
    setMenuState(null);
  };

  const handleDateSelect = (dateType: 'today' | 'tomorrow' | 'next-week') => {
    if (!menuState) return;

    const now = new Date();
    // Helper to format YYYY-MM-DD
    const formatDate = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    let newDateStr = '';

    if (dateType === 'today') {
      newDateStr = formatDate(now);
    } else if (dateType === 'tomorrow') {
      now.setDate(now.getDate() + 1);
      newDateStr = formatDate(now);
    } else if (dateType === 'next-week') {
      now.setDate(now.getDate() + 7);
      newDateStr = formatDate(now);
    }

    updateTask(menuState.taskId, { dueDate: newDateStr });
    handleCloseMenu();
  };

  return (
    <Layout>
      <TabNavigation
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'today' && (
        <TodayView
          onEditTask={handleEditTask}
          onTaskContextMenu={handleContextMenu}
        />
      )}

      {activeTab === 'all' && (
        <AllQuestsView
          onEditTask={handleEditTask}
          onAddTask={handleOpenNewTask}
          onTaskContextMenu={handleContextMenu}
        />
      )}

      <AddTaskButton onClick={() => handleOpenNewTask()} />

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingTask={editingTask}
        initialCategoryId={targetCategoryId}
      />

      {menuState && (
        <TaskContextMenu
          x={menuState.x}
          y={menuState.y}
          onClose={handleCloseMenu}
          onSelectDate={handleDateSelect}
        />
      )}
    </Layout>
  );
}

function App() {
  return (
    <GameProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </GameProvider>
  );
}

export default App;
