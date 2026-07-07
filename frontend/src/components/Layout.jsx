import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import CreateProjectModal from './CreateProjectModal';
import CreateTaskModal from './CreateTaskModal';
import { useAuth } from '../context/AuthContext';

function Layout({ children, title }) {
  const { user } = useAuth();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', fontFamily: 'Inter, sans-serif' }}>
      <Sidebar />
      <div style={{ marginLeft: '220px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar
          title={title}
          onNewProject={() => setShowProjectModal(true)}
          onNewTask={() => setShowTaskModal(true)}
        />
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {children}
        </div>
      </div>

      {showProjectModal && (
        <CreateProjectModal
          onClose={() => setShowProjectModal(false)}
          onCreated={() => setShowProjectModal(false)}
        />
      )}
      {showTaskModal && (
        <CreateTaskModal
          onClose={() => setShowTaskModal(false)}
          onCreated={() => setShowTaskModal(false)}
        />
      )}
    </div>
  );
}

export default Layout;